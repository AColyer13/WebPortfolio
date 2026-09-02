import { describe, it, expect } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { SECTION_IDS } from './utils/sections'

describe('App', () => {
  it('renders a skip link to main content', () => {
    render(<App />)
    const skip = screen.getByRole('link', { name: /skip to main content/i })
    expect(skip).toHaveAttribute('href', '#main-content')
  })

  it('renders sections in the required DOM order', async () => {
    const { container } = render(<App />)
    await waitFor(() => {
      const main = container.querySelector('#main-content')!
      const ids = [...main.querySelectorAll('section')].map((el) => el.id)
      expect(ids).toEqual([...SECTION_IDS])
    })
  })

  it('locks document scroll when the mobile menu opens', async () => {
    render(<App />)
    const popover = document.getElementById('site-nav-menu')!
    await act(async () => {
      popover.dispatchEvent(
        Object.assign(new Event('toggle'), { newState: 'open' }),
      )
    })
    expect(document.documentElement.classList.contains('menu-scroll-lock')).toBe(
      true,
    )
    await act(async () => {
      popover.dispatchEvent(
        Object.assign(new Event('toggle'), { newState: 'closed' }),
      )
    })
    expect(document.documentElement.classList.contains('menu-scroll-lock')).toBe(
      false,
    )
  })
})
