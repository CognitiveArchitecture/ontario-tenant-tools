/**
 * Ontario Tenant Tools - Core Tests
 * 
 * Unit tests for date calculations and arrears calculator.
 */

import { describe, it, expect } from 'vitest';
import {
  parseDate,
  formatDate,
  addDays,
  isWeekend,
  isStatutoryHoliday,
  isBusinessDay,
  calculateN4Deadline,
  calculateN12Deadline,
  calculateReviewDeadline,
  businessDaysBetween,
} from '../packages/core/dates';
import {
  calculateArrears,
  createChargeFromDollars,
  createPaymentFromDollars,
} from '../packages/calculator/arrears';
import { dollarsToCents, formatCurrency } from '../packages/core/types';

// ============================================
// Date Utility Tests
// ============================================

describe('Date Utilities', () => {
  describe('parseDate', () => {
    it('parses ISO date string correctly', () => {
      const date = parseDate('2025-12-15');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(11); // 0-indexed
      expect(date.getDate()).toBe(15);
    });
  });

  describe('formatDate', () => {
    it('formats Date to ISO string', () => {
      const date = new Date(2025, 11, 15); // December 15, 2025
      expect(formatDate(date)).toBe('2025-12-15');
    });

    it('pads single-digit months and days', () => {
      const date = new Date(2025, 0, 5); // January 5, 2025
      expect(formatDate(date)).toBe('2025-01-05');
    });
  });

  describe('isWeekend', () => {
    it('identifies Saturday as weekend', () => {
      const saturday = new Date(2025, 11, 6); // December 6, 2025 is Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('identifies Sunday as weekend', () => {
      const sunday = new Date(2025, 11, 7); // December 7, 2025 is Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('identifies Monday as not weekend', () => {
      const monday = new Date(2025, 11, 8); // December 8, 2025 is Monday
      expect(isWeekend(monday)).toBe(false);
    });
  });

  describe('isStatutoryHoliday', () => {
    it('identifies Christmas Day as holiday', () => {
      const christmas = new Date(2025, 11, 25);
      const holiday = isStatutoryHoliday(christmas);
      expect(holiday).not.toBeNull();
      expect(holiday?.name).toBe('Christmas Day');
    });

    it('returns null for non-holidays', () => {
      const regularDay = new Date(2025, 11, 10);
      expect(isStatutoryHoliday(regularDay)).toBeNull();
    });
  });

  describe('isBusinessDay', () => {
    it('returns false for weekends', () => {
      const saturday = new Date(2025, 11, 6);
      expect(isBusinessDay(saturday)).toBe(false);
    });

    it('returns false for holidays', () => {
      const christmas = new Date(2025, 11, 25);
      expect(isBusinessDay(christmas)).toBe(false);
    });

    it('returns true for regular weekdays', () => {
      const monday = new Date(2025, 11, 8);
      expect(isBusinessDay(monday)).toBe(true);
    });
  });
});

// ============================================
// N4 Deadline Tests (Bill 60: 7 days)
// ============================================

