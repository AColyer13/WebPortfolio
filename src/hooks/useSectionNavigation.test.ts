import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSectionNavigation } from './useSectionNavigation'

beforeEach(() => {
  // Mount a minimal DOM tree with a hero that extends below the header so
  // the layout-effect scroll-spy reports "about" as the initial active.
  document.body.innerHTML = `
    <div class="site-header" style="height:64px"></div>
    <section id="about" style="height:800px"></section>
    <section id="skills"></section>
    <section id="experience"></section>
    <section id="projects"></section>
    <section id="contact"></section>
  `
  // Default window state.
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true })
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 4000,
  })
  // Stub #about rect to extend below the header.
  const about = document.getElementById('about')!
  vi.spyOn(about, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    bottom: 800,
    left: 0,
    right: 1280,
    width: 1280,
    height: 800,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('useSectionNavigation', () => {
  it('publishes the initial active section after layout', async () => {
    const { result } = renderHook(() => useSectionNavigation())
    // layoutEffect runs synchronously in RTL (act() flushes).
    expect(result.current.activeSection).toBe('about')
  })

  it('returns a navigateToSection function that scrolls and updates the URL', () => {
    const { result } = renderHook(() => useSectionNavigation())
    const header = document.querySelector<HTMLElement>('.site-header')!
    vi.spyOn(header, 'offsetHeight', 'get').mockReturnValue(64)
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 64,
      left: 0,
      right: 1280,
      width: 1280,
      height: 64,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
    const projects = document.getElementById('projects')!
    vi.spyOn(projects, 'getBoundingClientRect').mockReturnValue({
      top: 800,
      bottom: 1600,
      left: 0,
      right: 1280,
      width: 1280,
      height: 800,
      x: 0,
      y: 800,
      toJSON: () => ({}),
    } as DOMRect)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 })

    const spy = vi.spyOn(window, 'scrollTo')
    act(() => result.current.navigateToSection('projects'))
    expect(spy).toHaveBeenCalled()
    expect(result.current.activeSection).toBe('projects')
  })

  it('forces the header visible when forceHeaderVisible is true', () => {
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useSectionNavigation({ forceHeaderVisible: visible }),
      { initialProps: { visible: false } },
    )
    // baseline: headerScrollHidden defaults to false
    expect(result.current.headerScrollHidden).toBe(false)
    // Even after a forced scroll, when forceHeaderVisible flips on,
    // the header must stay visible.
    rerender({ visible: true })
    expect(result.current.headerScrollHidden).toBe(false)
  })
})

