// Generates a single sprite SVG (`public/sprite.svg`) containing every skill
// icon referenced in `src/data/portfolio.ts`. The sprite is referenced via
// `<svg><use href="/sprite.svg#icon-{name}"/></svg>` in `Skills.tsx`, so the
// browser caches one ~25 KB gzip file instead of 71 separate HTTP requests.
//
// Brand-color SVGs in `public/images/` get their `fill="#..."` stripped and
// replaced with `fill="currentColor"` so the icon picks up the parent's
// `color:` — preserving the monochrome look `mask-image` previously provided
// in `.skill-card__logo`. SVGs that use `<mask>` for cutouts (e.g. FastAPI's
// bolt) keep their `fill="white"`/`fill="black"` semantics intact because
// those colors are what the mask mode actually keys off.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = resolve(__dirname, '..', 'public')
const PUBLIC_IMAGES = resolve(PUBLIC_DIR, 'images')
const PORTFOLIO_TS = resolve(__dirname, '..', 'src', 'data', 'portfolio.ts')
const SPRITE_OUT = resolve(PUBLIC_DIR, 'sprite.svg')

/**
 * Pull every `icon: 'images/foo.svg'` value out of `portfolio.ts`. The file
 * uses simple key/value literals so a regex scan is sufficient (no need to
 * spin up a TS parser for this).
 */
async function readReferencedIcons() {
  const src = await readFile(PORTFOLIO_TS, 'utf8')
  const matches = [...src.matchAll(/icon:\s*'([^']+\.svg)'/g)]
  return [...new Set(matches.map((m) => m[1]))]
}

/**
 * Recursive XML-ish walker: emits each element's start tag, processes its
 * children, and emits its end tag. We tag "preserve" elements (anything whose
 * alpha channel carries semantic meaning, e.g. <mask>) so child `fill`
 * rewriting is skipped inside them.
 *
 * `src` is a string of inner SVG XML. `startIdx` is the index of the first `<`
 * of the root element we should process.
 */
function walkChildren(src, startIdx, endIdx, insidePreserve) {
  let out = ''
  let i = startIdx
  while (i < endIdx) {
    const lt = src.indexOf('<', i)
    if (lt === -1 || lt >= endIdx) {
      out += src.slice(i, endIdx)
      break
    }
    out += src.slice(i, lt)
    if (src.startsWith('<!--', lt)) {
      const close = src.indexOf('-->', lt + 4)
      const stop = close === -1 ? endIdx : close + 3
      // Drop comments from the output entirely.
      i = stop
      continue
    }
    if (src.startsWith('<![', lt)) {
      // CDATA / DOCTYPE: pass through verbatim.
      const close = src.indexOf('>', lt)
      const stop = close === -1 ? endIdx : close + 1
      out += src.slice(lt, stop)
      i = stop
      continue
    }
    const tagEnd = src.indexOf('>', lt)
    if (tagEnd === -1) {
      out += src.slice(lt, endIdx)
      break
    }
    const rawTag = src.slice(lt, tagEnd + 1)
    const tagMatch = rawTag.match(/^<\s*\/\s*([a-zA-Z][a-zA-Z0-9-]*)/)
    if (tagMatch) {
      out += rawTag
      i = tagEnd + 1
      continue
    }
    const openMatch = rawTag.match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)\s*>/)
    if (!openMatch) {
      out += rawTag
      i = tagEnd + 1
      continue
    }
    const [, tag, attrs, selfClose] = openMatch
    const lower = tag.toLowerCase()
    const isVoid = selfClose === '/' || ['path', 'circle', 'rect', 'ellipse', 'line', 'polygon', 'polyline', 'use', 'image', 'stop', 'feoffset', 'fegaussianblur', 'fecolormatrix', 'femerge', 'femergenode', 'feflood', 'fecomposite', 'fesourcegraphic'].includes(lower)

    // Drop a handful of attributes that don't belong in a sprite symbol.
    const cleanedAttrs = stripAttributes(attrs, lower)

    // Force monochrome on visible children only — not inside <mask>/<pattern>.
    const fillPreserve = insidePreserve || lower === 'mask' || lower === 'pattern'
    const finalAttrs = fillPreserve
      ? cleanedAttrs
      : rewriteFillAttrs(cleanedAttrs)

    out += `<${tag}${finalAttrs}${isVoid ? ' />' : '>'}`

    if (!isVoid) {
      // Find the matching close tag, accounting for nesting.
      const closeIdx = findMatchingClose(src, lt, tag)
      if (closeIdx === -1) {
        // Malformed; emit the rest as-is.
        out += src.slice(tagEnd + 1, endIdx)
        break
      }
      const childStart = tagEnd + 1
      out += walkChildren(src, childStart, closeIdx, insidePreserve || lower === 'mask' || lower === 'pattern')
      out += `</${tag}>`
      i = closeIdx + (`</${tag}>`.length)
    } else {
      i = tagEnd + 1
    }
  }
  return out
}

