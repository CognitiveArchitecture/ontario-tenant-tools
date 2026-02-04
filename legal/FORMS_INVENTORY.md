# LTB Forms Inventory

> Official Landlord and Tenant Board forms for Ontario.

**Source:** https://tribunalsontario.ca/ltb/forms/  
**Last verified:** 2025-11-30

---

## Form Availability: ✅ CONFIRMED

All forms are publicly available as fillable PDFs from Tribunals Ontario.

**Base URL pattern:**
```
https://tribunalsontario.ca/documents/ltb/Notices of Termination & Instructions/[FORM].pdf
https://tribunalsontario.ca/documents/ltb/Landlord Applications & Instructions/[FORM].pdf
https://tribunalsontario.ca/documents/ltb/Tenant Applications & Instructions/[FORM].pdf
```

---

## Landlord Notices (N-Forms)

| Form | Name | URL | Tier 1 | Tier 2 |
|------|------|-----|--------|--------|
| N4 | Notice to End Tenancy (Non-Payment) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N4.pdf) | Timeline | — |
| N5 | Notice to End Tenancy (Interference/Damage) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N5.pdf) | Glossary | — |
| N6 | Notice to End Tenancy (Illegal Act) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N6.pdf) | Glossary | — |
| N7 | Notice to End Tenancy (Safety) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N7.pdf) | Glossary | — |
| N8 | Notice to End Tenancy (Persistent Late Payment) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N8.pdf) | Glossary | — |
| N12 | Notice to End Tenancy (Own Use) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N12.pdf) | Timeline | — |
| N13 | Notice to End Tenancy (Renovation) | [PDF](https://tribunalsontario.ca/documents/ltb/Notices%20of%20Termination%20&%20Instructions/N13.pdf) | Timeline | — |

---

## Landlord Applications (L-Forms)

| Form | Name | URL | Notes |
|------|------|-----|-------|
| L1 | Application to Evict (Non-Payment) | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L1.pdf) | Filed after N4 expires |
| L2 | Application to Evict (Other Reasons) | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L2.pdf) | Various notices |
| L3 | Application to Evict (Tenant Gave Notice) | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L3.pdf) | — |
| L4 | Application to Evict (Failed Conditions) | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L4.pdf) | — |
| L9 | Application to Collect Rent Arrears | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L9.pdf) | — |
| L10 | Application to Collect from Former Tenant | [PDF](https://tribunalsontario.ca/documents/ltb/Landlord%20Applications%20&%20Instructions/L10.pdf) | — |

---

## Tenant Applications (T-Forms)

| Form | Name | URL | Tier 2 Priority |
|------|------|-----|-----------------|
| T1 | Application for Rebate | [PDF](https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T1.pdf) | Low |
| T2 | Application About Landlord | [PDF](https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T2.pdf) | **HIGH** |
| T3 | Application for Rent Reduction | [PDF](https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T3.pdf) | Medium |
| T5 | Application About Bad Faith N12 | [PDF](https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T5.pdf) | High |
| T6 | Application About Maintenance | [PDF](https://tribunalsontario.ca/documents/ltb/Tenant%20Applications%20&%20Instructions/T6.pdf) | **HIGH** |

---

## Other Forms

| Form | Name | URL | Notes |
|------|------|-----|-------|
| Certificate of Service | Proof of service | [PDF](https://tribunalsontario.ca/documents/ltb/Other%20Forms/Certificate%20Of%20Service.pdf) | Required with applications |
| Request for Review | Appeal LTB order | [Portal](https://tribunalsontario.ca/ltb/tribunals-ontario-portal/) | 15-day deadline (Bill 60) |

---

## PDF Technical Notes

### Format
- Fillable PDF (AcroForm)
- Requires Adobe Reader or compatible viewer
- Some fields have validation

### Overlay Strategy (Tier 2)

For document generation, we can use:
1. **pdf-lib** (JavaScript): Client-side PDF manipulation
2. **Coordinate mapping**: Identify X,Y positions for each field
3. **Field extraction**: Parse existing form field names

### Challenges
- Form fields may not be named consistently
- Some checkboxes are graphical, not form fields
- Multi-page forms require page tracking

### Recommended Approach
1. Download official PDFs
2. Extract field coordinates programmatically
3. Store mapping in JSON config
4. Generate filled PDFs via overlay

---

## Update Protocol

1. **Quarterly:** Verify all URLs still resolve
2. **After LTB announcements:** Check for form updates
3. **After Bill changes:** Verify forms reflect new law

---

## Official Resources

- **Forms page:** https://tribunalsontario.ca/ltb/forms/
- **Filing portal:** https://tribunalsontario.ca/ltb/tribunals-ontario-portal/
- **Contact:** LTB@ontario.ca | 416-645-8080 | 1-888-332-3234

---

*This inventory is for developer reference. Always link users to official LTB sources.*
