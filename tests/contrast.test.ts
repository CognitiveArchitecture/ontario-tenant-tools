/**
 * Ontario Tenant Tools - Colour Contrast Tests
 *
 * Reads the design tokens straight from the stylesheets and checks every text
 * colour against the surfaces it sits on, in each theme. The CI scan (pa11y-ci
 * with axe) only sees the pairings that happen to be on screen; this checks
 * the tokens themselves, so a colour change fails here first.
 *
 * Bars: body text, links and buttons 7:1 (the constitution's AAA target);
 * everything else 4.5:1 (WCAG AA, which the CI scan enforces); the outline
 * of a form field 3:1 (non-text contrast).
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

type Tokens = Record<string, string>;

const AAA = 7;
const AA = 4.5;
const NON_TEXT = 3; /* WCAG 1.4.11: outlines of form fields */

function read(file: string): string {
  return readFileSync(fileURLToPath(new URL(`../src/styles/${file}`, import.meta.url)), 'utf8');
}

/** The custom properties declared in each `selector { ... }` block of a stylesheet. */
function tokensBySelector(css: string): Record<string, Tokens> {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks: Record<string, Tokens> = {};
  for (const match of noComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = (match[1] ?? '').trim();
    const body = match[2] ?? '';
    const tokens: Tokens = {};
    for (const declaration of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      const name = declaration[1] ?? '';
      const value = (declaration[2] ?? '').replace(/!important/, '').trim();
      tokens[name] = value;
    }
    if (Object.keys(tokens).length > 0) {
      blocks[selector] = { ...(blocks[selector] ?? {}), ...tokens };
    }
  }
  return blocks;
}

const base = tokensBySelector(read('tokens.css'));
const overrides = tokensBySelector(read('themes.css'));

const THEMES: Record<string, Tokens> = {
  dark: { ...base[':root'] },
  light: { ...base[':root'], ...overrides['body.light-mode'] },
  'high-contrast': { ...base[':root'], ...overrides['body.high-contrast'] },
};

function luminance(hex: string): number {
  const digits = hex.replace('#', '');
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join('') : digits;
  const channel = (i: number): number => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

function colour(tokens: Tokens, name: string): string {
  const value = tokens[name];
  if (value === undefined || !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value)) {
    throw new Error(`${name} is ${String(value)}, not a hex colour`);
  }
  return value;
}

/** [text token, surface token, minimum ratio] */
const PAIRINGS: [string, string, number][] = [
  ['--text-primary', '--surface-base', AAA],
  ['--text-primary', '--surface-card', AAA],
  ['--text-primary', '--surface-float', AAA],
  ['--text-secondary', '--surface-base', AAA],
  ['--text-secondary', '--surface-card', AAA],
  ['--text-secondary', '--surface-float', AAA],
  ['--brand-primary', '--surface-base', AAA],
  ['--brand-primary', '--surface-card', AAA],
  ['--brand-primary', '--surface-float', AA],
  ['--text-danger', '--surface-base', AA],
  ['--text-danger', '--surface-card', AA],
  ['--border-input', '--surface-base', NON_TEXT],
  ['--brand-button-fg', '--brand-button-bg', AAA],
  ['--state-danger-fg', '--state-danger-bg', AA],
  ['--state-warning-fg', '--state-warning-bg', AA],
  ['--state-success-fg', '--state-success-bg', AA],
];

describe('colour contrast of the design tokens', () => {
  it('finds the three themes in the stylesheets', () => {
    expect(Object.keys(base)).toContain(':root');
    expect(Object.keys(overrides)).toContain('body.light-mode');
    expect(Object.keys(overrides)).toContain('body.high-contrast');
  });

  for (const [theme, tokens] of Object.entries(THEMES)) {
    describe(`${theme} theme`, () => {
      for (const [text, surface, minimum] of PAIRINGS) {
        it(`${text} on ${surface} is at least ${minimum}:1`, () => {
          const ratio = contrast(colour(tokens, text), colour(tokens, surface));
          expect(ratio, `${tokens[text]} on ${tokens[surface]}`).toBeGreaterThanOrEqual(minimum);
        });
      }
    });
  }
});
