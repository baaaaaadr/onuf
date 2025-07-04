<!-- src/components/debug/PWADiagnostic.vue -->
<!-- Composant de diagnostic PWA complet -->
<template>
  <v-card class="ma-4" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon start color="primary">mdi-stethoscope</v-icon>
      Diagnostic PWA
      <v-spacer />
      <v-chip :color="overallStatus.color" small>
        {{ overallStatus.text }}
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <!-- Résumé rapide -->
      <v-alert
        :type="overallStatus.type"
        variant="tonal"
        class="mb-4"
      >
        <div v-if="diagnostics.isInstalled">
          ✅ L'application est déjà installée en mode PWA
        </div>
        <div v-else-if="diagnostics.hasPrompt">
          ✅ Le prompt d'installation natif est disponible
        </div>
        <div v-else-if="diagnostics.isInstallable">
          ⚠️ L'app est installable mais Chrome ne propose pas le prompt automatiquement
          <div class="text-caption mt-2">
            Solution : Menu Chrome ⋮ → "Ajouter à l'écran d'accueil"
          </div>
        </div>
        <div v-else>
          ❌ L'application n'est pas installable (critères PWA non remplis)
        </div>
      </v-alert>
      
      <!-- Détails techniques -->
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon start :color="getSectionColor('criteria')">
              {{ getSectionIcon('criteria') }}
            </v-icon>
            Critères PWA de base
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list density="compact">
              <v-list-item v-for="(value, key) in diagnostics.criteria" :key="key">
                <template v-slot:prepend>
                  <v-icon :color="value ? 'success' : 'error'" size="small">
                    {{ value ? 'mdi-check' : 'mdi-close' }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ getCriteriaLabel(key) }}</v-list-item-title>
                <v-list-item-subtitle v-if="!value">
                  {{ getCriteriaHint(key) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon start :color="getSectionColor('manifest')">
              {{ getSectionIcon('manifest') }}
            </v-icon>
            Manifest PWA
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list density="compact">
              <v-list-item v-for="(value, key) in diagnostics.manifest" :key="key">
                <template v-slot:prepend>
                  <v-icon :color="getManifestItemColor(key, value)" size="small">
                    {{ getManifestItemIcon(key, value) }}
                  </v-icon>
                </template>
                <v-list-item-title>{{ getManifestLabel(key) }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatManifestValue(key, value) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon start :color="getSectionColor('environment')">
              {{ getSectionIcon('environment') }}
            </v-icon>
            Environnement
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Navigateur</v-list-item-title>
                <v-list-item-subtitle>{{ diagnostics.environment.browser }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Plateforme</v-list-item-title>
                <v-list-item-subtitle>{{ diagnostics.environment.platform }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>URL</v-list-item-title>
                <v-list-item-subtitle>{{ diagnostics.environment.url }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Mode d'affichage</v-list-item-title>
                <v-list-item-subtitle>{{ diagnostics.environment.displayMode }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
        
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon start color="info">mdi-lightbulb</v-icon>
            Conseils d'installation
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <v-list-item v-for="tip in installTips" :key="tip.id">
                <template v-slot:prepend>
                  <v-icon :color="tip.color">{{ tip.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ tip.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-wrap">{{ tip.description }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Actions -->
      <div class="mt-4">
        <v-btn
          color="primary"
          @click="runDiagnostic"
          :loading="loading"
        >
          <v-icon start>mdi-refresh</v-icon>
          Actualiser le diagnostic
        </v-btn>
        
        <v-btn
          v-if="diagnostics.hasPrompt"
          color="success"
          @click="triggerInstall"
          class="ml-2"
        >
          <v-icon start>mdi-download</v-icon>
          Installer maintenant
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'PWADiagnostic',
  setup() {
    const loading = ref(false)
    const deferredPrompt = ref(null)
    const diagnostics = ref({
      isInstalled: false,
      isInstallable: false,
      hasPrompt: false,
      criteria: {
        https: false,
        serviceWorker: false,
        manifest: false,
        icons: false,
        startUrl: false
      },
      manifest: {
        name: '',
        shortName: '',
        display: '',
        themeColor: '',
        backgroundColor: '',
        icons: 0,
        screenshots: 0,
        shortcuts: 0
      },
      environment: {
        browser: '',
        platform: '',
        url: '',
        displayMode: ''
      }
    })
    
    // Computed
    const overallStatus = computed(() => {
      if (diagnostics.value.isInstalled) {
        return { color: 'success', text: 'Installée', type: 'success' }
      }
      if (diagnostics.value.hasPrompt) {
        return { color: 'success', text: 'Prête', type: 'success' }
      }
      if (diagnostics.value.isInstallable) {
        return { color: 'warning', text: 'Installable', type: 'warning' }
      }
      return { color: 'error', text: 'Non installable', type: 'error' }
    })
    
    const installTips = computed(() => {
      const tips = []
      const env = diagnostics.value.environment
      
      if (env.platform === 'Android' && env.browser.includes('Chrome')) {
        tips.push({
          id: 'android-chrome',
          icon: 'mdi-android',
          color: 'success',
          title: 'Chrome Android',
          description: 'Menu ⋮ → "Ajouter à l\'écran d\'accueil" → Choisir "Installer" (pas "Ajouter un raccourci")'
        })
      }
      
      if (env.platform === 'iOS') {
        tips.push({
          id: 'ios-safari',
          icon: 'mdi-apple',
          color: 'info',
          title: 'Safari iOS',
          description: 'Icône Partager 􀈂 → "Sur l\'écran d\'accueil" → "Ajouter"'
        })
      }
      
      if (env.platform.includes('Windows') || env.platform.includes('Mac')) {
        tips.push({
          id: 'desktop-chrome',
          icon: 'mdi-monitor',
          color: 'primary',
          title: 'Chrome/Edge Desktop',
          description: 'Icône + dans la barre d\'adresse OU Menu → "Installer ONUF"'
        })
      }
      
      if (!diagnostics.value.hasPrompt && diagnostics.value.isInstallable) {
        tips.push({
          id: 'no-prompt',
          icon: 'mdi-alert',
          color: 'warning',
          title: 'Prompt non disponible',
          description: 'Chrome nécessite plus d\'interaction. Naviguez dans l\'app pendant 30 secondes puis réessayez.'
        })
      }
      
      return tips
    })
    
    // Méthodes
    const detectBrowser = () => {
      const ua = navigator.userAgent
      let browser = 'Inconnu'
      
      if (ua.includes('Chrome')) browser = 'Chrome'
      if (ua.includes('Firefox')) browser = 'Firefox'
      if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
      if (ua.includes('Edge')) browser = 'Edge'
      if (ua.includes('Samsung')) browser = 'Samsung Internet'
      
      return browser + ' ' + (ua.match(/Chrome\/(\d+)/) || ['', ''])[1]
    }
    
    const detectPlatform = () => {
      const ua = navigator.userAgent
      if (/Android/.test(ua)) return 'Android'
      if (/iPad|iPhone|iPod/.test(ua)) return 'iOS'
      if (/Windows/.test(ua)) return 'Windows'
      if (/Mac/.test(ua)) return 'macOS'
      if (/Linux/.test(ua)) return 'Linux'
      return 'Unknown'
    }
    
    const getDisplayMode = () => {
      const modes = ['fullscreen', 'standalone', 'minimal-ui', 'browser']
      for (const mode of modes) {
        if (window.matchMedia(`(display-mode: ${mode})`).matches) {
          return mode
        }
      }
      return 'browser'
    }
    
    const checkManifest = async () => {
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]')
        if (!manifestLink) return null
        
        const response = await fetch(manifestLink.href)
        const manifest = await response.json()
        
        return {
          name: manifest.name || '',
          shortName: manifest.short_name || '',
          display: manifest.display || '',
          themeColor: manifest.theme_color || '',
          backgroundColor: manifest.background_color || '',
          icons: manifest.icons?.length || 0,
          screenshots: manifest.screenshots?.length || 0,
          shortcuts: manifest.shortcuts?.length || 0
        }
      } catch (error) {
        console.error('Erreur lecture manifest:', error)
        return null
      }
    }
    
    const runDiagnostic = async () => {
      loading.value = true
      
      try {
        // Environnement
        diagnostics.value.environment = {
          browser: detectBrowser(),
          platform: detectPlatform(),
          url: window.location.href,
          displayMode: getDisplayMode()
        }
        
        // Critères de base
        diagnostics.value.criteria.https = location.protocol === 'https:' || location.hostname === 'localhost'
        diagnostics.value.criteria.serviceWorker = 'serviceWorker' in navigator
        diagnostics.value.criteria.manifest = !!document.querySelector('link[rel="manifest"]')
        
        // Vérifier le service worker
        if (diagnostics.value.criteria.serviceWorker) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          diagnostics.value.criteria.serviceWorker = registrations.length > 0
        }
        
        // Vérifier le manifest
        const manifestData = await checkManifest()
        if (manifestData) {
          diagnostics.value.manifest = manifestData
          diagnostics.value.criteria.icons = manifestData.icons >= 2
          diagnostics.value.criteria.startUrl = true // Assumé si manifest présent
        }
        
        // Vérifier si installée
        diagnostics.value.isInstalled = getDisplayMode() === 'standalone' || 
                                       window.navigator.standalone === true
        
        // Vérifier si installable
        const allCriteria = Object.values(diagnostics.value.criteria).every(v => v)
        diagnostics.value.isInstallable = allCriteria && !diagnostics.value.isInstalled
        
        // Vérifier si prompt disponible
        diagnostics.value.hasPrompt = !!deferredPrompt.value
        
        console.log('📊 Diagnostic PWA complet:', diagnostics.value)
        
      } catch (error) {
        console.error('Erreur diagnostic:', error)
      } finally {
        loading.value = false
      }
    }
    
    const triggerInstall = async () => {
      if (!deferredPrompt.value) return
      
      try {
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        console.log(`Installation: ${outcome}`)
        
        if (outcome === 'accepted') {
          diagnostics.value.isInstalled = true
          diagnostics.value.hasPrompt = false
        }
        
        deferredPrompt.value = null
      } catch (error) {
        console.error('Erreur installation:', error)
      }
    }
    
    // Labels et helpers
    const getCriteriaLabel = (key) => {
      const labels = {
        https: 'HTTPS ou localhost',
        serviceWorker: 'Service Worker enregistré',
        manifest: 'Manifest PWA présent',
        icons: 'Icônes suffisantes (2+)',
        startUrl: 'Start URL valide'
      }
      return labels[key] || key
    }
    
    const getCriteriaHint = (key) => {
      const hints = {
        https: 'L\'app doit être servie en HTTPS',
        serviceWorker: 'Vérifiez que le SW est bien enregistré',
        manifest: 'Le fichier manifest.json doit être lié',
        icons: 'Au moins 2 icônes (192x192 et 512x512)',
        startUrl: 'L\'URL de démarrage doit être valide'
      }
      return hints[key] || ''
    }
    
    const getManifestLabel = (key) => {
      const labels = {
        name: 'Nom complet',
        shortName: 'Nom court',
        display: 'Mode d\'affichage',
        themeColor: 'Couleur du thème',
        backgroundColor: 'Couleur de fond',
        icons: 'Nombre d\'icônes',
        screenshots: 'Captures d\'écran',
        shortcuts: 'Raccourcis'
      }
      return labels[key] || key
    }
    
    const formatManifestValue = (key, value) => {
      if (key === 'icons' || key === 'screenshots' || key === 'shortcuts') {
        return value > 0 ? `${value} élément(s)` : 'Aucun'
      }
      return value || 'Non défini'
    }
    
    const getManifestItemColor = (key, value) => {
      if (['icons', 'screenshots'].includes(key)) {
        return value > 0 ? 'success' : 'warning'
      }
      return value ? 'success' : 'grey'
    }
    
    const getManifestItemIcon = (key, value) => {
      if (key === 'icons') return value > 0 ? 'mdi-check' : 'mdi-alert'
      if (key === 'screenshots') return value > 0 ? 'mdi-check' : 'mdi-alert'
      return value ? 'mdi-check' : 'mdi-minus'
    }
    
    const getSectionColor = (section) => {
      if (section === 'criteria') {
        return Object.values(diagnostics.value.criteria).every(v => v) ? 'success' : 'warning'
      }
      if (section === 'manifest') {
        return diagnostics.value.manifest.icons > 0 ? 'success' : 'warning'
      }
      return 'info'
    }
    
    const getSectionIcon = (section) => {
      if (section === 'criteria') return 'mdi-checkbox-marked-circle'
      if (section === 'manifest') return 'mdi-file-code'
      if (section === 'environment') return 'mdi-monitor-cellphone'
      return 'mdi-information'
    }
    
    // Lifecycle
    onMounted(() => {
      // Écouter beforeinstallprompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        diagnostics.value.hasPrompt = true
        console.log('✅ beforeinstallprompt capturé dans PWADiagnostic')
      })
      
      // Lancer le diagnostic initial
      runDiagnostic()
    })
    
    return {
      loading,
      diagnostics,
      overallStatus,
      installTips,
      
      runDiagnostic,
      triggerInstall,
      
      getCriteriaLabel,
      getCriteriaHint,
      getManifestLabel,
      formatManifestValue,
      getManifestItemColor,
      getManifestItemIcon,
      getSectionColor,
      getSectionIcon
    }
  }
}
</script>

<style scoped>
.v-expansion-panel-text :deep(.v-list) {
  padding: 0;
}

.text-wrap {
  white-space: normal !important;
}
</style>
