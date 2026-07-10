// Generates AVIF + WebP variants of raster images used in <picture> elements.
// Runs before the production build so the public/images tree always has the
// modern formats alongside the original JPEG/PNG.
//
// Output naming convention (matches the `<picture>` markup in About.tsx + Projects.tsx):
//   source.jpg            →  source-960.jpg, source-960.avif, source-960.webp
//   source.png            →  source-640.png, source-640.avif, source-640.webp
//
// Width thresholds are intentional:
//   - Hero (IMG_4874.JPEG): 960w mobile variant, source is 2048w (1024w desktop)
//   - Project cards: 640w mobile variant, source width from project.imageWidth

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
  // Skip already-generated variants (base-960.jpg, base-640.png, base-960.avif, ...)
  const m = stem.match(/^(.+)-(960|640)$/)
  if (m) return null
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

/**
 * Width map per source filename. Anything not listed gets a single 640w variant
 * (project card thumbnails are the common case).
 */
const WIDTH_OVERRIDES = {
  'IMG_4874.JPEG': [960], // hero — already 2048w, add 960w for mobile
}

async function processFile(filename) {
  const parsed = parseFilename(filename)
  if (!parsed) return
  const { base, ext } = parsed
  const fullSource = join(PUBLIC_IMAGES, filename)

  // Widths for this source: override list OR default [640]
  const widths = WIDTH_OVERRIDES[filename] ?? [640]

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