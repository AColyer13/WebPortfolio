/**
 * Section navigation — pure helpers (no React, no DOM mutation beyond `history`).
 *
 * - `SECTION_IDS`: ordered list of in-page sections. DOM order, Navbar keys, and
 *   scroll-spy all share this single source of truth.
 * - `headerScrollInset`: fixed-header height (ceil avoids sub-pixel gap).
 * - `scrollToSection`: scroll to a section minus the header height. Avoids
 *   using `scroll-padding-top`/`scroll-margin-top` which add blank scroll
 *   room at the top on reload.
 * - `syncLocationHashWithActiveSection`: keep the URL hash aligned with scroll.
 *   Uses an empty hash for the top so reloads stay clean.
 * - `getActiveSectionId`: pick the section with the largest visible area in
 *   the viewport below the fixed header — matches how users read the page.
 *   Falls back to a "last section whose top crossed a line" rule when no
 *   section has measurable visible area.
 */

export const SECTION_IDS = [
  'about',
  'experience',
  'projects',
  'skills',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value)
}

/** Measured header height (ceil avoids sub-pixel gap under the fixed bar). */
export function headerScrollInset(header: HTMLElement): number {
  return Math.ceil(header.getBoundingClientRect().height)
}

/**
 * Scroll to a section below the fixed header. Avoids scroll-padding /
 * scroll-margin on `html` or sections — those can add a few px of blank
 * scroll room at the top on reload.
 */
export function scrollToSection(sectionId: string, header: HTMLElement): void {
  if (sectionId === 'about') {
    window.scrollTo(0, 0)
    return
  }
  const el = document.getElementById(sectionId)
  if (!el) return
  const top =
    el.getBoundingClientRect().top + window.scrollY - headerScrollInset(header)
  window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
}

/**
 * Keep the URL fragment aligned with scroll position. Nav links set
 * `#section`; if the user scrolls away (e.g. back to the top), replaceState
 * so a refresh doesn't jump to the old hash. For the first section we use
 * an empty hash so the top of the page stays a clean URL.
 */
export function syncLocationHashWithActiveSection(active: SectionId): void {
  const nextHash = active === 'about' ? '' : `#${active}`
  if (window.location.hash === nextHash) return
  const path = `${window.location.pathname}${window.location.search}${nextHash}`
  history.replaceState(window.history.state, '', path)
}

/** Legacy "section top crossed below header" rule — used only as a fallback. */
function getActiveSectionIdFallbackLine(header: HTMLElement): SectionId {
  const line = window.scrollY + header.offsetHeight
  let active: SectionId = 'about'
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const top = window.scrollY + el.getBoundingClientRect().top
    if (top <= line + 2) active = id
  }
  return active
}

/**
 * Pick the section with the largest visible area in the viewport below the
 * fixed header. Matches how users read the page better than "last section
 * whose top passed a line", which breaks on very tall blocks.
 */
export function getActiveSectionId(header: HTMLElement): SectionId {
  const scrollEl = document.documentElement
  // When the last section is shorter than the viewport, its top may never
  // move above the header threshold at max scroll — the loop would keep an
  // earlier section. Force the last section in that case.
  if (
    scrollEl.scrollHeight > window.innerHeight &&
    window.scrollY + window.innerHeight >= scrollEl.scrollHeight - 2
  ) {
    return SECTION_IDS[SECTION_IDS.length - 1]
  }

  const headerBottom = Math.max(0, header.getBoundingClientRect().bottom)
  // The hero (#about) is often shorter than the viewport while #skills is
  // tall, so the "largest visible area" rule can pick skills at scrollY=0
  // and rewrite the URL to `#skills`. While the about block still extends
  // meaningfully below the header, keep About as the active section.
  const aboutEl = document.getElementById('about')
  if (aboutEl && aboutEl.getBoundingClientRect().bottom > headerBottom + 40) {
    return 'about'
  }

  const vw = window.innerWidth
  const vh = window.innerHeight
  let best: SectionId = 'about'
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
    // Prefer the later section in the page when areas tie (typical at
    // section boundaries).
    if (area >= bestArea) {
      bestArea = area
      best = id
    }
  }

  if (bestArea < 1) return getActiveSectionIdFallbackLine(header)
  return best
}

