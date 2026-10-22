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

  function fillForm(message: string) {
    fireEvent.change(screen.getByLabelText(/^Name$/i), { target: { value: 'QA Tester' } })
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'qa@example.com' } })
    fireEvent.change(screen.getByLabelText(/^Message$/i), { target: { value: message } })
  }

  it('rejects a message shorter than 10 characters', async () => {
    const { container } = render(<Contact />)
    fillForm('Hi')
    fireEvent.click(container.querySelector<HTMLInputElement>('input[type="submit"]')!)
    expect(await screen.findByText(/at least 10 characters/i)).toBeInTheDocument()
    expect(sendContactForm).not.toHaveBeenCalled()
  })

  it('keeps the input and offers a mailto link when sending fails', async () => {
    vi.mocked(sendContactForm).mockRejectedValueOnce(new Error('offline'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<Contact />)
    fillForm('Hello, I would like to talk about a role.')
    fireEvent.click(container.querySelector<HTMLInputElement>('input[type="submit"]')!)
    const banner = await screen.findByRole('status')
    expect(banner).toHaveTextContent(/something went wrong/i)
    expect(banner.querySelector('a[href="mailto:adamcolyer@gmail.com"]')).not.toBeNull()
    expect(screen.getByLabelText(/^Name$/i)).toHaveValue('QA Tester')
  })

  it('does not depend on any FontAwesome class (replaced by Icon)', () => {
    const { container } = render(<Contact />)
    expect(container.querySelector('[class*="fa-"]')).toBeNull()
  })

  it('renders direct location and contact details', () => {
    render(<Contact />)
    expect(screen.getByText(/Twin Cities, MN/i)).toBeInTheDocument()
    // Phone stays on the résumé only — keep it off the public page.
    expect(screen.queryByText(/612/)).toBeNull()
    expect(screen.getByRole('link', { name: /adamcolyer@gmail\.com/i })).toBeInTheDocument()
  })
})

