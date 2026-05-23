import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

// Relative base in production: one build works on GitHub Pages subpaths and custom domains.
// `index.html` lives under `src/` so the repo root is not a dev entrypoint.
export default defineConfig(({ mode }) => {
  const base = mode === 'development' || mode === 'test' ? '/' : './'
  return {
    root: path.join(projectRoot, 'src'),
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        // Vite adds crossorigin to CSS in production; on GitHub Pages that can load the
        // sheet in CORS mode and leave link.sheet null so styles never apply after reload.
        name: 'strip-stylesheet-crossorigin',
        transformIndexHtml(html, ctx) {
          if (ctx.server) return html
          return html
            .replace(
              /<link([^>]*)\s+crossorigin(?:\s*=\s*"[^"]*")?([^>]*rel="stylesheet"[^>]*)>/gi,
              '<link$1$2>',
            )
            .replace(
              /<link([^>]*rel="stylesheet"[^>]*)\s+crossorigin(?:\s*=\s*"[^"]*")?([^>]*)>/gi,
              '<link$1$2>',
            )
        },
      },
    ],
    build: {
      outDir: path.join(projectRoot, 'dist'),
      emptyOutDir: true,
    },
    publicDir: path.join(projectRoot, 'public'),
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  }
})
