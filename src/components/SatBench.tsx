import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  examById,
  gradeExam,
  initialState,
  PASSING_KEYS,
  stateAt,
  EXAMS,
  type CommandId,
  type ExamId,
  type Grade,
  type Sample,
} from '../satbench/exam'
import { primaryBtnClass, secondaryBtnClass } from '../utils/layoutClasses'
import { Section } from './Section'

const pressedClass = `${primaryBtnClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`
const quietClass = `${secondaryBtnClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`

interface Run {
  examId: ExamId
  startedAt: number
  graded: boolean
}

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)} s`
}

function formatMeasure(value: number, unit: string): string {
  return `${value.toFixed(1)}${unit}`
}

function draw(
  canvas: HTMLCanvasElement,
  examId: ExamId,
  samples: Sample[],
  playMs: number,
) {
  const parent = canvas.parentElement
  if (!parent) return
  const width = parent.clientWidth
  const height = parent.clientHeight
  if (width < 2 || height < 2) return
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const pxW = Math.round(width * dpr)
  const pxH = Math.round(height * dpr)
  if (canvas.width !== pxW || canvas.height !== pxH) {
    canvas.width = pxW
    canvas.height = pxH
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const style = getComputedStyle(parent)
  const ink = style.color
  const rule = style.borderTopColor
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const exam = examById(examId)
  const horizon = exam.horizonMs
  const pad = 16
  const plotBottom = height - 28
  const plotTop = 16
  const xAt = (t: number) => pad + ((width - pad * 2) * Math.min(horizon, Math.max(0, t))) / horizon

  const valueOf = (sample: Sample) => (examId === 'thermal' ? sample.temp : sample.theta)
  const limit = exam.peakLimit
  const mid = examId === 'thermal' ? 22 : 0
  const span = examId === 'thermal' ? 40 : limit * 1.6
  const yAt = (value: number) => {
    const norm = (value - mid) / span
    return (plotTop + plotBottom) / 2 - norm * ((plotBottom - plotTop) / 2)
  }

  ctx.strokeStyle = rule
  ctx.lineWidth = 1
  ctx.beginPath()
  if (examId === 'thermal') {
    ctx.moveTo(pad, yAt(exam.peakLimit))
    ctx.lineTo(width - pad, yAt(exam.peakLimit))
  } else {
    ctx.moveTo(pad, yAt(limit))
    ctx.lineTo(width - pad, yAt(limit))
    ctx.moveTo(pad, yAt(-limit))
    ctx.lineTo(width - pad, yAt(-limit))
  }
  ctx.stroke()

  ctx.beginPath()
  samples.forEach((sample, index) => {
    const x = xAt(sample.tMs)
    const y = yAt(valueOf(sample))
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.strokeStyle = ink
  ctx.stroke()

  const marker = samples.reduce((best, sample) =>
    Math.abs(sample.tMs - playMs) < Math.abs(best.tMs - playMs) ? sample : best,
  )
  const mx = xAt(marker.tMs)
  const my = yAt(valueOf(marker))
  ctx.save()
  ctx.translate(mx, my)
  if (examId !== 'thermal') ctx.rotate((marker.theta * Math.PI) / 180)
  ctx.strokeStyle = ink
  ctx.strokeRect(-7, -4, 14, 8)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(11, 0)
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = ink
  ctx.font = '12px ui-monospace, monospace'
  ctx.textBaseline = 'bottom'
  const caption = examId === 'thermal' ? 'Temperature' : 'Attitude'
  ctx.fillText(caption, pad, height - 6)
}

export function SatBench() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gradedRef = useRef(false)
  const [run, setRun] = useState<Run | null>(null)
  const [grade, setGrade] = useState<Grade | null>(null)
  const [live, setLive] = useState<Sample | null>(null)
  const [trail, setTrail] = useState<Sample[]>([])
  const [playMs, setPlayMs] = useState(0)
  const exam = run ? examById(run.examId) : null
  const shownExam = grade ? examById(grade.examId) : exam

  useEffect(() => {
    if (!run || run.graded) return
    let frame = 0
    const tick = () => {
      if (gradedRef.current) return
      const elapsed = performance.now() - run.startedAt
      const examDef = examById(run.examId)
      if (elapsed >= examDef.horizonMs) {
        gradedRef.current = true
        const result = gradeExam(run.examId, 'coast', examDef.horizonMs)
        setGrade(result)
        setRun((current) =>
          current && current.startedAt === run.startedAt ? { ...current, graded: true } : current,
        )
        return
      }
      const next = stateAt(run.examId, elapsed, null, examDef.horizonMs)
      setLive((prev) => (prev?.tMs === next.tMs ? prev : next))
      setPlayMs((prev) => (prev === next.tMs ? prev : next.tMs))
      setTrail((prev) => (prev.length && prev[prev.length - 1].tMs === next.tMs ? prev : [...prev, next]))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run])

  useEffect(() => {
    if (!grade || !run?.graded) return
    const startedAt = run.startedAt
    const horizon = examById(grade.examId).horizonMs
    const samples = grade.samples
    let frame = 0
    const tick = () => {
      const elapsed = Math.min(horizon, Math.max(0, performance.now() - startedAt))
      let sample = samples[0]
      for (const item of samples) {
        if (item.tMs <= elapsed) sample = item
        else break
      }
      setPlayMs((prev) => (prev === sample.tMs ? prev : sample.tMs))
      setLive((prev) => (prev?.tMs === sample.tMs ? prev : sample))
      if (elapsed < horizon) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [grade, run?.graded, run?.startedAt])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !shownExam) return
    const samples = grade?.samples ?? (trail.length ? trail : [initialState(shownExam.id)])
    draw(canvas, shownExam.id, samples, playMs)
  }, [shownExam, grade, trail, playMs])

  function start(event: MouseEvent<HTMLButtonElement>) {
    const examId = event.currentTarget.value as ExamId
    gradedRef.current = false
    const origin = initialState(examId)
    setGrade(null)
    setPlayMs(0)
    setLive(origin)
    setTrail([origin])
    setRun({ examId, startedAt: performance.now(), graded: false })
  }

  function command(event: MouseEvent<HTMLButtonElement>) {
    if (!run || gradedRef.current) return
    const commandId = event.currentTarget.value as CommandId
    gradedRef.current = true
    const elapsed = performance.now() - run.startedAt
    const result = gradeExam(run.examId, commandId, elapsed)
    setGrade(result)
    setRun({ ...run, graded: true })
  }

  function showPassingKey() {
    if (!run) return
    gradedRef.current = true
    const key = PASSING_KEYS[run.examId]
    const result = gradeExam(run.examId, key.commandId, key.latencyMs)
    setGrade(result)
    setPlayMs(0)
    setRun({ examId: run.examId, startedAt: performance.now(), graded: true })
  }

  const telemetry = live ?? (shownExam ? initialState(shownExam.id) : null)
  const traceExam = shownExam?.id

  return (
    <Section id="sat-bench" title="Sat bench" variant="bench">
      <p className="m-0 max-w-[46rem] text-pretty text-body leading-snug text-text-default">
        Sat bench grades the corrective call, not a loss curve. Each fault is injected the same
        way every time: attitude drift, a thermal spike, or a comms drop. The grade is how soon
        the command arrives, and whether the trajectory stays inside a fixed corridor. Issue the
        same command at the same latency and the grade does not change. The dynamics run in this
        page. Nothing is sent to a server.
      </p>
      <p className="m-0 mt-3 max-w-[46rem] text-fluid-1 leading-snug text-text-muted">
        One axis, a temperature, and a link, stepped at 50 ms. This is a teaching stand-in for
        the console, not a flight propagator.{' '}
        <a
          href="https://missionctrl.org"
          className="underline-offset-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          MissionCtrl
        </a>{' '}
        is the mission simulator this exam belongs beside.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Fault">
        {EXAMS.map((item) => {
          const pressed = run?.examId === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={pressed ? pressedClass : quietClass}
              aria-pressed={pressed}
              value={item.id}
              onClick={start}
            >
              {item.label}
            </button>
          )
        })}
        <button type="button" className={quietClass} disabled={!run} onClick={showPassingKey}>
          Show the passing key
        </button>
      </div>

      <p className="m-0 mt-3 min-h-11 text-fluid-1 leading-snug text-text-muted">
        {exam
          ? `${exam.fault} ${exam.tutor}`
          : 'Choose a fault. The injection is the same every time.'}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,22rem)] lg:gap-10">
        <div>
          {exam && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Corrective command">
              {exam.commands.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={quietClass}
                  disabled={run?.graded}
                  value={item.id}
                  onClick={command}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <div
            className="relative mt-4 h-56 border border-border-default text-text-default lg:h-72"
            style={{ borderColor: 'var(--color-border-default)', color: 'var(--color-text-default)' }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
            {!traceExam && (
              <p className="pointer-events-none absolute inset-0 m-0 flex items-center px-4 text-fluid-1 text-text-muted">
                The trace appears when a fault starts.
              </p>
            )}
          </div>
          <p className="m-0 mt-2 text-fluid-1 text-text-muted">
            Hairlines mark the corridor. After a command, the rest of the trace is already fixed.
          </p>
        </div>

        <div>
          <h3 className="m-0 text-fluid-3 font-bold text-text-default">Grade</h3>
          <p className="m-0 mt-2 text-fluid-1 leading-snug text-text-muted">
            Latency against the deadline, then the peak and the settled value against the corridor.
          </p>
          <ul className="m-0 mt-4 list-none p-0">
            <li className="border-b border-border-default py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body text-text-default">Attitude</span>
                <span className="shrink-0 tabular-nums text-body text-text-default">
                  {telemetry ? `${telemetry.theta.toFixed(1)}°` : '–'}
                </span>
              </div>
            </li>
            <li className="border-b border-border-default py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body text-text-default">Rate</span>
                <span className="shrink-0 tabular-nums text-body text-text-default">
                  {telemetry ? `${telemetry.rate.toFixed(2)}°/s` : '–'}
                </span>
              </div>
            </li>
            <li className="border-b border-border-default py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body text-text-default">Temperature</span>
                <span className="shrink-0 tabular-nums text-body text-text-default">
                  {telemetry ? `${telemetry.temp.toFixed(1)}°C` : '–'}
                </span>
              </div>
            </li>
            <li className="border-b border-border-default py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-body text-text-default">Link</span>
                <span className="shrink-0 tabular-nums text-body text-text-default">
                  {telemetry ? `${Math.round(telemetry.link * 100)}%` : '–'}
                </span>
              </div>
            </li>
          </ul>
          {grade && (
            <div className="mt-4 border-t border-border-default pt-4" role="status">
              <p className="m-0 text-body text-text-default">{grade.note}</p>
              <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-fluid-1 text-text-muted">
                <dt>Latency</dt>
                <dd className="m-0 tabular-nums text-text-default">
                  {formatSeconds(grade.latencyMs)} / {formatSeconds(grade.latencyLimitMs)}
                </dd>
                <dt>Peak</dt>
                <dd className="m-0 tabular-nums text-text-default">
                  {formatMeasure(grade.peak, grade.peakUnit)} / {formatMeasure(grade.peakLimit, grade.peakUnit)}
                </dd>
                <dt>Settled</dt>
                <dd className="m-0 tabular-nums text-text-default">
                  {formatMeasure(grade.settled, grade.settleUnit)} / {formatMeasure(grade.settleLimit, grade.settleUnit)}
                </dd>
                {grade.link !== null && (
                  <>
                    <dt>Link</dt>
                    <dd className="m-0 tabular-nums text-text-default">{Math.round(grade.link * 100)}% / 95%</dd>
                  </>
                )}
              </dl>
              <p className="m-0 mt-3 text-fluid-1 text-text-muted">
                Key {grade.examId} / {grade.commandLabel} / {grade.latencyMs} ms.
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
