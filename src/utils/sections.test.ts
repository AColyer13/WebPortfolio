import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  SECTION_IDS,
  getActiveSectionId,
  headerScrollInset,
  isSectionId,
  scrollToSection,
  syncLocationHashWithActiveSection,
} from './sections'

/**
 * Helper — fabricate a `HeaderElement`-shaped object (just `offsetHeight` +
 * `getBoundingClientRect`) and a `#about`/... section element with a known
 * rect. We do this by rendering real DOM nodes and stubbing their layout
 * methods instead of mocking, so the scroll-spy logic is exercised end to
 * end against a real `window` / `document.documentElement`.
 */

type Rect = { top: number; bottom: number; left: number; right: number }

function makeRect(r: Rect) {
  return { ...r, width: r.right - r.left, height: r.bottom - r.top, x: r.left, y: r.top, toJSON: () => r }
}

interface LayoutOverrides {
  headerHeight: number
  headerBottom?: number
  about: Rect
  skills: Rect
  experience: Rect
  projects: Rect
  contact: Rect
  scrollHeight: number
  scrollY: number
  innerWidth: number
  innerHeight: number
}

function setLayout(o: LayoutOverrides) {
  const header = document.querySelector<HTMLElement>('.site-header')!
  const headerBottom = o.headerBottom ?? o.headerHeight
  vi.spyOn(header, 'offsetHeight', 'get').mockReturnValue(o.headerHeight)
  vi.spyOn(header, 'getBoundingClientRect').mockReturnValue(
    makeRect({ top: 0, bottom: headerBottom, left: 0, right: o.innerWidth }) as DOMRect,
  )

  const map: Record<string, Rect> = {
    about: o.about,
    skills: o.skills,
    experience: o.experience,
    projects: o.projects,
    contact: o.contact,
  }
  for (const [id, r] of Object.entries(map)) {
    const el = document.getElementById(id)
    if (!el) continue
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(makeRect(r) as DOMRect)
  }

  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: o.scrollHeight,
  })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: o.scrollY })
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: o.innerWidth })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: o.innerHeight })
}

beforeEach(() => {
  // Mount a minimal DOM tree with all five sections + a .site-header.
  document.body.innerHTML = `
    <div class="site-header" style="height:64px"></div>
    <section id="about"></section>
    <section id="skills"></section>
    <section id="experience"></section>
    <section id="projects"></section>
    <section id="contact"></section>
  `
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('SECTION_IDS + isSectionId', () => {
  it('lists sections in DOM order', () => {
    expect(SECTION_IDS).toEqual([
      'about',
      'experience',
      'projects',
      'skills',
      'contact',
    ])
  })

  it('isSectionId narrows string types', () => {
    expect(isSectionId('about')).toBe(true)
    expect(isSectionId('Skills')).toBe(false) // case-sensitive
    expect(isSectionId('nope')).toBe(false)
  })
})

describe('headerScrollInset', () => {
  it('ceil-rounds the measured height to avoid sub-pixel gap', () => {
    const header = document.querySelector<HTMLElement>('.site-header')!
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 0, bottom: 63.4, left: 0, right: 1280 }) as DOMRect,
    )
    expect(headerScrollInset(header)).toBe(64)
  })
})

describe('scrollToSection', () => {
  it('scrolls to the top when targeting the hero (#about)', () => {
    const header = document.querySelector<HTMLElement>('.site-header')!
    vi.spyOn(header, 'offsetHeight', 'get').mockReturnValue(64)
    vi.spyOn(window, 'scrollTo')
    scrollToSection('about', header)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('scrolls to section.top + scrollY - headerHeight', () => {
    const header = document.querySelector<HTMLElement>('.site-header')!
    vi.spyOn(header, 'offsetHeight', 'get').mockReturnValue(64)
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 0, bottom: 64, left: 0, right: 1280 }) as DOMRect,
    )
    const skills = document.getElementById('skills')!
    vi.spyOn(skills, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 800, bottom: 1600, left: 0, right: 1280 }) as DOMRect,
    )
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 200 })
    const spy = vi.spyOn(window, 'scrollTo')
    scrollToSection('skills', header)
    // top of skills = 800 (relative) + 200 (scrollY) - 64 (headerHeight) = 936
    expect(spy).toHaveBeenCalledWith({ top: 936, behavior: 'auto' })
  })

  it('clamps negative tops to 0', () => {
    const header = document.querySelector<HTMLElement>('.site-header')!
    vi.spyOn(header, 'offsetHeight', 'get').mockReturnValue(200)
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 0, bottom: 200, left: 0, right: 1280 }) as DOMRect,
    )
    const skills = document.getElementById('skills')!
    vi.spyOn(skills, 'getBoundingClientRect').mockReturnValue(
      makeRect({ top: 50, bottom: 800, left: 0, right: 1280 }) as DOMRect,
    )
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    const spy = vi.spyOn(window, 'scrollTo')
    scrollToSection('skills', header)
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })
})

