import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock the lazy emailjs wrapper so we can drive the form submit
// deterministically without touching the network or the EmailJS SDK.
vi.mock('../utils/contact', () => ({
  sendContactForm: vi.fn().mockResolvedValue(undefined),
}))

import { Contact } from './Contact'
import { sendContactForm } from '../utils/contact'

beforeEach(() => {
  vi.mocked(sendContactForm).mockClear()
})

describe('Contact form', () => {
  it('renders all required fields with matching labels', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/^Name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Message$/i)).toBeInTheDocument()
  })

  it('blocks submit when fields are empty and surfaces inline errors', async () => {
    const { container } = render(<Contact />)
    // `noValidate` is set; simulate a real user click on the Send button.
    const submit = container.querySelector<HTMLInputElement>('input[type="submit"]')!
    fireEvent.click(submit)
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/^Name$/i)
      expect(nameInput.getAttribute('aria-invalid')).toBe('true')
    })
    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(1)
    expect(sendContactForm).not.toHaveBeenCalled()
  })

  it('does not depend on any FontAwesome class (replaced by Icon)', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
  })

  it('renders direct location and contact details', () => {
    render(<Contact />)
    expect(screen.getByText(/Edina, MN/i)).toBeInTheDocument()
    expect(screen.getByText(/612\.710\.7700/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /adamcolyer@gmail\.com/i })).toBeInTheDocument()
  })
})

