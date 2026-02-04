# Project Constitution: Ontario Tenant Tools

> Development constraints and non-negotiable principles for all contributors.

## Purpose

This project provides **legal information tools** for Ontario tenants facing eviction or housing disputes. It is NOT legal advice. Tools help users understand timelines, calculate amounts, and access plain-language explanations of their rights under the Residential Tenancies Act, 2006 (as amended by Bill 60).

---

## Tier System

### Tier 1: Legal Information (Ship Now)
- Calculators, timelines, glossaries
- No attorney vetting required
- Stateless (no persistent user data)
- **Constraint:** Never crosses into legal advice

### Tier 2: Document Generation (Ship Later)
- Court form assistants, defense wizards
- **Requires attorney/paralegal sign-off** before release
- Logic maps must be version-controlled and traceable
- Deferred until legal vetting partner secured

---

## Non-Negotiable Constraints

### 1. Accessibility (AODA/WCAG 2.1 AA)

All UI components must:
- Use semantic HTML (`<button>`, `<nav>`, `<input>`, not `<div>` with click handlers)
- Include `aria-label` for non-text elements
- Meet 7:1 contrast ratio (WCAG AAA target)
- Support keyboard navigation
- Render on 3G connections within 3 seconds
- Touch targets minimum 44x44 pixels

**Enforcement:** Automated axe-core checks in CI. Failing builds block merge.

### 2. Privacy (Zero Persistence)

- **No server-side database** for user data
- **No analytics** without explicit opt-in consent
- All state stored client-side only
- Tier 2 state encrypted via Web Crypto API
- **No logging** of user inputs to console or external services

**Rationale:** Tenants may be in domestic violence situations. Data could be subpoenaed. Zero-knowledge architecture protects users.

### 3. Safety

All pages must include:
- **Quick Exit button** (persistent, visible)
  - Redirects to neutral site (e.g., weather.gc.ca)
  - Clears sessionStorage and localStorage
  - Overwrites browser history via `history.replaceState`
- **Crisis resources link** (discreet but accessible)

### 4. Reading Level

All user-facing text must be:
- **Grade 5 reading level maximum** (Flesch-Kincaid)
- No unexplained legal jargon
- Active voice preferred
- Short sentences (< 20 words)

**Exception:** Glossary definitions may quote statutory language, with plain-language explanation alongside.

### 5. Bandwidth Optimization

Target: **< 200KB per Tier 1 tool** (gzipped)

- No heavy visualization libraries (Plotly, Chart.js, D3)
- CSS-only timelines and progress indicators
- Lazy load non-critical resources
- PWA-capable for offline use

### 6. Legal Boundaries

**This tool provides legal INFORMATION, not legal ADVICE.**

Contributors must never:
- Tell users what to do ("You should file...")
- Predict case outcomes ("You will likely win...")
- Interpret facts ("This means your landlord is wrong...")

Contributors may:
- Explain what the law says
- Calculate deadlines based on user-provided dates
- Define legal terms
- Link to official LTB resources

---

## Regulatory Uncertainty Protocol

Bill 60 contains provisions awaiting regulatory clarification. When encountering uncertain provisions:

1. Flag in `legal/REGULATORY_GAPS.md`
2. Display warning in UI: "This rule may change. Check LTB website for updates."
3. Do not encode uncertain logic as definitive
4. Link to official source where possible

---

## Code Standards

### Language
- TypeScript (strict mode)
- ESLint + Prettier enforced

### Structure
```
packages/
├── core/           # Shared utilities (dates, types, calendar)
├── calculator/     # N4 arrears calculator
├── timeline/       # Eviction timeline visualizer
└── glossary/       # Legal terms dictionary
```

### Testing
- Unit tests: Vitest
- Accessibility: axe-core (automated in CI)
- Visual regression: optional but encouraged

### Documentation
- JSDoc comments for all public functions
- README in each package
- Changelog maintained

---

## Legal Disclaimer (Required on All Pages)

```
This tool provides general legal information about Ontario tenant rights.
It is NOT legal advice and does NOT create a lawyer-client relationship.

For legal advice about your specific situation, contact:
- A community legal clinic (https://www.legalaid.on.ca/legal-clinics/)
- A licensed paralegal or lawyer
- The Landlord and Tenant Board (https://tribunalsontario.ca/ltb/)

Information current as of: [DATE]
Based on: Residential Tenancies Act, 2006, as amended by Bill 60 (2025)
```

---

## Contribution Requirements

1. **Read this document** before submitting PRs
2. **Accessibility check** must pass
3. **No Tier 2 content** without documented legal review
4. **Update REGULATORY_GAPS.md** if touching uncertain provisions
5. **Plain language review** for user-facing text

---

## Governance

- **Maintainer:** [To be established]
- **Legal Review:** Deferred (Tier 2 blocked until partner secured)
- **License:** Apache 2.0

---

## Amendments

This constitution may be amended by maintainer consensus. Changes affecting legal boundaries require legal review before implementation.

---

*Last updated: 2025-11-30*
