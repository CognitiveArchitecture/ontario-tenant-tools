/**
 * Ontario Tenant Tools - Navigation System
 *
 * Manages view switching, history stack, and tab navigation.
 */

export type ViewId =
  | 'home'
  | 'tools'
  | 'report'
  | 'resources'
  | 'contacts'
  | 'n4'
  | 'n12'
  | 'rent'
  | 'review'
  | 's82'
  | 'not-found';

export type TabId = 'home' | 'tools' | 'report' | 'resources' | 'contacts';

export interface ViewModule {
  render: () => string;
  init: () => void;
}

interface NavigationState {
  historyStack: ViewId[];
  currentView: ViewId;
  views: Record<ViewId, ViewModule>;
}

const state: NavigationState = {
  historyStack: ['home'],
  currentView: 'home',
  views: {} as Record<ViewId, ViewModule>,
};

const TAB_VIEWS: TabId[] = ['home', 'tools', 'report', 'resources', 'contacts'];

const VIEW_TITLES: Record<ViewId, string> = {
  home: 'Ontario Tenant Tools',
  tools: 'Toolbox',
  report: 'Session Report',
  resources: 'Resources',
  contacts: 'Emergency Help',
  n4: 'N4 - Unpaid Rent',
  n12: 'N12 - Landlord Moving In',
  rent: 'Rent Increase Check',
  review: 'Eviction Order Review',
  s82: 'Section 82 Deposit',
  'not-found': 'Page Not Found',
};

/**
 * Paths the app answers. Netlify sends every path to index.html, so the app
 * has to tell an unknown address apart itself and show the not-found view.
 */
const KNOWN_PATHS = ['/', '/index.html'];

/**
 * Check whether a URL path is one the app serves.
 */
export function isKnownPath(pathname: string): boolean {
  return KNOWN_PATHS.includes(pathname);
}

/**
 * Initialize the navigation system with view modules.
 */
export function initNavigation(views: Record<ViewId, ViewModule>): void {
  state.views = views;

  // Set up bottom nav listeners
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view') as TabId;
      if (viewId) {
        switchTab(viewId);
      }
    });
  });

  // Set up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }

  // Render initial view, or the not-found view for an unknown address
  if (isKnownPath(window.location.pathname)) {
    renderView('home');
  } else {
    showNotFound();
  }
}

/**
 * Show the not-found view. No tab is active and there is no history to go back to.
 */
export function showNotFound(): void {
  state.historyStack = ['not-found'];
  state.currentView = 'not-found';
  renderView('not-found');
  updateNavState(null);
  updateBackButton(false);
}

/**
 * Switch to a tab view (clears history stack).
 */
export function switchTab(tabId: TabId): void {
  leaveUnknownPath();
  state.historyStack = [tabId];
  state.currentView = tabId;
  renderView(tabId);
  updateNavState(tabId);
  updateBackButton(false);
}

/**
 * Navigate to a tool view (adds to history stack).
 */
export function navigateToTool(toolId: ViewId): void {
  state.historyStack.push(toolId);
  state.currentView = toolId;
  renderView(toolId);
  updateNavState('tools'); // Tools is parent
  updateBackButton(true);
}

/**
 * Go back in navigation history.
 */
export function goBack(): void {
  if (state.historyStack.length > 1) {
    state.historyStack.pop();
    const previousView = state.historyStack[state.historyStack.length - 1];
    if (previousView) {
      state.currentView = previousView;
      renderView(previousView);

      const isTab = TAB_VIEWS.includes(previousView as TabId);
      updateNavState(isTab ? (previousView as TabId) : 'tools');
      updateBackButton(state.historyStack.length > 1);
    }
  }
}

/**
 * Get the current view ID.
 */
export function getCurrentView(): ViewId {
  return state.currentView;
}

/**
 * Render a view into the main content area.
 */
function renderView(viewId: ViewId): void {
  const main = document.getElementById('main-content');
  const pageTitle = document.getElementById('page-title');

  if (!main) return;

  const viewModule = state.views[viewId];
  if (viewModule) {
    main.innerHTML = viewModule.render();
    viewModule.init();
  }

  if (pageTitle) {
    pageTitle.textContent = VIEW_TITLES[viewId] ?? 'Ontario Tenant Tools';
  }
}

/**
 * Update nav item active states.
 */
function updateNavState(activeTab: TabId | null): void {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    const viewId = item.getAttribute('data-view');
    const isActive = viewId === activeTab;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

/**
 * Show or hide the back button.
 */
function updateBackButton(show: boolean): void {
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.style.display = show ? 'block' : 'none';
  }
}

/**
 * When the user leaves the not-found view, put the address back to the start
 * page so that a reload or bookmark does not land on "Page Not Found" again.
 */
function leaveUnknownPath(): void {
  if (state.currentView !== 'not-found') return;
  try {
    window.history.replaceState(null, '', '/');
  } catch {
    // History API might fail in some contexts
  }
}
