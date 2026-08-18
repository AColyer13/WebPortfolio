# Portfolio Website

A single-page personal portfolio. See [SPEC.md](SPEC.md) for what the site does.

## Stack

| | |
|---|---|
| **Framework** | React 19 + TypeScript + Vite 7 |
| **Styling**   | Tailwind v4 (OKLCH design tokens in `src/index.css`) |
| **Icons**     | `lucide-react` + custom SVG paths in `src/components/Icons.tsx` |
| **Contact**   | EmailJS (lazy-loaded SDK, fetched on submit) |
| **Tests**     | Vitest + Testing Library; axe-core/cli for a11y |
## Supported browsers

Last 2 versions of Chrome, Firefox, Safari (16+), and Edge. Details: [docs/COMPAT.md](docs/COMPAT.md).
## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command               | What it does                                    |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Vite dev server                                 |
| `npm run build`       | Build image variants + sprite → `tsc` → `vite build` |
| `npm run preview`     | Serve `dist/` locally (http://localhost:4173)   |
| `npm run lint`        | ESLint (zero warnings tolerated)                |
| `npm test`            | Vitest one-shot                                 |
| `npm run test:watch`  | Vitest in interactive watch mode                |
| `npm run test:a11y`   | Build, preview, scan with axe (curated rules)   |

## File map

- `src/data/portfolio.ts` — projects, skills, timeline
- `src/components/`      — section components (`About`, `Skills`, …)
- `src/hooks/`           — `useSectionNavigation` (scroll-spy + header hide)
- `src/utils/`           — `baseUrl`, `layoutClasses`, `pictureSources`, `retryWithBackoff`, `sections`, `contact`
- `src/theme/`           — `colorScheme` (light / dark / system)
- `scripts/`             — `generate-image-variants.mjs`, `generate-svg-sprite.mjs`, `axe-preview.mjs`

## Deploy (GitHub Pages)

Push to `main` → CI runs tests → builds → uploads `dist/` as a Pages artifact.

**Pages settings:** Repo → Settings → Pages → Source: **GitHub Actions**.
If deploy fails with `401 Bad credentials`, this setting is the cause.

## License

MIT — see [LICENSE](LICENSE).
