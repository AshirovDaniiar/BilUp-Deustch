// Test helper: load the (lazy) A2 content into the catalog, exactly as `loadLevelContent('A2', { preview: true })` does in development,
// but synchronously and through a STATIC import so that `vi.mock` of individual A2 modules applies. Tests that read A2 through the
// catalog import this file for its side effect. It never changes the course registry: A2 stays planned and invisible.
import { A2_CONTENT } from '../src/data/a2/a2-content'
import { registerLevelContent } from '../src/data/catalog'

registerLevelContent('A2', A2_CONTENT)
