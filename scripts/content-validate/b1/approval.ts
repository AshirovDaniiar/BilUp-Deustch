// The record of the owner's approval of B1 curriculum v2 (docs/b1/B1_CURRICULUM_V2_APPROVAL.md §10).
//
// WHAT WAS APPROVED: the educational PRODUCT DESIGN — 12 units (21–32), 29 grammar concepts and their allocation, 38–42 new words per unit,
// the productive / limited-productive / receptive classifications, progressive text lengths, four-skill objectives, Unit 32 as consolidation
// without new grammar, Russian and Kyrgyz explanations, no German interface for B1, and the 40-item final assessment as an INDICATIVE progress
// instrument (not certification).
//
// WHAT WAS NOT APPROVED: this is NOT an official CEFR approval and no independent CEFR expert has verified anything. Every grammar decision the
// dossier marks ⚑ stays "pending independent expert verification" (see `expertReview` in curriculum.ts); none was silently upgraded.
//
// Only a person may change this record. The validator and Claude Code must never flip it on their own.
export interface B1ApprovalRecord {
  recorded: boolean
  /** who approved; the owner's name is deliberately not stored in the repository */
  by: string | null
  date: string | null
  /** what the approval covers */
  scope: 'product-design'
  /** the independent CEFR expert verification of the ⚑ decisions: NOT done */
  cefrExpertVerification: 'pending'
  /** where the decision is documented */
  reference: string
}

export const B1_APPROVAL: B1ApprovalRecord = {
  recorded: true,
  by: 'owner (instruction of the B1 Stage 2D session)',
  date: '2026-11-20',
  scope: 'product-design',
  cefrExpertVerification: 'pending',
  reference: 'docs/b1/B1_CURRICULUM_V2_APPROVAL.md §10',
}
