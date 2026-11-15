import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Rolldown } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** Primary latin variable-font subsets only — latin-ext loads on demand via unicode-range. */
function fontPreloadTags(bundle: Rolldown.OutputBundle): string {
  const tags: string[] = []
  for (const chunk of Object.values(bundle)) {
    if (chunk.type !== 'asset') continue
    const { fileName } = chunk
    if (!fileName.endsWith('.woff2')) continue
    if (!fileName.includes('latin-wght-normal') || fileName.includes('latin-ext')) continue
    tags.push(
      `<link rel="preload" href="./${fileName}" as="font" type="font/woff2" crossorigin>`,
    )
  }
  return tags.join('\n    ')
}

export default defineConfig(({ mode }) => {
  const base = mode === 'development' || mode === 'test' ? '/' : './'
  return {
    root: path.join(projectRoot, 'src'),
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        // GitHub Pages: drop crossorigin on CSS/JS (breaks stylesheet on reload),
        // preload critical latin fonts, and load CSS before JS.
        name: 'production-html-assets',
        transformIndexHtml: {
          order: 'post',
          handler(html, ctx) {
            if (ctx.server) return html

            let result = html.replace(
              /(<link[^>]*rel=["']stylesheet["'][^>]*)\s+crossorigin(?:=["'][^"']*["'])?/gi,
              '$1',
            )
            result = result.replace(
              /(<script[^>]*type=["']module["'][^>]*)\s+crossorigin(?:=["'][^"']*["'])?/gi,
              '$1',
            )

            if (ctx.bundle) {
              const preloads = fontPreloadTags(ctx.bundle)
              if (preloads) {
                result = result.replace(
                  '<title>',
                  `    ${preloads}\n    <title>`,
                )
              }
            }

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
      },
    ],
    build: {
      outDir: path.join(projectRoot, 'dist'),
      emptyOutDir: true,
      cssCodeSplit: false,
      // Preserve the existing Safari 16 browser support after Vite 8's target change.
      target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
      modulePreload: { polyfill: false },
      rolldownOptions: {
        // Split React runtime into a long-lived vendor chunk so it stays cached
        // across deploys (only the app chunk changes when components move).
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'react-vendor',
                test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              },
            ],
          },
        },
      },
    },
    publicDir: path.join(projectRoot, 'public'),
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  }
})
