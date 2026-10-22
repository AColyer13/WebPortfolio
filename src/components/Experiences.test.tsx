import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { education, timeline } from '../data/portfolio'
import { Experiences } from './Experiences'

describe('Experiences', () => {
  it('renders every timeline entry', () => {
    render(<Experiences />)
    // One h3 per timeline entry, plus the "Education" heading.
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(timeline.length + 1)
    for (const item of timeline) {
      expect(screen.getByText(item.company)).toBeInTheDocument()
    }
  })

  it('lists every education entry', () => {
    render(<Experiences />)
    expect(screen.getByRole('heading', { name: 'Education', level: 3 })).toBeInTheDocument()
    for (const item of education) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.institution)).toBeInTheDocument()
    }
  })

  it('exposes the experience landmark id', () => {
    const { container } = render(<Experiences />)
    expect(container.querySelector('#experience')).toBeInTheDocument()
  })
})
