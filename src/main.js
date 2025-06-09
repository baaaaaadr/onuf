// src/main.js - Version mise à jour avec nouveaux composables
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

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
// import './utils/debug.js' // Commenté si le fichier n'existe pas

console.log('🚀 Initialisation ONUF PWA...')

const app = createApp(App)

// Configuration de base
app.use(router)
app.use(vuetify)

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

// Mount de l'application
app.mount('#app')

console.log('✅ ONUF PWA initialisée avec succès')
