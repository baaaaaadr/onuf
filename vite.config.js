// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
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
