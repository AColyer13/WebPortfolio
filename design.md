# Design — Adam Colyer Portfolio

A locked design system for this site. Every redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
Single-route marketing portfolio. Sections share one system; they vary only in
local rhythm.

Section order: Intro → Projects → Experience → Skills → Contact. Projects lead
because the work is the evidence; the sales history backs it up.

- Marketing / intro: Split Hero (name/copy paired with a framed portrait image; stacks on mobile)
- Experience / contact: Long Document (start-aligned heads; hairline rules)
- Projects: Catalogue, equal 3-up grid (no featured/double-span card)
- Skills: dense definition lists — not chip clusters

## Theme
Custom charcoal paper (cool neutral). No purple, no cream-serif cliché, no glow.

- `--color-paper`   oklch(98% 0.005 260)
- `--color-paper-2` oklch(96% 0.01 260)
- `--color-ink`     oklch(28% 0.03 260)
- `--color-ink-2`   oklch(48% 0.02 260)
- `--color-rule`    oklch(90% 0.01 260)
- `--color-primary` oklch(28% 0.02 260)  (ink buttons)
- `--color-focus`   oklch(28% 0.02 260)
- `--color-accent`  oklch(58% 0.17 40) light / oklch(74% 0.14 50) dark — signature only, see below

Dark scheme uses the same OKLCH hue family (no hex drift).

Mapped project tokens: `--color-bg` ← paper, `--color-text-default` ← ink,
`--color-border-default` ← rule, `--color-primary-600` ← primary.

## Signature
One memorable thing, used once: a hand-drawn double stroke in `--color-accent`
under "build it." in the hero line. It draws in once on load (skipped under
reduced motion) and is echoed in the favicon and `og-card.jpg`. The accent
appears in exactly one other place — the open state of a project's (i) button
and its description rule. Do not add more accent uses; that is what keeps it
memorable.

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
- Reveal: none by default (typography carries presence). Sole exception: the
  hero signature stroke draws once (900ms, `--ease-out`)
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
- Intro MAY pair copy with a framed photo (Tier: real asset; bordered box,
  `--radius-lg`, not full-bleed).
- Other sections: typography + rules only; no decorative enrichment.
- Elsewhere, cards only when the surface IS the interaction (project row with
  links). Prefer hairlines over filled cards.

## What pages MUST share
- Wordmark / name treatment (Newsreader on brand + section h2)
- Accent colour ≤ 5% of viewport (signature stroke + open (i) state only)
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
