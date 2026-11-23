// Captures the A1 regression baselines. Run ONLY on code whose A1 behaviour is the reference (Stage 0 of the A2 plan),
// or deliberately, with a recorded reason, when an approved intentional A1 change lands (e.g. D-1 lab scoping, D-4 option shuffle).
// Re-captured for A1 curriculum v2 (38 units): only the progress.scenarios levelProgress/currentUnit values changed (legacy units 2–10 are hidden;
// empty containers are never current). Grammar-reuse step: levelProgress changed again because 15 new units now carry an existing grammar lesson
// (one required section each). Content hashes and selectors are unchanged.
//   npx vite-node scripts/regression/capture-a1.ts
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { computeBehaviour, computeContentHashes, computeSelectors } from '../../tests/regression/a1-snapshot'

const dir = join(process.cwd(), 'tests/regression/baselines')
mkdirSync(dir, { recursive: true })
const write = (name: string, data: unknown) => {
  writeFileSync(join(dir, name), JSON.stringify(data, null, 1) + '\n')
  console.log('wrote', name)
}

write('a1-content-hashes.json', computeContentHashes())
write('a1-selectors.json', computeSelectors())
write('a1-behaviour.json', await computeBehaviour())
