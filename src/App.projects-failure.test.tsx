import { expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./utils/prefetch', async (importOriginal) => ({
  ...await importOriginal<typeof import('./utils/prefetch')>(),
  loadProjects: () => Promise.reject(new TypeError('Simulated Projects dynamic module fetch failure')),
}))

it('contains a rejected Projects chunk and keeps Contact usable', async () => {
  render(<App />, { onCaughtError: vi.fn() })
  expect(await screen.findByRole('alert')).toHaveTextContent('This section couldn’t load')
  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(await screen.findByRole('button', { name: 'Send Message' })).toBeEnabled()
  expect(document.querySelector('#projects')).toHaveAttribute('aria-labelledby', 'projects-error-heading')
  expect(screen.getByRole('button', { name: 'Reload page' })).toBeEnabled()
})
