# Debug Sprint Log

**Branch:** `debug-sprint`
**Started:** 2026-02-04
**Goal:** ~175 new tests, >95% coverage on business logic

---

## Baseline (Pre-Sprint)

| Metric           | Value  |
| ---------------- | ------ |
| Total Tests      | 168    |
| Test Files       | 6      |
| Overall Coverage | 61.83% |

### Coverage by Module

| Module              | Statements | Branch | Functions | Lines  |
| ------------------- | ---------- | ------ | --------- | ------ |
| packages/calculator | 70.95%     | 93.33% | 66.66%    | 70.95% |
| packages/core       | 94.56%     | 84.21% | 77.77%    | 94.56% |
| packages/glossary   | 100%       | 100%   | 100%      | 100%   |
| src/components      | 0%         | 0%     | 0%        | 0%     |
| src/utils           | 64.81%     | 78.26% | 47.05%    | 64.81% |
| src/views           | 42.01%     | 100%   | 34.48%    | 42.01% |

### Uncovered Lines (Critical Functions)

**packages/core/dates.ts:**

- Lines 257-271, 277-282, 288-289, 295-300

**packages/calculator/arrears.ts:**

- Lines 133-186 (generateLedgerText)
- Lines 196-211 (validateCharge)
- Lines 217-228 (validatePayment)

**packages/calculator/rent-increase.ts:**

- Lines 164-165, 175-225 (generateRentIncreaseSummary)

**packages/calculator/section82.ts:**

- Lines 68-72, 139-199 (generateSection82Summary)

---

## Phase 1: Critical Business Logic

### Agent-DATES (80 tests added to core.test.ts)

| Function                | Tests Added | Notes                                               |
| ----------------------- | ----------- | --------------------------------------------------- |
| addDays                 | 10          | Happy path, negative days, boundaries, leap year    |
| getHolidaysForYear      | 9           | Known years, unknown years, return type             |
| getNonBusinessDayReason | 7           | Weekend, holiday, business day                      |
| businessDaysBetween     | 6           | Same week, cross weekend, holidays                  |
| calendarDaysBetween     | 7           | Same month, boundaries, leap year                   |
| isValidDateString       | 9           | Valid formats, invalid formats, rollover limitation |
| calculateN4Deadline     | 4           | Weekend/holiday spans, year boundary                |
| calculateN12Deadline    | 3           | Zero rent, 60/120 day compensation                  |
| calculateReviewDeadline | 4           | Boundary cases, Bill 60 warning                     |
| centsToDollars          | 7           | Happy path, edge cases, large values                |
| dollarsToCents          | 7           | Floating point precision tests                      |
| formatCurrency          | 5           | Negative, zero, large, comma separators             |

**Bugs Documented:**

- `isValidDateString` accepts Feb 30, Feb 29 in non-leap years (Date rollover)

### Agent-ARREARS (52 tests added in arrears.test.ts)

| Function                 | Tests Added | Notes                                      |
| ------------------------ | ----------- | ------------------------------------------ |
| calculateArrears         | 21          | FIFO, empty arrays, overpayment, late fees |
| generateLedgerText       | 10          | Normal, zero balance, large, warnings      |
| validateCharge           | 12          | Valid, missing fields, invalid values      |
| validatePayment          | 9           | Valid, missing fields, invalid values      |
| createChargeFromDollars  | 11          | All params, optional, floating point       |
| createPaymentFromDollars | 8           | All params, floating point                 |
| Integration              | 1           | Full workflow test                         |

**Bugs Documented:**

- `validateCharge` accepts zero amounts (no validation)
- `LedgerEntry` doesn't have `type` field to distinguish charge/payment

---

## Phase 2: Calculator Modules

### Agent-RENT (12 tests added to rent-increase.test.ts)

| Function                    | Tests Added | Notes                                      |
| --------------------------- | ----------- | ------------------------------------------ |
| getAllGuidelineRates        | 3           | Happy path, historical years, immutability |
| generateRentIncreaseSummary | 5           | Legal, illegal, exempt, overage            |
| getGuidelineRate            | 3           | Historical years 2023-2026                 |
| calculateRentIncrease       | 1           | Very large rents                           |

### Agent-S82 (10 tests added to section82.test.ts)

| Function                  | Tests Added | Notes                                   |
| ------------------------- | ----------- | --------------------------------------- |
| generateSection82Summary  | 6           | Normal, zero, large, regulatory warning |
| calculateSection82Deposit | 4           | Negative, NaN, Infinity inputs          |

**Bugs Documented:**

- `calculateSection82Deposit` accepts negative, NaN, Infinity without validation

---

## Phase 3: Data Layer

### Agent-DATA

| Function | Tests Added | Notes |
| -------- | ----------- | ----- |
|          |             |       |

---

## Phase 4: UI Layer

### Agent-UI

| Function | Tests Added | Notes |
| -------- | ----------- | ----- |
|          |             |       |

---

## Bugs Discovered

| ID  | Module | Description | Severity | Fix Status |
| --- | ------ | ----------- | -------- | ---------- |
|     |        |             |          |            |

---

## Final Results

| Metric              | Before | After  | Delta   |
| ------------------- | ------ | ------ | ------- |
| Total Tests         | 168    | 322    | +154    |
| Overall Coverage    | 61.83% | 68.26% | +6.43%  |
| packages/calculator | 70.95% | 99.27% | +28.32% |
| packages/core       | 94.56% | 99.34% | +4.78%  |
| packages/glossary   | 100%   | 100%   | —       |

### Tests Added By Phase

| Phase     | Module                       | Tests Added |
| --------- | ---------------------------- | ----------- |
| Phase 1   | core/dates.ts, core/types.ts | 80          |
| Phase 1   | calculator/arrears.ts        | 52          |
| Phase 2   | calculator/rent-increase.ts  | 12          |
| Phase 2   | calculator/section82.ts      | 10          |
| **Total** |                              | **154**     |

### Bugs Documented (Not Fixed)

1. **isValidDateString** — Accepts invalid calendar dates (Feb 30, Feb 29 non-leap) due to Date rollover
2. **validateCharge** — Accepts zero amounts without validation
3. **calculateSection82Deposit** — Accepts negative, NaN, Infinity without validation
4. **LedgerEntry** — No `type` field to distinguish charge/payment entries
