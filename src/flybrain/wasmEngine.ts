import {
  ACT_TAU_MS,
  DELAY_MS,
  INPUT_RATE_HZ,
  INPUT_W_MV,
  TAU_M_MS,
  TAU_SYN_MS,
  T_REF_MS,
  V_REST,
  V_RESET,
  V_TH,
  stepsFor,
} from './params'
import type { LifInit } from './lif'

interface LifExports {
  memory: WebAssembly.Memory
  init(
    neurons: number,
    edges: number,
    delaySteps: number,
    refSteps: number,
    decay: number,
    dtOverTau: number,
    actDecay: number,
    inputP: number,
    inputW: number,
    vRest: number,
    vReset: number,
    vTh: number,
    seed: number,
  ): void
  csrPtr(): number
  postPtr(): number
  wPtr(): number
  drivePtr(): number
  spikesPtr(): number
  actPtr(): number
  reset(): void
  clearSpikes(): void
  step(count: number): void
}

/**
 * Compile straight from the network response when the server sends
 * `application/wasm`; otherwise fall back to buffering the bytes first.
 */
export async function compileLif(url: string | URL): Promise<WebAssembly.Module> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load the simulation module (${response.status})`)
  if (typeof WebAssembly.compileStreaming === 'function') {
    try {
      return await WebAssembly.compileStreaming(response.clone())
    } catch {
      // Wrong MIME type or streaming unsupported for this response: use the bytes.
    }
  }
  return WebAssembly.compile(await response.arrayBuffer())
}

/** Same surface as LifSim, backed by the WebAssembly kernel in assembly/lif.ts. */
export class WasmLifSim {
  readonly n: number
  readonly dtMs: number
  private readonly exports: LifExports
  private readonly drive: Uint8Array
  private readonly spikes: Uint16Array
  private readonly activity: Float32Array

  private constructor(exports: LifExports, init: LifInit) {
    this.exports = exports
    this.n = init.csr.length - 1
    this.dtMs = init.dtMs
    const edges = init.post.length
    exports.init(
      this.n,
      edges,
      stepsFor(DELAY_MS, init.dtMs),
      stepsFor(T_REF_MS, init.dtMs),
      Math.exp(-init.dtMs / TAU_SYN_MS),
      init.dtMs / TAU_M_MS,
      Math.exp(-init.dtMs / ACT_TAU_MS),
      INPUT_RATE_HZ * init.dtMs * 0.001,
      INPUT_W_MV,
      V_REST,
      V_RESET,
      V_TH,
      (init.seed ?? 1) >>> 0,
    )
    // init() may grow memory, so take views only after allocation.
    const buffer = exports.memory.buffer
    new Uint32Array(buffer, exports.csrPtr(), init.csr.length).set(init.csr)
    new Uint16Array(buffer, exports.postPtr(), edges).set(init.post)
    new Float32Array(buffer, exports.wPtr(), edges).set(init.w)
    this.drive = new Uint8Array(buffer, exports.drivePtr(), this.n)
    this.spikes = new Uint16Array(buffer, exports.spikesPtr(), this.n)
    this.activity = new Float32Array(buffer, exports.actPtr(), this.n)
  }

  static async create(module: WebAssembly.Module, init: LifInit): Promise<WasmLifSim> {
    const instance = await WebAssembly.instantiate(module, {})
    return new WasmLifSim(instance.exports as unknown as LifExports, init)
  }

  setDrive(mask: Uint8Array): void {
    this.drive.set(mask)
  }

  reset(): void {
    this.exports.reset()
  }

  step(count: number): void {
    this.exports.step(count)
  }

  /** Spike counts since the last call, then cleared. */
  takeSpikes(): Uint16Array {
    const out = this.spikes.slice()
    this.exports.clearSpikes()
    return out
  }

  activityBytes(): Uint8Array {
    const out = new Uint8Array(this.n)
    const activity = this.activity
    for (let i = 0; i < this.n; i++) out[i] = Math.round(activity[i] * 255)
    return out
  }
}
