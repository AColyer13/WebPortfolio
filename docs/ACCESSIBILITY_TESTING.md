# Accessibility regression checks

Run `npm ci`, then `npm run test:a11y`. This builds the production site and
runs `scripts/axe-preview.mjs` against an isolated Vite preview server.
The existing deployment job invokes the same script after building.

## Browser prerequisites

Install matching Chrome and ChromeDriver versions (the deployment workflow
already installs them). The runner reuses Selenium, axe-core, and ChromeDriver
owned by the existing `@axe-core/cli` dependency; no additional package is required.
Optional environment variables:

- `CHROME_PATH`: Chrome/Chromium executable.
- `CHROMEDRIVER_PATH`: matching ChromeDriver executable.
- `A11Y_PORT`: preview port (default 4187).
- `A11Y_REPORT_DIR`: output directory (default `a11y-results`, ignored by Git).
- `A11Y_NO_SANDBOX=1`: only for disposable containers that require it. The sandbox
  stays enabled by default.

## Automated coverage

The suite uses real browser keyboard events, not synthetic DOM clicks/focus.
It tests 1280px desktop, 390px mobile, and 320px narrow/reflow layouts, each in
OS light and dark themes with reduced motion. For every combination it checks:

- WCAG 2 A/AA, WCAG 2.1 A/AA, and axe best-practice rules, including color contrast.
- Featured projects and all projects with every description expanded.
- No horizontal document overflow and no positive `tabindex` values.
- First Tab reaches the skip link; Enter navigates to main content.
- Keyboard reachability and visible outline or shadow on exercised controls.
- Enter expands the project list; Space toggles descriptions and collapses the list.
- `aria-expanded`, `aria-controls`, description state, retained toggle focus, URL
  state, and direct loading of `?projects=all`.
- Mobile menu open-state scans, keyboard opening, Escape dismissal and trigger
  focus restoration, and keyboard section navigation that clears scroll lock.

A complete run produces 16 axe reports plus `summary.json`. Violations fail the
command after the audit matrix. Keyboard/layout assertion failures fail immediately.
Full axe JSON includes selectors, failure summaries, and incomplete results for
manual review. A zero-violation result is not an accessibility certification.

## Manual coverage still required

Review axe `incomplete` findings, particularly contrast over images/transparency.
Check focus indicator contrast/obscuration, screen-reader announcements and reading
order, touch target usability, 200% text resizing, browser zoom, forced colors,
and Safari/Firefox behavior. The viewport matrix is Chromium emulation, not a
physical-device check. Embedded live-demo dialogs are outside this matrix and
should be reviewed separately. No contact form submissions or external links are
activated by this suite.
