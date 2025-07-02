// C:\Users\Monster\Documents\My Apps\ONUF\onuf\src\main.js
// NOUVELLE VERSION SIMPLIFIÉE À REMPLACER

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n' // Import du plugin i18n

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import './assets/styles/rtl-support.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#D4A574', secondary: '#8BC34A', accent: '#FF9800', error: '#F44336',
          warning: '#FF9800', info: '#2196F3', success: '#4CAF50', background: '#FAFAFA', surface: '#FFFFFF',
        },
      },
    },
  },
  rtl: false,
});

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
    }
  };
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true' || localStorage.getItem('onuf-debug-enabled') === 'true') {
    setTimeout(() => {
      console.log('🚀 Auto-diagnostic activé');
      window.__onuf.diagnose();
    }, 1000);
  }
}

app.mount('#app');
console.log('✅ ONUF PWA démarré avec plugin i18n isolé.');