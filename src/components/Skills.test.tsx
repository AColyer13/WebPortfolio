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
    // The mask URL is set inline on `mask-image` so the browser resolves it
    // relative to the document (not the external stylesheet). Static mask
    // geometry (size, mode, repeat, position) still lives in index.css.
    expect(icon?.style.maskImage || icon?.style.webkitMaskImage).toBe(
      'url("/images/fastapi.svg")',
    )
  })
})
