import { expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./utils/prefetch', async (importOriginal) => ({
  ...await importOriginal<typeof import('./utils/prefetch')>(),
  loadContact: () => Promise.reject(new TypeError('Simulated Contact dynamic module fetch failure')),
}))

it('contains a rejected Contact chunk and retains the rest of the portfolio', async () => {
  const onCaughtError = vi.fn()
  render(<App />, { onCaughtError })
  expect(await screen.findByRole('alert')).toHaveTextContent('This section couldn’t load')
  expect(onCaughtError).toHaveBeenCalled()
  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { name: 'MissionCtrl' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Skills' })).toBeInTheDocument()
  expect(document.querySelector('#contact')).toHaveAttribute('aria-labelledby', 'contact-error-heading')
  expect(screen.getByRole('link', { name: 'adamcolyer@gmail.com' })).toHaveAttribute('href', 'mailto:adamcolyer@gmail.com')
  expect(screen.getByRole('button', { name: 'Reload page' })).toBeEnabled()
  expect(screen.getByText(/clear any unsent form entries/)).toBeInTheDocument()
})
