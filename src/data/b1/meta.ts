import type { B1UnitMeta } from './meta-types'
import { UNIT_21_META } from './unit21/meta'
import { UNIT_22_META } from './unit22/meta'
import { UNIT_23_META } from './unit23/meta'
import { UNIT_24_META } from './unit24/meta'
import { UNIT_25_META } from './unit25/meta'
import { UNIT_26_META } from './unit26/meta'
import { UNIT_27_META } from './unit27/meta'
import { UNIT_28_META } from './unit28/meta'
import { UNIT_29_META } from './unit29/meta'
import { UNIT_30_META } from './unit30/meta'
import { UNIT_31_META } from './unit31/meta'
import { UNIT_32_META } from './unit32/meta'

// The metadata TYPES live in ./meta-types (so that unit modules can import them without a cycle); they are re-exported here, the one place the
// validator and the tests import from.
export * from './meta-types'

/**
 * Authored B1 unit metadata: one entry per authored unit (Units 21–32 (all of B1)). Nothing in the application reads it, so it never ships. An entry is
 * added together with each authored unit; the approved identities and the allocation live in registry.ts and scripts/content-validate/b1/curriculum.ts.
 */
export const B1_META: readonly B1UnitMeta[] = [UNIT_21_META, UNIT_22_META, UNIT_23_META, UNIT_24_META, UNIT_25_META, UNIT_26_META, UNIT_27_META, UNIT_28_META, UNIT_29_META, UNIT_30_META, UNIT_31_META, UNIT_32_META]
