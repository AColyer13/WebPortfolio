/** Shiu et al., Nature 2024. One free parameter, W_syn, set in that paper. */
export const V_REST = -52
export const V_RESET = -52
export const V_TH = -45
export const TAU_M_MS = 20
export const T_REF_MS = 2.2
export const TAU_SYN_MS = 5
export const DELAY_MS = 1.8
export const W_SYN_MV = 0.275
/** Poisson rate used to drive a sensory neuron that a button has turned on. */
export const INPUT_RATE_HZ = 150
/** Kick into the synaptic variable, 250 × W_syn, from the published model. */
export const INPUT_W_MV = 68.75

/** WebGPU integrates at the 0.1 ms step used with this parameter set. */
export const GPU_DT_MS = 0.1
/** JavaScript uses a coarser step so a phone can keep up. */
export const JS_DT_MS = 1
/** Visual fade of a spike on the plot. Not part of the neuron model. */
export const ACT_TAU_MS = 80

export function stepsFor(ms: number, dtMs: number): number {
  return Math.max(1, Math.round(ms / dtMs))
}

export const NT_SIGN: Record<string, number> = {
  ACH: 1,
  DA: 1,
  SER: 1,
  OCT: 1,
  GABA: -1,
  GLUT: -1,
}
