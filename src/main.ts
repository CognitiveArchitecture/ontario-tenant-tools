/**
 * Ontario Tenant Tools - Main Entry Point
 *
 * Initializes the application: theme, navigation, panels, and quick exit.
 */

import {
  initNavigation,
  type ViewModule,
  type ViewId,
} from "./utils/navigation";
import { initTheme } from "./utils/theme";
import { initQuickExit } from "./components/quick-exit";
import { initPanels } from "./components/panels";

// Import all views
import * as homeView from "./views/home";
import * as toolsView from "./views/tools";
import * as n4View from "./views/n4";
import * as n12View from "./views/n12";
import * as rentView from "./views/rent";
import * as reviewView from "./views/review";
import * as s82View from "./views/s82";
import * as reportView from "./views/report";
import * as resourcesView from "./views/resources";
import * as contactsView from "./views/contacts";

// View registry
const views: Record<ViewId, ViewModule> = {
  home: homeView,
  tools: toolsView,
  n4: n4View,
  n12: n12View,
  rent: rentView,
  review: reviewView,
  s82: s82View,
  report: reportView,
  resources: resourcesView,
  contacts: contactsView,
};

/**
 * Initialize the application.
 */
function init(): void {
  // Initialize theme (check localStorage, apply saved preference)
  initTheme();

  // Initialize navigation with all view modules
  initNavigation(views);

  // Initialize quick exit button
  initQuickExit();

  // Initialize panel system (settings, help)
  initPanels();

  // Log startup (development only)
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    console.log("Ontario Tenant Tools initialized");
  }
}

// Start the application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
