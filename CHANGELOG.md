# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added (Audit Sprint - 2026-02-04)

- **Comprehensive Test Suite Expansion**
  - `tests/glossary.test.ts` — 33 tests for glossary search and retrieval
  - `tests/session.test.ts` — 23 tests for session state manager
  - `tests/views.test.ts` — 38 smoke tests for all 10 view modules
  - Total: **168 tests** (up from 74)

- **CI/CD Infrastructure**
  - `.github/workflows/ci.yml` — GitHub Actions pipeline (typecheck, lint, test, build)
  - Pre-commit hooks via Husky + lint-staged
  - Coverage reporting configuration

- **Code Quality Configuration**
  - `.eslintrc.json` — Strict TypeScript linting rules
  - `.prettierrc` — Consistent code formatting

### Fixed

- TypeScript strict mode errors in `packages/calculator/arrears.ts`
- TypeScript strict mode errors in `packages/core/dates.ts`
- TypeScript strict mode errors in `src/views/report.ts`
- Removed unused imports (`Cents`, `addDays`, `businessDaysBetween`)
- Removed unused path alias `@timeline/*` from `tsconfig.json`

### Security

- Security audit completed: No critical vulnerabilities
- innerHTML usage reviewed: All user inputs constrained to date/number types
- Session state verified as memory-only (no persistence)
- Quick Exit verified to clear all storage mechanisms

---

### Added

- **Rent Increase Calculator** (`packages/calculator/rent-increase.ts`)
  - Validates rent increases against Ontario's annual guideline (2.5% for 2025)
  - Detects post-November 2018 exemptions (O. Reg 340/21)
  - Calculates maximum allowed increase and overage amounts
  - Warns about 90-day notice requirements
  - Includes plain-text summary generation for clinic use

- **Section 82 Deposit Calculator** (`packages/calculator/section82.ts`)
  - Estimates deposit required to raise maintenance defenses at eviction hearings
  - Prominently flags regulatory uncertainty (Bill 60 deposit requirement is DRAFT status)
  - Links to legal clinics and LTB resources
  - Warns about advance written notice requirement

- **New TypeScript types** (`packages/core/types.ts`)
  - `RentIncreaseCalculation` interface
  - `Section82Calculation` interface
  - `RegulatoryStatus` type (`'confirmed' | 'draft' | 'pending'`)

- **Unit tests**
  - 24 tests for rent increase calculator (`tests/rent-increase.test.ts`)
  - 23 tests for Section 82 calculator (`tests/section82.test.ts`)

### Context

These additions are part of a consolidation effort merging functionality from the TenantGuard prototype. The calculators follow established patterns:

- Money stored as cents (integers) to avoid floating-point errors
- Structured return types with warnings arrays
- Plain-text export functions for clinic/CMS integration
- Dollar-amount helper functions for UI convenience

### Regulatory Notes

Per `legal/REGULATORY_GAPS.md`:

- Rent increase guideline rates are confirmed through 2026
- Section 82 deposit requirement (50%) is in DRAFT status—regulations pending

---

### Added (Phase 2/3: UI Layer & PWA Infrastructure)

- **Complete UI Layer** — Ported from TenantGuard prototype
  - `src/index.html` — HTML shell with header, navigation, panels
  - `src/main.ts` — Application entry point
  - `src/styles/` — Design system (tokens, themes, components, print)
  - `src/utils/` — Navigation, theme, and accessibility utilities
  - `src/components/` — Quick Exit and panel system
  - `src/views/` — All 10 view modules (home, tools, calculators, report, resources, contacts)

- **PWA Infrastructure**
  - `vite.config.ts` — Vite build configuration with PWA plugin
  - `vitest.config.ts` — Separate test configuration
  - `public/icons/` — PWA icons (192x192, 512x512)
  - Service worker with offline caching via Workbox
  - Web manifest for installable PWA

- **View Modules** (wired to correct calculator logic)
  - `src/views/home.ts` — Triage grid for quick situation matching
  - `src/views/tools.ts` — Full toolbox with all calculators
  - `src/views/n4.ts` — N4 deadline calculator (7 business days)
  - `src/views/n12.ts` — N12 compensation checker (60/120 day threshold)
  - `src/views/rent.ts` — Rent increase validator (2.5% guideline)
  - `src/views/review.ts` — Eviction order review deadline (15 days)
  - `src/views/s82.ts` — Section 82 deposit estimator (with regulatory warnings)
  - `src/views/report.ts` — Session report generation (copy/print)
  - `src/views/resources.ts` — Educational content and official links
  - `src/views/contacts.ts` — Emergency contacts (RHEU, LTB, 211, crisis support)

