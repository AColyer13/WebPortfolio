import { GpuSim } from './gpu'
import { LifSim } from './lif'
import { JS_DT_MS } from './params'
import type { ToMain, ToWorker } from './protocol'

interface Engine {
  dtMs: number
  backend: 'webgpu' | 'js'
  setDrive(mask: Uint8Array): void
  reset(): void
  run(steps: number): void
  takeFrame():
    | { activity: Uint8Array; spikes: Uint16Array }
    | Promise<{ activity: Uint8Array; spikes: Uint16Array }>
}

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<ToWorker>) => void) | null
  postMessage: (data: ToMain, transfer?: Transferable[]) => void
}

let engine: Engine | null = null
let running = false
let timer: ReturnType<typeof setTimeout> | null = null
let debt = 0
let last = 0
let frameSim = 0
let reading = false

function post(data: ToMain, transfer?: Transferable[]) {
  scope.postMessage(data, transfer)
}

function jsEngine(csr: Uint32Array, postIdx: Uint16Array, w: Float32Array): Engine {
  const js = new LifSim({ csr, post: postIdx, w, dtMs: JS_DT_MS, seed: 1 })
  return {
    dtMs: JS_DT_MS,
    backend: 'js',
    setDrive: (mask) => js.setDrive(mask),
    reset: () => js.reset(),
    run: (steps) => js.step(steps),
    takeFrame: () => ({ activity: js.activityBytes(), spikes: js.takeSpikes() }),
  }
}

function loop() {
  timer = null
  if (!engine || !running || reading) {
    if (running) timer = setTimeout(loop, 32)
    return
  }
  const now = performance.now()
  const wall = last === 0 ? 16 : Math.min(50, now - last)
  last = now
  debt = Math.min(40, debt + wall)
  const cap = engine.backend === 'webgpu' ? 160 : 40
  const steps = Math.min(cap, Math.floor(debt / engine.dtMs))
  if (steps > 0) {
    engine.run(steps)
    debt -= steps * engine.dtMs
    frameSim += steps * engine.dtMs
  }
  if (frameSim >= 80) {
    reading = true
    const simMs = frameSim
    frameSim = 0
    void Promise.resolve(engine.takeFrame())
      .then((frame) => {
        reading = false
        post(
          { type: 'frame', activity: frame.activity, spikes: frame.spikes, simMs },
          [frame.activity.buffer, frame.spikes.buffer],
        )
      })
      .catch(() => {
        reading = false
        post({ type: 'error', message: 'The simulation stopped.' })
        running = false
      })
  }
  timer = setTimeout(loop, Math.max(0, 16 - (performance.now() - now)))
}

scope.onmessage = (event) => {
  const msg = event.data
  if (msg.type === 'init') {
    void start(msg.csr, msg.post, msg.w)
    return
  }
  if (!engine) return
  if (msg.type === 'drive') engine.setDrive(msg.mask)
  else if (msg.type === 'reset') {
    engine.reset()
    debt = 0
    frameSim = 0
  } else if (msg.type === 'run') {
    running = msg.running
    last = 0
    if (running && timer === null) loop()
    if (!running && timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }
}

async function start(csr: Uint32Array, postIdx: Uint16Array, w: Float32Array) {
  const pending = GpuSim.create(csr, postIdx, w)
  const gpu = await Promise.race([
    pending,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
  ])
  if (engine) {
    gpu?.destroy()
    return
  }
  engine = gpu
    ? {
        dtMs: gpu.dtMs,
        backend: 'webgpu',
        setDrive: (mask) => gpu.setDrive(mask),
        reset: () => gpu.reset(),
        run: (steps) => gpu.run(steps),
        takeFrame: () => gpu.readFrame(),
      }
    : jsEngine(csr, postIdx, w)
  post({ type: 'ready', backend: engine.backend, dtMs: engine.dtMs })
  void pending.then((late) => {
    if (late && late !== gpu) late.destroy()
  })
}
