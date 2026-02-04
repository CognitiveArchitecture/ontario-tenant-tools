/**
 * Ontario Tenant Tools - N12 Calculator View
 *
 * Determines if compensation is owed for an N12 (landlord's own use) notice.
 */

import { calculateN12Deadline } from "@core/dates";
import { dollarsToCents, formatCurrency } from "@core/types";
import type { N12Calculation } from "@core/types";
import { recordCalculation } from "../utils/session";

export function render(): string {
  return `
    <section id="n12" class="view-section active">
      <div class="tool-intro">
        <h2>N12 - Landlord Moving In</h2>
        <p>Check if you are owed one month's rent compensation.</p>
      </div>

      <form id="n12-form">
        <label for="n12-notice-date">Date you received the N12 notice</label>
        <input type="date" id="n12-notice-date" required>

        <label for="n12-termination-date">Termination Date (move-out date on notice)</label>
        <input type="date" id="n12-termination-date" required>

        <label for="n12-rent">Monthly Rent ($)</label>
        <input type="number" id="n12-rent" min="0" step="0.01" required placeholder="e.g., 1500">

        <button type="submit" class="btn-primary">Check Compensation</button>
      </form>

      <div id="n12-result" role="region" aria-live="polite"></div>
    </section>
  `;
}

export function init(): void {
  const form = document.getElementById("n12-form") as HTMLFormElement | null;
  const resultDiv = document.getElementById("n12-result");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const noticeDateInput = document.getElementById(
      "n12-notice-date",
    ) as HTMLInputElement;
    const terminationDateInput = document.getElementById(
      "n12-termination-date",
    ) as HTMLInputElement;
    const rentInput = document.getElementById("n12-rent") as HTMLInputElement;

    const noticeDate = noticeDateInput.value;
    const terminationDate = terminationDateInput.value;
    const monthlyRent = parseFloat(rentInput.value);

    if (
      !noticeDate ||
      !terminationDate ||
      isNaN(monthlyRent) ||
      monthlyRent <= 0
    ) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="alert-box warning">
            Please fill in all fields.
          </div>
        `;
      }
      return;
    }

    // Calculate days between notice and termination
    const notice = new Date(noticeDate + "T12:00:00");
    const termination = new Date(terminationDate + "T12:00:00");
    const daysBetween = Math.ceil(
      (termination.getTime() - notice.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Use 60 or 120 day calculation based on the actual period
    const noticeDays = daysBetween >= 120 ? 120 : 60;
    const result = calculateN12Deadline(
      noticeDate,
      noticeDays as 60 | 120,
      dollarsToCents(monthlyRent),
    );

    // Record for session report
    recordCalculation(
      "n12",
      {
        noticeDate,
        terminationDate,
        monthlyRent: dollarsToCents(monthlyRent),
      },
      {
        compensationRequired: result.compensationRequired,
        compensationAmount: result.compensationAmount,
        noticeDays: daysBetween,
      },
    );

    if (resultDiv) {
      resultDiv.innerHTML = renderN12Result(result, daysBetween);
    }
  });
}

function renderN12Result(result: N12Calculation, actualDays: number): string {
  const { compensationRequired, compensationAmount, noticeDays, warnings } =
    result;

  const statusClass = compensationRequired ? "success" : "warning";
  const statusText = compensationRequired
    ? "Compensation Owed"
    : "No Compensation Required";

  let html = `
    <div class="alert-box ${statusClass}">
      <strong>${statusText}</strong>
    </div>
  `;

  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-card); border-radius:var(--radius-md);">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Notice Period:</span>
        <strong>${actualDays} days</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Threshold:</span>
        <strong>${noticeDays >= 120 ? "120+ days (no compensation)" : "< 120 days (compensation owed)"}</strong>
      </div>
      ${
        compensationRequired
          ? `
      <div style="display:flex; justify-content:space-between; color:var(--state-success-fg);">
        <span>Compensation Amount:</span>
        <strong>${formatCurrency(compensationAmount)}</strong>
      </div>
      `
          : ""
      }
    </div>
  `;

  if (warnings.length > 0) {
    html += `
      <div style="margin-top:1rem; padding:1rem; background:var(--surface-base); border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
        <strong style="display:block; margin-bottom:0.5rem;">Bill 60 Changes:</strong>
        <ul style="margin:0; padding-left:1.25rem; color:var(--text-secondary); font-size:0.9rem;">
          ${warnings.map((w) => `<li style="margin-bottom:0.5rem;">${w}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  html += `
    <div class="alert-box warning" style="margin-top:1rem;">
      ${
        compensationRequired
          ? `<strong>You are owed ${formatCurrency(compensationAmount)}.</strong> The landlord must pay this before the termination date. If they don't pay, you may be able to stay.`
          : `<strong>Bill 60 Change:</strong> With 120+ days notice, landlords are no longer required to pay compensation. This is a significant change from previous rules.`
      }
    </div>
  `;

  return html;
}
