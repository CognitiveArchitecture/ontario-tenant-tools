/**
 * Ontario Tenant Tools - Resources View
 *
 * Educational content and links to official resources.
 */

export function render(): string {
  return `
    <section id="resources" class="view-section active">
      <h2 style="margin-bottom:1.5rem;">Resources</h2>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Bill 60 Summary</h3>
        <p style="margin:0; color:var(--text-secondary);">
          N4 Cure Period: <strong>7 Business Days</strong><br>
          Review Deadline: <strong>15 Days</strong><br>
          N12 Compensation: <strong>$0 if 120+ days notice</strong>
        </p>
        <a href="https://www.ontario.ca/laws/statute/06r17" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          View Residential Tenancies Act
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Standard Lease</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Most landlords must use the official Ontario standard lease form.
        </p>
        <a href="https://forms.mgcs.gov.on.ca/en/dataset/047-2229" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Download Standard Lease
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Vital Services</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Landlords cannot cut off heat, water, or electricity. This is illegal.
        </p>
        <a href="https://tribunalsontario.ca/documents/ltb/Brochures/Maintenance%20and%20Repairs.html" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Read LTB Brochure
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Tenant Rights</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Know your rights as a tenant in Ontario.
        </p>
        <a href="https://www.ontario.ca/page/renting-ontario-your-rights" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Ontario.ca: Your Rights
        </a>
        <a href="https://tribunalsontario.ca/documents/ltb/Interpretation%20Guidelines/06%20-%20Tenants%20Rights.html" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          LTB Guideline 6: Tenant Rights
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Resolving Disagreements</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Steps to resolve issues with your landlord.
        </p>
        <a href="https://www.ontario.ca/page/solve-disagreement-your-landlord-or-tenant" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Ontario.ca: Solve a Disagreement
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Find a Legal Clinic</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Free legal help for low-income Ontarians.
        </p>
        <a href="https://www.legalaid.on.ca/legal-clinics/" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Legal Aid Ontario - Find a Clinic
        </a>
      </div>

      <div style="margin-bottom:1rem; background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.05);">
        <h3 style="margin:0 0 0.5rem 0;">Steps to Justice</h3>
        <p style="margin:0; color:var(--text-secondary);">
          Plain-language legal information from CLEO.
        </p>
        <a href="https://stepstojustice.ca/legal-topic/housing-law" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); display:block; margin-top:0.5rem;">
          Housing Law Guide
        </a>
      </div>
    </section>
  `;
}

export function init(): void {
  // No interactive elements to initialize
}
