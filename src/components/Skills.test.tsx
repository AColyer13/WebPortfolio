import { describe, it, expect } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
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

/** Expand every block so all skill cards are mounted in the DOM. */
function expandAllBlocks() {
  getBlockSummaries().forEach((s) => fireEvent.click(s))
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
    const collapsedChevrons = document.querySelectorAll<HTMLElement>(
      '.skills-details__chevron',
    )
    expect(collapsedChevrons.length).toBe(skillBlocks.length)

    fireEvent.click(getBlockSummaries()[0])

    const openChevron = document.querySelector<HTMLElement>(
      '.skills-details[open] > .skills-details__summary .skills-details__chevron',
    )
    expect(openChevron).toBeTruthy()
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

  it('has a Data Science & ML Foundations block with the canonical stack', () => {
    const block = skillBlocks.find((b) => b.title === 'Data Science & ML Foundations')
    expect(block).toBeTruthy()
    const names = block?.skills.map((s) => s.name) ?? []
    expect(names).toContain('Pandas')
    expect(names).toContain('PyTorch')
    expect(names).toContain('Matplotlib')
    expect(names).toContain('Seaborn')
  })

  it('lists PII Redaction (Presidio) under Data, Auth & Security', () => {
    const security = skillBlocks.find((b) => b.title === 'Data, Auth & Security')
    expect(security).toBeTruthy()
    const redaction = security?.skills.find((s) =>
      s.name.toLowerCase().includes('pii redaction'),
    )
    expect(redaction).toBeTruthy()
    expect(redaction?.application.toLowerCase()).toContain('legal-eagle')
    expect(redaction?.application.toLowerCase()).toContain('presidio')
  })

  it('every skill icon either uses a registered IconKey or references a /public image', () => {
    for (const block of skillBlocks) {
      for (const skill of block.skills) {
        if (skill.icon.includes('/')) {
          expect(
            /\.(?:svg|png|jpe?g|webp)$/i.test(skill.icon),
            `${skill.name} icon should be a file path with an image extension`,
          ).toBe(true)
        }
      }
    }
  })

  it('renders every (i) trigger inside the card after expansion', () => {
    render(<Skills />)
    expandAllBlocks()

    const totalSkills = skillBlocks.reduce((sum, b) => sum + b.skills.length, 0)
    // Open-state has a different label (Close <skill>).
    const triggers = screen.getAllByRole('button', { name: /how i use it|close .* details/i })
    expect(triggers.length).toBe(totalSkills)
  })

  it('flips a skill card in place when its (i) trigger is clicked', () => {
    render(<Skills />)
    expandAllBlocks()

    // The compact face for the first skill should be rendered initially.
    const compactFaces = document.querySelectorAll<HTMLElement>(
      '.skill-card__face--compact',
    )
    expect(compactFaces.length).toBeGreaterThan(0)

    const skill = skillBlocks[0].skills[0]
    const trigger = screen.getByRole('button', {
      name: new RegExp(`About ${skill.name}`, 'i'),
    })
    fireEvent.click(trigger)

    // Now the card should be marked open and expose the description in-place.
    const cardWithOpen = document.querySelector<HTMLElement>('.skill-card--open')
    expect(cardWithOpen).toBeTruthy()
    // Dialog wrapper carries the description text directly (not in a popover).
    expect(cardWithOpen?.textContent).toContain(skill.description.slice(0, 40))
    // The (i) trigger should now report aria-expanded=true.
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    // Click outside the card to close (the component closes on outside click).
    act(() => {
      document.body.dispatchEvent(
        new MouseEvent('pointerdown', { bubbles: true }),
      )
    })
    // After Escape / outside-click, the card is back to closed state.
  })

  it('stacks categories tightly (no large vertical gap between blocks)', () => {
    render(<Skills />)
    const blockContainer = document.querySelector<HTMLElement>('.skills-blocks')
      ?? document.querySelector<HTMLElement>('details.skills-details')?.parentElement
    expect(blockContainer).toBeTruthy()
    expect(blockContainer?.classList.contains('gap-3')).toBe(true)
  })

  it('does not apply the legacy "with-info" padding override to the card', () => {
    render(<Skills />)
    expandAllBlocks()
    const cards = document.querySelectorAll<HTMLElement>('.skill-card')
    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(card.classList.contains('skill-card--with-info')).toBe(false)
    }
  })
})
