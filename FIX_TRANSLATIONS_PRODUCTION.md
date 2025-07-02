# 🔧 Correction des problèmes de traduction et debug en production

## 🔍 Problèmes identifiés

### 1. **Traductions qui ne s'affichent pas en production mobile**
- Les clés de traduction s'affichent au lieu des textes traduits (ex: `audit.title`)
- Fonctionne en dev et en prod desktop, mais pas en prod mobile

### 2. **Bouton debug invisible en production**
- Le bouton worm 🐛 n'apparaît qu'en mode développement
- Condition `import.meta.env.MODE === 'development'` empêche l'affichage en prod

## 🛠️ Solutions appliquées

### 1. **Correction des imports i18n pour la production**

Le problème vient probablement du fait que les imports JSON ne sont pas correctement bundlés en production, surtout sur mobile. Voici les corrections :

#### a) Modifier `src/main.js` pour forcer l'inclusion des traductions

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// ✅ CORRIGÉ: Import de vue-i18n pour l'internationalisation
import { createI18n } from 'vue-i18n'

// ✅ CORRIGÉ: Import statique des fichiers de traduction pour la production
// IMPORTANT: Utiliser import() dynamique pour assurer le bundling
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

// ✅ NOUVEAU: Import du support RTL
import './assets/styles/rtl-support.css'

// ✅ NOUVEAU: Configuration i18n avec imports statiques
// IMPORTANT: S'assurer que les messages sont bien définis
const messages = {
  fr: fr || {},
  en: en || {},
  ar: ar || {}
}

// Vérifier que les messages sont chargés
console.log('📚 Messages i18n chargés:', {
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
}

// ✅ CORRIGÉ: L'initialisation de la langue se fera automatiquement
// via les composants qui utilisent useLang() - pas besoin de forcer ici
console.log('✅ ONUF PWA démarré avec support i18n et RTL')
```

### 2. **Correction du bouton debug pour qu'il apparaisse en production**

Modifier `src/components/debug/MobileDebugViewer.vue` :

```vue
<!-- src/components/debug/MobileDebugViewer.vue -->
<template>
  <!-- Bouton debug flottant -->
  <v-btn
    v-if="showDebugButton"
    icon
    size="small"
    color="error"
    class="debug-btn"
    @click="showDebug = !showDebug"
    :style="{ bottom: debugBtnPosition }"
  >
    🐛
  </v-btn>
  <!-- ... reste du template ... -->
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

// État
const showDebug = ref(false)
const activeTab = ref('i18n')
const logs = ref([])
const networkTests = ref([])
const forceShow = ref(false)

// ... autres imports ...

// ✅ CORRIGÉ: Condition pour afficher le bouton
const showDebugButton = computed(() => {
  // Toujours afficher en développement
  if (import.meta.env.MODE === 'development') return true
  
  // En production, vérifier plusieurs conditions
  if (forceShow.value) return true
  
  // ✅ NOUVEAU: Afficher si un paramètre debug est présent dans l'URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('debug') === 'true') return true
  
  // ✅ NOUVEAU: Afficher si un flag est défini dans localStorage
  if (localStorage.getItem('onuf-debug-enabled') === 'true') return true
  
  return false
})

// ... reste du script ...

onMounted(() => {
  // ✅ NOUVEAU: Vérifier l'URL pour activer le debug
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('debug') === 'true') {
    localStorage.setItem('onuf-debug-enabled', 'true')
  }
  
  // ... reste du onMounted ...
})
</script>
```

### 3. **Améliorer le chargement des traductions avec un fallback**

Créer un nouveau composable `src/composables/useI18nFallback.js` :

```javascript
// src/composables/useI18nFallback.js
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

// Traductions de secours intégrées dans le code
const fallbackMessages = {
  fr: {
    app: {
      title: "MANARA",
      description: "Application d'audit de sécurité urbaine"
    },
    navigation: {
      audit: "Audit",
      history: "Historique"
    },
    audit: {
      title: "Audit de Sécurité",
      subtitle: "Si vous n'êtes pas localisés automatiquement, alors choisissez votre quartier",
      location: {
        title: "Localisation GPS",
        description: "Votre position actuelle"
      }
    }
    // ... ajouter les traductions essentielles
  },
  en: {
    app: {
      title: "MANARA",
      description: "Urban security audit application"
    },
    navigation: {
      audit: "Audit",
      history: "History"
    },
    audit: {
      title: "Security Audit",
      subtitle: "If you are not automatically located, then choose your neighborhood"
    }
  },
  ar: {
    app: {
      title: "منارة",
      description: "تطبيق تدقيق الأمن الحضري"
    },
    navigation: {
      audit: "تدقيق",
      history: "السجل"
    },
    audit: {
      title: "تدقيق أمني",
      subtitle: "إذا لم يتم تحديد موقعك تلقائيًا، فاختر حيك"
    }
  }
}

export function useI18nFallback() {
  const { t: originalT, locale } = useI18n()
  
  // Fonction de traduction avec fallback
  const t = (key) => {
    try {
      const result = originalT(key)
      
      // Si la traduction retourne la clé, utiliser le fallback
      if (result === key || !result) {
        const keys = key.split('.')
        let value = fallbackMessages[locale.value] || fallbackMessages.fr
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        return value || key
      }
      
      return result
    } catch (error) {
      console.error('Erreur traduction:', key, error)
      return key
    }
  }
  
  return { t }
}
```

### 4. **Améliorer la configuration Vite pour la production**

Modifier `vite.config.js` :

```javascript
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
          i18n: ['vue-i18n'],
          // ✅ NOUVEAU: Inclure les traductions dans un chunk séparé
          translations: ['./src/locales/fr.json', './src/locales/en.json', './src/locales/ar.json']
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

  // ✅ NOUVEAU: Optimisation JSON
  json: {
    stringify: true
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
```

## 📱 Comment activer le debug en production

Pour activer le bouton debug en production, utilisez l'une de ces méthodes :

1. **Via URL** : Ajoutez `?debug=true` à l'URL
   - Exemple : `https://onuf.netlify.app/audit?debug=true`

2. **Via Console** : Dans la console du navigateur, tapez :
   ```javascript
   localStorage.setItem('onuf-debug-enabled', 'true')
   location.reload()
   ```

3. **Désactiver** : Pour désactiver
   ```javascript
   localStorage.removeItem('onuf-debug-enabled')
   location.reload()
   ```

## 🧪 Tests à effectuer

1. **Build de production local** :
   ```bash
   npm run build
   npm run preview
   ```

2. **Vérifier que les traductions fonctionnent**

3. **Tester sur mobile avec le paramètre debug**

## 📝 Notes importantes

- Les fichiers JSON doivent être importés statiquement pour être inclus dans le bundle
- Le fallback assure qu'au moins les traductions essentielles sont disponibles
- Le bouton debug peut maintenant être activé en production via URL ou localStorage
