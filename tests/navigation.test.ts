/**
 * Ontario Tenant Tools - Navigation Tests
 *
 * Netlify sends every path to index.html, so the app itself has to tell
 * a real page apart from an unknown address and show the not-found view.
 */

import { describe, it, expect } from 'vitest';
import { isKnownPath } from '../src/utils/navigation';

describe('isKnownPath', () => {
  it('accepts the start page', () => {
    expect(isKnownPath('/')).toBe(true);
  });

  it('accepts index.html', () => {
    expect(isKnownPath('/index.html')).toBe(true);
  });

  it('rejects addresses the app does not know', () => {
    expect(isKnownPath('/this-page-does-not-exist')).toBe(false);
    expect(isKnownPath('/n4')).toBe(false);
    expect(isKnownPath('/tools/')).toBe(false);
    expect(isKnownPath('/index.html/extra')).toBe(false);
    expect(isKnownPath('')).toBe(false);
  });
});
