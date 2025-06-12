// Utilitaire pour migrer les audits existants et ajouter le géocodage inverse
import { reverseGeocode } from '@/services/geocoding.js'

/**
 * Enrichit un audit avec les données de géocodage inverse
 * @param {Object} audit - L'audit à enrichir
 * @returns {Promise<Object>} L'audit enrichi
 */
export const enrichAuditWithGeocoding = async (audit) => {
  // Si déjà enrichi, ne rien faire
  if (audit.nearby_info && audit.nearby_info !== '') {
    return audit
  }

  // Vérifier si on a des coordonnées valides
  const lat = audit.latitude || audit.coordinates?.lat
  const lng = audit.longitude || audit.coordinates?.lng
  
  if (!lat || !lng || lat === 0 || lng === 0) {
    console.warn('🚫 Pas de coordonnées valides pour:', audit.id)
    return audit
  }

  try {
    console.log('🌍 Enrichissement géocodage pour audit:', audit.id)
    const geocodeResult = await reverseGeocode(lat, lng)
    
    return {
      ...audit,
      nearby_info: geocodeResult.displayName,
      address: geocodeResult.displayName // Pour compatibilité locale
    }
  } catch (error) {
    console.error('❌ Erreur géocodage pour audit:', audit.id, error)
    return audit
  }
}

/**
 * Migre tous les audits locaux pour ajouter le géocodage
 * @returns {Promise<number>} Nombre d'audits migrés
 */
export const migrateLocalAudits = async () => {
  try {
    const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
    console.log(`🔄 Migration de ${localAudits.length} audits locaux...`)
    
    let migratedCount = 0
    const enrichedAudits = []
    
    for (const audit of localAudits) {
      if (!audit.nearby_info || audit.nearby_info === '') {
        const enriched = await enrichAuditWithGeocoding(audit)
        enrichedAudits.push(enriched)
        if (enriched.nearby_info) {
          migratedCount++
        }
        // Attendre un peu entre chaque requête pour respecter les limites de l'API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        enrichedAudits.push(audit)
      }
    }
    
    // Sauvegarder les audits enrichis
    localStorage.setItem('onuf_audits_local', JSON.stringify(enrichedAudits))
    
    console.log(`✅ Migration terminée: ${migratedCount} audits enrichis`)
    return migratedCount
  } catch (error) {
    console.error('❌ Erreur migration audits:', error)
    return 0
  }
}

// Fonction utilitaire pour l'interface debug
window.__migrateAudits = migrateLocalAudits
