<template>
  <div class="location-widget">
    <!-- État : Pas de localisation -->
    <div v-if="!hasLocation" class="location-empty">
      <div class="location-icon-wrapper">
        <v-icon size="48" color="grey">mdi-map-marker-off</v-icon>
        <div class="pulse-ring"></div>
      </div>
      
      <h3 class="text-h6 mt-3 mb-2">Localisation requise</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Activez la géolocalisation pour continuer
      </p>
      
      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        @click="requestLocation"
        :loading="loading"
        class="locate-btn"
      >
        <v-icon start>mdi-crosshairs-gps</v-icon>
        Obtenir ma position
      </v-btn>
    </div>

    <!-- État : Chargement -->
    <div v-else-if="loading" class="location-loading">
      <div class="location-icon-wrapper">
        <v-icon size="48" color="primary" class="rotating">mdi-loading</v-icon>
        <div class="pulse-ring active"></div>
      </div>
      <p class="text-body-1 mt-3">Recherche de votre position...</p>
      <v-progress-linear
        indeterminate
        color="primary"
        class="mt-3"
      ></v-progress-linear>
    </div>

    <!-- État : Localisation obtenue -->
    <div v-else class="location-found">
      <!-- Carte interactive -->
      <div class="map-container" ref="mapContainer">
        <div class="map-overlay">
          <v-chip
            :color="accuracyColor"
            size="small"
            class="accuracy-chip"
          >
            <v-icon start size="small">mdi-crosshairs-gps</v-icon>
            ± {{ Math.round(accuracy) }}m
          </v-chip>
        </div>
        <div class="map-controls">
          <v-btn
            icon
            size="small"
            variant="elevated"
            color="white"
            @click="recenterMap"
            class="recenter-btn"
          >
            <v-icon>mdi-crosshairs-gps</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Infos de localisation -->
      <div class="location-info">
        <div class="location-header">
          <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
          <div class="location-text">
            <h4 class="text-subtitle-1 font-weight-bold">{{ locationName }}</h4>
            <p class="text-caption text-medium-emphasis">
              {{ coordinates.lat.toFixed(6) }}, {{ coordinates.lng.toFixed(6) }}
            </p>
          </div>
          <v-btn
            icon
            size="small"
            variant="text"
            @click="refreshLocation"
            :loading="refreshing"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>

        <!-- Actions rapides -->
        <div class="location-actions mt-3">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            @click="openInMaps"
            class="mr-2"
          >
            <v-icon start size="small">mdi-map</v-icon>
            Ouvrir dans Maps
          </v-btn>
          
          <v-btn
            size="small"
            variant="tonal"
            @click="shareLocation"
          >
            <v-icon start size="small">mdi-share</v-icon>
            Partager
          </v-btn>
        </div>

        <!-- Détails techniques (expandable) -->
        <v-expansion-panels
          v-model="detailsPanel"
          variant="accordion"
          class="mt-3"
        >
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" size="small">mdi-information</v-icon>
              Détails GPS
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="gps-details">
                <div class="detail-row">
                  <span class="detail-label">Précision :</span>
                  <span class="detail-value">{{ accuracy }}m</span>
                </div>
                <div class="detail-row" v-if="altitude">
                  <span class="detail-label">Altitude :</span>
                  <span class="detail-value">{{ Math.round(altitude) }}m</span>
                </div>
                <div class="detail-row" v-if="speed">
                  <span class="detail-label">Vitesse :</span>
                  <span class="detail-value">{{ (speed * 3.6).toFixed(1) }} km/h</span>
                </div>
                <div class="detail-row" v-if="heading">
                  <span class="detail-label">Direction :</span>
                  <span class="detail-value">{{ Math.round(heading) }}°</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Timestamp :</span>
                  <span class="detail-value">{{ formatTime(timestamp) }}</span>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>

    <!-- Snackbar pour messages -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: null, lng: null })
  },
  autoStart: {
    type: Boolean,
    default: false
  },
  showDetails: {
    type: Boolean,
    default: true
  },
  mapHeight: {
    type: String,
    default: '200px'
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'location-obtained', 'error'])

