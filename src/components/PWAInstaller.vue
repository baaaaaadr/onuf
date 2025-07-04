<!-- src/components/PWAInstaller.vue -->
<!-- Composant pour gérer l'installation PWA - Version corrigée -->
<template>
  <div v-if="showInstaller">
    <!-- Option 1: Bouton dans menu -->
    <v-list-item 
      v-if="variant === 'menu'"
      @click="handleInstallClick"
      :disabled="isInstalled"
    >
      <template v-slot:prepend>
        <v-icon :color="getIconColor">
          {{ getIcon }}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ getTitle }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="!isInstalled">
        {{ getSubtitle }}
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Option 2: Banner en bas d'écran -->
    <v-banner
      v-if="variant === 'banner' && shouldShowBanner"
      sticky
      elevation="8"
      color="primary"
      icon="mdi-download"
      class="pwa-install-banner"
    >
      <template v-slot:text>
        <div class="d-flex flex-column">
          <div class="text-subtitle-1 font-weight-medium">
            {{ t('pwa.installPrompt') }}
          </div>
          <div class="text-caption mt-1">
            {{ t('pwa.installBenefits') }}
          </div>
        </div>
      </template>
      
      <template v-slot:actions>
        <v-btn
          variant="outlined"
          size="small"
          @click="dismissBanner"
          class="mr-2"
        >
          {{ t('common.later') }}
        </v-btn>
        <v-btn
          variant="elevated"
          size="small"
          @click="handleInstallClick"
          :loading="installing"
        >
          <v-icon start>mdi-download</v-icon>
          {{ t('pwa.install') }}
        </v-btn>
      </template>
    </v-banner>

    <!-- Option 3: Snackbar discret -->
    <v-snackbar
      v-if="variant === 'snackbar'"
      v-model="showSnackbar"
      :timeout="8000"
      location="bottom"
      color="primary"
      elevation="6"
    >
      <div class="d-flex align-center">
        <v-icon start>mdi-download</v-icon>
        <span>{{ t('pwa.installAvailable') }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          size="small"
          @click="handleInstallClick"
          :loading="installing"
        >
          {{ t('pwa.install') }}
        </v-btn>
        <v-btn
          icon="mdi-close"
          size="small"
          @click="showSnackbar = false"
        />
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'PWAInstaller',
  props: {
    variant: {
      type: String,
      default: 'menu',
      validator: (value) => ['menu', 'banner', 'snackbar'].includes(value)
    },
    autoShow: {
      type: Boolean,
      default: true
    }
  },
  emits: ['installed', 'dismissed'],
  setup(props, { emit }) {
    const { t } = useI18n()
    
    // État
    const deferredPrompt = ref(null)
    const isInstallable = ref(false)
    const isInstalled = ref(false)
    const installing = ref(false)
    const showSnackbar = ref(false)
    const bannerDismissed = ref(false)
    const platform = ref('unknown')
    
    // Computed
    const showInstaller = computed(() => {
      // Toujours montrer dans le menu
      if (props.variant === 'menu') return true
      
      // Pour banner et snackbar, montrer si installable et non installé
      return isInstallable.value && !isInstalled.value
    })
    
    const shouldShowBanner = computed(() => {
      return isInstallable.value && !isInstalled.value && !bannerDismissed.value
    })
    
    const getIcon = computed(() => {
      if (isInstalled.value) return 'mdi-check-circle'
      if (platform.value === 'ios') return 'mdi-share'
      if (platform.value === 'android') return 'mdi-download'
      return 'mdi-download'
    })
    
    const getIconColor = computed(() => {
      if (isInstalled.value) return 'success'
      if (isInstallable.value) return 'primary'
      return 'grey'
    })
    
    const getTitle = computed(() => {
      if (isInstalled.value) return t('pwa.installed')
      return t('pwa.installApp')
    })
    
    const getSubtitle = computed(() => {
      if (isInstalled.value) return ''
      if (platform.value === 'ios') return t('pwa.installDescription') + ' (iOS)'
      if (platform.value === 'android') return t('pwa.installDescription') + ' (Android)'
      return t('pwa.installDescription')
    })
    
    // Détection de la plateforme
    const detectPlatform = () => {
      const ua = navigator.userAgent
      if (/iPad|iPhone|iPod/.test(ua)) {
        platform.value = 'ios'
      } else if (/Android/.test(ua)) {
        platform.value = 'android'
      } else if (/Windows/.test(ua)) {
        platform.value = 'windows'
      } else if (/Mac/.test(ua)) {
        platform.value = 'mac'
      } else {
        platform.value = 'desktop'
      }
    }
    
    // Vérifier si l'app est installée
    const checkIfInstalled = () => {
      // Méthode 1: Mode standalone
      if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled.value = true
        return true
      }
      
      // Méthode 2: iOS navigator.standalone
      if ('standalone' in window.navigator && window.navigator.standalone) {
        isInstalled.value = true
        return true
      }
      
      // Méthode 3: URL params (pour les raccourcis)
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('utm_source') === 'pwa') {
        isInstalled.value = true
        return true
      }
      
      // Méthode 4: Vérifier le referer
      if (document.referrer.includes('android-app://')) {
        isInstalled.value = true
        return true
      }
      
      return false
    }
    
    // Vérifier si l'app est installable
    const checkInstallability = () => {
      // D'abord vérifier si déjà installée
      if (checkIfInstalled()) {
        isInstallable.value = false
        return
      }
      
      // Critères de base pour une PWA
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost'
      const hasServiceWorker = 'serviceWorker' in navigator
      const hasManifest = document.querySelector('link[rel="manifest"]')
      
      // Si tous les critères sont remplis, l'app est installable
      if (isSecure && hasServiceWorker && hasManifest) {
        isInstallable.value = true
        
        // ✅ IMPORTANT: Sur Chrome mobile, même sans beforeinstallprompt,
        // l'option "Add to Home Screen" est disponible dans le menu
        if (platform.value === 'android' && /Chrome/.test(navigator.userAgent)) {
          console.log('📱 Chrome Android détecté - Installation via menu disponible')
        }
      }
      
      console.log('🔍 Vérification installabilité:', {
        isSecure,
        hasServiceWorker,
        hasManifest,
        isInstallable: isInstallable.value,
        platform: platform.value
      })
    }
    
    // Gestionnaire du prompt d'installation natif
    const handleBeforeInstallPrompt = (e) => {
      console.log('✅ beforeinstallprompt capturé!')
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
      
      // Auto-affichage du banner/snackbar après un délai
      if (props.autoShow && props.variant !== 'menu') {
        setTimeout(() => {
          if (props.variant === 'banner') {
            // Banner s'affiche automatiquement via computed
          } else if (props.variant === 'snackbar') {
            showSnackbar.value = true
          }
        }, 2000)
      }
    }
    
    // Gestionnaire du clic sur installer
    const handleInstallClick = async () => {
      // Si on a le prompt natif, l'utiliser
      if (deferredPrompt.value) {
        installing.value = true
        
        try {
          deferredPrompt.value.prompt()
          const { outcome } = await deferredPrompt.value.userChoice
          
          console.log(`📱 Choix utilisateur: ${outcome}`)
          
          if (outcome === 'accepted') {
            isInstalled.value = true
            isInstallable.value = false
            showSnackbar.value = false
            bannerDismissed.value = true
            
            emit('installed')
            
            // Feedback
            if (window.navigator.vibrate) {
              window.navigator.vibrate([100, 50, 100])
            }
          }
          
          deferredPrompt.value = null
        } catch (error) {
          console.error('❌ Erreur installation:', error)
        } finally {
          installing.value = false
        }
      } else {
        // Sinon, afficher les instructions manuelles
        showManualInstructions()
      }
    }
    
    // Afficher les instructions manuelles
    const showManualInstructions = () => {
      let message = ''
      let icon = ''
      
      switch (platform.value) {
        case 'ios':
          message = `iOS Safari:\n1. Touchez l'icône Partager 􀈂\n2. Choisissez "Sur l'écran d'accueil" 􀥐\n3. Touchez "Ajouter"`
          icon = 'mdi-share'
          break
          
        case 'android':
          message = `Chrome Android:\n1. Touchez le menu ⋮\n2. Choisissez "Ajouter à l'écran d'accueil"\n3. Confirmez l'installation\n\nOU cherchez l'icône + dans la barre d'adresse`
          icon = 'mdi-menu'
          break
          
        case 'windows':
        case 'mac':
        case 'desktop':
        default:
          message = `Chrome/Edge Desktop:\n1. Cliquez sur l'icône + dans la barre d'adresse\n2. OU Menu → "Installer ONUF"\n3. OU F12 → Application → Manifest → Install`
          icon = 'mdi-plus'
          break
      }
      
      // Émettre un événement pour afficher les instructions
      const event = new CustomEvent('show-install-instructions', {
        detail: {
          instructions: message,
          isIOS: platform.value === 'ios',
          isAndroid: platform.value === 'android',
          isDesktop: !['ios', 'android'].includes(platform.value),
          platform: platform.value
        }
      })
      window.dispatchEvent(event)
    }
    
    // Rejeter le banner
    const dismissBanner = () => {
      bannerDismissed.value = true
      emit('dismissed')
      
      // Sauvegarder la préférence
      localStorage.setItem('onuf-pwa-banner-dismissed', Date.now().toString())
    }
    
    // Vérifier si le banner a été rejeté
    const checkBannerPreference = () => {
      const dismissed = localStorage.getItem('onuf-pwa-banner-dismissed')
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const oneWeek = 7 * 24 * 60 * 60 * 1000
        
        if (Date.now() - dismissedTime < oneWeek) {
          bannerDismissed.value = true
        }
      }
    }
    
    // Lifecycle
    onMounted(() => {
      detectPlatform()
      checkInstallability()
      checkBannerPreference()
      
      // Écouter les événements
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('manual-pwa-install', handleInstallClick)
      
      // Écouter les changements de display mode
      const displayModeQuery = window.matchMedia('(display-mode: standalone)')
      displayModeQuery.addEventListener('change', (e) => {
        if (e.matches) {
          isInstalled.value = true
          isInstallable.value = false
          console.log('✅ PWA installée détectée')
        }
      })
      
      // Re-vérifier l'installabilité après un délai
      setTimeout(() => {
        checkInstallability()
      }, 1000)
      
      console.log('🔧 PWAInstaller monté:', {
        variant: props.variant,
        platform: platform.value,
        isInstallable: isInstallable.value,
        isInstalled: isInstalled.value
      })
    })
    
    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('manual-pwa-install', handleInstallClick)
    })
    
    return {
      // État
      isInstalled,
      installing,
      showSnackbar,
      showInstaller,
      shouldShowBanner,
      
      // Computed
      getIcon,
      getIconColor,
      getTitle,
      getSubtitle,
      
      // Méthodes
      handleInstallClick,
      dismissBanner,
      
      // Utils
      t
    }
  }
}
</script>

<style scoped>
.pwa-install-banner {
  position: fixed !important;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-radius: 12px 12px 0 0 !important;
  animation: slideUpBanner 0.3s ease-out;
}

@keyframes slideUpBanner {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .pwa-install-banner :deep(.v-banner__text) {
    font-size: 0.875rem;
  }
  
  .pwa-install-banner :deep(.v-banner__actions) {
    gap: 8px;
  }
}
</style>
