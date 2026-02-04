/**
 * Ontario Tenant Tools - Home View
 *
 * Triage grid for quick situation matching.
 */

import { navigateToTool } from '../utils/navigation';

export function render(): string {
  return `
    <section id="home" class="view-section active">
      <div style="margin-bottom:1.5rem;">
        <h2 style="font-size:1.5rem; margin-bottom:0.5rem;">What is happening?</h2>
        <p style="color:var(--text-secondary); margin:0;">Select the situation that matches yours.</p>
      </div>
      <div class="triage-grid">
        <button class="triage-card" data-tool="n4">
          <div class="card-content">
            <div class="icon-box">
              <svg class="icon" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="text-box">
              <h3>Unpaid Rent</h3>
              <p>I received an N4 form</p>
            </div>
          </div>
        </button>

        <button class="triage-card" data-tool="n12">
          <div class="card-content">
            <div class="icon-box">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <div class="text-box">
              <h3>Landlord Moving In</h3>
              <p>I received an N12 form</p>
            </div>
          </div>
        </button>

        <button class="triage-card" data-tool="rent">
          <div class="card-content">
            <div class="icon-box">
              <svg class="icon" viewBox="0 0 24 24">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div class="text-box">
              <h3>Rent Increase</h3>
              <p>Checking the 2025 Guideline</p>
            </div>
          </div>
        </button>

        <button class="triage-card" data-tool="review">
          <div class="card-content">
            <div class="icon-box">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
              </svg>
            </div>
            <div class="text-box">
              <h3>Eviction Order</h3>
              <p>Appeal/Review Deadline</p>
            </div>
          </div>
        </button>
      </div>
    </section>
  `;
}

export function init(): void {
  const cards = document.querySelectorAll('.triage-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const toolId = card.getAttribute('data-tool');
      if (toolId) {
        navigateToTool(toolId as 'n4' | 'n12' | 'rent' | 'review');
      }
    });
  });
}
