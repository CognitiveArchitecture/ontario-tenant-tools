/**
 * Ontario Tenant Tools - Date Calculation Utilities
 *
 * Core functions for calculating deadlines under the RTA.
 * Updated for Bill 60 (November 2025).
 */

import type {
  JudicialCalendar,
  N4Calculation,
  N12Calculation,
  ReviewDeadline,
  Holiday,
} from './types';

import calendarData from './calendar.json';

const calendar = calendarData as JudicialCalendar;

// ============================================
// Core Date Utilities
// ============================================

/**
 * Parse ISO date string to Date object (midnight local time)
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return new Date(year, month - 1, day);
}

/**
 * Format Date to ISO string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Get statutory holidays for a given year
 */
export function getHolidaysForYear(year: number): Holiday[] {
  const yearStr = String(year);
  return calendar.statutory_holidays[yearStr] || [];
}

/**
 * Check if a date is a statutory holiday
 */
export function isStatutoryHoliday(date: Date): Holiday | null {
  const dateStr = formatDate(date);
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);

  return holidays.find((h) => h.date === dateStr) || null;
}

/**
 * Check if a date is a business day (not weekend, not holiday)
 */
export function isBusinessDay(date: Date): boolean {
  if (isWeekend(date)) return false;
  if (isStatutoryHoliday(date)) return false;
  return true;
}

/**
 * Get reason why a date is not a business day
 */
export function getNonBusinessDayReason(date: Date): string | null {
  if (isWeekend(date)) {
    return date.getDay() === 0 ? 'Sunday' : 'Saturday';
  }
  const holiday = isStatutoryHoliday(date);
  if (holiday) {
    return holiday.name;
  }
  return null;
}

// ============================================
// N4 Notice Calculations (Bill 60: 7 days)
// ============================================

/**
 * Calculate N4 notice deadlines
 *
 * Bill 60 Change: Reduced cure period from 14 to 7 BUSINESS days.
 *
 * @param servedDate - Date the N4 notice was served (YYYY-MM-DD)
 * @returns N4Calculation with all relevant deadlines
 */
export function calculateN4Deadline(servedDate: string): N4Calculation {
  const served = parseDate(servedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const CURE_DAYS = 7; // Bill 60 change

  let businessDaysCount = 0;
  let current = addDays(served, 1); // Start counting from day after service
  const skippedDays: Array<{ date: string; reason: string }> = [];

  while (businessDaysCount < CURE_DAYS) {
    if (isBusinessDay(current)) {
      businessDaysCount++;
    } else {
      const reason = getNonBusinessDayReason(current);
      if (reason) {
        skippedDays.push({ date: formatDate(current), reason });
      }
    }

    if (businessDaysCount < CURE_DAYS) {
      current = addDays(current, 1);
    }
  }

  const cureDeadline = current;
  const canFileL1Date = addDays(cureDeadline, 1);

  // Calculate days remaining
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.ceil((cureDeadline.getTime() - today.getTime()) / msPerDay);

  return {
    servedDate,
    cureDeadline: formatDate(cureDeadline),
    canFileL1Date: formatDate(canFileL1Date),
    daysRemaining: Math.max(0, daysRemaining),
    isExpired: today > cureDeadline,
    workdaysSkipped: skippedDays,
  };
}

// ============================================
// N12 Notice Calculations (Bill 60: 120-day option)
// ============================================

/**
 * Calculate N12 notice deadlines
 *
 * Bill 60 Change: If landlord gives 120 days notice, no compensation required.
 *
 * @param servedDate - Date the N12 notice was served (YYYY-MM-DD)
 * @param noticeDays - Either 60 (standard) or 120 (no compensation)
 * @param monthlyRent - Monthly rent in cents (for compensation calculation)
 * @returns N12Calculation with termination date and compensation info
 */
export function calculateN12Deadline(
  servedDate: string,
  noticeDays: 60 | 120,
  monthlyRent: number
): N12Calculation {
  const served = parseDate(servedDate);
  const termination = addDays(served, noticeDays);

  const warnings: string[] = [];

  // Compensation only required for 60-day notice (Bill 60)
  const compensationRequired = noticeDays === 60;
  const compensationAmount = compensationRequired ? monthlyRent : 0;

  if (noticeDays === 120) {
    warnings.push(
      'Bill 60 (2025): No compensation required when landlord provides 120 days notice.'
    );
  }

  return {
    servedDate,
    terminationDate: formatDate(termination),
    noticeDays,
    compensationRequired,
    compensationAmount,
    warnings,
  };
}

// ============================================
// Review Period Calculations (Bill 60: 15 days)
// ============================================

/**
 * Calculate Request for Review deadline
 *
 * Bill 60 Change: Reduced from 30 to 15 CALENDAR days.
 *
 * @param orderDate - Date the LTB order was issued (YYYY-MM-DD)
 * @returns ReviewDeadline with deadline info
 */
export function calculateReviewDeadline(orderDate: string): ReviewDeadline {
  const order = parseDate(orderDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const REVIEW_DAYS = 15; // Bill 60 change (was 30)

  const deadline = addDays(order, REVIEW_DAYS);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / msPerDay);

  const warnings: string[] = [];

  if (daysRemaining <= 5 && daysRemaining > 0) {
    warnings.push(`URGENT: Only ${daysRemaining} days left to file Request for Review.`);
  }

  if (daysRemaining <= 0) {
    warnings.push('The deadline to file a Request for Review has passed.');
  }

  // Note the Bill 60 change
  warnings.push('Bill 60 (2025): Review period reduced from 30 to 15 days. Act quickly.');

  return {
    orderDate,
    deadline: formatDate(deadline),
    daysRemaining: Math.max(0, daysRemaining),
    isExpired: today > deadline,
    warnings,
  };
}

// ============================================
// General Deadline Utilities
// ============================================

/**
 * Calculate business days between two dates
 */
export function businessDaysBetween(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  let count = 0;
  let current = addDays(start, 1);

  while (current <= end) {
    if (isBusinessDay(current)) {
      count++;
    }
    current = addDays(current, 1);
  }

  return count;
}

/**
 * Calculate calendar days between two dates
 */
export function calendarDaysBetween(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
}

/**
 * Get today's date as ISO string
 */
export function getTodayISO(): string {
  return formatDate(new Date());
}

/**
 * Check if a date string is valid
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const date = parseDate(dateStr);
  return !isNaN(date.getTime());
}

// ============================================
// Export calendar data for UI access
// ============================================

export { calendar };
