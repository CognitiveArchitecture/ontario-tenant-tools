/**
 * Ontario Tenant Tools - Rent Increase Calculator Tests
 *
 * Unit tests for rent increase guideline validation.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRentIncrease,
  calculateRentIncreaseFromDollars,
  isExemptFromRentControl,
  getGuidelineRate,
  getAllGuidelineRates,
  generateRentIncreaseSummary,
} from '../packages/calculator/rent-increase';
import { dollarsToCents } from '../packages/core/types';

// ============================================
// Rent Increase Calculator Tests
// ============================================

describe('Rent Increase Calculator', () => {
  describe('calculateRentIncrease', () => {
    it('identifies legal increase within 2.5% guideline', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500), // Current: $1,500
        dollarsToCents(1537), // Proposed: $1,537 (2.47% increase)
        2025
      );

      expect(result.isLegal).toBe(true);
      expect(result.overageAmount).toBe(0);
    });

    it('identifies illegal increase exceeding guideline', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500), // Current: $1,500
        dollarsToCents(1600), // Proposed: $1,600 (6.67% increase)
        2025
      );

      expect(result.isLegal).toBe(false);
      expect(result.overageAmount).toBeGreaterThan(0);
    });

    it('calculates correct maximum allowed amount', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500), // Current: $1,500
        dollarsToCents(1600), // Proposed: $1,600
        2025
      );

      // Maximum: $1,500 * 1.025 = $1,537.50
      expect(result.maximumAllowed).toBe(dollarsToCents(1537.5));
    });

    it('calculates correct overage amount', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500), // Current: $1,500
        dollarsToCents(1600), // Proposed: $1,600
        2025
      );

      // Overage: $1,600 - $1,537.50 = $62.50
      expect(result.overageAmount).toBe(dollarsToCents(62.5));
    });

    it('accepts increase exactly at guideline limit', () => {
      const current = dollarsToCents(1500);
      const maximum = Math.round(current * 1.025);

      const result = calculateRentIncrease(current, maximum, 2025);

      expect(result.isLegal).toBe(true);
      expect(result.overageAmount).toBe(0);
    });

    it('includes guideline year and rate in result', () => {
      const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1537), 2025);

      expect(result.guidelineYear).toBe(2025);
      expect(result.guidelineRate).toBe(0.025);
    });

    it('adds warning when increase exceeds guideline', () => {
      const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1600), 2025);

      expect(result.warnings.some((w) => w.includes('exceeds'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('AGI'))).toBe(true);
    });

    it('adds warning about 90-day notice requirement for legal increases', () => {
      const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1537), 2025);

      expect(result.warnings.some((w) => w.includes('90 days'))).toBe(true);
    });
  });

  describe('calculateRentIncreaseFromDollars', () => {
    it('converts dollar amounts correctly', () => {
      const result = calculateRentIncreaseFromDollars(1500, 1537, 2025);

      expect(result.currentRent).toBe(dollarsToCents(1500));
      expect(result.proposedRent).toBe(dollarsToCents(1537));
      expect(result.isLegal).toBe(true);
    });
  });
});

// ============================================
// Rent Control Exemption Tests
// ============================================

describe('Rent Control Exemption', () => {
  describe('isExemptFromRentControl', () => {
    it('returns true for units first occupied after Nov 15, 2018', () => {
      expect(isExemptFromRentControl('2019-01-01')).toBe(true);
      expect(isExemptFromRentControl('2020-06-15')).toBe(true);
      expect(isExemptFromRentControl('2025-01-01')).toBe(true);
    });

    it('returns false for units first occupied before Nov 15, 2018', () => {
      expect(isExemptFromRentControl('2018-11-14')).toBe(false);
      expect(isExemptFromRentControl('2018-01-01')).toBe(false);
      expect(isExemptFromRentControl('2010-01-01')).toBe(false);
    });

    it('returns false for units first occupied exactly on Nov 15, 2018', () => {
      // The cutoff is "after" Nov 15, 2018, so the date itself is not exempt
      expect(isExemptFromRentControl('2018-11-15')).toBe(false);
    });

    it('returns false when date is not provided', () => {
      expect(isExemptFromRentControl(undefined)).toBe(false);
      expect(isExemptFromRentControl('')).toBe(false);
    });
  });

  describe('exemption integration', () => {
    it('marks exempt units as legal regardless of increase amount', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500),
        dollarsToCents(2500), // 67% increase
        2025,
        '2020-01-01' // First occupied after Nov 2018
      );

      expect(result.exemptFromGuideline).toBe(true);
      expect(result.isLegal).toBe(true);
    });

    it('adds exemption warning when unit is exempt', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500),
        dollarsToCents(2500),
        2025,
        '2020-01-01'
      );

      expect(result.warnings.some((w) => w.includes('EXEMPT'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('November 15, 2018'))).toBe(true);
    });

    it('applies guideline to non-exempt units', () => {
      const result = calculateRentIncrease(
        dollarsToCents(1500),
        dollarsToCents(2500),
        2025,
        '2010-01-01' // First occupied before Nov 2018
      );

      expect(result.exemptFromGuideline).toBe(false);
      expect(result.isLegal).toBe(false);
    });
  });
});

// ============================================
// Guideline Rate Tests
// ============================================

describe('Guideline Rate Lookup', () => {
  it('returns correct rate for 2025', () => {
    expect(getGuidelineRate(2025)).toBe(0.025);
  });

  it('returns undefined for unknown future years', () => {
    expect(getGuidelineRate(2030)).toBeUndefined();
  });

  it('adds warning when guideline rate is not confirmed', () => {
    const result = calculateRentIncrease(
      dollarsToCents(1500),
      dollarsToCents(1537),
      2030 // Unknown year
    );

    expect(result.warnings.some((w) => w.includes('not yet confirmed'))).toBe(true);
  });

  it('falls back to 2.5% for unknown years', () => {
    const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1537), 2030);

    expect(result.guidelineRate).toBe(0.025);
  });
});

// ============================================
// Edge Cases
// ============================================

describe('Edge Cases', () => {
  it('handles zero rent increase', () => {
    const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1500), 2025);

    expect(result.isLegal).toBe(true);
    expect(result.overageAmount).toBe(0);
  });

  it('handles rent decrease (always legal)', () => {
    const result = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1400), 2025);

    expect(result.isLegal).toBe(true);
    expect(result.overageAmount).toBe(0);
  });

  it('handles small rents correctly', () => {
    const result = calculateRentIncrease(
      dollarsToCents(500), // $500 rent
      dollarsToCents(515), // $515 proposed (3% increase)
      2025
    );

    expect(result.maximumAllowed).toBe(dollarsToCents(512.5));
    expect(result.isLegal).toBe(false);
  });

  it('handles high rents correctly', () => {
    const result = calculateRentIncrease(
      dollarsToCents(5000), // $5,000 rent
      dollarsToCents(5125), // $5,125 proposed (exactly 2.5%)
      2025
    );

    expect(result.isLegal).toBe(true);
  });

  it('handles very large rents', () => {
    const result = calculateRentIncrease(dollarsToCents(10000), dollarsToCents(10250), 2025);

    expect(result.isLegal).toBe(true);
    expect(result.maximumAllowed).toBe(dollarsToCents(10250));
  });
});

// ============================================
// getAllGuidelineRates Tests
// ============================================

describe('getAllGuidelineRates', () => {
  describe('[A] Happy Path', () => {
    it('returns object with all known years', () => {
      const rates = getAllGuidelineRates();

      expect(typeof rates).toBe('object');
      expect(rates[2025]).toBe(0.025);
      expect(rates[2026]).toBe(0.025);
    });

    it('returns rates for historical years', () => {
      const rates = getAllGuidelineRates();

      expect(rates[2023]).toBe(0.025);
      expect(rates[2024]).toBe(0.025);
    });
  });

  describe('[B] Immutability', () => {
    it('modifying returned object does not affect source', () => {
      const rates1 = getAllGuidelineRates();
      rates1[2025] = 0.999;

      const rates2 = getAllGuidelineRates();
      expect(rates2[2025]).toBe(0.025);
    });
  });
});

// ============================================
// generateRentIncreaseSummary Tests
// ============================================

describe('generateRentIncreaseSummary', () => {
  describe('[A] Happy Path', () => {
    it('generates summary for legal increase', () => {
      const calculation = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1537), 2025);

      const summary = generateRentIncreaseSummary(calculation);

      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toContain('1,500');
      expect(summary).toContain('1,537');
    });

    it('indicates legal status in summary', () => {
      const calculation = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1537), 2025);

      const summary = generateRentIncreaseSummary(calculation);

      expect(summary.toLowerCase()).toContain('legal');
    });
  });

  describe('[B] Illegal Increase', () => {
    it('generates summary for illegal increase', () => {
      const calculation = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1600), 2025);

      const summary = generateRentIncreaseSummary(calculation);

      expect(summary).toContain('1,600');
      expect(summary.toLowerCase()).toMatch(/illegal|exceed|over/);
    });

    it('includes overage amount in summary', () => {
      const calculation = calculateRentIncrease(dollarsToCents(1500), dollarsToCents(1600), 2025);

      const summary = generateRentIncreaseSummary(calculation);

      expect(summary).toContain('62');
    });
  });

  describe('[C] Exempt Unit', () => {
    it('generates summary for exempt unit', () => {
      const calculation = calculateRentIncrease(
        dollarsToCents(1500),
        dollarsToCents(2500),
        2025,
        '2020-01-01'
      );

      const summary = generateRentIncreaseSummary(calculation);

      expect(summary.toLowerCase()).toContain('exempt');
    });
  });
});

// ============================================
// getGuidelineRate Extended Tests
// ============================================

describe('getGuidelineRate Extended', () => {
  describe('[B] Historical Years', () => {
    it('returns rate for 2023', () => {
      expect(getGuidelineRate(2023)).toBe(0.025);
    });

    it('returns rate for 2024', () => {
      expect(getGuidelineRate(2024)).toBe(0.025);
    });

    it('returns rate for 2026', () => {
      expect(getGuidelineRate(2026)).toBe(0.025);
    });
  });
});
