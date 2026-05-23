import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Experiences } from './components/Experiences'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'

/** DOM order — must match section `id`s and Navbar `section` keys */
const SECTION_IDS = [
  'about',
  'skills',
  'experience',
  'projects',
  'contact',
] as const

/**
 * Keep the URL fragment aligned with scroll position. Nav links set `#section`; if the user
 * scrolls away (e.g. back to the top), replaceState so a refresh doesn’t jump to the old hash.
 * For the first section we use an empty hash so the top of the page stays a clean URL.
 */
function syncLocationHashWithActiveSection(
  active: (typeof SECTION_IDS)[number],
): void {
  const nextHash = active === 'about' ? '' : `#${active}`
  if (window.location.hash === nextHash) return
  const path = `${window.location.pathname}${window.location.search}${nextHash}`
  history.replaceState(window.history.state, '', path)
}

/**
 * Jump to an in-page anchor without animating. Global `html { scroll-behavior: smooth }`
 * would otherwise make `scrollIntoView` asynchronous and let the scroll handler overwrite
 * the URL hash while the scroll is still mid-animation.
 */
function scrollElementIntoViewInstant(el: HTMLElement): void {
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  try {
    el.scrollIntoView({ block: 'start' })
  } finally {
    html.style.scrollBehavior = prev
  }
}

/** Legacy “section top crossed below header” rule — used only as a fallback. */
function getActiveSectionIdFallbackLine(
  header: HTMLElement,
): (typeof SECTION_IDS)[number] {
  const line = window.scrollY + header.offsetHeight
  let active: (typeof SECTION_IDS)[number] = 'about'
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = window.scrollY + el.getBoundingClientRect().top
    if (top <= line + 2) {
      active = id
    }
  }
  return active
}

/**
 * Pick the section with the largest visible area in the viewport below the fixed header.
 * This matches how users read the page better than “last section whose top passed a line”,
 * which breaks on very tall blocks (e.g. Experiences still “active” while viewing Projects).
 */
function getActiveSectionId(header: HTMLElement): (typeof SECTION_IDS)[number] {
  const scrollEl = document.documentElement
  // When the last section is shorter than the viewport, its top may never move above
  // the header threshold at max scroll, so the loop would keep an earlier section.
  if (
    scrollEl.scrollHeight > window.innerHeight &&
    window.scrollY + window.innerHeight >= scrollEl.scrollHeight - 2
  ) {
    return SECTION_IDS[SECTION_IDS.length - 1]
  }

  const headerBottom = Math.max(0, header.getBoundingClientRect().bottom)
  // The hero (#about) is often shorter than the viewport while #skills is tall, so the
  // "largest visible area" rule can pick skills at scrollY=0 and rewrite the URL to
  // `#skills`. While the about block still extends meaningfully below the header, keep
  // About as the active section.
  const aboutEl = document.getElementById('about')
  if (aboutEl && aboutEl.getBoundingClientRect().bottom > headerBottom + 40) {
    return 'about'
  }
  const vw = window.innerWidth
  const vh = window.innerHeight

  let best: (typeof SECTION_IDS)[number] = 'about'
  let bestArea = -1

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    const y0 = Math.max(r.top, headerBottom)
    const y1 = Math.min(r.bottom, vh)
    const x0 = Math.max(r.left, 0)
    const x1 = Math.min(r.right, vw)
    const area = Math.max(0, y1 - y0) * Math.max(0, x1 - x0)
    // Prefer the later section in the page when areas tie (typical at section boundaries).
    if (area >= bestArea) {
      bestArea = area
      best = id
    }
  }

  if (bestArea < 1) {
    return getActiveSectionIdFallbackLine(header)
  }
  return best
}

/** Ignore sub-pixel / overscroll jitter so the header doesn’t flicker. */
const SCROLL_DIR_THRESHOLD_PX = 6
/**
 * While scrollY is still below this offset above `#contact`, don’t reveal the header on
 * scroll-up. Stops the bar popping in after a small nudge up from the contact/footer on
 * mobile (and avoids the same jump when leaving the narrow “near bottom” window on desktop).
 */
const CONTACT_SCROLL_UP_REVEAL_BUFFER_PX = 200

function App() {
  const [activeSection, setActiveSection] = useState<string>('about')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerScrollHidden, setHeaderScrollHidden] = useState(false)
  const lastScrollYRef = useRef(0)

  useLayoutEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header) return

    const syncOffset = () => {
      document.documentElement.style.setProperty(
        '--header-offset',
        `${header.offsetHeight}px`,
      )
    }

    syncOffset()

    const hash = window.location.hash.replace(/^#/, '')
    if (hash) {
      const target = document.getElementById(hash)
      if (target) scrollElementIntoViewInstant(target)
    }

    // Sync scroll spy after layout + optional hash jump; must run in this layout effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init after DOM measurements
    setActiveSection(getActiveSectionId(header))
    lastScrollYRef.current = window.scrollY

    const observer = new ResizeObserver(() => {
      syncOffset()
      setActiveSection(getActiveSectionId(header))
    })
    observer.observe(header)
    window.addEventListener('resize', syncOffset)

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

      if (mobileMenuOpen) {
        setHeaderScrollHidden(false)
      } else if (y <= 0) {
        setHeaderScrollHidden(false)
      } else if (suppressRevealOnScrollUp) {
        // In contact / lower page: only hide on scroll-down; ignore scroll-up until well into projects.
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
  }, [mobileMenuOpen])

  return (
    <div className={`app-shell${headerScrollHidden ? ' app--header-hidden' : ''}`}>
      <Navbar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        headerScrollHidden={headerScrollHidden}
        onMenuOpenChange={setMobileMenuOpen}
      />
      <About />
      <Skills />
      <Experiences />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
