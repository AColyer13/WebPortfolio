import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const base = mode === 'development' || mode === 'test' ? '/' : './'
  return {
    root: path.join(projectRoot, 'src'),
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        // GitHub Pages: drop crossorigin (breaks CSS on reload) and load CSS before JS.
        name: 'production-html-assets',
        transformIndexHtml(html, ctx) {
          if (ctx.server) return html

          let result = html.replace(/\s+crossorigin(?:\s*=\s*"[^"]*")?/gi, '')

          const styles = [...result.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)].map(
            (m) => m[0],
          )
          const modules = [
            ...result.matchAll(/<script\s+type="module"[^>]*><\/script>/gi),
          ].map((m) => m[0])

          if (!styles.length || !modules.length) return result

          for (const tag of [...styles, ...modules]) {
            result = result.replace(tag, '')
          }
          const block = [...styles, ...modules].join('\n    ')
          return result.replace('</head>', `    ${block}\n  </head>`)
        },
      },
    ],
    build: {
      outDir: path.join(projectRoot, 'dist'),
      emptyOutDir: true,
      cssCodeSplit: false,
    },
    publicDir: path.join(projectRoot, 'public'),
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  }
})
