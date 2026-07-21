import { useEffect, useState } from 'react'
import {
  applyTheme,
  syncThemeColor,
  type ResolvedTheme,
  type ThemePreference,
} from '../theme/colorScheme'
import { containerClass } from '../utils/layoutClasses'
import { Icon } from './Icons'

/** Session-only; reload returns to system / prefers-color-scheme (sunset scheduling, etc.). */
type SessionOverride = 'light' | 'dark' | null

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
  headerScrollHidden?: boolean
  onMenuOpenChange?: (open: boolean) => void
}

const base = import.meta.env.BASE_URL
const POPOVER_ID = 'site-nav-menu'

const iconBtnClass =
  'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-default bg-surface-0 p-0 text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

/** 44px touch targets on mobile toolbar (HIG / Material). */
const iconBtnMobileClass =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-default bg-surface-0 p-0 text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

const navLinkClass =
  'flex h-9 items-center rounded-sm border-b-2 border-transparent px-2 py-1 text-menu text-text-muted transition-colors duration-150 ease-in-out hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'

const navLinkMobileClass = `${navLinkClass} min-h-11 justify-center px-4 py-2`

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

/** Sun → click activates "force dark" for this session. Moon → click returns to system. */
const THEME_ICON_CLASS =
  'h-[1.125rem] w-[1.125rem] shrink-0 text-[1.125rem]'

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const

/** Shared list used by both the desktop static nav and the mobile popover. */
function NavLinks({
  activeSection,
  onNavigate,
  onAfterNavigate,
  linkClass,
}: {
  activeSection: string
  onNavigate: (section: string) => void
  onAfterNavigate?: () => void
  linkClass: string
}) {
  return (
    <ul className="m-0 flex list-none flex-col items-stretch gap-1 p-0 @[48rem]/site-header:flex-row @[48rem]/site-header:flex-wrap @[48rem]/site-header:items-center @[48rem]/site-header:justify-center @[48rem]/site-header:gap-0">
      {navItems.map((item) => (
        <li key={item.id}>
          <a
            href={`${base}#${item.id}`}
            className={`${linkClass} ${
              activeSection === item.id
                ? 'active border-text-default font-medium text-text-default'
                : ''
            }`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(item.id)
              onAfterNavigate?.()
            }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Navbar({
  activeSection,
  onNavigate,
  headerScrollHidden = false,
  onMenuOpenChange,
}: NavbarProps) {
  const [sessionOverride, setSessionOverride] = useState<SessionOverride>(null)
  const osDark = useOsDark()
  const effectiveTheme = resolveTheme(sessionOverride, osDark)
  const appliedTheme = domTheme(sessionOverride)

  useEffect(() => {
    applyTheme(appliedTheme)
    syncThemeColor(effectiveTheme)
  }, [appliedTheme, effectiveTheme])

  // Sync the popover open state up to App.tsx so body scroll-lock + header
  // auto-hide can react. The Popover API fires a `toggle` event on the popover
  // element whenever it's shown or hidden (including outside-click and Escape).
  useEffect(() => {
    const popover = document.getElementById(POPOVER_ID)
    if (!popover) return
    const onToggle = (event: Event) => {
      const newState = (event as ToggleEvent).newState
      onMenuOpenChange?.(newState === 'open')
    }
    popover.addEventListener('toggle', onToggle)
    return () => popover.removeEventListener('toggle', onToggle)
  }, [onMenuOpenChange])

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
  const themeToggleLabel = `Theme: ${currentThemeLabel}. Next: ${nextThemeLabel}.`

  // Programmatic close on link click (popover=auto would only close on
  // outside-click/Escape; clicking a link inside the popover still navigates
  // without closing by default).
  const closeMobileMenu = () => {
    const popover = document.getElementById(POPOVER_ID)
    if (popover && popover.matches(':popover-open')) {
      popover.hidePopover()
    }
  }

  return (
    <header
      className={`site-header @container/site-header fixed inset-x-0 top-0 z-(--z-modal) w-full${
        headerScrollHidden ? ' site-header--scroll-hidden' : ''
      }`}
    >
      <nav
        className="site-nav bg-bg py-2 shadow-nav @max-[47.99rem]/site-header:pt-[calc(env(safe-area-inset-top,0px)+var(--spacing-1))] @max-[47.99rem]/site-header:pb-2"
        aria-label="Primary"
      >
        <div
          className={`${containerClass} grid grid-cols-1 items-center gap-2 @[48rem]/site-header:grid-cols-[1fr_auto_1fr] @[48rem]/site-header:gap-0`}
        >
          {/* Mobile toolbar */}
          <div className="flex items-center justify-end gap-1 @[48rem]/site-header:hidden">
            <button
              type="button"
              className={iconBtnMobileClass}
              onClick={() =>
                setSessionOverride((o) => cycleSessionOverride(o, osDark))
              }
              aria-label={themeToggleLabel}
              data-tooltip={themeToggleLabel}
            >
              <Icon
                name={effectiveTheme === 'light' ? 'moon' : 'sun'}
                className={THEME_ICON_CLASS}
              />
            </button>
            <button
              type="button"
              className={iconBtnMobileClass}
              // Popover API: popovertarget toggles the popover open/closed.
              // No manual state needed — the `toggle` event fires automatically.
              popoverTarget={POPOVER_ID}
              aria-label="Toggle navigation"
              data-tooltip="Toggle navigation"
            >
              <span className="nav-toggle-icon" aria-hidden />
            </button>
          </div>

          {/* Desktop nav — centered in middle column, always visible on desktop */}
          <div className="hidden py-0 @[48rem]/site-header:col-start-2 @[48rem]/site-header:row-start-1 @[48rem]/site-header:block">
            <NavLinks
              activeSection={activeSection}
              onNavigate={onNavigate}
              linkClass={navLinkClass}
            />
          </div>

          {/* Mobile nav — popover anchored to the hamburger; opens via popovertarget */}
          <div
            id={POPOVER_ID}
            popover="auto"
            className="site-nav-popover fixed inset-x-0 top-[var(--header-offset)] z-(--z-overlay) m-0 border-b border-border-default bg-surface-0 p-2 shadow-nav @supports([transition-behavior:allow-discrete]):opacity-0"
          >
            <NavLinks
              activeSection={activeSection}
              onNavigate={onNavigate}
              onAfterNavigate={closeMobileMenu}
              linkClass={navLinkMobileClass}
            />
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
              title={themeToggleLabel}
              data-tooltip={themeToggleLabel}
            >
              <Icon
                name={effectiveTheme === 'light' ? 'moon' : 'sun'}
                className={THEME_ICON_CLASS}
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
