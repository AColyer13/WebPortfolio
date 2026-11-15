# Development-tool dependency security triage

Reviewed 2026-11-15 against main `f7d843f` with Node 24.22.1 and npm 11.9.0.

## Result

The full audit reports **13 affected package entries: 6 high and 7 moderate**, arising from four advisories in two transitive packages. These are not 13 independent vulnerabilities. The production-only audit (`npm audit --omit=dev --json`) reports zero findings. Development and CI tooling still execute these dependencies.

A non-forcing `npm audit fix --package-lock-only --ignore-scripts --dry-run --json` proposes zero additions, changes, or removals and leaves all 13 entries. No dependency overrides, forced downgrades, or lockfile changes were applied.

## High-severity entries: accessibility tooling

Dependency path: `@axe-core/cli 4.14.0 → chromedriver 152.0.3 → proxy-agent 8.0.2 → pac-proxy-agent 9.1.0 → get-uri 8.0.1 → basic-ftp 5.3.1`.

Three advisories affect the installed basic-ftp version:

- [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r): directory-listing parser CPU denial of service, affecting versions through 6.2.0.
- [GHSA-5pm8-86m8-9m6r](https://github.com/advisories/GHSA-5pm8-86m8-9m6r): malformed MLSD listing can throw, affecting versions through 6.2.3.
- [GHSA-r4jh-29pc-gfqr](https://github.com/advisories/GHSA-r4jh-29pc-gfqr): CR/LF input can cause an uncaught exception, affecting versions through 6.2.2.

The combined patched floor is basic-ftp 6.2.4. The installed get-uri requires `basic-ftp ^5.3.1`; forcing 6.x crosses its declared major-version compatibility boundary. The audit suggests an out-of-range axe CLI downgrade rather than a verified compatible update. Do not apply audit-force as a compatibility guarantee.

The static production bundle does not ship this tooling tree. The accessibility runner scans localhost, but FTP resources and proxy/PAC configuration used by tooling are potential attack inputs. Restrict those inputs to trusted configuration and run untrusted repository work without deployment credentials. “Development dependency” does not mean “unexploitable.”

## Moderate-severity entries: TypeScript ESLint

Seven propagated findings affect typescript-eslint and its parser, plugin, utilities, typescript-estree, and nested minimatch. [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) concerns glob-pattern amplification denial of service in minimatch >=7.0.0 and <11.0.1.

The installed typescript-estree 8.72.2 requires `minimatch ^10.2.2` and resolves to 10.2.6. A patched top-level minimatch 11.x does not fix this nested copy, and forcing 11.x violates the declared range. This repository does not configure project-service `allowDefaultProject` patterns, reducing direct exposure to that tooling path without eliminating the advisory.

## Evidence and next steps

- `audit-baseline.json`: fresh full audit with 13 affected entries.
- `audit-fix-dry-run.json`: non-forcing dry run, zero package changes, 13 entries remaining.
- Fresh production-only audit: zero findings.
- Clean install used `npm ci --ignore-scripts`; browser installation is handled separately by CI.
- TypeScript, ESLint, all 97 unit tests, and production build passed after integration.

Retain supported dependency ranges. Recheck upstream get-uri/axe/chromedriver and typescript-eslint releases for compatible patched ranges, then rerun full and production audits, checks, build, and accessibility tests. If zero tooling advisories is mandatory immediately, evaluate a supported runner/lint migration as separate work. Do not suppress these findings or describe a production-only audit as a clean full audit. Browser test results are tracked by the pull request checks, not established by this dependency review.
