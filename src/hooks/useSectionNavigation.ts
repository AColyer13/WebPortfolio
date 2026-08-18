import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  getActiveSectionId,
  headerScrollInset,
  isSectionId,
  scrollToSection,
  syncLocationHashWithActiveSection,
  type SectionId,
} from '../utils/sections'

/** Ignore sub-pixel / overscroll jitter so the header doesn't flicker. */
const SCROLL_DIR_THRESHOLD_PX = 6
/**
 * While scrollY is still this many px above `#contact`, don't reveal the
 * header on scroll-up. Stops the bar popping in after a small nudge up
 * from the contact/footer on mobile.
 */
const CONTACT_SCROLL_UP_REVEAL_BUFFER_PX = 200

interface UseSectionNavigationOptions {
  /** Re-show the header when true (e.g. mobile menu is open). */
  forceHeaderVisible?: boolean
}

interface UseSectionNavigationResult {
  activeSection: SectionId
  headerScrollHidden: boolean
  navigateToSection: (section: string) => void
}

export function useSectionNavigation(
  options: UseSectionNavigationOptions = {},
): UseSectionNavigationResult {
  const { forceHeaderVisible = false } = options

  const [activeSection, setActiveSection] = useState<SectionId>('about')
  const [headerScrollHidden, setHeaderScrollHidden] = useState(false)
  const lastScrollYRef = useRef(0)

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    const syncOffset = () => {
      document.documentElement.style.setProperty(
        '--header-offset',
        `${headerScrollInset(header)}px`,
      )
    }

    syncOffset()

    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) {
      window.scrollTo(0, 0)
      requestAnimationFrame(() => window.scrollTo(0, 0))
    } else if (isSectionId(hash)) {
      scrollToSection(hash, header)
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial sync from DOM geometry after layout
    setActiveSection(getActiveSectionId(header))
    lastScrollYRef.current = window.scrollY

    const observer = new ResizeObserver(() => {
      syncOffset()
      setActiveSection(getActiveSectionId(header))
    })
    observer.observe(header)
    window.addEventListener('resize', syncOffset)

    void document.fonts?.ready?.then(() => {
      syncOffset()
      if (!window.location.hash) window.scrollTo(0, 0)
    })

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncOffset)
    }
  }, [])

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    const update = () => {
      const active = getActiveSectionId(header)
      setActiveSection(active)
      syncLocationHashWithActiveSection(active)

      const y = window.scrollY
      const last = lastScrollYRef.current
      const navH = header.offsetHeight
      const delta = y - last

      const contactEl = document.getElementById('contact')
      const contactTopDoc =
        contactEl != null
          ? window.scrollY + contactEl.getBoundingClientRect().top
          : null
      const suppressRevealOnScrollUp =
        contactTopDoc != null &&
          y > contactTopDoc - CONTACT_SCROLL_UP_REVEAL_BUFFER_PX

      if (forceHeaderVisible) {
        setHeaderScrollHidden(false)
      } else if (y <= 0) {
        setHeaderScrollHidden(false)
      } else if (suppressRevealOnScrollUp) {
        if (delta >= SCROLL_DIR_THRESHOLD_PX && y > navH) {
          setHeaderScrollHidden(true)
        }
      } else if (delta <= -SCROLL_DIR_THRESHOLD_PX) {
        setHeaderScrollHidden(false)
      } else if (delta >= SCROLL_DIR_THRESHOLD_PX && y > navH) {
        setHeaderScrollHidden(true)
      }

      lastScrollYRef.current = y
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          update()
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [forceHeaderVisible])

  const navigateToSection = (section: string) => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const target: SectionId = isSectionId(section) ? section : 'about'
    if (header) scrollToSection(target, header)
    setActiveSection(target)
    syncLocationHashWithActiveSection(target)
  }

  return { activeSection, headerScrollHidden, navigateToSection }
}

