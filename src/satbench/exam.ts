/**
 * Sat bench — a deterministic exam for one satellite, run entirely in the page.
 *
 * Teaching model, not a flight propagator: one attitude axis, one temperature,
 * and a link. Semi-implicit Euler at a fixed 50 ms step. The grade depends
 * only on the exam, the command, and the latency quantized to that step.
 */

export const DT_MS = 50

export type ExamId = 'attitude' | 'thermal' | 'comms'

export type CommandId = 'null-rate' | 'spin-up' | 'open-radiator' | 'heater-up' | 'hold-and-point' | 'coast'

export interface ExamCommand {
  id: CommandId
  label: string
}

export interface ExamDef {
  id: ExamId
  label: string
  fault: string
  tutor: string
  latencyLimitMs: number
  horizonMs: number
  peakLimit: number
  settleLimit: number
  peakUnit: string
  settleUnit: string
  commands: readonly ExamCommand[]
}

export const EXAMS: readonly ExamDef[] = [
  {
    id: 'attitude',
    label: 'Attitude drift',
    fault: 'Residual wheel torque is opening the attitude.',
    tutor: 'Null the rate before it leaves the corridor.',
    latencyLimitMs: 8000,
    horizonMs: 16000,
    peakLimit: 8,
    settleLimit: 1,
    peakUnit: '°',
    settleUnit: '°',
    commands: [
      { id: 'null-rate', label: 'Null the rate' },
      { id: 'spin-up', label: 'Spin the wheel up' },
      { id: 'coast', label: 'Coast' },
    ],
  },
  {
    id: 'thermal',
    label: 'Thermal spike',
    fault: 'A payload heater is stuck on.',
    tutor: 'Open the radiator before the temperature leaves the corridor.',
    latencyLimitMs: 6000,
    horizonMs: 20000,
    peakLimit: 36,
    settleLimit: 24,
    peakUnit: '°C',
    settleUnit: '°C',
    commands: [
      { id: 'open-radiator', label: 'Open the radiator' },
      { id: 'heater-up', label: 'Turn the heater up' },
      { id: 'coast', label: 'Coast' },
    ],
  },
  {
    id: 'comms',
    label: 'Comms drop',
    fault: 'The uplink is gone, and attitude is drifting.',
    tutor: 'Hold attitude and point the antenna.',
    latencyLimitMs: 5000,
    horizonMs: 15000,
    peakLimit: 4,
    settleLimit: 1,
    peakUnit: '°',
    settleUnit: '°',
    commands: [
      { id: 'hold-and-point', label: 'Hold and point' },
      { id: 'heater-up', label: 'Turn the heater up' },
      { id: 'coast', label: 'Coast' },
    ],
  },
]

export const PASSING_KEYS: Record<ExamId, { commandId: CommandId; latencyMs: number }> = {
  attitude: { commandId: 'null-rate', latencyMs: 2000 },
  thermal: { commandId: 'open-radiator', latencyMs: 1500 },
  comms: { commandId: 'hold-and-point', latencyMs: 1000 },
}

export interface Sample {
  tMs: number
  theta: number
  rate: number
  temp: number
  link: number
}

export interface Grade {
  examId: ExamId
  commandId: CommandId
  commandLabel: string
  latencyMs: number
  latencyLimitMs: number
  latencyPass: boolean
  peak: number
  peakLimit: number
  peakUnit: string
  peakPass: boolean
  settled: number
  settleLimit: number
  settleUnit: string
  settlePass: boolean
  /** Final link, 0 to 1. Null when this exam does not grade the link. */
  link: number | null
  linkPass: boolean | null
  pass: boolean
  note: string
  samples: Sample[]
}

interface State {
  theta: number
  rate: number
  temp: number
  link: number
}

export function examById(id: ExamId): ExamDef {
  const exam = EXAMS.find((item) => item.id === id)
  if (!exam) throw new Error(`Unknown exam ${id}`)
  return exam
}

export function quantizeMs(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0
  return Math.round(ms / DT_MS) * DT_MS
}

export function initialState(examId: ExamId): Sample {
  if (examId === 'attitude') return { tMs: 0, theta: 1, rate: 0.5, temp: 22, link: 1 }
  if (examId === 'thermal') return { tMs: 0, theta: 0, rate: 0, temp: 22, link: 1 }
  return { tMs: 0, theta: 0, rate: 0.45, temp: 22, link: 0 }
}

