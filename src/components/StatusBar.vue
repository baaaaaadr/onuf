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
    <div class="d-flex align-center justify-space-between w-100">
      <!-- Gauche: Logo + Titre -->
      <div class="d-flex align-center">
        <v-btn
          icon
          @click="goBack"
          v-if="showBackButton"
          class="mr-2"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        
        <v-icon class="mr-2" size="28">mdi-map-marker-check</v-icon>
        <div>
          <div class="text-h6 font-weight-bold">{{ appTitle }}</div>
          <div class="text-caption opacity-80" v-if="pageTitle">{{ pageTitle }}</div>
        </div>
      </div>

      <!-- Droite: Boutons Navigation + Indicateurs -->
      <div class="d-flex align-center gap-2">
        

        
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
            
            <!-- Guide de démarrage -->
            <v-list-item @click="showOnboarding = true">
              <template v-slot:prepend>
                <v-icon>mdi-play-circle-outline</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.startGuide') }}</v-list-item-title>
            </v-list-item>
            
            <v-divider class="my-2" />
            
            <!-- ✅ NOUVEAU: Sélecteur de langue -->
            <v-list-subheader>Langue / Language / اللغة</v-list-subheader>
            
            <LanguageSwitcher 
              variant="list" 
              @language-changed="handleLanguageChange"
            />
            
            <v-divider class="my-2" />
            
            <!-- Section Utilisateur -->
            <v-list-subheader>{{ currentUser?.display_name || currentUser?.username || 'Utilisateur' }}</v-list-subheader>
            
            <v-list-item @click="$router.push('/profile')">
              <template v-slot:prepend>
                <v-icon>mdi-account-settings</v-icon>
              </template>
              <v-list-item-title>{{ t('menu.profile') }}</v-list-item-title>
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
          Géolocalisation GPS
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
            <div class="text-caption text--secondary">Position</div>
            <div class="text-body-2 font-weight-medium">
              {{ formattedPosition.lat }}, {{ formattedPosition.lng }}
            </div>
          </v-col>
          <v-col cols="3">
            <div class="text-caption text--secondary">Précision</div>
            <div class="text-body-2" :class="`${gpsAccuracyLevel.color}--text`">
              {{ formattedPosition.accuracy }}
            </div>
          </v-col>
          <v-col cols="3">
            <div class="text-caption text--secondary">Qualité</div>
            <div class="text-body-2" :class="`${gpsAccuracyLevel.color}--text`">
              {{ gpsAccuracyLevel.text }}
            </div>
          </v-col>
          <v-col cols="3" v-if="lastUpdate">
            <div class="text-caption text--secondary">Mise à jour</div>
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
            <div class="text-h6 mt-4">Chargement de la carte...</div>
            <div class="text-body-2 text--secondary">Initialisation Leaflet</div>
          </div>
        </div>
      </div>
      
      <!-- Message si pas de GPS -->
      <v-card-text v-else class="text-center py-8">
        <v-icon size="64" color="grey">mdi-map-marker-off</v-icon>
        <div class="text-h6 mt-4">Position GPS non disponible</div>
        <div class="text-body-2 text--secondary mt-2">
          {{ error || 'Activation de la géolocalisation en cours...' }}
        </div>
        <v-btn
          color="primary"
          class="mt-4"
          @click="refreshGps"
          :loading="isTracking"
        >
          <v-icon left>mdi-refresh</v-icon>
          Réessayer
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog détails sync -->
  <v-dialog v-model="showSyncDialog" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" :color="syncIndicatorColor">{{ syncIcon }}</v-icon>
        Synchronisation Cloud
      </v-card-title>
      
      <v-card-text>
        <!-- Statistiques globales -->
        <div class="sync-stats mb-4">
          <v-row>
            <v-col cols="3" class="text-center">
              <div class="text-h4 success--text">{{ syncStats.success }}</div>
              <div class="text-caption">Synchronisés</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 warning--text">{{ syncStats.pending }}</div>
              <div class="text-caption">En attente</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 info--text">{{ syncStats.syncing }}</div>
              <div class="text-caption">En cours</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 error--text">{{ syncStats.failed }}</div>
              <div class="text-caption">Échoués</div>
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
            ✅ Connecté - Synchronisation automatique active
          </span>
          <span v-else>
            📴 Hors ligne - Les audits seront synchronisés à la reconnexion
          </span>
        </v-alert>

        <!-- Dernière sync -->
        <div v-if="lastSync" class="text-caption text--secondary mb-3">
          Dernière synchronisation: {{ formatTime(lastSync) }}
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
            Synchroniser maintenant
          </v-btn>
          
          <v-btn
            small
            color="warning"
            @click="retryFailed"
            :disabled="syncStats.failed === 0 || !isOnline"
          >
            <v-icon left small>mdi-refresh</v-icon>
            Réessayer ({{ syncStats.failed }})
          </v-btn>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showSyncDialog = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog onboarding -->
  <v-dialog v-model="showOnboarding" max-width="600" rounded="lg">
    <v-card rounded="lg">
      <v-card-title class="pa-6 text-center">
        <div class="onboarding-icon mb-3">🎯</div>
        <div class="text-h5 font-weight-bold">
          Bienvenue dans ONUF !
        </div>
      </v-card-title>
      
      <v-card-text class="px-6">
        <div class="onboarding-steps">
          <div class="onboarding-step mb-4">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">📍 Activez votre GPS</h3>
              <p class="text-body-2">
                Pour contextualiser vos audits de sécurité, l'application a besoin de votre position.
              </p>
            </div>
          </div>
          
          <div class="onboarding-step mb-4">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">🔍 Observez votre environnement</h3>
              <p class="text-body-2">
                Évaluez les aspects de sécurité : éclairage, cheminement, ouverture, ressenti...
              </p>
            </div>
          </div>
          
          <div class="onboarding-step mb-4">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">📱 Répondez aux questions</h3>
              <p class="text-body-2">
                Interface simple avec emojis et choix visuels. Prise de photos optionnelle.
              </p>
            </div>
          </div>
          
          <div class="onboarding-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="text-h6 font-weight-semibold mb-2">☁️ Synchronisation automatique</h3>
              <p class="text-body-2">
                Vos données sont sauvegardées localement et synchronisées quand possible.
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
          Commencer mon premier audit !
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
// ✅ NOUVEAU: Import du composant de changement de langue
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

