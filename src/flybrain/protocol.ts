export type ToWorker =
  | { type: 'init'; csr: Uint32Array; post: Uint16Array; w: Float32Array }
  | { type: 'drive'; mask: Uint8Array }
  | { type: 'reset' }
  | { type: 'run'; running: boolean }

export type ToMain =
  | { type: 'ready'; backend: 'webgpu' | 'js'; dtMs: number }
  | { type: 'frame'; activity: Uint8Array; spikes: Uint16Array; simMs: number }
  | { type: 'error'; message: string }
