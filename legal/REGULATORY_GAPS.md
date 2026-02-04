# Regulatory Gaps Tracker

> Bill 60 provisions awaiting regulatory clarification or LTB procedural updates.

**Last reviewed:** 2025-11-30

---

## Status Key

| Status | Meaning |
|--------|---------|
| 🔴 PENDING | Regulation not yet released |
| 🟡 DRAFT | Regulation proposed but not finalized |
| 🟢 RESOLVED | Regulation published; update code |

---

## Active Gaps

### 1. Persistent Late Payment Definition

**Status:** 🔴 PENDING

**Provision:** Bill 60 grants regulatory power to define "persistent late payment" as grounds for eviction.

**Current state:** No regulation published. LTB adjudicators retain discretion.

**Impact on tools:**
- Cannot encode automatic eviction logic for late payments
- Must display warning: "Rules about repeated late payment may change"

**Monitor:** Ontario Gazette, LTB Interpretation Guidelines

---

### 2. Section 82 Advance Notice Timeline

**Status:** 🔴 PENDING

**Provision:** Bill 60 requires "advance written notice" to raise maintenance issues (Section 82) at eviction hearings.

**Current state:** Specific timeline not defined. LTB Rules of Practice may be updated.

**Impact on tools:**
- Tier 2 Section 82 wizard blocked until clarified
- Timeline visualizer cannot show Section 82 filing deadline

**Monitor:** LTB Rules of Practice updates

---

### 3. Section 82 Deposit Requirement

**Status:** 🟡 DRAFT (implied 50%)

**Provision:** Bill 60 implies tenants must pay portion of arrears into trust to raise Section 82 defenses.

**Current state:** 50% cited in analysis but not confirmed in regulation.

**Impact on tools:**
- Calculator can estimate but must caveat as uncertain
- Display: "You may need to pay a deposit to raise maintenance issues—check with LTB"

**Monitor:** LTB procedural bulletins, legal clinic guidance

---

### 4. N4 Cure Period Effective Date

**Status:** 🟢 RESOLVED

**Provision:** Reduced from 14 days to 7 days.

**Current state:** In effect as of Royal Assent (November 27, 2025).

**Impact on tools:**
- ✅ Calculator updated to 7-day default
- ✅ Timeline reflects new period

**Source:** Bill 60, Schedule 12

---

### 5. N12 Compensation Waiver (120-Day Notice)

**Status:** 🟢 RESOLVED

**Provision:** No compensation required if landlord provides 120 days notice.

**Current state:** In effect as of Royal Assent.

**Impact on tools:**
- ✅ Timeline shows both 60-day (with compensation) and 120-day (no compensation) paths
- ✅ Glossary updated

**Source:** Bill 60, Schedule 12

---

### 6. Review Period Reduction

**Status:** 🟢 RESOLVED

**Provision:** Request for Review deadline reduced from 30 days to 15 days.

**Current state:** In effect as of Royal Assent.

**Impact on tools:**
- ✅ Timeline updated to 15-day window
- ✅ Prominent warning about shortened deadline

**Source:** Bill 60, Schedule 12

---

## Monitoring Protocol

1. **Weekly:** Check LTB website for procedural updates
2. **Monthly:** Review Ontario Gazette for new regulations
3. **As needed:** Monitor ACTO, CLEO for legal clinic guidance

---

## Update Procedure

When a gap is resolved:

1. Update status in this file
2. Add source reference
3. Update affected tool logic
4. Update user-facing text
5. Note in CHANGELOG.md

---

## Sources to Monitor

- [Ontario Gazette](https://www.ontario.ca/search/ontario-gazette)
- [LTB Rules of Practice](https://tribunalsontario.ca/ltb/rules-practice-directions/)
- [LTB Interpretation Guidelines](https://tribunalsontario.ca/ltb/legislation-and-resources/)
- [ACTO Updates](https://www.acto.ca/)
- [CLEO / Steps to Justice](https://stepstojustice.ca/)

---

*This tracker is part of Ontario Tenant Tools. Report new gaps via GitHub Issues.*
