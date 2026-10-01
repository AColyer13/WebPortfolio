/** Applied to `document.documentElement` — `system` follows `prefers-color-scheme`. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** Resolved light/dark for icons / labels only */
export type ResolvedTheme = 'light' | 'dark'

/** Session-only explicit override; `null` = inverted system (opposite of OS). */
export type SessionOverride = 'light' | 'dark' | null

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

export function readSessionOverride(): SessionOverride {
  try {
    const v = sessionStorage.getItem(SESSION_THEME_OVERRIDE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return null
}

export function writeSessionOverride(override: SessionOverride) {
  try {
    if (override == null) {
      sessionStorage.removeItem(SESSION_THEME_OVERRIDE_KEY)
    } else {
      sessionStorage.setItem(SESSION_THEME_OVERRIDE_KEY, override)
    }
  } catch {
    /* ignore */
  }
}

/** Default inverts OS: light system → dark UI, dark system → light UI. */
export function resolveTheme(
  override: SessionOverride,
  osDark: boolean,
): ResolvedTheme {
  if (override === 'light') return 'light'
  if (override === 'dark') return 'dark'
  return osDark ? 'light' : 'dark'
}

/** DOM attribute is always explicit light/dark so CSS never tracks OS when inverted. */
export function themePreferenceForDom(
  override: SessionOverride,
  osDark: boolean,
): Exclude<ThemePreference, 'system'> {
  return resolveTheme(override, osDark)
}

export function cycleSessionOverride(
  override: SessionOverride,
  osDark: boolean,
): SessionOverride {
  if (override === 'light') return 'dark'
  if (override === 'dark') return null
  return osDark ? 'dark' : 'light'
}

export function osPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** First paint + hydration: inverted system unless a session override is stored. */
export function initTheme() {
  migrateLegacyThemeStorage()
  const osDark = osPrefersDark()
  const override = readSessionOverride()
  applyTheme(themePreferenceForDom(override, osDark))
  syncThemeColor(resolveTheme(override, osDark))
}
