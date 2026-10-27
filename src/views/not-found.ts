/**
 * Ontario Tenant Tools - Not Found View
 *
 * Shown when the address does not match any page in the app.
 * Netlify serves index.html for every path, so this view is the app's 404 page.
 */

export function render(): string {
  return `
    <section id="not-found" class="view-section active">
      <div class="not-found">
        <img
          class="not-found-image"
          src="/404-cliff.png"
          width="400"
          height="400"
          alt="Pixel-art illustration of a mossy cliff edge with a single leaf drifting into the empty space below."
        />
        <h2>Page Not Found</h2>
        <p>Error 404: there is no page at this address.</p>
        <a href="/" class="not-found-link">Go to the start page</a>
      </div>
    </section>
  `;
}

export function init(): void {
  // No interactive elements to initialize
}
