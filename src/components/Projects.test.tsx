import { beforeEach, describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { featuredProjects } from '../data/portfolio'
import { Projects } from './Projects'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
})

describe('Projects', () => {
  it('renders featured project titles by default', () => {
    render(<Projects />)
    // The project title also lives in the (i) popover dialog, so use
    // getAllByRole('heading', { level: 3 }) to query only the visible
    // card titles and avoid duplicate matches.
    const cardTitles = screen.getAllByRole('heading', { level: 3 })
    const titles = cardTitles.map((h) => h.textContent ?? '')
    expect(titles).toContain('Legal Eagle Project')
    expect(titles).toContain('MissionCtrl')
    expect(titles).toContain('Pure Strike Golf')
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
      'images/legaleagleproject',
    )
  })

  it('loads the first row of thumbnails eagerly and lazy-loads the rest', () => {
    const { container } = render(<Projects />)
    const imgs = container.querySelectorAll<HTMLImageElement>('img')
    for (const img of imgs) {
      expect(img.getAttribute('loading')).toBe('eager')
    }
    expect(imgs[0].getAttribute('fetchpriority')).toBe('high')

    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))
    const expandedImgs = [...container.querySelectorAll<HTMLImageElement>('img')]
    expect(expandedImgs.length).toBeGreaterThan(featuredProjects.length)
    expect(expandedImgs.slice(3).every((img) => img.getAttribute('loading') === 'lazy')).toBe(true)
  })

  it('warns that the Legal Eagle demo needs a sign-up', () => {
    render(<Projects />)
    expect(screen.getByText(/free sign-up required/i)).toBeInTheDocument()
  })

  it('shows a source link only for projects with a public repo', () => {
    render(<Projects />)
    expect(screen.getAllByRole('link', { name: /Live demo/i }).length).toBe(3)
    const sources = screen.getAllByRole('link', { name: /source on GitHub/i })
    expect(sources).toHaveLength(1)
    expect(sources[0]).toHaveAttribute(
      'href',
      'https://github.com/AColyer13/pure-strike-golf',
    )
  })

  it('links expanded live demos to verified URLs', () => {
    render(<Projects />)
    fireEvent.click(screen.getByRole('button', { name: /View all projects/i }))

    const liveLinks = screen.getAllByRole('link', { name: /Live demo/i })
    const snowmobileLive = liveLinks.find((link) =>
      link.getAttribute('href')?.includes('minnesota-snowmobile'),
    )
    expect(snowmobileLive).toHaveAttribute(
      'href',
      'https://acolyer13.github.io/minnesota-snowmobile/',
    )
  })

  it('shows a clamped description by default and expands it from the (i) button', () => {
    render(<Projects />)
    const project = featuredProjects[0]
    const info = screen.getByRole('button', { name: `About ${project.title}` })
    const description = screen.getByText(project.description)

    expect(info).toHaveAttribute('aria-expanded', 'false')
    expect(description).toBeVisible()
    expect(description).toHaveClass('line-clamp-2')

    fireEvent.click(info)
    expect(info).toHaveAttribute('aria-expanded', 'true')
    expect(info).toHaveAttribute('aria-controls', description.id)
    expect(description).not.toHaveClass('line-clamp-2')
  })

  it('no longer renders any FontAwesome classes (font icons migrated to SVG Icon)', () => {
    const { container } = render(<Projects />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})


