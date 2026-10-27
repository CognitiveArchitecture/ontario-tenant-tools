/**
 * Ontario Tenant Tools - Hash Routing Tests
 *
 * The address-bar hash names the current view ("#n4" is the N4 tool).
 * These tests cover the pure mapping; the DOM wiring is exercised by pa11y-ci.
 */

import { describe, it, expect } from 'vitest';
import { viewFromHash, hashForView, type ViewId } from '../src/utils/navigation';

const ALL_VIEWS: ViewId[] = [
  'home',
  'tools',
  'report',
  'resources',
  'contacts',
  'n4',
  'n12',
  'rent',
  'review',
  's82',
];

describe('viewFromHash', () => {
  it('maps each view hash to its view', () => {
    for (const viewId of ALL_VIEWS) {
      expect(viewFromHash(`#${viewId}`)).toBe(viewId);
    }
  });

  it('accepts the hash without the leading #', () => {
    expect(viewFromHash('n4')).toBe('n4');
  });

  it('gives null for an empty hash', () => {
    expect(viewFromHash('')).toBeNull();
    expect(viewFromHash('#')).toBeNull();
  });

  it('gives null for hashes that are not views', () => {
    expect(viewFromHash('#main-content')).toBeNull();
    expect(viewFromHash('#N4')).toBeNull();
    expect(viewFromHash('#n4/extra')).toBeNull();
    expect(viewFromHash('#toString')).toBeNull();
  });
});

describe('hashForView', () => {
  it('uses an empty hash for home', () => {
    expect(hashForView('home')).toBe('');
  });

  it('names every other view', () => {
    expect(hashForView('tools')).toBe('#tools');
    expect(hashForView('n4')).toBe('#n4');
    expect(hashForView('s82')).toBe('#s82');
  });

  it('gives the not-found view no hash of its own', () => {
    expect(hashForView('not-found')).toBe('');
    expect(viewFromHash('#not-found')).toBeNull();
  });

  it('round-trips with viewFromHash', () => {
    for (const viewId of ALL_VIEWS) {
      const hash = hashForView(viewId);
      expect(viewFromHash(hash) ?? 'home').toBe(viewId);
    }
  });
});
