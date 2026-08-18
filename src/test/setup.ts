import '@testing-library/jest-dom/vitest'
import '../index.css'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// RTL auto-cleanup shim — register an explicit afterEach so DOM from a
// prior render doesn't leak into the next test (which can happen with
// Vitest's per-file workers if the `auto-cleanup` heuristic misses).
afterEach(() => {
  cleanup()
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// jsdom doesn't implement ResizeObserver — stub for scroll-spy / header sync.
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
  MockResizeObserver

// jsdom doesn't implement window.scrollTo — stub it so we don't see
// "Not implemented" warnings during scroll-spy tests.
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// jsdom requires --localstorage-file to expose a working localStorage.
// Provide an in-memory shim so theme/storage code can run under tests.
if (!window.localStorage) {
  const store = new Map<string, string>()
  const shim = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, String(v))
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(window, 'localStorage', { configurable: true, value: shim })
}