// État
const loading = ref(false)
const refreshing = ref(false)
const coordinates = ref({ lat: null, lng: null })
const accuracy = ref(null)
const altitude = ref(null)
const speed = ref(null)
const heading = ref(null)
const timestamp = ref(null)
const locationName = ref('Position inconnue')
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const accuracyCircle = ref(null)
const detailsPanel = ref([])
const watchId = ref(null)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('info')

// Computed
const hasLocation = computed(() => 
  coordinates.value.lat !== null && coordinates.value.lng !== null
)

const accuracyColor = computed(() => {
  if (!accuracy.value) return 'grey'
  if (accuracy.value <= 10) return 'success'
  if (accuracy.value <= 50) return 'warning'
  return 'error'
})

// Méthodes
const requestLocation = async () => {
  if (!navigator.geolocation) {
    showError('Géolocalisation non supportée')
    return
  }

  loading.value = true
  
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }

  try {
    // Demander permission si nécessaire
    if (navigator.permissions) {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      if (result.state === 'denied') {
        showError('Permission de géolocalisation refusée')
        loading.value = false
        return
      }
    }

    // Obtenir position
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    )

    // Démarrer le suivi en temps réel
    if (!watchId.value) {
      watchId.value = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      )
    }
  } catch (error) {
    handleError(error)
  }
}

const handleSuccess = async (position) => {
  const { latitude, longitude } = position.coords
  
  coordinates.value = { lat: latitude, lng: longitude }
  accuracy.value = position.coords.accuracy
  altitude.value = position.coords.altitude
  speed.value = position.coords.speed
  heading.value = position.coords.heading
  timestamp.value = position.timestamp

  // Émettre les coordonnées
  emit('update:modelValue', coordinates.value)
  emit('location-obtained', {
    coordinates: coordinates.value,
    accuracy: accuracy.value,
    details: position.coords
  })

  // Géocodage inverse
  await reverseGeocode(latitude, longitude)

  // Mettre à jour la carte
  if (hasLocation.value) {
    await nextTick()
    updateMap()
  }

  loading.value = false
  refreshing.value = false
}

const handleError = (error) => {
  loading.value = false
  refreshing.value = false

  let message = 'Erreur de géolocalisation'
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = 'Permission refusée'
      break
    case error.POSITION_UNAVAILABLE:
      message = 'Position indisponible'
      break
    case error.TIMEOUT:
      message = 'Délai d\'attente dépassé'
      break
  }

  showError(message)
  emit('error', error)
}

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`
    )
    
    if (response.ok) {
      const data = await response.json()
      const address = data.address || {}
      
      locationName.value = 
        address.amenity ||
        address.road ||
        address.suburb ||
        address.city ||
        address.town ||
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        
      if (address.city || address.town) {
        locationName.value += `, ${address.city || address.town}`
      }
    }
  } catch (error) {
    console.error('Erreur géocodage:', error)
  }
}

const updateMap = async () => {
  if (!mapContainer.value || !hasLocation.value) return

  try {
    // Charger Leaflet si nécessaire
    if (!window.L) {
      // Charger CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
      
      // Charger JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      await new Promise((resolve) => {
        script.onload = resolve
        document.head.appendChild(script)
      })
    }

    const { lat, lng } = coordinates.value

    if (!map.value) {
      // Créer la carte
      map.value = window.L.map(mapContainer.value, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: false,
        keyboard: false
      }).setView([lat, lng], 16)

      // Ajouter les tuiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

      // Ajouter le marqueur avec animation
      const pulsingIcon = window.L.divIcon({
        className: 'pulsing-marker',
        html: '<div class="marker-pin"></div><div class="marker-pulse"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      })

      marker.value = window.L.marker([lat, lng], { icon: pulsingIcon }).addTo(map.value)

      // Ajouter cercle de précision
      accuracyCircle.value = window.L.circle([lat, lng], {
        radius: Math.min(accuracy.value || 50, 5000),
        color: '#F3C348',
        fillColor: '#F3C348',
        fillOpacity: 0.1,
        weight: 2
      }).addTo(map.value)
    } else {
      // Mettre à jour position
      map.value.setView([lat, lng], 16)
      marker.value.setLatLng([lat, lng])
      accuracyCircle.value.setLatLng([lat, lng])
      accuracyCircle.value.setRadius(Math.min(accuracy.value || 50, 5000))
    }
  } catch (error) {
    console.error('Erreur carte:', error)
  }
}

const refreshLocation = () => {
  refreshing.value = true
  requestLocation()
}

const recenterMap = () => {
  if (map.value && hasLocation.value) {
    const { lat, lng } = coordinates.value
    map.value.setView([lat, lng], 16, {
      animate: true,
      duration: 0.5
    })
  }
}

const openInMaps = () => {
  const { lat, lng } = coordinates.value
  const url = `https://maps.google.com/maps?q=${lat},${lng}`
  window.open(url, '_blank')
}

