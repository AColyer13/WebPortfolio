/**
 * Static WCAG 2.2 contrast checks for design tokens in src/styles/theme.css.
 * Complements axe color-contrast on the built page (npm run test:a11y).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { converter, wcagContrast } from 'culori'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const themePath = path.join(__dirname, '..', 'src', 'styles', 'theme.css')
const toRgb = converter('rgb')

const MIN_BODY = 4.5

/** [foreground token, background token, minimum ratio, label] */
const PAIRS = [
  ['--color-text-default', '--color-surface-0', MIN_BODY, 'body text on surface'],
  ['--color-text-muted', '--color-surface-0', MIN_BODY, 'muted text on surface'],
  ['--color-text-muted', '--color-surface-50', MIN_BODY, 'muted text on surface-50'],
  ['--color-text-subtle', '--color-surface-0', MIN_BODY, 'subtle text on surface'],
  ['--color-primary-600', '--color-surface-0', MIN_BODY, 'primary link on surface'],
  ['--color-text-on-primary', '--color-primary-600', MIN_BODY, 'text on primary button'],
  ['--color-danger-700', '--color-danger-bg', MIN_BODY, 'danger message on danger bg'],
  ['--color-text-default', '--color-surface-50', MIN_BODY, 'body text on surface-50'],
]

function parseBlock(css, selector) {
  const idx = css.indexOf(selector)
  if (idx === -1) return {}
  const open = css.indexOf('{', idx)
  if (open === -1) return {}
  let depth = 1
  let i = open + 1
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') depth -= 1
    i += 1
  }
  const body = css.slice(open + 1, i - 1)
  const vars = {}
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/)
    if (m) vars[m[1]] = m[2].trim()
  }
  return vars
}

function resolveColor(value, vars) {
  if (!value) return null
  if (value.startsWith('var(')) {
    const name = value.match(/var\((--[^,)]+)/)?.[1]
    if (name && vars[name]) return resolveColor(vars[name], vars)
    return null
  }
  if (value.startsWith('oklch(from')) return null
  const rgb = toRgb(value)
  if (!rgb || rgb.mode !== 'rgb') return null
  return rgb
}

function checkPalette(name, vars) {
  const failures = []
  for (const [fg, bg, min, label] of PAIRS) {
    const fgColor = resolveColor(vars[fg], vars)
    const bgColor = resolveColor(vars[bg], vars)
    if (!fgColor || !bgColor) {
      failures.push(`${name}: could not resolve ${fg} on ${bg} (${label})`)
      continue
    }
    const ratio = wcagContrast(fgColor, bgColor)
    if (ratio < min) {
      failures.push(
        `${name}: ${label} — ${ratio.toFixed(2)}:1 (need ${min}:1) [${fg} on ${bg}]`,
      )
    }
  }
  return failures
}

const css = readFileSync(themePath, 'utf8')
const light = parseBlock(css, ':root {') || parseBlock(css, ':root')
const darkExplicit = parseBlock(css, ":root[data-theme='dark']")
const darkMedia = parseBlock(css, ":root[data-theme='system']")

const failures = [
  ...checkPalette('light', light),
  ...checkPalette('dark (data-theme)', darkExplicit),
  ...checkPalette('dark (prefers-color-scheme)', { ...light, ...darkMedia }),
]

if (failures.length) {
  console.error('Token contrast check failed:\n')
  for (const f of failures) console.error(`  • ${f}`)
  process.exit(1)
}

console.log(`Token contrast OK (${PAIRS.length} pairs × 3 palettes).`)
