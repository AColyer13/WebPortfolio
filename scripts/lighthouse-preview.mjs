/**
 * Vite preview + Lighthouse (performance, a11y, best-practices, SEO).
 * Run after `npm run build` (see `npm run test:lighthouse`).
 */
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const port = 4189
const base = (process.env.VITE_BASE_PATH ?? '/Portfolio-Website/').replace(/\/?$/, '/')
const url = `http://localhost:${port}${base}`
const reportDir = path.join(root, '.lighthouse')
const reportPath = path.join(reportDir, 'report.json')

/** min score 0–1; `error` fails CI, `warn` logs only */
const THRESHOLDS = {
  performance: { min: 0.75, level: 'warn' },
  accessibility: { min: 0.95, level: 'error' },
  'best-practices': { min: 0.85, level: 'warn' },
  seo: { min: 0.85, level: 'warn' },
}

function waitForHttp(u, timeoutMs = 90000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const poll = () => {
      http
        .get(u, (res) => {
          res.resume()
          resolve()
        })
        .on('error', () => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Timeout waiting for ${u}`))
          } else {
            setTimeout(poll, 300)
          }
        })
    }
    setTimeout(poll, 400)
  })
}

const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const lighthouseBin = path.join(root, 'node_modules', 'lighthouse', 'cli', 'index.js')

const preview = spawn(process.execPath, [
  viteBin,
  'preview',
  '--port',
  String(port),
  '--strictPort',
  '--host',
  'localhost',
], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env },
})

preview.on('error', (err) => {
  console.error(err)
  process.exit(1)
})

function cleanup(code) {
  preview.kill('SIGTERM')
  process.exit(code)
}

try {
  await waitForHttp(url)
  fs.mkdirSync(reportDir, { recursive: true })

  const lh = spawnSync(
    process.execPath,
    [
      lighthouseBin,
      url,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--chrome-flags=--headless --no-sandbox',
      '--output=json',
      `--output-path=${reportPath}`,
      '--quiet',
    ],
    { cwd: root, stdio: 'inherit' },
  )

  if (lh.status !== 0) {
    cleanup(lh.status ?? 1)
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
  let failed = false

  for (const [category, { min, level }] of Object.entries(THRESHOLDS)) {
    const score = report.categories[category]?.score ?? 0
    const pct = Math.round(score * 100)
    const minPct = Math.round(min * 100)
    if (score < min) {
      const msg = `Lighthouse ${category}: ${pct} (min ${minPct})`
      if (level === 'error') {
        console.error(`error: ${msg}`)
        failed = true
      } else {
        console.warn(`warn: ${msg}`)
      }
    } else {
      console.log(`ok: ${category} ${pct}`)
    }
  }

  cleanup(failed ? 1 : 0)
} catch (e) {
  console.error(e)
  cleanup(1)
}
