// src/composables/useGeolocation.js
// Géolocalisation globale avec indicateur de précision
import { ref, computed, readonly } from 'vue'

// État global de géolocalisation
const currentPosition = ref(null)
const accuracy = ref(null)
const isTracking = ref(false)
const lastUpdate = ref(null)
const error = ref(null)

// Niveaux de précision
const ACCURACY_LEVELS = {
  EXCELLENT: { max: 10, color: 'success', icon: 'mdi-crosshairs-gps', text: 'Excellent' },
  GOOD: { max: 50, color: 'primary', icon: 'mdi-map-marker-check', text: 'Bonne' },
  FAIR: { max: 100, color: 'warning', icon: 'mdi-map-marker-alert', text: 'Correcte' },
  POOR: { max: 500, color: 'error', icon: 'mdi-map-marker-question', text: 'Faible' },
  VERY_POOR: { max: Infinity, color: 'error', icon: 'mdi-map-marker-off', text: 'Très faible' }
}

export const useGeolocation = () => {
  let watchId = null
  
  // Configuration GPS optimisée
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000
  }

  // Obtenir le niveau de précision actuel
  const accuracyLevel = computed(() => {
    if (!accuracy.value) return ACCURACY_LEVELS.VERY_POOR
    
    for (const [level, config] of Object.entries(ACCURACY_LEVELS)) {
      if (accuracy.value <= config.max) {
        return config
      }
    }
    return ACCURACY_LEVELS.VERY_POOR
  })

  // Statut de disponibilité GPS
  const isGpsAvailable = computed(() => {
    return 'geolocation' in navigator
  })

  // Position formatée pour affichage
  const formattedPosition = computed(() => {
    if (!currentPosition.value) return null
    
    return {
      lat: currentPosition.value.latitude.toFixed(6),
      lng: currentPosition.value.longitude.toFixed(6),
      accuracy: accuracy.value ? `±${Math.round(accuracy.value)}m` : 'N/A'
    }
  })

  // Démarrer le suivi de position
  const startTracking = () => {
    if (!isGpsAvailable.value) {
      error.value = 'Géolocalisation non supportée'
      return false
    }

    if (isTracking.value) {
      console.log('🔄 Suivi GPS déjà actif')
      return true
    }

    console.log('🛰️ Démarrage suivi GPS...')
    isTracking.value = true
    error.value = null

    // Position unique d'abord
    getCurrentPosition()

    // Puis suivi continu
    watchId = navigator.geolocation.watchPosition(
      handlePositionSuccess,
      handlePositionError,
      geoOptions
    )

    return true
  }

  // Arrêter le suivi
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
    isTracking.value = false
    console.log('🛑 Suivi GPS arrêté')
  }

  // Obtenir position actuelle (une fois)
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!isGpsAvailable.value) {
        const err = new Error('Géolocalisation non supportée')
        error.value = err.message
        reject(err)
        return
      }

      console.log('📍 Demande position GPS...')
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handlePositionSuccess(position)
          resolve(position)
        },
        (err) => {
          handlePositionError(err)
          reject(err)
        },
        geoOptions
      )
    })
  }

  // Gérer succès de géolocalisation
  const handlePositionSuccess = (position) => {
    const { latitude, longitude, accuracy: posAccuracy } = position.coords
    
    currentPosition.value = { latitude, longitude }
    accuracy.value = posAccuracy
    lastUpdate.value = new Date().toISOString()
    error.value = null

    console.log(`📍 Position GPS mise à jour: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(posAccuracy)}m)`)
    
    // Émettre événement global pour les composants qui écoutent
    window.dispatchEvent(new CustomEvent('gps-position-updated', {
      detail: {
        position: currentPosition.value,
        accuracy: accuracy.value,
        timestamp: lastUpdate.value
      }
    }))
  }

  // Gérer erreurs de géolocalisation
  const handlePositionError = (err) => {
    let errorMessage = 'Erreur géolocalisation inconnue'
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Permission géolocalisation refusée'
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Position indisponible'
        break
      case err.TIMEOUT:
        errorMessage = 'Timeout géolocalisation'
        break
    }
    
    error.value = errorMessage
    console.error('❌ Erreur GPS:', errorMessage, err)
    
    // Émettre événement d'erreur
    window.dispatchEvent(new CustomEvent('gps-error', {
      detail: { error: errorMessage, code: err.code }
    }))
  }

  // Demander permission explicitement
  const requestPermission = async () => {
    if (!isGpsAvailable.value) return false

    try {
      // Tenter d'obtenir la position pour déclencher la demande de permission
      await getCurrentPosition()
      return true
    } catch (error) {
      console.error('Permission GPS refusée:', error)
      return false
    }
  }

  // Calculer distance entre deux points (en mètres)
  const calculateDistance = (pos1, pos2) => {
    const R = 6371e3 // Rayon terre en mètres
    const φ1 = pos1.latitude * Math.PI/180
    const φ2 = pos2.latitude * Math.PI/180
    const Δφ = (pos2.latitude-pos1.latitude) * Math.PI/180
    const Δλ = (pos2.longitude-pos1.longitude) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  // Vérifier si position est assez précise
  const isAccuracyGoodEnough = (minAccuracy = 100) => {
    return accuracy.value && accuracy.value <= minAccuracy
  }

  // Obtenir adresse depuis coordonnées (géocodage inverse)
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      
      if (!response.ok) throw new Error('Erreur géocodage')
      
      const data = await response.json()
      return {
        success: true,
        address: data.display_name,
        details: data.address
      }
    } catch (error) {
      console.error('Erreur géocodage inverse:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  return {
    // État (readonly)
    currentPosition: readonly(currentPosition),
    accuracy: readonly(accuracy),
    isTracking: readonly(isTracking),
    lastUpdate: readonly(lastUpdate),
    error: readonly(error),
    
    // Computed
    accuracyLevel,
    isGpsAvailable,
    formattedPosition,
    
    // Actions
    startTracking,
    stopTracking,
    getCurrentPosition,
    requestPermission,
    calculateDistance,
    isAccuracyGoodEnough,
    reverseGeocode,
    
    // Constantes
    ACCURACY_LEVELS
  }
}

// Instance globale pour usage app-wide
export const globalGeolocation = useGeolocation()

// Auto-démarrage si permission déjà accordée
if (typeof window !== 'undefined') {
  // Démarrer automatiquement le suivi GPS si permission accordée
  navigator.permissions?.query({ name: 'geolocation' })
    .then(result => {
      if (result.state === 'granted') {
        console.log('🛰️ Permission GPS déjà accordée - Démarrage auto')
        globalGeolocation.startTracking()
      }
    })
    .catch(() => {
      // Permissions API pas supportée, on essaie quand même
      console.log('🛰️ Test permission GPS...')
      globalGeolocation.requestPermission()
    })
}
