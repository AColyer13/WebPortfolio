import { withBase } from './baseUrl'

/**
 * Shared dynamic-import loaders. `lazy()` and the prefetch helpers call the same
 * `import()` expressions, so Vite emits one chunk and the browser caches it once.
 */
export const loadProjects = () => import('../components/Projects')
export const loadContact = () => import('../components/Contact')
export const loadFlyBrain = () => import('../components/FlyBrain')
export const loadSatBench = () => import('../components/SatBench')

interface NetworkInformation {
  saveData?: boolean
  effectiveType?: string
}

/** Skip speculative fetches when the user asked to save data or is on a slow link. */
export function canPrefetch(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (!connection) return true
  if (connection.saveData) return false
  return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g'
}

const started = new Set<string>()

/** Run `task` at most once per `key`, and only when prefetching is allowed. */
function once(key: string, task: () => Promise<unknown>): void {
  if (started.has(key) || !canPrefetch()) return
  started.add(key)
  task().catch(() => {
    // Allow a later hover to retry after a failed network fetch.
    started.delete(key)
  })
}

const SECTION_LOADERS: Record<string, () => Promise<unknown>> = {
  projects: loadProjects,
  contact: loadContact,
}

/** Warm the chunk behind a nav link or section. Unknown ids are ignored. */
export function prefetchSection(id: string): void {
  const loader = SECTION_LOADERS[id]
  if (loader) once(`section:${id}`, loader)
}

/** Warm everything the live-demo dialog needs before the user opens it. */
export function prefetchDemo(): void {
  once('demo:flybrain', loadFlyBrain)
  once('demo:satbench', loadSatBench)
  once('demo:circuit', () => fetch(withBase('fly-circuit.bin')))
  once('demo:wasm', () => fetch(withBase('lif.wasm')))
}

/** Props to spread on a link or button so intent (hover, keyboard focus, touch) triggers `fn`. */
export function intentHandlers(fn: () => void) {
  return {
    onPointerEnter: fn,
    onFocus: fn,
    onTouchStart: fn,
  }
}

/** Test hook: forget which prefetches already ran. */
export function resetPrefetchState(): void {
  started.clear()
}
