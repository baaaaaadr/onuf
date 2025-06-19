// ✅ FONCTIONS DE DEBUG POUR ONUF PWA
// Fichier utilitaire pour diagnostiquer les problèmes de synchronisation
// ⚠️ Sécurité: Certaines fonctions sont désactivées en production

// Vérifier si on est en mode développement
const isDevelopment = import.meta.env.MODE === 'development'
const isDebugEnabled = isDevelopment || localStorage.getItem('onuf_debug_enabled') === 'true'

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
  },
  
  // === AUTH DEBUG ===
  
  // Tester l'authentification
  testAuth: async (username = 'admin', password = '') => {
    if (!isDebugEnabled) {
      console.warn('⚠️ Fonction de debug désactivée en production. Utilisez localStorage.setItem("onuf_debug_enabled", "true") pour l\'activer.')
      return { error: 'Debug désactivé en production' }
    }
    
    if (!password) {
      console.warn('⚠️ Veuillez fournir un mot de passe: __debugONUF.testAuth("username", "password")')
      return { error: 'Mot de passe requis' }
    }
    
    // ⚠️ Sécurité: Masquer le mot de passe dans les logs
    const maskedPassword = password.length > 0 ? password.substring(0, 3) + '*'.repeat(Math.max(0, password.length - 3)) : '[vide]'
    console.log(`🔐 Test auth: ${username} / ${maskedPassword}`)
    
    try {
      // Import dynamique pour éviter les dépendances circulaires
      const { useAuth } = await import('@/composables/useSupabase')
      const { login, testPasswordHash } = useAuth()
      
      // Test du hash d'abord
      console.log('🧪 Test du hash...')
      const hashResult = await testPasswordHash(username, password)
      console.log('📊 Résultat test hash:', hashResult)
      
      // Puis test de login
      console.log('🔑 Test de login...')
      const loginResult = await login(username, password)
      console.log('📊 Résultat login:', loginResult)
      
      return { hashResult, loginResult }
    } catch (error) {
      console.error('❌ Erreur test auth:', error)
      return { error: error.message }
    }
  },
  
  // Réinitialiser un mot de passe
  resetPassword: async (username, newPassword) => {
    if (!isDebugEnabled) {
      console.warn('⚠️ Fonction de debug désactivée en production. Utilisez localStorage.setItem("onuf_debug_enabled", "true") pour l\'activer.')
      return { error: 'Debug désactivé en production' }
    }
    
    if (!username || !newPassword) {
      console.warn('⚠️ Veuillez fournir username et nouveau mot de passe: __debugONUF.resetPassword("username", "new_password")')
      return { error: 'Username et mot de passe requis' }
    }
    
    // ⚠️ Sécurité: Masquer le mot de passe dans les logs
    const maskedPassword = newPassword.length > 0 ? newPassword.substring(0, 3) + '*'.repeat(Math.max(0, newPassword.length - 3)) : '[vide]'
    console.log(`🔄 Reset password pour ${username} avec mot de passe: ${maskedPassword}`)
    
    try {
      const { useAuth } = await import('@/composables/useSupabase')
      const { resetUserPassword } = useAuth()
      
      const result = await resetUserPassword(username, newPassword)
      console.log('📊 Résultat reset:', result)
      
      return result
    } catch (error) {
      console.error('❌ Erreur reset password:', error)
      return { error: error.message }
    }
  },
  
  // Voir les infos utilisateur stockées
  getCurrentUser: () => {
    const stored = localStorage.getItem('onuf_user')
    if (stored) {
      const user = JSON.parse(stored)
      console.log('👤 Utilisateur stocké:', user)
      return user
    } else {
      console.log('❌ Aucun utilisateur stocké')
      return null
    }
  },
  
  // Nettoyer l'auth
  clearAuth: () => {
    localStorage.removeItem('onuf_user')
    localStorage.removeItem('onuf_token')
    console.log('🧹 Auth nettoyée')
  },
  
  // Voir les infos d'un utilisateur en base
  debugUser: async (username = 'admin') => {
    console.log(`🔍 Debug utilisateur: ${username}`)
    
    try {
      const { useAuth } = await import('@/composables/useSupabase')
      const { debugUserInfo } = useAuth()
      
      const result = await debugUserInfo(username)
      console.log('📊 Résultat debug user:', result)
      
      return result
    } catch (error) {
      console.error('❌ Erreur debug user:', error)
      return { error: error.message }
    }
  },
  
  // Voir tous les utilisateurs
  checkAllUsers: async () => {
    console.log('📋 Vérification de tous les utilisateurs...')
    
    try {
      const { useAuth } = await import('@/composables/useSupabase')
      const { checkAllUsers } = useAuth()
      
      const result = await checkAllUsers()
      console.log('📊 Tous les utilisateurs:', result)
      
      return result
    } catch (error) {
      console.error('❌ Erreur check users:', error)
      return { error: error.message }
    }
  },
  
  // Tester le login direct (fallback)
  testLoginDirect: async (username = 'admin', password = '') => {
    if (!isDebugEnabled) {
      console.warn('⚠️ Fonction de debug désactivée en production. Utilisez localStorage.setItem("onuf_debug_enabled", "true") pour l\'activer.')
      return { error: 'Debug désactivé en production' }
    }
    
    if (!password) {
      console.warn('⚠️ Veuillez fournir un mot de passe: __debugONUF.testLoginDirect("username", "password")')
      return { error: 'Mot de passe requis' }
    }
    
    // ⚠️ Sécurité: Masquer le mot de passe dans les logs
    const maskedPassword = password.length > 0 ? password.substring(0, 3) + '*'.repeat(Math.max(0, password.length - 3)) : '[vide]'
    console.log(`🔍 Test login direct: ${username} / ${maskedPassword}`)
    
    try {
      const { useAuth } = await import('@/composables/useSupabase')
      const { loginDirect } = useAuth()
      
      const result = await loginDirect(username, password)
      console.log('📊 Résultat login direct:', result)
      
      return result
    } catch (error) {
      console.error('❌ Erreur login direct:', error)
      return { error: error.message }
    }
  },
  
  // ⚠️ Fonction d'administration pour activer le debug en production
  enableDebug: () => {
    localStorage.setItem('onuf_debug_enabled', 'true')
    console.log('✅ Debug activé. Rechargez la page pour appliquer les changements.')
  },
  
  // ⚠️ Fonction d'administration pour désactiver le debug
  disableDebug: () => {
    localStorage.removeItem('onuf_debug_enabled')
    console.log('❌ Debug désactivé. Rechargez la page pour appliquer les changements.')
  }
}

