// npm run review:package — writes the generated review packages of unit 11 to docs/review/.
import { mkdirSync, writeFileSync } from 'node:fs'
import { PACKAGE_FILES, cefrPackage, kyPackage } from './unit-package'

mkdirSync('docs/review', { recursive: true })
writeFileSync(PACKAGE_FILES.cefr, cefrPackage(11))
writeFileSync(PACKAGE_FILES.ky, kyPackage(11))
console.log(`[review] wrote ${PACKAGE_FILES.cefr} and ${PACKAGE_FILES.ky}`)
