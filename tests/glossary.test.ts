/**
 * Ontario Tenant Tools - Glossary Tests
 *
 * Unit tests for legal glossary search and retrieval functions.
 */

import { describe, it, expect } from 'vitest';
import {
  glossary,
  getTermBySlug,
  getTermByName,
  searchTerms,
  getBill60Terms,
  getTermsWithWarnings,
  getRelatedTerms,
  getAllTermsSorted,
} from '../packages/glossary/terms';

// ============================================
// getTermBySlug Tests
// ============================================

describe('getTermBySlug', () => {
  it('returns term for valid slug', () => {
    const term = getTermBySlug('n4-notice');
    expect(term).toBeDefined();
    expect(term?.term).toBe('N4 Notice');
    expect(term?.slug).toBe('n4-notice');
  });

  it('returns undefined for invalid slug', () => {
    const term = getTermBySlug('nonexistent-term');
    expect(term).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    const term = getTermBySlug('');
    expect(term).toBeUndefined();
  });

  it('is case-sensitive (slug must match exactly)', () => {
    const term = getTermBySlug('N4-Notice');
    expect(term).toBeUndefined();
  });

  it('finds terms with hyphens in slug', () => {
    const term = getTermBySlug('section-82');
    expect(term).toBeDefined();
    expect(term?.term).toBe('Section 82 Defense');
  });
});

// ============================================
// getTermByName Tests
// ============================================

describe('getTermByName', () => {
  it('returns term for exact name match', () => {
    const term = getTermByName('N4 Notice');
    expect(term).toBeDefined();
    expect(term?.slug).toBe('n4-notice');
  });

  it('is case-insensitive', () => {
    const term = getTermByName('n4 notice');
    expect(term).toBeDefined();
    expect(term?.term).toBe('N4 Notice');
  });

  it('handles mixed case input', () => {
    const term = getTermByName('EVICTION');
    expect(term).toBeDefined();
    expect(term?.slug).toBe('eviction');
  });

  it('returns undefined for non-existent term', () => {
    const term = getTermByName('Fake Term That Does Not Exist');
    expect(term).toBeUndefined();
  });

  it('requires exact match (not partial)', () => {
    const term = getTermByName('N4');
    expect(term).toBeUndefined();
  });
});

// ============================================
// searchTerms Tests
// ============================================

describe('searchTerms', () => {
  it('finds terms by name match', () => {
    const results = searchTerms('N4');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((t) => t.slug === 'n4-notice')).toBe(true);
  });

  it('finds terms by definition match', () => {
    const results = searchTerms('Sheriff');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((t) => t.slug === 'sheriff')).toBe(true);
  });

  it('is case-insensitive', () => {
    const resultsLower = searchTerms('eviction');
    const resultsUpper = searchTerms('EVICTION');
    expect(resultsLower.length).toBe(resultsUpper.length);
    expect(resultsLower.length).toBeGreaterThan(0);
  });

  it('returns empty array for no matches', () => {
    const results = searchTerms('xyznonexistent123');
    expect(results).toEqual([]);
  });

  it('finds partial matches in term names', () => {
    const results = searchTerms('Notice');
    expect(results.length).toBeGreaterThanOrEqual(3);
  });

  it('finds terms by keyword in definition', () => {
    const results = searchTerms('rent');
    expect(results.length).toBeGreaterThan(5);
  });
});

// ============================================
// getBill60Terms Tests
// ============================================

