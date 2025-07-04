// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.supabase\.co\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              }
            }
          }
        ]
      },
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'apple-touch-icon-180x180.png',
        'safari-pinned-tab.svg',
        'maskable-icon-512x512.png'
      ],
      manifest: {
        name: 'ONUF - Audit Sécurité Urbaine',
        short_name: 'ONUF',
        description: 'Application PWA d\'audit de sécurité urbaine pour Agadir - Mode offline disponible',
        theme_color: '#D4A574',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['productivity', 'utilities', 'business'],
        lang: 'fr',
        dir: 'auto',
        prefer_related_applications: false,
        display_override: ['window-controls-overlay', 'standalone'],
        
        // ✅ CRITIQUES pour l'installation:
        id: '/',
        edge_side_panel: {
          preferred_width: 400
        }
      },
      devOptions: {
        enabled: true,
        type: 'module'
      },
      injectRegister: 'auto'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  // ✅ CORRIGÉ: Configuration spéciale pour la production
  build: {
    // Optimisation pour PWA
    target: 'esnext',
    minify: 'terser',
    
    // ✅ S'assurer que les fichiers JSON sont inclus
    assetsInclude: ['**/*.json'],
    
    // ✅ NOUVEAU: Copier les fichiers de traduction dans le build
    commonjsOptions: {
      include: [/locales/, /node_modules/]
    },
    
    rollupOptions: {
      output: {
        // Optimisation des chunks
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          vuetify: ['vuetify'],
          i18n: ['vue-i18n']
        }
      }
    }
  },

  // ✅ Configuration PWA
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },

  // ✅ Serveur de développement
  server: {
    port: 5173,
    host: true, // Permettre l'accès externe
    open: true
  },

  // ✅ Configuration des assets statiques
  publicDir: 'public',
  
  // ✅ Optimisation des dépendances (suppression pinia)
  optimizeDeps: {
    include: ['vue', 'vue-router', 'vue-i18n', 'vuetify']
  }
})
