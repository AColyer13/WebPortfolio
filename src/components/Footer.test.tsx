import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('links to profiles and to the source for this site', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/acolyer13',
    )
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:adamcolyer@gmail.com',
    )
    expect(screen.getByRole('link', { name: /source for this site/i })).toHaveAttribute(
      'href',
      'https://github.com/AColyer13/WebPortfolio',
    )
  })
})
