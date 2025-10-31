import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Invoice Manager',
        short_name: 'InvoiceManager',
        description: 'Gerenciador de Faturas de Cartão de Crédito',
        theme_color: '#1976D2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separa node_modules em chunks específicos
          if (id.includes('node_modules')) {
            // Vuetify e seus componentes
            if (id.includes('vuetify')) {
              return 'vuetify';
            }
            // Vue core (vue, vue-router, pinia)
            if (id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            }
            if (id.includes('node_modules/vue/')) {
              return 'vue-vendor';
            }
            // i18n
            if (id.includes('vue-i18n')) {
              return 'i18n';
            }
            // Outras dependências grandes
            return 'vendor';
          }
        }
      }
    },
    // Aumenta o limite do aviso para chunks maiores
    chunkSizeWarningLimit: 700,
  }
})
