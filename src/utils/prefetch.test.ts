import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { canPrefetch, prefetchDemo, prefetchSection, resetPrefetchState } from './prefetch'

describe('prefetch', () => {
  beforeEach(() => {
    resetPrefetchState()
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true })))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('warms the demo assets once, however many times intent fires', () => {
    prefetchDemo()
    prefetchDemo()
    const urls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.map((c) => String(c[0]))
    expect(urls.filter((u) => u.endsWith('fly-circuit.bin'))).toHaveLength(1)
    expect(urls.filter((u) => u.endsWith('lif.wasm'))).toHaveLength(1)
  })

  it('ignores sections that have no lazy chunk', () => {
    expect(() => prefetchSection('about')).not.toThrow()
  })

  it('skips speculative fetches when the user asked to save data', () => {
    vi.stubGlobal('navigator', { connection: { saveData: true } })
    expect(canPrefetch()).toBe(false)
    prefetchDemo()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('skips on a 2g connection', () => {
    vi.stubGlobal('navigator', { connection: { effectiveType: '2g' } })
    expect(canPrefetch()).toBe(false)
  })
})
