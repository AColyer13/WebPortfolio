import { describe, expect, it, beforeEach } from 'vitest'
import {
  applyTheme,
  initTheme,
  migrateLegacyThemeStorage,
  resolveTheme,
  SESSION_THEME_OVERRIDE_KEY,
  syncThemeColor,
  themePreferenceForDom,
  toggleThemeMode,
  writeThemeMode,
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
  it('inverts the OS in inverted mode', () => {
    expect(resolveTheme('inverted', false)).toBe('dark')
    expect(resolveTheme('inverted', true)).toBe('light')
  })

  it('follows the OS in match mode', () => {
    expect(resolveTheme('match', false)).toBe('light')
    expect(resolveTheme('match', true)).toBe('dark')
  })
})

describe('toggleThemeMode', () => {
  it('switches between the only two modes', () => {
    expect(toggleThemeMode('inverted')).toBe('match')
    expect(toggleThemeMode('match')).toBe('inverted')
  })
})

describe('themePreferenceForDom', () => {
  it('uses system CSS when matching the OS', () => {
    expect(themePreferenceForDom('match', false)).toBe('system')
  })

  it('uses explicit light/dark when inverted', () => {
    expect(themePreferenceForDom('inverted', false)).toBe('dark')
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

  it('restores match mode from sessionStorage', () => {
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
    writeThemeMode('match')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
    expect(sessionStorage.getItem(SESSION_THEME_OVERRIDE_KEY)).toBe('match')
  })
})
