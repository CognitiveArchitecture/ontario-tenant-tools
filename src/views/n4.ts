/**
 * Ontario Tenant Tools - N4 Calculator View
 *
 * Calculates the 7 business day cure period for N4 notices.
 * Uses correct business-day logic from @core/dates.
 */

import { calculateN4Deadline } from "@core/dates";
import type { N4Calculation } from "@core/types";
import { recordCalculation } from "../utils/session";

export function render(): string {
  return `
    <section id="n4" class="view-section active">
      <div class="tool-intro">
        <h2>N4 Notice - Unpaid Rent</h2>
        <p>Calculate your 7 business day deadline to pay rent and void the notice.</p>
      </div>

      <div style="background:var(--surface-card); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; border-left:4px solid var(--brand-primary);">
        <strong>Verify:</strong> Ensure the paper says "Form N4" at the top right.
      </div>

      <form id="n4-form">
        <label for="n4-date">Date you received the Form N4</label>
        <input type="date" id="n4-date" required>
        <button type="submit" class="btn-primary">Calculate Deadline</button>
      </form>

      <div id="n4-result" role="region" aria-live="polite"></div>
    </section>
  `;
}

export function init(): void {
  const form = document.getElementById("n4-form") as HTMLFormElement | null;
  const resultDiv = document.getElementById("n4-result");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const dateInput = document.getElementById("n4-date") as HTMLInputElement;
    const dateValue = dateInput.value;

    if (!dateValue) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="alert-box warning">
            Please enter the date you received the N4 notice.
          </div>
        `;
      }
      return;
    }

    const result = calculateN4Deadline(dateValue);

    // Record for session report
    recordCalculation(
      "n4",
      { servedDate: dateValue },
      {
        cureDeadline: result.cureDeadline,
        daysRemaining: result.daysRemaining,
        isExpired: result.isExpired,
      },
    );

    if (resultDiv) {
      resultDiv.innerHTML = renderN4Result(result);
    }
  });
}

function renderN4Result(result: N4Calculation): string {
  const {
    daysRemaining,
    isExpired,
    servedDate,
    cureDeadline,
    canFileL1Date,
    workdaysSkipped,
  } = result;

  // Determine status class
  let statusClass = "";
  if (isExpired || daysRemaining <= 0) {
    statusClass = "critical";
  } else if (daysRemaining <= 2) {
    statusClass = "critical";
  } else if (daysRemaining <= 4) {
    statusClass = "warning";
  }

  // Calculate progress percentage (inverted: more time passed = more filled)
  const totalDays = 7;
  const daysPassed = totalDays - Math.max(0, daysRemaining);
  const progressPct = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100),
  );

  // Format dates for display
  const servedDateFormatted = formatDisplayDate(servedDate);
  const deadlineFormatted = formatDisplayDate(cureDeadline);
  const canFileFormatted = formatDisplayDate(canFileL1Date);

  let html = `
    <div class="timeline-container">
      <div class="timeline-labels">
        <span>Received: ${servedDateFormatted}</span>
        <span>Deadline: ${deadlineFormatted}</span>
      </div>
      <div class="timeline-bar">
        <div class="timeline-fill ${statusClass}" style="width:${progressPct}%"></div>
      </div>
      <div class="days-remaining ${statusClass}">
        ${isExpired ? "Deadline Has Passed" : `${daysRemaining} Business Days Remaining`}
      </div>
    </div>
  `;

  // Show skipped days (weekends/holidays)
  if (workdaysSkipped.length > 0) {
    html += `
      <div style="margin-top:1rem; padding:0.75rem; background:var(--surface-card); border-radius:var(--radius-md); font-size:0.85rem;">
        <strong>Days not counted:</strong>
        <ul style="margin:0.5rem 0 0; padding-left:1.25rem; color:var(--text-secondary);">
          ${workdaysSkipped.map((d) => `<li>${formatDisplayDate(d.date)} - ${d.reason}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  // Add important notes
  html += `
    <div class="alert-box ${isExpired ? "critical" : "warning"}" style="margin-top:1rem;">
      ${
        isExpired
          ? `<strong>Your deadline has passed.</strong> The landlord can now file an L1 application. Contact a legal clinic immediately for advice.`
          : `<strong>Pay by ${deadlineFormatted}</strong> to void this notice. If you don't pay, the landlord can file with the LTB starting ${canFileFormatted}.`
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
