/**
 * Ontario Tenant Tools - Contacts View
 *
 * Emergency contact information.
 */

export function render(): string {
  return `
    <section id="contacts" class="view-section active">
      <h2 style="margin-bottom:1.5rem;">Emergency Help</h2>

      <div style="background:var(--state-danger-bg); padding:1.5rem; border-radius:var(--radius-md); margin-bottom:1.5rem; border:2px solid var(--state-danger-fg);">
        <h3 style="margin:0 0 0.5rem; color:var(--state-danger-fg);">RHEU - Rental Housing Enforcement Unit</h3>
        <p style="margin:0 0 1rem; color:var(--state-danger-fg);">
          Call immediately for <strong>illegal lockouts</strong> or <strong>utility cut-offs</strong>.
        </p>
        <a href="tel:1-888-772-9277" style="display:inline-block; background:var(--state-danger-fg); color:var(--state-danger-bg); padding:0.75rem 1.5rem; border-radius:var(--radius-md); font-weight:bold; text-decoration:none; font-size:1.1rem;">
          Call 1-888-772-9277
        </a>
        <p style="margin:1rem 0 0; font-size:0.85rem; color:var(--state-danger-fg);">
          Available Monday to Friday, 8:30am to 5:00pm
        </p>
      </div>

      <div style="background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); margin-bottom:1rem; border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem;">Landlord and Tenant Board</h3>
        <p style="margin:0 0 0.5rem; color:var(--text-secondary);">
          For questions about hearings, applications, and procedures.
        </p>
        <a href="tel:1-888-332-3234" style="color:var(--brand-primary); font-weight:bold;">
          1-888-332-3234
        </a>
        <p style="margin:0.5rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          Or visit <a href="https://tribunalsontario.ca/ltb/" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary);">tribunalsontario.ca/ltb</a>
        </p>
      </div>

      <div style="background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); margin-bottom:1rem; border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem;">211 Ontario</h3>
        <p style="margin:0 0 0.5rem; color:var(--text-secondary);">
          Connect to community and social services, including emergency housing.
        </p>
        <a href="tel:211" style="color:var(--brand-primary); font-weight:bold;">
          Dial 2-1-1
        </a>
        <p style="margin:0.5rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          Available 24/7, or visit <a href="https://211ontario.ca" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary);">211ontario.ca</a>
        </p>
      </div>

      <div style="background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem;">Crisis Support</h3>
        <p style="margin:0 0 0.5rem; color:var(--text-secondary);">
          If you're in crisis or feeling overwhelmed.
        </p>
        <a href="tel:1-833-456-4566" style="color:var(--brand-primary); font-weight:bold;">
          988 Suicide Crisis Helpline
        </a>
        <p style="margin:0.5rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          Available 24/7. You don't have to face this alone.
        </p>
      </div>
    </section>
  `;
}

export function init(): void {
  // No interactive elements to initialize
}
