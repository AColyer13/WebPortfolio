import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

const SECTION_LABELS = ['About', 'Skills', 'Experiences', 'Projects', 'Contact']

describe('Navbar', () => {
  it('renders all section links (desktop + mobile popover)', () => {
    render(<Navbar activeSection="about" onNavigate={vi.fn()} />)
    // Each section appears twice — once in the static desktop nav and once
    // in the mobile popover (popover API migration).
    for (const label of SECTION_LABELS) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(2)
    }
  })

  it('marks the active section in both desktop and popover nav lists', () => {
    render(<Navbar activeSection="projects" onNavigate={vi.fn()} />)
    // Query DOM directly — getAllByRole excludes hidden elements, but the
    // mobile popover uses `popover="auto"` which hides via UA stylesheet,
    // not `display: none`. Both lists should mark the active section.
    const allProjectsLinks = document.querySelectorAll<HTMLAnchorElement>(
      'a[href$="#projects"]',
    )
    const activeProjects = [...allProjectsLinks].filter((a) =>
      a.classList.contains('active'),
    )
    expect(activeProjects.length).toBeGreaterThanOrEqual(2)
  })

  it('uses popovertarget on the mobile menu trigger', () => {
    render(<Navbar activeSection="about" onNavigate={vi.fn()} />)
    const trigger = document.querySelector<HTMLElement>('[popovertarget]')
    expect(trigger).toBeTruthy()
    expect(trigger?.getAttribute('popovertarget')).toBe('site-nav-menu')
  })

  it('declares the mobile menu as a popover', () => {
    render(<Navbar activeSection="about" onNavigate={vi.fn()} />)
    const popover = document.getElementById('site-nav-menu')
    expect(popover).toBeTruthy()
    expect(popover?.hasAttribute('popover')).toBe(true)
  })
})
