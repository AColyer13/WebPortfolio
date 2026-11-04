import type { BrainView } from './render'

export type Backend = 'webgpu' | 'wasm' | 'js'

export type ToWorker =
  | { type: 'init'; csr: Uint32Array; post: Uint16Array; w: Float32Array; wasmUrl: string }
  /** Hands the plot canvas to the worker so drawing stays off the main thread. */
  | { type: 'canvas'; canvas: OffscreenCanvas; pos: Float32Array }
  | { type: 'view'; view: BrainView }
  | { type: 'drive'; mask: Uint8Array }
  | { type: 'reset' }
  | { type: 'run'; running: boolean }

export type ToMain =
  | { type: 'ready'; backend: Backend; dtMs: number }
  /** `activity` is null when the worker already drew this frame on its own canvas. */
  | { type: 'frame'; activity: Uint8Array | null; spikes: Uint16Array; simMs: number }
  | { type: 'error'; message: string }
