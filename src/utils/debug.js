// ✅ FONCTIONS DE DEBUG POUR ONUF PWA
// Fichier utilitaire pour diagnostiquer les problèmes de synchronisation

// Fonction de debug pour localStorage
window.__debugONUF = {
  // Voir audits locaux
  getLocalAudits: () => {
    const audits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    console.table(audits.map(a => ({
      id: a.id,
      comment: a.comment,
      synced: a.synced,
      timestamp: new Date(a.timestamp || a.createdAt).toLocaleString(),
      coords: `${a.coordinates?.lat || 0}, ${a.coordinates?.lng || 0}`
    })))
    return audits
  },
  
  // Voir queue de sync
  getSyncQueue: () => {
    const queue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]')
    console.table(queue.map(q => ({
      id: q.id,
      status: q.status,
      attempts: q.attempts,
      comment: q.data?.comment
    })))
    return queue
  },
  
  // Forcer reload audits
  reloadAudits: async () => {
    console.log('🔄 Force reload audits...')
    // Déclencher événement custom
    window.dispatchEvent(new CustomEvent('onuf-force-reload'))
  },
  
  // Clear tout
  clearAll: () => {
    localStorage.removeItem('onuf_audits_local')
    localStorage.removeItem('onuf_sync_queue')
    localStorage.removeItem('onuf_audit_progress')
    console.log('🧹 Tout nettoyé')
    location.reload()
  },
  
  // Voir progression actuelle
  getProgress: () => {
    const progress = JSON.parse(localStorage.getItem('onuf_audit_progress') || '{}')
    console.log('📋 Progression actuelle:', progress)
    return progress
  },
  
  // Simuler perte de connexion
  simulateOffline: () => {
    console.log('📴 Simulation mode offline...')
    window.dispatchEvent(new Event('offline'))
  },
  
  // Simuler retour connexion
  simulateOnline: () => {
    console.log('🌐 Simulation retour online...')
    window.dispatchEvent(new Event('online'))
  },
  
  // Statistiques complètes
  getStats: () => {
    const local = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    const queue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]')
    
    const stats = {
      localAudits: local.length,
      syncedAudits: local.filter(a => a.synced).length,
      unsyncedAudits: local.filter(a => !a.synced).length,
      queueItems: queue.length,
      pendingSync: queue.filter(q => q.status === 'pending').length,
      failedSync: queue.filter(q => q.status === 'failed').length,
      syncedItems: queue.filter(q => q.status === 'synced').length
    }
    
    console.table(stats)
    return stats
  }
}

console.log('🔧 Debug ONUF disponible: window.__debugONUF')
console.log('📝 Commandes disponibles:')
console.log('  • __debugONUF.getLocalAudits() - Voir audits locaux')
console.log('  • __debugONUF.getSyncQueue() - Voir queue de sync')
console.log('  • __debugONUF.getStats() - Statistiques complètes')
console.log('  • __debugONUF.reloadAudits() - Forcer reload')
console.log('  • __debugONUF.clearAll() - Tout nettoyer')

export default window.__debugONUF
