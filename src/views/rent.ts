/**
 * Ontario Tenant Tools - Rent Increase Calculator View
 *
 * Checks if a rent increase is within Ontario's guideline.
 */

import { calculateRentIncreaseFromDollars } from "@calculator/rent-increase";
import { formatCurrency, dollarsToCents } from "@core/types";
import type { RentIncreaseCalculation } from "@core/types";
import { recordCalculation } from "../utils/session";

export function render(): string {
  return `
    <section id="rent" class="view-section active">
      <div class="tool-intro">
        <h2>Rent Increase Check</h2>
        <p>Check if a rent increase is legal. The 2025 guideline is <strong>2.5%</strong>.</p>
      </div>

      <form id="rent-form">
        <label for="cur-rent">Current Monthly Rent ($)</label>
        <input type="number" id="cur-rent" min="0" step="0.01" required placeholder="e.g., 1500">

        <label for="new-rent">New Rent Demanded ($)</label>
        <input type="number" id="new-rent" min="0" step="0.01" required placeholder="e.g., 1550">

        <button type="submit" class="btn-primary">Check Legality</button>
      </form>

      <div id="rent-result" role="region" aria-live="polite"></div>
    </section>
  `;
}

export function init(): void {
  const form = document.getElementById("rent-form") as HTMLFormElement | null;
  const resultDiv = document.getElementById("rent-result");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const curRentInput = document.getElementById(
      "cur-rent",
    ) as HTMLInputElement;
    const newRentInput = document.getElementById(
      "new-rent",
    ) as HTMLInputElement;

    const currentRent = parseFloat(curRentInput.value);
    const proposedRent = parseFloat(newRentInput.value);

    if (isNaN(currentRent) || isNaN(proposedRent) || currentRent <= 0) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="alert-box warning">
            Please enter valid rent amounts.
          </div>
        `;
      }
      return;
    }

    const result = calculateRentIncreaseFromDollars(
      currentRent,
      proposedRent,
      2025,
    );

    // Record for session report
    recordCalculation(
      "rent",
      {
        currentRent: dollarsToCents(currentRent),
        proposedRent: dollarsToCents(proposedRent),
      },
      {
        isLegal: result.isLegal,
        maximumAllowed: result.maximumAllowed,
        overageAmount: result.overageAmount,
        exemptFromGuideline: result.exemptFromGuideline,
      },
    );

    if (resultDiv) {
      resultDiv.innerHTML = renderRentResult(result);
    }
  });
}

function renderRentResult(result: RentIncreaseCalculation): string {
  const {
    isLegal,
    exemptFromGuideline,
    maximumAllowed,
    overageAmount,
    guidelineRate,
    warnings,
  } = result;

  let statusClass: string;
  let statusText: string;

  if (exemptFromGuideline) {
    statusClass = "warning";
    statusText = "Potentially Exempt";
  } else if (isLegal) {
    statusClass = "success";
    statusText = "Within Guideline";
  } else {
    statusClass = "critical";
    statusText = "Exceeds Guideline";
  }

  let html = `
    <div class="alert-box ${statusClass}">
      <strong>${statusText}</strong>
    </div>
  `;

  // Details section
  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-card); border-radius:var(--radius-md);">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Guideline Rate:</span>
        <strong>${(guidelineRate * 100).toFixed(1)}%</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Maximum Allowed:</span>
        <strong>${formatCurrency(maximumAllowed)}</strong>
      </div>
      ${
        !isLegal && !exemptFromGuideline
          ? `
      <div style="display:flex; justify-content:space-between; color:var(--state-danger-fg);">
        <span>Amount Over Guideline:</span>
        <strong>${formatCurrency(overageAmount)}</strong>
      </div>
      `
          : ""
      }
    </div>
  `;

  // Warnings
  if (warnings.length > 0) {
    html += `
      <div style="margin-top:1rem; padding:1rem; background:var(--surface-base); border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
        <strong style="display:block; margin-bottom:0.5rem;">Important:</strong>
        <ul style="margin:0; padding-left:1.25rem; color:var(--text-secondary); font-size:0.9rem;">
          ${warnings.map((w) => `<li style="margin-bottom:0.5rem;">${w}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  return html;
}