- **Navigation System**
  - Tab-based navigation (Home, Tools, Report, Info, Help)
  - History stack for back button in tool views
  - Smooth view transitions with animations

- **Theme System**
  - Dark mode (default), light mode, high contrast (WCAG AAA)
  - localStorage persistence of user preferences
  - CSS custom properties for easy theming

- **Accessibility Enhancements**
  - Skip-to-content link
  - ARIA labels and live regions for results
  - Focus management in panels
  - Keyboard navigation (Escape closes panels)
  - Screen reader announcements

- **Safety Features**
  - Quick Exit button (clears storage, overwrites history, redirects to Google)
  - Privacy note on report (all data stays local)

### Technical Details

- **Architecture:** Vanilla TypeScript (no framework) for minimal bundle size
- **Build output:** ~62 KB total (~16 KB gzipped) — well under 200KB target
- **Calculator wiring:** UI correctly uses `@core/dates` business-day calculations (not TenantGuard's incorrect calendar-day math)
- **All 74 unit tests pass**

### Files Created (22 new files)

```
src/
├── index.html
├── main.ts
├── vite-env.d.ts
├── styles/
│   ├── tokens.css
│   ├── themes.css
│   ├── components.css
│   └── print.css
├── utils/
│   ├── navigation.ts
│   └── theme.ts
├── components/
│   ├── quick-exit.ts
│   └── panels.ts
└── views/
    ├── home.ts
    ├── tools.ts
    ├── n4.ts
    ├── n12.ts
    ├── rent.ts
    ├── review.ts
    ├── s82.ts
    ├── report.ts
    ├── resources.ts
    └── contacts.ts

public/icons/
├── icon-192.png
└── icon-512.png

vite.config.ts
vitest.config.ts
```

---

### Added (Phase 4: Session State for Report Generation)

- **Session State Manager** (`src/utils/session.ts`)
  - In-memory storage for calculation results across views
  - `recordCalculation()` — saves tool inputs and results
  - `getCalculations()` / `getCalculation()` — retrieves stored data
  - `hasCalculations()` — checks if any data exists
  - `clearSession()` — wipes all session data (used by Quick Exit)
  - `getReportData()` — formats session data for report display with human-readable labels

- **Calculator View Integration**
  - All 5 calculator views now save results to session state after successful calculations
  - N4: Records served date, cure deadline, days remaining, expiration status
  - N12: Records notice/termination dates, compensation required/amount
  - Rent: Records current/proposed rent, legality status, overage amount
  - Review: Records order date, deadline, days remaining, expiration status
  - S82: Records arrears amount, deposit required, regulatory status

- **Report View Improvements**
  - Now reads from session state instead of DOM queries (which didn't persist across views)
  - Results grouped by tool with descriptive headers
  - Human-readable date and currency formatting
  - Shows "No data entered yet" when session is empty

- **Quick Exit Integration**
  - Clears in-memory session state in addition to localStorage/sessionStorage
  - Ensures no calculation data survives Quick Exit

### Technical Details

- **Privacy-preserving:** Data stored in memory only, cleared on page reload
- **No persistence:** Session data is ephemeral by design (privacy for vulnerable users)
- **Cross-view sharing:** Users can run multiple calculators, then view consolidated report
- **Build output:** Unchanged (~62 KB total, ~16 KB gzipped)
- **All 74 unit tests pass**

### Files Modified

| File                           | Changes                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `src/views/n4.ts`              | Added `recordCalculation()` call                          |
| `src/views/n12.ts`             | Added `recordCalculation()` call                          |
| `src/views/rent.ts`            | Added `recordCalculation()` call, `dollarsToCents` import |
| `src/views/review.ts`          | Added `recordCalculation()` call                          |
| `src/views/s82.ts`             | Added `recordCalculation()` call, `dollarsToCents` import |
| `src/views/report.ts`          | Rewrote to use session state, added grouped display       |
| `src/components/quick-exit.ts` | Added `clearSession()` call                               |

### Files Created

| File                   | Purpose               |
| ---------------------- | --------------------- |
| `src/utils/session.ts` | Session state manager |

---

## [0.1.0] - 2025-11-30

### Added

- Initial project structure
- Core date utilities with business day calculations
- N4, N12, and Review deadline calculators (Bill 60 compliant)
- Arrears calculator with FIFO accounting
- Legal glossary with 30+ terms
- Holiday calendar (2025-2026)
- Project constitution and governance documents
- Accessibility guidelines (WCAG 2.1 AA)
- Legal disclaimer and contributing guidelines

---

[Unreleased]: https://github.com/[org]/ontario-tenant-tools/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/[org]/ontario-tenant-tools/releases/tag/v0.1.0
