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

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run preview` — Preview build
- `npm run preview:pages` — Build then preview production output
- `npm run lint` — ESLint
- `npm run test` — Vitest

## Customize

- **Projects, skills, timeline:** [`src/data/portfolio.ts`](src/data/portfolio.ts)
- **Sections / copy:** [`src/components/`](src/components/)
- **Theme:** [`src/styles/theme.css`](src/styles/theme.css), [`src/index.css`](src/index.css) (Tailwind + `@theme` tokens)

## GitHub Pages deploy

On push to **`main`**, CI runs tests, builds, removes stale published files at the repo root, then commits **`dist/`** to **`main`** (see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

Single source of truth:
- **Edit only:** `src/index.html` (Vite source entry)
- **Do not edit:** root `index.html`, `assets/`, etc. (generated deploy artifacts committed by CI)

**Pages settings:** Branch **`main`**, folder **`/` (root)** — not `/docs`. Use **Deploy from a branch**, not “GitHub Actions” as the Pages source.

**Local testing (important):**
- Day-to-day work: `npm run dev` (http://localhost:5173)
- Production-like check: `npm run build && npm run preview` (http://localhost:4173)
- Do **not** open the repo-root `index.html` in the browser or use `npx serve .` on the repo root — that file is the last deploy artifact, not the dev app.

After a deploy, do **one** hard refresh (`Ctrl+Shift+R`) once to drop any old cached HTML/CSS from earlier broken builds. Normal reload should work after that.

## Contributing

Run `npm run lint` and `npm run test` before PRs.

## License

MIT — see [LICENSE](LICENSE).
