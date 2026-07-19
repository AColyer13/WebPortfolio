import type { ComponentType, SVGProps } from 'react'
import {
  Accessibility,
  Bot,
  Cpu,
  DatabaseZap,
  Disc3,
  ExternalLink,
  FileText,
  FlaskConical,
  Gauge,
  GitBranch,
  GitMerge,
  HardHat,
  Key,
  KeyRound,
  Lightbulb,
  type LucideProps,
  Mail,
  MapPin,
  Moon,
  MousePointer2,
  Orbit,
  Shield,
  ShieldCheck,
  ShieldUser,
  SlidersHorizontal,
  Sun,
  Table,
  WandSparkles,
} from 'lucide-react'

/** Keys mirror the legacy `fab fa-*` / `fas fa-*` names so the data file is unchanged. */
export type IconKey =
  // UI / decorative — lucide covers these cleanly.
  | 'compact-disc'
  | 'database-zap'
  | 'envelope'
  | 'external-link-alt'
  | 'file-alt'
  | 'flask-vial'
  | 'gauge-high'
  | 'hard-hat'
  | 'key'
  | 'key-round'
  | 'lightbulb'
  | 'map-marker-alt'
  | 'microchip'
  | 'mouse-pointer-2'
  | 'orbit'
  | 'robot'
  | 'shield-check'
  | 'shield-halved'
  | 'sliders'
  | 'table'
  | 'universal-access'
  | 'user-shield'
  | 'wand-magic-sparkles'
  // Branch / fork glyphs.
  | 'code-branch'
  | 'git-alt'
  // Theme toggle (mobile + desktop).
  | 'moon'
  | 'sun'
  // Brand logos — custom paths below.
  | 'aws'
  | 'github'
  | 'github-alt'
  | 'java'
  | 'js'
  | 'linkedin'
  | 'markdown'
  | 'node-js'
  | 'python'

type Lucide = ComponentType<LucideProps>

/** Lucide covers these directly; `Container` stands in for the Docker whale. */
const LUCIDE: Partial<Record<IconKey, Lucide>> = {
  'compact-disc': Disc3,
  'database-zap': DatabaseZap,
  'envelope': Mail,
  'external-link-alt': ExternalLink,
  'file-alt': FileText,
  'flask-vial': FlaskConical,
  'gauge-high': Gauge,
  'hard-hat': HardHat,
  'key': Key,
  'key-round': KeyRound,
  'lightbulb': Lightbulb,
  'map-marker-alt': MapPin,
  'microchip': Cpu,
  'mouse-pointer-2': MousePointer2,
  'orbit': Orbit,
  'robot': Bot,
  'shield-check': ShieldCheck,
  'shield-halved': Shield,
  'sliders': SlidersHorizontal,
  'table': Table,
  'universal-access': Accessibility,
  'user-shield': ShieldUser,
  'wand-magic-sparkles': WandSparkles,
  'code-branch': GitBranch,
  'git-alt': GitMerge,
  'moon': Moon,
  'sun': Sun,
}

