/// <reference types="node" />
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { decodeCircuit } from './circuit'
import { LifSim } from './lif'
import { WasmLifSim } from './wasmEngine'

const here = path.dirname(fileURLToPath(import.meta.url))

function read(file: string): ArrayBuffer {
  const buf = readFileSync(path.join(here, '../../public', file))
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

describe('WasmLifSim', () => {
  it('matches the JS reference engine spike for spike', async () => {
    const circuit = decodeCircuit(read('fly-circuit.bin'))
    const init = {
      csr: circuit.csr,
      post: circuit.post,
      w: circuit.w,
      dtMs: 0.1,
      seed: 7,
    }
    const js = new LifSim({ ...init })
    const wasm = await WasmLifSim.create(await WebAssembly.compile(read('lif.wasm')), {
      ...init,
      csr: circuit.csr.slice(),
      post: circuit.post.slice(),
      w: circuit.w.slice(),
    })

    const mask = new Uint8Array(circuit.n)
    for (const stim of circuit.stimuli) for (const index of stim.indices) mask[index] = 1
    js.setDrive(mask)
    wasm.setDrive(mask)

    js.step(2000)
    wasm.step(2000)

    const jsSpikes = js.takeSpikes()
    const wasmSpikes = wasm.takeSpikes()
    expect(jsSpikes.reduce((a, b) => a + b, 0)).toBeGreaterThan(0)
    expect(Array.from(wasmSpikes)).toEqual(Array.from(jsSpikes))
    expect(Array.from(wasm.activityBytes())).toEqual(Array.from(js.activityBytes()))
  }, 30_000)

  it('clears spike counts after takeSpikes and resets state', async () => {
    const wasm = await WasmLifSim.create(await WebAssembly.compile(read('lif.wasm')), {
      csr: new Uint32Array([0, 0]),
      post: new Uint16Array(0),
      w: new Float32Array(0),
      dtMs: 0.1,
      seed: 1,
    })
    wasm.setDrive(Uint8Array.of(1))
    wasm.step(5000)
    expect(wasm.takeSpikes()[0]).toBeGreaterThan(0)
    expect(wasm.takeSpikes()[0]).toBe(0)
    wasm.reset()
    expect(wasm.activityBytes()[0]).toBe(0)
  })
})
