/// <reference types="@webgpu/types" />
import {
  ACT_TAU_MS,
  DELAY_MS,
  GPU_DT_MS,
  INPUT_RATE_HZ,
  INPUT_W_MV,
  TAU_M_MS,
  TAU_SYN_MS,
  T_REF_MS,
  V_RESET,
  V_REST,
  V_TH,
  stepsFor,
} from './params'

const FIXED_SCALE = 1024
const MAX_BATCH = 160

const SHADER = /* wgsl */ `
struct Neuron {
  v: f32,
  g: f32,
  activity: f32,
  refr: i32,
  fired: u32,
}

struct Params {
  n: u32,
  step: u32,
  delay_steps: u32,
  ring: u32,
  ref_steps: u32,
  seed: u32,
  dt_over_tau: f32,
  decay_syn: f32,
  act_decay: f32,
  v_rest: f32,
  v_reset: f32,
  v_th: f32,
  input_w: f32,
  input_p: f32,
  inv_scale: f32,
}

@group(0) @binding(0) var<storage, read> csr: array<u32>;
@group(0) @binding(1) var<storage, read> post: array<u32>;
@group(0) @binding(2) var<storage, read> w_fixed: array<i32>;
@group(0) @binding(3) var<storage, read_write> state: array<Neuron>;
@group(0) @binding(4) var<storage, read_write> delay: array<atomic<i32>>;
@group(0) @binding(5) var<storage, read> drive: array<u32>;
@group(0) @binding(6) var<storage, read_write> spikes: array<u32>;
@group(0) @binding(7) var<storage, read> params: Params;

fn rand(i: u32) -> f32 {
  var x = params.seed ^ (params.step * 747796405u + i * 2891336453u);
  x = x ^ (x >> 16u);
  x = x * 2246822519u;
  x = x ^ (x >> 13u);
  x = x * 3266489917u;
  x = x ^ (x >> 16u);
  return f32(x) / 4294967296.0;
}

@compute @workgroup_size(64)
fn integrate(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= params.n) { return; }
  var neuron = state[i];
  var g = neuron.g;
  if (drive[i] == 1u && rand(i) < params.input_p) {
    g = g + params.input_w;
  }
  let slot = params.step % params.ring;
  let di = slot * params.n + i;
  let incoming = f32(atomicLoad(&delay[di])) * params.inv_scale;
  atomicStore(&delay[di], 0);
  g = g * params.decay_syn + incoming;
  neuron.g = g;
  neuron.activity = neuron.activity * params.act_decay;
  neuron.fired = 0u;
  if (neuron.refr > 0) {
    neuron.refr = neuron.refr - 1;
    state[i] = neuron;
    return;
  }
  var v = neuron.v + params.dt_over_tau * (params.v_rest - neuron.v + g);
  if (v >= params.v_th) {
    v = params.v_reset;
    neuron.refr = i32(params.ref_steps);
    neuron.fired = 1u;
    spikes[i] = spikes[i] + 1u;
    neuron.activity = min(1.0, neuron.activity + 0.85);
  }
  neuron.v = v;
  state[i] = neuron;
}

@compute @workgroup_size(64)
fn scatter(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x;
  if (i >= params.n || state[i].fired == 0u) { return; }
  let future = (params.step + params.delay_steps) % params.ring;
  let base = future * params.n;
  let start = csr[i];
  let end = csr[i + 1u];
  for (var e = start; e < end; e = e + 1u) {
    atomicAdd(&delay[base + post[e]], w_fixed[e]);
  }
}
`

export interface GpuFrame {
  activity: Uint8Array
  spikes: Uint16Array
}

export class GpuSim {
  readonly dtMs = GPU_DT_MS
  private readonly n: number
  private readonly device: GPUDevice
  private readonly integrate: GPUComputePipeline
  private readonly scatter: GPUComputePipeline
  private readonly bind: GPUBindGroup
  private readonly paramsBuf: GPUBuffer
  private readonly paramsScratch: ArrayBuffer
  private readonly align: number
  private readonly stateBuf: GPUBuffer
  private readonly spikeBuf: GPUBuffer
  private readonly zeroSpikes: GPUBuffer
  private readonly delayBuf: GPUBuffer
  private readonly driveBuf: GPUBuffer
  private readonly stageState: GPUBuffer
  private readonly stageSpikes: GPUBuffer
  private readonly stateInit: ArrayBuffer
  private stepIndex = 0
  private seed = 1

