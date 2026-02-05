# Contributing to Ontario Tenant Tools

Thank you for your interest in helping Ontario tenants access justice.

## Before You Start

**Read the [Project Constitution](../PROJECT_CONSTITUTION.md).** It contains non-negotiable constraints around accessibility, privacy, safety, and legal boundaries.

## Ways to Contribute

### Non-Code Contributions

You don't need to code to help:

- **Report errors:** Found outdated information? Incorrect deadline? [Open an issue](../../issues).
- **Improve language:** Help simplify text to Grade 5 reading level.
- **Test accessibility:** Try the tools with a screen reader or keyboard only.
- **Spread the word:** Share with legal clinics, tenant organizations, community groups.

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run accessibility checks (`npm run a11y`)
6. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/ontario-tenant-tools.git
cd ontario-tenant-tools

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check accessibility
npm run a11y
```

## Code Standards

### TypeScript

- Strict mode enabled
- No `any` types without justification
- JSDoc comments for public functions

### Accessibility (REQUIRED)

Every UI component must:

- Use semantic HTML (`<button>`, not `<div onClick>`)
- Include `aria-label` for icons and non-text elements
- Be keyboard navigable
- Meet WCAG 2.1 AA contrast ratios (4.5:1 minimum, 7:1 preferred)
- Work without JavaScript where possible

**Automated checks run in CI.** PRs with accessibility failures will not be merged.

### Plain Language

All user-facing text must:

- Target Grade 5 reading level (Flesch-Kincaid)
- Use active voice
- Avoid legal jargon (or define it clearly)
- Keep sentences under 20 words

**Tools to check:**
- [Hemingway Editor](https://hemingwayapp.com/)
- [Readable](https://readable.com/)

### Testing

- Write tests for new logic
- Test edge cases (holidays, leap years, end-of-month)
- Include accessibility tests using axe-core

## Tier 1 vs Tier 2

### Tier 1 (Legal Information)

Calculators, timelines, glossary. **You can contribute freely.**

Requirements:
- No legal vetting needed
- Stateless (no user data stored)
- Never gives advice ("you should...")

### Tier 2 (Document Generation)

Court form assistants, defense wizards. **Currently blocked.**

We need a legal vetting partner before accepting Tier 2 contributions. If you're a lawyer or paralegal interested in reviewing logic maps, please [open an issue](../../issues).

## Regulatory Gaps

Bill 60 has provisions still awaiting regulatory clarification.

If your contribution touches uncertain provisions:

1. Check `legal/REGULATORY_GAPS.md`
2. Add warning text in the UI
3. Do not encode uncertain logic as definitive
4. Update the gaps tracker if needed

## Pull Request Checklist

Before submitting:

- [ ] Read PROJECT_CONSTITUTION.md
- [ ] Tests pass (`npm test`)
- [ ] Accessibility checks pass (`npm run a11y`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] User-facing text is plain language
- [ ] REGULATORY_GAPS.md updated if touching uncertain provisions
- [ ] No Tier 2 content without documented legal review

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add Family Day 2026 to judicial calendar
fix: correct N4 deadline calculation for Friday service
docs: clarify Section 82 defense warning
```

Prefixes: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`

## Questions?

- **General questions:** [Open a discussion](../../discussions)
- **Bugs or errors:** [Open an issue](../../issues)
- **Security concerns:** [Email](mailto:admin@cognitivearchitecture.ca) (do not open public issues)

## Code of Conduct

Be respectful. Remember that this project serves vulnerable people in crisis. Harassment, discrimination, or bad-faith contributions will result in bans.

---

Thank you for helping Ontario tenants.
