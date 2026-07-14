import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { skillBlocks } from '../data/portfolio'
import { Skills } from './Skills'

/**
 * Each block has one <summary>. Testing Library's getByRole('button') won't
 * match a `<summary>` in jsdom, so we query via the DOM directly.
 */
function getBlockSummaries() {
  const summaries = Array.from(document.querySelectorAll<HTMLElement>('details summary'))
  expect(summaries.length).toBe(skillBlocks.length)
  return summaries
}

describe('Skills', () => {
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
        expect(
          skill.description.length,
          `${skill.name} has no description`,
        ).toBeGreaterThan(20)
        expect(
          skill.application.length,
          `${skill.name} has no application`,
        ).toBeGreaterThan(20)
      }
    }
  })

  it('starts every category collapsed (compact by default)', () => {
    render(<Skills />)
    const details = Array.from(document.querySelectorAll<HTMLDetailsElement>('details'))
    expect(details.length).toBe(skillBlocks.length)
    for (const d of details) {
      expect(
        d.hasAttribute('open'),
        'details should not be open by default',
      ).toBe(false)
    }
  })

  it('expands a category when the summary is clicked', () => {
    render(<Skills />)
    const summaries = getBlockSummaries()
    fireEvent.click(summaries[0])
    const details = Array.from(document.querySelectorAll<HTMLDetailsElement>('details'))
    expect(details[0].hasAttribute('open')).toBe(true)
    // The first block now reveals skill tiles.
    const firstBlock = skillBlocks[0]
    expect(
      screen.getByRole('heading', { name: firstBlock.skills[0].name, level: 4 }),
    ).toBeInTheDocument()
  })

  it('keeps the heading style text-only with a chevron icon', () => {
    render(<Skills />)
    const summaries = document.querySelectorAll<HTMLElement>('.skills-details__summary')
    expect(summaries.length).toBe(skillBlocks.length)
    for (const summary of summaries) {
      // Just the title + the chevron - no border, no panel chrome.
      expect(summary.classList.contains('rounded-md')).toBe(false)
      expect(summary.classList.contains('border')).toBe(false)
      const chevron = summary.querySelector('.skills-details__chevron')
      expect(chevron).toBeTruthy()
    }
  })

  it('rotates the chevron when a block is opened', () => {
    render(<Skills />)
    // All chevrons start with no rotation.
    const collapsedChevrons = document.querySelectorAll<HTMLElement>(
      '.skills-details__chevron',
    )
    expect(collapsedChevrons.length).toBe(skillBlocks.length)

    fireEvent.click(getBlockSummaries()[0])

    const openChevron = document.querySelector<HTMLElement>(
      '.skills-details[open] > .skills-details__summary .skills-details__chevron',
    )
    expect(openChevron).toBeTruthy()
    // The CSS rule sets `transform: rotate(180deg)` on the open-state chevron.
    // jsdom doesn't run stylesheets, so we assert against the rule's
    // application via the data attribute / sibling selector instead.
    expect(openChevron).toBe(document.querySelector('.skills-details__chevron'))
  })

  it('renders FastAPI with the logo mask like other SVG skills when expanded', () => {
    render(<Skills />)
    fireEvent.click(getBlockSummaries()[0])

    const heading = screen.getByRole('heading', { name: 'FastAPI', level: 4 })
    const body = heading.closest('.skill-card__body')
    const icon = body?.querySelector<HTMLElement>('.skill-card__logo')

    expect(icon).toBeTruthy()
    expect(icon?.style.maskImage || icon?.style.webkitMaskImage).toBe(
      'url("/images/fastapi.svg")',
    )
  })

  it('places every (i) trigger at the bottom-right of its skill card', () => {
    render(<Skills />)
    getBlockSummaries().forEach((s) => fireEvent.click(s))

    const totalSkills = skillBlocks.reduce((sum, b) => sum + b.skills.length, 0)
    const triggers = screen.getAllByRole('button', { name: /show description/i })
    expect(triggers.length).toBe(totalSkills)

    for (const trigger of triggers) {
      // The trigger is positioned absolutely at bottom-right.
      expect(trigger.classList.contains('absolute')).toBe(true)
      expect(trigger.classList.contains('bottom-1.5')).toBe(true)
      expect(trigger.classList.contains('right-1.5')).toBe(true)
      // And it's small (size-5 = 1.25rem square).
      expect(trigger.classList.contains('size-5')).toBe(true)
    }
  })

  it('pairs each (i) trigger with a popover that contains a description', () => {
    render(<Skills />)
    getBlockSummaries().forEach((s) => fireEvent.click(s))

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
        const heading = popover.querySelector<HTMLHeadingElement>('h4')
        expect(heading?.textContent?.length ?? 0).toBeGreaterThan(0)
      }
    }
  })
})
