import { useEffect, useState } from 'react'
import {
  applyTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '../theme/colorScheme'
import { containerClass } from '../utils/layoutClasses'

/** Session-only; reload returns to system / prefers-color-scheme (sunset scheduling, etc.). */
type SessionOverride = 'light' | 'dark' | null

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
  headerScrollHidden?: boolean
  onMenuOpenChange?: (open: boolean) => void
}

const base = import.meta.env.BASE_URL

const iconBtnClass =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-default bg-surface-0 p-0 text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

const navLinkClass =
  'nav-link-hover relative flex h-9 items-center rounded-sm px-2 py-1 text-menu text-text-default hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

function cycleSessionOverride(
  override: SessionOverride,
  osDark: boolean,
): SessionOverride {
  if (override === 'light') return 'dark'
  if (override === 'dark') return osDark ? 'light' : null
  return osDark ? 'light' : 'dark'
}

function useOsDark(): boolean {
  const [osDark, setOsDark] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setOsDark(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return osDark
}

function resolveTheme(
  override: SessionOverride,
  osDark: boolean,
): ResolvedTheme {
  if (override === 'light') return 'light'
  if (override === 'dark') return 'dark'
  return osDark ? 'dark' : 'light'
}

function domTheme(override: SessionOverride): ThemePreference {
  return override ?? 'system'
}

function IconSun() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experiences' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const

export function Navbar({
  activeSection,
  onNavigate,
  headerScrollHidden = false,
  onMenuOpenChange,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [sessionOverride, setSessionOverride] = useState<SessionOverride>(null)
  const osDark = useOsDark()
  const effectiveTheme = resolveTheme(sessionOverride, osDark)
  const appliedTheme = domTheme(sessionOverride)

  useEffect(() => {
    applyTheme(appliedTheme)
  }, [appliedTheme])

  const nextOverride = cycleSessionOverride(sessionOverride, osDark)
  const nextThemeLabel =
    nextOverride === 'light'
      ? 'light only for this visit'
      : nextOverride === 'dark'
        ? 'dark only for this visit'
        : 'match system appearance'
  const currentThemeLabel =
    sessionOverride === null
      ? `System (${effectiveTheme})`
      : sessionOverride === 'light'
        ? 'Light override, this visit only'
        : 'Dark override, this visit only'
  const themeToggleLabel = `Color theme: ${currentThemeLabel}. Activate to use ${nextThemeLabel}.`
  const themeToggleTitle = `Theme: ${currentThemeLabel}. Next: ${nextThemeLabel}.`

  return (
    <header
      className={`site-header @container/site-header fixed inset-x-0 top-0 z-[1000] w-full${
        headerScrollHidden ? ' site-header--scroll-hidden' : ''
      }`}
    >
      <nav
        className="site-nav bg-surface-0 py-2 shadow-nav @max-[47.99rem]/site-header:pt-[calc(env(safe-area-inset-top,0px)+var(--spacing-1))] @max-[47.99rem]/site-header:pb-2"
        aria-label="Primary"
      >
        <div
          className={`${containerClass} grid grid-cols-1 items-center gap-2 @[48rem]/site-header:grid-cols-[1fr_auto_1fr] @[48rem]/site-header:gap-0`}
        >
          {/* Mobile toolbar */}
          <div className="flex items-center justify-end gap-1 @[48rem]/site-header:hidden">
            <button
              type="button"
              className={iconBtnClass}
              onClick={() =>
                setSessionOverride((o) => cycleSessionOverride(o, osDark))
              }
              aria-label={themeToggleLabel}
              title={themeToggleTitle}
            >
              {effectiveTheme === 'light' ? <IconMoon /> : <IconSun />}
            </button>
            <button
              type="button"
              className={iconBtnClass}
              onClick={() =>
                setIsMenuOpen((open) => {
                  const next = !open
                  onMenuOpenChange?.(next)
                  return next
                })
              }
              aria-controls="site-nav-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="nav-toggle-icon" aria-hidden />
            </button>
          </div>

          {/* Nav links — centered in middle column on desktop */}
          <div
            className={`py-2 @[48rem]/site-header:col-start-2 @[48rem]/site-header:row-start-1 @[48rem]/site-header:py-0 ${
              isMenuOpen ? 'block' : 'hidden'
            } @[48rem]/site-header:block`}
            id="site-nav-menu"
          >
            <ul className="m-0 flex list-none flex-col items-stretch gap-1 p-0 @[48rem]/site-header:flex-row @[48rem]/site-header:flex-wrap @[48rem]/site-header:items-center @[48rem]/site-header:justify-center @[48rem]/site-header:gap-0">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`${base}#${item.id}`}
                    className={`${navLinkClass} ${
                      activeSection === item.id ? 'active font-bold text-primary-600' : ''
                    }`}
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMenuOpen(false)
                      onMenuOpenChange?.(false)
                    }}
                  >
                    <span data-hover={item.label}>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop toolbar — right column balances mobile toolbar for true center nav */}
          <div className="hidden items-center justify-end gap-1 @[48rem]/site-header:col-start-3 @[48rem]/site-header:row-start-1 @[48rem]/site-header:flex">
            <button
              type="button"
              className={iconBtnClass}
              onClick={() =>
                setSessionOverride((o) => cycleSessionOverride(o, osDark))
              }
              aria-label={themeToggleLabel}
              title={themeToggleTitle}
            >
              {effectiveTheme === 'light' ? <IconMoon /> : <IconSun />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
