/**
 * Ontario Tenant Tools - Section 82 Deposit Calculator View
 *
 * Estimates the deposit required to raise maintenance issues at an eviction hearing.
 */

import { calculateSection82DepositFromDollars } from "@calculator/section82";
import { formatCurrency, dollarsToCents } from "@core/types";
import type { Section82Calculation } from "@core/types";
import { recordCalculation } from "../utils/session";

export function render(): string {
  return `
    <section id="s82" class="view-section active">
      <div class="tool-intro">
        <h2>Section 82 Deposit</h2>
        <p>Estimate the deposit needed to raise maintenance issues as a defense at an eviction hearing.</p>
      </div>

      <div style="background:var(--state-warning-bg); color:var(--state-warning-fg); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <strong>Regulatory Uncertainty:</strong> The deposit requirement is NOT YET CONFIRMED. Bill 60 implies 50%, but final regulations are pending. Contact the LTB or a legal clinic before relying on this estimate.
      </div>

      <form id="s82-form">
        <label for="s82-arrears">Total Arrears Amount ($)</label>
        <input type="number" id="s82-arrears" min="0" step="0.01" required placeholder="e.g., 3000">
        <button type="submit" class="btn-primary">Calculate Deposit</button>
      </form>

      <div id="s82-result" role="region" aria-live="polite"></div>
    </section>
  `;
}

export function init(): void {
  const form = document.getElementById("s82-form") as HTMLFormElement | null;
  const resultDiv = document.getElementById("s82-result");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const arrearsInput = document.getElementById(
      "s82-arrears",
    ) as HTMLInputElement;
    const arrearsAmount = parseFloat(arrearsInput.value);

    if (isNaN(arrearsAmount) || arrearsAmount < 0) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="alert-box warning">
            Please enter a valid arrears amount.
          </div>
        `;
      }
      return;
    }

    const result = calculateSection82DepositFromDollars(arrearsAmount);

    // Record for session report
    recordCalculation(
      "s82",
      {
        arrearsAmount: dollarsToCents(arrearsAmount),
      },
      {
        depositRequired: result.depositRequired,
        depositPercentage: result.depositPercentage,
        regulatoryStatus: result.regulatoryStatus,
      },
    );

    if (resultDiv) {
      resultDiv.innerHTML = renderS82Result(result);
    }
  });
}

function renderS82Result(result: Section82Calculation): string {
  const {
    arrearsAmount,
    depositRequired,
    depositPercentage,
    regulatoryStatus,
    warnings,
  } = result;

  const statusLabel =
    regulatoryStatus === "confirmed"
      ? "Confirmed"
      : regulatoryStatus === "draft"
        ? "DRAFT - May Change"
        : "Pending";

  let html = `
    <div class="alert-box warning">
      <strong>Estimated Deposit: ${formatCurrency(depositRequired)}</strong>
      <br>
      <small>Status: ${statusLabel}</small>
    </div>
  `;

  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-card); border-radius:var(--radius-md);">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Arrears Amount:</span>
        <strong>${formatCurrency(arrearsAmount)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Deposit Percentage:</span>
        <strong>${(depositPercentage * 100).toFixed(0)}% (implied)</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">Estimated Deposit:</span>
        <strong>${formatCurrency(depositRequired)}</strong>
      </div>
    </div>
  `;

  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-base); border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
      <strong style="display:block; margin-bottom:0.5rem;">What is Section 82?</strong>
      <p style="margin:0; color:var(--text-secondary); font-size:0.9rem;">
        Section 82 lets you raise maintenance and repair issues as a defense at an eviction hearing for unpaid rent. Bill 60 added a deposit requirement to use this defense.
      </p>
    </div>
  `;

  if (warnings.length > 0) {
    html += `
      <div style="margin-top:1rem; padding:1rem; background:var(--state-warning-bg); border-radius:var(--radius-md);">
        <strong style="display:block; margin-bottom:0.5rem; color:var(--state-warning-fg);">Important Warnings:</strong>
        <ul style="margin:0; padding-left:1.25rem; color:var(--state-warning-fg); font-size:0.9rem;">
          ${warnings.map((w) => `<li style="margin-bottom:0.5rem;">${w}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-card); border-radius:var(--radius-md);">
      <strong style="display:block; margin-bottom:0.5rem;">Next Steps:</strong>
      <ol style="margin:0; padding-left:1.25rem; color:var(--text-secondary); font-size:0.9rem;">
        <li style="margin-bottom:0.5rem;">Confirm the deposit amount with the LTB or a legal clinic</li>
        <li style="margin-bottom:0.5rem;">Send advance written notice to your landlord about maintenance issues</li>
        <li style="margin-bottom:0.5rem;">Document all maintenance problems with photos and records</li>
        <li style="margin-bottom:0.5rem;">Gather evidence: repair requests, landlord responses</li>
      </ol>
    </div>
  `;

  return html;
}