  private constructor(opts: {
    n: number
    device: GPUDevice
    integrate: GPUComputePipeline
    scatter: GPUComputePipeline
    bind: GPUBindGroup
    paramsBuf: GPUBuffer
    align: number
    stateBuf: GPUBuffer
    spikeBuf: GPUBuffer
    zeroSpikes: GPUBuffer
    delayBuf: GPUBuffer
    driveBuf: GPUBuffer
    stageState: GPUBuffer
    stageSpikes: GPUBuffer
    stateInit: ArrayBuffer
  }) {
    this.n = opts.n
    this.device = opts.device
    this.integrate = opts.integrate
    this.scatter = opts.scatter
    this.bind = opts.bind
    this.paramsBuf = opts.paramsBuf
    this.align = opts.align
    this.paramsScratch = new ArrayBuffer(opts.align * MAX_BATCH)
    this.stateBuf = opts.stateBuf
    this.spikeBuf = opts.spikeBuf
    this.zeroSpikes = opts.zeroSpikes
    this.delayBuf = opts.delayBuf
    this.driveBuf = opts.driveBuf
    this.stageState = opts.stageState
    this.stageSpikes = opts.stageSpikes
    this.stateInit = opts.stateInit
  }

  static async create(
    csr: Uint32Array,
    post: Uint16Array,
    w: Float32Array,
  ): Promise<GpuSim | null> {
    const gpu = navigator.gpu
    if (!gpu) return null
    try {
      const adapter = await gpu.requestAdapter()
      if (!adapter) return null
      const align = adapter.limits.minStorageBufferOffsetAlignment
      const device = await adapter.requestDevice()
      const n = csr.length - 1
      const module = device.createShaderModule({ code: SHADER })
      const layout = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
          { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
          { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
          { binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
          {
            binding: 7,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: 'read-only-storage', hasDynamicOffset: true },
          },
        ],
      })
      const pipe = device.createPipelineLayout({ bindGroupLayouts: [layout] })
      const integrate = await device.createComputePipelineAsync({
        layout: pipe,
        compute: { module, entryPoint: 'integrate' },
      })
      const scatter = await device.createComputePipelineAsync({
        layout: pipe,
        compute: { module, entryPoint: 'scatter' },
      })

      const post32 = new Uint32Array(post.length)
      for (let i = 0; i < post.length; i++) post32[i] = post[i]
      const wFixed = new Int32Array(w.length)
      for (let i = 0; i < w.length; i++) wFixed[i] = Math.round(w[i] * FIXED_SCALE)

      const delaySteps = stepsFor(DELAY_MS, GPU_DT_MS)
      const ring = delaySteps + 1
      const stateInit = initialState(n)
      const stateBuf = buffer(device, stateInit, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST)
      const spikeBytes = n * 4
      const spikeBuf = device.createBuffer({
        size: spikeBytes,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      })
      const zeroSpikes = device.createBuffer({ size: spikeBytes, usage: GPUBufferUsage.COPY_SRC })
      const delayBuf = device.createBuffer({
        size: ring * n * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
      const driveBuf = device.createBuffer({
        size: n * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
      const paramsBuf = device.createBuffer({
        size: align * MAX_BATCH,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
      const stageState = device.createBuffer({
        size: stateInit.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      })
      const stageSpikes = device.createBuffer({
        size: spikeBytes,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      })

      const bind = device.createBindGroup({
        layout,
        entries: [
          { binding: 0, resource: { buffer: buffer(device, csr, GPUBufferUsage.STORAGE) } },
          { binding: 1, resource: { buffer: buffer(device, post32, GPUBufferUsage.STORAGE) } },
          { binding: 2, resource: { buffer: buffer(device, wFixed, GPUBufferUsage.STORAGE) } },
          { binding: 3, resource: { buffer: stateBuf } },
          { binding: 4, resource: { buffer: delayBuf } },
          { binding: 5, resource: { buffer: driveBuf } },
          { binding: 6, resource: { buffer: spikeBuf } },
          { binding: 7, resource: { buffer: paramsBuf, size: align } },
        ],
      })

      return new GpuSim({
        n,
        device,
        integrate,
        scatter,
        bind,
        paramsBuf,
        align,
        stateBuf,
        spikeBuf,
        zeroSpikes,
        delayBuf,
        driveBuf,
        stageState,
        stageSpikes,
        stateInit,
      })
    } catch {
      return null
    }
  }

  setDrive(mask: Uint8Array): void {
    const u = new Uint32Array(this.n)
    for (let i = 0; i < this.n; i++) u[i] = mask[i] ? 1 : 0
    this.device.queue.writeBuffer(this.driveBuf, 0, u)
  }

  destroy(): void {
    this.device.destroy()
  }

  reset(): void {
    this.stepIndex = 0
    this.seed = (this.seed + 1) >>> 0
    this.device.queue.writeBuffer(this.stateBuf, 0, this.stateInit)
    this.device.queue.writeBuffer(this.spikeBuf, 0, new Uint8Array(this.n * 4))
    this.device.queue.writeBuffer(this.delayBuf, 0, new Uint8Array(this.delayBuf.size))
  }

  /** Record `steps` of 0.1 ms and submit them as one batch. */
  run(steps: number): void {
    const groups = Math.ceil(this.n / 64)
    let left = steps
    while (left > 0) {
      const batch = Math.min(left, MAX_BATCH)
      const scratch = new DataView(this.paramsScratch)
      for (let s = 0; s < batch; s++) {
        writeParams(scratch, s * this.align, this.n, this.stepIndex + s, this.seed)
      }
      this.device.queue.writeBuffer(this.paramsBuf, 0, this.paramsScratch, 0, batch * this.align)
      const enc = this.device.createCommandEncoder()
      for (let s = 0; s < batch; s++) {
        const offset = s * this.align
        const pass = enc.beginComputePass()
        pass.setPipeline(this.integrate)
        pass.setBindGroup(0, this.bind, [offset])
        pass.dispatchWorkgroups(groups)
        pass.end()
        const pass2 = enc.beginComputePass()
        pass2.setPipeline(this.scatter)
        pass2.setBindGroup(0, this.bind, [offset])
        pass2.dispatchWorkgroups(groups)
        pass2.end()
      }
      this.device.queue.submit([enc.finish()])
      this.stepIndex += batch
      left -= batch
    }
  }

  async readFrame(): Promise<GpuFrame> {
    const enc = this.device.createCommandEncoder()
    enc.copyBufferToBuffer(this.stateBuf, 0, this.stageState, 0, this.stateInit.byteLength)
    enc.copyBufferToBuffer(this.spikeBuf, 0, this.stageSpikes, 0, this.n * 4)
    enc.copyBufferToBuffer(this.zeroSpikes, 0, this.spikeBuf, 0, this.n * 4)
    this.device.queue.submit([enc.finish()])
    await this.stageState.mapAsync(GPUMapMode.READ)
    await this.stageSpikes.mapAsync(GPUMapMode.READ)
    const state = new Float32Array(this.stageState.getMappedRange().slice(0))
    const spike32 = new Uint32Array(this.stageSpikes.getMappedRange().slice(0))
    this.stageState.unmap()
    this.stageSpikes.unmap()
    const activity = new Uint8Array(this.n)
    const spikes = new Uint16Array(this.n)
    for (let i = 0; i < this.n; i++) {
      const a = state[i * 5 + 2]
      activity[i] = Math.round(Math.min(1, Math.max(0, a)) * 255)
      spikes[i] = Math.min(65535, spike32[i])
    }
    return { activity, spikes }
  }
}

function initialState(n: number): ArrayBuffer {
  const buf = new ArrayBuffer(n * 20)
  const f = new Float32Array(buf)
  for (let i = 0; i < n; i++) f[i * 5] = V_REST
  return buf
}

function buffer(device: GPUDevice, data: ArrayBuffer | ArrayBufferView, usage: number): GPUBuffer {
  const copy =
    data instanceof ArrayBuffer
      ? data
      : data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
        ? data.buffer
        : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
  const gpu = device.createBuffer({
    size: Math.max(4, copy.byteLength),
    usage: usage | GPUBufferUsage.COPY_DST,
    mappedAtCreation: false,
  })
  device.queue.writeBuffer(gpu, 0, copy)
  return gpu
}

function writeParams(view: DataView, offset: number, n: number, step: number, seed: number): void {
  const delaySteps = stepsFor(DELAY_MS, GPU_DT_MS)
  view.setUint32(offset + 0, n, true)
  view.setUint32(offset + 4, step, true)
  view.setUint32(offset + 8, delaySteps, true)
  view.setUint32(offset + 12, delaySteps + 1, true)
  view.setUint32(offset + 16, stepsFor(T_REF_MS, GPU_DT_MS), true)
  view.setUint32(offset + 20, seed, true)
  view.setFloat32(offset + 24, GPU_DT_MS / TAU_M_MS, true)
  view.setFloat32(offset + 28, Math.exp(-GPU_DT_MS / TAU_SYN_MS), true)
  view.setFloat32(offset + 32, Math.exp(-GPU_DT_MS / ACT_TAU_MS), true)
  view.setFloat32(offset + 36, V_REST, true)
  view.setFloat32(offset + 40, V_RESET, true)
  view.setFloat32(offset + 44, V_TH, true)
  view.setFloat32(offset + 48, INPUT_W_MV, true)
  view.setFloat32(offset + 52, INPUT_RATE_HZ * GPU_DT_MS * 0.001, true)
  view.setFloat32(offset + 56, 1 / FIXED_SCALE, true)
}
