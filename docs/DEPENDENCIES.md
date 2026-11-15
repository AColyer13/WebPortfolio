# Dependency maintenance

Updated against the npm stable release tags on 2026-11-14. Use Node 24.15 or newer in the Node 24 line (`nvm use`) and npm 10+; CI reads `.nvmrc`.

## Compatibility choices

- Vite 8 and `@vitejs/plugin-react` 6 must move together. This update supersedes the dependency change proposed in PR #4, without importing that stale branch's unrelated changes.
- Vite's Rolldown configuration replaces the deprecated Rollup configuration. The explicit browser target retains Safari 16 support, and React remains a separate vendor chunk.
- TypeScript is updated to 6.0.3, not 7.0.2: the current stable `typescript-eslint` 8.72.2 only supports TypeScript below 6.1. Do not use `--force` or `--legacy-peer-deps` to bypass this constraint.
- `@types/node` stays on the latest Node 24 release (24.19.2) to match the development and CI runtime rather than describing Node 26-only APIs.
- The EmailJS 5 upgrade preserves the public SDK API. The contact integration tests exercise the actual SDK with mocked HTTP responses and never send email.

## Verification

- Clean `npm ci`, type-checking, ESLint, all 96 tests, and production build passed locally.
- Production HTML uses hashed assets, preloads fonts, places stylesheet links before module scripts, and retains the React vendor chunk.
- `npm audit --omit=dev`: zero vulnerabilities.
- Full audit: 13 development-only findings (6 high, 7 moderate), reduced from 27 before the upgrade. The latest axe CLI still reaches vulnerable `basic-ftp` through ChromeDriver's proxy stack; the latest TypeScript ESLint still uses affected `minimatch` 10. Avoid blanket audit-force downgrades or unverified cross-major overrides. Recheck upstream releases before the next update.
- PR #7 head `f07dd13` passed all 97 unit tests, production checks and 16 browser/axe scenarios in [GitHub Actions run 43754644643](https://github.com/AColyer13/WebPortfolio/actions/runs/43754644643). See `docs/ACCESSIBILITY_TESTING.md` for automated scope and remaining manual checks.

## Keeping checks running

Both pull-request CI and the existing main deployment pipeline run type checks,
lint, unit tests, build verification, browser accessibility checks, the production
audit and `npm run audit:review`. The latter saves the full audit as a CI artifact
and fails on new affected packages/locations, new advisory identities or severity
increases against `docs/security/audit-baseline.json`. Existing findings remain
visible, not silently treated as a clean audit. Registry errors fail the check.
The audit checker itself has Node tests included in `npm run check`.

Do not refresh the baseline merely to make CI green. Investigate any new finding,
prefer compatible upstream fixes, document any accepted development-only risk,
and review baseline changes explicitly. The production audit independently blocks
high/critical runtime vulnerabilities even if they appear in the tooling baseline.
There is no scheduled workflow or automatic merging/deployment added here; tests
run when code changes via pull requests or the existing main pipeline.
