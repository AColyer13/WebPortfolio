/** Applied to `document.documentElement` — `system` follows `prefers-color-scheme`. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Resolved light/dark for icons / labels only */
export type ResolvedTheme = 'light' | 'dark'

/** System = follow OS. Opposite = light when OS is dark, dark when OS is light. */
export type ThemeMode = 'system' | 'opposite'

/** Browser chrome — matches the page background (`--color-bg` in index.css) */
/** Approximate sRGB of `--color-bg` for browser chrome (meta theme-color). */
const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#f7f7f8',
  dark: '#121218',
}

/** Legacy storage key — dropped on first paint so scheduled OS themes always apply. */
const LEGACY_THEME_STORAGE_KEY = 'portfolio-color-scheme-v2'

export const SESSION_THEME_OVERRIDE_KEY = 'portfolio-theme-session-override'

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

/** Fixed light/dark option paired with system for the current OS appearance. */
export function oppositeTheme(osDark: boolean): ResolvedTheme {
  return osDark ? 'light' : 'dark'
}

export function readThemeMode(): ThemeMode {
  try {
    const v = sessionStorage.getItem(SESSION_THEME_OVERRIDE_KEY)
    if (v === 'opposite') return 'opposite'
  } catch {
    /* ignore */
  }
  return 'system'
}

export function writeThemeMode(mode: ThemeMode) {
  try {
    if (mode === 'system') {
      sessionStorage.removeItem(SESSION_THEME_OVERRIDE_KEY)
    } else {
      sessionStorage.setItem(SESSION_THEME_OVERRIDE_KEY, mode)
    }
  } catch {
    /* ignore */
  }
}

export function resolveTheme(mode: ThemeMode, osDark: boolean): ResolvedTheme {
  if (mode === 'system') return osDark ? 'dark' : 'light'
  return oppositeTheme(osDark)
}

export function themePreferenceForDom(
  mode: ThemeMode,
  osDark: boolean,
): ThemePreference {
  if (mode === 'system') return 'system'
  return oppositeTheme(osDark)
}

export function toggleThemeMode(mode: ThemeMode): ThemeMode {
  return mode === 'system' ? 'opposite' : 'system'
}

export function osPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** First paint + hydration: system unless opposite is stored for this session. */
export function initTheme() {
  migrateLegacyThemeStorage()
  const osDark = osPrefersDark()
  const mode = readThemeMode()
  applyTheme(themePreferenceForDom(mode, osDark))
  syncThemeColor(resolveTheme(mode, osDark))
}
