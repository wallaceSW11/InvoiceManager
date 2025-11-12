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
      devOptions: {
        enabled: false,
        type: 'module'
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Invoice Manager',
        short_name: 'Invoice Manager',
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
        navigateFallback: undefined,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vuetify')) {
              return 'vuetify';
            }
            if (id.includes('@mdi/font')) {
              return 'mdi';
            }
            if (id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            }
            if (id.includes('/vue/') || id.includes('/vue@')) {
              return 'vue-vendor';
            }
            if (id.includes('vue-i18n')) {
              return 'i18n';
            }
            if (id.includes('@wallacesw11/base-lib')) {
              return 'base-lib';
            }
            if (id.includes('big.js') || id.includes('v-money3')) {
              return 'math-utils';
            }
            if (id.includes('axios')) {
              return 'axios';
            }
            if (id.includes('workbox')) {
              return 'pwa';
            }
            return 'vendor';
          }
          
          if (id.includes('/infrastructure/')) {
            if (id.includes('/parsers/')) {
              return 'parsers';
            }
            if (id.includes('/repositories/')) {
              return 'repositories';
            }
            return 'infrastructure';
          }
          
          if (id.includes('/core/')) {
            return 'core-domain';
          }
        }
      }
    },
    chunkSizeWarningLimit: 650,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    },
    reportCompressedSize: false,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vuetify',
      'vue-i18n'
    ],
    exclude: ['@wallacesw11/base-lib', '@mdi/font']
  }
})
