import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { skillBlocks } from '../data/portfolio'
import { Skills } from './Skills'

describe('Skills', () => {
  it('renders all discipline categories as headings', () => {
    render(<Skills />)
    for (const block of skillBlocks) {
      expect(
        screen.getByRole('heading', { name: block.title, level: 3 }),
      ).toBeInTheDocument()
    }
  })

  it('renders skill items for each category', () => {
    render(<Skills />)
    for (const block of skillBlocks) {
      for (const skill of block.skills) {
        expect(screen.getByText(skill)).toBeInTheDocument()
      }
    }
  })

  it('contains essential core skills across modern stack', () => {
    const allSkills = skillBlocks.flatMap((b) => b.skills)
    expect(allSkills).toContain('React 19')
    expect(allSkills).toContain('TypeScript')
    expect(allSkills).toContain('Next.js')
    expect(allSkills).toContain('Tailwind CSS')
    expect(allSkills).toContain('Node.js')
    expect(allSkills).toContain('Python')
    expect(allSkills).toContain('PostgreSQL')
    expect(allSkills).toContain('Docker')
  })

  it('does not depend on any FontAwesome class', () => {
    const { container } = render(<Skills />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
  })
})

