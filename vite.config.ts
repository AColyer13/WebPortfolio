import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

// `base` in production: set VITE_BASE_PATH to match your Pages URL (see README).
// `index.html` lives under `src/` so the repo root has no dev entrypoint — GitHub Pages
// must not serve a root `index.html` that references `*.tsx` (wrong MIME for raw files).
export default defineConfig(({ mode }) => {
  const base =
    mode === 'development' || mode === 'test'
      ? '/'
      : (process.env.VITE_BASE_PATH ?? '/Portfolio-Website/')
  return {
    root: path.join(projectRoot, 'src'),
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        // GitHub Pages: `crossorigin` on <link rel="stylesheet"> can prevent the sheet from
        // applying in some browsers/extensions (CORS-mode load). ES modules keep crossorigin.
        // Also discourage caching index.html so deploys don't pair stale HTML with deleted hashes.
        name: 'github-pages-html',
        transformIndexHtml(html, ctx) {
          if (ctx.server) return html
          let out = html.replace(
            /<link([^>]*)\s+crossorigin(\s*=\s*"[^"]*")?([^>]*rel="stylesheet"[^>]*)>/g,
            '<link$1$3>',
          ).replace(
            /<link([^>]*rel="stylesheet"[^>]*)\s+crossorigin(\s*=\s*"[^"]*")?([^>]*)>/g,
            '<link$1$3>',
          )
          if (!out.includes('http-equiv="Cache-Control"')) {
            out = out.replace(
              '<head>',
              '<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />',
            )
          }
          return out
        },
      },
    ],
    build: {
      // Resolved against projectRoot (repo root), not Vite `root` (src/). Otherwise output
      // lands in src/dist and CI (folder: dist) cannot find it.
      outDir: path.join(projectRoot, 'dist'),
      emptyOutDir: true,
    },
    // Relative to Vite `root` (src/), the default `public` would be src/public — use repo-root public/.
    publicDir: path.join(projectRoot, 'public'),
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  }
})
