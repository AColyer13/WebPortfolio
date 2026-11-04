import { useCallback, useEffect, useRef, useState } from 'react'
import { decodeCircuit, type FlyCircuit } from '../flybrain/circuit'
import type { Backend, ToMain } from '../flybrain/protocol'
import { renderBrain, type BrainView } from '../flybrain/render'
import { withBase } from '../utils/baseUrl'
import { primaryBtnClass, secondaryBtnClass } from '../utils/layoutClasses'
import { Section } from './Section'

const pressedClass = `${primaryBtnClass} cursor-pointer`
const quietClass = `${secondaryBtnClass} cursor-pointer`

const CITATIONS = [
  {
    href: 'https://doi.org/10.1038/s41586-024-07558-y',
    label: 'Dorkenwald et al., 2024',
  },
  {
    href: 'https://doi.org/10.1038/s41586-024-07686-5',
    label: 'Schlegel et al., 2024',
  },
  {
    href: 'https://doi.org/10.1016/j.cell.2024.03.016',
    label: 'Eckstein et al., 2024',
  },
  {
    href: 'https://doi.org/10.1038/s41586-024-07763-9',
    label: 'Shiu et al., 2024',
  },
] as const

function readView(canvas: HTMLCanvasElement, azimuth: number): BrainView | null {
  const parent = canvas.parentElement
  if (!parent) return null
  const width = parent.clientWidth
  const height = parent.clientHeight
  if (width < 2 || height < 2) return null
  const style = getComputedStyle(parent)
  return {
    azimuth,
    width,
    height,
    dpr: Math.min(2, window.devicePixelRatio || 1),
    ink: style.color,
    rule: style.borderColor,
  }
}

/** Drawing can move to the worker only where a canvas can be handed over. */
function canOffscreen(): boolean {
  return (
    typeof OffscreenCanvas !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    'transferControlToOffscreen' in HTMLCanvasElement.prototype
  )
}

