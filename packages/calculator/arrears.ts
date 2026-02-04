/**
 * Ontario Tenant Tools - Rent Arrears Calculator
 * 
 * Calculates rent owed using FIFO (First-In-First-Out) accounting.
 * Segregates late fees from rent for defense purposes.
 */

import type {
  Payment,
  Charge,
  LedgerEntry,
  ArrearsCalculation,
  ArrearsWarning,
  Cents,
} from '../core/types';
import { dollarsToCents, formatCurrency } from '../core/types';

// ============================================
// FIFO Arrears Calculator
// ============================================

/**
 * Calculate rent arrears using FIFO accounting
 * 
 * FIFO means oldest charges are paid first. This is the standard
 * in most Ontario eviction proceedings.
 * 
 * @param charges - Array of charges (rent, fees, etc.)
 * @param payments - Array of payments made
 * @returns ArrearsCalculation with ledger, totals, and warnings
 */
export function calculateArrears(
  charges: Charge[],
  payments: Payment[]
): ArrearsCalculation {
  // Combine and sort all transactions by date
  const transactions = [
    ...charges.map(c => ({ ...c, isCharge: true as const })),
    ...payments.map(p => ({ ...p, isCharge: false as const, type: 'payment' as const })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const entries: LedgerEntry[] = [];
  const warnings: ArrearsWarning[] = [];
  
  let runningBalance = 0;
  let totalCharges = 0;
  let totalPayments = 0;
  let lateFeeTotal = 0;
  let rentChargesTotal = 0;

  for (const tx of transactions) {
    if (tx.isCharge) {
      const charge = tx as Charge;
      totalCharges += charge.amount;
      runningBalance += charge.amount;

      if (charge.type === 'late_fee') {
        lateFeeTotal += charge.amount;
        
        // Check for potentially illegal late fees
        // Ontario: Late fees must be in lease and reasonable
        if (charge.amount > dollarsToCents(50)) {
          warnings.push({
            type: 'illegal_late_fee',
            message: `Late fee on ${charge.date} (${formatCurrency(charge.amount)}) may exceed legal limits. Ontario courts often find fees over $50 unreasonable.`,
          });
        }
      } else if (charge.type === 'rent') {
        rentChargesTotal += charge.amount;
      }

      entries.push({
        date: charge.date,
        description: charge.description || `${charge.type}: ${charge.period || ''}`.trim(),
        charge: charge.amount,
        payment: 0,
        balance: runningBalance,
      });
    } else {
      const payment = tx as Payment;
      totalPayments += payment.amount;
      runningBalance -= payment.amount;

      entries.push({
        date: payment.date,
        description: payment.description || 'Payment received',
        charge: 0,
        payment: payment.amount,
        balance: runningBalance,
      });
    }
  }

  // Calculate rent-only balance (excluding late fees)
  // This is important because N4 notices should only claim rent, not fees
  const rentOnly = Math.max(0, rentChargesTotal - totalPayments + lateFeeTotal);

  // Warning if landlord may be misapplying payments to fees first
  if (lateFeeTotal > 0 && runningBalance > 0) {
    warnings.push({
      type: 'misapplied_payment',
      message: `Your payments should be applied to RENT first, not late fees. The landlord may only claim ${formatCurrency(rentOnly)} in rent arrears on an N4 notice.`,
    });
  }

  // Warning about the 7-day deadline
  if (runningBalance > 0) {
    warnings.push({
      type: 'calculation_note',
      message: `Bill 60 (2025): You have only 7 BUSINESS DAYS to pay arrears after receiving an N4 notice. This is shorter than the previous 14-day period.`,
    });
  }

  return {
    entries,
    totalCharges,
    totalPayments,
    currentBalance: runningBalance,
    lateFeeTotal,
    rentOnly: Math.max(0, runningBalance - lateFeeTotal),
    warnings,
  };
}

// ============================================
// Plain Text Output (Clinic-Friendly)
// ============================================

/**
 * Generate plain-text ledger summary for clipboard/CMS
 */
export function generateLedgerText(calculation: ArrearsCalculation): string {
  const lines: string[] = [];
  const today = new Date().toISOString().split('T')[0];

  lines.push('--- RENT CALCULATION SUMMARY ---');
  lines.push(`Generated: ${today}`);
  lines.push(`Tool: Ontario Tenant Tools (NOT LEGAL ADVICE)`);
  lines.push('');
  lines.push('LEDGER:');
  lines.push('-'.repeat(60));
  lines.push('Date       | Description                | Charge    | Payment   | Balance');
  lines.push('-'.repeat(60));

  for (const entry of calculation.entries) {
    const date = entry.date.padEnd(10);
    const desc = entry.description.substring(0, 26).padEnd(26);
    const charge = entry.charge > 0 ? formatCurrency(entry.charge).padStart(9) : '         ';
    const payment = entry.payment > 0 ? formatCurrency(entry.payment).padStart(9) : '         ';
    const balance = formatCurrency(entry.balance).padStart(9);
    
    lines.push(`${date} | ${desc} | ${charge} | ${payment} | ${balance}`);
  }

  lines.push('-'.repeat(60));
  lines.push('');
  lines.push('SUMMARY:');
  lines.push(`Total Charges:     ${formatCurrency(calculation.totalCharges)}`);
  lines.push(`Total Payments:    ${formatCurrency(calculation.totalPayments)}`);
  lines.push(`Current Balance:   ${formatCurrency(calculation.currentBalance)}`);
  lines.push('');
  
  if (calculation.lateFeeTotal > 0) {
    lines.push('BREAKDOWN:');
    lines.push(`Late Fees Charged: ${formatCurrency(calculation.lateFeeTotal)}`);
    lines.push(`Rent Only Owed:    ${formatCurrency(calculation.rentOnly)}`);
    lines.push('');
    lines.push('NOTE: N4 notices should only claim RENT, not late fees.');
    lines.push('');
  }

  if (calculation.warnings.length > 0) {
    lines.push('WARNINGS:');
    for (const warning of calculation.warnings) {
      lines.push(`• ${warning.message}`);
    }
    lines.push('');
  }

  lines.push('DISCLAIMER: This calculation is for information only.');
  lines.push('Verify all figures. Get legal advice for your situation.');
  lines.push('');
  lines.push('--- END OF SUMMARY ---');

  return lines.join('\n');
}

// ============================================
// Input Validation
// ============================================

/**
 * Validate charge input
 */
export function validateCharge(charge: Partial<Charge>): string[] {
  const errors: string[] = [];

  if (!charge.date || !/^\d{4}-\d{2}-\d{2}$/.test(charge.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD.');
  }

  if (typeof charge.amount !== 'number' || charge.amount < 0) {
    errors.push('Amount must be a positive number.');
  }

  if (!charge.type || !['rent', 'late_fee', 'utility', 'other'].includes(charge.type)) {
    errors.push('Type must be: rent, late_fee, utility, or other.');
  }

  return errors;
}

/**
 * Validate payment input
 */
export function validatePayment(payment: Partial<Payment>): string[] {
  const errors: string[] = [];

  if (!payment.date || !/^\d{4}-\d{2}-\d{2}$/.test(payment.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD.');
  }

  if (typeof payment.amount !== 'number' || payment.amount < 0) {
    errors.push('Amount must be a positive number.');
  }

  return errors;
}

// ============================================
// Helper: Convert dollar inputs to cents
// ============================================

/**
 * Create a charge from dollar amount (UI helper)
 */
export function createChargeFromDollars(
  date: string,
  amountDollars: number,
  type: Charge['type'],
  description?: string,
  period?: string
): Charge {
  return {
    date,
    amount: dollarsToCents(amountDollars),
    type,
    description,
    period,
  };
}

/**
 * Create a payment from dollar amount (UI helper)
 */
export function createPaymentFromDollars(
  date: string,
  amountDollars: number,
  description?: string
): Payment {
  return {
    date,
    amount: dollarsToCents(amountDollars),
    description,
  };
}
