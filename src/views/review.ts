/**
 * Ontario Tenant Tools - Review Deadline Calculator View
 *
 * Calculates the 15-day deadline to request review of an eviction order.
 */

import { calculateReviewDeadline } from "@core/dates";
import type { ReviewDeadline } from "@core/types";
import { recordCalculation } from "../utils/session";

export function render(): string {
  return `
    <section id="review" class="view-section active">
      <div class="tool-intro">
        <h2>Eviction Order Review</h2>
        <p>Calculate your deadline to request a review of an eviction order.</p>
      </div>

      <div style="background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; border-left:4px solid #ef4444;">
        <strong>Critical:</strong> You have only <strong>15 days</strong> to request a review. This deadline was reduced by Bill 60.
      </div>

      <form id="review-form">
        <label for="order-date">Date Issued (shown on the order)</label>
        <input type="date" id="order-date" required>
        <button type="submit" class="btn-primary">Check Deadline</button>
      </form>

      <div id="review-result" role="region" aria-live="polite"></div>
    </section>
  `;
}

export function init(): void {
  const form = document.getElementById("review-form") as HTMLFormElement | null;
  const resultDiv = document.getElementById("review-result");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateInput = document.getElementById("order-date") as HTMLInputElement;
    const dateValue = dateInput.value;

    if (!dateValue) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="alert-box warning">
            Please enter the date shown on the eviction order.
          </div>
        `;
      }
      return;
    }

    const result = calculateReviewDeadline(dateValue);

    // Record for session report
    recordCalculation(
      "review",
      { orderDate: dateValue },
      {
        deadline: result.deadline,
        daysRemaining: result.daysRemaining,
        isExpired: result.isExpired,
      },
    );

    if (resultDiv) {
      resultDiv.innerHTML = renderReviewResult(result);
    }
  });
}

function renderReviewResult(result: ReviewDeadline): string {
  const { daysRemaining, isExpired, orderDate, deadline, warnings } = result;

  const statusClass = isExpired || daysRemaining <= 3 ? "critical" : "warning";
  const deadlineFormatted = formatDisplayDate(deadline);
  const orderDateFormatted = formatDisplayDate(orderDate);

  let html = `
    <div class="alert-box ${statusClass}">
      <strong>File By: ${deadlineFormatted}</strong><br>
      ${isExpired ? "Deadline Has Passed" : `${daysRemaining} Days Remaining`}
    </div>
  `;

  html += `
    <div style="margin-top:1rem; padding:1rem; background:var(--surface-card); border-radius:var(--radius-md);">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
        <span style="color:var(--text-secondary);">Order Date:</span>
        <strong>${orderDateFormatted}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">Review Deadline:</span>
        <strong>${deadlineFormatted}</strong>
      </div>
    </div>
  `;

  if (warnings.length > 0) {
    html += `
      <div style="margin-top:1rem; padding:1rem; background:var(--surface-base); border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.1);">
        <ul style="margin:0; padding-left:1.25rem; color:var(--text-secondary); font-size:0.9rem;">
          ${warnings.map((w) => `<li style="margin-bottom:0.5rem;">${w}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  html += `
    <div class="alert-box ${isExpired ? "critical" : "warning"}" style="margin-top:1rem;">
      ${
        isExpired
          ? `<strong>Your deadline has passed.</strong> Contact a legal clinic immediately to discuss your options.`
          : `<strong>Act quickly.</strong> File a Request for Review with the LTB before ${deadlineFormatted}. Contact a legal clinic for help.`
      }
    </div>
  `;

  return html;
}

function formatDisplayDate(isoDate: string): string {
  try {
    const date = new Date(isoDate + "T12:00:00");
    return date.toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}
