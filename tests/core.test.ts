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
  getHolidaysForYear,
  getNonBusinessDayReason,
  businessDaysBetween,
  calendarDaysBetween,
  isValidDateString,
  calculateN4Deadline,
  calculateN12Deadline,
  calculateReviewDeadline,
} from '../packages/core/dates';
import {
  calculateArrears,
  createChargeFromDollars,
  createPaymentFromDollars,
} from '../packages/calculator/arrears';
import { dollarsToCents, centsToDollars, formatCurrency } from '../packages/core/types';

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
    expect(result.workdaysSkipped.some((d) => d.reason === 'Saturday')).toBe(true);
    expect(result.workdaysSkipped.some((d) => d.reason === 'Sunday')).toBe(true);
  });

  it('skips statutory holidays', () => {
    // December 22, 2025 (Monday before Christmas)
    const result = calculateN4Deadline('2025-12-22');

    // Should skip Christmas Day (Dec 25) and Boxing Day (Dec 26)
    expect(result.workdaysSkipped.some((d) => d.reason === 'Christmas Day')).toBe(true);
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

    expect(result.warnings.some((w) => w.includes('Bill 60'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('No compensation'))).toBe(true);
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

    expect(result.warnings.some((w) => w.includes('15 days'))).toBe(true);
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
    const payments = [createPaymentFromDollars('2025-01-05', 1500, 'January payment')];

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

    expect(result.warnings.some((w) => w.type === 'illegal_late_fee')).toBe(true);
  });

  it('applies payments in FIFO order', () => {
    const charges = [
      createChargeFromDollars('2025-01-01', 1000, 'rent'),
      createChargeFromDollars('2025-02-01', 1000, 'rent'),
    ];
    const payments = [createPaymentFromDollars('2025-01-15', 500)];

    const result = calculateArrears(charges, payments);

    // First payment reduces balance after first charge
    expect(result.entries[1]?.balance).toBe(dollarsToCents(500)); // After payment
    expect(result.currentBalance).toBe(dollarsToCents(1500));
  });

  it('warns about Bill 60 7-day deadline when arrears exist', () => {
    const charges = [createChargeFromDollars('2025-01-01', 1500, 'rent')];
    const result = calculateArrears(charges, []);

    expect(result.warnings.some((w) => w.message.includes('7 BUSINESS DAYS'))).toBe(true);
  });
});

// ============================================
// Currency Formatting Tests
// ============================================

describe('Currency Utilities', () => {
  it('converts dollars to cents', () => {
    expect(dollarsToCents(100)).toBe(10000);
    expect(dollarsToCents(0.99)).toBe(99);
    expect(dollarsToCents(1500.5)).toBe(150050);
  });

  it('formats cents as CAD currency', () => {
    expect(formatCurrency(150000)).toBe('$1,500.00');
    expect(formatCurrency(99)).toBe('$0.99');
  });
});

// ============================================
// addDays Tests
// ============================================

describe('addDays', () => {
  describe('[A] Happy Path', () => {
    it('adds 1 day correctly', () => {
      const date = new Date(2025, 11, 15);
      const result = addDays(date, 1);
      expect(result.getDate()).toBe(16);
      expect(result.getMonth()).toBe(11);
    });

    it('adds 7 days correctly', () => {
      const date = new Date(2025, 11, 15);
      const result = addDays(date, 7);
      expect(result.getDate()).toBe(22);
    });

    it('adds 30 days correctly', () => {
      const date = new Date(2025, 11, 1);
      const result = addDays(date, 30);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(11);
    });
  });

  describe('[B] Edge Cases', () => {
    it('handles negative days (subtraction)', () => {
      const date = new Date(2025, 11, 15);
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });

    it('handles zero days', () => {
      const date = new Date(2025, 11, 15);
      const result = addDays(date, 0);
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(11);
      expect(result.getFullYear()).toBe(2025);
    });

    it('handles month boundary', () => {
      const date = new Date(2025, 10, 30);
      const result = addDays(date, 1);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(11);
    });

    it('handles year boundary', () => {
      const date = new Date(2025, 11, 31);
      const result = addDays(date, 1);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2026);
    });

    it('handles leap year Feb 29', () => {
      const date = new Date(2024, 1, 28);
      const result = addDays(date, 1);
      expect(result.getDate()).toBe(29);
      expect(result.getMonth()).toBe(1);
    });

    it('handles Feb 28 to Mar 1 in non-leap year', () => {
      const date = new Date(2025, 1, 28);
      const result = addDays(date, 1);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(2);
    });

    it('does not mutate the original date', () => {
      const date = new Date(2025, 11, 15);
      const originalTime = date.getTime();
      addDays(date, 5);
      expect(date.getTime()).toBe(originalTime);
    });
  });

  describe('[C] Error Cases', () => {
    it('handles Invalid Date input', () => {
      const invalidDate = new Date('invalid');
      const result = addDays(invalidDate, 1);
      expect(isNaN(result.getTime())).toBe(true);
    });
  });
});

