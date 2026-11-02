/**
 * Pack the FlyWire multisensory subgraph into public/fly-circuit.bin.
 *
 * Source graph (not committed; download once):
 *   https://connectome-lab-gamma.vercel.app/data/species/fly-gym-circuit/graph.json
 * That file is the FlyWire v783 cut: sensory types HSE, HSN, HSS, LPLC1, LC4,
 * LPLC2, LC16, ORN_DM1, ORN_DA2, labellar taste neurons, and outputs DNa01,
 * DNa02, DNa03, DNb05, DNa11, DNp01, MDN, DNp09, DNg13, DNp03, CB0701, plus
 * neurons on paths with at least 40 synapses per step. Synapse counts and
 * root ids are the public connectome. License: FlyWire v783, CC BY-NC 4.0.
 *
 *   node scripts/pack-fly-circuit.mjs <graph.json> public/fly-circuit.bin
 */
import fs from 'node:fs'

const src = process.argv[2]
const dest = process.argv[3]
if (!src || !dest) {
  console.error('usage: node scripts/pack-fly-circuit.mjs <graph.json> <out.bin>')
  process.exit(1)
}

const g = JSON.parse(fs.readFileSync(src, 'utf8'))
const n = g.neuronIds.length
const nEdges = g.chem.pre.length
const types = g.types
if (g.type.length !== n || g.side.length !== n || g.nt.length !== n) {
  throw new Error('neuron array length mismatch')
}
if (g.pos.length !== n * 3) throw new Error('position length mismatch')

const NT_SIGN = { ACH: 1, DA: 1, SER: 1, OCT: 1, GABA: -1, GLUT: -1 }
const nameBytes = types.map((t) => Buffer.from(t, 'utf8'))
for (const b of nameBytes) {
  if (b.length > 255) throw new Error(`type name too long: ${b.toString()}`)
}

const order = Array.from({ length: nEdges }, (_, i) => i)
order.sort((a, b) => g.chem.pre[a] - g.chem.pre[b] || g.chem.post[a] - g.chem.post[b])

let cursor = 14
for (const b of nameBytes) cursor += 1 + b.length
const alignedNames = (cursor + 3) & ~3
cursor = alignedNames + n * 2 + n + n
const alignedNeurons = (cursor + 3) & ~3
cursor = alignedNeurons + n * 3 * 2 + (n + 1) * 4 + nEdges * 2 + nEdges * 2

const buf = Buffer.alloc(cursor)
buf.write('FWG1', 0, 'ascii')
buf.writeUInt16LE(1, 4)
buf.writeUInt16LE(n, 6)
buf.writeUInt32LE(nEdges, 8)
buf.writeUInt16LE(types.length, 12)

let p = 14
for (const b of nameBytes) {
  buf.writeUInt8(b.length, p)
  b.copy(buf, p + 1)
  p += 1 + b.length
}
p = alignedNames

const typeOff = p
p += n * 2
const sideOff = p
p += n
const signOff = p
p += n
p = alignedNeurons
const posOff = p
p += n * 3 * 2
const csrOff = p
p += (n + 1) * 4
const postOff = p
p += nEdges * 2
const synOff = p

for (let i = 0; i < n; i++) {
  buf.writeUInt16LE(g.type[i], typeOff + i * 2)
  buf.writeUInt8(g.side[i], sideOff + i)
  const nt = g.nts[g.nt[i]] ?? ''
  buf.writeInt8(NT_SIGN[nt] ?? 0, signOff + i)
}
for (let i = 0; i < n * 3; i++) {
  const v = g.pos[i]
  if (!Number.isInteger(v) || v < 0 || v > 65535) throw new Error(`bad position ${v}`)
  buf.writeUInt16LE(v, posOff + i * 2)
}

const csr = new Uint32Array(n + 1)
let maxOut = 0
let prev = -1
for (const e of order) {
  const pre = g.chem.pre[e]
  if (pre < prev) throw new Error('sort failed')
  prev = pre
  csr[pre + 1]++
}
for (let i = 0; i < n; i++) {
  maxOut = Math.max(maxOut, csr[i + 1])
  csr[i + 1] += csr[i]
}
if (csr[n] !== nEdges) throw new Error(`csr end ${csr[n]} != ${nEdges}`)

for (let i = 0; i <= n; i++) buf.writeUInt32LE(csr[i], csrOff + i * 4)
for (let k = 0; k < nEdges; k++) {
  const e = order[k]
  const post = g.chem.post[e]
  const syn = g.chem.w[e]
  if (!Number.isInteger(syn) || syn < 1 || syn > 65535) throw new Error(`bad synapse ${syn}`)
  if (post < 0 || post >= n) throw new Error(`bad post ${post}`)
  buf.writeUInt16LE(post, postOff + k * 2)
  buf.writeUInt16LE(syn, synOff + k * 2)
}

fs.writeFileSync(dest, buf)
console.log(`wrote ${dest} (${buf.length} bytes), neurons ${n}, edges ${nEdges}, max out ${maxOut}`)
