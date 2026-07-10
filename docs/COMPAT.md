# Browser & platform support

> What we test, what we skip, and why. Update this when you add a new
> feature-detection media query or work around a browser quirk.

## Scope

Static single-page portfolio, English / LTR, GitHub Pages. No backend, no
auth, no PWA install, no native shell wrapping. Decisions below reflect
that scope.

## Supported matrix

Configured in `package.json` `browserslist`:

| Browser | Minimum |
|---|---|
| Chrome  | last 2 versions |
| Firefox | last 2 versions |
| Safari  | 16+ |
| Edge    | last 2 versions |

Manual test cadence: before each release to `main`. CI runs `axe-core` on
the latest stable Chrome via `scripts/axe-preview.mjs`.

### What we don't do

- **No Playwright cross-browser matrix.** Cost vs. value is wrong for a
  static portfolio. `last 2 versions` + axe catches the realistic risk
  surface.
- **No BrowserStack / real-device farm.** Out of budget; manual spot
  checks on a personal iPhone + Android cover iOS Safari and Android
  Chrome.
- **No PWA features** (manifest, service worker, standalone mode).
- **No native wrappers** (Electron / Tauri), so window-chrome / traffic-
  light overlap and snap layouts are not applicable.
- **No web analytics**, so no third-party tracker cross-browser audits.

## Feature-detection rules in use

These are the platform-aware patterns active in this codebase. When you
add a new one, link it here.

| Pattern | File | Why |
|---|---|---|
| `@media (prefers-color-scheme: dark)` | `src/index.css:96,131` | Light/dark system theme mirror of explicit toggle. |
| `@media (prefers-reduced-motion: reduce)` | `src/index.css:249,650` | Disables transitions, animations, view transitions, scroll-driven animations. |
| `@media (prefers-contrast: more)` | `src/index.css:513` | WCAG 2.2 — bump contrast for low-vision users. |
| `@media (prefers-reduced-transparency: reduce)` | `src/index.css:530` | Solid surfaces. **Safari: no support** (mid-2026). |
| `@media (forced-colors: active)` | `src/index.css:497,546` | Windows High Contrast Mode. Replaces shadow-based emphasis with explicit borders + system color keywords (`CanvasText`, `ButtonText`, `Highlight`). |
| `@custom-variant pointer-fine ((hover: hover) and (pointer: fine))` | `src/index.css:181` | Toggle class only when a precise pointing device (mouse / trackpad) is available. Used for hover lifts, tooltips, and `cursor: pointer` cues. |
| `@media (hover: none), (pointer: coarse)` | `src/index.css:389` | Touch-only feedback: `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`, `:has(:active)` pressed state. |
| `@supports (animation-timeline: view())` | `src/index.css:657` | Scroll-driven section reveal. Safari 26 / Firefox 155+ only; older engines get a static render. |
| `@supports ([transition-behavior: allow-discrete]): opacity-0` | `src/index.css:261` (via popover `@starting-style`) | Enter animation for the `popover` mobile menu. Baseline 2024+. |
| `env(safe-area-inset-*)` | `src/components/Navbar.tsx:216`, `src/utils/layoutClasses.ts:8` | iPhone notch + Dynamic Island clearance on the fixed header and container inline padding. |
| `viewport-fit=cover` + `interactive-widget=resizes-content` | `src/index.html:5` | iOS safe-area enablement + Android/iOS keyboard viewport handling. |
| `scrollbar-gutter: stable` | `src/index.css` (new) | Prevents horizontal layout shift between pages with different scroll heights (Windows "always show scrollbars", overlay-scrollbar engines). |

## Known browser quirks

Documented inline near each fix. Keep this list short — only quirks that
affect a real user flow.

### `:has(:active)` for touch press feedback — Safari 15.4+

- `src/index.css:391` — `cursor: pointer` + `touch-action: manipulation` on
  the host are **required** for iOS Safari to fire `:active` on
  non-anchor elements.
- Without `-webkit-tap-highlight-color: transparent`, the default grey
  flash preempts the border-color transition.

### `prefers-reduced-transparency` — Safari unsupported (mid-2026)

- `src/index.css:530` — Safari ignores the media query; users on macOS
  Safari get the styled transparency regardless of system setting.
  Acceptable; the surfaces in question are decorative overlays.

### `animation-timeline: view()` — Safari 26 / Firefox 155+

- `src/index.css:657` — gated behind `@supports`. Older browsers skip
  the scroll-driven reveal entirely. Section content still renders.
- `content-visibility: auto` interferes with `view()` timelines, so the
  reveal targets only sections without that perf optimization
  (About / Contact / footer).

### View Transitions API — Chrome 111+ / Edge 111+

- `src/hooks/useSectionNavigation.ts:180` — Safari / Firefox fall back to
  instant section scroll. No `startViewTransition` call = no error.

### `100vh` / `100dvh` — none used

- No `100vh` in `src/**`. `Contact.tsx:165,172` uses `clamp(14rem, 30vh,
  22rem)` for the map; `vh` is appropriate here because it's an
  embedded element, not a viewport-filling surface. If we ever add a
  fullscreen hero, use `100dvh` with a `100vh` fallback:
  ```css
  height: 100vh;
  height: 100dvh;
  ```

### Logical properties — partial

- `src/index.css:290` uses `inset-block-end` / `inset-inline-start`;
  `src/utils/layoutClasses.ts:8` uses `ps-` / `pe-`. **Two physical
  classes remain intentionally:**
  - `App.tsx:25` skip-link uses `focus:start-2` (logical).
  - `Projects.tsx:47` project zoom overlay uses `left-1/2 top-1/2
    -translate-x-1/2 -translate-y-1/2` (physical). Centered overlays
    with negative translate require a single-axis anchor; flipping to
    `start-1/2` would shift the overlay off-center in RTL. Since the
    site is LTR-only and the parent uses grid, the simplest correct
    RTL-safe upgrade would be `inset-0 m-auto` on a grid item, but
    that's out of scope until RTL is on the roadmap.

### iOS Safari input zoom

- All `<input>` / `<textarea>` use the default `font-size: 1rem`
  (16px). Below 16px Safari would zoom the viewport on focus.

## What we'd add if the scope changed

- **PWA / install prompt** → would need a manifest, service worker, and
  offline fallback for the hero image + resume PDF.
- **i18n / RTL** → finish the logical-property migration in
  `Projects.tsx:47` and audit container queries (container-relative
  inline padding is already RTL-aware via `ps-/pe-`).
- **Electron / Tauri shell** → window-chrome overlap handling, custom
  title bar traffic-light offsets, snap-layout breakpoints.
- **Real-time features** → would need a polyfill / fallback story for
  Safari's stricter `BroadcastChannel` and `SharedWorker` policies.

## Manual test checklist (pre-release)

- [ ] Chrome stable on macOS — visual + DevTools console clean.
- [ ] Safari on iPhone (one physical device, latest iOS) — safe areas,
      tap feedback, input zoom.
- [ ] Android Chrome on physical device — viewport resize on keyboard,
      dark mode.
- [ ] axe scan (`npm run test:a11y`) — 0 critical / serious violations.