# Bill 60, Schedule 12: RTA Amendments Summary

> Fighting Delays, Building Faster Act, 2025
> Royal Assent: November 27, 2025

**Purpose:** This document summarizes Schedule 12 amendments to the Residential Tenancies Act, 2006 for developer reference. Not a legal document—refer to official statute for authoritative text.

---

## Key Changes

### 1. N4 Notice Period (Non-Payment of Rent)

**Section affected:** RTA s. 59

| Aspect | Before | After |
|--------|--------|-------|
| Cure period | 14 days | **7 days** |
| Filing L1 | After 14 days | After **7 days** |

**Implementation notes:**
- Calculate business days (exclude weekends, holidays)
- Use Ontario judicial calendar
- Effective immediately upon Royal Assent

---

### 2. N12 Compensation (Landlord's Own Use)

**Section affected:** RTA s. 48.1, s. 49

| Aspect | Before | After |
|--------|--------|-------|
| Notice period (standard) | 60 days | 60 days (unchanged) |
| Notice period (extended) | N/A | **120 days** |
| Compensation (60-day) | 1 month rent | 1 month rent (unchanged) |
| Compensation (120-day) | N/A | **$0** |

**Implementation notes:**
- Two paths in timeline visualizer
- Calculator should show compensation only for 60-day scenario
- Landlord chooses which path; tenant cannot demand either

---

### 3. Section 82 Defenses (Maintenance Issues at Hearing)

**Section affected:** RTA s. 82

| Aspect | Before | After |
|--------|--------|-------|
| Raise at hearing | Yes, spontaneously | **Advance notice required** |
| Deposit requirement | None | **May require 50% of arrears** |

**Implementation notes:**
- Tier 2 only (requires legal vetting)
- Timeline not yet defined by regulation
- Flag as uncertain in all tools

**Regulatory gap:** See `REGULATORY_GAPS.md` #2, #3

---

### 4. Review Period

**Section affected:** RTA s. 210

| Aspect | Before | After |
|--------|--------|-------|
| Request for Review deadline | 30 days | **15 days** |

**Implementation notes:**
- Critical change—prominent warning in UI
- Calendar days, not business days (verify)
- Includes weekends; excludes only statutory holidays (verify)

---

### 5. Persistent Late Payment

**Section affected:** RTA s. 59 (new regulatory power)

| Aspect | Before | After |
|--------|--------|-------|
| Definition | LTB discretion | **Regulatory definition pending** |
| Eviction grounds | Case-by-case | **To be prescribed** |

**Implementation notes:**
- Do NOT encode until regulation published
- Display warning: "Rules may change"

**Regulatory gap:** See `REGULATORY_GAPS.md` #1

---

## Forms Affected

| Form | Name | Changes |
|------|------|---------|
| N4 | Notice to End Tenancy (Non-Payment) | 7-day period |
| N12 | Notice to End Tenancy (Own Use) | 120-day option |
| L1 | Application to Evict (Non-Payment) | Earlier filing |
| Request for Review | Appeal LTB Order | 15-day deadline |

---

## Effective Dates

| Provision | Effective |
|-----------|-----------|
| N4 cure period (7 days) | November 27, 2025 |
| N12 compensation waiver | November 27, 2025 |
| Review period (15 days) | November 27, 2025 |
| Section 82 changes | Awaiting regulation |
| Persistent late payment | Awaiting regulation |

---

## Official Sources

- **Bill 60 full text:** https://www.ola.org/en/legislative-business/bills/parliament-44/session-1/bill-60
- **RTA consolidated:** https://www.ontario.ca/laws/statute/06r17
- **LTB website:** https://tribunalsontario.ca/ltb/

---

## Changelog

| Date | Change |
|------|--------|
| 2025-11-30 | Initial summary based on Royal Assent version |

---

*This summary is for developer reference. Verify all provisions against official statute.*
