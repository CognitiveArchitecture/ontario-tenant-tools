/**
 * Ontario Tenant Tools - Core Type Definitions
 *
 * Shared types used across all packages.
 */

// ============================================
// Date and Calendar Types
// ============================================

export interface Holiday {
  date: string; // ISO 8601 format: YYYY-MM-DD
  name: string;
  rule?: string; // e.g., "third Monday of February"
  note?: string;
}

export interface CalendarYear {
  [year: string]: Holiday[];
}

export interface CalculationRule {
  days: number;
  type: "business_days" | "calendar_days";
  excludes?: ("weekends" | "statutory_holidays")[];
  note?: string;
}

export interface JudicialCalendar {
  metadata: {
    description: string;
    source: string;
    last_updated: string;
    notes?: string;
  };
  statutory_holidays: CalendarYear;
  ltb_closures: {
    note: string;
    annual_closures: Array<{
      period: string;
      name: string;
      note?: string;
    }>;
  };
  calculation_rules: {
    n4_notice: CalculationRule;
    n12_notice_standard: CalculationRule;
    n12_notice_extended: CalculationRule;
    review_period: CalculationRule;
  };
}

// ============================================
// Rent and Payment Types
// ============================================

export interface Payment {
  date: string; // ISO 8601
  amount: number; // in cents to avoid floating point issues
  description?: string;
}

export interface Charge {
  date: string; // ISO 8601
  amount: number; // in cents
  type: "rent" | "late_fee" | "utility" | "other";
  description?: string;
  period?: string; // e.g., "January 2025"
}

export interface LedgerEntry {
  date: string;
  description: string;
  charge: number; // positive = amount owed
  payment: number; // positive = amount paid
  balance: number; // running balance
}

export interface ArrearsCalculation {
  entries: LedgerEntry[];
  totalCharges: number;
  totalPayments: number;
  currentBalance: number; // positive = tenant owes
  lateFeeTotal: number;
  rentOnly: number; // balance excluding late fees
  warnings: ArrearsWarning[];
}

export interface ArrearsWarning {
  type: "illegal_late_fee" | "misapplied_payment" | "calculation_note";
  message: string;
}

// ============================================
// Notice and Deadline Types
// ============================================

export type NoticeType =
  | "N4" // Non-payment of rent
  | "N5" // Interference / damage
  | "N6" // Illegal act
  | "N7" // Serious impairment of safety
  | "N8" // Persistent late payment
  | "N12" // Landlord's own use
  | "N13"; // Renovation / demolition

export interface NoticeDeadline {
  noticeType: NoticeType;
  servedDate: string; // ISO 8601
  terminationDate: string; // ISO 8601
  cureDeadline?: string; // ISO 8601 (for N4)
  landlordCanFileDate: string; // ISO 8601
  daysRemaining: number;
  isExpired: boolean;
  warnings: string[];
}

export interface N4Calculation {
  servedDate: string;
  cureDeadline: string; // 7 business days (Bill 60)
  canFileL1Date: string;
  daysRemaining: number;
  isExpired: boolean;
  workdaysSkipped: Array<{ date: string; reason: string }>;
}

export interface N12Calculation {
  servedDate: string;
  terminationDate: string;
  noticeDays: 60 | 120;
  compensationRequired: boolean;
  compensationAmount: number; // in cents
  warnings: string[];
}

// ============================================
// Review and Appeal Types
// ============================================

export interface ReviewDeadline {
  orderDate: string; // ISO 8601
  deadline: string; // ISO 8601 (15 calendar days - Bill 60)
  daysRemaining: number;
  isExpired: boolean;
  warnings: string[];
}

// ============================================
// Rent Increase Types
// ============================================

export interface RentIncreaseCalculation {
  currentRent: Cents;
  proposedRent: Cents;
  guidelineYear: number;
  guidelineRate: number; // e.g., 0.025 for 2.5%
  maximumAllowed: Cents;
  isLegal: boolean;
  overageAmount: Cents; // Amount over guideline (0 if legal)
  exemptFromGuideline: boolean; // Post-Nov 2018 units exempt
  warnings: string[];
}

// ============================================
// Section 82 Types
// ============================================

export type RegulatoryStatus = "confirmed" | "draft" | "pending";

export interface Section82Calculation {
  arrearsAmount: Cents;
  depositRequired: Cents;
  depositPercentage: number; // e.g., 0.5 for 50%
  regulatoryStatus: RegulatoryStatus;
  warnings: string[];
}

// ============================================
// Timeline Visualization Types
// ============================================

export interface TimelineEvent {
  date: string; // ISO 8601
  title: string;
  description: string;
  type: "notice" | "deadline" | "hearing" | "milestone";
  isPast: boolean;
  isCritical: boolean;
}

export interface Timeline {
  events: TimelineEvent[];
  startDate: string;
  endDate: string;
  currentDate: string;
}

// ============================================
// Glossary Types
// ============================================

export interface GlossaryTerm {
  term: string;
  slug: string; // URL-safe identifier
  definition: string; // Plain language, Grade 5 reading level
  statutoryReference?: string; // e.g., "RTA s. 59"
  relatedTerms?: string[]; // slugs of related terms
  bill60Change?: string; // Note if Bill 60 changed this
  warnings?: string[];
}

export interface Glossary {
  terms: GlossaryTerm[];
  lastUpdated: string;
}

// ============================================
// UI State Types (Tier 2 - Future)
// ============================================

export interface SessionState {
  id: string;
  createdAt: string;
  lastModified: string;
  currentStep: string;
  data: Record<string, unknown>;
  isEncrypted: boolean;
}

// ============================================
// Safety Feature Types
// ============================================

export interface QuickExitConfig {
  exitUrl: string; // Neutral site to redirect to
  clearStorage: boolean;
  overwriteHistory: boolean;
}

// ============================================
// Form Types (LTB Forms)
// ============================================

export type LTBFormType =
  | "N4"
  | "N5"
  | "N6"
  | "N7"
  | "N8"
  | "N12"
  | "N13"
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "L8"
  | "L9"
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "RequestForReview";

export interface LTBForm {
  type: LTBFormType;
  name: string;
  description: string;
  url: string; // Link to official LTB form
  category: "notice" | "landlord_application" | "tenant_application" | "other";
  deadline?: CalculationRule;
}

// ============================================
// Utility Types
// ============================================

/** Money in cents to avoid floating point errors */
export type Cents = number;

/** Convert dollars to cents */
export function dollarsToCents(dollars: number): Cents {
  return Math.round(dollars * 100);
}

/** Convert cents to dollars */
export function centsToDollars(cents: Cents): number {
  return cents / 100;
}

/** Format cents as currency string */
export function formatCurrency(cents: Cents): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(centsToDollars(cents));
}
