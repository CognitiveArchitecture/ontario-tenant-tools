/**
 * Ontario Tenant Tools - Section 82 Deposit Calculator
 *
 * Calculates estimated deposit required to raise maintenance/repair
 * issues as a defense at an eviction hearing under Section 82 of the RTA.
 *
 * IMPORTANT: The deposit requirement is in DRAFT regulatory status.
 * See legal/REGULATORY_GAPS.md for current status.
 */

import type { Section82Calculation, RegulatoryStatus, Cents } from '../core/types';
import { dollarsToCents, formatCurrency } from '../core/types';

// ============================================
// Regulatory Configuration
// ============================================

/**
 * Current regulatory status for Section 82 deposit requirement.
 * See REGULATORY_GAPS.md item #3.
 *
 * UPDATE THIS when regulation is confirmed.
 */
const SECTION_82_STATUS: RegulatoryStatus = 'draft';

/**
 * Implied deposit percentage from Bill 60 analysis.
 * NOT YET CONFIRMED by regulation.
 */
const DEPOSIT_PERCENTAGE = 0.5; // 50%

/**
 * Minimum deposit amount (if any). Not yet defined.
 */
const MINIMUM_DEPOSIT: Cents | undefined = undefined;

// ============================================
// Section 82 Deposit Calculator
// ============================================

/**
 * Calculate the estimated deposit required to raise Section 82 defenses.
 *
 * Section 82 allows tenants to raise maintenance and repair issues as a
 * defense or set-off at an eviction hearing for non-payment of rent.
 * Bill 60 introduced a deposit requirement to use this defense.
 *
 * WARNING: The exact deposit amount is in DRAFT regulatory status.
 *
 * @param arrearsAmount - Total rent arrears claimed in cents
 * @returns Section82Calculation with estimated deposit and warnings
 */
export function calculateSection82Deposit(
  arrearsAmount: Cents
): Section82Calculation {
  const warnings: string[] = [];

  // Always add regulatory uncertainty warning
  warnings.push(
    `IMPORTANT: The deposit requirement is NOT YET CONFIRMED. Bill 60 implies ${(DEPOSIT_PERCENTAGE * 100).toFixed(0)}% but regulations have not been finalized. Check with the LTB or a legal clinic before relying on this estimate.`
  );

  // Calculate deposit
  let depositRequired = Math.round(arrearsAmount * DEPOSIT_PERCENTAGE);

  // Apply minimum if defined
  if (MINIMUM_DEPOSIT !== undefined && depositRequired < MINIMUM_DEPOSIT) {
    depositRequired = MINIMUM_DEPOSIT;
    warnings.push(
      `A minimum deposit of ${formatCurrency(MINIMUM_DEPOSIT)} may apply regardless of arrears amount.`
    );
  }

  // Add contextual warnings
  if (arrearsAmount > 0) {
    warnings.push(
      `To raise maintenance issues at your hearing, you may need to pay ${formatCurrency(depositRequired)} into trust with the LTB.`
    );
    warnings.push(
      `If you cannot afford the deposit, contact a community legal clinic immediately. Some exceptions may apply.`
    );
  }

  warnings.push(
    `Section 82 requires ADVANCE WRITTEN NOTICE to the landlord. The timeline for this notice is also not yet defined—monitor LTB Rules of Practice.`
  );

  return {
    arrearsAmount,
    depositRequired,
    depositPercentage: DEPOSIT_PERCENTAGE,
    regulatoryStatus: SECTION_82_STATUS,
    warnings,
  };
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate Section 82 deposit from dollar amount (UI helper)
 */
export function calculateSection82DepositFromDollars(
  arrearsAmountDollars: number
): Section82Calculation {
  return calculateSection82Deposit(dollarsToCents(arrearsAmountDollars));
}

/**
 * Get current regulatory status for Section 82 deposit
 */
export function getSection82RegulatoryStatus(): RegulatoryStatus {
  return SECTION_82_STATUS;
}

/**
 * Get current deposit percentage (for display)
 */
export function getSection82DepositPercentage(): number {
  return DEPOSIT_PERCENTAGE;
}

/**
 * Check if Section 82 rules are confirmed
 */
export function isSection82Confirmed(): boolean {
  return SECTION_82_STATUS === 'confirmed';
}

// ============================================
// Plain Text Output
// ============================================

/**
 * Generate plain-text summary of Section 82 deposit calculation
 */
export function generateSection82Summary(
  calculation: Section82Calculation
): string {
  const lines: string[] = [];
  const today = new Date().toISOString().split('T')[0];

  lines.push('--- SECTION 82 DEPOSIT ESTIMATE ---');
  lines.push(`Generated: ${today}`);
  lines.push(`Tool: Ontario Tenant Tools (NOT LEGAL ADVICE)`);
  lines.push('');

  // Prominent uncertainty warning
  lines.push('⚠️  REGULATORY STATUS: ' + calculation.regulatoryStatus.toUpperCase());
  lines.push('    This estimate may change when regulations are finalized.');
  lines.push('');

  lines.push('CALCULATION:');
  lines.push(`Arrears Amount:     ${formatCurrency(calculation.arrearsAmount)}`);
  lines.push(
    `Deposit Percentage: ${(calculation.depositPercentage * 100).toFixed(0)}% (implied, not confirmed)`
  );
  lines.push(`Estimated Deposit:  ${formatCurrency(calculation.depositRequired)}`);
  lines.push('');

  lines.push('WHAT IS SECTION 82?');
  lines.push(
    'Section 82 of the RTA lets you raise maintenance/repair issues'
  );
  lines.push('as a defense or set-off at an eviction hearing for unpaid rent.');
  lines.push(
    'Bill 60 added a deposit requirement to use this defense.'
  );
  lines.push('');

  if (calculation.warnings.length > 0) {
    lines.push('IMPORTANT WARNINGS:');
    for (const warning of calculation.warnings) {
      lines.push(`• ${warning}`);
    }
    lines.push('');
  }

  lines.push('NEXT STEPS:');
  lines.push('1. Confirm deposit amount with LTB or legal clinic');
  lines.push('2. Send advance written notice to landlord (timeline TBD)');
  lines.push('3. Document all maintenance issues with photos/records');
  lines.push('4. Gather evidence: repair requests, landlord responses');
  lines.push('');

  lines.push('RESOURCES:');
  lines.push('• Community Legal Clinic: Find your local clinic at clcj.ca');
  lines.push('• LTB: tribunalsontario.ca/ltb');
  lines.push('• Steps to Justice: stepstojustice.ca');
  lines.push('');

  lines.push('DISCLAIMER: This estimate is for information only.');
  lines.push('Rules may change. Get legal advice for your situation.');
  lines.push('');
  lines.push('--- END OF SUMMARY ---');

  return lines.join('\n');
}
