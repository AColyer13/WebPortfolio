/**
 * Vite preview + axe-cli (WCAG color-contrast only — focused automated check per style guide).
 * Run after `npm run build` (see `npm run test:a11y`).
 */
import { spawn, spawnSync } from 'node:child_process'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
/** Avoid clashing with a manual `vite preview` on the default port. */
const port = 4187
// Production build uses relative base (`./`); preview serves from repo root at `/`.
const base = '/'
/**
 * Use `localhost` (not 127.0.0.1): Vite binds to `localhost` which may resolve to IPv6 (::1);
 * polling IPv4 only fails on many Linux/CI runners while the server is up.
 */
const url = `http://localhost:${port}${base}`

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

try {
  await waitForHttp(url)
  const result = spawnSync('npx', ['axe', url, '--exit', '--rules', 'color-contrast'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  })
  preview.kill('SIGTERM')
  process.exit(result.status ?? 1)
} catch (e) {
  console.error(e)
  preview.kill('SIGTERM')
  process.exit(1)
}
