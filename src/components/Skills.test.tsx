import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'

describe('Skills', () => {
  it('renders FastAPI with the logo mask like other SVG skills', () => {
    render(<Skills />)

    const heading = screen.getByRole('heading', { name: 'FastAPI', level: 4 })
    const body = heading.closest('.skill-card__body')
    const icon = body?.querySelector<HTMLElement>('.skill-card__logo')

    expect(icon).toBeTruthy()
    expect(icon).toHaveStyle({
      maskImage: 'url("/images/fastapi.svg")',
      WebkitMaskImage: 'url("/images/fastapi.svg")',
    })
  })
})
