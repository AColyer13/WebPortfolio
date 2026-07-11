import { describe, expect, it, beforeEach } from 'vitest'
import {
  applyTheme,
  initTheme,
  migrateLegacyThemeStorage,
  syncThemeColor,
} from './colorScheme'

beforeEach(() => {
  // Reset side-effects before each test.
  document.documentElement.removeAttribute('data-theme')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  try {
    localStorage.clear()
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
    expect(meta?.getAttribute('content')).toBe('#fafafa')
  })

  it('uses dark surface for dark mode', () => {
    syncThemeColor('dark')
    const meta = document.head.querySelector('meta[name="theme-color"]')
    expect(meta?.getAttribute('content')).toBe('#0e0e13')
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

describe('initTheme', () => {
  it('applies system and syncs theme-color to whatever the OS reports', () => {
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
    expect(meta?.getAttribute('content')).toBe('#0e0e13')
  })
})
