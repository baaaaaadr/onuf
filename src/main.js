// C:\Users\Monster\Documents\My Apps\ONUF\onuf\src\main.js
// NOUVELLE VERSION SIMPLIFIÉE À REMPLACER

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n' // Import du plugin i18n
import { initAuth } from './composables/useSupabase' // Import de la fonction initAuth

import vuetify from './plugins/vuetify' // Configuration centralisée
import './assets/styles/rtl-support.css' // Styles RTL

// ✅ NOUVEAU: Import et application des propriétés CSS globales pour les couleurs
import { applyGlobalCSSProperties } from '@/theme/colors.js'

// Initialiser l'authentification au démarrage
initAuth()

// ✅ NOUVEAU: Appliquer les propriétés CSS globales pour les couleurs
// Cela rend les couleurs disponibles partout via var(--onuf-primary), etc.
applyGlobalCSSProperties()

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(i18n); // Utilisation du plugin i18n

// Logique de debug
if (typeof window !== 'undefined') {
  window.__onuf = {
    i18n, app,
    messages: i18n.global.messages,
    version: '1.0.1-patch4', env: import.meta.env.MODE,
    diagnose: () => {
      console.log('🏥 Diagnostic ONUF (v4):');
      console.log('- Stratégie: Plugin Isolé');
      console.log('- Environnement:', import.meta.env.MODE);
      console.log('- Locale actuelle:', i18n.global.locale.value);
      console.log('- Locales disponibles:', i18n.global.availableLocales); // Ceci doit être un Array
      console.log('- Test de traduction (app.title):', i18n.global.t('app.title'));
    },
    setLocale: (locale) => {
      if (['fr', 'en', 'ar'].includes(locale)) {
        i18n.global.locale.value = locale;
        localStorage.setItem('onuf-language', locale);
        console.log(`✅ Langue changée: ${locale}`);
      } else {
        console.error(`❌ Langue non supportée: ${locale}`);
      }
    },
    // ✅ NOUVEAU: Fonction d'installation PWA globale
    installPWA: () => {
      const installEvent = new CustomEvent('manual-pwa-install');
      window.dispatchEvent(installEvent);
    }
  };
  
  // ✅ NOUVEAU: Aussi exposer installPWA directement
  window.installPWA = window.__onuf.installPWA;
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true' || localStorage.getItem('onuf-debug-enabled') === 'true') {
    setTimeout(() => {
      console.log('🚀 Auto-diagnostic activé');
      window.__onuf.diagnose();
    }, 1000);
  }
}

app.mount('#app');

// ✅ PWA Service Worker Registration - Géré automatiquement par Vite PWA
// Le Service Worker est géré par vite-plugin-pwa, pas besoin d'enregistrement manuel

console.log('✅ ONUF PWA démarré avec plugin i18n isolé.');