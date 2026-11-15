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
- Browser/axe checks could not complete in the editing environment because system network-interface enumeration and Chromium process sockets are unavailable. Run `npm run test:a11y` in a normal local environment or CI before merging. Actual GitHub Actions execution and deployment are not verified by local checks.
