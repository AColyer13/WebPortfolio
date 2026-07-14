import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { skillBlocks } from '../data/portfolio'
import { Skills } from './Skills'

describe('Skills', () => {
  it('renders FastAPI with the logo mask like other SVG skills', () => {
    render(<Skills />)
    const heading = screen.getByRole('heading', { name: 'FastAPI', level: 4 })
    const body = heading.closest('.skill-card__body')
    const icon = body?.querySelector<HTMLElement>('.skill-card__logo')

    expect(icon).toBeTruthy()
    expect(icon?.style.maskImage || icon?.style.webkitMaskImage).toBe(
      'url("/images/fastapi.svg")',
    )
  })

  it('renders a top-level discipline per block (no per-stack headings)', () => {
    render(<Skills />)
    for (const block of skillBlocks) {
      expect(
        screen.getByRole('heading', { name: block.title, level: 3 }),
      ).toBeInTheDocument()
    }
  })

  it('shows a description and an "In practice" line for every skill', () => {
    for (const block of skillBlocks) {
      for (const skill of block.skills) {
        expect(skill.description.length, `${skill.name} has no description`).toBeGreaterThan(
          20,
        )
        expect(skill.application.length, `${skill.name} has no application`).toBeGreaterThan(
          20,
        )
      }
    }
  })

  it('exposes an info (i) trigger for every skill card', () => {
    render(<Skills />)
    const totalSkills = skillBlocks.reduce((sum, b) => sum + b.skills.length, 0)
    const triggers = screen.getAllByRole('button', { name: /show description/i })
    expect(triggers.length).toBe(totalSkills)
  })

  it('pairs each (i) trigger with a popover that contains a description', () => {
    render(<Skills />)
    const triggers = screen.getAllByRole('button', { name: /show description/i })
    for (const trigger of triggers) {
      const targetId = trigger.getAttribute('popovertarget')
      expect(targetId).toBeTruthy()
      const popover = document.getElementById(targetId as string)
      expect(popover, `popover #${targetId} missing`).toBeTruthy()
      expect(popover?.getAttribute('popover')).toBe('auto')
      if (popover) {
        const firstParagraph = popover.querySelector('p')
        expect(firstParagraph?.textContent?.length ?? 0).toBeGreaterThan(20)
        // Popovers live outside the a11y tree when closed, so query the DOM
        // (not roles) to verify the dialog exposes the skill name.
        const dialogName = popover.querySelector<HTMLHeadingElement>('h4')
        expect(dialogName?.textContent?.length ?? 0).toBeGreaterThan(0)
      }
    }
  })
})
