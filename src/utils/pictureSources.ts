import { withBase } from './baseUrl'

/**
 * Build a 3-tier `<source>` srcSet string for `<picture>`:
 *   AVIF (best compression) → WebP (broad support) → original (fallback).
 *
 * Width descriptors match what `scripts/generate-image-variants.mjs` emits:
 *   - Hero image: 960w variant + original
 *   - Project card thumbnails: 640w variant + original
 *
 * @param sourceUrl  path relative to `public/` (e.g. `images/foo.png`)
 * @param widths     ascending widths to include as `srcSet` candidates
 */
export function pictureSrcSet(
  sourceUrl: string,
  widths: readonly number[],
): string {
  const extMatch = sourceUrl.match(/\.(png|jpe?g|webp)$/i)
  if (!extMatch) return withBase(sourceUrl)
  const ext = extMatch[1]!.toLowerCase()
  const dotExt = ext.startsWith('jp') ? '.jpeg' : `.${ext === 'jpeg' ? 'jpeg' : ext}`

  const parts: string[] = []
  for (const w of widths) {
    const variantPath = sourceUrl.replace(
      /\.(png|jpe?g|webp)$/i,
      `-${w}${dotExt}`,
    )
    const avifPath = variantPath.replace(/\.(png|jpe?g|webp)$/i, '.avif')
    const webpPath = variantPath.replace(/\.(png|jpe?g|webp)$/i, '.webp')
    parts.push(`${withBase(avifPath)} ${w}w`)
    parts.push(`${withBase(webpPath)} ${w}w`)
    parts.push(`${withBase(variantPath)} ${w}w`)
  }
  return parts.join(', ')
}