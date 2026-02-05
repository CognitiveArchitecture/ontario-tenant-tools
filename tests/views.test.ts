/**
 * Ontario Tenant Tools - View Module Smoke Tests
 *
 * Tests that render() functions return valid HTML with expected structure.
 * init() functions require DOM so we only verify they are callable functions.
 */

import { describe, it, expect } from 'vitest';
import * as home from '../src/views/home';
import * as tools from '../src/views/tools';
import * as n4 from '../src/views/n4';
import * as n12 from '../src/views/n12';
import * as rent from '../src/views/rent';
import * as review from '../src/views/review';
import * as s82 from '../src/views/s82';
import * as report from '../src/views/report';
import * as resources from '../src/views/resources';
import * as contacts from '../src/views/contacts';

// ============================================
// Home View
// ============================================

describe('Home View', () => {
  it('render() returns a non-empty string', () => {
    const html = home.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = home.render();
    expect(html).toContain('id="home"');
    expect(html).toContain('class="view-section');
    expect(html).toContain('triage-card');
    expect(html).toContain('data-tool="n4"');
  });

  it('init() is a function', () => {
    expect(typeof home.init).toBe('function');
  });
});

// ============================================
// Tools View
// ============================================

describe('Tools View', () => {
  it('render() returns a non-empty string', () => {
    const html = tools.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = tools.render();
    expect(html).toContain('id="tools"');
    expect(html).toContain('class="view-section');
    expect(html).toContain('tools-grid');
    expect(html).toContain('tool-card');
  });

  it('init() is a function', () => {
    expect(typeof tools.init).toBe('function');
  });
});

// ============================================
// N4 View
// ============================================

describe('N4 View', () => {
  it('render() returns a non-empty string', () => {
    const html = n4.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = n4.render();
    expect(html).toContain('id="n4"');
    expect(html).toContain('id="n4-form"');
    expect(html).toContain('id="n4-date"');
    expect(html).toContain('id="n4-result"');
  });

  it('render() includes accessibility attributes', () => {
    const html = n4.render();
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('role="region"');
    expect(html).toContain('for="n4-date"');
  });

  it('init() is a function', () => {
    expect(typeof n4.init).toBe('function');
  });
});

// ============================================
// N12 View
// ============================================

describe('N12 View', () => {
  it('render() returns a non-empty string', () => {
    const html = n12.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = n12.render();
    expect(html).toContain('id="n12"');
    expect(html).toContain('id="n12-form"');
    expect(html).toContain('id="n12-notice-date"');
    expect(html).toContain('id="n12-termination-date"');
    expect(html).toContain('id="n12-rent"');
    expect(html).toContain('id="n12-result"');
  });

  it('render() includes accessibility attributes', () => {
    const html = n12.render();
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('role="region"');
  });

  it('init() is a function', () => {
    expect(typeof n12.init).toBe('function');
  });
});

// ============================================
// Rent View
// ============================================

describe('Rent View', () => {
  it('render() returns a non-empty string', () => {
    const html = rent.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = rent.render();
    expect(html).toContain('id="rent"');
    expect(html).toContain('id="rent-form"');
    expect(html).toContain('id="cur-rent"');
    expect(html).toContain('id="new-rent"');
    expect(html).toContain('id="rent-result"');
  });

  it('render() includes accessibility attributes', () => {
    const html = rent.render();
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('role="region"');
  });

  it('init() is a function', () => {
    expect(typeof rent.init).toBe('function');
  });
});

// ============================================
// Review View
// ============================================

describe('Review View', () => {
  it('render() returns a non-empty string', () => {
    const html = review.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = review.render();
    expect(html).toContain('id="review"');
    expect(html).toContain('id="review-form"');
    expect(html).toContain('id="order-date"');
    expect(html).toContain('id="review-result"');
  });

  it('render() includes accessibility attributes', () => {
    const html = review.render();
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('role="region"');
  });

  it('init() is a function', () => {
    expect(typeof review.init).toBe('function');
  });
});

// ============================================
// S82 View
// ============================================