describe('N4 Deadline Calculations (Bill 60)', () => {
  it('calculates 7 business days from notice date', () => {
    // Monday December 1, 2025
    const result = calculateN4Deadline('2025-12-01');
    
    // 7 business days from Dec 1 (Mon) = Dec 10 (Wed)
    // Dec 2 (Tue), 3 (Wed), 4 (Thu), 5 (Fri), 8 (Mon), 9 (Tue), 10 (Wed)
    expect(result.cureDeadline).toBe('2025-12-10');
  });

  it('skips weekends in calculation', () => {
    // Thursday December 4, 2025
    const result = calculateN4Deadline('2025-12-04');
    
    // Should skip Sat Dec 6 and Sun Dec 7
    expect(result.workdaysSkipped.some(d => d.reason === 'Saturday')).toBe(true);
    expect(result.workdaysSkipped.some(d => d.reason === 'Sunday')).toBe(true);
  });

  it('skips statutory holidays', () => {
    // December 22, 2025 (Monday before Christmas)
    const result = calculateN4Deadline('2025-12-22');
    
    // Should skip Christmas Day (Dec 25) and Boxing Day (Dec 26)
    expect(result.workdaysSkipped.some(d => d.reason === 'Christmas Day')).toBe(true);
  });

  it('provides canFileL1Date as day after cure deadline', () => {
    const result = calculateN4Deadline('2025-12-01');
    
    const cureDeadline = parseDate(result.cureDeadline);
    const canFile = parseDate(result.canFileL1Date);
    
    expect(canFile.getTime() - cureDeadline.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

// ============================================
// N12 Deadline Tests (Bill 60: 120-day option)
// ============================================

describe('N12 Deadline Calculations (Bill 60)', () => {
  it('calculates 60-day termination with compensation', () => {
    const result = calculateN12Deadline('2025-12-01', 60, dollarsToCents(2000));
    
    expect(result.terminationDate).toBe('2026-01-30');
    expect(result.compensationRequired).toBe(true);
    expect(result.compensationAmount).toBe(dollarsToCents(2000));
  });

  it('calculates 120-day termination without compensation', () => {
    const result = calculateN12Deadline('2025-12-01', 120, dollarsToCents(2000));
    
    expect(result.terminationDate).toBe('2026-03-31');
    expect(result.compensationRequired).toBe(false);
    expect(result.compensationAmount).toBe(0);
  });

  it('warns about Bill 60 compensation waiver', () => {
    const result = calculateN12Deadline('2025-12-01', 120, dollarsToCents(2000));
    
    expect(result.warnings.some(w => w.includes('Bill 60'))).toBe(true);
    expect(result.warnings.some(w => w.includes('No compensation'))).toBe(true);
  });
});

// ============================================
// Review Deadline Tests (Bill 60: 15 days)
// ============================================

describe('Review Deadline Calculations (Bill 60)', () => {
  it('calculates 15 calendar days from order date', () => {
    const result = calculateReviewDeadline('2025-12-01');
    
    expect(result.deadline).toBe('2025-12-16');
  });

  it('warns about Bill 60 reduction', () => {
    const result = calculateReviewDeadline('2025-12-01');
    
    expect(result.warnings.some(w => w.includes('15 days'))).toBe(true);
  });
});

// ============================================
// Arrears Calculator Tests
// ============================================

describe('Arrears Calculator', () => {
  it('calculates simple arrears correctly', () => {
    const charges = [
      createChargeFromDollars('2025-01-01', 1500, 'rent', 'January rent', 'January 2025'),
      createChargeFromDollars('2025-02-01', 1500, 'rent', 'February rent', 'February 2025'),
    ];
    const payments = [
      createPaymentFromDollars('2025-01-05', 1500, 'January payment'),
    ];

    const result = calculateArrears(charges, payments);

    expect(result.currentBalance).toBe(dollarsToCents(1500));
    expect(result.totalCharges).toBe(dollarsToCents(3000));
    expect(result.totalPayments).toBe(dollarsToCents(1500));
  });

  it('segregates late fees from rent', () => {
    const charges = [
      createChargeFromDollars('2025-01-01', 1500, 'rent', 'January rent'),
      createChargeFromDollars('2025-01-05', 50, 'late_fee', 'Late fee'),
    ];
    const payments: never[] = [];

    const result = calculateArrears(charges, payments);

    expect(result.lateFeeTotal).toBe(dollarsToCents(50));
    expect(result.rentOnly).toBe(dollarsToCents(1500));
    expect(result.currentBalance).toBe(dollarsToCents(1550));
  });

  it('warns about potentially illegal late fees over $50', () => {
    const charges = [
      createChargeFromDollars('2025-01-01', 1500, 'rent'),
      createChargeFromDollars('2025-01-05', 100, 'late_fee'),
    ];

    const result = calculateArrears(charges, []);

    expect(result.warnings.some(w => w.type === 'illegal_late_fee')).toBe(true);
  });

  it('applies payments in FIFO order', () => {
    const charges = [
      createChargeFromDollars('2025-01-01', 1000, 'rent'),
      createChargeFromDollars('2025-02-01', 1000, 'rent'),
    ];
    const payments = [
      createPaymentFromDollars('2025-01-15', 500),
    ];

    const result = calculateArrears(charges, payments);

    // First payment reduces balance after first charge
    expect(result.entries[1].balance).toBe(dollarsToCents(500)); // After payment
    expect(result.currentBalance).toBe(dollarsToCents(1500));
  });

  it('warns about Bill 60 7-day deadline when arrears exist', () => {
    const charges = [createChargeFromDollars('2025-01-01', 1500, 'rent')];
    const result = calculateArrears(charges, []);

    expect(result.warnings.some(w => w.message.includes('7 BUSINESS DAYS'))).toBe(true);
  });
});

// ============================================
// Currency Formatting Tests
// ============================================

describe('Currency Utilities', () => {
  it('converts dollars to cents', () => {
    expect(dollarsToCents(100)).toBe(10000);
    expect(dollarsToCents(0.99)).toBe(99);
    expect(dollarsToCents(1500.50)).toBe(150050);
  });

  it('formats cents as CAD currency', () => {
    expect(formatCurrency(150000)).toBe('$1,500.00');
    expect(formatCurrency(99)).toBe('$0.99');
  });
});