export function FlyBrain() {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const circuitRef = useRef<FlyCircuit | null>(null)
  const activityRef = useRef<Uint8Array | null>(null)
  const azimuthRef = useRef(0.4)
  const emaRef = useRef<number[]>([])
  const dragRef = useRef<{ x: number; az: number } | null>(null)
  const [circuit, setCircuit] = useState<FlyCircuit | null>(null)
  const [on, setOn] = useState<Record<string, boolean>>({})
  const [rates, setRates] = useState<number[]>([])
  const [azimuth, setAzimuth] = useState(0.4)
  const [backend, setBackend] = useState<Backend | null>(null)
  const [dtMs, setDtMs] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loadId, setLoadId] = useState(0)
  const [live, setLive] = useState('No stimulus. The readout is quiet.')
  const [visible, setVisible] = useState(false)
  const unlistenRef = useRef<(() => void) | null>(null)
  const readyRef = useRef(false)
  /** True once the canvas belongs to the worker; the main thread must not touch it. */
  const offscreenRef = useRef(false)
  const onRef = useRef(on)
  const ratesRef = useRef(rates)
  const visibleRef = useRef(visible)

  useEffect(() => {
    onRef.current = on
  }, [on])
  useEffect(() => {
    ratesRef.current = rates
  }, [rates])
  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (offscreenRef.current) {
      const view = readView(canvas, azimuthRef.current)
      if (view) workerRef.current?.postMessage({ type: 'view', view })
      return
    }
    const data = circuitRef.current
    const view = readView(canvas, azimuthRef.current)
    if (!data || !view) return
    const pxW = Math.round(view.width * view.dpr)
    const pxH = Math.round(view.height * view.dpr)
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW
      canvas.height = pxH
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    renderBrain(ctx, data.pos, activityRef.current, view)
  }, [])

  useEffect(() => {
    azimuthRef.current = azimuth
    draw()
  }, [azimuth, draw, circuit])

  useEffect(() => {
    // Offscreen frames are drawn by the worker as they arrive.
    if (!offscreenRef.current) draw()
  }, [rates, draw])

  useEffect(() => {
    const node = boxRef.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => draw())
    observer.observe(node)
    return () => observer.disconnect()
  }, [draw])

  useEffect(() => {
    const node = boxRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '240px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const redraw = () => draw()
    const observer = new MutationObserver(redraw)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    const theme = window.matchMedia('(prefers-color-scheme: dark)')
    theme.addEventListener('change', redraw)
    return () => {
      observer.disconnect()
      theme.removeEventListener('change', redraw)
    }
  }, [draw])

  useEffect(() => {
    return () => {
      unlistenRef.current?.()
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const retryLoad = () => {
    unlistenRef.current?.()
    unlistenRef.current = null
    workerRef.current?.terminate()
    workerRef.current = null
    readyRef.current = false
    offscreenRef.current = false
    circuitRef.current = null
    setCircuit(null)
    setBackend(null)
    setError(null)
    setLoadId((n) => n + 1)
  }

  useEffect(() => {
    if (!visible || workerRef.current || typeof Worker === 'undefined') return
    const worker = new Worker(new URL('../flybrain/worker.ts', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker
    worker.onmessage = (event: MessageEvent<ToMain>) => {
      const msg = event.data
      if (msg.type === 'ready') {
        readyRef.current = true
        setBackend(msg.backend)
        setDtMs(msg.dtMs)
        const data = circuitRef.current
        if (data) {
          const mask = new Uint8Array(data.n)
          for (const stim of data.stimuli) {
            if (!onRef.current[stim.id]) continue
            for (const index of stim.indices) mask[index] = 1
          }
          worker.postMessage({ type: 'drive', mask })
        }
        worker.postMessage({
          type: 'run',
          running: visibleRef.current && document.visibilityState !== 'hidden',
        })
      } else if (msg.type === 'frame') {
        if (msg.activity) activityRef.current = msg.activity
        const data = circuitRef.current
        if (!data || msg.simMs <= 0) return
        const sec = msg.simMs / 1000
        const alpha = 1 - Math.exp(-sec / 0.35)
        const next = data.readouts.map((row, r) => {
          let spikes = 0
          for (const index of row.indices) spikes += msg.spikes[index] ?? 0
          const hz = row.indices.length ? spikes / row.indices.length / sec : 0
          const prev = emaRef.current[r] ?? 0
          return prev + (hz - prev) * alpha
        })
        emaRef.current = next
        setRates(next)
      } else if (msg.type === 'error') {
        setError(msg.message)
      }
    }

    const url = new URL(withBase('fly-circuit.bin'), window.location.href)
    void fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load the connectome (${res.status})`)
        return res.arrayBuffer()
      })
      .then((buf) => {
        if (workerRef.current !== worker) return
        const decoded = decodeCircuit(buf)
        circuitRef.current = decoded
        emaRef.current = decoded.readouts.map(() => 0)
        setCircuit(decoded)
        setRates(emaRef.current)
        const canvas = canvasRef.current
        if (canvas && canOffscreen()) {
          // Irreversible per element; retryLoad remounts the canvas via its key.
          const offscreen = canvas.transferControlToOffscreen()
          const pos = decoded.pos.slice()
          offscreenRef.current = true
          worker.postMessage({ type: 'canvas', canvas: offscreen, pos }, [offscreen, pos.buffer])
          draw()
        }
        worker.postMessage(
          {
            type: 'init',
            csr: decoded.csr,
            post: decoded.post,
            w: decoded.w,
            wasmUrl: new URL(withBase('lif.wasm'), window.location.href).href,
          },
          [decoded.csr.buffer, decoded.post.buffer, decoded.w.buffer],
        )
      })
      .catch((err: unknown) => {
        if (workerRef.current !== worker) return
        setError(err instanceof Error ? err.message : 'Could not load the connectome')
      })

    const onVis = () => {
      worker.postMessage({
        type: 'run',
        running: visibleRef.current && document.visibilityState !== 'hidden',
      })
    }
    document.addEventListener('visibilitychange', onVis)
    unlistenRef.current = () => document.removeEventListener('visibilitychange', onVis)
  }, [visible, loadId, draw])

  useEffect(() => {
    const worker = workerRef.current
    const data = circuitRef.current
    if (!worker || !data || !readyRef.current) return
    const mask = new Uint8Array(data.n)
    for (const stim of data.stimuli) {
      if (!on[stim.id]) continue
      for (const index of stim.indices) mask[index] = 1
    }
    worker.postMessage({ type: 'drive', mask })
  }, [on, circuit])

  useEffect(() => {
    const worker = workerRef.current
    if (!worker || !readyRef.current) return
    worker.postMessage({ type: 'run', running: visible && document.visibilityState !== 'hidden' })
  }, [visible])

  useEffect(() => {
    const id = window.setInterval(() => {
      const data = circuitRef.current
      const names = (data?.stimuli ?? []).filter((stim) => onRef.current[stim.id]).map((stim) => stim.label)
      const hot = (data?.readouts ?? [])
        .map((row, i) => ({ row, hz: ratesRef.current[i] ?? 0 }))
        .filter((item) => item.hz >= 1)
        .slice(0, 4)
        .map((item) => `${item.row.detail} ${Math.round(item.hz)} Hz`)
      setLive(
        `${names.length ? `${names.join(', ')} on.` : 'No stimulus.'} ${
          hot.length ? `${hot.join('. ')}.` : 'The readout is quiet.'
        }`,
      )
    }, 1200)
    return () => window.clearInterval(id)
  }, [])

  const finePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  const activeDetails = circuit?.stimuli.filter((stim) => on[stim.id]).map((stim) => stim.detail) ?? []

  return (
    <Section id="fly-brain" title="Fly brain" variant="brain">
      <p className="m-0 text-pretty text-body">
        This is the public FlyWire connectome, not a metaphor. These 1,846 neurons are a cut of
        the female adult brain reconstruction (v783), placed at the positions measured in that
        volume. The synapses are the ones electron microscopy counted. Loom, sugar, and odor
        drive the real sensory cell types named on the buttons. Spikes follow the leaky
        integrate-and-fire model from Shiu et al. (2024): rest at -52 mV, threshold -45 mV, and
        0.275 mV per synapse, with the sign taken from the predicted transmitter. The step runs
        in this browser, on WebGPU when it is available, then WebAssembly, and in JavaScript otherwise. Nothing is
        sent to a server. The readout is
        the firing of named descending neurons in this wiring, plus MN9, the motor neuron that
        extends the proboscis. Cells outside the cut are missing, so this is not the whole
        139,255-neuron brain.
      </p>

      <div className="mt-(--space-6) grid grid-cols-1 gap-(--space-6) lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,22rem)] lg:gap-(--space-12)">
        <div>
          <div role="group" aria-label="Sensory input" className="flex flex-wrap gap-2">
            {(circuit?.stimuli ?? STUB_STIMULI).map((stim) => {
              const pressed = Boolean(on[stim.id])
              return (
                <button
                  key={stim.id}
                  type="button"
                  className={pressed ? pressedClass : quietClass}
                  aria-pressed={pressed}
                  disabled={!circuit}
                  onClick={() => setOn((prev) => ({ ...prev, [stim.id]: !prev[stim.id] }))}
                >
                  {stim.label}
                </button>
              )
            })}
            <button
              type="button"
              className={quietClass}
              disabled={!circuit}
              onClick={() => setAzimuth((value) => value + Math.PI / 5)}
            >
              Turn
            </button>
            <button
              type="button"
              className={quietClass}
              disabled={!circuit}
              onClick={() => {
                setOn({})
                emaRef.current = circuitRef.current?.readouts.map(() => 0) ?? []
                setRates(emaRef.current)
                activityRef.current = null
                workerRef.current?.postMessage({ type: 'reset' })
                draw()
              }}
            >
              Reset
            </button>
          </div>
          <p className="m-0 mt-(--space-3) text-fluid-1">
            {activeDetails.length
              ? `Driving ${activeDetails.join('; ')}.`
              : 'Nothing is on. The model has no spontaneous firing, which is the baseline in Shiu et al.'}
          </p>
          <div
            ref={boxRef}
            className="plot-stage mt-(--space-4) h-72 lg:h-[26rem]"
          >
            <canvas
              key={loadId}
              ref={canvasRef}
              className="block h-full w-full touch-pan-y"
              aria-hidden="true"
              onPointerDown={(event) => {
                if (!finePointer) return
                dragRef.current = { x: event.clientX, az: azimuthRef.current }
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current
                if (!drag) return
                setAzimuth(drag.az + (event.clientX - drag.x) * 0.01)
              }}
              onPointerUp={() => {
                dragRef.current = null
              }}
            />
            {!circuit && (
              <div className="absolute inset-0 flex items-center p-(--space-4)">
                {error || typeof Worker === 'undefined' ? (
                  <div className="state-error" role="alert">
                    <p className="m-0">
                      {error ?? 'This browser cannot run the simulation.'}
                    </p>
                    {typeof Worker !== 'undefined' ? (
                      <button type="button" className="btn" onClick={retryLoad}>
                        Try again
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="state-loading" role="status">
                    {visible ? <div className="skeleton skeleton-copy" /> : null}
                    <p className="m-0">
                      {visible
                        ? 'Loading the connectome…'
                        : 'The simulation loads when this section reaches the screen.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="m-0 mt-2 text-fluid-1 text-text-muted">
            {finePointer
              ? 'Drag to turn. Quiet neurons stay hairlines; a firing neuron grows darker.'
              : 'Use Turn to rotate. Quiet neurons stay hairlines; a firing neuron grows darker.'}
          </p>
        </div>

        <div>
          <h3 className="m-0">Readout</h3>
          <p className="m-0 mt-(--space-2) text-fluid-1">
            Descending neurons, and the proboscis motor neuron. Hertz, smoothed over the last
            fraction of a second.
          </p>
          <ul className="m-0 mt-(--space-4) flex list-none flex-col gap-(--space-4) p-0">
            {(circuit?.readouts ?? STUB_READOUTS).map((row, index) => {
              const hz = rates[index] ?? 0
              const width = Math.min(100, (hz / 120) * 100)
              return (
                <li key={row.id}>
                  <div className="flex items-baseline justify-between gap-(--space-3)">
                    <span className="text-body text-text-default">
                      {row.label}
                      <span className="ms-(--space-2) text-fluid-1 text-text-muted">{row.detail}</span>
                    </span>
                    <span className="metric shrink-0 text-body text-text-default">
                      {circuit ? Math.round(hz) : '–'} Hz
                    </span>
                  </div>
                  <div className="meter mt-(--space-2)" aria-hidden="true">
                    <span style={{ width: `${width}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <p
            className={`status-live m-0 mt-(--space-4) text-fluid-1 ${
              error || typeof Worker === 'undefined'
                ? 'status-live--bad'
                : backend
                  ? 'status-live--ok'
                  : 'status-live--wait'
            }`}
            role="status"
          >
            {error ??
              (typeof Worker === 'undefined' ? (
                'This browser cannot run the simulation.'
              ) : backend ? (
                <>
                  {BACKEND_LABEL[backend]},{' '}
                  <span className="metric">{dtMs} ms</span> steps
                </>
              ) : (
                'Waiting to start'
              ))}
          </p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {live}
      </p>

      <p className="m-0 mt-(--space-6) text-fluid-1">
        The cut keeps those sensory types, the descending neurons DNa01, DNa02, DNa03, DNb05,
        DNa11, DNp01, MDN, DNp09, DNg13 and DNp03, MN9 (CB0701), and every neuron on a path of
        at least 40 synapses between them. Wiring and cell types:{' '}
        {CITATIONS.map((item, index) => (
          <span key={item.href}>
            {index > 0 ? ', ' : ''}
            <a
              href={item.href}
              className="underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          </span>
        ))}
        . Data: FlyWire v783, CC BY-NC 4.0, via{' '}
        <a
          href="https://flywire.ai"
          className="underline-offset-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          flywire.ai
        </a>
        .
      </p>
    </Section>
  )
}

const BACKEND_LABEL: Record<Backend, string> = {
  webgpu: 'WebGPU',
  wasm: 'WebAssembly',
  js: 'JavaScript',
}

const STUB_STIMULI = [
  { id: 'loom-left', label: 'Loom left' },
  { id: 'loom-right', label: 'Loom right' },
  { id: 'sugar', label: 'Sugar' },
  { id: 'odor', label: 'Odor' },
]

const STUB_READOUTS = [
  { id: 'dnp01-l', label: 'Giant fiber', detail: 'DNp01, left' },
  { id: 'dnp01-r', label: 'Giant fiber', detail: 'DNp01, right' },
  { id: 'dna02-l', label: 'Steering', detail: 'DNa02, left' },
  { id: 'dna02-r', label: 'Steering', detail: 'DNa02, right' },
  { id: 'dnp09', label: 'Walk forward', detail: 'DNp09' },
  { id: 'mdn', label: 'Moonwalk', detail: 'MDN' },
  { id: 'mn9', label: 'Proboscis', detail: 'MN9 (CB0701)' },
]
