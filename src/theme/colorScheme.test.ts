import { describe, expect, it, beforeEach } from 'vitest'
import {
  applyTheme,
  initTheme,
  migrateLegacyThemeStorage,
  oppositeTheme,
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

describe('oppositeTheme', () => {
  it('is light when the OS is dark and dark when the OS is light', () => {
    expect(oppositeTheme(true)).toBe('light')
    expect(oppositeTheme(false)).toBe('dark')
  })
})

describe('resolveTheme', () => {
  it('follows the OS in system mode', () => {
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('system', true)).toBe('dark')
  })

  it('uses the paired opposite in opposite mode', () => {
    expect(resolveTheme('opposite', false)).toBe('dark')
    expect(resolveTheme('opposite', true)).toBe('light')
  })
})

describe('toggleThemeMode', () => {
  it('switches between the only two modes', () => {
    expect(toggleThemeMode('system')).toBe('opposite')
    expect(toggleThemeMode('opposite')).toBe('system')
  })
})

describe('themePreferenceForDom', () => {
  it('uses system CSS in system mode', () => {
    expect(themePreferenceForDom('system', false)).toBe('system')
  })

  it('uses explicit light/dark in opposite mode', () => {
    expect(themePreferenceForDom('opposite', false)).toBe('dark')
    expect(themePreferenceForDom('opposite', true)).toBe('light')
  })
})

describe('initTheme', () => {
  it('applies system by default when the OS is dark', () => {
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
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
    const meta = document.head.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#121218')
  })

  it('restores opposite mode from sessionStorage', () => {
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
    writeThemeMode('opposite')
    initTheme()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(sessionStorage.getItem(SESSION_THEME_OVERRIDE_KEY)).toBe('opposite')
  })
})
