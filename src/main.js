// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ CORRIGÉ: Import de vue-i18n pour l'internationalisation
import { createI18n } from 'vue-i18n'

// ✅ CORRIGÉ: Import statique des fichiers de traduction pour la production
import fr from './locales/fr.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// ✅ NOUVEAU: Configuration i18n avec imports statiques
const messages = {
  fr,
  en,
  ar
}

const i18n = createI18n({
  legacy: false, // Composition API
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'en', // Langue de secours
  messages,
  globalInjection: true // Injection globale pour $t
})

// Configuration Vuetify avec support RTL
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
  // ✅ Support RTL dynamique
  rtl: false, // Sera géré dynamiquement par le composable useLang
})

const app = createApp(App)

// ✅ CORRIGÉ: Suppression de Pinia - le projet utilise les composables Vue 3
app.use(router)
app.use(vuetify)
app.use(i18n) // ✅ IMPORTANT: Ajouter i18n APRÈS vuetify

app.mount('#app')
