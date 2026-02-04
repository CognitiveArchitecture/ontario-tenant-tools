/**
 * Ontario Tenant Tools - Theme System
 *
 * Manages dark/light/high-contrast themes with localStorage persistence.
 */

export type Theme = 'dark' | 'light' | 'high-contrast';

const STORAGE_KEY_LIGHT = 'ott-light-mode';
const STORAGE_KEY_CONTRAST = 'ott-high-contrast';

/**
 * Initialize theme from localStorage or system preference.
 */
export function initTheme(): void {
  // Check localStorage first
  const savedLight = localStorage.getItem(STORAGE_KEY_LIGHT) === 'true';
  const savedContrast = localStorage.getItem(STORAGE_KEY_CONTRAST) === 'true';

  // Apply saved preferences
  if (savedLight) {
    document.body.classList.add('light-mode');
  }
  if (savedContrast) {
    document.body.classList.add('high-contrast');
  }

  // Sync checkbox states
  const lightCheckbox = document.getElementById('check-light') as HTMLInputElement | null;
  const contrastCheckbox = document.getElementById('check-contrast') as HTMLInputElement | null;

  if (lightCheckbox) {
    lightCheckbox.checked = savedLight;
    lightCheckbox.addEventListener('change', () => {
      toggleLightMode(lightCheckbox.checked);
    });
  }

  if (contrastCheckbox) {
    contrastCheckbox.checked = savedContrast;
    contrastCheckbox.addEventListener('change', () => {
      toggleHighContrast(contrastCheckbox.checked);
    });
  }
}

/**
 * Toggle light mode.
 */
export function toggleLightMode(enable: boolean): void {
  document.body.classList.toggle('light-mode', enable);
  localStorage.setItem(STORAGE_KEY_LIGHT, String(enable));
}

/**
 * Toggle high contrast mode.
 */
export function toggleHighContrast(enable: boolean): void {
  document.body.classList.toggle('high-contrast', enable);
  localStorage.setItem(STORAGE_KEY_CONTRAST, String(enable));
}

/**
 * Check if light mode is active.
 */
export function isLightMode(): boolean {
  return document.body.classList.contains('light-mode');
}

/**
 * Check if high contrast mode is active.
 */
export function isHighContrast(): boolean {
  return document.body.classList.contains('high-contrast');
}
