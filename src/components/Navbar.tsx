import { useEffect, useState } from 'react'
import {
  applyTheme,
  oppositeTheme,
  readThemeMode,
  resolveTheme,
  syncThemeColor,
  themePreferenceForDom,
  toggleThemeMode,
  writeThemeMode,
  type ResolvedTheme,
  type ThemeMode,
} from '../theme/colorScheme'
import { containerClass } from '../utils/layoutClasses'
import { intentHandlers, prefetchSection } from '../utils/prefetch'
import { Icon, type IconKey } from './Icons'

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
  headerScrollHidden?: boolean
  onMenuOpenChange?: (open: boolean) => void
}

const base = import.meta.env.BASE_URL
const POPOVER_ID = 'site-nav-menu'

/** 44×44 pt minimum — fine and coarse pointers. */
const iconBtnClass = 'btn btn-icon'

const navLinkClass = 'nav-link'

const navLinkMobileClass = 'nav-link nav-link--menu'

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

const THEME_ICON_CLASS =
  'h-[1.125rem] w-[1.125rem] shrink-0 text-[1.125rem]'

function themeToggleIcon(mode: ThemeMode, effectiveTheme: ResolvedTheme): IconKey {
  if (mode === 'system') return 'sun-moon'
  return effectiveTheme === 'light' ? 'sun' : 'moon'
}

function themeToggleLabel(
  mode: ThemeMode,
  effectiveTheme: ResolvedTheme,
  osDark: boolean,
): string {
  const fixed = oppositeTheme(osDark)
  const fixedLabel = fixed === 'light' ? 'light' : 'dark'
  if (mode === 'system') {
    const systemLabel = effectiveTheme === 'light' ? 'light' : 'dark'
    return `Theme: System (${systemLabel}). Switch to ${fixedLabel}.`
  }
  const currentLabel = effectiveTheme === 'light' ? 'Light' : 'Dark'
  return `Theme: ${currentLabel}. Switch to system.`
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
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
              activeSection === item.id ? 'active' : ''
            }`}
            {...intentHandlers(() => prefetchSection(item.id))}
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
  const [themeMode, setThemeMode] = useState(readThemeMode)
  const osDark = useOsDark()
  const effectiveTheme = resolveTheme(themeMode, osDark)
  const appliedTheme = themePreferenceForDom(themeMode, osDark)

  useEffect(() => {
    applyTheme(appliedTheme)
    syncThemeColor(effectiveTheme)
  }, [appliedTheme, effectiveTheme])

  useEffect(() => {
    writeThemeMode(themeMode)
  }, [themeMode])

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

  const themeToggleLabelText = themeToggleLabel(themeMode, effectiveTheme, osDark)
  const themeIcon = themeToggleIcon(themeMode, effectiveTheme)

  const cycleTheme = () => {
    setThemeMode((mode) => toggleThemeMode(mode))
  }

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
        className="site-nav glass-bar"
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
              onClick={cycleTheme}
              aria-label={themeToggleLabelText}
              data-tooltip={themeToggleLabelText}
            >
              <Icon name={themeIcon} className={THEME_ICON_CLASS} />
            </button>
            <button
              type="button"
              className={iconBtnClass}
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
            className="site-nav-popover fixed z-(--z-overlay) @supports([transition-behavior:allow-discrete]):opacity-0"
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
              onClick={cycleTheme}
              aria-label={themeToggleLabelText}
              title={themeToggleLabelText}
              data-tooltip={themeToggleLabelText}
            >
              <Icon name={themeIcon} className={THEME_ICON_CLASS} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