const shareLocation = async () => {
  const { lat, lng } = coordinates.value
  const text = `📍 Ma position : ${locationName.value}\n${lat.toFixed(6)}, ${lng.toFixed(6)}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Ma position',
        text: text,
        url: `https://maps.google.com/maps?q=${lat},${lng}`
      })
    } catch (error) {
      console.error('Erreur partage:', error)
    }
  } else {
    // Fallback : copier dans le presse-papier
    try {
      await navigator.clipboard.writeText(text)
      showSuccess('Position copiée !')
    } catch (error) {
      console.error('Erreur copie:', error)
    }
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('fr-FR')
}

const showError = (message) => {
  snackbarText.value = message
  snackbarColor.value = 'error'
  snackbar.value = true
}

const showSuccess = (message) => {
  snackbarText.value = message
  snackbarColor.value = 'success'
  snackbar.value = true
}

// Lifecycle
onMounted(() => {
  if (props.autoStart) {
    requestLocation()
  }
})

onUnmounted(() => {
  // Arrêter le suivi GPS
  if (watchId.value) {
    navigator.geolocation.clearWatch(watchId.value)
  }
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.lat && newValue.lng) {
    coordinates.value = newValue
  }
})
</script>

<style scoped>
.location-widget {
  width: 100%;
  position: relative;
}

/* États */
.location-empty,
.location-loading {
  text-align: center;
  padding: var(--spacing-xl);
}

.location-found {
  width: 100%;
}

/* Icône avec animation */
.location-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: var(--spacing-md);
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--onuf-primary);
  opacity: 0;
}

.pulse-ring.active {
  animation: pulse-gps 2s infinite;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Carte */
.map-container {
  position: relative;
  width: 100%;
  height: v-bind(mapHeight);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.map-overlay {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: 1000;
}

.map-controls {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: 1000;
}

.recenter-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.accuracy-chip {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
}

/* Infos localisation */
.location-info {
  padding: var(--spacing-md);
}

.location-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.location-text {
  flex: 1;
}

.location-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Détails GPS */
.gps-details {
  font-family: monospace;
  font-size: 0.875rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: var(--onuf-text-secondary);
}

.detail-value {
  font-weight: 500;
}

/* Bouton localisation */
.locate-btn {
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.locate-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Marqueur animé pour Leaflet */
:deep(.pulsing-marker) {
  position: relative;
}

:deep(.marker-pin) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--onuf-primary);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.marker-pulse) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--onuf-primary);
  animation: pulse-gps 2s infinite;
}

/* Responsive */
@media (max-width: 600px) {
  .location-actions {
    flex-direction: column;
  }
  
  .location-actions .v-btn {
    width: 100%;
  }
}
</style>
