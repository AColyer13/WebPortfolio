import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { featuredProjects, projects as allProjects } from '../data/portfolio'
import { Projects } from './Projects'

describe('Projects', () => {
  it('renders featured project titles by default', () => {
    render(<Projects />)
    // The project title also lives in the (i) popover dialog, so use
    // getAllByRole('heading', { level: 3 }) to query only the visible
    // card titles and avoid duplicate matches.
    const cardTitles = screen.getAllByRole('heading', { level: 3 })
    const titles = cardTitles.map((h) => h.textContent ?? '')
    expect(titles).toContain('Valley Forge Automotive')
    expect(titles).toContain('MissionCtrl')
    expect(titles).toContain('Legal Eagle Project')
  })

  it('hides non-featured projects until expanded', () => {
    render(<Projects />)

    const cardTitlesBefore = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent ?? '')
    expect(cardTitlesBefore).not.toContain('Dream Vacation App')

    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))

    const cardTitlesAfter = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent ?? '')
    expect(cardTitlesAfter).toContain('Dream Vacation App')
  })

  it('resolves image src for public assets', () => {
    const { container } = render(<Projects />)
    const imgs = container.querySelectorAll('img')
    expect(imgs.length).toBe(featuredProjects.length)
    expect(imgs[0].getAttribute('src')).toContain(
      'images/missionctrl-tr41-groundctrl',
    )
  })

  it('uses format-specific srcSet on each picture source', () => {
    const { container } = render(<Projects />)
    const picture = container.querySelector('picture')!
    const [avif, webp] = picture.querySelectorAll('source')
    const img = picture.querySelector('img')!

    expect(avif.getAttribute('type')).toBe('image/avif')
    expect(avif.getAttribute('srcset')).toMatch(/\.avif /)
    expect(avif.getAttribute('srcset')).not.toMatch(/\.webp |\.png /)

    expect(webp.getAttribute('type')).toBe('image/webp')
    expect(webp.getAttribute('srcset')).toMatch(/\.webp /)
    expect(webp.getAttribute('srcset')).not.toMatch(/\.avif |\.png /)

    expect(img.getAttribute('srcset')).toMatch(/\.png /)
    expect(img.getAttribute('srcset')).not.toMatch(/\.avif |\.webp /)
  })

  it('prioritizes only the first card image; others load eagerly when featured', () => {
    const { container } = render(<Projects />)
    const imgs = container.querySelectorAll<HTMLImageElement>('img')
    expect(imgs[0].getAttribute('fetchpriority')).toBe('high')
    expect(imgs[0].getAttribute('loading')).toBe('eager')
    for (let i = 1; i < featuredProjects.length; i++) {
      expect(imgs[i].getAttribute('fetchpriority')).toBeNull()
      expect(imgs[i].getAttribute('loading')).toBe('eager')
    }
  })

  it('lazy-loads images for projects revealed after expand', () => {
    const { container } = render(<Projects />)
    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))
    const imgs = container.querySelectorAll<HTMLImageElement>('img')
    expect(imgs.length).toBeGreaterThan(featuredProjects.length)
    for (let i = featuredProjects.length; i < imgs.length; i++) {
      expect(imgs[i].getAttribute('loading')).toBe('lazy')
      expect(imgs[i].getAttribute('fetchpriority')).toBeNull()
    }
  })

  it('renders live demo and source links for featured projects', () => {
    render(<Projects />)
    expect(screen.getAllByRole('link', { name: /Live demo/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /source on GitHub/i }).length).toBe(3)
  })

  it('links expanded live demos to verified URLs', () => {
    render(<Projects />)
    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))

    const liveLinks = screen.getAllByRole('link', { name: /Live demo/i })
    const ufoLive = liveLinks.find((link) =>
      link.getAttribute('href')?.includes('moovellous'),
    )
    expect(ufoLive).toHaveAttribute('href', 'https://acolyer13.github.io/moovellous/')
  })

  it('no longer renders any FontAwesome classes (font icons migrated to SVG Icon)', () => {
    const { container } = render(<Projects />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })

  it('renders an (i) trigger on every project card with a manual popover', () => {
    render(<Projects />)
    const triggers = screen.getAllByRole('button', { name: /show summary and tech stack/i })
    expect(triggers.length).toBe(featuredProjects.length)

    for (const trigger of triggers) {
      const popoverId = trigger.getAttribute('aria-controls')
      expect(popoverId).toBeTruthy()
      const popover = document.getElementById(popoverId as string)
      expect(popover, `popover #${popoverId} missing`).toBeTruthy()
      expect(popover?.getAttribute('popover')).toBe('manual')
      // The chip list contains every tech fragment from `project.tech`.
      const tech = popover?.querySelector('h4')?.textContent ?? ''
      expect(tech.length).toBeGreaterThan(0)
    }
  })

  it('anchors the project popover above the (i) trigger on click', () => {
    render(<Projects />)
    const triggers = screen.getAllByRole('button', { name: /show summary and tech stack/i })
    expect(triggers.length).toBeGreaterThan(0)

    fireEvent.click(triggers[0])

    const popoverId = triggers[0].getAttribute('aria-controls')
    const popover = document.getElementById(popoverId as string)
    expect(popover).toBeTruthy()
    expect(popover?.style.position).toBe('fixed')
    expect(popover?.style.inset).toBe('auto')
    expect(popover?.style.top).not.toBe('')
    expect(popover?.style.left).not.toBe('')
    expect(popover?.style.width).not.toBe('')
    expect(popover?.getAttribute('data-placement')).toBe('bottom-end')
  })

  it('lists every tech fragment as a chip in the popover', () => {
    const first = allProjects[0]
    const chips = first.tech.split(',').map((c: string) => c.trim())
    const { container } = render(<Projects />)
    const trigger = screen.getAllByRole('button', { name: /show summary and tech stack/i })[0]
    fireEvent.click(trigger)
    const popoverId = trigger.getAttribute('aria-controls')
    const popover = document.getElementById(popoverId as string)
    const chipItems = Array.from(popover?.querySelectorAll('li') ?? []).map(
      (li) => li.textContent ?? '',
    )
    for (const chip of chips) {
      expect(chipItems.some((text) => text.includes(chip))).toBe(true)
    }
    // Sanity check the container still rendered (no test pollution).
    expect(container.querySelector('article')).toBeTruthy()
  })
})

