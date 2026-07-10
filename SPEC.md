# SPEC — Portfolio Website

> What this site **must** do. Single source of truth for what "done" means.
> Source-of-data → [`src/data/portfolio.ts`](src/data/portfolio.ts).
> Source-of-content → [`src/components/`](src/components/).

## Requirements

1. Show **who** (intro, contact) — About section + contact details.
2. Show **what** (projects) — thumbnails linking to live demos / repos.
3. Show **how** (skills, experience) — Skills grid + timeline.
4. Let visitors **reach out** — EmailJS form + social links.
5. **Navigate fast** — sticky Navbar, scroll-spy active state, URL hash sync.
6. **Work everywhere** — light / dark / system, mobile / desktop, reduced-motion / high-contrast / reduced-transparency / forced-colors. Cross-browser matrix and feature-detection rules documented in [`docs/COMPAT.md`](docs/COMPAT.md).
7. **Be accessible** — skip link, semantic landmarks, valid markup (axe-clean).
8. **Be fast** — bundle code-split, images in AVIF/WebP + intrinsic size, lazy-load 3rd-party widgets.

## Sections (DOM order)

| id        | Component       | Purpose                                |
| --------- | --------------- | -------------------------------------- |
| `#about`  | `About`         | Intro, resume download, hero image     |
| `#skills` | `Skills`        | Categorized skill grid                 |
| `#experience` | `Experiences` | Timeline (year · role · description)   |
| `#projects` | `Projects`    | Project cards (thumb + live + repo)    |
| `#contact` | `Contact`      | Form + map + socials                   |

## Stack (pinned)

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4 (OKLCH design tokens)
- `lucide-react` + custom SVG paths (FontAwesome dropped — see Changelog)
- `vitest` + Testing Library for tests
- `axe-core/cli` for a11y scans after build

## Non-goals

- No CMS — content is in TS data files.
- No web fonts — system stack only (`Plain` → `-apple-system` / `BlinkMacSystemFont` → `Segoe UI` → `system-ui`).
- No analytics — GitHub Pages privacy.
- No router — single page, hash anchors.

## Changelog

- **2026-07-10** — Cross-browser matrix document [`docs/COMPAT.md`](docs/COMPAT.md) added. Font stack extended with `-apple-system`, `BlinkMacSystemFont`, `Segoe UI` for native macOS / Windows rendering. `scrollbar-gutter: stable` on `html` to eliminate Windows "always show scrollbars" layout shift. Skip-link uses logical `focus:start-2`. `browserslist` block added to `package.json`. Two physical `left-*` Tailwind classes audited — only `Projects.tsx:47` overlay centering intentionally retained (documented in `docs/COMPAT.md`).
- **2026-07-10** — Dropped `@fortawesome/fontawesome-free` (~300 KB CSS).
  All FA glyph classes replaced with `Icon` (`lucide-react` + custom paths).
  Extracted scroll-spy from `App.tsx` → `src/hooks/useSectionNavigation.ts`.
  Lazy-loaded `@emailjs/browser` → separate chunk fetched on first submit.
  CSS: **343 KB → 43 KB** (~87% smaller).
