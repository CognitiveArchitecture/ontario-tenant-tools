/**
 * Ontario Tenant Tools - Rent Increase Calculator
 *
 * Validates rent increases against Ontario's annual guideline.
 * Detects exemptions and calculates overages.
 */

import type { RentIncreaseCalculation, Cents } from '../core/types';
import { dollarsToCents, formatCurrency } from '../core/types';

// ============================================
// Guideline Rates by Year
// ============================================

/**
 * Ontario rent increase guidelines by year.
 * Source: Ontario Ministry of Municipal Affairs and Housing
 */
const GUIDELINE_RATES: Record<number, number> = {
  2023: 0.025, // 2.5%
  2024: 0.025, // 2.5%
  2025: 0.025, // 2.5%
  2026: 0.025, // 2.5% (projected, confirm when announced)
};

/**
 * Units first occupied after this date are exempt from rent control.
 * O. Reg 340/21 under the Residential Tenancies Act
 */
const RENT_CONTROL_EXEMPTION_DATE = '2018-11-15';

// ============================================
// Rent Increase Calculator
// ============================================

/**
 * Calculate whether a rent increase is legal under Ontario guidelines.
 *
 * @param currentRent - Current monthly rent in cents
 * @param proposedRent - Proposed new monthly rent in cents
 * @param guidelineYear - The year to use for guideline rate (default: current year)
 * @param firstOccupiedDate - ISO date when unit was first occupied (for exemption check)
 * @returns RentIncreaseCalculation with legality determination and warnings
 */
export function calculateRentIncrease(
  currentRent: Cents,
  proposedRent: Cents,
  guidelineYear?: number,
  firstOccupiedDate?: string
): RentIncreaseCalculation {
  const warnings: string[] = [];
  const year = guidelineYear ?? new Date().getFullYear();

  // Get guideline rate for the year
  const guidelineRate = GUIDELINE_RATES[year];
  if (guidelineRate === undefined) {
    warnings.push(
      `Guideline rate for ${year} not yet confirmed. Using most recent known rate.`
    );
  }
  const rate = guidelineRate ?? 0.025; // Default to 2.5% if unknown

  // Check if unit is exempt from rent control
  const exemptFromGuideline = isExemptFromRentControl(firstOccupiedDate);
  if (exemptFromGuideline) {
    warnings.push(
      `This unit may be EXEMPT from rent control. Units first occupied after November 15, 2018 are not subject to the annual guideline. Verify your unit's first occupancy date.`
    );
  }

  // Calculate maximum allowed increase
  const maximumAllowed = Math.round(currentRent * (1 + rate));

  // Determine legality
  const isLegal = exemptFromGuideline || proposedRent <= maximumAllowed;
  const overageAmount = isLegal ? 0 : proposedRent - maximumAllowed;

  // Add contextual warnings
  if (!isLegal && !exemptFromGuideline) {
    warnings.push(
      `The proposed increase exceeds the ${year} guideline of ${(rate * 100).toFixed(1)}%. Maximum allowed: ${formatCurrency(maximumAllowed)}. Overage: ${formatCurrency(overageAmount)}.`
    );
    warnings.push(
      `You can refuse to pay the illegal portion. The landlord must apply to the LTB for an Above Guideline Increase (AGI) if they want to charge more.`
    );
  }

  if (isLegal && !exemptFromGuideline && proposedRent > currentRent) {
    warnings.push(
      `The increase is within the ${year} guideline. Ensure you received proper written notice at least 90 days before the increase takes effect.`
    );
  }

  return {
    currentRent,
    proposedRent,
    guidelineYear: year,
    guidelineRate: rate,
    maximumAllowed,
    isLegal,
    overageAmount,
    exemptFromGuideline,
    warnings,
  };
}

// ============================================
// Exemption Check
// ============================================

/**
 * Check if a unit is exempt from rent control based on first occupancy date.
 *
 * Per O. Reg 340/21: Units in buildings first occupied for residential
 * purposes after November 15, 2018 are not subject to rent control.
 *
 * @param firstOccupiedDate - ISO date string (YYYY-MM-DD) or undefined
 * @returns true if exempt, false if subject to rent control, false if unknown
 */
export function isExemptFromRentControl(firstOccupiedDate?: string): boolean {
  if (!firstOccupiedDate) {
    return false; // Assume subject to rent control if unknown
  }

  // Parse dates for comparison
  const occupiedDate = new Date(firstOccupiedDate);
  const exemptionDate = new Date(RENT_CONTROL_EXEMPTION_DATE);

  return occupiedDate > exemptionDate;
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate rent increase from dollar amounts (UI helper)
 */
export function calculateRentIncreaseFromDollars(
  currentRentDollars: number,
  proposedRentDollars: number,
  guidelineYear?: number,
  firstOccupiedDate?: string
): RentIncreaseCalculation {
  return calculateRentIncrease(
    dollarsToCents(currentRentDollars),
    dollarsToCents(proposedRentDollars),
    guidelineYear,
    firstOccupiedDate
  );
}

/**
 * Get the guideline rate for a specific year
 */
export function getGuidelineRate(year: number): number | undefined {
  return GUIDELINE_RATES[year];
}

/**
 * Get all known guideline rates
 */
export function getAllGuidelineRates(): Record<number, number> {
  return { ...GUIDELINE_RATES };
}

// ============================================
// Plain Text Output
// ============================================

/**
 * Generate plain-text summary of rent increase calculation
 */
export function generateRentIncreaseSummary(
  calculation: RentIncreaseCalculation
): string {
  const lines: string[] = [];
  const today = new Date().toISOString().split('T')[0];

  lines.push('--- RENT INCREASE CALCULATION ---');
  lines.push(`Generated: ${today}`);
  lines.push(`Tool: Ontario Tenant Tools (NOT LEGAL ADVICE)`);
  lines.push('');
  lines.push('AMOUNTS:');
  lines.push(`Current Rent:     ${formatCurrency(calculation.currentRent)}`);
  lines.push(`Proposed Rent:    ${formatCurrency(calculation.proposedRent)}`);
  lines.push(`Maximum Allowed:  ${formatCurrency(calculation.maximumAllowed)}`);
  lines.push('');
  lines.push('GUIDELINE:');
  lines.push(`Year:             ${calculation.guidelineYear}`);
  lines.push(
    `Rate:             ${(calculation.guidelineRate * 100).toFixed(1)}%`
  );
  lines.push('');
  lines.push('RESULT:');

  if (calculation.exemptFromGuideline) {
    lines.push(`Status:           EXEMPT FROM RENT CONTROL`);
    lines.push(
      `Note:             Unit first occupied after Nov 15, 2018`
    );
  } else if (calculation.isLegal) {
    lines.push(`Status:           LEGAL (within guideline)`);
  } else {
    lines.push(`Status:           POTENTIALLY ILLEGAL`);
    lines.push(`Overage:          ${formatCurrency(calculation.overageAmount)}`);
  }

  lines.push('');

  if (calculation.warnings.length > 0) {
    lines.push('WARNINGS:');
    for (const warning of calculation.warnings) {
      lines.push(`• ${warning}`);
    }
    lines.push('');
  }

  lines.push('DISCLAIMER: This calculation is for information only.');
  lines.push('Verify all figures. Get legal advice for your situation.');
  lines.push('');
  lines.push('--- END OF SUMMARY ---');

  return lines.join('\n');
}
