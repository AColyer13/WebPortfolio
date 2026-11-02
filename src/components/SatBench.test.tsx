import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SatBench } from './SatBench'

describe('SatBench', () => {
  it('grades a fast null-rate as a pass and a spin-up as a fail', () => {
    render(<SatBench />)
    expect(screen.getByRole('heading', { name: 'Sat bench' })).toBeInTheDocument()
    expect(screen.getByText(/not a loss curve/i)).toBeInTheDocument()
    expect(screen.getByText(/Nothing is sent to a server/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Attitude drift' }))
    fireEvent.click(screen.getByRole('button', { name: 'Null the rate' }))
    expect(screen.getByText(/^Pass\./)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Attitude drift' }))
    fireEvent.click(screen.getByRole('button', { name: 'Spin the wheel up' }))
    expect(screen.getByText(/^Fail\./)).toBeInTheDocument()
  })

  it('shows the published passing key for a thermal spike', () => {
    render(<SatBench />)
    fireEvent.click(screen.getByRole('button', { name: 'Thermal spike' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show the passing key' }))
    expect(screen.getByText(/^Pass\./)).toBeInTheDocument()
    expect(screen.getByText(/Key thermal \/ Open the radiator \/ 1500 ms/)).toBeInTheDocument()
  })
})
