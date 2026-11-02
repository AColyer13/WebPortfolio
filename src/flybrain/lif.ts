import {
  ACT_TAU_MS,
  INPUT_RATE_HZ,
  INPUT_W_MV,
  TAU_M_MS,
  TAU_SYN_MS,
  T_REF_MS,
  V_RESET,
  V_REST,
  V_TH,
  DELAY_MS,
  stepsFor,
} from './params'
import { mulberry32 } from './rng'

export interface LifInit {
  csr: Uint32Array
  post: Uint16Array
  /** Signed synaptic weights in mV, already scaled by W_syn. */
  w: Float32Array
  dtMs: number
  seed?: number
}

/**
 * Leaky integrate-and-fire with the Shiu et al. 2024 equations:
 *   dg/dt = -g / tau_syn
 *   dv/dt = (v_rest - v + g) / tau_m
 * A spike adds w onto g after `delay`, then the cell is refractory.
 */
export class LifSim {
  readonly n: number
  readonly dtMs: number
  readonly delaySteps: number
  readonly refSteps: number
  private readonly decaySyn: number
  private readonly dtOverTau: number
  private readonly actDecay: number
  private readonly inputP: number
  private readonly ring: number
  private readonly csr: Uint32Array
  private readonly post: Uint16Array
  private readonly w: Float32Array
  private readonly v: Float32Array
  private readonly g: Float32Array
  private readonly refr: Int16Array
  private readonly delay: Float32Array
  private readonly drive: Uint8Array
  private readonly spikes: Uint16Array
  private readonly activity: Float32Array
  private readonly rand: () => number
  private stepIndex = 0

  constructor(init: LifInit) {
    this.n = init.csr.length - 1
    this.dtMs = init.dtMs
    this.delaySteps = stepsFor(DELAY_MS, init.dtMs)
    this.refSteps = stepsFor(T_REF_MS, init.dtMs)
    this.ring = this.delaySteps + 1
    this.decaySyn = Math.exp(-init.dtMs / TAU_SYN_MS)
    this.dtOverTau = init.dtMs / TAU_M_MS
    this.actDecay = Math.exp(-init.dtMs / ACT_TAU_MS)
    this.inputP = INPUT_RATE_HZ * init.dtMs * 0.001
    this.csr = init.csr
    this.post = init.post
    this.w = init.w
    this.v = new Float32Array(this.n).fill(V_REST)
    this.g = new Float32Array(this.n)
    this.refr = new Int16Array(this.n)
    this.delay = new Float32Array(this.ring * this.n)
    this.drive = new Uint8Array(this.n)
    this.spikes = new Uint16Array(this.n)
    this.activity = new Float32Array(this.n)
    this.rand = mulberry32(init.seed ?? 1)
  }

  setDrive(mask: Uint8Array): void {
    this.drive.set(mask)
  }

  reset(): void {
    this.v.fill(V_REST)
    this.g.fill(0)
    this.refr.fill(0)
    this.delay.fill(0)
    this.spikes.fill(0)
    this.activity.fill(0)
    this.stepIndex = 0
  }

  step(count: number): void {
    const n = this.n
    const { v, g, refr, delay, drive, spikes, activity, csr, post, w } = this
    const decay = this.decaySyn
    const dtOverTau = this.dtOverTau
    const actDecay = this.actDecay
    const inputP = this.inputP
    const ring = this.ring
    const delaySteps = this.delaySteps
    const refSteps = this.refSteps
    const rand = this.rand
    let step = this.stepIndex

    for (let s = 0; s < count; s++) {
      const read = (step % ring) * n
      const future = ((step + delaySteps) % ring) * n
      for (let i = 0; i < n; i++) {
        let gi = g[i]
        if (drive[i] && rand() < inputP) gi += INPUT_W_MV
        gi = gi * decay + delay[read + i]
        delay[read + i] = 0
        g[i] = gi
        activity[i] *= actDecay
        if (refr[i] > 0) {
          refr[i]--
          continue
        }
        let vi = v[i] + dtOverTau * (V_REST - v[i] + gi)
        if (vi >= V_TH) {
          vi = V_RESET
          refr[i] = refSteps
          spikes[i]++
          activity[i] = Math.min(1, activity[i] + 0.85)
          const a = csr[i]
          const b = csr[i + 1]
          for (let e = a; e < b; e++) delay[future + post[e]] += w[e]
        }
        v[i] = vi
      }
      step++
    }
    this.stepIndex = step
  }

  /** Spike counts since the last call, then cleared. */
  takeSpikes(): Uint16Array {
    const out = this.spikes.slice()
    this.spikes.fill(0)
    return out
  }

  activityBytes(): Uint8Array {
    const out = new Uint8Array(this.n)
    const activity = this.activity
    for (let i = 0; i < this.n; i++) out[i] = Math.round(activity[i] * 255)
    return out
  }
}
