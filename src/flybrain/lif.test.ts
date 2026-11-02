/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { decodeCircuit } from './circuit'
import { LifSim } from './lif'
import { W_SYN_MV } from './params'

function circuitBin(): ArrayBuffer {
  const file = readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/fly-circuit.bin'),
  )
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
}

function meanHz(sim: LifSim, indices: number[], ms: number): number {
  sim.step(Math.round(ms / sim.dtMs))
  const spikes = sim.takeSpikes()
  let total = 0
  for (const index of indices) total += spikes[index] ?? 0
  return total / indices.length / (ms / 1000)
}

describe('LifSim', () => {
  it('lets an excitatory synapse drive a postsynaptic spike', () => {
    const sim = new LifSim({
      csr: new Uint32Array([0, 1, 1]),
      post: new Uint16Array([1]),
      w: new Float32Array([80 * W_SYN_MV]),
      dtMs: 0.1,
      seed: 1,
    })
    sim.setDrive(Uint8Array.of(1, 0))
    const pre = meanHz(sim, [0], 200)
    const post = meanHz(sim, [1], 200)
    expect(pre).toBeGreaterThan(20)
    expect(post).toBeGreaterThan(1)
  })

  it('does not let an inhibitory synapse raise a quiet cell to threshold', () => {
    const sim = new LifSim({
      csr: new Uint32Array([0, 1, 1]),
      post: new Uint16Array([1]),
      w: new Float32Array([-80 * W_SYN_MV]),
      dtMs: 0.1,
      seed: 1,
    })
    sim.setDrive(Uint8Array.of(1, 0))
    sim.step(Math.round(200 / sim.dtMs))
    const spikes = sim.takeSpikes()
    expect(spikes[0]).toBeGreaterThan(0)
    expect(spikes[1]).toBe(0)
  })
})

describe('FlyWire circuit', () => {
  const circuit = decodeCircuit(circuitBin())

  it('loads the published multisensory cut', () => {
    expect(circuit.n).toBe(1846)
    expect(circuit.nEdges).toBe(111407)
    for (const stim of circuit.stimuli) expect(stim.indices.length).toBeGreaterThan(0)
    for (const row of circuit.readouts) expect(row.indices.length).toBeGreaterThan(0)
  })

  it('rejects a file that is not this format', () => {
    const junk = new ArrayBuffer(16)
    expect(() => decodeCircuit(junk)).toThrow(/unrecognized connectome file/i)
  })

  it('drives MN9 from sugar and the left giant fiber from a left loom', () => {
    const sugar = new LifSim({
      csr: circuit.csr,
      post: circuit.post,
      w: circuit.w,
      dtMs: 0.1,
      seed: 2,
    })
    const mask = new Uint8Array(circuit.n)
    const sugarStim = circuit.stimuli.find((stim) => stim.id === 'sugar')!
    for (const index of sugarStim.indices) mask[index] = 1
    sugar.setDrive(mask)
    const mn9 = circuit.readouts.find((row) => row.id === 'mn9')!
    const sugarHz = meanHz(sugar, mn9.indices, 400)

    const loom = new LifSim({
      csr: circuit.csr,
      post: circuit.post,
      w: circuit.w,
      dtMs: 0.1,
      seed: 2,
    })
    const loomMask = new Uint8Array(circuit.n)
    const loomStim = circuit.stimuli.find((stim) => stim.id === 'loom-left')!
    for (const index of loomStim.indices) loomMask[index] = 1
    loom.setDrive(loomMask)
    const left = circuit.readouts.find((row) => row.id === 'dnp01-l')!
    const right = circuit.readouts.find((row) => row.id === 'dnp01-r')!
    const leftHz = meanHz(loom, left.indices, 400)
    const rightHz = meanHz(loom, right.indices, 400)

    expect(sugarHz, `sugar MN9 ${sugarHz.toFixed(1)} Hz`).toBeGreaterThan(5)
    expect(leftHz, `loom DNp01 left ${leftHz.toFixed(1)} right ${rightHz.toFixed(1)}`).toBeGreaterThan(5)
    expect(leftHz).toBeGreaterThan(rightHz)
  }, 30_000)
})
