# B1 Stage 2D — owner approval of the product design, permanent identities

The owner approved the B1 **educational product design** (curriculum v2). This is **not** an official CEFR approval; all ⚑ decisions (D-1…D-15) remain pending independent expert verification. B1 stays `planned`, `releasedLocales: []`, invisible to every learner and interface language (German never). No lesson exists. Nothing is committed; the 15 staged storage/app files are untouched.

## Approval status
Recorded in `scripts/content-validate/b1/approval.ts` (`recorded: true`, scope `product-design`, date 2026-11-20, `cefrExpertVerification: 'pending'`) and in the dossier §10 (only the owner row is filled; the three reviewer rows are blank). The owner's name is not stored.

## Reconciliation (dossier ↔ curriculum ↔ validator configuration)
| Finding | Resolution |
| --- | --- |
| 29 concepts, 12 units, ids, units, loads, per-unit counts | consistent; now pinned by a test that parses the dossier |
| `b1-genitivattribute`: dossier "R-first; P-lim ⚑", configuration said **P-lim** (a silent upgrade of an uncertain decision) | configuration corrected to the conservative **R**, `expertReview` pending; the upgrade is the expert's call |
| Nine ⚑ concepts had no machine-readable marker | `expertReview: pending` (decision id + note) in the configuration; validator review flag `b1-expert-review-pending`; a test ties the flag set to the dossier's ⚑ rows |
| Config field `proposedId`, file `curriculum.provisional.ts` | renamed `id` / `curriculum.ts` (now permanent identities) |
| D-15 (titles of Units 25–27) | registered as in dossier §2, approved with the dossier; changeable until those units are authored |
| `B1_META` | **left empty**: an entry is authored unit metadata (German objectives with independent Russian and Kyrgyz texts, scenario id, strand items) — not approved information, and the ru/ky texts must not be invented. What is approved (identities, allocation, proficiency, load, caps, requirements) lives in `registry.ts` and `curriculum.ts` |

## Permanent identities
Units 21–32 with keys and German titles, vocabulary-key and lesson-id conventions and the 29 concept ids: **`docs/b1/B1_ID_CONVENTIONS.md`** (registered in `src/data/b1/registry.ts`).

## Files changed
New: `docs/b1/B1_ID_CONVENTIONS.md`, `docs/implementation/B1_STAGE2D_APPROVAL.md`, `tests/content-validate/b1-approval.test.ts`. Renamed: `scripts/content-validate/b1/curriculum.provisional.ts` → `curriculum.ts`. Changed: `src/data/b1/registry.ts` (12 plan entries), `src/data/b1/meta.ts` (comment), `scripts/content-validate/b1/{approval,curriculum,types}.ts`, `rules/b1.ts` (expert-review flag), `bundle.ts` (import), tests (`b1-fixtures`, `b1-profile`, `tests/b1/b1-infrastructure`, `tests/data/catalog` — expectations that encoded "empty plan" / "unapproved"), docs (`B1_CURRICULUM_V2_APPROVAL`, `B1_CURRICULUM`, `B1_IMPLEMENTATION_PLAN`, `B1_QA_CHECKLIST`). Preserved untouched: `archive/B1_CURRICULUM_v1_STAGE0.md`, `B1_CURRICULUM_REVIEW.md`, A1/A2 content, Storage/Persistence.
