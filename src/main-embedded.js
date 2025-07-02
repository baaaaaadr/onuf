// src/main-embedded.js
// Version alternative avec traductions intégrées pour résoudre les problèmes de production
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ CORRIGÉ: Import de vue-i18n pour l'internationalisation
import { createI18n } from 'vue-i18n'

// ✅ SOLUTION: Import des traductions intégrées au lieu des JSON
import { fr, en, ar } from './i18n/embedded.js'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// ✅ NOUVEAU: Import du support RTL
import './assets/styles/rtl-support.css'

// ✅ NOUVEAU: Configuration i18n avec traductions intégrées
const messages = { fr, en, ar }

// Vérifier que les messages sont chargés
console.log('📚 Messages i18n chargés (embedded):', {
  fr: !!fr && Object.keys(fr).length > 0,
  en: !!en && Object.keys(en).length > 0,
  ar: !!ar && Object.keys(ar).length > 0
})

const i18n = createI18n({
  legacy: false, // Composition API
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'fr', // Langue de secours
  messages,
  globalInjection: true, // Injection globale pour $t
  // ✅ NOUVEAU: Options pour la production
  missingWarn: false, // Désactiver les warnings en production
  fallbackWarn: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

// ✅ CORRIGÉ: Configuration Vuetify avec support RTL amélioré
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#D4A574',
          secondary: '#8BC34A',
          accent: '#FF9800',
          error: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
          success: '#4CAF50',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
    },
  },
  // ✅ CORRIGÉ: Support RTL initial
  rtl: false, // Sera géré dynamiquement par le composable useLang
})

const app = createApp(App)

// ✅ CORRIGÉ: Suppression de Pinia - le projet utilise les composables Vue 3
app.use(router)
app.use(vuetify)
app.use(i18n) // ✅ IMPORTANT: Ajouter i18n APRÈS vuetify

app.mount('#app')

// ✅ NOUVEAU: Exposer i18n globalement pour debug
if (typeof window !== 'undefined') {
  window.__i18n = i18n
  window.__app = app
  window.__translations = messages // Exposer aussi les traductions
}

// ✅ CORRIGÉ: L'initialisation de la langue se fera automatiquement
// via les composants qui utilisent useLang() - pas besoin de forcer ici
console.log('✅ ONUF PWA démarré avec support i18n et RTL (embedded)')
