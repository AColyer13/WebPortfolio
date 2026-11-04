/** Everything the plot needs that only the DOM knows: size, pixel ratio, and theme colours. */
export interface BrainView {
  azimuth: number
  width: number
  height: number
  dpr: number
  ink: string
  rule: string
}

type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/**
 * Draw the connectome as a point cloud. Runs on the main thread (fallback) and
 * inside the simulation worker when the canvas was transferred as an OffscreenCanvas.
 * `activity` holds 0-255 per neuron, or null before the first frame.
 */
export function renderBrain(
  ctx: Ctx2D,
  pos: Float32Array,
  activity: Uint8Array | null,
  view: BrainView,
): void {
  const { azimuth, width, height, dpr, ink, rule } = view
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)
  const cos = Math.cos(azimuth)
  const sin = Math.sin(azimuth)
  const pad = 16
  const n = pos.length / 3
  for (let i = 0; i < n; i++) {
    const x = pos[i * 3]
    const y = pos[i * 3 + 1]
    const z = pos[i * 3 + 2]
    const xr = x * cos + z * sin
    const zr = -x * sin + z * cos
    const px = pad + ((xr + 1) / 2) * (width - pad * 2)
    const py = pad + ((1 - y) / 2) * (height - pad * 2)
    const level = activity ? activity[i] / 255 : 0
    const size = (level < 0.04 ? 1.25 : 1.25 + level * 4.5) * (1 + zr * 0.12)
    ctx.globalAlpha = level < 0.04 ? 0.45 : 0.35 + level * 0.65
    ctx.fillStyle = level < 0.04 ? rule : ink
    ctx.fillRect(px - size / 2, py - size / 2, size, size)
  }
  ctx.globalAlpha = 1
}
