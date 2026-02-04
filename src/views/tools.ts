/**
 * Ontario Tenant Tools - Tools View
 *
 * Full toolbox grid with all available calculators.
 */

import { navigateToTool } from '../utils/navigation';

export function render(): string {
  return `
    <section id="tools" class="view-section active">
      <h2 style="margin-bottom: 1.5rem;">Toolbox</h2>
      <div class="tools-grid">
        <button class="tool-card" data-tool="n4">
          <svg class="icon" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div class="tool-text">
            <strong>Unpaid Rent</strong>
            <small>Form N4</small>
          </div>
        </button>

        <button class="tool-card" data-tool="review">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
          </svg>
          <div class="tool-text">
            <strong>Eviction Appeal</strong>
            <small>Review Order</small>
          </div>
        </button>

        <button class="tool-card" data-tool="n12">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
          </svg>
          <div class="tool-text">
            <strong>Landlord Moving In</strong>
            <small>Form N12</small>
          </div>
        </button>

        <button class="tool-card" data-tool="rent">
          <svg class="icon" viewBox="0 0 24 24">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
          <div class="tool-text">
            <strong>Rent Increase</strong>
            <small>2025 Guideline</small>
          </div>
        </button>

        <button class="tool-card" data-tool="s82">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          <div class="tool-text">
            <strong>Maintenance Fund</strong>
            <small>Section 82</small>
          </div>
        </button>
      </div>
    </section>
  `;
}

export function init(): void {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const toolId = card.getAttribute('data-tool');
      if (toolId) {
        navigateToTool(toolId as 'n4' | 'n12' | 'rent' | 'review' | 's82');
      }
    });
  });
}
