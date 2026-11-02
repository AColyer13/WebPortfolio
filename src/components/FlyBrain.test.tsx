/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { FlyBrain } from './FlyBrain'

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
  addEventListener = vi.fn()
  removeEventListener = vi.fn()
  dispatchEvent = vi.fn()
  onerror = null
  onmessageerror = null
}

describe('FlyBrain', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('explains that the plot is the public connectome and toggles a stimulus', async () => {
    const bin = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/fly-circuit.bin'),
    )
    const buffer = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => buffer.slice(0),
      })),
    )
    vi.stubGlobal('Worker', FakeWorker)
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        cb: IntersectionObserverCallback
        constructor(cb: IntersectionObserverCallback) {
          this.cb = cb
        }
        observe() {
          this.cb(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          )
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return []
        }
        root = null
        rootMargin = ''
        thresholds = []
      },
    )

    render(<FlyBrain />)
    expect(screen.getByRole('heading', { name: 'Fly brain' })).toBeInTheDocument()
    expect(screen.getByText(/public FlyWire connectome, not a metaphor/i)).toBeInTheDocument()

    const sugar = await screen.findByRole('button', { name: 'Sugar' })
    await waitFor(() => expect(sugar).toBeEnabled())
    expect(sugar).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(sugar)
    expect(sugar).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/labellar sugar neurons/i)).toBeInTheDocument()
  })
})