describe('getBill60Terms', () => {
  it('returns only terms with bill60Change property', () => {
    const bill60Terms = getBill60Terms();
    expect(bill60Terms.length).toBeGreaterThan(0);
    expect(bill60Terms.every((t) => t.bill60Change !== undefined)).toBe(true);
  });

  it('includes known Bill 60 affected terms', () => {
    const bill60Terms = getBill60Terms();
    const slugs = bill60Terms.map((t) => t.slug);

    expect(slugs).toContain('n4-notice');
    expect(slugs).toContain('section-82');
    expect(slugs).toContain('bill-60');
  });

  it('does not include terms without Bill 60 changes', () => {
    const bill60Terms = getBill60Terms();
    const slugs = bill60Terms.map((t) => t.slug);

    expect(slugs).not.toContain('ltb');
  });

  it('returns non-empty array of Bill 60 terms', () => {
    const bill60Terms = getBill60Terms();
    expect(bill60Terms.length).toBeGreaterThanOrEqual(5);
  });
});

// ============================================
// getTermsWithWarnings Tests
// ============================================

describe('getTermsWithWarnings', () => {
  it('returns only terms with warnings array', () => {
    const warningTerms = getTermsWithWarnings();
    expect(warningTerms.length).toBeGreaterThan(0);
    expect(warningTerms.every((t) => t.warnings && t.warnings.length > 0)).toBe(true);
  });

  it('includes known terms with warnings', () => {
    const warningTerms = getTermsWithWarnings();
    const slugs = warningTerms.map((t) => t.slug);

    expect(slugs).toContain('n4-notice');
    expect(slugs).toContain('section-82');
  });

  it('excludes terms without warnings', () => {
    const warningTerms = getTermsWithWarnings();
    const slugs = warningTerms.map((t) => t.slug);

    expect(slugs).not.toContain('ltb');
  });
});

// ============================================
// getRelatedTerms Tests
// ============================================

describe('getRelatedTerms', () => {
  it('returns related terms for valid slug', () => {
    const related = getRelatedTerms('n4-notice');
    expect(related.length).toBeGreaterThan(0);
    const slugs = related.map((t) => t.slug);
    expect(slugs).toContain('eviction');
    expect(slugs).toContain('arrears');
  });

  it('returns empty array for term with no relations', () => {
    const related = getRelatedTerms('agi');
    expect(related).toEqual([]);
  });

  it('returns empty array for non-existent slug', () => {
    const related = getRelatedTerms('nonexistent-term');
    expect(related).toEqual([]);
  });

  it('handles terms gracefully', () => {
    const related = getRelatedTerms('eviction');
    expect(Array.isArray(related)).toBe(true);
  });

  it('returns actual term objects, not just slugs', () => {
    const related = getRelatedTerms('n4-notice');
    expect(related.length).toBeGreaterThan(0);
    expect(related[0]).toHaveProperty('term');
    expect(related[0]).toHaveProperty('slug');
    expect(related[0]).toHaveProperty('definition');
  });
});

// ============================================
// getAllTermsSorted Tests
// ============================================

describe('getAllTermsSorted', () => {
  it('returns all terms from glossary', () => {
    const sorted = getAllTermsSorted();
    expect(sorted.length).toBe(glossary.terms.length);
  });

  it('returns terms sorted alphabetically by name', () => {
    const sorted = getAllTermsSorted();
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]?.term.toLowerCase() ?? '';
      const curr = sorted[i]?.term.toLowerCase() ?? '';
      expect(prev.localeCompare(curr)).toBeLessThanOrEqual(0);
    }
  });

  it('is case-insensitive in sorting', () => {
    const sorted = getAllTermsSorted();
    const agiIndex = sorted.findIndex((t) => t.slug === 'agi');
    const arrearsIndex = sorted.findIndex((t) => t.slug === 'arrears');
    expect(agiIndex).toBeLessThan(arrearsIndex);
  });

  it('does not modify the original glossary', () => {
    const originalOrder = glossary.terms.map((t) => t.slug);
    getAllTermsSorted();
    const newOrder = glossary.terms.map((t) => t.slug);
    expect(newOrder).toEqual(originalOrder);
  });

  it('first term alphabetically is Above Guideline Increase', () => {
    const sorted = getAllTermsSorted();
    expect(sorted[0]?.slug).toBe('agi');
  });
});
