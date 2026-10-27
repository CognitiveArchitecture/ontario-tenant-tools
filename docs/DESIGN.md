# Design: how the app looks, and why

| Field     | Value                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| Updated   | 2026-10-27                                                                                                          |
| Reference | the Data Druid brand of [sebthecanadian.ca](https://sebthecanadian.ca) (its `docs/brand.md`)                        |
| Values    | `src/styles/tokens.css` (dark, the default), `src/styles/themes.css` (light, high contrast), `src/styles/fonts.css` |
| Guard     | `tests/contrast.test.ts` reads the token files and fails if any pairing below drops under its bar                   |

Change a rule here when you change it in the stylesheets, in the same commit.

## Colour

The app is the tool side of the same brand as the personal site: a neutral charcoal page in dark mode, warm parchment in light, one accent that is fern green in dark and violet in light, amber for warnings. Colour sets the mood; meaning is always carried by words too (the alert boxes have text, the Help tab is named).

Ratios are WCAG 2.x contrast ratios. Bars: body text, links and buttons 7:1 (the constitution's AAA target); the Help tab and the alert boxes 4.5:1 (AA, what the CI scan enforces); the outline of a form field 3:1 (non-text).

### Dark (default)

| Token                       | Value                 | Job                              | On page / cards / inputs |
| --------------------------- | --------------------- | -------------------------------- | ------------------------ |
| `--surface-base`            | `#16171a`             | page                             |                          |
| `--surface-card`            | `#1d1e21`             | cards, bottom nav                |                          |
| `--surface-float`           | `#26272b`             | inputs, dialogs, timeline track  |                          |
| `--border-hairline`         | `#2c2d31`             | hairlines on cards, header, nav  | decorative               |
| `--border-input`            | `#6b6a66`             | outline of a form field          | 3.1                      |
| `--text-primary`            | `#e8e4dc`             | body text                        | 14.1 / 13.2 / 11.8       |
| `--text-secondary`          | `#c3bdaf`             | subtitles, labels                | 9.6 / 8.9 / 8.0          |
| `--brand-primary`           | `#8fb86c`             | links, icons, active tab, titles | 7.9 / 7.3 / 6.6          |
| `--brand-button-bg` / `-fg` | `#8fb86c` / `#16171a` | primary buttons                  | 7.9                      |
| `--text-danger`             | `#f87171`             | Help tab                         | 6.5 / 6.0                |
| `--accent-warning`          | `#d9b24a`             | warning timeline bar, never text | 8.9                      |

The brand's own fern, `#6f9d52`, reads 5.65:1 on the page and 5.25:1 on cards: AA, but under this app's 7:1 target. `#8fb86c` is the same hue two steps brighter.

### Light

| Token                       | Value                 | Job                                      | On page / cards / dialogs |
| --------------------------- | --------------------- | ---------------------------------------- | ------------------------- |
| `--surface-base`            | `#f5f2eb`             | page (parchment)                         |                           |
| `--surface-card`            | `#fdfcf9`             | cards, bottom nav, inputs                |                           |
| `--surface-float`           | `#ebe7db`             | dialogs, timeline track                  |                           |
| `--border-hairline`         | `#d4cfc5`             | hairlines                                | decorative                |
| `--border-input`            | `#8b857a`             | outline of a form field                  | 3.2                       |
| `--text-primary`            | `#15201a`             | body text                                | 15.0 / 16.3 / 13.6        |
| `--text-secondary`          | `#3a453d`             | subtitles, labels                        | 9.0 / 9.8 / 8.1           |
| `--brand-primary`           | `#513592`             | links, icons, active tab, titles         | 8.3 / 9.0 / 7.5           |
| `--brand-button-bg` / `-fg` | `#513592` / `#ffffff` | primary buttons                          | 9.2                       |
| `--text-danger`             | `#991b1b`             | Help tab                                 | 7.4 / 8.1                 |
| `--accent-warning`          | `#b07a0f`             | warning timeline bar, never text (3.3:1) |                           |

The accent is the brand's link violet. Its heading violet, `#5b3fa3`, is 6.3:1 on dialogs, so the darker one keeps a single rule: accent text passes 7:1 on every light surface.

### High contrast

Black page, white text, yellow accent and labels, red Help tab (5.3:1), green success, square corners, 2 px white borders on cards, fields and buttons. Unchanged by the branding work; it is the same in every version of the app.

### In every theme

- Quick Exit is `#991b1b` with white text (8.3:1) and a white focus ring.
- The alert boxes keep their own backgrounds: dark 11.2 / 10.8 / 7.6, light 6.8 / 6.4 / 6.5 (danger / warning / success).
- Focus rings use the accent (dark 7.9:1, light 8.3:1 against the page; non-text needs 3:1).

## Type

| Face                   | Files (`public/fonts/`)   | Used for                                                                           |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| Atkinson Hyperlegible  | Regular 17 KB, Bold 18 KB | all body and interface text, including buttons, labels and the bottom nav          |
| Fraunces (variable)    | 67 KB                     | the header title and view and dialog titles (h2), weight 600, in the accent colour |
| the device's monospace | none shipped              | numbers and dates: report values, days remaining, timeline labels                  |

- Card titles (h3) stay in Atkinson bold so the home grid scans quickly.
- Form labels are sentence case, bold, in the secondary text colour.
- The files are self-hosted (the CSP's `font-src 'self'` holds), served with `font-display: swap`, and precached by the service worker with everything else. Both faces are under the SIL Open Font License 1.1; the licence URL is in each file's metadata. Atkinson Hyperlegible is copyright 2020 Braille Institute of America, Inc.; Fraunces is by Undercase Type.
- The base size is fluid, `clamp(1rem, 4vw, 1.2rem)`.

## Identity assets

| File                                        | What                                                                                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/favicon.svg`                        | the pixel mark, duotone: the lavender sprig when the device is in light mode, the pixel conifer in dark. A favicon cannot see the app's own theme toggle |
| `public/favicon.ico`                        | the sprig at 32 px, for browsers that do not read SVG favicons                                                                                           |
| `public/apple-touch-icon.png`               | the sprig on parchment, 180 px                                                                                                                           |
| `public/icons/icon-192.png`, `icon-512.png` | the app icons; the 512 is also the maskable icon, so the art sits inside the central safe zone                                                           |

Regenerate the PNGs with `node scripts/generate-icons.mjs` rather than editing them. The mark stays out of the header: the app is published by Cognitive Architecture, and the header says what the app is.

The browser theme colour (`<meta name="theme-color">`, the manifest's `theme_color` and `background_color`) is the dark page colour, `#16171a`.

## Surfaces and motion

- One card look: 10 px radius on small things, 14 px on cards, a hairline border, a soft shadow with a faint under-glow in the accent.
- The header is the page colour at 85 % with a blur; the bottom nav is solid (the contrast checker cannot resolve a see-through nav).
- Views slide up on entry; `prefers-reduced-motion: reduce` turns every animation and transition off.

## What a visual change must keep

1. 4.5:1 for all text in all three themes (`npm run a11y` scans every view in every theme); 7:1 for body text, links and buttons (`npm test` checks the tokens).
2. Quick Exit visible on every view.
3. The high-contrast theme as it is.
4. The 50 KB JavaScript and 15 KB CSS gzip gates, and the precache small enough for a 3G first visit.
5. Phone width (390 px) first; desktop second.
6. This page in step with the stylesheets.
