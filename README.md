# Portfolio Website

Personal portfolio — React, TypeScript, Vite.

**Live:** https://acolyer13.github.io/Portfolio-Website/

## Stack

- React (TS) + Vite; Tailwind CSS v4 (design tokens in OKLCH) · Font Awesome
- Contact: EmailJS · Map: Google embed

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

| Script | |
|--------|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run preview:pages` | Build then preview (like Pages) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run test:a11y` | Build + axe color-contrast check |
| `npm run test:lighthouse` | Build + Lighthouse (perf, a11y, SEO) |
| `npm run test:quality` | Lint, audit, test, a11y, Lighthouse |

## Customize

- **Projects, skills, timeline:** [`src/data/portfolio.ts`](src/data/portfolio.ts)
- **Sections / copy:** [`src/components/`](src/components/)
- **Theme:** [`src/styles/theme.css`](src/styles/theme.css), [`src/index.css`](src/index.css) (Tailwind + `@theme` tokens)

## GitHub Pages deploy

On push to **`main`**, CI runs tests, builds with `VITE_BASE_PATH=/Portfolio-Website/`, then commits **`dist/`** to the **repo root** on **`main`** (see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). You work in **`src/`** and **`public/`**; root **`index.html`**, **`assets/`**, **`images/`**, **`files/`**, etc. are the published site.

**Pages settings:** Branch **`main`**, folder **`/` (root)** — not `/docs`. Use **Deploy from a branch**, not “GitHub Actions” as the Pages source (the workflow commits artifacts; Pages reads the branch).

Production-like build locally:

```bash
VITE_BASE_PATH=/Portfolio-Website/ npm run build
```

Compare output in **`dist/`** to what lands at root on deploy.

## Quality & security

- **CI** (`.github/workflows/ci.yml`): lint, `npm audit` (high+), tests, build, axe, Lighthouse on PRs and `main`.
- **Dependabot** (`.github/dependabot.yml`): weekly npm updates.
- **SEO**: Open Graph / Twitter meta tags in `src/index.html`.

## Contributing

Run `npm run test:quality` before PRs (or at minimum `npm run lint` and `npm run test`).

## License

MIT — see [LICENSE](LICENSE).
