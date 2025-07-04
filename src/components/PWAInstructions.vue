<!-- src/components/PWAInstructions.vue -->
<!-- Composant pour afficher les instructions d'installation PWA -->
<template>
  <v-snackbar
    v-model="show"
    :timeout="15000"
    location="bottom center"
    color="info"
    elevation="8"
    multi-line
    class="pwa-instructions-snackbar"
  >
    <div class="d-flex flex-column">
      <div class="d-flex align-center mb-2">
        <v-icon start color="white">mdi-information</v-icon>
        <span class="font-weight-medium">{{ t('pwa.installAvailable') }}</span>
      </div>
      
      <div class="text-caption">
        <div v-if="isIOS" class="d-flex align-center">
          <v-icon start size="small">mdi-share</v-icon>
          {{ t('pwa.instructions.ios') }}
        </div>
        <div v-else-if="isAndroid" class="d-flex align-center">
          <v-icon start size="small">mdi-menu</v-icon>
          {{ t('pwa.instructions.android') }}
        </div>
        <div v-else class="d-flex align-center">
          <v-icon start size="small">mdi-plus</v-icon>
          {{ t('pwa.instructions.desktop') }}
        </div>
      </div>
    </div>
    
    <template v-slot:actions>
      <v-btn
        variant="text"
        size="small"
        @click="show = false"
      >
        {{ t('common.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'PWAInstructions',
  setup() {
    const { t } = useI18n()
    
    const show = ref(false)
    const isIOS = ref(false)
    const isAndroid = ref(false)
    
    // Détecter la plateforme
    const detectPlatform = () => {
      const userAgent = navigator.userAgent
      isIOS.value = /iPad|iPhone|iPod/.test(userAgent)
      isAndroid.value = /Android/.test(userAgent)
    }
    
    // Gestionnaire pour afficher les instructions
    const handleShowInstructions = (event) => {
      const { instructions, isIOS: eventIsIOS, isAndroid: eventIsAndroid } = event.detail
      
      isIOS.value = eventIsIOS
      isAndroid.value = eventIsAndroid
      show.value = true
      
      console.log('📋 Instructions PWA affichées:', { isIOS: isIOS.value, isAndroid: isAndroid.value })
    }
    
    onMounted(() => {
      detectPlatform()
      window.addEventListener('show-install-instructions', handleShowInstructions)
    })
    
    onUnmounted(() => {
      window.removeEventListener('show-install-instructions', handleShowInstructions)
    })
    
    return {
      show,
      isIOS,
      isAndroid,
      t
    }
  }
}
</script>

<style scoped>
.pwa-instructions-snackbar {
  max-width: 90vw;
}

.pwa-instructions-snackbar :deep(.v-snackbar__wrapper) {
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.pwa-instructions-snackbar :deep(.v-snackbar__content) {
  padding: 16px 24px;
}

@media (max-width: 600px) {
  .pwa-instructions-snackbar {
    max-width: 95vw;
  }
  
  .pwa-instructions-snackbar :deep(.v-snackbar__content) {
    padding: 12px 16px;
  }
}
</style>
