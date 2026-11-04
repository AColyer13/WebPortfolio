/**
 * Deferred field monitoring: Core Web Vitals plus uncaught errors.
 * Nothing loads until the page has finished loading and the main thread is idle.
 * Set VITE_TELEMETRY_URL to a collector endpoint to send beacons; without it
 * events are only logged to the console in development.
 */
interface TelemetryEvent {
  type: 'vital' | 'error'
  name: string
  value?: number
  rating?: string
  message?: string
  page: string
}

const endpoint = import.meta.env.VITE_TELEMETRY_URL as string | undefined

export function report(event: Omit<TelemetryEvent, 'page'>): void {
  const payload: TelemetryEvent = { ...event, page: window.location.pathname }
  if (endpoint && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(endpoint, JSON.stringify(payload))
  } else if (import.meta.env.DEV) {
    console.debug('[telemetry]', payload)
  }
}

function watchErrors(): void {
  window.addEventListener('error', (event) => {
    report({ type: 'error', name: 'error', message: event.message })
  })
  window.addEventListener('unhandledrejection', (event) => {
    const reason: unknown = event.reason
    report({
      type: 'error',
      name: 'unhandledrejection',
      message: reason instanceof Error ? reason.message : String(reason),
    })
  })
}

async function watchVitals(): Promise<void> {
  const { onCLS, onINP, onLCP, onTTFB } = await import('web-vitals')
  const send = (metric: { name: string; value: number; rating: string }) =>
    report({ type: 'vital', name: metric.name, value: metric.value, rating: metric.rating })
  onCLS(send)
  onINP(send)
  onLCP(send)
  onTTFB(send)
}

function whenIdle(task: () => void): void {
  const run = () => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(task, { timeout: 4000 })
    else setTimeout(task, 2000)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
}

export function initTelemetry(): void {
  watchErrors()
  whenIdle(() => {
    void watchVitals().catch(() => {})
  })
}
