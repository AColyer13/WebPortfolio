# Design — Adam Colyer Portfolio

A locked design system for this site. Every redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
Single-route marketing portfolio. Sections share one system; they vary only in
local rhythm.

- Marketing / intro: Marquee Hero (full-bleed media plane; brand as hero signal)
- Experience / contact: Long Document (start-aligned heads; hairline rules)
- Projects: Catalogue (irregular spans; no equal three-card grid)
- Skills: dense definition lists — not chip clusters

## Theme
Custom charcoal paper (cool neutral). No purple, no cream-serif cliché, no glow.

- `--color-paper`   oklch(98% 0.005 260)
- `--color-paper-2` oklch(96% 0.01 260)
- `--color-ink`     oklch(28% 0.03 260)
- `--color-ink-2`   oklch(48% 0.02 260)
- `--color-rule`    oklch(90% 0.01 260)
- `--color-accent`  oklch(28% 0.02 260)
- `--color-focus`   oklch(28% 0.02 260)

Dark scheme uses the same OKLCH hue family (no hex drift).

Mapped project tokens: `--color-bg` ← paper, `--color-text-default` ← ink,
`--color-border-default` ← rule, `--color-primary-600` ← accent.

## Typography
- Display: Newsreader Variable, weight 500–600, style normal (headings only)
- Body: Source Sans 3 Variable, weight 400–500
- Mono: ui-monospace, monospace (rare)
- Display tracking: -0.02em on h1
- Type scale: existing fluid `--font-size-fluid-*` anchors

Self-hosted via `@fontsource-variable/*`. Preload critical woff2 only.

## Spacing
8px / 4px rhythm via named `--spacing-*`. Prefer logical properties.
Pages must use tokens / Tailwind theme aliases — no raw one-off gaps.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- Reveal: none by default (typography carries presence)
- Reduced-motion: opacity-only collapses; durations ≤ 0.01ms via existing gate
- Respect `prefers-reduced-transparency`, `prefers-contrast`, `prefers-reduced-data`

## Microinteractions stance
- Silent success on contact form (status region, no celebratory toast)
- Hover delay none on primary controls; focus rings instant and unanimated
- Destructive actions: N/A on this site

## CTA voice
- Primary: solid ink fill, `rounded-md`, min-height 44px, plain verb labels
- Secondary: hairline border, transparent fill
- No pills (`rounded-full` forbidden for CTAs)

## Per-page allowances
- Intro MAY use full-bleed photography (Tier: real asset).
- Other sections: typography + rules only; no decorative enrichment.
- Cards forbidden in hero. Elsewhere only when the surface IS the interaction
  (project row with links). Prefer hairlines over filled cards.

## What pages MUST share
- Wordmark / name treatment (Newsreader on brand + section h2)
- Accent colour ≤ 5% of viewport (mostly ink buttons + focus)
- Display + body pairing
- CTA voice
- Start-aligned section headings (not centered)

## What pages MAY differ on
- Column count and span within Catalogue / Long Document
- Whether media is present (intro only)

## Accessibility floor
WCAG 2.2 AA. Skip link, landmarks, focus-visible ≥ 3:1, forced-colors support,
axe-core in CI. Inline field errors associated + first invalid focused on submit.

## Exports
See `tokens.css` at project root for the portable token block.