function findMatchingClose(src, openIdx, tag) {
  const lower = tag.toLowerCase()
  const openRe = new RegExp(`<\\s*${lower}\\b`, 'gi')
  const closeRe = new RegExp(`<\\s*/\\s*${lower}\\s*>`, 'gi')
  openRe.lastIndex = openIdx + 1
  closeRe.lastIndex = openIdx + 1
  let depth = 1
  while (depth > 0) {
    closeRe.lastIndex = Math.max(closeRe.lastIndex, openIdx + 1)
    openRe.lastIndex = Math.max(openRe.lastIndex, openIdx + 1)
    const nextClose = closeRe.exec(src)
    if (!nextClose) return -1
    const nextOpen = openRe.exec(src)
    if (!nextOpen || nextOpen.index >= nextClose.index) {
      depth -= 1
      if (depth === 0) return nextClose.index
    } else {
      depth += 1
      openRe.lastIndex = nextOpen.index + 1
    }
  }
  return -1
}

const KEEP_ATTRS_FOR = {
  // Elements where fill is semantically meaningful (alpha-driven).
  mask: true,
  pattern: true,
  // gradient stops already work fine; nothing to drop.
}

/**
 * Drop a handful of attributes that don't belong in a hidden sprite symbol:
 *   - aria-hidden / role="img" (the consuming <svg> owns a11y)
 *   - xmlns (the symbol inherits it from the sprite)
 */
function stripAttributes(attrs, tag) {
  let out = attrs
  out = out.replace(/\s+aria-hidden(?:\s*=\s*"[^"]*")?/gi, '')
  out = out.replace(/\s+role\s*=\s*"[^"]*"/gi, '')
  if (tag === 'svg') {
    out = out.replace(/\s+xmlns(?:\s*=\s*"[^"]*")?/gi, '')
    out = out.replace(/\s+xmlns:xlink(?:\s*=\s*"[^"]*")?/gi, '')
  }
  return out
}

/**
 * Rewrite fill attributes so visible content uses currentColor:
 *   - Strip brand colors like fill="#2496ED" or fill="black" inside a visible
 *     child element (anything outside <mask>/<pattern>).
 *   - Preserve fill="none" (stroked icons depend on it).
 *   - Preserve fill="currentColor" if the source already had it.
 *   - Add fill="currentColor" when no fill is declared (so default black
 *     doesn't sneak through).
 */
function rewriteFillAttrs(attrs) {
  const fillMatch = attrs.match(/\sfill\s*=\s*"([^"]*)"/i)
  const strokeMatch = attrs.match(/\sstroke\s*=\s*"([^"]*)"/i)
  let cleaned = attrs.replace(/\sfill\s*=\s*"[^"]*"/gi, '')

  if (!fillMatch) {
    cleaned = `${cleaned} fill="currentColor"`
  } else {
    const val = fillMatch[1].toLowerCase()
    if (val !== 'none' && val !== 'currentcolor') {
      // Brand hex was stripped; re-add currentColor.
      cleaned = `${cleaned} fill="currentColor"`
    }
    // else: 'none' or 'currentColor' — preserve original meaning.
  }

  return cleaned
}

/**
 * Convert an `<svg ...>...</svg>` source into a `<symbol>` body and viewBox.
 */
function svgToSymbol(filename, raw) {
  const viewBoxMatch = raw.match(/viewBox\s*=\s*"([^"]+)"/i)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24'

  // Strip <title> elements (alt text comes from the skill name in TSX).
  let cleaned = raw
    .replace(/<\?xml[^?]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')

  const rootOpenMatch = cleaned.match(/<svg\b[^>]*>/i)
  if (!rootOpenMatch) {
    throw new Error(`No root <svg> in ${filename}`)
  }
  const rootOpenEnd = rootOpenMatch.index + rootOpenMatch[0].length
  const rootCloseIdx = findMatchingClose(cleaned, rootOpenMatch.index, 'svg')
  if (rootCloseIdx === -1) {
    throw new Error(`Unterminated <svg> in ${filename}`)
  }

  const inner = walkChildren(cleaned, rootOpenEnd, rootCloseIdx, false)
  return { viewBox, body: inner }
}

function slugForFilename(filename) {
  // `images/foo-bar.svg` → `icon-foo-bar`
  const stem = filename.replace(/^images\//, '').replace(/\.svg$/i, '')
  return `icon-${stem}`
}

async function main() {
  const referenced = await readReferencedIcons()
  console.log(`Generating sprite for ${referenced.length} referenced icons…`)

  const symbols = []
  const missing = []
  for (const ref of referenced) {
    const filename = ref.replace(/^images\//, '')
    const fullPath = join(PUBLIC_IMAGES, filename)
    let raw
    try {
      raw = await readFile(fullPath, 'utf8')
    } catch {
      missing.push(ref)
      continue
    }
    const id = slugForFilename(ref)
    const { viewBox, body } = svgToSymbol(filename, raw)
    symbols.push(
      `  <symbol id="${id}" viewBox="${viewBox}">${body}</symbol>`,
    )
  }

  if (missing.length > 0) {
    console.warn(`  (${missing.length} referenced icons missing on disk: ${missing.join(', ')})`)
  }

  // Build the sprite. Hidden by default, never rendered itself.
  const sprite = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">',
    ...symbols,
    '</svg>',
    '',
  ].join('\n')

  await mkdir(PUBLIC_DIR, { recursive: true })
  await writeFile(SPRITE_OUT, sprite, 'utf8')

  const bytes = Buffer.byteLength(sprite, 'utf8')
  console.log(
    `  → ${SPRITE_OUT} (${symbols.length} symbols, ${(bytes / 1024).toFixed(1)} KB)`,
  )
}

main().catch((err) => {
  console.error('generate-svg-sprite failed:', err)
  process.exit(1)
})
