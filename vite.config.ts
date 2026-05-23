import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
      {
        name: 'html-csp-production',
        transformIndexHtml(html, ctx) {
          if (ctx.server) return html
          const csp = [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self'",
            "font-src 'self' data:",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.emailjs.com",
            "frame-src https://www.google.com https://www.google.com/maps https://maps.google.com https://www.gstatic.com",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; ')
          let result = html.replace(
            '<head>',
            `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
          )
          // Ensure <link rel="stylesheet"> tags always appear before <script type="module">
          // so CSS is render-blocking and available before React mounts, preventing FOUC.
          const styleLinks = [...result.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m => m[0])
          const scriptTags = [...result.matchAll(/<script\s[^>]*type="module"[^>]*><\/script>/g)].map(m => m[0])
          if (styleLinks.length && scriptTags.length) {
            // Remove all stylesheet links and module scripts from their current positions
            for (const tag of [...styleLinks, ...scriptTags]) {
              result = result.replace(tag, '')
            }
            // Re-inject: stylesheets first, then module scripts, just before </head>
            const injection = [...styleLinks, ...scriptTags].join('\n    ')
            result = result.replace('</head>', `    ${injection}\n  </head>`)
          }
          return result
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
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
