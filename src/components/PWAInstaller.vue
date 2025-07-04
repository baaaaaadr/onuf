<!-- src/components/PWAInstaller.vue -->
<!-- Composant pour gérer l'installation PWA -->
<template>
  <div v-if="showInstaller">
    <!-- Option 1: Bouton dans menu -->
    <v-list-item 
      v-if="variant === 'menu'"
      @click="installPWA"
      :disabled="!canInstall"
    >
      <template v-slot:prepend>
        <v-icon :color="canInstall ? 'success' : 'grey'">
          {{ isInstalled ? 'mdi-check-circle' : 'mdi-download' }}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ isInstalled ? t('pwa.installed') : t('pwa.installApp') }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="!isInstalled">
        {{ t('pwa.installDescription') }}
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Option 2: Banner en bas d'écran -->
    <v-banner
      v-if="variant === 'banner' && canInstall && !bannerDismissed"
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
          @click="installPWA"
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
          @click="installPWA"
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
      default: 'menu', // 'menu', 'banner', 'snackbar'
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
    const canInstall = ref(false)
    const isInstalled = ref(false)
    const installing = ref(false)
    const showSnackbar = ref(false)
    const bannerDismissed = ref(false)
    
    // Computed
    const showInstaller = computed(() => {
      if (props.variant === 'menu') return true
      if (props.variant === 'banner') return canInstall.value && !bannerDismissed.value
      if (props.variant === 'snackbar') return canInstall.value
      return false
    })
    
    // Détection du prompt d'installation
    const handleBeforeInstallPrompt = (e) => {
      console.log('✅ PWA installable détectée')
      e.preventDefault()
      deferredPrompt.value = e
      canInstall.value = true
      
      // Auto-affichage selon le variant
      if (props.autoShow) {
        if (props.variant === 'snackbar') {
          setTimeout(() => {
            showSnackbar.value = true
          }, 3000) // Attendre 3s avant d'afficher
        }
      }
    }
    
    // Détection si PWA installable
    const checkIfInstalled = () => {
      // Méthode 1: display-mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        isInstalled.value = true
        return true
      }
      
      // Méthode 2: navigator.standalone (iOS)
      if (window.navigator.standalone === true) {
        isInstalled.value = true
        return true
      }
      
      // Méthode 3: document.referrer (Android)
      if (document.referrer.includes('android-app://')) {
        isInstalled.value = true
        return true
      }
      
      // ✅ NOUVEAU: En développement, toujours permettre le test
      if (import.meta.env.DEV) {
        console.log('🔧 Mode développement: PWA installable forcée pour test')
        canInstall.value = true
      }
      
      return false
    }
    
    // Installation de la PWA
    const installPWA = async () => {
      if (!deferredPrompt.value) {
        console.log('💡 Pas de prompt d\'installation disponible')
        
        // Fallback: afficher instructions manuelles
        showManualInstallInstructions()
        return
      }
      
      installing.value = true
      
      try {
        // Afficher le prompt
        deferredPrompt.value.prompt()
        
        // Attendre la réponse utilisateur
        const { outcome } = await deferredPrompt.value.userChoice
        
        console.log(`📱 Installation PWA: ${outcome}`)
        
        if (outcome === 'accepted') {
          isInstalled.value = true
          canInstall.value = false
          showSnackbar.value = false
          bannerDismissed.value = true
          
          emit('installed')
          
          // Message de succès
          this.$nextTick(() => {
            if (window.navigator.vibrate) {
              window.navigator.vibrate([100, 50, 100])
            }
          })
        }
        
        // Nettoyer le prompt
        deferredPrompt.value = null
        
      } catch (error) {
        console.error('❌ Erreur installation PWA:', error)
      } finally {
        installing.value = false
      }
    }
    
    // Instructions manuelles pour installation
    const showManualInstallInstructions = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)
      
      let instructions = ''
      
      if (isIOS) {
        instructions = t('pwa.instructions.ios')
      } else if (isAndroid) {
        instructions = t('pwa.instructions.android')
      } else {
        instructions = t('pwa.instructions.desktop')
      }
      
      // Créer un snackbar avec instructions
      const event = new CustomEvent('show-install-instructions', {
        detail: { instructions, isIOS, isAndroid }
      })
      window.dispatchEvent(event)
    }
    
    // Rejeter le banner
    const dismissBanner = () => {
      bannerDismissed.value = true
      emit('dismissed')
      
      // Stocker la préférence
      localStorage.setItem('onuf-pwa-banner-dismissed', Date.now().toString())
    }
    
    // Vérifier si banner précédemment rejeté
    const checkBannerDismissed = () => {
      const dismissed = localStorage.getItem('onuf-pwa-banner-dismissed')
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        const oneWeek = 7 * 24 * 60 * 60 * 1000
        
        // Réafficher après une semaine
        if (Date.now() - dismissedTime < oneWeek) {
          bannerDismissed.value = true
        }
      }
    }
    
    // Gestionnaire changement de display mode
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        isInstalled.value = true
        canInstall.value = false
        console.log('✅ PWA installée - Mode standalone détecté')
      }
    }
    
    onMounted(() => {
      // Vérifier si déjà installée
      checkIfInstalled()
      checkBannerDismissed()
      
      // Écouter les événements
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      
      // ✅ NOUVEAU: Écouter l'événement d'installation manuelle
      window.addEventListener('manual-pwa-install', installPWA)
      
      // Écouter changement de display mode
      const displayModeQuery = window.matchMedia('(display-mode: standalone)')
      displayModeQuery.addListener(handleDisplayModeChange)
      
      // Debug info
      console.log('🔧 PWAInstaller initialisé:', {
        variant: props.variant,
        canInstall: canInstall.value,
        isInstalled: isInstalled.value,
        standalone: window.matchMedia('(display-mode: standalone)').matches
      })
    })
    
    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('manual-pwa-install', installPWA)
    })
    
    return {
      // État
      canInstall,
      isInstalled,
      installing,
      showSnackbar,
      bannerDismissed,
      showInstaller,
      
      // Méthodes
      installPWA,
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
}

/* Animations pour le banner */
.pwa-install-banner {
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

/* Responsive pour mobile */
@media (max-width: 600px) {
  .pwa-install-banner :deep(.v-banner__text) {
    font-size: 0.875rem;
  }
  
  .pwa-install-banner :deep(.v-banner__actions) {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
