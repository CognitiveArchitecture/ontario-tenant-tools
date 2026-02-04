/**
 * Ontario Tenant Tools - Session State Manager
 *
 * Manages ephemeral session data across views for report generation.
 * Data is stored in memory only (not persisted) for privacy.
 */

export interface CalculationRecord {
  tool: string;
  timestamp: number;
  inputs: Record<string, string | number>;
  result: Record<string, unknown>;
}

export interface SessionState {
  calculations: CalculationRecord[];
}

// In-memory session state (cleared on page reload)
const state: SessionState = {
  calculations: [],
};

/**
 * Record a calculation result for the session report.
 */
export function recordCalculation(
  tool: string,
  inputs: Record<string, string | number>,
  result: Record<string, unknown>
): void {
  // Remove any existing record for this tool (keep only latest)
  state.calculations = state.calculations.filter((c) => c.tool !== tool);

  state.calculations.push({
    tool,
    timestamp: Date.now(),
    inputs,
    result,
  });
}

/**
 * Get all recorded calculations.
 */
export function getCalculations(): CalculationRecord[] {
  return [...state.calculations];
}

/**
 * Get a specific calculation by tool name.
 */
export function getCalculation(tool: string): CalculationRecord | undefined {
  return state.calculations.find((c) => c.tool === tool);
}

/**
 * Check if any calculations have been recorded.
 */
export function hasCalculations(): boolean {
  return state.calculations.length > 0;
}

/**
 * Clear all session data (called by Quick Exit).
 */
export function clearSession(): void {
  state.calculations = [];
}

/**
 * Get session data formatted for the report.
 */
export function getReportData(): Array<{ label: string; value: string; tool: string }> {
  const data: Array<{ label: string; value: string; tool: string }> = [];

  for (const calc of state.calculations) {
    switch (calc.tool) {
      case 'n4':
        if (calc.inputs['servedDate']) {
          data.push({
            tool: 'n4',
            label: 'N4 Notice Received',
            value: formatDate(calc.inputs['servedDate'] as string),
          });
        }
        if (calc.result['cureDeadline']) {
          data.push({
            tool: 'n4',
            label: 'N4 Cure Deadline',
            value: formatDate(calc.result['cureDeadline'] as string),
          });
        }
        break;

      case 'review':
        if (calc.inputs['orderDate']) {
          data.push({
            tool: 'review',
            label: 'Eviction Order Date',
            value: formatDate(calc.inputs['orderDate'] as string),
          });
        }
        if (calc.result['deadline']) {
          data.push({
            tool: 'review',
            label: 'Review Deadline',
            value: formatDate(calc.result['deadline'] as string),
          });
        }
        break;

      case 'rent':
        if (calc.inputs['currentRent']) {
          data.push({
            tool: 'rent',
            label: 'Current Rent',
            value: formatCurrency(calc.inputs['currentRent'] as number),
          });
        }
        if (calc.inputs['proposedRent']) {
          data.push({
            tool: 'rent',
            label: 'Proposed Rent',
            value: formatCurrency(calc.inputs['proposedRent'] as number),
          });
        }
        if (calc.result['isLegal'] !== undefined) {
          data.push({
            tool: 'rent',
            label: 'Rent Increase Status',
            value: calc.result['isLegal'] ? 'Within Guideline' : 'Exceeds Guideline',
          });
        }
        break;

      case 'n12':
        if (calc.inputs['noticeDate']) {
          data.push({
            tool: 'n12',
            label: 'N12 Notice Date',
            value: formatDate(calc.inputs['noticeDate'] as string),
          });
        }
        if (calc.inputs['terminationDate']) {
          data.push({
            tool: 'n12',
            label: 'Termination Date',
            value: formatDate(calc.inputs['terminationDate'] as string),
          });
        }
        if (calc.result['compensationRequired'] !== undefined) {
          data.push({
            tool: 'n12',
            label: 'Compensation',
            value: calc.result['compensationRequired']
              ? `Owed: ${formatCurrency(calc.result['compensationAmount'] as number)}`
              : 'Not Required (120+ days notice)',
          });
        }
        break;

      case 's82':
        if (calc.inputs['arrearsAmount']) {
          data.push({
            tool: 's82',
            label: 'Arrears Amount',
            value: formatCurrency(calc.inputs['arrearsAmount'] as number),
          });
        }
        if (calc.result['depositRequired']) {
          data.push({
            tool: 's82',
            label: 'Estimated S82 Deposit',
            value: `${formatCurrency(calc.result['depositRequired'] as number)} (DRAFT - may change)`,
          });
        }
        break;
    }
  }

  return data;
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T12:00:00');
    return date.toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

function formatCurrency(cents: number): string {
  // Handle both cents (large numbers) and dollars (small numbers)
  const dollars = cents > 1000 ? cents / 100 : cents;
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(dollars);
}
