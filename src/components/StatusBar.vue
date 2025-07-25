<!-- src/components/StatusBar.vue -->
<!-- Barre de statut unifiée avec tous les indicateurs -->
<template>
  <v-app-bar
    app
    color="primary"
    dark
    class="status-bar"
    height="56"
    elevation="2"
  >
    <!-- Ligne principale -->
    <div class="d-flex align-center justify-space-between w-100 px-2">
      <!-- Logo + Titre -->
      <div class="d-flex align-center" :class="{ 'order-2 pr-4': isRTL, 'pl-2': !isRTL }">
        <v-btn
          icon
          @click="goBack"
          v-if="showBackButton"
          :class="isRTL ? 'ml-2' : 'mr-2'"
        >
          <v-icon>{{ isRTL ? 'mdi-arrow-right' : 'mdi-arrow-left' }}</v-icon>
        </v-btn>
        
        <!-- En RTL: Titre puis Logo -->
        <template v-if="isRTL">
          <div class="text-right mr-2">
            <div class="text-h6 font-weight-bold">{{ appTitle }}</div>
            <div class="text-caption opacity-80" v-if="pageTitle">{{ pageTitle }}</div>
          </div>
          <img 
            src="@/assets/logo.svg" 
            alt="ONUF Logo" 
            class="app-logo ml-6"
          />
        </template>
        
        <!-- En LTR: Logo puis Titre -->
        <template v-else>
          <img 
            src="@/assets/logo.svg" 
            alt="ONUF Logo" 
            class="app-logo mr-6"
          />
          <div class="ml-2">
            <div class="text-h6 font-weight-bold">{{ appTitle }}</div>
            <div class="text-caption opacity-80" v-if="pageTitle">{{ pageTitle }}</div>
          </div>
        </template>
      </div>

      <!-- Boutons Navigation + Indicateurs -->
      <div class="d-flex align-center gap-2" :class="{ 'order-1': isRTL }">
        

        
        <!-- Menu principal -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          
          <v-list>
            <!-- Section Statut Système -->
            <v-list-subheader>{{ t('menu.systemStatus') }}</v-list-subheader>
            
            <v-list-item @click="showSyncDialog = true">
              <template v-slot:prepend>
                <v-icon :color="syncIndicatorColor">{{ syncIcon }}</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.cloudSync') }}</v-list-item-title>
              <v-list-item-subtitle>{{ syncStatusText }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon :color="isOnline ? 'success' : 'error'">
                  {{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}
                </v-icon>
              </template>
              <v-list-item-title>{{ t('menu.networkConnectivity') }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ isOnline ? t('menu.online') : t('menu.offline') }}
              </v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item @click="toggleGpsDetails">
              <template v-slot:prepend>
                <v-icon :color="gpsAccuracyLevel.color">{{ gpsAccuracyLevel.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.gpsLocation') }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ gpsStatusText }}
              </v-list-item-subtitle>
            </v-list-item>
            
            <v-divider class="my-2" />
            
            <!-- ✅ NOUVEAU: Installation PWA -->
            <PWAInstaller variant="menu" @installed="handlePWAInstalled" @dismissed="handlePWADismissed" />
            
            <v-divider class="my-2" />
            
            <!-- Guide de démarrage -->
            <v-list-item @click="showOnboarding = true">
              <template v-slot:prepend>
                <v-icon>mdi-play-circle-outline</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.startGuide') }}</v-list-item-title>
            </v-list-item>
            
            <v-divider class="my-2" />
            
            <!-- ✅ NOUVEAU: Sélecteur de langue -->
            <v-list-subheader>{{ t('menu.languageSelection') }}</v-list-subheader>
            
            <LanguageSwitcher 
              variant="list" 
              @language-changed="handleLanguageChange"
            />
            
            <v-divider class="my-2" />
            
            <!-- Section Utilisateur -->
            <v-list-subheader>{{ currentUser?.display_name || currentUser?.username || t('common.user') }}</v-list-subheader>
            
            <v-list-item @click="openDebugPanel">
              <template v-slot:prepend>
                <v-icon>mdi-bug</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.debug') }}</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="forceUpdateApp" :loading="isForceUpdating">
              <template v-slot:prepend>
                <v-icon>mdi-refresh-circle</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.forceUpdate') }}</v-list-item-title>
              <v-list-item-subtitle v-if="!isForceUpdating">{{ t('menu.forceUpdateDescription') }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-list-item @click="logout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.logout') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Barre de progression sync (si sync en cours) -->
    <v-progress-linear
      v-if="syncStats.syncing > 0"
      :value="syncProgress"
      color="accent"
      height="2"
      class="sync-progress"
    />
  </v-app-bar>

  <!-- ✅ NOUVEAU: Carte GPS plein écran -->
  <v-dialog 
    v-model="showGpsDetails" 
    fullscreen 
    hide-overlay 
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card>
      <!-- Header avec infos GPS -->
      <v-toolbar dark color="primary">
        <v-btn
          icon
          dark
          @click="showGpsDetails = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        
        <v-toolbar-title class="d-flex align-center">
          <v-icon class="mr-2" :color="gpsAccuracyLevel.color">
            {{ gpsAccuracyLevel.icon }}
          </v-icon>
          {{ t('menu.gpsLocation') }}
        </v-toolbar-title>
        
        <v-spacer />
        
        <v-btn
          icon
          dark
          @click="refreshGps"
          :loading="isTracking"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Infos GPS compactes -->
      <v-card-text class="pa-2" v-if="currentPosition">
        <v-row dense>
          <v-col cols="3">
            <div class="text-caption text--secondary">{{ t('gps.position') }}</div>
            <div class="text-body-2 font-weight-medium">
              {{ formattedPosition.lat }}, {{ formattedPosition.lng }}
            </div>
          </v-col>
          <v-col cols="3">
            <div class="text-caption text--secondary">{{ t('gps.precision') }}</div>
            <div class="text-body-2" :class="`${gpsAccuracyLevel.color}--text`">
              {{ formattedPosition.accuracy }}
            </div>
          </v-col>
          <v-col cols="3">
            <div class="text-caption text--secondary">{{ t('gps.quality') }}</div>
            <div class="text-body-2" :class="`${gpsAccuracyLevel.color}--text`">
              {{ gpsAccuracyLevel.text }}
            </div>
          </v-col>
          <v-col cols="3" v-if="lastUpdate">
            <div class="text-caption text--secondary">{{ t('gps.lastUpdate') }}</div>
            <div class="text-body-2">{{ formatLastUpdate }}</div>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Carte Leaflet plein écran -->
      <div 
        v-if="currentPosition" 
        ref="mapContainer" 
        class="gps-fullscreen-map"
        :style="{ height: mapHeight }"
      >
        <!-- ✅ NOUVEAU: Indicateur de chargement -->
        <div 
          v-if="mapLoading" 
          class="map-loading-overlay"
        >
          <div class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            />
            <div class="text-h6 mt-4">{{ t('gps.loadingMap') }}</div>
            <div class="text-body-2 text--secondary">{{ t('gps.initializingLeaflet') }}</div>
          </div>
        </div>
      </div>
      
      <!-- Message si pas de GPS -->
      <v-card-text v-else class="text-center py-8">
        <v-icon size="64" color="grey">mdi-map-marker-off</v-icon>
        <div class="text-h6 mt-4">{{ t('gps.positionUnavailable') }}</div>
        <div class="text-body-2 text--secondary mt-2">
          {{ error || t('gps.activatingGeolocation') }}
        </div>
        <v-btn
          color="primary"
          class="mt-4"
          @click="refreshGps"
          :loading="isTracking"
        >
          <v-icon left>mdi-refresh</v-icon>
          {{ t('gps.retry') }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog détails sync -->
  <v-dialog v-model="showSyncDialog" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" :color="syncIndicatorColor">{{ syncIcon }}</v-icon>
        {{ t('dialogs.cloudSync') }}
      </v-card-title>
      
      <v-card-text>
        <!-- Statistiques globales -->
        <div class="sync-stats mb-4">
          <v-row>
            <v-col cols="3" class="text-center">
              <div class="text-h4 success--text">{{ syncStats.success }}</div>
              <div class="text-caption">{{ t('dialogs.synced') }}</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 warning--text">{{ syncStats.pending }}</div>
              <div class="text-caption">{{ t('dialogs.pending') }}</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 info--text">{{ syncStats.syncing }}</div>
              <div class="text-caption">{{ t('dialogs.inProgress') }}</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 error--text">{{ syncStats.failed }}</div>
              <div class="text-caption">{{ t('dialogs.failed') }}</div>
            </v-col>
          </v-row>
        </div>

        <!-- Statut réseau -->
        <v-alert
          :type="isOnline ? 'success' : 'warning'"
          text
          dense
          class="mb-3"
        >
          <span v-if="isOnline">
            ✅ {{ t('dialogs.connected') }}
          </span>
          <span v-else>
            📴 {{ t('dialogs.offline') }}
          </span>
        </v-alert>

        <!-- Dernière sync -->
        <div v-if="lastSync" class="text-caption text--secondary mb-3">
          {{ t('dialogs.lastSync') }}: {{ formatTime(lastSync) }}
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2">
          <v-btn
            small
            color="primary"
            @click="manualSync"
            :loading="syncStats.syncing > 0"
            :disabled="!isOnline"
          >
            <v-icon left small>mdi-cloud-sync</v-icon>
            {{ t('dialogs.syncNow') }}
          </v-btn>
          
          <v-btn
            small
            color="warning"
            @click="retryFailed"
            :disabled="syncStats.failed === 0 || !isOnline"
          >
            <v-icon left small>mdi-refresh</v-icon>
            {{ t('dialogs.retryCount') }} ({{ syncStats.failed }})
          </v-btn>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showSyncDialog = false">{{ t('dialogs.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog onboarding -->
  <v-dialog v-model="showOnboarding" max-width="600" rounded="lg">
    <v-card rounded="lg">
      <v-card-title class="pa-6 text-center">
        <div class="onboarding-icon mb-3">🎯</div>
        <div class="text-h5 font-weight-bold">
          {{ t('dialogs.welcomeToOnuf') }}
        </div>
      </v-card-title>
      
      <v-card-text class="px-6">
        <div class="onboarding-steps">
          <div class="onboarding-step mb-4">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">📍 {{ t('dialogs.activateGPS') }}</h3>
              <p class="text-body-2">
                {{ t('dialogs.gpsDescription') }}
              </p>
            </div>
          </div>
          
          <div class="onboarding-step mb-4">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">🔍 {{ t('dialogs.observeEnvironment') }}</h3>
              <p class="text-body-2">
                {{ t('dialogs.observeDescription') }}
              </p>
            </div>
          </div>
          
          <div class="onboarding-step mb-4">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">📱 {{ t('dialogs.answerQuestions') }}</h3>
              <p class="text-body-2">
                {{ t('dialogs.answersDescription') }}
              </p>
            </div>
          </div>
          
          <div class="onboarding-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">☁️ {{ t('dialogs.autoSync') }}</h3>
              <p class="text-body-2">
                {{ t('dialogs.autoSyncDescription') }}
              </p>
            </div>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions class="px-6 pb-6">
        <v-btn
          color="primary"
          size="large"
          rounded="pill"
          block
          @click="startFirstAudit"
        >
          <v-icon start>mdi-rocket-launch</v-icon>
          {{ t('dialogs.startFirstAudit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useAuth } from '@/composables/useSupabase'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import { globalGeolocation } from '@/composables/useGeolocation'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n' // ✅ NOUVEAU: Import i18n
import { useLang } from '@/composables/useLang' // ✅ NOUVEAU: Import useLang pour RTL
// ✅ NOUVEAU: Import du composant de changement de langue et PWA
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import PWAInstaller from '@/components/PWAInstaller.vue'

export default {
  name: 'StatusBar',
  components: {
    LanguageSwitcher, // ✅ NOUVEAU: Enregistrer le composant
    PWAInstaller // ✅ NOUVEAU: Enregistrer le composant PWA
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    showBackButton: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n() // ✅ NOUVEAU: Fonction de traduction
    const { getCurrentLanguageInfo } = useLang() // ✅ NOUVEAU: Fonction pour RTL
    
    // Composables
    const { currentUser, logout: authLogout } = useAuth()
    const { 
      syncStats, 
      isOnline, 
      lastSync,
      hasFailedItems,
      hasPendingItems,
      syncProgress,
      processQueue,
      retryAllFailed
    } = getGlobalSyncQueue()
    
    const {
      currentPosition,
      accuracy,
      isTracking,
      lastUpdate,
      error,
      accuracyLevel: gpsAccuracyLevel,
      formattedPosition,
      getCurrentPosition
    } = globalGeolocation
    
    // État local
    const showSyncDialog = ref(false)
    const showGpsDetails = ref(false)
    const showOnboarding = ref(false)
    const isForceUpdating = ref(false)
    
    // ✅ NOUVEAU: Variables pour la carte GPS
    const mapContainer = ref(null)
    const mapInstance = ref(null)
    const mapMarker = ref(null)
    const accuracyCircle = ref(null)
    const mapLoading = ref(false)
    
    // Computed
    const isRTL = computed(() => {
      return getCurrentLanguageInfo.value?.direction === 'rtl'
    })
    
    const appTitle = computed(() => {
      return t('app.title')
    })
    
    const syncIndicatorColor = computed(() => {
      if (syncStats.syncing > 0) return 'info'
      if (syncStats.failed > 0) return 'error'
      if (syncStats.pending > 0) return 'warning'
      return 'success'
    })
    
    const syncIcon = computed(() => {
      if (syncStats.syncing > 0) return 'mdi-cloud-sync'
      if (syncStats.failed > 0) return 'mdi-cloud-alert'
      if (syncStats.pending > 0) return 'mdi-cloud-clock'
      return 'mdi-cloud-check'
    })
    
    const syncTooltip = computed(() => {
      if (syncStats.syncing > 0) return `Synchronisation en cours (${syncStats.syncing})`
      if (syncStats.failed > 0) return `${syncStats.failed} audit(s) échoué(s)`
      if (syncStats.pending > 0) return `${syncStats.pending} audit(s) en attente`
      return 'Tous les audits sont synchronisés'
    })
    
    const syncStatusText = computed(() => {
      if (syncStats.syncing > 0) return t('sync.status.syncing')
      if (syncStats.failed > 0) return t('sync.messages.error') + ` (${syncStats.failed})`
      if (syncStats.pending > 0) return t('common.pending') + ` (${syncStats.pending})`
      return t('sync.messages.success')
    })
    
    const gpsStatusText = computed(() => {
      if (currentPosition?.value) {
        return t('location.accuracy') + ': ' + (formattedPosition?.value?.accuracy || t('common.unknown'))
      }
      return error?.value || t('location.requesting')
    })
    
    const networkColor = computed(() => {
      return isOnline.value ? 'success' : 'error'
    })
    
    const networkIcon = computed(() => {
      return isOnline.value ? 'mdi-wifi' : 'mdi-wifi-off'
    })
    
    const formatLastUpdate = computed(() => {
      if (!lastUpdate?.value) return 'Jamais'
      return formatTime(lastUpdate.value)
    })
    
    
    // ✅ NOUVEAU: Hauteur de la carte (plein écran moins header)
    const mapHeight = computed(() => {
      return 'calc(100vh - 120px)' // 64px toolbar + 56px infos GPS
    })
    
    // ✅ CORRIGÉ: Watcher défensif pour mise à jour temps réel de la carte
    watch(
      () => currentPosition?.value, 
      (newPosition) => {
        if (newPosition && showGpsDetails?.value && mapInstance?.value) {
          console.log('📍 Position GPS changée - Mise à jour carte')
          updateMapPosition()
        }
      }, 
      { deep: true }
    )
    
    // Méthodes
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }
    
    const startFirstAudit = () => {
      showOnboarding.value = false
      router.push('/audit')
    }
    
    const logout = async () => {
      await authLogout()
      router.push('/login')
    }
    
    // ✅ MODIFIÉ: Afficher carte plein écran avec position GPS
    const toggleGpsDetails = async () => {
      if (!showGpsDetails?.value) {
        // Ouvrir la carte
        showGpsDetails.value = true
        
        if (currentPosition?.value) {
          // Attendre que le DOM soit mis à jour
          await nextTick()
          mapLoading.value = true
          try {
            await initializeMap()
          } finally {
            mapLoading.value = false
          }
        }
      } else {
        // Fermer la carte
        showGpsDetails.value = false
        mapLoading.value = false
        
        // Nettoyer la carte
        if (mapInstance?.value) {
          mapInstance.value.remove()
          mapInstance.value = null
          mapMarker.value = null
          accuracyCircle.value = null
        }
      }
    }
    
    // ✅ NOUVEAU: Initialiser la carte Leaflet
    const initializeMap = async () => {
      if (!mapContainer?.value || !currentPosition?.value) return
      
      try {
        // ✅ CORRIGÉ: Charger Leaflet avec script tag classique
        if (!window.L) {
          await loadLeaflet()
        }
        
        // Créer la carte
        const lat = currentPosition.value.latitude
        const lng = currentPosition.value.longitude
        const acc = currentPosition.value.accuracy || 1000
        
        // Détruire l'ancienne carte si elle existe
        if (mapInstance?.value) {
          mapInstance.value.remove()
        }
        
        // Créer nouvelle carte
        mapInstance.value = window.L.map(mapContainer.value, {
          center: [lat, lng],
          zoom: acc < 100 ? 16 : acc < 500 ? 14 : 12,
          zoomControl: true
        })
        
        // Ajouter couche de tuiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(mapInstance.value)
        
        // Ajouter marqueur position
        mapMarker.value = window.L.marker([lat, lng], {
          icon: window.L.divIcon({
            className: 'gps-marker',
            html: `<div style="
              width: 20px;
              height: 20px;
              background: #4285f4;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(mapInstance.value)
        
        // Ajouter cercle de précision
        // ✅ CORRIGÉ: Limiter le rayon pour éviter des cercles géants
        const displayRadius = Math.min(acc, 5000) // Max 5km pour l'affichage
        const circleColor = gpsAccuracyLevel.value.color === 'success' ? '#4CAF50' : 
               gpsAccuracyLevel.value.color === 'warning' ? '#FF9800' : '#F44336'
        
        accuracyCircle.value = window.L.circle([lat, lng], {
          radius: displayRadius,
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: acc > 1000 ? 0.05 : 0.1, // Plus transparent si très imprécis
          weight: acc > 1000 ? 1 : 2
        }).addTo(mapInstance.value)
        
        // Popup avec infos
        const popupContent = `
          <div style="text-align: center; font-family: Roboto, sans-serif;">
            <div style="font-weight: 500; margin-bottom: 8px;">📍 Ma Position</div>
            <div style="font-size: 12px; color: #666;">
              <strong>Coordonnées:</strong><br>
              ${formattedPosition?.value?.lat || lat.toFixed(6)}, ${formattedPosition?.value?.lng || lng.toFixed(6)}<br><br>
              <strong>Précision réelle:</strong> ${formattedPosition?.value?.accuracy || (acc + ' m')}<br>
              <strong>Cercle affiché:</strong> ${displayRadius < acc ? (displayRadius/1000).toFixed(1) + 'km (limité)' : (formattedPosition?.value?.accuracy || (acc + ' m'))}<br>
              <strong>Qualité:</strong> <span style="color: ${gpsAccuracyLevel.value.color};">${gpsAccuracyLevel.value.text}</span>
            </div>
          </div>
        `
        
        mapMarker.value.bindPopup(popupContent).openPopup()
        
        console.log('✅ Carte GPS initialisée avec succès')
      } catch (error) {
        console.error('❌ Erreur initialisation carte:', error)
      }
    }
    
    // ✅ NOUVEAU: Charger Leaflet de façon robuste
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        // Vérifier si déjà chargé
        if (window.L) {
          resolve()
          return
        }
        
        // Charger CSS Leaflet
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(cssLink)
        
        // Charger JS Leaflet
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          console.log('✅ Leaflet chargé avec succès')
          resolve()
        }
        script.onerror = (error) => {
          console.error('❌ Erreur chargement Leaflet:', error)
          reject(error)
        }
        document.head.appendChild(script)
      })
    }
    
    const refreshGps = async () => {
      try {
        await getCurrentPosition()
        
        // Mettre à jour la carte si elle est affichée
        if (showGpsDetails?.value && mapInstance?.value && currentPosition?.value) {
          updateMapPosition()
        }
      } catch (error) {
        console.error('Erreur actualisation GPS:', error)
      }
    }
    
    // ✅ NOUVEAU: Mettre à jour la position sur la carte
    const updateMapPosition = () => {
      if (!mapInstance?.value || !currentPosition?.value) return
      
      const lat = currentPosition.value.latitude
      const lng = currentPosition.value.longitude
      const acc = currentPosition.value.accuracy || 1000
      const displayRadius = Math.min(acc, 5000)
      const circleColor = gpsAccuracyLevel.value.color === 'success' ? '#4CAF50' : 
             gpsAccuracyLevel.value.color === 'warning' ? '#FF9800' : '#F44336'
      
      // Mettre à jour marqueur
      if (mapMarker?.value) {
        mapMarker.value.setLatLng([lat, lng])
      }
      
      // Mettre à jour cercle
      if (accuracyCircle?.value) {
        accuracyCircle.value.setLatLng([lat, lng])
        accuracyCircle.value.setRadius(displayRadius)
        accuracyCircle.value.setStyle({
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: acc > 1000 ? 0.05 : 0.1,
          weight: acc > 1000 ? 1 : 2
        })
      }
      
      // Mettre à jour popup
      if (mapMarker?.value) {
        const popupContent = `
          <div style="text-align: center; font-family: Roboto, sans-serif;">
            <div style="font-weight: 500; margin-bottom: 8px;">📍 Ma Position</div>
            <div style="font-size: 12px; color: #666;">
              <strong>Coordonnées:</strong><br>
              ${formattedPosition?.value?.lat || lat.toFixed(6)}, ${formattedPosition?.value?.lng || lng.toFixed(6)}<br><br>
              <strong>Précision réelle:</strong> ${formattedPosition?.value?.accuracy || (acc + ' m')}<br>
              <strong>Cercle affiché:</strong> ${displayRadius < acc ? (displayRadius/1000).toFixed(1) + 'km (limité)' : (formattedPosition?.value?.accuracy || (acc + ' m'))}<br>
              <strong>Qualité:</strong> <span style="color: ${gpsAccuracyLevel.value.color};">${gpsAccuracyLevel.value.text}</span>
            </div>
          </div>
        `
        mapMarker.value.setPopupContent(popupContent)
      }
      
      // Centrer la carte si nécessaire (zoom adaptatif)
      const currentZoom = mapInstance?.value?.getZoom()
      const idealZoom = acc < 100 ? 16 : acc < 500 ? 14 : 12
      
      if (currentZoom && Math.abs(currentZoom - idealZoom) > 2) {
        mapInstance.value.setView([lat, lng], idealZoom)
      } else if (mapInstance?.value) {
        mapInstance.value.panTo([lat, lng])
      }
      
      console.log('🗺️ Position mise à jour sur la carte:', { lat, lng, accuracy: acc })
    }
    
    const manualSync = async () => {
      await processQueue()
    }
    
    const retryFailed = async () => {
      const retried = await retryAllFailed()
      if (retried > 0) {
        console.log(`🔁 ${retried} audit(s) remis en queue`)
      }
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return t('common.justNow')
      if (diff < 3600000) return t('common.minutesAgo', { count: Math.floor(diff / 60000) })
      if (diff < 86400000) return t('common.hoursAgo', { count: Math.floor(diff / 3600000) })
      
      // Utiliser le format local de la langue courante
      const locale = getCurrentLanguageInfo.value?.code || 'fr'
      return date.toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // ✅ NOUVEAU: Gestionnaire de changement de langue
    const handleLanguageChange = (newLang) => {
      console.log(`🌍 StatusBar: Langue changée vers ${newLang}`)
      // Le composable useLang s'occupe déjà de tout
    }
    
    // ✅ NOUVEAU: Gestionnaires PWA
    const handlePWAInstalled = () => {
      console.log('📱 PWA installée avec succès depuis le menu')
      // Optionnel: afficher un message de succès
    }
    
    const handlePWADismissed = () => {
      console.log('🙅 Utilisateur a rejeté l\'installation PWA')
      // Optionnel: tracker l'événement
    }
    
    // ✅ AJOUT: Méthode pour ouvrir le panel debug
    const openDebugPanel = () => {
      console.log('🐛 Ouverture du panel debug')
      // Émettre un événement pour que MobileDebugViewer l'intercepte
      window.dispatchEvent(new Event('toggle-debug-panel'))
    }
    
    // ✅ NOUVEAU: Méthode pour forcer la mise à jour de l'application
    const forceUpdateApp = async () => {
      if (isForceUpdating.value) return
      
      try {
        isForceUpdating.value = true
        console.log('🔄 Début du force update...')
        
        // 1. Vider le cache du Service Worker
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of registrations) {
            console.log('🧹 Nettoyage Service Worker:', registration.scope)
            await registration.unregister()
          }
        }
        
        // 2. Vider les caches du navigateur
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          for (const cacheName of cacheNames) {
            console.log('🧹 Suppression cache:', cacheName)
            await caches.delete(cacheName)
          }
        }
        
        // 3. Vider le localStorage (sauf données utilisateur critiques)
        const keysToPreserve = [
          'onuf_user',
          'onuf_token', 
          'manara_skip_intro',
          'onuf_current_language'
        ]
        
        const allKeys = Object.keys(localStorage)
        for (const key of allKeys) {
          if (!keysToPreserve.includes(key)) {
            localStorage.removeItem(key)
            console.log('🧹 Suppression localStorage:', key)
          }
        }
        
        // 4. Vider le sessionStorage
        sessionStorage.clear()
        console.log('🧹 sessionStorage vidé')
        
        // 5. Attendre un peu pour laisser le temps aux opérations
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('✅ Cache vidé - Rechargement...')
        
        // 6. Recharger l'application en forçant le réseau
        // location.reload(true) est déprécié, utiliser cette méthode
        window.location.href = window.location.href + '?_t=' + Date.now()
        
      } catch (error) {
        console.error('❌ Erreur lors du force update:', error)
        isForceUpdating.value = false
        
        // Fallback: rechargement simple
        window.location.reload()
      }
    }
    
    return {
      // Data
      currentUser,
      showSyncDialog,
      showGpsDetails,
      showOnboarding,
      mapContainer,
      mapInstance,
      mapLoading,
      isForceUpdating,
      
      // Sync
      syncStats,
      isOnline,
      lastSync,
      syncProgress,
      
      // GPS
      currentPosition,
      accuracy,
      isTracking,
      lastUpdate,
      error,
      gpsAccuracyLevel,
      formattedPosition,
      
      // Computed
      isRTL,
      appTitle,
      mapHeight,
      syncIndicatorColor,
      syncIcon,
      syncTooltip,
      syncStatusText,
      gpsStatusText,
      networkColor,
      networkIcon,
      formatLastUpdate,
      
      // Methods
      goBack,
      startFirstAudit,
      logout,
      toggleGpsDetails,
      refreshGps,
      manualSync,
      retryFailed,
      formatTime,
      handleLanguageChange, // ✅ NOUVEAU: Ajouter la méthode au return
      handlePWAInstalled, // ✅ NOUVEAU: Gestionnaire PWA
      handlePWADismissed, // ✅ NOUVEAU: Gestionnaire PWA
      openDebugPanel, // ✅ AJOUT: Méthode pour ouvrir le panel debug
      forceUpdateApp, // ✅ NOUVEAU: Méthode pour forcer la mise à jour
      t // ✅ NOUVEAU: Fonction de traduction
    }
  }
}
</script>

<style scoped>
.status-bar {
  z-index: 1100 !important;
}

.sync-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

/* Déjà défini plus bas dans RTL */

.gps-details .row {
  margin-bottom: 8px;
}

.sync-stats .text-h4 {
  font-weight: 600;
}

/* ✅ NOUVEAU: Styles pour la carte GPS plein écran */
.gps-fullscreen-map {
  width: 100%;
  position: relative;
  background: #f5f5f5;
}

/* ✅ NOUVEAU: Overlay de chargement */
.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Styles pour les éléments Leaflet */
:deep(.leaflet-container) {
  font-family: 'Roboto', sans-serif !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.leaflet-popup-tip) {
  background: white;
}

.gps-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === ONBOARDING === */
.onboarding-icon {
  font-size: 3rem;
  line-height: 1;
}

.onboarding-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.onboarding-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

/* Logo de l'application */
.app-logo {
  height: 36px;
  width: auto;
  object-fit: contain;
  margin-left: 4px;
  flex-shrink: 0;
}

/* Support RTL amélioré */
.order-1 {
  order: 1;
}

.order-2 {
  order: 2;
}

/* Gaps responsive pour RTL */
.gap-2 > * + * {
  margin-left: 8px;
}

.gap-2.order-1 > * + * {
  margin-left: 8px;
  margin-right: 0;
}

/* Text alignment pour RTL */
.text-right {
  text-align: right;
}

/* Marges dynamiques pour RTL */
.ml-2 {
  margin-left: 8px !important;
}

.ml-4 {
  margin-left: 16px !important;
}

/* Ajustements spécifiques pour le RTL */
[dir="rtl"] .app-logo {
  margin-left: 0;
  margin-right: 4px;
}

[dir="rtl"] .gap-2 > * + * {
  margin-left: 0;
  margin-right: 8px;
}

/* Support spécifique pour les menus en RTL */
[dir="rtl"] .v-list-subheader {
  text-align: right;
}

[dir="rtl"] .v-list-item-title {
  text-align: right;
}

[dir="rtl"] .v-list-item-subtitle {
  text-align: right;
}

/* Ajustement pour les icônes en RTL */
[dir="rtl"] .v-list-item__prepend {
  margin-left: 16px;
  margin-right: 0;
}
</style>
