import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the hero heading and intro copy', () => {
    render(<About />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Adam Colyer')
    expect(screen.getByText(/Full-stack developer/i)).toBeInTheDocument()
  })

  it('does not depend on any FontAwesome class (replaced by Icon)', () => {
    const { container } = render(<About />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
  })

  it('offers the resume as a downloadable link with a real filename', () => {
    const { container } = render(<About />)
    const links = container.querySelectorAll<HTMLAnchorElement>('a[download]')
    expect(links.length).toBeGreaterThan(0)
    const link = links[0]
    expect(link.getAttribute('download')).toMatch(/Adam_Colyer_Resume_2026\.pdf$/)
    expect(link.getAttribute('href')).toContain('Adam_Colyer_Resume_2026.pdf')
  })

  it('marks the hero image as high-priority + async for LCP', () => {
    const { container } = render(<About />)
    const hero = container.querySelector('img')!
    expect(hero.getAttribute('fetchpriority')).toBe('high')
    expect(hero.getAttribute('decoding')).toBe('async')
  })

  it('uses <picture> for AVIF + WebP variants of the hero', () => {
    const { container } = render(<About />)
    const sources = container.querySelectorAll('picture source')
    expect(sources.length).toBeGreaterThanOrEqual(2)
    const types = Array.from(sources).map((s) => s.getAttribute('type'))
    expect(types).toContain('image/avif')
    expect(types).toContain('image/webp')
  })
})
