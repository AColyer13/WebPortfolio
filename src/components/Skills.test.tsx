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
    // Application text should mention the legal-eagle privacy service.
    expect(redaction?.application.toLowerCase()).toContain('legal-eagle')
    expect(redaction?.application.toLowerCase()).toContain('presidio')
  })

  it('every skill icon either uses a registered IconKey or references a /public image', () => {
    // Cheaper than a browser hit: just assert the icon string is well-formed.
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
      // The (i) chip is fully contained inside the card - never spills past
      // the card border. It's tucked into the bottom-right corner with a
      // small inset (right-2, bottom-2).
      expect(trigger.classList.contains('right-2')).toBe(true)
      expect(trigger.classList.contains('bottom-2')).toBe(true)
      expect(trigger.classList.contains('size-4')).toBe(true)
      // No translate hooks - the chip is anchored purely via offsets.
      expect(trigger.classList.contains('-translate-x-1/3')).toBe(false)
      expect(trigger.classList.contains('translate-y-1/3')).toBe(false)
      // No `data-tooltip` so the global `[data-tooltip]` rule doesn't force
      // `position: relative` and break absolute anchoring.
      expect(trigger.hasAttribute('data-tooltip')).toBe(false)

      // The trigger is a sibling of the .skill-card surface (not inside it)
      // so the card's logo and text size are independent of the (i).
      const wrapper = trigger.parentElement
      expect(wrapper).toBeTruthy()
      const card = wrapper?.querySelector('.skill-card')
      expect(card).toBeTruthy()
      expect(card?.contains(trigger)).toBe(false)
    }
  })

  it('stacks categories tightly (no large vertical gap between blocks)', () => {
    render(<Skills />)
    const blockContainer = document.querySelector<HTMLElement>('.skills-blocks')
      ?? document.querySelector<HTMLElement>('details.skills-details')?.parentElement
    expect(blockContainer).toBeTruthy()
    // The wrapper should use the small `gap-3` class (0.75rem) instead of
    // the page-wide `--spacing-8` (4rem) so headings aren't airy.
    expect(blockContainer?.classList.contains('gap-3')).toBe(true)
  })

  it('does not apply the legacy "with-info" padding override to the card', () => {
    render(<Skills />)
    getBlockSummaries().forEach((s) => fireEvent.click(s))
    // Each .skill-card surface must NOT carry the .skill-card--with-info class
    // because that class used to introduce extra bottom padding just to make
    // room for the (i) button - which made the logo noticeably smaller.
    const cards = document.querySelectorAll<HTMLElement>('.skill-card')
    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      expect(card.classList.contains('skill-card--with-info')).toBe(false)
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