function step(examId: ExamId, state: State, command: CommandId | null, dt: number): State {
  let { theta, rate, temp, link } = state
  if (examId === 'attitude') {
    let accel = 0.4
    if (command === 'null-rate') accel = -2.4 * rate - 0.55 * theta
    else if (command === 'spin-up') accel = 1.5
    rate += accel * dt
    theta += rate * dt
  } else if (examId === 'thermal') {
    let dT = 1.15
    if (command === 'open-radiator') dT = -0.22 * (temp - 16)
    else if (command === 'heater-up') dT = 2.2
    temp += dT * dt
  } else {
    if (command === 'hold-and-point') {
      const accel = -3 * rate - 0.55 * theta
      rate += accel * dt
      theta += rate * dt
      if (Math.abs(theta) < 6) link = Math.min(1, link + dt / 3.5)
    } else {
      rate = 0.45
      theta += rate * dt
      link = 0
    }
  }
  return { theta, rate, temp, link }
}

function commandLabel(exam: ExamDef, commandId: CommandId): string {
  return exam.commands.find((item) => item.id === commandId)?.label ?? 'Coast'
}

function tutorNote(pass: boolean, latencyPass: boolean, trajectoryPass: boolean, missed: boolean): string {
  if (pass) {
    return 'Pass. The command was inside the deadline and the trajectory stayed in the corridor. Replaying this latency grades the same way.'
  }
  if (missed) {
    return 'Fail. No command arrived before the horizon, so the fault ran to the end.'
  }
  if (!latencyPass && trajectoryPass) {
    return 'Fail. The trajectory would have held, but the command missed the deadline.'
  }
  if (!latencyPass) {
    return 'Fail. The command missed the deadline, and the trajectory left the corridor.'
  }
  return 'Fail. The command was in time, but the trajectory left the corridor.'
}

/** Open-loop or commanded state at a clock time. Uses the same steps as {@link gradeExam}. */
export function stateAt(
  examId: ExamId,
  elapsedMs: number,
  commandId: CommandId | null,
  latencyMs: number,
): Sample {
  const exam = examById(examId)
  const latency = Math.min(exam.horizonMs, quantizeMs(latencyMs))
  const end = Math.min(exam.horizonMs, Math.max(0, Math.floor(elapsedMs / DT_MS) * DT_MS))
  let state: State = initialState(examId)
  for (let t = 0; t < end; t += DT_MS) {
    const active = commandId !== null && latency < exam.horizonMs && t >= latency ? commandId : null
    state = step(examId, state, active, DT_MS / 1000)
  }
  return { tMs: end, ...state }
}

/** Integrate the exam and grade it. `latencyMs` is quantized to {@link DT_MS}. */
export function gradeExam(examId: ExamId, commandId: CommandId, latencyMs: number): Grade {
  const exam = examById(examId)
  const latency = Math.min(exam.horizonMs, quantizeMs(latencyMs))
  const missed = latency >= exam.horizonMs
  const applied = missed ? null : commandId
  const samples: Sample[] = []
  let state: State = initialState(examId)
  samples.push({ tMs: 0, ...state })

  let peakTheta = Math.abs(state.theta)
  let peakTemp = state.temp
  for (let t = 0; t < exam.horizonMs; t += DT_MS) {
    const active = applied !== null && t >= latency ? applied : null
    state = step(examId, state, active, DT_MS / 1000)
    peakTheta = Math.max(peakTheta, Math.abs(state.theta))
    peakTemp = Math.max(peakTemp, state.temp)
    samples.push({ tMs: t + DT_MS, ...state })
  }

  const latencyPass = !missed && latency <= exam.latencyLimitMs
  let peak = peakTheta
  let settled = Math.abs(state.theta)
  let settlePass = settled <= exam.settleLimit && Math.abs(state.rate) <= 0.2
  let link: number | null = null
  let linkPass: boolean | null = null

  if (examId === 'thermal') {
    peak = peakTemp
    settled = state.temp
    settlePass = settled <= exam.settleLimit
  } else if (examId === 'comms') {
    link = state.link
    linkPass = state.link >= 0.95
    settlePass = settled <= exam.settleLimit && linkPass
  }

  const peakPass = peak <= exam.peakLimit
  const trajectoryPass = peakPass && settlePass
  const pass = latencyPass && trajectoryPass

  return {
    examId,
    commandId: missed ? 'coast' : commandId,
    commandLabel: missed ? 'No command' : commandLabel(exam, commandId),
    latencyMs: latency,
    latencyLimitMs: exam.latencyLimitMs,
    latencyPass,
    peak,
    peakLimit: exam.peakLimit,
    peakUnit: exam.peakUnit,
    peakPass,
    settled,
    settleLimit: exam.settleLimit,
    settleUnit: exam.settleUnit,
    settlePass,
    link,
    linkPass,
    pass,
    note: tutorNote(pass, latencyPass, trajectoryPass, missed),
    samples,
  }
}