/** Custom paths for brand logos (lucide omits brand glyphs). 24x24 viewBox. */
const BRAND_PATHS: Partial<Record<IconKey, string>> = {
  js:
    // Rounded square with stylized "JS".
    'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm5 13.5c.4.9 1.2 1.5 2.5 1.5 1.4 0 2.4-.7 2.4-2V9h-1.6v6.8c0 .7-.4 1-.9 1s-.8-.4-1-.9l-1.4.6zm5.7-.2c.4 1 1.4 1.7 2.9 1.7 1.6 0 2.7-.8 2.7-2.2 0-1.3-.8-1.9-2.2-2.5l-.4-.2c-.7-.3-1-.5-1-1 0-.4.3-.7.8-.7.4 0 .8.2 1 .7l1.3-.8c-.5-.9-1.3-1.3-2.3-1.3-1.5 0-2.4.9-2.4 2.1 0 1.3.8 1.9 2 2.4l.4.2c.7.3 1.2.5 1.2 1 0 .5-.4.8-1.1.8-.8 0-1.3-.4-1.6-1l-1.3.8z',
  'node-js':
    // Hexagonal "N" — node-ish.
    'M12 1.5l9.5 5.5v10L12 22.5l-9.5-5.5V7L12 1.5zm-1 6.5v8h1.6v-5l3.4 5h1.5v-8h-1.5v5L12.5 8H11z',
  python:
    // Two interlocking rounded blocks (snake hint).
    'M11 2c-3 0-5 1-5 3v3h5v1H5c-2 0-3 1.5-3 3.5v2.5c0 2 1 3.5 3 3.5h2v-2.5c0-1.7 1.4-3 3-3h5c1.7 0 3-1.3 3-3V5c0-2-2-3-5-3h-2zm-1 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zM13 22c3 0 5-1 5-3v-3h-5v-1h6c2 0 3-1.5 3-3.5V9c0-2-1-3.5-3-3.5h-2V8c0 1.7-1.4 3-3 3H9c-1.7 0-3 1.3-3 3v5c0 2 2 3 5 3h2zm1-1.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z',
  java:
    // Coffee cup with steam.
    'M4 4h12v2H4zM5 8h11l-.6 8.4c0 1-.9 1.6-1.9 1.6H7.5c-1 0-1.9-.6-1.9-1.6L5 8zm12 1h1.5c1.4 0 2.5 1.1 2.5 2.5S19.9 14 18.5 14H17V9zm0 1.5v2h1.5c.6 0 1-.4 1-1s-.4-1-1-1H17z',
  markdown:
    // Stylized "M↓".
    'M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm2 4v8h2v-4.5l2 3 2-3V17h2V9h-2l-2 3-2-3H5zm12 0v6.5l-2-2L14 14.5 17 18h2V9h-2z',
  aws:
    // Rounded square with "aws" hint.
    'M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2.5 11c.5 1 1.4 1.5 2.7 1.5 1.4 0 2.4-.7 2.4-1.8 0-1-.7-1.5-1.9-2l-.4-.2c-.5-.2-.7-.3-.7-.6 0-.3.2-.5.6-.5.4 0 .7.2.9.6l1.1-.7c-.4-.8-1.1-1.1-2-1.1-1.2 0-2.1.7-2.1 1.7 0 1 .6 1.5 1.7 1.9l.4.2c.6.2.9.4.9.7 0 .3-.3.6-.9.6-.6 0-1.1-.3-1.4-.8l-1.3.5zm6 0c.4.9 1.1 1.5 2.3 1.5 1.3 0 2.2-.7 2.2-1.9V10h-1.4v4.5c0 .5-.3.8-.8.8s-.7-.3-.9-.7l-1.4.4zm6.5-2.5l-.7 2.5h1.3l-.4-1.4-.2-1.1zm-1.5 4l.4-1h2l.4 1h1.4l-2-5h-1.6l-2 5h1.4z',
  github:
    // Octocat-like silhouette — abstract.
    'M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3.9 0 1.7.1 2.5.3 2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.1 20.5 22 16.7 22 12.2 22 6.6 17.5 2 12 2z',
  'github-alt':
    // Same octocat glyph as `github` — keep parity with FA's two aliases.
    '', // populated below by reference
  linkedin:
    // Rounded square with "in".
    'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 9.5h3v9.5H7V9.5zm1.5-4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM12 9.5h2.9v1.4h.1c.4-.7 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-3v-4.4c0-1.1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V19h-3V9.5z',
}
BRAND_PATHS['github-alt'] = BRAND_PATHS.github!

/* eslint-disable react-refresh/only-export-components */
export function isRegisteredIcon(key: string): key is IconKey {
  return key in LUCIDE || key in BRAND_PATHS
}

export function Icon({ name, ...props }: { name: IconKey } & SVGProps<SVGSVGElement>) {
  const LucideIcon = LUCIDE[name] as Lucide | undefined
  if (LucideIcon) {
    // `1em` so the icon scales with the parent's font-size (matches `text-[…]`
    // utilities the caller passes). Lucide defaults to a fixed 24px which is
    // too small next to `text-[2.5rem]` headings.
    return (
      <LucideIcon
        aria-hidden
        width="1em"
        height="1em"
        {...(props as LucideProps)}
      />
    )
  }
  const path = BRAND_PATHS[name]
  if (path) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
        width="1em"
        height="1em"
        {...props}
      >
        <path d={path} />
      </svg>
    )
  }
  return null
}