export default {
  name: 'StatusBar',
  components: {
    LanguageSwitcher // ✅ NOUVEAU: Enregistrer le composant
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
    
    // ✅ NOUVEAU: Variables pour la carte GPS
    const mapContainer = ref(null)
    const mapInstance = ref(null)
    const mapMarker = ref(null)
    const accuracyCircle = ref(null)
    const mapLoading = ref(false)
    
    // Computed
    const appTitle = computed(() => {
      return 'MANARA'
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
      if (syncStats.syncing > 0) return 'Synchronisation en cours...'
      if (syncStats.failed > 0) return `${syncStats.failed} audit(s) échoué(s)`
      if (syncStats.pending > 0) return `${syncStats.pending} audit(s) en attente`
      return 'Tous les audits sont synchronisés'
    })
    
    const gpsStatusText = computed(() => {
      if (currentPosition.value) {
        return `Précision: ${formattedPosition.value?.accuracy || 'Inconnue'}`
      }
      return error.value || 'Activation en cours...'
    })
    
    const networkColor = computed(() => {
      return isOnline.value ? 'success' : 'error'
    })
    
    const networkIcon = computed(() => {
      return isOnline.value ? 'mdi-wifi' : 'mdi-wifi-off'
    })
    
    const formatLastUpdate = computed(() => {
      if (!lastUpdate.value) return 'Jamais'
      return formatTime(lastUpdate.value)
    })
    
    
    // ✅ NOUVEAU: Hauteur de la carte (plein écran moins header)
    const mapHeight = computed(() => {
      return 'calc(100vh - 120px)' // 64px toolbar + 56px infos GPS
    })
    
    // ✅ NOUVEAU: Watcher pour mise à jour temps réel de la carte
    watch(currentPosition, (newPosition) => {
      if (newPosition && showGpsDetails.value && mapInstance.value) {
        console.log('📍 Position GPS changée - Mise à jour carte')
        updateMapPosition()
      }
    }, { deep: true })
    
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
      if (!showGpsDetails.value) {
        // Ouvrir la carte
        showGpsDetails.value = true
        
        if (currentPosition.value) {
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
        if (mapInstance.value) {
          mapInstance.value.remove()
          mapInstance.value = null
          mapMarker.value = null
          accuracyCircle.value = null
        }
      }
    }
    
    // ✅ NOUVEAU: Initialiser la carte Leaflet
    const initializeMap = async () => {
      if (!mapContainer.value || !currentPosition.value) return
      
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
        if (mapInstance.value) {
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
              ${formattedPosition.value.lat}, ${formattedPosition.value.lng}<br><br>
              <strong>Précision réelle:</strong> ${formattedPosition.value.accuracy}<br>
              <strong>Cercle affiché:</strong> ${displayRadius < acc ? (displayRadius/1000).toFixed(1) + 'km (limité)' : formattedPosition.value.accuracy}<br>
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
        if (showGpsDetails.value && mapInstance.value && currentPosition.value) {
          updateMapPosition()
        }
      } catch (error) {
        console.error('Erreur actualisation GPS:', error)
      }
    }
    
    // ✅ NOUVEAU: Mettre à jour la position sur la carte
    const updateMapPosition = () => {
      if (!mapInstance.value || !currentPosition.value) return
      
      const lat = currentPosition.value.latitude
      const lng = currentPosition.value.longitude
      const acc = currentPosition.value.accuracy || 1000
      const displayRadius = Math.min(acc, 5000)
      const circleColor = gpsAccuracyLevel.value.color === 'success' ? '#4CAF50' : 
             gpsAccuracyLevel.value.color === 'warning' ? '#FF9800' : '#F44336'
      
      // Mettre à jour marqueur
      if (mapMarker.value) {
        mapMarker.value.setLatLng([lat, lng])
      }
      
      // Mettre à jour cercle
      if (accuracyCircle.value) {
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
      if (mapMarker.value) {
        const popupContent = `
          <div style="text-align: center; font-family: Roboto, sans-serif;">
            <div style="font-weight: 500; margin-bottom: 8px;">📍 Ma Position</div>
            <div style="font-size: 12px; color: #666;">
              <strong>Coordonnées:</strong><br>
              ${formattedPosition.value.lat}, ${formattedPosition.value.lng}<br><br>
              <strong>Précision réelle:</strong> ${formattedPosition.value.accuracy}<br>
              <strong>Cercle affiché:</strong> ${displayRadius < acc ? (displayRadius/1000).toFixed(1) + 'km (limité)' : formattedPosition.value.accuracy}<br>
              <strong>Qualité:</strong> <span style="color: ${gpsAccuracyLevel.value.color};">${gpsAccuracyLevel.value.text}</span>
            </div>
          </div>
        `
        mapMarker.value.setPopupContent(popupContent)
      }
      
      // Centrer la carte si nécessaire (zoom adaptatif)
      const currentZoom = mapInstance.value.getZoom()
      const idealZoom = acc < 100 ? 16 : acc < 500 ? 14 : 12
      
      if (Math.abs(currentZoom - idealZoom) > 2) {
        mapInstance.value.setView([lat, lng], idealZoom)
      } else {
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
      
      if (diff < 60000) return 'À l\'instant'
      if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)}min`
      if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
      
      return date.toLocaleDateString('fr-FR', {
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
    
    return {
      // Data
      currentUser,
      showSyncDialog,
      showGpsDetails,
      showOnboarding,
      mapContainer,
      mapInstance,
      mapLoading,
      
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

.gap-2 > * + * {
  margin-left: 8px;
}

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
</style>