console.log('🔧 Debug ONUF disponible: window.__debugONUF')
console.log('📝 Commandes disponibles:')
console.log('  === AUDITS ===')
console.log('  • __debugONUF.getLocalAudits() - Voir audits locaux')
console.log('  • __debugONUF.getSyncQueue() - Voir queue de sync')
console.log('  • __debugONUF.getStats() - Statistiques complètes')
console.log('  • __debugONUF.reloadAudits() - Forcer reload')
console.log('  • __debugONUF.clearAll() - Tout nettoyer')
console.log('  === AUTH ===')
if (isDebugEnabled) {
  console.log('  • __debugONUF.testAuth("username", "password") - Tester auth')
  console.log('  • __debugONUF.resetPassword("username", "new_password") - Reset password')
  console.log('  • __debugONUF.testLoginDirect("username", "password") - Tester login direct')
} else {
  console.log('  🔒 Fonctions sensibles désactivées en production')
  console.log('  • __debugONUF.enableDebug() - Activer debug (admin seulement)')
}
console.log('  • __debugONUF.getCurrentUser() - Voir utilisateur actuel')
console.log('  • __debugONUF.clearAuth() - Nettoyer auth')
console.log('  • __debugONUF.debugUser("admin") - Debug info utilisateur')
console.log('  • __debugONUF.checkAllUsers() - Voir tous les utilisateurs')
if (isDebugEnabled) {
  console.log('  ⚠️  Pour des raisons de sécurité, remplacez [password] par le vrai mot de passe')
  console.log('  • __debugONUF.disableDebug() - Désactiver debug')
} else {
  console.log('  🛡️  Mode sécurisé: Fonctions sensibles désactivées')
}

export default window.__debugONUF