// ============================================
// getHolidaysForYear Tests
// ============================================

describe('getHolidaysForYear', () => {
  describe('[A] Known Years', () => {
    it('returns holidays for 2025', () => {
      const holidays = getHolidaysForYear(2025);
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays.some((h) => h.name === 'Christmas Day')).toBe(true);
    });

    it('returns holidays for 2026', () => {
      const holidays = getHolidaysForYear(2026);
      expect(holidays.length).toBeGreaterThan(0);
      expect(holidays.some((h) => h.name === "New Year's Day")).toBe(true);
    });

    it('returns correct number of holidays for 2025', () => {
      const holidays = getHolidaysForYear(2025);
      expect(holidays.length).toBe(12);
    });
  });

  describe('[B] Unknown/Boundary Years', () => {
    it('returns empty array for unknown year (2030)', () => {
      const holidays = getHolidaysForYear(2030);
      expect(holidays).toEqual([]);
    });

    it('returns empty array for year 0', () => {
      const holidays = getHolidaysForYear(0);
      expect(holidays).toEqual([]);
    });

    it('returns empty array for negative year', () => {
      const holidays = getHolidaysForYear(-2025);
      expect(holidays).toEqual([]);
    });
  });

  describe('[C] Return Type Validation', () => {
    it('returns an array', () => {
      const holidays = getHolidaysForYear(2025);
      expect(Array.isArray(holidays)).toBe(true);
    });

    it('each holiday has required properties', () => {
      const holidays = getHolidaysForYear(2025);
      holidays.forEach((holiday) => {
        expect(holiday).toHaveProperty('date');
        expect(holiday).toHaveProperty('name');
        expect(typeof holiday.date).toBe('string');
        expect(typeof holiday.name).toBe('string');
      });
    });
  });
});

// ============================================
// getNonBusinessDayReason Tests
// ============================================

describe('getNonBusinessDayReason', () => {
  describe('[A] Weekend Returns', () => {
    it('returns Saturday for Saturday', () => {
      const saturday = new Date(2025, 11, 6);
      expect(getNonBusinessDayReason(saturday)).toBe('Saturday');
    });

    it('returns Sunday for Sunday', () => {
      const sunday = new Date(2025, 11, 7);
      expect(getNonBusinessDayReason(sunday)).toBe('Sunday');
    });
  });

  describe('[B] Holiday Returns', () => {
    it('returns holiday name for Christmas Day', () => {
      const christmas = new Date(2025, 11, 25);
      expect(getNonBusinessDayReason(christmas)).toBe('Christmas Day');
    });

    it('returns holiday name for Boxing Day', () => {
      const boxingDay = new Date(2025, 11, 26);
      expect(getNonBusinessDayReason(boxingDay)).toBe('Boxing Day');
    });

    it("returns holiday name for New Year's Day", () => {
      const newYear = new Date(2025, 0, 1);
      expect(getNonBusinessDayReason(newYear)).toBe("New Year's Day");
    });
  });

  describe('[C] Business Day Returns', () => {
    it('returns null for regular business day', () => {
      const monday = new Date(2025, 11, 8);
      expect(getNonBusinessDayReason(monday)).toBeNull();
    });

    it('returns null for weekday that is not a holiday', () => {
      const wednesday = new Date(2025, 11, 10);
      expect(getNonBusinessDayReason(wednesday)).toBeNull();
    });
  });
});

// ============================================
// businessDaysBetween Tests
// ============================================

describe('businessDaysBetween', () => {
  describe('[A] Happy Path', () => {
    it('counts business days within same week', () => {
      const result = businessDaysBetween('2025-12-01', '2025-12-05');
      expect(result).toBe(4);
    });

    it('counts business days across weekend', () => {
      const result = businessDaysBetween('2025-12-05', '2025-12-08');
      expect(result).toBe(1);
    });
  });

  describe('[B] Edge Cases', () => {
    it('returns 0 when end is before start', () => {
      const result = businessDaysBetween('2025-12-10', '2025-12-05');
      expect(result).toBe(0);
    });

    it('returns 0 for same date', () => {
      const result = businessDaysBetween('2025-12-05', '2025-12-05');
      expect(result).toBe(0);
    });

    it('excludes holidays from count', () => {
      const result = businessDaysBetween('2025-12-22', '2025-12-26');
      expect(result).toBe(2);
    });

    it('handles period spanning year boundary', () => {
      const result = businessDaysBetween('2025-12-29', '2026-01-02');
      expect(result).toBe(3);
    });
  });
});

