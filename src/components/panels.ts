/**
 * Ontario Tenant Tools - Panel/Modal System
 *
 * Manages settings and help panel overlays with accessibility support.
 */

let currentPanel: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;

/**
 * Initialize panel toggle buttons and close handlers.
 */
export function initPanels(): void {
  const overlay = document.getElementById('overlay');
  const settingsBtn = document.getElementById('settings-btn');
  const helpBtn = document.getElementById('help-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const helpPanel = document.getElementById('help-panel');
  const settingsClose = document.getElementById('settings-close');
  const helpClose = document.getElementById('help-close');

  // Toggle buttons
  settingsBtn?.addEventListener('click', () => {
    if (settingsPanel) togglePanel(settingsPanel);
  });

  helpBtn?.addEventListener('click', () => {
    if (helpPanel) togglePanel(helpPanel);
  });

  // Close buttons inside panels
  settingsClose?.addEventListener('click', closePanels);
  helpClose?.addEventListener('click', closePanels);

  // Panel close buttons (X icons)
  document.querySelectorAll('.panel-close').forEach((btn) => {
    btn.addEventListener('click', closePanels);
  });

  // Overlay click closes panels
  overlay?.addEventListener('click', closePanels);

  // Escape key closes panels
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPanel) {
      closePanels();
    }
  });
}

/**
 * Toggle a panel open/closed.
 */
export function togglePanel(panel: HTMLElement): void {
  const overlay = document.getElementById('overlay');
  const isOpen = panel.classList.contains('open');

  // Close any open panels first
  closePanels();

  if (!isOpen) {
    // Save current focus for restoration
    previousFocus = document.activeElement as HTMLElement;

    // Open the panel
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    overlay?.classList.add('open');

    // Update button aria-expanded
    const triggerId = panel.id === 'settings-panel' ? 'settings-btn' : 'help-btn';
    const trigger = document.getElementById(triggerId);
    trigger?.setAttribute('aria-expanded', 'true');

    // Focus the panel for screen readers
    const firstFocusable = panel.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    currentPanel = panel;
  }
}

/**
 * Close all panels.
 */
export function closePanels(): void {
  const overlay = document.getElementById('overlay');
  const panels = document.querySelectorAll('.panel');

  panels.forEach((panel) => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  });

  overlay?.classList.remove('open');

  // Reset aria-expanded on toggle buttons
  document.getElementById('settings-btn')?.setAttribute('aria-expanded', 'false');
  document.getElementById('help-btn')?.setAttribute('aria-expanded', 'false');

  // Restore focus
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }

  currentPanel = null;
}
