import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Icon, isRegisteredIcon } from './Icons'

describe('isRegisteredIcon', () => {
  it('accepts Lucide-mapped keys', () => {
    expect(isRegisteredIcon('compact-disc')).toBe(true)
    expect(isRegisteredIcon('envelope')).toBe(true)
    expect(isRegisteredIcon('key')).toBe(true)
    expect(isRegisteredIcon('key-round')).toBe(true)
    expect(isRegisteredIcon('mouse-pointer-2')).toBe(true)
    expect(isRegisteredIcon('lightbulb')).toBe(true)
    expect(isRegisteredIcon('shield-halved')).toBe(true)
    expect(isRegisteredIcon('shield-check')).toBe(true)
  })

  it('accepts brand-path keys', () => {
    expect(isRegisteredIcon('js')).toBe(true)
    expect(isRegisteredIcon('github')).toBe(true)
    expect(isRegisteredIcon('github-alt')).toBe(true)
    expect(isRegisteredIcon('python')).toBe(true)
    expect(isRegisteredIcon('java')).toBe(true)
    expect(isRegisteredIcon('aws')).toBe(true)
    expect(isRegisteredIcon('linkedin')).toBe(true)
    expect(isRegisteredIcon('node-js')).toBe(true)
    expect(isRegisteredIcon('markdown')).toBe(true)
  })

  it('rejects unknown keys', () => {
    expect(isRegisteredIcon('fa-totally-made-up')).toBe(false)
    expect(isRegisteredIcon('')).toBe(false)
  })
})

describe('Icon', () => {
  it('renders an <svg> for both Lucide and brand-path keys', () => {
    const { container: c1 } = render(<Icon name="envelope" />)
    const { container: c2 } = render(<Icon name="github" />)
    expect(c1.querySelector('svg')).toBeTruthy()
    expect(c2.querySelector('svg')).toBeTruthy()
  })

  it('honours className so callers can size + color via Tailwind', () => {
    const { container } = render(
      <Icon name="github" className="text-2xl text-primary-600" />,
    )
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('class')).toContain('text-2xl')
    expect(svg.getAttribute('class')).toContain('text-primary-600')
  })

  it('marks the SVG aria-hidden by default', () => {
    const { container } = render(<Icon name="envelope" />)
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('uses 1em width/height so the icon scales with parent font-size', () => {
    const { container } = render(<Icon name="envelope" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('1em')
    expect(svg.getAttribute('height')).toBe('1em')
  })
})
