// src/main.js - Version mise à jour avec nouveaux composables + i18n
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify'

// ✅ NOUVEAU: Import de vue-i18n pour l'internationalisation
import { createI18n } from 'vue-i18n'

// Import des fichiers de traduction
import fr from './locales/fr.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

// Import des styles
import 'vuetify/styles' // ✅ IMPORTANT: Styles Vuetify
import '@mdi/font/css/materialdesignicons.css' // ✅ Icônes MDI
import './assets/styles/main.css' // ✅ Styles du redesign v2.0

// Import des nouveaux composables globaux
import { initAuth } from './composables/useSupabase'
import { globalGeolocation } from './composables/useGeolocation'
// Import du composable sync queue (s'initialise automatiquement via getGlobalSyncQueue)
import { getGlobalSyncQueue } from './composables/useSyncQueue'
// ✅ NOUVEAU: Import des outils de debug
import mobileDebugLogger from './utils/mobileDebug'
import './utils/debug' // ← AJOUT pour charger __debugONUF

console.log('🚀 Initialisation ONUF PWA...')

// ✅ NOUVEAU: Configuration i18n
// 1. Récupérer la langue stockée ou utiliser français par défaut
const storedLang = localStorage.getItem('user-lang') || 'fr'

// 2. Créer l'instance i18n
const i18n = createI18n({
  legacy: false, // Utiliser la Composition API
  locale: storedLang, // Langue par défaut
  fallbackLocale: 'fr', // Langue de fallback
  messages: { fr, en, ar } // Messages de traduction
})

// 3. Définir l'attribut lang du HTML
document.querySelector('html').setAttribute('lang', storedLang)

console.log(`🌍 Internationalisation configurée - Langue: ${storedLang}`)

const app = createApp(App)

// Configuration de base
app.use(router)
app.use(vuetify)
app.use(i18n) // ✅ NOUVEAU: Ajouter i18n à l'app

// Initialiser l'authentification
console.log('🔐 Initialisation authentification...')
initAuth()

// Initialiser la queue de sync globale
console.log('🔄 Initialisation queue de synchronisation...')
const syncQueue = getGlobalSyncQueue()

// Démarrer la géolocalisation globale
console.log('🛰️ Démarrage géolocalisation globale...')
if (typeof window !== 'undefined') {
  // Essayer de démarrer le GPS immédiatement si possible
  navigator.permissions?.query({ name: 'geolocation' })
    .then(result => {
      if (result.state === 'granted') {
        console.log('✅ Permission GPS accordée - Démarrage automatique')
        globalGeolocation.startTracking()
      } else {
        console.log('⏳ Permission GPS en attente - Démarrage différé')
      }
    })
    .catch(() => {
      // API Permissions pas supportée, on essaie quand même plus tard
      console.log('⚠️ API Permissions non supportée - Test permission manuel')
    })
}

// Gestion des erreurs globales
app.config.errorHandler = (error, instance, info) => {
  console.error('❌ Erreur Vue.js:', error)
  console.error('📍 Contexte:', info)
  
  // Optionnel: Reporter les erreurs critiques
  if (error.message.includes('Network Error') || error.message.includes('fetch')) {
    console.log('🔄 Erreur réseau détectée - Passage en mode offline')
  }
}

// Listeners globaux pour la connectivité
window.addEventListener('online', () => {
  console.log('🌐 Connexion rétablie')
  // Les composables vont automatiquement réagir via leurs listeners
})

window.addEventListener('offline', () => {
  console.log('📴 Connexion perdue - Mode offline activé')
})

// Support pour l'installation PWA
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('📱 PWA peut être installée')
  // Empêcher l'affichage automatique
  e.preventDefault()
  // Stocker l'événement pour l'utiliser plus tard
  window.deferredPrompt = e
})

// ✅ NOUVEAU: Initialiser la langue et le thème RTL avant le montage
// S'assurer que la direction HTML et le thème Vuetify sont corrects
const initRTL = () => {
  const isRTL = storedLang === 'ar'
  document.body.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  console.log(`🌍 Direction HTML appliquée: ${isRTL ? 'RTL' : 'LTR'}`)
}

initRTL()

// Mount de l'application
app.mount('#app')

console.log('✅ ONUF PWA initialisée avec succès')
