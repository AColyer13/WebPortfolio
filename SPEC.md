# SPEC — Portfolio Website

Plain checklist for what this site must do. Content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts). UI lives in [`src/components/`](src/components/).

## Must-haves

1. **Intro** — Name, role, short bio, resume download, link to contact (`#about`).
2. **Experience** — Work history timeline (`#experience`).
3. **Projects** — Featured cards show first, and a button reveals the rest. Each card links to live demo and GitHub repository (`#projects`).
4. **Skills** — Engineering discipline blocks in collapsible rows with detailed popovers (`#skills`).
5. **Contact** — Email form (EmailJS, loaded only on submit), map (click to load), social links (`#contact`).
6. **Navigation** — Sticky header, scroll-spy highlights the current section, URL hash stays in sync.
7. **Every device** — Light / dark / system theme. Works on phone and desktop. Respects reduced motion, high contrast, and forced-colors. Browser details: [`docs/COMPAT.md`](docs/COMPAT.md).
8. **Accessible** — Skip link, semantic HTML, passes axe scan after build.
9. **Fast** — Small CSS bundle, AVIF/WebP images with correct `<picture>` sources, lazy-load images below the fold, EmailJS in its own chunk.

## Page sections (top to bottom)

| Section id   | Component     | What it shows                          |
| ------------ | ------------- | -------------------------------------- |
| `#about`     | `About`       | Intro, resume, contact CTA             |
| `#experience`| `Experiences` | Timeline                               |
| `#projects`  | `Projects`    | Project cards                          |
| `#skills`    | `Skills`      | Skill discipline groups                |
| `#contact`   | `Contact`     | Form, map, socials                     |

## Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS v4 (OKLCH tokens in `src/index.css`)
- `lucide-react` + `Icons.tsx` for SVG icons
- Vitest + Testing Library; `npm run test:a11y` after build

## Out of scope

- No CMS, no web fonts, no analytics, no client-side router.