describe('S82 View', () => {
  it('render() returns a non-empty string', () => {
    const html = s82.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = s82.render();
    expect(html).toContain('id="s82"');
    expect(html).toContain('id="s82-form"');
    expect(html).toContain('id="s82-arrears"');
    expect(html).toContain('id="s82-result"');
  });

  it('render() includes accessibility attributes', () => {
    const html = s82.render();
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('role="region"');
  });

  it('init() is a function', () => {
    expect(typeof s82.init).toBe('function');
  });
});

// ============================================
// Report View
// ============================================

describe('Report View', () => {
  it('render() returns a non-empty string', () => {
    const html = report.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = report.render();
    expect(html).toContain('id="report"');
    expect(html).toContain('id="report-content"');
    expect(html).toContain('id="copy-report"');
    expect(html).toContain('id="print-report"');
    expect(html).toContain('report-section');
    expect(html).toContain('report-actions');
  });

  it('render() includes functional buttons', () => {
    const html = report.render();
    expect(html).toContain('Copy');
    expect(html).toContain('Save PDF');
    expect(html).toContain('btn-primary');
  });

  it('init() is a function', () => {
    expect(typeof report.init).toBe('function');
  });
});

// ============================================
// Resources View
// ============================================

describe('Resources View', () => {
  it('render() returns a non-empty string', () => {
    const html = resources.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = resources.render();
    expect(html).toContain('id="resources"');
    expect(html).toContain('class="view-section');
  });

  it('render() includes external links with proper attributes', () => {
    const html = resources.render();
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('render() includes all resource section headings', () => {
    const html = resources.render();
    expect(html).toContain('Bill 60 Summary');
    expect(html).toContain('Standard Lease');
    expect(html).toContain('Vital Services');
    expect(html).toContain('Tenant Rights');
    expect(html).toContain('Resolving Disagreements');
    expect(html).toContain('Find a Legal Clinic');
    expect(html).toContain('Steps to Justice');
  });

  it('render() includes correct resource URLs', () => {
    const html = resources.render();
    // Standard Lease (updated from ontario.ca guide page)
    expect(html).toContain('https://forms.mgcs.gov.on.ca/en/dataset/047-2229');
    // Vital Services brochure (updated URL without (EN) suffix)
    expect(html).toContain(
      'https://tribunalsontario.ca/documents/ltb/Brochures/Maintenance%20and%20Repairs.html'
    );
    // Tenant Rights - ontario.ca
    expect(html).toContain('https://www.ontario.ca/page/renting-ontario-your-rights');
    // Tenant Rights - LTB Guideline 6
    expect(html).toContain(
      'https://tribunalsontario.ca/documents/ltb/Interpretation%20Guidelines/06%20-%20Tenants%20Rights.html'
    );
    // Resolving Disagreements
    expect(html).toContain(
      'https://www.ontario.ca/page/solve-disagreement-your-landlord-or-tenant'
    );
    // Legal Aid Ontario
    expect(html).toContain('https://www.legalaid.on.ca/legal-clinics/');
    // Steps to Justice
    expect(html).toContain('https://stepstojustice.ca/legal-topic/housing-law');
    // RTA
    expect(html).toContain('https://www.ontario.ca/laws/statute/06r17');
  });

  it('init() is a function', () => {
    expect(typeof resources.init).toBe('function');
  });
});

// ============================================
// Contacts View
// ============================================

describe('Contacts View', () => {
  it('render() returns a non-empty string', () => {
    const html = contacts.render();
    expect(html).toBeTruthy();
    expect(typeof html).toBe('string');
    expect(html.length).toBeGreaterThan(0);
  });

  it('render() includes expected HTML elements', () => {
    const html = contacts.render();
    expect(html).toContain('id="contacts"');
    expect(html).toContain('class="view-section');
  });

  it('render() includes emergency contact information', () => {
    const html = contacts.render();
    expect(html).toContain('tel:');
  });

  it('init() is a function', () => {
    expect(typeof contacts.init).toBe('function');
  });
});
