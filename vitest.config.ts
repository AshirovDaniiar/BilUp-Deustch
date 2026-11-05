import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      // Pure, non-UI modules covered by characterisation tests in P0 (08 P0: coverage target applies to pure modules).
      include: [
        'src/services/srs.ts',
        'src/features/progress/stats.ts',
        'src/utils/*.ts',
        'src/i18n/index.ts',
        'src/app/store.tsx',
        'src/pwa/sw-core.ts',
        'src/pwa/register.ts',
        'src/pwa/PwaPrompt.tsx',
        'src/storage/*.ts',
        'src/app/StorageNotice.tsx',
        'src/app/RecoveryPanel.tsx',
        'src/progress/*.ts',
        'src/features/tests/PassNote.tsx',
        'src/features/progress/stats.ts',
      ],
    },
  },
})
