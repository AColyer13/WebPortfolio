import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { featuredProjects } from '../data/portfolio'
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

  it('featured cards load eagerly and lazy-loads projects revealed after expand', () => {
    const { container } = render(<Projects />)
    const imgs = container.querySelectorAll<HTMLImageElement>('img')
    expect(imgs[0].getAttribute('loading')).toBe('eager')

    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))
    const expandedImgs = container.querySelectorAll<HTMLImageElement>('img')
    expect(expandedImgs.length).toBeGreaterThan(featuredProjects.length)
    expect(expandedImgs[expandedImgs.length - 1].getAttribute('loading')).toBe('lazy')
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
})


