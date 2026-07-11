/** Applied to `document.documentElement` — `system` follows `prefers-color-scheme`. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Resolved light/dark for icons / labels only */
export type ResolvedTheme = 'light' | 'dark'

/** Browser chrome — matches the page background (`--color-bg` in index.css) */
const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#fafafa',
  dark: '#0e0e13',
}

/** Legacy storage key — dropped on first paint so scheduled OS themes always apply. */
const LEGACY_THEME_STORAGE_KEY = 'portfolio-color-scheme-v2'

export function syncThemeColor(resolved: ResolvedTheme) {
  // Strip the two media-conditional theme-color metas in index.html (and any
  // duplicates) so we end up with exactly one controlled by the resolved theme.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = THEME_COLOR[resolved]
  document.head.appendChild(meta)
}

export function applyTheme(theme: ThemePreference) {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Drop legacy persisted light/dark so scheduled OS themes always apply on load. */
export function migrateLegacyThemeStorage() {
  try {
    const v = localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark') {
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY)
    }
  } catch {
    /* ignore */
  }
}

/** First paint + hydration: always follow the system color scheme (CSS + matchMedia). */
export function initTheme() {
  migrateLegacyThemeStorage()
  applyTheme('system')
  syncThemeColor(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )
}
