/**
 * Ontario Tenant Tools - Navigation System
 *
 * Manages view switching, history stack, and tab navigation.
 * The address bar names the current view ("#n4" is the N4 tool), so a view
 * can be linked to directly and the accessibility scan can reach every view.
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
  | 's82';

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

const ALL_VIEWS: ViewId[] = [...TAB_VIEWS, 'n4', 'n12', 'rent', 'review', 's82'];

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
};

/**
 * Read the view named by an address-bar hash. "#n4" gives "n4". An empty or
 * unknown hash (such as the skip link's "#main-content") gives null.
 */
export function viewFromHash(hash: string): ViewId | null {
  const id = hash.replace(/^#/, '');
  return ALL_VIEWS.find((viewId) => viewId === id) ?? null;
}

/**
 * The address-bar hash that names a view: "" for home, "#n4" for the N4 tool.
 */
export function hashForView(viewId: ViewId): string {
  return viewId === 'home' ? '' : `#${viewId}`;
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

  // Follow the address bar when the user edits it or follows a link to a view
  window.addEventListener('hashchange', () => {
    const viewId = viewFromHash(window.location.hash);
    if (viewId && viewId !== state.currentView) {
      openView(viewId);
    }
  });

  // Render the view named in the address bar, or home
  openView(viewFromHash(window.location.hash) ?? 'home');
}

/**
 * Switch to a tab view (clears history stack).
 */
export function switchTab(tabId: TabId): void {
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
 * Open a view as if arriving from a link: a tab starts a fresh history,
 * a tool gets a back button that returns to the home view.
 */
function openView(viewId: ViewId): void {
  if (TAB_VIEWS.includes(viewId as TabId)) {
    switchTab(viewId as TabId);
  } else {
    state.historyStack = ['home'];
    navigateToTool(viewId);
  }
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

  syncHash(viewId);
}

/**
 * Keep the address bar in step with the view. Uses replaceState so no browser
 * history entries are added: Quick Exit overwrites the current entry, and a
 * longer trail of entries would weaken that.
 */
function syncHash(viewId: ViewId): void {
  const hash = hashForView(viewId);
  if (window.location.hash === hash) return;
  try {
    window.history.replaceState(
      null,
      '',
      hash || window.location.pathname + window.location.search
    );
  } catch {
    // History API might fail in some contexts
  }
}

/**
 * Update nav item active states.
 */
function updateNavState(activeTab: TabId): void {
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
