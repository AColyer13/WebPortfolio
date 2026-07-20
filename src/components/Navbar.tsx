import { useEffect, useState } from 'react'
import {
  applyTheme,
  syncThemeColor,
  type ResolvedTheme,
  type ThemePreference,
} from '../theme/colorScheme'
import { containerClass } from '../utils/layoutClasses'
import { Icon } from './Icons'

type SessionOverride = 'light' | 'dark' | null

interface NavbarProps {
  activeSection: string
  onNavigate: (section: string) => void
  headerScrollHidden?: boolean
  onMenuOpenChange?: (open: boolean) => void
}

const POPOVER_ID = 'site-nav-menu'

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const

function NavLinks({
  activeSection,
  onNavigate,
  onAfterNavigate,
}: {
  activeSection: string
  onNavigate: (section: string) => void
  onAfterNavigate?: () => void
}) {
  return (
    <ul className="hm-prompt-row__flags">
      {navItems.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`hm-prompt-row__flag${activeSection === item.id ? ' active' : ''}`}
            aria-current={activeSection === item.id ? 'true' : undefined}
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

function cycleSessionOverride(
  override: SessionOverride,
  osDark: boolean,
): SessionOverride {
  if (override === 'light') return 'dark'
  if (override === 'dark') return osDark ? 'light' : null
  return osDark ? 'light' : 'dark'
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

  const closeMobileMenu = () => {
    const popover = document.getElementById(POPOVER_ID)
    if (popover && popover.matches(':popover-open')) {
      popover.hidePopover()
    }
  }

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-[1000] w-full${
        headerScrollHidden ? ' site-header--scroll-hidden' : ''
      }`}
    >
      <nav
        className="site-nav hm-nav py-2 shadow-nav @max-[47.99rem]/site-header:pt-[calc(env(safe-area-inset-top,0px)+var(--spacing-1))] @max-[47.99rem]/site-header:pb-2"
        aria-label="Primary"
      >
        <div className={`${containerClass} flex items-center justify-between gap-3`}>
          {/* Prompt row — terminal command nav */}
          <div className="hm-prompt-row flex-1 min-w-0">
            <span className="hm-prompt-row__sigil" aria-hidden>~/portfolio</span>
            <span className="hm-prompt-row__cmd">$</span>
            <span className="hm-prompt-row__cmd" style={{ color: 'var(--color-text-default)' }}>go</span>
            <span className="hm-caret" aria-hidden />
            {/* Desktop: flags visible inline. Mobile: hidden, popover is the entry point. */}
            <div className="hidden @[48rem]/site-header:block ml-3">
              <NavLinks activeSection={activeSection} onNavigate={onNavigate} />
            </div>
          </div>

          {/* Toolbar — theme toggle + mobile menu trigger */}
          <div className="hm-toolbar">
            <button
              type="button"
              className="hm-toolbar__btn hidden @[48rem]/site-header:inline-flex"
              onClick={() =>
                setSessionOverride((o) => cycleSessionOverride(o, osDark))
              }
              aria-label={themeToggleLabel}
              data-tooltip={themeToggleLabel}
            >
              <Icon
                name={effectiveTheme === 'light' ? 'moon' : 'sun'}
                className="size-3.5"
                aria-hidden
              />
            </button>
            <button
              type="button"
              className="hm-toolbar__btn @[48rem]/site-header:hidden"
              popoverTarget={POPOVER_ID}
              aria-label="Toggle navigation"
            >
              [ &gt; ]
            </button>
            <button
              type="button"
              className="hm-toolbar__btn @[48rem]/site-header:hidden"
              onClick={() =>
                setSessionOverride((o) => cycleSessionOverride(o, osDark))
              }
              aria-label={themeToggleLabel}
            >
              <Icon
                name={effectiveTheme === 'light' ? 'moon' : 'sun'}
                className="size-3.5"
                aria-hidden
              />
            </button>
          </div>
        </div>

        {/* Mobile popover menu */}
        <div
          id={POPOVER_ID}
          popover="auto"
          className="site-nav-popover hm-popover fixed inset-x-0 top-[var(--header-offset)] z-[999] m-0 @supports([transition-behavior:allow-discrete]):opacity-0"
        >
          <ul className="hm-popover__list">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'active' : undefined}
                  aria-current={activeSection === item.id ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(item.id)
                    closeMobileMenu()
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}