# Accessibility Standards

Ontario Tenant Tools is committed to being accessible to all users, including those with disabilities.

## Legal Requirements

### AODA (Accessibility for Ontarians with Disabilities Act)

Ontario law requires public-facing web content to meet **WCAG 2.0 Level AA**. We target **WCAG 2.1 Level AA** as our minimum, with AAA where achievable.

### Why This Matters

Tenants facing eviction may:

- Have visual impairments
- Use screen readers
- Navigate by keyboard only
- Have cognitive disabilities affecting reading comprehension
- Access the site on old devices with slow connections
- Be in stressful situations affecting concentration

Our tools must work for everyone.

## Standards We Follow

### Visual Design

| Requirement | Standard | Our Target |
|-------------|----------|------------|
| Text contrast | 4.5:1 minimum | 7:1 (AAA) |
| Large text contrast | 3:1 minimum | 4.5:1 |
| Focus indicators | Visible | High-contrast, 3px minimum |
| Touch targets | 44x44px minimum | 48x48px |
| Font size | User-scalable | 16px base, scales to 200% |

### Semantic HTML

**Always use:**
- `<button>` for clickable actions
- `<a>` for navigation links
- `<input>`, `<select>`, `<textarea>` for form controls
- `<table>`, `<th>`, `<td>` for tabular data
- `<nav>`, `<main>`, `<header>`, `<footer>` for page structure
- `<h1>` through `<h6>` in logical order

**Never use:**
- `<div>` with `onClick` as a button
- `<span>` as a link
- Tables for layout
- Empty heading tags
- Skipped heading levels

### Keyboard Navigation

All functionality must be:

- Reachable by Tab key
- Activatable by Enter or Space
- In logical tab order
- Escapable (modals, dropdowns)

Focus must be:

- Visible at all times
- High contrast (not just browser default)
- Never trapped

### Screen Readers

- All images have `alt` text (or `alt=""` for decorative)
- All icons have `aria-label`
- Form inputs have associated `<label>` elements
- Error messages are announced
- Dynamic content updates use `aria-live`

### Forms

- Every input has a visible label
- Required fields are marked (not by color alone)
- Error messages are specific ("Enter a date" not "Invalid input")
- Errors appear near the field, not just at top of form

### Reading Level

All user-facing text targets **Grade 5 reading level**:

- Short sentences (under 20 words)
- Common words (avoid jargon)
- Active voice
- One idea per paragraph

Legal terms are defined in plain language in the glossary.

## Testing

### Automated Testing

We use:

- **axe-core**: Automated accessibility scanner
- **pa11y-ci**: CI pipeline accessibility checks

All PRs must pass automated checks.

### Manual Testing

Contributors should test with:

- **Keyboard only**: Can you complete all tasks without a mouse?
- **Screen reader**: Try NVDA (Windows), VoiceOver (Mac), or Orca (Linux)
- **Zoom**: Does the site work at 200% zoom?
- **High contrast mode**: Is everything visible in Windows High Contrast?

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) (browser extension)
- [WAVE](https://wave.webaim.org/) (online checker)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- [Hemingway Editor](https://hemingwayapp.com/) (reading level)

## Common Issues to Avoid

### Color

❌ "Click the red button"  
✅ "Click the 'Submit' button"

❌ Error indicated only by red border  
✅ Error with icon, text, and color

### Links

❌ "Click here"  
✅ "Download the N4 Notice Guide"

❌ "Learn more"  
✅ "Learn more about Section 82 defenses"

### Images

❌ `<img src="deadline.png">`  
✅ `<img src="deadline.png" alt="Your deadline is December 15, 2025">`

### Forms

❌ Placeholder text as only label  
✅ Visible label above input

❌ "Please enter valid data"  
✅ "Enter a date in YYYY-MM-DD format (example: 2025-12-15)"

## Reporting Issues

Found an accessibility barrier?

1. [Open an issue](../../issues) with label "accessibility"
2. Describe what you were trying to do
3. Describe what happened
4. Include browser/assistive technology if relevant

Accessibility issues are **high priority** and will be addressed promptly.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [AODA Requirements](https://www.ontario.ca/page/how-make-websites-accessible)
- [Inclusive Components](https://inclusive-components.design/)

---

Accessibility is not optional. It's how we ensure this tool serves everyone who needs it.
