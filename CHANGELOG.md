# Changelog

All notable changes to Ontario Tenant Tools are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added

- Content audit assertions for Resources view in `tests/views.test.ts` — verifies all 7 resource section headings and 8 external URLs are present in rendered output
- `BACKLOG.md` for tracking pipeline and feature work
- `CHANGELOG.md` documenting v0.1.0 and ongoing changes

### Known Issues

- Service worker serves stale content to returning users after deploys until manual reload (tracked as SW-001 in BACKLOG.md)

---

## [0.1.0] - 2026-02-04

Initial release of Ontario Tenant Tools.

### Added

**Tools & Calculators**

- N4 unpaid rent deadline calculator (7 business day cure period, Bill 60)
- N12 landlord-use compensation calculator ($0 for 120+ day notice, Bill 60)
- Rent increase guideline checker (2.5% for 2025)
- Eviction order review deadline calculator (15 days, Bill 60)
- Section 82 deposit calculator
- Report generator (copy/print summary of all calculations)

**Resources & Information**

- Bill 60 summary with link to Residential Tenancies Act
- Standard Lease download (forms.mgcs.gov.on.ca)
- Vital Services LTB brochure link
- Tenant Rights section (ontario.ca + LTB Guideline 6)
- Resolving Disagreements section (ontario.ca)
- Legal Aid Ontario clinic finder
- Steps to Justice housing law guide (CLEO)
- Emergency contacts: RHEU, LTB, 211 Ontario, 988 Crisis Helpline

**Infrastructure**

- Vanilla TypeScript + Vite 5 build (no framework dependency)
- Progressive Web App with Workbox service worker (offline-first)
- WCAG 2.1 AA accessibility compliance
- Zero data collection, all calculations client-side
- Quick Exit safety button (clears session, navigates away)
- Dark mode / light mode / high contrast theme support
- Netlify deployment with GitHub Actions CI/CD
- pa11y-ci accessibility audit on all 10 SPA views
- 324 unit tests, 95%+ coverage on business logic
- Bundle size gates: JS <= 50KB, CSS <= 15KB (gzipped)
- Security headers via `_headers` and `netlify.toml`
- PRIVACY.md documenting zero-collection policy

**CI/CD Pipeline**

- `ci.yml`: Typecheck, lint, test with coverage gate, build, bundle size gate
- `accessibility.yml`: axe-core WCAG 2.1 AA audit (blocking on PRs)
- `deploy.yml`: Production deploy to Netlify on push to main
- `preview.yml`: Netlify preview deploys on PRs

### Fixed

- Chrome/ChromeDriver version mismatch in CI (apt-get in-place update)
- axe-core contrast false positives from pseudo-element gradients and backdrop-filter
- Panel visibility using `hidden` attribute instead of opacity/pointer-events
- `--text-secondary` contrast ratio increased (#94a3b8 -> #cbd5e1)
- Explicit hex colors for elements where CSS variables blocked contrast computation