// ============================================
// calendarDaysBetween Tests
// ============================================

describe('calendarDaysBetween', () => {
  describe('[A] Happy Path', () => {
    it('calculates days within same month', () => {
      const result = calendarDaysBetween('2025-12-01', '2025-12-10');
      expect(result).toBe(9);
    });

    it('calculates days across months', () => {
      const result = calendarDaysBetween('2025-11-28', '2025-12-05');
      expect(result).toBe(7);
    });
  });

  describe('[B] Edge Cases', () => {
    it('returns negative when end is before start', () => {
      const result = calendarDaysBetween('2025-12-10', '2025-12-05');
      expect(result).toBe(-5);
    });

    it('returns 0 for same date', () => {
      const result = calendarDaysBetween('2025-12-05', '2025-12-05');
      expect(result).toBe(0);
    });

    it('handles year boundary', () => {
      const result = calendarDaysBetween('2025-12-28', '2026-01-04');
      expect(result).toBe(7);
    });

    it('handles leap year February', () => {
      const result = calendarDaysBetween('2024-02-28', '2024-03-01');
      expect(result).toBe(2);
    });

    it('handles non-leap year February', () => {
      const result = calendarDaysBetween('2025-02-28', '2025-03-01');
      expect(result).toBe(1);
    });
  });
});

// ============================================
// isValidDateString Tests
// ============================================

describe('isValidDateString', () => {
  describe('[A] Valid Formats', () => {
    it('accepts valid ISO date string', () => {
      expect(isValidDateString('2025-01-15')).toBe(true);
    });

    it('accepts valid date with single-digit day', () => {
      expect(isValidDateString('2025-01-05')).toBe(true);
    });

    it('accepts valid leap year date', () => {
      expect(isValidDateString('2024-02-29')).toBe(true);
    });
  });

  describe('[B] Invalid Formats', () => {
    it('rejects MM-DD-YYYY format', () => {
      expect(isValidDateString('01-15-2025')).toBe(false);
    });

    it('rejects slash-separated format', () => {
      expect(isValidDateString('2025/01/15')).toBe(false);
    });

    it('rejects invalid string', () => {
      expect(isValidDateString('invalid')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidDateString('')).toBe(false);
    });

    it('rejects date with missing parts', () => {
      expect(isValidDateString('2025-01')).toBe(false);
    });

    it('rejects date with extra parts', () => {
      expect(isValidDateString('2025-01-15-00')).toBe(false);
    });
  });

  // BUG DOCUMENTED: isValidDateString does not validate actual calendar dates
  describe('[C] Calendar Date Validation (Known Limitation)', () => {
    it('accepts Feb 30 due to Date rollover', () => {
      expect(isValidDateString('2025-02-30')).toBe(true);
    });

    it('accepts Feb 29 in non-leap year due to Date rollover', () => {
      expect(isValidDateString('2025-02-29')).toBe(true);
    });
  });
});

// ============================================
// calculateN4Deadline Extended Edge Cases
// ============================================

describe('calculateN4Deadline Extended Edge Cases', () => {
  describe('[B] Weekend/Holiday Edge Cases', () => {
    it('handles notice served on Friday (spans weekend)', () => {
      const result = calculateN4Deadline('2025-12-05');
      expect(result.workdaysSkipped.some((d) => d.reason === 'Saturday')).toBe(true);
      expect(result.workdaysSkipped.some((d) => d.reason === 'Sunday')).toBe(true);
    });

    it('handles notice spanning statutory holiday', () => {
      const result = calculateN4Deadline('2025-12-22');
      expect(result.workdaysSkipped.some((d) => d.reason === 'Christmas Day')).toBe(true);
      expect(result.workdaysSkipped.some((d) => d.reason === 'Boxing Day')).toBe(true);
    });

    it('handles notice at year boundary', () => {
      const result = calculateN4Deadline('2025-12-29');
      expect(result.cureDeadline.startsWith('2026-01')).toBe(true);
      expect(result.workdaysSkipped.some((d) => d.reason === "New Year's Day")).toBe(true);
    });

    it('handles multiple consecutive holidays', () => {
      const result = calculateN4Deadline('2025-12-24');
      const holidaysSkipped = result.workdaysSkipped.filter(
        (d) => d.reason === 'Christmas Day' || d.reason === 'Boxing Day'
      );
      expect(holidaysSkipped.length).toBe(2);
    });
  });
});

// ============================================
// calculateN12Deadline Extended Tests
// ============================================

