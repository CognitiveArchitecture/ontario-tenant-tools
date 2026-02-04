/**
 * Ontario Tenant Tools - Legal Glossary
 * 
 * Plain-language definitions of Ontario housing law terms.
 * Updated for Bill 60 (November 2025).
 * 
 * Reading level target: Grade 5 (Flesch-Kincaid)
 */

import type { GlossaryTerm, Glossary } from '../core/types';

export const glossary: Glossary = {
  lastUpdated: '2025-11-30',
  terms: [
    // ============================================
    // Notices (N-Forms)
    // ============================================
    {
      term: 'N4 Notice',
      slug: 'n4-notice',
      definition: 'A notice from your landlord saying you owe rent. After you get this notice, you have 7 business days to pay what you owe. If you do not pay, the landlord can apply to evict you.',
      statutoryReference: 'RTA s. 59',
      relatedTerms: ['eviction', 'arrears', 'l1-application'],
      bill60Change: 'Bill 60 (2025) reduced the time to pay from 14 days to 7 business days.',
      warnings: ['This is a short deadline. Act quickly.'],
    },
    {
      term: 'N12 Notice',
      slug: 'n12-notice',
      definition: 'A notice saying the landlord, a buyer, or their close family wants to move into your unit. You must get at least 60 days notice. If you get 60 days notice, the landlord must pay you one month of rent. If they give you 120 days notice, they do not have to pay you anything.',
      statutoryReference: 'RTA s. 48, 49',
      relatedTerms: ['own-use-eviction', 'compensation'],
      bill60Change: 'Bill 60 (2025) removed the compensation requirement if the landlord gives 120 days notice instead of 60.',
    },
    {
      term: 'N13 Notice',
      slug: 'n13-notice',
      definition: 'A notice saying the landlord wants to tear down, renovate, or repair your building. This is sometimes called a "renoviction." You have the right to move back in after the work is done.',
      statutoryReference: 'RTA s. 50',
      relatedTerms: ['renoviction', 'right-of-first-refusal'],
    },

    // ============================================
    // Applications (L-Forms for Landlords)
    // ============================================
    {
      term: 'L1 Application',
      slug: 'l1-application',
      definition: 'A form the landlord files with the Landlord and Tenant Board to evict you for not paying rent. The landlord can only file this after the N4 notice time has passed.',
      statutoryReference: 'RTA s. 69',
      relatedTerms: ['n4-notice', 'ltb', 'eviction'],
    },
    {
      term: 'L2 Application',
      slug: 'l2-application',
      definition: 'A form the landlord files to evict you for reasons other than rent. This includes things like damage to the unit, bothering other tenants, or illegal activity.',
      statutoryReference: 'RTA s. 69',
      relatedTerms: ['eviction', 'ltb'],
    },

    // ============================================
    // Applications (T-Forms for Tenants)
    // ============================================
    {
      term: 'T2 Application',
      slug: 't2-application',
      definition: 'A form YOU can file if your landlord is not fixing problems in your home, bothering you, or breaking the rules. You can ask for a rent reduction or compensation.',
      statutoryReference: 'RTA s. 29, 31',
      relatedTerms: ['maintenance', 'section-82'],
    },
    {
      term: 'T6 Application',
      slug: 't6-application',
      definition: 'A form you can file if your landlord is not keeping your home in good repair. This is for maintenance problems like broken heating, pests, or mold.',
      statutoryReference: 'RTA s. 20',
      relatedTerms: ['maintenance', 't2-application'],
    },

    // ============================================
    // Key Concepts
    // ============================================
    {
      term: 'Eviction',
      slug: 'eviction',
      definition: 'When a landlord forces you to move out of your home. In Ontario, a landlord cannot evict you without going through the Landlord and Tenant Board. Only the Sheriff can physically remove you.',
      statutoryReference: 'RTA s. 37, 39',
      relatedTerms: ['ltb', 'sheriff', 'illegal-lockout'],
    },
    {
      term: 'Arrears',
      slug: 'arrears',
      definition: 'Rent you owe but have not paid. If you are behind on rent, you are "in arrears."',
      relatedTerms: ['n4-notice', 'l1-application'],
    },
    {
      term: 'Section 82 Defense',
      slug: 'section-82',
      definition: 'Your right to tell the Board about maintenance problems when you are facing eviction for unpaid rent. If your landlord did not fix serious problems, the Board might reduce what you owe.',
      statutoryReference: 'RTA s. 82',
      relatedTerms: ['maintenance', 'l1-application'],
      bill60Change: 'Bill 60 (2025) added new rules. You may need to give notice before the hearing and pay some of the rent into a trust account to use this defense.',
      warnings: ['The rules for this defense are changing. Get legal help.'],
    },
    {
      term: 'Request for Review',
      slug: 'request-for-review',
      definition: 'A form you can file to ask the LTB to look at a decision again. You must file within 15 days of the order.',
      statutoryReference: 'RTA s. 210',
      relatedTerms: ['ltb'],
      bill60Change: 'Bill 60 (2025) reduced the deadline from 30 days to 15 days.',
      warnings: ['This is a very short deadline. If you want to appeal, act immediately.'],
    },
    {
      term: 'Compensation (N12)',
      slug: 'compensation',
      definition: 'Money a landlord must pay you when they evict you so they or a family member can move in. The amount is one month of rent.',
      statutoryReference: 'RTA s. 48.1',
      relatedTerms: ['n12-notice', 'own-use-eviction'],
      bill60Change: 'Bill 60 (2025): If the landlord gives you 120 days notice, they do not have to pay compensation. If they give 60 days notice, they still must pay.',
    },
    {
      term: 'Landlord and Tenant Board (LTB)',
      slug: 'ltb',
      definition: 'The government tribunal that handles disputes between landlords and tenants in Ontario. They hold hearings and make decisions about evictions, repairs, and other issues.',
      relatedTerms: ['eviction', 'hearing'],
    },
    {
      term: 'Hearing',
      slug: 'hearing',
      definition: 'A meeting at the LTB where you and the landlord explain your sides. A member of the Board listens and makes a decision. You can attend in person, by phone, or by video.',
      relatedTerms: ['ltb', 'order'],
    },
    {
      term: 'Order',
      slug: 'order',
      definition: 'The written decision from the LTB after a hearing. It tells you what you must do and by when. Orders can be enforced by the Sheriff.',
      relatedTerms: ['ltb', 'hearing', 'sheriff'],
    },
    {
      term: 'Sheriff',
      slug: 'sheriff',
      definition: 'The only person who can legally force you to leave your home. The landlord must get a court order and have the Sheriff enforce it. Your landlord cannot lock you out or remove your belongings on their own.',
      relatedTerms: ['eviction', 'illegal-lockout'],
    },
    {
      term: 'Illegal Lockout',
      slug: 'illegal-lockout',
      definition: 'When a landlord changes your locks, removes your belongings, or blocks you from your home without an order from the Board. This is against the law. Call the police and the LTB.',
      statutoryReference: 'RTA s. 25, 26',
      relatedTerms: ['eviction', 'sheriff'],
    },
    {
      term: 'Maintenance',
      slug: 'maintenance',
      definition: 'Your landlord must keep your home in good repair. This includes fixing broken things, keeping the heat working, and dealing with pests. If they do not, you can file a complaint.',
      statutoryReference: 'RTA s. 20',
      relatedTerms: ['t2-application', 't6-application', 'section-82'],
    },
    {
      term: 'Renoviction',
      slug: 'renoviction',
      definition: 'When a landlord uses renovations as an excuse to evict tenants, often to raise the rent for new tenants. You have the right to move back in at your old rent after the work is done.',
      relatedTerms: ['n13-notice', 'right-of-first-refusal'],
    },
    {
      term: 'Right of First Refusal',
      slug: 'right-of-first-refusal',
      definition: 'After a renoviction, you have the right to move back into your unit at the same rent you were paying before. The landlord must offer it to you first.',
      statutoryReference: 'RTA s. 53',
      relatedTerms: ['n13-notice', 'renoviction'],
    },
    {
      term: 'Own Use Eviction',
      slug: 'own-use-eviction',
      definition: 'When a landlord evicts you because they say they or a close family member wants to live in the unit. The landlord must prove they really intend to move in.',
      relatedTerms: ['n12-notice', 'compensation'],
    },
    {
      term: 'Above Guideline Increase (AGI)',
      slug: 'agi',
      definition: 'A rent increase above the yearly limit set by the government. Landlords must apply to the LTB and prove they had extra costs, like major repairs.',
      statutoryReference: 'RTA s. 126',
    },
    {
      term: 'Rent Guideline',
      slug: 'rent-guideline',
      definition: 'The maximum amount a landlord can raise your rent each year without LTB approval. It changes every year based on inflation.',
      statutoryReference: 'RTA s. 120',
    },

    // ============================================
    // Bill 60 Specific Terms
    // ============================================
    {
      term: 'Bill 60',
      slug: 'bill-60',
      definition: 'A law passed in November 2025 that changed tenant rights in Ontario. It shortened the time to pay rent after an N4 notice, reduced appeal deadlines, and removed compensation for some evictions.',
      bill60Change: 'This is the law that made these changes.',
      warnings: ['Several rules changed. Make sure you know the new deadlines.'],
    },
    {
      term: 'Business Day',
      slug: 'business-day',
      definition: 'A day that is not a weekend (Saturday or Sunday) or a statutory holiday. When the law gives you a deadline in "business days," weekends and holidays do not count.',
      relatedTerms: ['n4-notice'],
    },
    {
      term: 'Calendar Day',
      slug: 'calendar-day',
      definition: 'Any day of the week, including weekends. When the law gives you a deadline in "calendar days," every day counts.',
      relatedTerms: ['request-for-review', 'n12-notice'],
    },
    {
      term: 'Persistent Late Payment',
      slug: 'persistent-late-payment',
      definition: 'Paying your rent late many times, even if you always pay eventually. Bill 60 gave the government power to define exactly what counts as "persistent." The rules are not yet written.',
      statutoryReference: 'RTA s. 59 (as amended)',
      bill60Change: 'Bill 60 (2025) created new rules about this, but the details are still being decided.',
      warnings: ['This rule is not final. Check for updates.'],
    },
  ],
};

