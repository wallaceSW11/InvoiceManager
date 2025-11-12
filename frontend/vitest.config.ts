import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/main.ts',
        'src/App.vue',
        'src/vite-env.d.ts',
        'src/pwa.d.ts',
        '**/*.config.ts',
        '**/index.ts', // barrel files
        'src/presentation/views/**', // Views will be tested with Cypress
        'src/presentation/components/**', // Components will be tested with Cypress
        'src/presentation/plugins/**', // Plugin configuration
        'src/presentation/router/**', // Router will be tested with e2e
        'src/presentation/i18n/locales/**', // i18n translation files
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 80,
        statements: 95
      }
    },
    setupFiles: ['./src/__tests__/setup.ts']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
