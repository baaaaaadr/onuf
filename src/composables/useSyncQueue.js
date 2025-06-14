// src/composables/useSyncQueue.js
// Gestion avancée de la synchronisation avec queue et retry
import { ref, reactive, computed, readonly } from 'vue'

// État global de la queue de sync
const syncQueue = ref([])
const syncStats = reactive({
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

// État réseau
const isOnline = ref(navigator.onLine)
const lastSync = ref(null)

// Fonction de sauvegarde cloud (sera injectée par useAudits)
let saveToCloudFunction = null

// Statuts de sync possibles
export const SYNC_STATUS = {
  LOCAL_ONLY: 'local_only',
  SYNCING: 'syncing', 
  SYNCED: 'synced',
  FAILED: 'failed',
  PENDING: 'pending'
}

// Écouter les changements de réseau
window.addEventListener('online', () => {
  isOnline.value = true
  console.log('🌐 Connexion rétablie - Reprise sync...')
  
  // ✅ NOUVEAU: Attendre stabilisation puis forcer sync
  setTimeout(() => {
    console.log('🔄 Démarrage sync forcée après reconnexion')
    startAutoSync()
    processQueue() // Force immédiatement
  }, 2000)
})

window.addEventListener('offline', () => {
  isOnline.value = false
  console.log('📴 Connexion perdue - Sync en pause')
})

// Mettre à jour les statistiques
const updateSyncStats = () => {
  // Nettoyer la queue des éléments supprimés
  cleanupDeletedItems()
  
  syncStats.pending = syncQueue.value.filter(i => i.status === SYNC_STATUS.PENDING).length
  syncStats.syncing = syncQueue.value.filter(i => i.status === SYNC_STATUS.SYNCING).length
  syncStats.failed = syncQueue.value.filter(i => i.status === SYNC_STATUS.FAILED).length
  
  // ✅ CORRIGÉ: Calculer le vrai nombre d'audits synchronisés
  syncStats.success = calculateTotalSyncedAudits()
}

// ✅ CORRIGÉ: Calculer le nombre d'audits synchronisés (Local-First STRICT)
const calculateTotalSyncedAudits = () => {
  try {
    const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    
    // ✅ STRICT: Compter seulement les audits avec synced=true ET cloudId
    const syncedCount = localAudits.filter(audit => 
      audit.synced === true && audit.cloudId
    ).length
    
    console.log(`📊 Local-First STRICT: ${syncedCount} audits réellement synchronisés sur ${localAudits.length} total`)
    return syncedCount
  } catch (error) {
    console.error('❌ Erreur calcul audits synchronisés:', error)
    return 0
  }
}

// Sauvegarder la queue dans localStorage
const saveQueueToStorage = () => {
  try {
    localStorage.setItem('onuf_sync_queue', JSON.stringify(syncQueue.value))
  } catch (error) {
    console.error('Erreur sauvegarde queue:', error)
  }
}

// Charger la queue depuis localStorage
const loadQueueFromStorage = () => {
  try {
    const stored = localStorage.getItem('onuf_sync_queue')
    if (stored) {
      syncQueue.value = JSON.parse(stored)
      updateSyncStats()
    }
  } catch (error) {
    console.error('Erreur chargement queue:', error)
    syncQueue.value = []
  }
}

// Traiter la queue de sync
const processQueue = async () => {
  console.log('🔍 Processus de sync démarré:', {
    isOnline: isOnline.value,
    hasSaveFunction: !!saveToCloudFunction,
    queueLength: syncQueue.value.length
  })
  
  if (!isOnline.value || !saveToCloudFunction) {
    console.log('⛔ Sync impossible:', {
      raison: !isOnline.value ? 'Hors ligne' : 'Pas de fonction de sauvegarde'
    })
    return
  }

  const pendingItems = syncQueue.value.filter(
    item => item.status === SYNC_STATUS.PENDING || 
            item.status === SYNC_STATUS.FAILED
  )

  console.log(`🔄 Traitement queue: ${pendingItems.length} éléments`)

  for (const item of pendingItems) {
    if (item.attempts >= item.maxAttempts) {
      item.status = SYNC_STATUS.FAILED
      continue
    }

    try {
      item.status = SYNC_STATUS.SYNCING
      item.attempts++
      item.lastAttempt = new Date().toISOString()
      updateSyncStats()

      console.log(`☁️ Sync audit ${item.id} (tentative ${item.attempts})`)
      console.log('📤 Données envoyées:', {
        id: item.data.id,
        coordinates: item.data.coordinates,
        latitude: item.data.latitude,
        longitude: item.data.longitude,
        location: item.data.location
      })

      const result = await saveToCloudFunction(item.data)
      
      console.log('📥 Résultat sync:', result)
      
      if (result.success) {
        item.status = SYNC_STATUS.SYNCED
        item.error = null
        console.log(`✅ Audit ${item.id} synchronisé`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error(`❌ Échec sync audit ${item.id}:`, error)
      item.error = error.message
      
      if (item.attempts >= item.maxAttempts) {
        item.status = SYNC_STATUS.FAILED
        console.log(`💥 Audit ${item.id} échoué définitivement`)
      } else {
        item.status = SYNC_STATUS.PENDING
        console.log(`🔁 Audit ${item.id} en attente retry`)
      }
    }
  }

  updateSyncStats()
  saveQueueToStorage()
  lastSync.value = new Date().toISOString()
}

// Auto-sync périodique
let autoSyncInterval = null

const startAutoSync = () => {
  if (!isOnline.value) return

  // ✅ CORRECTION: Vérifier que la fonction de sauvegarde est disponible avant de sync
  if (saveToCloudFunction) {
    // Sync immédiat
    processQueue()
  } else {
    console.log('⏳ Auto-sync différée - En attente de la fonction de sauvegarde')
  }

  // Nettoyer l'ancien interval s'il existe
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval)
  }

  // Sync toutes les 30 secondes
  autoSyncInterval = setInterval(() => {
    if (isOnline.value && syncStats.pending > 0 && saveToCloudFunction) {
      processQueue()
    }
  }, 30000)

  return () => {
    if (autoSyncInterval) {
      clearInterval(autoSyncInterval)
      autoSyncInterval = null
    }
  }
}

// Nettoyer les audits synchronisés (plus de 24h)
const cleanupSyncedItems = () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  syncQueue.value = syncQueue.value.filter(item => {
    if (item.status === SYNC_STATUS.SYNCED) {
      const createdAt = new Date(item.createdAt)
      return createdAt > oneDayAgo
    }
    return true
  })
  
  updateSyncStats()
  saveQueueToStorage()
}

// Nettoyer les items supprimés de la queue
const cleanupDeletedItems = () => {
  const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
  const localIds = new Set(localAudits.map(audit => audit.id || audit.localId))
  
  // Filtrer la queue pour garder seulement les audits qui existent encore
  const initialLength = syncQueue.value.length
  syncQueue.value = syncQueue.value.filter(item => {
    const auditExists = localIds.has(item.id)
    if (!auditExists && item.status === SYNC_STATUS.FAILED) {
      console.log(`🗑️ Suppression de l'audit échoué ${item.id} de la queue (audit supprimé)`)
    }
    return auditExists || item.status === SYNC_STATUS.SYNCED
  })
  
  if (syncQueue.value.length !== initialLength) {
    saveQueueToStorage()
  }
}

export const useSyncQueue = () => {
  // Ajouter un audit à la queue de sync
  const addToSyncQueue = (auditData) => {
    const queueItem = {
      id: auditData.id || `audit_${Date.now()}`,
      data: auditData,
      status: SYNC_STATUS.PENDING,
      attempts: 0,
      maxAttempts: 3,
      lastAttempt: null,
      error: null,
      createdAt: new Date().toISOString()
    }
    
    syncQueue.value.push(queueItem)
    updateSyncStats()
    
    // Sauvegarder la queue localement
    saveQueueToStorage()
    
    // Démarrer sync si en ligne
    if (isOnline.value) {
      processQueue()
    }
    
    return queueItem.id
  }

  // Retry manuel d'un audit spécifique
  const retrySync = async (auditId) => {
    const item = syncQueue.value.find(i => i.id === auditId)
    if (!item) return false

    item.status = SYNC_STATUS.PENDING
    item.attempts = 0
    item.error = null
    
    updateSyncStats()
    saveQueueToStorage()

    if (isOnline.value) {
      await processQueue()
    }

    return true
  }

  // Retry tous les audits échoués
  const retryAllFailed = async () => {
    const failedItems = syncQueue.value.filter(
      item => item.status === SYNC_STATUS.FAILED
    )

    failedItems.forEach(item => {
      item.status = SYNC_STATUS.PENDING
      item.attempts = 0
      item.error = null
    })

    updateSyncStats()
    saveQueueToStorage()

    if (isOnline.value) {
      await processQueue()
    }

    return failedItems.length
  }

  // Obtenir le statut de sync d'un audit
  const getSyncStatus = (auditId) => {
    const item = syncQueue.value.find(i => i.id === auditId)
    return item?.status || SYNC_STATUS.LOCAL_ONLY
  }

  // Obtenir les détails d'un audit dans la queue
  const getSyncDetails = (auditId) => {
    return syncQueue.value.find(i => i.id === auditId) || null
  }

  // Fonction pour injecter la fonction de sauvegarde cloud
  const setSaveToCloudFunction = (saveFunction) => {
    saveToCloudFunction = saveFunction
    console.log('✅ Fonction de sauvegarde cloud injectée')
    
    // ✅ NOUVEAU: Démarrer la sync maintenant que la fonction est disponible
    if (isOnline.value && syncStats.pending > 0) {
      console.log('🚀 Démarrage sync automatique après injection')
      processQueue()
    }
  }

  // Statistiques calculées
  const totalItems = computed(() => syncQueue.value.length)
  const hasFailedItems = computed(() => syncStats.failed > 0)
  const hasPendingItems = computed(() => syncStats.pending > 0)
  const syncProgress = computed(() => {
    if (totalItems.value === 0) return 100
    return Math.round((syncStats.success / totalItems.value) * 100)
  })

  return {
    // État
    syncQueue: readonly(syncQueue),
    syncStats: readonly(syncStats),
    isOnline: readonly(isOnline),
    lastSync: readonly(lastSync),
    
    // Statuts
    SYNC_STATUS,
    
    // Actions
    addToSyncQueue,
    processQueue,
    retrySync,
    retryAllFailed,
    getSyncStatus,
    getSyncDetails,
    startAutoSync,
    cleanupSyncedItems,
    setSaveToCloudFunction,
    updateSyncStats, // ✅ NOUVEAU: Permettre mise à jour manuelle des stats
    
    // Computed
    totalItems,
    hasFailedItems,
    hasPendingItems,
    syncProgress
  }
}

// Instance globale pour éviter les problèmes d'initialisation
let globalSyncQueueInstance = null

export const getGlobalSyncQueue = () => {
  if (!globalSyncQueueInstance) {
    globalSyncQueueInstance = useSyncQueue()
    
    // Initialisation
    loadQueueFromStorage()
    updateSyncStats()
    
    // Auto-démarrage du sync au chargement
    if (typeof window !== 'undefined') {
      // Nettoyer au démarrage
      cleanupSyncedItems()
      
      // ✅ CORRECTION: Ne pas démarrer sync immédiatement
      // Attendre que la fonction de sauvegarde soit injectée
      console.log('📋 Queue de sync initialisée - En attente de la fonction de sauvegarde')
      
      // Démarrer auto-sync mais sans processQueue immédiat
      setTimeout(() => {
        startAutoSync()
      }, 100)
      
      // Nettoyer toutes les heures
      setInterval(cleanupSyncedItems, 60 * 60 * 1000)
    }
  }
  
  return globalSyncQueueInstance
}

// Export pour utilisation directe
export const globalSyncQueue = getGlobalSyncQueue()