describe('calculateN12Deadline Extended Tests', () => {
  describe('[C] Error Cases', () => {
    it('handles zero rent', () => {
      const result = calculateN12Deadline('2025-12-01', 60, 0);
      expect(result.compensationAmount).toBe(0);
      expect(result.compensationRequired).toBe(true);
    });

    it('60-day notice requires compensation', () => {
      const result = calculateN12Deadline('2025-12-01', 60, dollarsToCents(1500));
      expect(result.compensationRequired).toBe(true);
      expect(result.compensationAmount).toBe(dollarsToCents(1500));
    });

    it('120-day notice does not require compensation', () => {
      const result = calculateN12Deadline('2025-12-01', 120, dollarsToCents(1500));
      expect(result.compensationRequired).toBe(false);
      expect(result.compensationAmount).toBe(0);
    });
  });
});

// ============================================
// calculateReviewDeadline Extended Tests
// ============================================

describe('calculateReviewDeadline Extended Tests', () => {
  describe('[B] Boundary Cases', () => {
    it('order on Dec 1 results in Dec 16 deadline', () => {
      const result = calculateReviewDeadline('2025-12-01');
      expect(result.deadline).toBe('2025-12-16');
    });

    it('handles order at year boundary', () => {
      const result = calculateReviewDeadline('2025-12-20');
      expect(result.deadline).toBe('2026-01-04');
    });

    it('handles leap year boundary', () => {
      const result = calculateReviewDeadline('2024-02-20');
      expect(result.deadline).toBe('2024-03-06');
    });

    it('always includes Bill 60 warning', () => {
      const result = calculateReviewDeadline('2025-12-01');
      expect(result.warnings.some((w) => w.includes('Bill 60'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('15 days'))).toBe(true);
    });
  });
});

// ============================================
// centsToDollars Tests
// ============================================

describe('centsToDollars', () => {
  describe('[A] Happy Path', () => {
    it('converts 12345 cents to 123.45 dollars', () => {
      expect(centsToDollars(12345)).toBe(123.45);
    });

    it('converts 100 cents to 1 dollar', () => {
      expect(centsToDollars(100)).toBe(1);
    });

    it('converts 99 cents to 0.99 dollars', () => {
      expect(centsToDollars(99)).toBe(0.99);
    });
  });

  describe('[B] Edge Cases', () => {
    it('converts 0 cents to 0 dollars', () => {
      expect(centsToDollars(0)).toBe(0);
    });

    it('handles negative cents', () => {
      expect(centsToDollars(-500)).toBe(-5);
    });

    it('handles very large values', () => {
      const largeCents = 999999999999;
      expect(centsToDollars(largeCents)).toBe(9999999999.99);
    });

    it('handles MAX_SAFE_INTEGER', () => {
      const result = centsToDollars(Number.MAX_SAFE_INTEGER);
      expect(typeof result).toBe('number');
      expect(isFinite(result)).toBe(true);
    });
  });
});

// ============================================
// dollarsToCents Extended Tests
// ============================================

describe('dollarsToCents Extended', () => {
  describe('[B] Floating Point Precision', () => {
    it('handles 19.99 correctly (should be 1999)', () => {
      expect(dollarsToCents(19.99)).toBe(1999);
    });

    it('handles 0.01 correctly', () => {
      expect(dollarsToCents(0.01)).toBe(1);
    });

    it('handles 0.10 correctly', () => {
      expect(dollarsToCents(0.1)).toBe(10);
    });

    it('handles 123.45 correctly', () => {
      expect(dollarsToCents(123.45)).toBe(12345);
    });

    it('rounds 0.999 to 100 cents', () => {
      expect(dollarsToCents(0.999)).toBe(100);
    });

    it('rounds 0.994 to 99 cents', () => {
      expect(dollarsToCents(0.994)).toBe(99);
    });

    it('handles floating point edge case 0.07', () => {
      expect(dollarsToCents(0.07)).toBe(7);
    });
  });
});

// ============================================
// formatCurrency Extended Tests
// ============================================

describe('formatCurrency Extended', () => {
  describe('[B] Edge Cases', () => {
    it('formats negative cents', () => {
      const result = formatCurrency(-500);
      expect(result).toContain('5.00');
      expect(result).toContain('-');
    });

    it('formats zero cents', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats very large amounts', () => {
      const result = formatCurrency(99999999);
      expect(result).toContain('999,999.99');
    });

    it('formats single cent', () => {
      expect(formatCurrency(1)).toBe('$0.01');
    });

    it('formats amounts with comma separators', () => {
      expect(formatCurrency(100000)).toBe('$1,000.00');
    });
  });
});
