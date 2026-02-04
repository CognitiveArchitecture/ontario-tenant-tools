/**
 * Ontario Tenant Tools - Section 82 Deposit Calculator Tests
 *
 * Unit tests for Section 82 maintenance defense deposit estimation.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSection82Deposit,
  calculateSection82DepositFromDollars,
  getSection82RegulatoryStatus,
  getSection82DepositPercentage,
  isSection82Confirmed,
  generateSection82Summary,
} from '../packages/calculator/section82';
import { dollarsToCents } from '../packages/core/types';

// ============================================
// Section 82 Deposit Calculator Tests
// ============================================

describe('Section 82 Deposit Calculator', () => {
  describe('calculateSection82Deposit', () => {
    it('calculates 50% deposit correctly', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.depositRequired).toBe(dollarsToCents(750));
    });

    it('returns correct arrears amount', () => {
      const result = calculateSection82Deposit(dollarsToCents(2000));

      expect(result.arrearsAmount).toBe(dollarsToCents(2000));
    });

    it('returns correct deposit percentage', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.depositPercentage).toBe(0.5);
    });

    it('includes regulatory status in result', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.regulatoryStatus).toBe('draft');
    });

    it('always includes uncertainty warning', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.warnings.some((w) => w.includes('NOT YET CONFIRMED'))).toBe(true);
    });

    it('includes warning about deposit amount', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.warnings.some((w) => w.includes('$750.00') && w.includes('trust'))).toBe(true);
    });

    it('includes warning about legal clinic help', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(result.warnings.some((w) => w.includes('community legal clinic'))).toBe(true);
    });

    it('includes warning about advance notice requirement', () => {
      const result = calculateSection82Deposit(dollarsToCents(1500));

      expect(
        result.warnings.some((w) => w.includes('ADVANCE WRITTEN NOTICE') && w.includes('timeline'))
      ).toBe(true);
    });
  });

  describe('calculateSection82DepositFromDollars', () => {
    it('converts dollar amount correctly', () => {
      const result = calculateSection82DepositFromDollars(1500);

      expect(result.arrearsAmount).toBe(dollarsToCents(1500));
      expect(result.depositRequired).toBe(dollarsToCents(750));
    });
  });
});

// ============================================
// Regulatory Status Tests
// ============================================

describe('Section 82 Regulatory Status', () => {
  describe('getSection82RegulatoryStatus', () => {
    it('returns draft status', () => {
      // Per REGULATORY_GAPS.md item #3
      expect(getSection82RegulatoryStatus()).toBe('draft');
    });
  });

  describe('getSection82DepositPercentage', () => {
    it('returns 50% (0.5)', () => {
      expect(getSection82DepositPercentage()).toBe(0.5);
    });
  });

  describe('isSection82Confirmed', () => {
    it('returns false (rules not yet confirmed)', () => {
      expect(isSection82Confirmed()).toBe(false);
    });
  });
});

// ============================================
// Edge Cases
// ============================================

describe('Section 82 Edge Cases', () => {
  it('handles zero arrears', () => {
    const result = calculateSection82Deposit(0);

    expect(result.depositRequired).toBe(0);
    expect(result.arrearsAmount).toBe(0);
  });

  it('handles small arrears amounts', () => {
    const result = calculateSection82Deposit(dollarsToCents(100));

    expect(result.depositRequired).toBe(dollarsToCents(50));
  });

  it('handles large arrears amounts', () => {
    const result = calculateSection82Deposit(dollarsToCents(10000));

    expect(result.depositRequired).toBe(dollarsToCents(5000));
  });

  it('rounds to nearest cent', () => {
    // $151 arrears -> $75.50 deposit
    const result = calculateSection82Deposit(dollarsToCents(151));

    expect(result.depositRequired).toBe(dollarsToCents(75.5));
  });

  it('handles odd cent amounts', () => {
    // 1501 cents arrears -> 750.5 cents -> 751 cents (rounded)
    const result = calculateSection82Deposit(1501);

    expect(result.depositRequired).toBe(751); // Math.round(750.5)
  });
});

// ============================================
// Warning Content Tests
// ============================================

describe('Section 82 Warning Content', () => {
  it('warns about regulatory uncertainty prominently', () => {
    const result = calculateSection82Deposit(dollarsToCents(1500));
    const uncertaintyWarning = result.warnings.find((w) => w.includes('NOT YET CONFIRMED'));

    expect(uncertaintyWarning).toBeDefined();
    expect(uncertaintyWarning).toContain('Bill 60');
    expect(uncertaintyWarning).toContain('regulations');
    expect(uncertaintyWarning).toContain('LTB');
  });

  it('provides actionable next steps', () => {
    const result = calculateSection82Deposit(dollarsToCents(1500));

    // Should mention legal clinic
    expect(result.warnings.some((w) => w.toLowerCase().includes('legal clinic'))).toBe(true);

    // Should mention LTB
    expect(result.warnings.some((w) => w.includes('LTB'))).toBe(true);
  });

  it('mentions advance notice requirement', () => {
    const result = calculateSection82Deposit(dollarsToCents(1500));

    expect(result.warnings.some((w) => w.includes('ADVANCE WRITTEN NOTICE'))).toBe(true);
  });
});

// ============================================
// Consistency Tests
// ============================================

describe('Section 82 Consistency', () => {
  it('deposit percentage matches between result and helper', () => {
    const result = calculateSection82Deposit(dollarsToCents(1500));

    expect(result.depositPercentage).toBe(getSection82DepositPercentage());
  });

  it('regulatory status matches between result and helper', () => {
    const result = calculateSection82Deposit(dollarsToCents(1500));

    expect(result.regulatoryStatus).toBe(getSection82RegulatoryStatus());
  });

  it('produces consistent results for same input', () => {
    const result1 = calculateSection82Deposit(dollarsToCents(1500));
    const result2 = calculateSection82Deposit(dollarsToCents(1500));

    expect(result1.depositRequired).toBe(result2.depositRequired);
    expect(result1.arrearsAmount).toBe(result2.arrearsAmount);
    expect(result1.depositPercentage).toBe(result2.depositPercentage);
    expect(result1.regulatoryStatus).toBe(result2.regulatoryStatus);
  });
});

// ============================================
// generateSection82Summary Tests
// ============================================

describe('generateSection82Summary', () => {
  describe('[A] Happy Path', () => {
    it('generates summary for normal calculation', () => {
      const calculation = calculateSection82Deposit(dollarsToCents(1500));

      const summary = generateSection82Summary(calculation);

      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });

    it('includes arrears amount in summary', () => {
      const calculation = calculateSection82Deposit(dollarsToCents(1500));

      const summary = generateSection82Summary(calculation);

      expect(summary).toContain('1,500');
    });

    it('includes deposit amount in summary', () => {
      const calculation = calculateSection82Deposit(dollarsToCents(1500));

      const summary = generateSection82Summary(calculation);

      expect(summary).toContain('750');
    });

    it('includes regulatory warning', () => {
      const calculation = calculateSection82Deposit(dollarsToCents(1500));

      const summary = generateSection82Summary(calculation);

      expect(summary.toLowerCase()).toMatch(/draft|pending|not.*confirmed/);
    });
  });

  describe('[B] Zero Arrears', () => {
    it('handles zero arrears', () => {
      const calculation = calculateSection82Deposit(0);

      const summary = generateSection82Summary(calculation);

      expect(typeof summary).toBe('string');
      expect(summary).toContain('0');
    });
  });

  describe('[C] Large Arrears', () => {
    it('handles large arrears amount', () => {
      const calculation = calculateSection82Deposit(dollarsToCents(50000));

      const summary = generateSection82Summary(calculation);

      expect(summary).toContain('50,000');
      expect(summary).toContain('25,000');
    });
  });
});

// ============================================
// Error Input Tests
// ============================================

describe('Section 82 Error Input Handling', () => {
  describe('[C] Invalid Inputs', () => {
    // BUG DOCUMENTED: These tests document that invalid inputs are not validated
    it('handles negative arrears (no validation)', () => {
      const result = calculateSection82Deposit(-1500);

      // Documents actual behavior - negative values pass through
      expect(result.depositRequired).toBe(-750);
    });

    it('handles NaN input (no validation)', () => {
      const result = calculateSection82Deposit(NaN);

      // Documents actual behavior - NaN propagates
      expect(isNaN(result.depositRequired)).toBe(true);
    });

    it('handles Infinity input (no validation)', () => {
      const result = calculateSection82Deposit(Infinity);

      // Documents actual behavior - Infinity propagates
      expect(result.depositRequired).toBe(Infinity);
    });

    it('handles negative Infinity input (no validation)', () => {
      const result = calculateSection82Deposit(-Infinity);

      // Documents actual behavior
      expect(result.depositRequired).toBe(-Infinity);
    });
  });
});
