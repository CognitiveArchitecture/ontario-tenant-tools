# Ontario Tenant Tools

**A Progressive Web App providing general public legal information for Ontario residential tenants.**

🔗 **Live:** [ont-tenant-tools.civcitdev.ca](https://ont-tenant-tools.civcitdev.ca)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## What This Is

This app is an educational, self-serve reference intended to help Ontario tenants:

- Understand common tenancy concepts and workflows
- Locate relevant official resources
- Calculate deadlines and check guideline rates
- Identify questions to ask and documents to gather

---

## What This Is NOT

- **Not legal advice.**
- **Not a substitute** for advice from a licensed Ontario lawyer or paralegal.
- **Not a complete summary** of the law or Landlord and Tenant Board (LTB) procedures.
- **Not a decision engine**: outcomes depend on facts, evidence, credibility, and procedural posture.

**If you have urgent deadlines** (e.g., an LTB hearing date, an eviction notice, safety concerns, or risk of homelessness), **seek qualified help immediately:**

- [Community Legal Clinics](https://www.legalaid.on.ca/legal-clinics/)
- [Landlord and Tenant Board](https://tribunalsontario.ca/ltb/)
- A licensed paralegal or lawyer

---

## Jurisdiction & Scope

| Aspect            | Details                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jurisdiction**  | Ontario, Canada                                                                                                                                      |
| **Primary scope** | Residential Tenancies Act (RTA) topics and common tenant scenarios                                                                                   |
| **Out of scope**  | Commercial tenancies, legal strategy tailored to your facts, representation, filing on your behalf, interpreting evidence, non-Ontario jurisdictions |

---

## Tools Included

### Tier 1: Information Tools (Available Now)

| Tool                              | Description                                                      |
| --------------------------------- | ---------------------------------------------------------------- |
| **N4 Deadline Calculator**        | Calculate 7 business day cure period for unpaid rent notices     |
| **N12 Calculator**                | Check compensation entitlement based on notice period            |
| **Review Deadline Calculator**    | Calculate 15-day window to request eviction order review         |
| **Rent Increase Calculator**      | Verify if increase is within Ontario's guideline (2.5% for 2025) |
| **Section 82 Deposit Calculator** | Estimate deposit to raise maintenance defenses at hearings       |
| **Resources**                     | Links to official LTB, Ontario.ca, and legal clinic resources    |

### Tier 2: Document Assistants (Coming Later)

Document generation tools require legal review before release. Infrastructure is built; content awaits vetting partnership.

---

## Bill 60 Changes (November 2025)

The _Fighting Delays, Building Faster Act, 2025_ significantly changed tenant rights:

| Change           | Old Rule     | New Rule                     |
| ---------------- | ------------ | ---------------------------- |
| N4 cure period   | 14 days      | **7 business days**          |
| N12 compensation | 1 month rent | **$0** (if 120+ days notice) |
| Review deadline  | 30 days      | **15 days**                  |

These tools reflect Bill 60 amendments. Some regulatory details remain pending—see `docs/REGULATORY_GAPS.md`.

---

## Source Policy

This app privileges **authoritative primary sources**:

- Ontario government resources (ontario.ca)
- Tribunals Ontario / Landlord and Tenant Board materials
- Official forms and procedural guides
- Residential Tenancies Act, 2006, S.O. 2006, c. 17

Where explanatory summaries are provided, sources are cited and limitations noted.

---

## Freshness & Accuracy

Tenancy law and tribunal processes can change. App content may become outdated.

- Content includes source links to primary references
- Bill 60 amendments current as of November 2025
- Regulatory gaps documented in `docs/REGULATORY_GAPS.md`
- Changes tracked in `CHANGELOG.md`

---

## Disclaimer & Terms

A full disclaimer is available in the app at **Settings → Terms & Disclaimer**.

Key points:

- This is general information, not legal advice
- No lawyer-client or paralegal-client relationship is created
- Outcomes depend on your specific facts and evidence
- Always verify information with official sources

---

## Privacy

**Zero data collection.** This app operates with a minimal-data posture:

- All calculations happen in your browser
- No data is sent to any server
- No analytics or tracking
- No cookies beyond PWA functionality
- Session data cleared on Quick Exit

The **Quick Exit button** on every page immediately leaves the site and clears session data—designed for users in unsafe situations.

See `docs/PRIVACY.md` for full privacy policy.

---

## Accessibility

This project targets **WCAG 2.1 AA** compliance (AODA requirement):

- Semantic HTML throughout
- Keyboard navigable
- Screen reader compatible
- High contrast mode (7:1 ratio)
- Works on 3G connections
- Mobile-first, touch-friendly (44px+ targets)
- Grade 5 reading level for user-facing text

Report accessibility issues: [GitHub Issues](https://github.com/CognitiveArchitecture/ontario-tenant-tools/issues)

---

## Development

### Tech Stack

| Component | Technology                        |
| --------- | --------------------------------- |
| Framework | Vanilla TypeScript (no framework) |
| Build     | Vite 5.x                          |
| Testing   | Vitest                            |
| Hosting   | Netlify (static)                  |
| Offline   | Service Worker (Workbox)          |
| Analytics | None                              |

### Running Locally

```bash
# Clone repository
git clone https://github.com/CognitiveArchitecture/ontario-tenant-tools.git
cd ontario-tenant-tools

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

### Build for Production

```bash
npm run build
# Output in dist/ - deploy to any static host
```

---

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

Key requirements:

- Read [PROJECT_CONSTITUTION.md](PROJECT_CONSTITUTION.md)
- Accessibility checks must pass
- Plain language (Grade 5 reading level)
- No legal advice—information only
- Test coverage required for business logic

---

## License

Apache 2.0 — See [LICENSE](LICENSE)

---

## Acknowledgments

- [Advocacy Centre for Tenants Ontario (ACTO)](https://www.acto.ca/)
- [Community Legal Education Ontario (CLEO)](https://www.cleo.on.ca/)
- [Steps to Justice](https://stepstojustice.ca/)
- Ontario community legal clinics

---

© [Cognitive Architecture](https://cognitivearchitecture.ca) 2026
