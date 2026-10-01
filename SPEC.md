# SPEC — Portfolio Website

Plain checklist for what this site must do. Content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts). UI lives in [`src/components/`](src/components/).

## Must-haves

1. **Intro** — Name, role, the sales-to-engineering line (with the accent underline), short bio, resume download, link to contact (`#about`).
2. **Projects** — Featured cards show first, and a button reveals the rest. Each card has an (i) button that reveals a one- or two-sentence description, a live demo link when there is one, and a GitHub link (`#projects`).
3. **Experience** — Work history timeline with month ranges (`#experience`).
4. **Skills** — Engineering discipline blocks as plain lists in two balanced columns (`#skills`).
5. **Contact** — Email form (EmailJS, loaded only on submit), location, email, social links. No phone number on the public page (`#contact`).
6. **Footer** — GitHub, LinkedIn, email, and a link to this site's source.
7. **Navigation** — Sticky header, scroll-spy highlights the current section, URL hash stays in sync.
8. **Every device** — Light / dark / system theme. Works on phone and desktop. Respects reduced motion, high contrast, and forced-colors. Browser details: [`docs/COMPAT.md`](docs/COMPAT.md).
9. **Accessible** — Skip link, semantic HTML, passes axe scan after build.
10. **Fast** — Small CSS bundle, AVIF/WebP images with correct `<picture>` sources, lazy-load images below the fold, EmailJS in its own chunk.

## Page sections (top to bottom)

| Section id   | Component     | What it shows                          |
| ------------ | ------------- | -------------------------------------- |
| `#about`     | `About`       | Intro, resume, contact CTA             |
| `#projects`  | `Projects`    | Project cards                          |
| `#experience`| `Experiences` | Timeline                               |
| `#skills`    | `Skills`      | Skill discipline groups                |
| `#contact`   | `Contact`     | Form, map, socials                     |

## Share assets

- `public/favicon.svg` (AC monogram, follows light/dark) and `public/apple-touch-icon.png`.
- `public/og-card.jpg` — 1200×630 link-preview card used by `og:image` / `twitter:image`. Regenerate it if the hero line or name changes.

## Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS v4 (OKLCH tokens in `src/index.css`)
- `lucide-react` + `Icons.tsx` for SVG icons
- Vitest + Testing Library; `npm run test:a11y` after build

## Out of scope

- No CMS, no analytics, no client-side router.

## Typography

- Self-hosted variable fonts only (`@fontsource-variable/newsreader`, `@fontsource-variable/source-sans-3`). No remote font CDNs.