describe('syncLocationHashWithActiveSection', () => {
  it('uses an empty hash for #about (clean URL at top of page)', () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState')
    syncLocationHashWithActiveSection('about')
    // Active URL is "/" already — no state push should occur.
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('sets `#section` for non-hero sections and skips when already current', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, hash: '' },
    })
    const replaceSpy = vi.spyOn(window.history, 'replaceState')
    syncLocationHashWithActiveSection('projects')
    expect(replaceSpy).toHaveBeenCalledTimes(1)
    const call = replaceSpy.mock.calls[0]
    const url = String(call[2])
    expect(url).toContain('#projects')
    expect(url).not.toMatch(/##/)
  })

  it('does not push state when hash already matches', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, hash: '#projects' },
    })
    const replaceSpy = vi.spyOn(window.history, 'replaceState')
    syncLocationHashWithActiveSection('projects')
    expect(replaceSpy).not.toHaveBeenCalled()
  })
})

describe('getActiveSectionId', () => {
  it('keeps "about" when the about block still extends below the header (hero still in view)', () => {
    setLayout({
      headerHeight: 64,
      about: { top: 0, bottom: 800, left: 0, right: 1280 },
      skills: { top: 600, bottom: 1400, left: 0, right: 1280 },
      experience: { top: 1500, bottom: 2500, left: 0, right: 1280 },
      projects: { top: 2500, bottom: 3500, left: 0, right: 1280 },
      contact: { top: 3500, bottom: 4500, left: 0, right: 1280 },
      scrollHeight: 4600,
      scrollY: 0,
      innerWidth: 1280,
      innerHeight: 800,
    })
    expect(getActiveSectionId(document.querySelector('.site-header')!)).toBe('about')
  })

  it('picks the section with the largest visible area in the viewport', () => {
    setLayout({
      headerHeight: 64,
      about: { top: -1500, bottom: -1000, left: 0, right: 1280 },
      skills: { top: -500, bottom: 200, left: 0, right: 1280 },
      experience: { top: 100, bottom: 1100, left: 0, right: 1280 },
      projects: { top: 1500, bottom: 2500, left: 0, right: 1280 },
      contact: { top: 2700, bottom: 3700, left: 0, right: 1280 },
      scrollHeight: 3900,
      scrollY: 500,
      innerWidth: 1280,
      innerHeight: 800,
    })
    // viewport y0=500, y1=1300 in document coords; header covers 0..64
    // skills: visible y=64..200 = 136; experience: 100..800 (viewport clip)
    // = 700. Experience wins.
    expect(getActiveSectionId(document.querySelector('.site-header')!)).toBe(
      'experience',
    )
  })

  it('forces the last section when scrolled to near the bottom', () => {
    setLayout({
      headerHeight: 64,
      about: { top: -4000, bottom: -3500, left: 0, right: 1280 },
      skills: { top: -3000, bottom: -2500, left: 0, right: 1280 },
      experience: { top: -2000, bottom: -1500, left: 0, right: 1280 },
      projects: { top: -1000, bottom: -500, left: 0, right: 1280 },
      contact: { top: 100, bottom: 1100, left: 0, right: 1280 },
      scrollHeight: 1900,
      scrollY: 1100,
      innerWidth: 1280,
      innerHeight: 800,
    })
    expect(getActiveSectionId(document.querySelector('.site-header')!)).toBe('contact')
  })
})

