// AssemblyScript port of LifSim.step (src/flybrain/lif.ts). Arithmetic runs in
// f64 and state is stored as f32/i16/u16, exactly like the JS typed arrays, so
// results match the reference engine for the same seed.
// The host writes csr/post/w/drive through the pointer getters below, then calls step().

let n: i32 = 0
let ring: i32 = 0
let delaySteps: i32 = 0
let refSteps: i32 = 0
let stepIndex: i32 = 0
let rngState: u32 = 0

let decay: f64 = 0
let dtOverTau: f64 = 0
let actDecay: f64 = 0
let inputP: f64 = 0
let inputW: f64 = 0
let vRest: f64 = 0
let vReset: f64 = 0
let vTh: f64 = 0

let csr: usize = 0
let post: usize = 0
let w: usize = 0
let drive: usize = 0
let v: usize = 0
let g: usize = 0
let refr: usize = 0
let delay: usize = 0
let spikes: usize = 0
let act: usize = 0

export function init(
  neurons: i32,
  edges: i32,
  delaySteps_: i32,
  refSteps_: i32,
  decay_: f64,
  dtOverTau_: f64,
  actDecay_: f64,
  inputP_: f64,
  inputW_: f64,
  vRest_: f64,
  vReset_: f64,
  vTh_: f64,
  seed: u32,
): void {
  n = neurons
  delaySteps = delaySteps_
  refSteps = refSteps_
  ring = delaySteps_ + 1
  decay = decay_
  dtOverTau = dtOverTau_
  actDecay = actDecay_
  inputP = inputP_
  inputW = inputW_
  vRest = vRest_
  vReset = vReset_
  vTh = vTh_
  rngState = seed

  csr = heap.alloc(<usize>(neurons + 1) << 2)
  post = heap.alloc(<usize>edges << 1)
  w = heap.alloc(<usize>edges << 2)
  drive = heap.alloc(<usize>neurons)
  v = heap.alloc(<usize>neurons << 2)
  g = heap.alloc(<usize>neurons << 2)
  refr = heap.alloc(<usize>neurons << 1)
  delay = heap.alloc((<usize>ring * <usize>neurons) << 2)
  spikes = heap.alloc(<usize>neurons << 1)
  act = heap.alloc(<usize>neurons << 2)
  reset()
  memory.fill(drive, 0, <usize>neurons)
}

export function csrPtr(): usize { return csr }
export function postPtr(): usize { return post }
export function wPtr(): usize { return w }
export function drivePtr(): usize { return drive }
export function spikesPtr(): usize { return spikes }
export function actPtr(): usize { return act }

export function reset(): void {
  for (let i = 0; i < n; i++) store<f32>(v + (<usize>i << 2), <f32>vRest)
  memory.fill(g, 0, <usize>n << 2)
  memory.fill(refr, 0, <usize>n << 1)
  memory.fill(delay, 0, (<usize>ring * <usize>n) << 2)
  memory.fill(spikes, 0, <usize>n << 1)
  memory.fill(act, 0, <usize>n << 2)
  stepIndex = 0
}

export function clearSpikes(): void {
  memory.fill(spikes, 0, <usize>n << 1)
}

// mulberry32, same recurrence as src/flybrain/rng.ts.
function rand(): f64 {
  rngState += 0x6d2b79f5
  const t = rngState
  let x: u32 = (t ^ (t >>> 15)) * (1 | t)
  x = (x + (x ^ (x >>> 7)) * (61 | x)) ^ x
  return <f64>(x ^ (x >>> 14)) / 4294967296.0
}

export function step(count: i32): void {
  for (let s = 0; s < count; s++) {
    const read = <usize>(stepIndex % ring) * <usize>n
    const future = <usize>((stepIndex + delaySteps) % ring) * <usize>n
    for (let i = 0; i < n; i++) {
      const i4 = <usize>i << 2
      const i2 = <usize>i << 1
      let gi = <f64>load<f32>(g + i4)
      if (load<u8>(drive + <usize>i) != 0 && rand() < inputP) gi += inputW
      const slot = delay + ((read + <usize>i) << 2)
      gi = gi * decay + <f64>load<f32>(slot)
      store<f32>(slot, 0)
      store<f32>(g + i4, <f32>gi)
      store<f32>(act + i4, <f32>(<f64>load<f32>(act + i4) * actDecay))
      const r = load<i16>(refr + i2)
      if (r > 0) {
        store<i16>(refr + i2, r - 1)
        continue
      }
      const vi0 = <f64>load<f32>(v + i4)
      let vi = vi0 + dtOverTau * (vRest - vi0 + gi)
      if (vi >= vTh) {
        vi = vReset
        store<i16>(refr + i2, <i16>refSteps)
        store<u16>(spikes + i2, load<u16>(spikes + i2) + 1)
        const a = <f64>load<f32>(act + i4) + 0.85
        store<f32>(act + i4, <f32>(a < 1.0 ? a : 1.0))
        const from = load<u32>(csr + i4)
        const to = load<u32>(csr + i4 + 4)
        for (let e = from; e < to; e++) {
          const target = delay + ((future + <usize>load<u16>(post + (<usize>e << 1))) << 2)
          store<f32>(
            target,
            <f32>(<f64>load<f32>(target) + <f64>load<f32>(w + (<usize>e << 2))),
          )
        }
      }
      store<f32>(v + i4, <f32>vi)
    }
    stepIndex++
  }
}
