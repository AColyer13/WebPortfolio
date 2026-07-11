// Generates AVIF + WebP variants of raster images used in <picture> elements.
// Runs before the production build so the public/images tree always has the
// modern formats alongside the original JPEG/PNG.
//
// Output naming convention (matches `<picture>` markup in Projects.tsx):
//   source.png → source-{640,1280}.{png,avif,webp}
//   hero.jpg   → hero-960.{jpg,avif,webp}

import { mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_IMAGES = resolve(__dirname, '..', 'public', 'images')

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png'])

/**
 * @param {string} filename
 * @returns {{ base: string, ext: string, variantSuffix: number } | null}
 */
function parseFilename(filename) {
  const ext = extname(filename).toLowerCase()
  if (!RASTER_EXT.has(ext)) return null
  const stem = filename.slice(0, -ext.length)
  // Skip any file with one or more trailing width suffixes — these are
  // already-generated variants (e.g. `base-960.jpg`, `base-640.png`,
  // `base-1280.avif`, AND cascades from a stale run like `base-1280-640.avif`).
  // Without this, re-running the script would treat fresh `-1280` outputs as
  // sources and produce `-1280-1280.*` / `-1280-640.*` cascades.
  if (/-\d{3,4}(-\d{3,4})*$/.test(stem)) return null
  return { base: stem, ext }
}

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/** Per-source width overrides. Sources not listed use the default `[640, 1280]`. */
const WIDTH_MAP = {
  // Hero photo — `About.tsx` requests only [960] + the original. A -1280
  // variant would be wasted I/O (the source is 2048px, so `withoutEnlargement`
  // produces a real 1280px output, not a no-op). Paired with
  // `pictureSrcSet('images/IMG_4874.JPEG', [960], 'avif')` in `About.tsx`.
  'IMG_4874.JPEG': [960],
}

/** Width map per source filename. Anything not listed gets a [640, 1280] variant set (project card thumbnails are the common case). We pick 1280 as the high-end because it's the largest intrinsic width declared in `portfolio.ts` for most projects and is enough for 2x DPR at the card's ~400px CSS display size. Paired with `pictureSrcSet(project.imageUrl, [640, 1280])` in `Projects.tsx`. */
async function processFile(filename) {
  const parsed = parseFilename(filename)
  if (!parsed) return
  const { base, ext } = parsed
  const fullSource = join(PUBLIC_IMAGES, filename)

  const widths = WIDTH_MAP[filename] ?? [640, 1280]

  for (const width of widths) {
    const baseVariant = `${base}-${width}`

    // Skip if all three formats already exist with a recent mtime (cache hit).
    const avifOut = join(PUBLIC_IMAGES, `${baseVariant}.avif`)
    const webpOut = join(PUBLIC_IMAGES, `${baseVariant}.webp`)
    const jpegOut = join(PUBLIC_IMAGES, `${baseVariant}${ext}`)
    if (
      (await exists(avifOut)) &&
      (await exists(webpOut)) &&
      (await exists(jpegOut))
    ) {
      continue
    }

    const pipeline = sharp(fullSource).resize({
      width,
      withoutEnlargement: true,
    })

    await Promise.all([
      pipeline
        .clone()
        .avif({ quality: 55, effort: 4 })
        .toFile(avifOut),
      pipeline
        .clone()
        .webp({ quality: 75 })
        .toFile(webpOut),
      pipeline.clone().toFile(jpegOut),
    ])

    console.log(
      `  ${filename} → ${baseVariant}.{avif,webp${ext}} @${width}w`,
    )
  }
}

async function main() {
  console.log('Generating AVIF/WebP variants in public/images …')
  const entries = await readdir(PUBLIC_IMAGES)
  const targets = entries.filter((f) => parseFilename(f))
  if (targets.length === 0) {
    console.log('  (no raster sources found, nothing to do)')
    return
  }
  await mkdir(PUBLIC_IMAGES, { recursive: true })
  await Promise.all(targets.map(processFile))
  console.log(`Done — processed ${targets.length} source images.`)
}

main().catch((err) => {
  console.error('generate-image-variants failed:', err)
  process.exit(1)
})