import { describe, expect, it, beforeEach } from 'vitest'
import {
  applyTheme,
  cycleSessionOverride,
  initTheme,
  migrateLegacyThemeStorage,
  resolveTheme,
  SESSION_THEME_OVERRIDE_KEY,
  syncThemeColor,
  themePreferenceForDom,
  writeSessionOverride,
} from './colorScheme'

beforeEach(() => {
  // Reset side-effects before each test.
  document.documentElement.removeAttribute('data-theme')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch {
    /* SSR / no-storage envs */
  }
})

describe('applyTheme', () => {
  it('writes the theme to <html data-theme>', () => {
    applyTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    applyTheme('system')
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
  })
})

describe('syncThemeColor', () => {
  it('replaces all existing theme-color metas with exactly one new one', () => {
    document.head.innerHTML =
      '<meta name="theme-color" content="#aaa"><meta name="theme-color" content="#bbb">'
    syncThemeColor('dark')
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')
    expect(metas).toHaveLength(1)
  })

  it('uses light surface for light mode', () => {
    syncThemeColor('light')
    const meta = document.head.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#f7f7f8')
  })

  it('uses dark surface for dark mode', () => {
    syncThemeColor('dark')
    const meta = document.head.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#121218')
  })
})

describe('migrateLegacyThemeStorage', () => {
  it('drops legacy persisted light/dark so OS themes apply on load', () => {
    localStorage.setItem('portfolio-color-scheme-v2', 'dark')
    migrateLegacyThemeStorage()
    expect(localStorage.getItem('portfolio-color-scheme-v2')).toBeNull()
  })

  it('leaves the storage untouched when value is not light/dark', () => {
    localStorage.setItem('portfolio-color-scheme-v2', 'system')
    migrateLegacyThemeStorage()
    expect(localStorage.getItem('portfolio-color-scheme-v2')).toBe('system')
  })
})

describe('resolveTheme', () => {
  it('inverts the OS when there is no session override', () => {
    expect(resolveTheme(null, false)).toBe('dark')
    expect(resolveTheme(null, true)).toBe('light')
  })

  it('honors explicit session overrides', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('cycleSessionOverride', () => {
  it('returns to inverted system from an explicit dark override', () => {
    expect(cycleSessionOverride('dark', false)).toBeNull()
  })

  it('steps from inverted default to matching the OS', () => {
    expect(cycleSessionOverride(null, false)).toBe('light')
    expect(cycleSessionOverride(null, true)).toBe('dark')
  })
})

describe('initTheme', () => {
  it('applies inverted system and syncs theme-color when OS is dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })

    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    const meta = document.head.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#f7f7f8')
  })

  it('restores a session override from sessionStorage', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })
    writeSessionOverride('dark')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(themePreferenceForDom('dark', false)).toBe('dark')
    expect(sessionStorage.getItem(SESSION_THEME_OVERRIDE_KEY)).toBe('dark')
  })
})