// ============================================
// Glossary Search and Retrieval
// ============================================

/**
 * Find a term by its slug
 */
export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.terms.find(t => t.slug === slug);
}

/**
 * Find a term by name (case-insensitive)
 */
export function getTermByName(name: string): GlossaryTerm | undefined {
  const lower = name.toLowerCase();
  return glossary.terms.find(t => t.term.toLowerCase() === lower);
}

/**
 * Search terms by keyword (searches term and definition)
 */
export function searchTerms(query: string): GlossaryTerm[] {
  const lower = query.toLowerCase();
  return glossary.terms.filter(t => 
    t.term.toLowerCase().includes(lower) ||
    t.definition.toLowerCase().includes(lower)
  );
}

/**
 * Get all terms affected by Bill 60
 */
export function getBill60Terms(): GlossaryTerm[] {
  return glossary.terms.filter(t => t.bill60Change);
}

/**
 * Get all terms with warnings
 */
export function getTermsWithWarnings(): GlossaryTerm[] {
  return glossary.terms.filter(t => t.warnings && t.warnings.length > 0);
}

/**
 * Get related terms for a given term
 */
export function getRelatedTerms(slug: string): GlossaryTerm[] {
  const term = getTermBySlug(slug);
  if (!term || !term.relatedTerms) return [];
  
  return term.relatedTerms
    .map(s => getTermBySlug(s))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

/**
 * Get all terms sorted alphabetically
 */
export function getAllTermsSorted(): GlossaryTerm[] {
  return [...glossary.terms].sort((a, b) => 
    a.term.toLowerCase().localeCompare(b.term.toLowerCase())
  );
}

export default glossary;
