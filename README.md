# Ontario Tenant Tools

**Free, accessible tools for Ontario tenants facing eviction or housing disputes.**

🔗 **Live:** [ont-tenant-tools.civcitdev.ca](https://ont-tenant-tools.civcitdev.ca)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ⚠️ Important Disclaimer

**This is NOT legal advice.**

These tools provide general information about Ontario tenant rights under the Residential Tenancies Act, 2006. For advice about your specific situation, contact:

- [Community Legal Clinics](https://www.legalaid.on.ca/legal-clinics/)
- [Landlord and Tenant Board](https://tribunalsontario.ca/ltb/)
- A licensed paralegal or lawyer

---

## What's Included

### Tier 1: Information Tools (Available Now)

| Tool                              | Description                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------ |
| **Arrears Calculator**            | Calculate rent owed using FIFO accounting, track payments, segregate late fees |
| **Rent Increase Calculator**      | Check if a rent increase is legal under Ontario's 2.5% guideline               |
| **Section 82 Deposit Calculator** | Estimate deposit needed to raise maintenance defenses at eviction hearings     |
| **Deadline Calculators**          | N4 (7 business days), N12 (60/120 days), Review (15 days)                      |
| **Legal Glossary**                | Plain-language explanations of 30+ Ontario housing law terms                   |

### Tier 2: Document Assistants (Coming Later)

Document generation tools require legal review before release. Infrastructure is being built; content awaits vetting partnership.

---

## Bill 60 Changes (November 2025)

The _Fighting Delays, Building Faster Act, 2025_ significantly changed tenant rights:

| Change           | Old Rule     | New Rule                    |
| ---------------- | ------------ | --------------------------- |
| N4 cure period   | 14 days      | **7 days**                  |
| N12 compensation | 1 month rent | **$0** (if 120 days notice) |
| Review deadline  | 30 days      | **15 days**                 |

These tools are updated to reflect Bill 60 amendments. Some regulatory details remain pending—check `legal/REGULATORY_GAPS.md`.

---

## Quick Start

### Use Online

Visit: [URL TBD]

### Run Locally

```bash
# Clone repository
git clone https://github.com/[org]/ontario-tenant-tools.git
cd ontario-tenant-tools

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Build for Production

```bash
npm run build
# Output in dist/ - deploy to any static host
```

---

## Accessibility

This project targets **WCAG 2.1 AA** compliance (AODA requirement).

- Semantic HTML throughout
- Keyboard navigable
- Screen reader compatible
- High contrast (7:1 ratio)
- Works on 3G connections
- Mobile-first design

Report accessibility issues: [GitHub Issues]

---

## Privacy & Safety

**Zero data collection.** All calculations happen in your browser. Nothing is sent to any server.

**Quick Exit button** on every page for users in unsafe situations.

---

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

Key requirements:

- Read [PROJECT_CONSTITUTION.md](PROJECT_CONSTITUTION.md)
- Accessibility checks must pass
- Plain language (Grade 5 reading level)
- No legal advice—information only

---

## Legal Framework

Based on:

- Residential Tenancies Act, 2006, S.O. 2006, c. 17
- Bill 60, Fighting Delays, Building Faster Act, 2025 (Schedule 12)
- Landlord and Tenant Board Rules of Practice

---

## License

Apache 2.0 — See [LICENSE](LICENSE)

---

## Acknowledgments

- [Advocacy Centre for Tenants Ontario (ACTO)](https://www.acto.ca/)
- [Community Legal Education Ontario (CLEO)](https://www.cleo.on.ca/)
- Ontario community legal clinics

---

_Built with care for Ontario tenants._
