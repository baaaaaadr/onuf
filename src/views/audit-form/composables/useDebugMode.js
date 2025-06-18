import { ref, computed } from 'vue'

export function useDebugMode() {
  // Debug mode state
  const debugMode = ref(localStorage.getItem('onuf_debug_mode') === 'true' || import.meta.env.DEV)
  
  // États de debug
  const debugLogs = ref([])
  const userActions = ref([])
  const geoHistory = ref([])
  const geoDetails = ref({})
  const permissionState = ref('')
  const geoLogs = ref([])
  const showDebugDialog = ref(false)

  // Fonction helper pour formater le temps
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  // Ajouter un log de debug
  const addDebugLog = (message, type = 'info') => {
    debugLogs.value.push({
      timestamp: Date.now(),
      message,
      type,
      category: 'debug'
    })
    // Garder seulement les 100 derniers logs
    if (debugLogs.value.length > 100) {
      debugLogs.value = debugLogs.value.slice(-100)
    }
    console.log(`[${type.toUpperCase()}]`, message)
  }

  // Ajouter un log géographique
  const addGeoLog = (message, type = 'info') => {
    geoLogs.value.push({
      timestamp: Date.now(),
      message,
      type,
      category: 'geo'
    })
    // Garder seulement les 50 derniers logs geo
    if (geoLogs.value.length > 50) {
      geoLogs.value = geoLogs.value.slice(-50)
    }
    console.log(`[GEO-${type.toUpperCase()}]`, message)
  }

  // Ajouter une action utilisateur
  const addUserAction = (action) => {
    const timestamp = new Date().getTime()
    userActions.value.unshift({
      action,
      timestamp,
      formattedTime: formatTime(timestamp),
      message: action,
      category: 'user'
    })

    // Limiter le nombre d'actions stockées
    if (userActions.value.length > 30) {
      userActions.value = userActions.value.slice(0, 30)
    }

    addDebugLog(`👤 ${action}`, 'action')
  }

  // Ajouter une entrée dans l'historique GPS
  const addGeoHistory = (lat, lng, accuracy) => {
    geoHistory.value.push({
      timestamp: Date.now(),
      lat,
      lng,
      accuracy
    })
    // Garder seulement les 20 dernières positions
    if (geoHistory.value.length > 20) {
      geoHistory.value = geoHistory.value.slice(-20)
    }
  }

  // Effacer tous les logs
  const clearDebugLogs = () => {
    debugLogs.value = []
    userActions.value = []
    geoHistory.value = []
    geoLogs.value = []
    addDebugLog('🗑️ Logs effacés', 'info')
  }

  // Computed pour combiner tous les logs
  const allLogsCombined = computed(() => {
    const allLogs = [
      ...debugLogs.value,
      ...userActions.value,
      ...geoLogs.value
    ]
    return allLogs.sort((a, b) => a.timestamp - b.timestamp)
  })

  const allLogsCount = computed(() => {
    return debugLogs.value.length + userActions.value.length + geoLogs.value.length
  })

  // Copier les infos de debug
  const copyDebugInfo = async (coordinates, locationAccuracy) => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      location: {
        lat: coordinates.lat,
        lng: coordinates.lng,
        accuracy: locationAccuracy,
        details: geoDetails.value
      },
      browser: {
        userAgent: navigator.userAgent,
        geolocation: !!navigator.geolocation,
        permissions: !!navigator.permissions,
        protocol: location.protocol
      },
      logs: debugLogs.value.slice(-20),
      actions: userActions.value.slice(-10),
      geoHistory: geoHistory.value.slice(-5)
    }
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      addUserAction('📋 Infos debug copiées')
    } catch (error) {
      addDebugLog(`⚠️ Erreur copie: ${error.message}`, 'warn')
    }
  }

  // Obtenir les infos de connexion
  const getConnectionInfo = () => {
    if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      return `${connection.effectiveType || 'Inconnue'} (${connection.downlink || '?'}Mbps)`
    }
    return 'Information non disponible'
  }

  // Exposer les fonctions globalement
  if (typeof window !== 'undefined') {
    window.addUserAction = addUserAction
    window.addDebugLog = addDebugLog
  }

  return {
    // États
    debugMode,
    debugLogs,
    userActions,
    geoHistory,
    geoDetails,
    permissionState,
    geoLogs,
    showDebugDialog,
    allLogsCombined,
    allLogsCount,
    
    // Méthodes
    formatTime,
    addDebugLog,
    addGeoLog,
    addUserAction,
    addGeoHistory,
    clearDebugLogs,
    copyDebugInfo,
    getConnectionInfo
  }
}
