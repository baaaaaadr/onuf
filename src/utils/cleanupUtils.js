// src/utils/cleanupUtils.js
// Utilitaires de nettoyage pour l'application ONUF

/**
 * Nettoie la queue de synchronisation des audits qui n'existent plus
 */
export function cleanupOrphanedSyncQueue() {
  try {
    // Récupérer les audits locaux
    const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    const localAuditIds = new Set(localAudits.map(audit => audit.id || audit.localId))
    
    // Récupérer la queue de sync
    let syncQueue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]')
    const originalLength = syncQueue.length
    
    // Filtrer les audits qui existent encore
    syncQueue = syncQueue.filter(item => {
      const exists = localAuditIds.has(item.id)
      if (!exists && item.status === 'failed') {
        console.log(`🗑️ Nettoyage: Audit ${item.id} supprimé de la queue (n'existe plus)`)
      }
      return exists || item.status === 'synced'
    })
    
    // Sauvegarder si modifié
    if (syncQueue.length !== originalLength) {
      localStorage.setItem('onuf_sync_queue', JSON.stringify(syncQueue))
      console.log(`✅ Queue nettoyée: ${originalLength - syncQueue.length} éléments supprimés`)
    }
    
    return {
      cleaned: originalLength - syncQueue.length,
      remaining: syncQueue.length
    }
  } catch (error) {
    console.error('❌ Erreur nettoyage queue:', error)
    return { cleaned: 0, remaining: 0 }
  }
}

/**
 * Nettoie les audits locaux très anciens (plus de 30 jours) et synchronisés
 */
export function cleanupOldSyncedAudits(daysToKeep = 30) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    
    let localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    const originalLength = localAudits.length
    
    // Garder seulement les audits récents ou non synchronisés
    localAudits = localAudits.filter(audit => {
      const auditDate = new Date(audit.created_at || audit.createdAt || audit.timestamp)
      const isOld = auditDate < cutoffDate
      const isSynced = audit.synced === true
      
      // Garder si : récent OU non synchronisé
      const keep = !isOld || !isSynced
      
      if (!keep) {
        console.log(`🗑️ Suppression audit ancien synchronisé: ${audit.id} (${auditDate.toLocaleDateString()})`)
      }
      
      return keep
    })
    
    // Sauvegarder si modifié
    if (localAudits.length !== originalLength) {
      localStorage.setItem('onuf_audits_local', JSON.stringify(localAudits))
      console.log(`✅ ${originalLength - localAudits.length} audits anciens supprimés`)
    }
    
    return {
      cleaned: originalLength - localAudits.length,
      remaining: localAudits.length
    }
  } catch (error) {
    console.error('❌ Erreur nettoyage audits:', error)
    return { cleaned: 0, remaining: 0 }
  }
}

/**
 * Vérifie et corrige les audits avec user_id manquant
 */
export function fixMissingUserIds(currentUserId) {
  if (!currentUserId) {
    console.warn('⚠️ Pas d\'utilisateur connecté pour corriger les user_id')
    return { fixed: 0 }
  }
  
  try {
    let localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    let fixed = 0
    
    localAudits = localAudits.map(audit => {
      if (!audit.userId && audit.synced !== true) {
        console.log(`🔧 Correction user_id manquant pour audit ${audit.id}`)
        audit.userId = currentUserId
        fixed++
      }
      return audit
    })
    
    if (fixed > 0) {
      localStorage.setItem('onuf_audits_local', JSON.stringify(localAudits))
      console.log(`✅ ${fixed} audits corrigés avec user_id`)
    }
    
    return { fixed }
  } catch (error) {
    console.error('❌ Erreur correction user_id:', error)
    return { fixed: 0 }
  }
}

/**
 * Effectue un nettoyage complet au démarrage
 */
export function performStartupCleanup(currentUserId = null) {
  console.log('🧹 Démarrage du nettoyage...')
  
  const results = {
    syncQueue: cleanupOrphanedSyncQueue(),
    oldAudits: cleanupOldSyncedAudits(),
    userIds: currentUserId ? fixMissingUserIds(currentUserId) : { fixed: 0 }
  }
  
  console.log('📊 Résumé du nettoyage:', {
    'Queue sync nettoyée': results.syncQueue.cleaned,
    'Audits anciens supprimés': results.oldAudits.cleaned,
    'User IDs corrigés': results.userIds.fixed
  })
  
  return results
}

// Export pour le debug global
if (typeof window !== 'undefined') {
  window.__cleanupONUF = {
    cleanupOrphanedSyncQueue,
    cleanupOldSyncedAudits,
    fixMissingUserIds,
    performStartupCleanup
  }
}
