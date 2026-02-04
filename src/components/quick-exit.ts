/**
 * Ontario Tenant Tools - Quick Exit Component
 *
 * Safety feature that immediately redirects to a neutral site,
 * clears storage, and overwrites browser history.
 */

import { clearSession } from "../utils/session";

const EXIT_URL = "https://google.com";

/**
 * Initialize the quick exit button.
 */
export function initQuickExit(): void {
  const exitBtn = document.getElementById("quick-exit");
  if (exitBtn) {
    exitBtn.addEventListener("click", quickExit);
  }
}

/**
 * Perform quick exit: clear data and redirect.
 */
export function quickExit(): void {
  // Clear in-memory session state
  clearSession();

  // Clear all local storage
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Storage might be unavailable in some contexts
  }

  // Overwrite browser history to prevent back-button returning
  try {
    window.history.replaceState(null, "", EXIT_URL);
  } catch {
    // History API might fail in some contexts
  }

  // Redirect to neutral site
  window.location.href = EXIT_URL;
}
