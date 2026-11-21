# B1 Stage 1 — infrastructure (B1 registered, PLANNED, invisible)

B1 is registered in the course registry, has its own lazy content module/chunk, static test-id ownership, PWA/bundle tooling support and tests. **No B1 lesson exists, B1 stays `planned` with no released locale, nothing is committed.** Storage and Persistence are untouched.

## Changes
| File | Change |
| --- | --- |
| `src/data/course.ts` | B1 added: `planned`, units 21–32, `releasedLocales: []` |
| `src/data/b1/registry.ts` (new) | `B1_UNIT_PLAN = []` — empty on purpose: unit identity is permanent and the curriculum is not approved |
| `src/data/b1/b1-content.ts` (new) | `B1_CONTENT` (all collections empty) — the only lazy entry point (`assets/b1-content-*.js`, 0.23 kB) |
| `src/data/catalog.ts` | A2-only lazy code → `LazyLevel`, `LIVE` slots, `LOADERS` (one literal `import()` per level), `isLazyLevel`, `LevelPayload`; `isLevelContentLoaded`/`registerLevelContent`/`loadLevelContent` are level-generic; error/retry/idempotence behaviour unchanged |
| `src/data/a2/types.ts` | `PlannedUnit.level: 'A2'` → `LanguageLevel` (type-only) |
| `src/app/routeAccess.ts` | `levelOfTestId`: `level-<x>`/`placement-<x>` for any registered non-A1 level (was the two A2 literals); `placement-a1` and unregistered levels stay unowned |
| `scripts/pwa/vite-plugin.ts`, `scripts/regression/bundle-size.mjs` | lazy-chunk regex `a\d-content` → `[a-z]\d-content` (otherwise `b1-content` would be **precached for everyone**); report labels |
| `scripts/content-validate/bundle.ts` | registers B1 content statically (validator sees all levels) |
| `scripts/content-validate/rules/identity.ts` | `plan-missing` no longer fires for a **planned** level with no units (it fired for B1 because A2 has a plan) |

## Verified against the audit (deviations from the Stage 0 documents)
* Audit said the `isLevelContentLoaded` clause treated unregistered B1 as loaded — true, now fixed by the `LOADERS` map.
* Audit proposed type-only imports from `a2/types` in B1 — implemented; the boundary test had to be extended (see tests), since it forbade any importer of A2 outside the catalog.
* Not needed: storage changes (B1 ids `level-b1`/`placement-b1` are already protected by `/^(placement|level-)/`; `LEVELS` already contained `B1`).
* Not done in this stage (as planned): per-level validator profile, Beta notice text parametrisation (B1 is invisible, so the A2-only wording cannot show), A2 isolation baseline test.

## Tests
New `tests/b1/b1-infrastructure.test.ts` (18): registry, id ranges/no collision, planned visibility ru/ky/de, route protection, route gate, loader (A2 regression, B1 slot, preview rules), assessment ids, protected result ids, manifest/precache exclusion, bundle-size regex. Extended: `lazy-chunk` (build output: B1 chunk, not precached, two lazy files), `lazy-cache` (two lazy levels), `data-boundary` (B1 import rules, B1 laziness). Updated for legitimately changed expectations: `catalog.test.ts` (B1 registered, ids 21–32 owned, empty B1 slot), `prerequisites.test.tsx` (`unit-21` is B1), `metadata.test.ts` (out-of-range probe id 25 → 99), `unit-11…20.test.ts` (the "no unit-missing in release" assertion is scoped to A2 units, because release mode correctly reports B1's missing units).

## Known effect
`npm run content:validate:release` now reports **44** errors (was 31): +13 for B1 (12 `unit-missing`, 1 level test). Release was already red; authoring mode is unchanged (0 errors, 0 warnings, 31 review flags).
