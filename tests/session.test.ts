/**
 * Ontario Tenant Tools - Session State Manager Tests
 *
 * Unit tests for the ephemeral session state manager used for report generation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordCalculation,
  getCalculations,
  getCalculation,
  hasCalculations,
  clearSession,
  getReportData,
} from '../src/utils/session';

// ============================================
// Test Setup
// ============================================

beforeEach(() => {
  clearSession();
});

// ============================================
// recordCalculation() Tests
// ============================================

describe('recordCalculation', () => {
  it('stores a calculation with the correct tool name', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, { cureDeadline: '2025-12-10' });

    const calc = getCalculation('n4');
    expect(calc).toBeDefined();
    expect(calc?.tool).toBe('n4');
  });

  it('stores inputs correctly', () => {
    const inputs = { servedDate: '2025-12-01', deliveryMethod: 'mail' };
    recordCalculation('n4', inputs, {});

    const calc = getCalculation('n4');
    expect(calc?.inputs).toEqual(inputs);
  });

  it('stores results correctly', () => {
    const result = { cureDeadline: '2025-12-10', canFileL1Date: '2025-12-11' };
    recordCalculation('n4', {}, result);

    const calc = getCalculation('n4');
    expect(calc?.result).toEqual(result);
  });

  it('overwrites existing calculation for the same tool', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, { cureDeadline: '2025-12-10' });
    recordCalculation('n4', { servedDate: '2025-12-15' }, { cureDeadline: '2025-12-24' });

    const calculations = getCalculations();
    expect(calculations.length).toBe(1);
    expect(calculations[0]?.inputs.servedDate).toBe('2025-12-15');
  });

  it('adds a timestamp to each calculation', () => {
    const before = Date.now();
    recordCalculation('n4', {}, {});
    const after = Date.now();

    const calc = getCalculation('n4');
    expect(calc?.timestamp).toBeGreaterThanOrEqual(before);
    expect(calc?.timestamp).toBeLessThanOrEqual(after);
  });

  it('stores multiple different tools without interference', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, {});
    recordCalculation('rent', { currentRent: 1500 }, {});
    recordCalculation('review', { orderDate: '2025-12-01' }, {});

    const calculations = getCalculations();
    expect(calculations.length).toBe(3);
  });
});

// ============================================
// getCalculations() Tests
// ============================================

describe('getCalculations', () => {
  it('returns empty array when no calculations exist', () => {
    const calculations = getCalculations();
    expect(calculations).toEqual([]);
    expect(Array.isArray(calculations)).toBe(true);
  });

  it('returns all recorded calculations', () => {
    recordCalculation('n4', {}, {});
    recordCalculation('rent', {}, {});
    recordCalculation('n12', {}, {});

    const calculations = getCalculations();
    expect(calculations.length).toBe(3);
    expect(calculations.map((c) => c.tool)).toContain('n4');
    expect(calculations.map((c) => c.tool)).toContain('rent');
    expect(calculations.map((c) => c.tool)).toContain('n12');
  });

  it('returns a copy, not a reference to internal state', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, {});

    const calculations1 = getCalculations();
    const calculations2 = getCalculations();

    expect(calculations1).not.toBe(calculations2);
    expect(calculations1).toEqual(calculations2);

    // Mutating the returned array should not affect internal state
    calculations1.push({
      tool: 'fake',
      timestamp: Date.now(),
      inputs: {},
      result: {},
    });
    expect(getCalculations().length).toBe(1);
  });
});

// ============================================
// getCalculation() Tests
// ============================================

describe('getCalculation', () => {
  it('returns specific calculation by tool name', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, { cureDeadline: '2025-12-10' });
    recordCalculation('rent', { currentRent: 1500 }, { isLegal: true });

    const n4Calc = getCalculation('n4');
    expect(n4Calc?.tool).toBe('n4');
    expect(n4Calc?.inputs.servedDate).toBe('2025-12-01');

    const rentCalc = getCalculation('rent');
    expect(rentCalc?.tool).toBe('rent');
    expect(rentCalc?.inputs.currentRent).toBe(1500);
  });

  it('returns undefined for non-existent tool', () => {
    recordCalculation('n4', {}, {});

    const calc = getCalculation('nonexistent');
    expect(calc).toBeUndefined();
  });
});

// ============================================
// hasCalculations() Tests
// ============================================

describe('hasCalculations', () => {
  it('returns false when session is empty', () => {
    expect(hasCalculations()).toBe(false);
  });

  it('returns true when calculations exist', () => {
    recordCalculation('n4', {}, {});
    expect(hasCalculations()).toBe(true);
  });

  it('returns true with multiple calculations', () => {
    recordCalculation('n4', {}, {});
    recordCalculation('rent', {}, {});
    expect(hasCalculations()).toBe(true);
  });
});

// ============================================
// clearSession() Tests
// ============================================

describe('clearSession', () => {
  it('removes all calculations', () => {
    recordCalculation('n4', {}, {});
    recordCalculation('rent', {}, {});
    recordCalculation('review', {}, {});

    clearSession();

    expect(getCalculations().length).toBe(0);
  });

  it('results in hasCalculations returning false', () => {
    recordCalculation('n4', {}, {});
    expect(hasCalculations()).toBe(true);

    clearSession();

    expect(hasCalculations()).toBe(false);
  });
});

// ============================================
// getReportData() Tests
// ============================================

describe('getReportData', () => {
  it('returns empty array when no calculations exist', () => {
    const data = getReportData();
    expect(data).toEqual([]);
  });

  it('formats N4 data correctly', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, { cureDeadline: '2025-12-10' });

    const data = getReportData();
    expect(data.length).toBe(2);

    const servedEntry = data.find((d) => d.label === 'N4 Notice Received');
    expect(servedEntry).toBeDefined();
    expect(servedEntry?.tool).toBe('n4');

    const deadlineEntry = data.find((d) => d.label === 'N4 Cure Deadline');
    expect(deadlineEntry).toBeDefined();
    expect(deadlineEntry?.tool).toBe('n4');
  });

  it('formats N12 data correctly', () => {
    recordCalculation(
      'n12',
      { noticeDate: '2025-12-01', terminationDate: '2026-01-30' },
      { compensationRequired: true, compensationAmount: 150000 }
    );

    const data = getReportData();

    const noticeEntry = data.find((d) => d.label === 'N12 Notice Date');
    expect(noticeEntry).toBeDefined();
    expect(noticeEntry?.tool).toBe('n12');

    const terminationEntry = data.find((d) => d.label === 'Termination Date');
    expect(terminationEntry).toBeDefined();

    const compensationEntry = data.find((d) => d.label === 'Compensation');
    expect(compensationEntry).toBeDefined();
    expect(compensationEntry?.value).toContain('Owed');
  });

  it('formats rent increase data correctly', () => {
    recordCalculation('rent', { currentRent: 150000, proposedRent: 160000 }, { isLegal: false });

    const data = getReportData();

    const currentEntry = data.find((d) => d.label === 'Current Rent');
    expect(currentEntry).toBeDefined();
    expect(currentEntry?.tool).toBe('rent');

    const proposedEntry = data.find((d) => d.label === 'Proposed Rent');
    expect(proposedEntry).toBeDefined();

    const statusEntry = data.find((d) => d.label === 'Rent Increase Status');
    expect(statusEntry).toBeDefined();
    expect(statusEntry?.value).toBe('Exceeds Guideline');
  });

  it('formats review deadline data correctly', () => {
    recordCalculation('review', { orderDate: '2025-12-01' }, { deadline: '2025-12-16' });

    const data = getReportData();

    const orderEntry = data.find((d) => d.label === 'Eviction Order Date');
    expect(orderEntry).toBeDefined();
    expect(orderEntry?.tool).toBe('review');

    const deadlineEntry = data.find((d) => d.label === 'Review Deadline');
    expect(deadlineEntry).toBeDefined();
  });

  it('formats s82 data correctly', () => {
    recordCalculation('s82', { arrearsAmount: 300000 }, { depositRequired: 150000 });

    const data = getReportData();

    const arrearsEntry = data.find((d) => d.label === 'Arrears Amount');
    expect(arrearsEntry).toBeDefined();
    expect(arrearsEntry?.tool).toBe('s82');

    const depositEntry = data.find((d) => d.label === 'Estimated S82 Deposit');
    expect(depositEntry).toBeDefined();
    expect(depositEntry?.value).toContain('DRAFT');
  });

  it('includes tool identifier in each report entry', () => {
    recordCalculation('n4', { servedDate: '2025-12-01' }, {});
    recordCalculation('rent', { currentRent: 150000 }, {});

    const data = getReportData();

    for (const entry of data) {
      expect(entry.tool).toBeDefined();
      expect(typeof entry.tool).toBe('string');
    }
  });
});
