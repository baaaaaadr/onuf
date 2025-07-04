<!-- src/components/PWABanner.vue -->
<!-- Banner PWA qui s'affiche automatiquement au démarrage -->
<template>
  <div>
    <!-- Banner PWA en bas d'écran -->
    <PWAInstaller 
      v-if="shouldShowBanner"
      variant="banner" 
      :auto-show="true"
      @installed="handleInstalled" 
      @dismissed="handleDismissed"
    />
    
    <!-- Snackbar PWA alternatif -->
    <PWAInstaller 
      v-if="shouldShowSnackbar"
      variant="snackbar" 
      :auto-show="false"
      @installed="handleInstalled" 
      @dismissed="handleDismissed"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import PWAInstaller from '@/components/PWAInstaller.vue'

export default {
  name: 'PWABanner',
  components: {
    PWAInstaller
  },
  setup() {
    const isInstallable = ref(false)
    const bannerDismissed = ref(false)
    const userPreference = ref('banner') // 'banner', 'snackbar', 'none'
    
    // Déterminer quel variant afficher
    const shouldShowBanner = computed(() => {
      return isInstallable.value && 
             !bannerDismissed.value && 
             userPreference.value === 'banner'
    })
    
    const shouldShowSnackbar = computed(() => {
      return isInstallable.value && 
             !bannerDismissed.value && 
             userPreference.value === 'snackbar'
    })
    
    // Détecter si PWA installable
    const checkInstallability = () => {
      // Vérifier si pas déjà installé
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://')
      
      if (!isInstalled) {
        // Vérifier si prompt disponible ou critères PWA remplis
        if (window.deferredPrompt || 
            ('serviceWorker' in navigator && window.location.protocol === 'https:')) {
          isInstallable.value = true
        }
      }
    }
    
    // Vérifier préférences utilisateur
    const loadUserPreferences = () => {
      const dismissed = localStorage.getItem('onuf-pwa-banner-dismissed')
      const preference = localStorage.getItem('onuf-pwa-display-preference') || 'banner'
      
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const oneWeek = 7 * 24 * 60 * 60 * 1000
        
        // Réafficher après une semaine
        if (Date.now() - dismissedTime < oneWeek) {
          bannerDismissed.value = true
        }
      }
      
      userPreference.value = preference
    }
    
    // Gestionnaires d'événements
    const handleInstalled = () => {
      console.log('📱 PWA installée depuis le banner automatique')
      isInstallable.value = false
      
      // Marquer comme installé
      localStorage.setItem('onuf-pwa-installed', 'true')
    }
    
    const handleDismissed = () => {
      console.log('🚫 Banner PWA rejeté par l\'utilisateur')
      bannerDismissed.value = true
      
      // Sauvegarder la préférence
      localStorage.setItem('onuf-pwa-banner-dismissed', Date.now().toString())
    }
    
    onMounted(() => {
      // Attendre un peu avant de vérifier (laisser l'app se charger)
      setTimeout(() => {
        loadUserPreferences()
        checkInstallability()
        
        // Debug
        console.log('🔧 PWABanner état:', {
          isInstallable: isInstallable.value,
          bannerDismissed: bannerDismissed.value,
          userPreference: userPreference.value,
          shouldShowBanner: shouldShowBanner.value,
          shouldShowSnackbar: shouldShowSnackbar.value
        })
      }, 2000) // 2 secondes après le mount
    })
    
    return {
      shouldShowBanner,
      shouldShowSnackbar,
      handleInstalled,
      handleDismissed
    }
  }
}
</script>
