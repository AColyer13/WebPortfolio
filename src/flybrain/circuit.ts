import { W_SYN_MV } from './params'

export interface StimulusDef {
  id: string
  label: string
  detail: string
  indices: number[]
}

export interface ReadoutDef {
  id: string
  label: string
  detail: string
  indices: number[]
}

export interface FlyCircuit {
  n: number
  nEdges: number
  /** x right, y up, z toward the camera, each roughly in [-1, 1]. */
  pos: Float32Array
  csr: Uint32Array
  post: Uint16Array
  /** Signed mV. */
  w: Float32Array
  stimuli: StimulusDef[]
  readouts: ReadoutDef[]
}

interface Member {
  type: string
  side?: number
}

const STIMULI: { id: string; label: string; detail: string; members: Member[] }[] = [
  {
    id: 'loom-left',
    label: 'Loom left',
    detail: 'left-eye loom detectors LC4 and LPLC2',
    members: [
      { type: 'LC4', side: 0 },
      { type: 'LPLC2', side: 0 },
    ],
  },
  {
    id: 'loom-right',
    label: 'Loom right',
    detail: 'right-eye loom detectors LC4 and LPLC2',
    members: [
      { type: 'LC4', side: 1 },
      { type: 'LPLC2', side: 1 },
    ],
  },
  {
    id: 'sugar',
    label: 'Sugar',
    detail: 'labellar sugar neurons LB3 and LB2d',
    members: [{ type: 'LB3' }, { type: 'LB2d' }],
  },
  {
    id: 'odor',
    label: 'Odor',
    detail: 'food-odor receptor neurons ORN_DM1',
    members: [{ type: 'ORN_DM1' }],
  },
]

const READOUTS: { id: string; label: string; detail: string; type: string; side?: number }[] = [
  { id: 'dnp01-l', label: 'Giant fiber', detail: 'DNp01, left', type: 'DNp01', side: 0 },
  { id: 'dnp01-r', label: 'Giant fiber', detail: 'DNp01, right', type: 'DNp01', side: 1 },
  { id: 'dna02-l', label: 'Steering', detail: 'DNa02, left', type: 'DNa02', side: 0 },
  { id: 'dna02-r', label: 'Steering', detail: 'DNa02, right', type: 'DNa02', side: 1 },
  { id: 'dnp09', label: 'Walk forward', detail: 'DNp09', type: 'DNp09' },
  { id: 'mdn', label: 'Moonwalk', detail: 'MDN', type: 'MDN' },
  { id: 'mn9', label: 'Proboscis', detail: 'MN9 (CB0701)', type: 'CB0701' },
]

function membersOf(
  names: string[],
  neuronType: Uint16Array,
  side: Uint8Array,
  members: Member[],
): number[] {
  const want = members.map((m) => ({ ti: names.indexOf(m.type), side: m.side }))
  const out: number[] = []
  for (let i = 0; i < neuronType.length; i++) {
    for (const w of want) {
      if (w.ti >= 0 && neuronType[i] === w.ti && (w.side === undefined || side[i] === w.side)) {
        out.push(i)
        break
      }
    }
  }
  return out
}

/**
 * Left/right is the axis that separates side 0 from side 1. Side 0 is the
 * left hemisphere in this file, so it is placed on the left of the plot.
 */
function orient(raw: Uint16Array, side: Uint8Array, n: number): Float32Array {
  const sum0 = [0, 0, 0]
  const sum1 = [0, 0, 0]
  let c0 = 0
  let c1 = 0
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < n; i++) {
    if (side[i] === 0) c0++
    else if (side[i] === 1) c1++
    for (let k = 0; k < 3; k++) {
      const v = raw[i * 3 + k]
      min[k] = Math.min(min[k], v)
      max[k] = Math.max(max[k], v)
      if (side[i] === 0) sum0[k] += v
      else if (side[i] === 1) sum1[k] += v
    }
  }
  let lr = 0
  let best = -1
  const safe0 = Math.max(1, c0)
  const safe1 = Math.max(1, c1)
  for (let k = 0; k < 3; k++) {
    const gap = Math.abs(sum0[k] / safe0 - sum1[k] / safe1)
    if (gap > best) {
      best = gap
      lr = k
    }
  }
  const flip = sum0[lr] / safe0 > sum1[lr] / safe1
  const rest = [0, 1, 2].filter((k) => k !== lr)
  const span = (k: number) => max[k] - min[k]
  const vert = span(rest[0]) >= span(rest[1]) ? rest[0] : rest[1]
  const depth = rest[0] === vert ? rest[1] : rest[0]
  const norm = (k: number, v: number) => {
    const s = span(k) || 1
    return ((v - min[k]) / s) * 2 - 1
  }
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const x = norm(lr, raw[i * 3 + lr])
    out[i * 3] = flip ? -x : x
    out[i * 3 + 1] = norm(vert, raw[i * 3 + vert])
    out[i * 3 + 2] = norm(depth, raw[i * 3 + depth])
  }
  return out
}

/** Decode public/fly-circuit.bin. Throws if the header is not this format. */
export function decodeCircuit(buffer: ArrayBuffer): FlyCircuit {
  const view = new DataView(buffer)
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
  if (magic !== 'FWG1' || view.getUint16(4, true) !== 1) {
    throw new Error('Unrecognized connectome file')
  }
  const n = view.getUint16(6, true)
  const nEdges = view.getUint32(8, true)
  const nTypes = view.getUint16(12, true)
  const names: string[] = []
  let p = 14
  const bytes = new Uint8Array(buffer)
  for (let t = 0; t < nTypes; t++) {
    const len = bytes[p]
    p += 1
    names.push(new TextDecoder().decode(bytes.subarray(p, p + len)))
    p += len
  }
  p = (p + 3) & ~3
  const neuronType = new Uint16Array(n)
  for (let i = 0; i < n; i++) neuronType[i] = view.getUint16(p + i * 2, true)
  p += n * 2
  const side = new Uint8Array(n)
  side.set(bytes.subarray(p, p + n))
  p += n
  const sign = new Int8Array(n)
  sign.set(new Int8Array(buffer, p, n))
  p += n
  p = (p + 3) & ~3
  const rawPos = new Uint16Array(n * 3)
  for (let i = 0; i < rawPos.length; i++) rawPos[i] = view.getUint16(p + i * 2, true)
  p += rawPos.length * 2
  const csr = new Uint32Array(n + 1)
  for (let i = 0; i <= n; i++) csr[i] = view.getUint32(p + i * 4, true)
  p += (n + 1) * 4
  const post = new Uint16Array(nEdges)
  for (let e = 0; e < nEdges; e++) post[e] = view.getUint16(p + e * 2, true)
  p += nEdges * 2
  const synOff = p
  const w = new Float32Array(nEdges)
  for (let i = 0; i < n; i++) {
    const scale = sign[i] * W_SYN_MV
    for (let e = csr[i]; e < csr[i + 1]; e++) {
      w[e] = view.getUint16(synOff + e * 2, true) * scale
    }
  }
  if (csr[n] !== nEdges) throw new Error('Connectome file is truncated')

  return {
    n,
    nEdges,
    pos: orient(rawPos, side, n),
    csr,
    post,
    w,
    stimuli: STIMULI.map((stim) => ({
      id: stim.id,
      label: stim.label,
      detail: stim.detail,
      indices: membersOf(names, neuronType, side, stim.members),
    })),
    readouts: READOUTS.map((row) => ({
      id: row.id,
      label: row.label,
      detail: row.detail,
      indices: membersOf(names, neuronType, side, [{ type: row.type, side: row.side }]),
    })),
  }
}
