// src/composables/useAudits.js - Version avec intégration SyncQueue corrigée
import { ref, readonly } from 'vue'
import { supabase } from './useSupabase.js'
import { useAuth } from './useSupabase.js'
import { getGlobalSyncQueue } from './useSyncQueue.js'

export const useAudits = () => {
  const { currentUser } = useAuth()
  const syncQueue = getGlobalSyncQueue()
  const { addToSyncQueue, isOnline, setSaveToCloudFunction } = syncQueue
  
  const loading = ref(false)
  const error = ref(null)

  // Fonction pour obtenir URL des photos Supabase Storage
  const getPhotoUrl = (storagePath) => {
    if (!storagePath) return null
    
    const { data } = supabase.storage
      .from('audit-photos')
      .getPublicUrl(storagePath)
    
    return data?.publicUrl || null
  }

  // Marquer un audit local comme synchronisé
  const markLocalAuditAsSynced = async (localId, cloudId) => {
    try {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      const auditIndex = localAudits.findIndex(audit => 
        audit.id === localId || audit.localId === localId
      )
      
      if (auditIndex >= 0) {
        // Mettre à jour l'audit local avec les infos de sync
        localAudits[auditIndex] = {
          ...localAudits[auditIndex],
          synced: true,
          cloudId: cloudId,
          syncedAt: new Date().toISOString(),
          localOnly: false
        }
        
        localStorage.setItem('onuf_audits_local', JSON.stringify(localAudits))
        console.log(`✅ Audit local ${localId} marqué comme synchronisé (cloud ID: ${cloudId})`)
      }
    } catch (error) {
      console.error('❌ Erreur marquage sync:', error)
    }
  }

  // Sauvegarder vers le cloud (Supabase)
  const saveAuditToCloud = async (auditData) => {
    try {
      // Préparer données pour la base
      const dbAudit = {
        user_id: currentUser.value.user_id,
        latitude: auditData.coordinates?.lat,
        longitude: auditData.coordinates?.lng,
        location_text: auditData.location,
        location_accuracy: auditData.locationAccuracy,
        nearby_info: auditData.nearbyInfo,
        lighting: auditData.lighting,
        walkpath: auditData.walkpath,
        openness: auditData.openness,
        feeling: auditData.feeling,
        people_presence: auditData.peoplePresence,
        cleanliness: auditData.cleanliness,
        comment: auditData.comment,
        total_photos: auditData.photos?.length || 0,
        ui_language: 'fr',
        device_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date().toISOString()
        },
        is_completed: true
      }

      // Insérer audit
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .insert(dbAudit)
        .select()
        .single()

      if (auditError) throw auditError

      // Upload photos si présentes
      if (auditData.photos && auditData.photos.length > 0) {
        await uploadAuditPhotos(audit.id, auditData.photos)
      }

      // ✅ NOUVEAU: Marquer l'audit local comme synchronisé
      await markLocalAuditAsSynced(auditData.id || auditData.localId, audit.id)

      console.log('☁️ Audit synchronisé avec succès:', audit.id)
      return { success: true, audit }
    } catch (err) {
      console.error('❌ Erreur sync cloud:', err)
      return { success: false, error: err.message }
    }
  }

  // Injecter la fonction de sauvegarde dans la queue de sync
  setSaveToCloudFunction(saveAuditToCloud)

  // Save audit - Version améliorée avec queue de sync + support offline
  const saveAudit = async (auditData) => {
    loading.value = true
    error.value = null
    
    try {
      if (!currentUser.value) {
        throw new Error('Utilisateur non connecté')
      }

      // ✅ NOUVEAU: Valider audit même sans GPS parfait
      const enrichedAuditData = {
        ...auditData,
        // Garantir des coordonnées par défaut si manquantes
        coordinates: auditData.coordinates || { lat: 0, lng: 0 },
        location: auditData.location || 'Position non disponible',
        locationAccuracy: auditData.locationAccuracy || 999999, // Très imprécis mais valide
        // Garantir timestamp
        timestamp: auditData.timestamp || Date.now()
      }

      // Toujours sauvegarder localement d'abord (MÊME SANS GPS)
      const localAudit = await saveAuditLocally(enrichedAuditData)
      console.log('✅ Audit sauvegardé localement (avec/sans GPS):', localAudit.id)
      
      // Si en ligne, essayer sync immédiat
      if (isOnline.value) {
        const cloudResult = await saveAuditToCloud(enrichedAuditData)
        if (cloudResult.success) {
          return { success: true, audit: cloudResult.audit, synced: true }
        } else {
          // Échec sync immédiat, ajouter à la queue
          addToSyncQueue(enrichedAuditData)
          return { success: true, audit: localAudit, synced: false, queued: true }
        }
      } else {
        // ✅ NOUVEAU: Hors ligne, toujours ajouter à la queue
        console.log('📴 Mode offline - Ajout à la queue de sync')
        addToSyncQueue(enrichedAuditData)
        return { success: true, audit: localAudit, synced: false, queued: true, offline: true }
      }
    } catch (err) {
      error.value = err.message
      console.error('❌ Save audit error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Sauvegarder localement (localStorage/IndexedDB)
  const saveAuditLocally = async (auditData) => {
    try {
      // Générer ID unique si pas présent
      if (!auditData.id) {
        auditData.id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Préparer données locales
      const localAudit = {
        ...auditData,
        userId: currentUser.value.user_id,
        localId: auditData.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
        localOnly: true
      }

      // Récupérer audits existants
      const existingAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // Ajouter ou mettre à jour
      const existingIndex = existingAudits.findIndex(a => a.id === auditData.id)
      if (existingIndex >= 0) {
        existingAudits[existingIndex] = localAudit
      } else {
        existingAudits.push(localAudit)
      }

      // Sauvegarder
      localStorage.setItem('onuf_audits_local', JSON.stringify(existingAudits))
      
      console.log('✅ Audit sauvegardé localement:', auditData.id)
      return localAudit
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error)
      throw new Error('Impossible de sauvegarder localement')
    }
  }

  // Upload photos pour un audit
  const uploadAuditPhotos = async (auditId, photos) => {
    const uploadPromises = photos.map(async (photo, index) => {
      try {
        // Convertir base64 vers blob
        const response = await fetch(photo.data)
        const blob = await response.blob()
        
        // Générer nom de fichier
        const fileName = `${auditId}_${index + 1}_${Date.now()}.jpg`
        const storagePath = `${currentUser.value.user_id}/${fileName}`
        
        // Upload vers storage
        const { error: uploadError } = await supabase.storage
          .from('audit-photos')
          .upload(storagePath, blob, {
            contentType: 'image/jpeg',
            upsert: false
          })
        
        if (uploadError) throw uploadError
        
        // Enregistrer dans la base
        const { error: dbError } = await supabase
          .from('audit_photos')
          .insert({
            audit_id: auditId,
            user_id: currentUser.value.user_id,
            filename: photo.name || fileName,
            storage_path: storagePath,
            original_size: photo.originalSize,
            compressed_size: photo.compressedSize,
            mime_type: 'image/jpeg',
            upload_order: index + 1
          })
        
        if (dbError) throw dbError
        
        return { success: true, path: storagePath }
      } catch (err) {
        console.error(`Erreur upload photo ${index + 1}:`, err)
        return { success: false, error: err.message }
      }
    })
    
    return Promise.all(uploadPromises)
  }

  // Récupérer tous les audits (local + cloud)
  const getAllAudits = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Récupérer audits locaux
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // Récupérer audits cloud si connecté
      let cloudAudits = []
      if (isOnline.value && currentUser.value) {
        const cloudResult = await getUserAudits()
        if (cloudResult.success) {
          cloudAudits = cloudResult.audits
        }
      }

      // Fusionner et dédupliquer
      const allAudits = mergeAudits(localAudits, cloudAudits)
      
      return { success: true, audits: allAudits }
    } catch (err) {
      error.value = err.message
      console.error('Get all audits error:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Récupérer audits utilisateur depuis le cloud avec photos
  const getUserAudits = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('audits')
        .select(`
          *,
          audit_photos (
            id,
            filename,
            storage_path,
            original_size,
            compressed_size,
            upload_order,
            mime_type
          )
        `)
        .eq('user_id', currentUser.value.user_id)
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      // Enrichir avec URLs photos
      const enrichedAudits = data.map(audit => ({
        ...audit,
        photos: audit.audit_photos?.map(photo => ({
          id: photo.id,
          name: photo.filename,
          data: getPhotoUrl(photo.storage_path),
          originalSize: photo.original_size,
          compressedSize: photo.compressed_size,
          order: photo.upload_order,
          mimeType: photo.mime_type
        })) || []
      }))
      
      return { success: true, audits: enrichedAudits }
    } catch (err) {
      console.error('Get cloud audits error:', err)
      return { success: false, error: err.message }
    }
  }

  // Nettoyer les audits locaux synchronisés (garder 24h)
  const cleanupSyncedLocalAudits = () => {
    try {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // Garder les audits synchronisés pendant 24h au lieu de les supprimer immédiatement
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      const auditesToKeep = localAudits.filter(audit => {
        // Garder les audits non synchronisés
        if (!audit.synced) return true
        
        // Garder les audits synchronisés récemment (moins de 24h)
        const syncedAt = new Date(audit.syncedAt || audit.createdAt || 0)
        return syncedAt > oneDayAgo
      })
      
      localStorage.setItem('onuf_audits_local', JSON.stringify(auditesToKeep))
      
      const removed = localAudits.length - auditesToKeep.length
      if (removed > 0) {
        console.log(`🧹 ${removed} audit(s) local(aux) ancien(s) nettoyé(s) (>24h)`)
      }
    } catch (error) {
      console.error('❌ Erreur nettoyage audits locaux:', error)
    }
  }

  // Fusionner audits locaux et cloud avec déduplication intelligente
  const mergeAudits = (localAudits, cloudAudits) => {
    const merged = []
    const processedKeys = new Set() // Utilise des clés composites pour éviter doublons

    // Fonction pour créer une clé unique basée sur le contenu
    const createAuditKey = (audit) => {
      // Utiliser timestamp + coordonnées + commentaire pour identifier les doublons
      const timestamp = audit.created_at || audit.createdAt || audit.timestamp
      const lat = audit.latitude || audit.coordinates?.lat || 0
      const lng = audit.longitude || audit.coordinates?.lng || 0
      const comment = audit.comment || ''
      
      // Clé composite pour identifier le même audit même avec IDs différents
      return `${Math.floor(new Date(timestamp).getTime() / 1000)}_${lat.toFixed(4)}_${lng.toFixed(4)}_${comment}`
    }

    // Ajouter audits cloud d'abord (priorité)
    cloudAudits.forEach(audit => {
      const auditKey = createAuditKey(audit)
      
      const enrichedAudit = {
        ...audit,
        synced: true,
        localOnly: false,
        source: 'cloud'
      }
      
      merged.push(enrichedAudit)
      processedKeys.add(auditKey)
      
      // Marquer aussi les IDs pour éviter doublons par ID
      processedKeys.add(audit.id)
    })

    // Ajouter audits locaux NON DUPLIQUÉS
    localAudits.forEach(audit => {
      const auditKey = createAuditKey(audit)
      const auditId = audit.id || audit.localId
      
      // Vérifier si déjà ajouté (par clé composite OU par ID)
      if (!processedKeys.has(auditKey) && !processedKeys.has(auditId) && !audit.synced) {
        merged.push({
          ...audit,
          synced: false,
          localOnly: true,
          source: 'local'
        })
        processedKeys.add(auditKey)
        processedKeys.add(auditId)
      } else {
        console.log(`🗑️ Doublon éliminé: ${audit.comment || auditId} (clé: ${auditKey})`)
      }
    })

    // Nettoyer les audits locaux synchronisés
    cleanupSyncedLocalAudits()

    // Trier par date de création (plus récent en premier)
    return merged.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || a.timestamp || 0)
      const dateB = new Date(b.created_at || b.createdAt || b.timestamp || 0)
      return dateB - dateA
    })
  }

  // Supprimer audit
  const deleteAudit = async (auditId) => {
    try {
      // Supprimer du local
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const filteredLocal = localAudits.filter(a => a.id !== auditId && a.localId !== auditId)
      localStorage.setItem('onuf_audits_local', JSON.stringify(filteredLocal))

      // Supprimer du cloud si connecté
      if (isOnline.value && currentUser.value) {
        const { error: deleteError } = await supabase
          .from('audits')
          .delete()
          .eq('id', auditId)
          .eq('user_id', currentUser.value.user_id)

        if (deleteError && deleteError.code !== 'PGRST116') {
          console.warn('Erreur suppression cloud:', deleteError)
        }
      }

      return { success: true }
    } catch (err) {
      console.error('Delete audit error:', err)
      return { success: false, error: err.message }
    }
  }

  // Sauvegarder progression (session)
  const saveProgress = async (formData) => {
    try {
      if (!currentUser.value) return { success: false }

      // Sauvegarder localement toujours
      localStorage.setItem('onuf_audit_progress', JSON.stringify(formData))

      // Essayer cloud si en ligne
      if (isOnline.value) {
        const { data, error: upsertError } = await supabase
          .from('audit_sessions')
          .upsert({
            user_id: currentUser.value.user_id,
            latitude: formData.coordinates?.lat,
            longitude: formData.coordinates?.lng,
            location_text: formData.location,
            form_data: formData,
            photos_data: formData.photos || []
          }, {
            onConflict: 'user_id'
          })

        if (upsertError) {
          console.warn('Erreur sauvegarde progression cloud:', upsertError)
          // Continuer même si cloud échoue
        }
      }
      
      return { success: true }
    } catch (err) {
      console.error('Save progress error:', err)
      return { success: false, error: err.message }
    }
  }

  // Charger progression sauvegardée
  const loadProgress = async () => {
    try {
      // Essayer cloud d'abord si en ligne
      if (isOnline.value && currentUser.value) {
        const { data, error: fetchError } = await supabase
          .from('audit_sessions')
          .select('*')
          .eq('user_id', currentUser.value.user_id)
          .single()

        if (!fetchError && data) {
          return { 
            success: true, 
            progress: data.form_data,
            hasProgress: true,
            source: 'cloud'
          }
        }
      }

      // Fallback sur local
      const localProgress = localStorage.getItem('onuf_audit_progress')
      if (localProgress) {
        return {
          success: true,
          progress: JSON.parse(localProgress),
          hasProgress: true,
          source: 'local'
        }
      }

      return { success: true, progress: null, hasProgress: false }
    } catch (err) {
      console.error('Load progress error:', err)
      return { success: false, error: err.message }
    }
  }

  // Nettoyer progression
  const clearProgress = async () => {
    try {
      // Nettoyer local
      localStorage.removeItem('onuf_audit_progress')

      // Nettoyer cloud si connecté
      if (isOnline.value && currentUser.value) {
        const { error: deleteError } = await supabase
          .from('audit_sessions')
          .delete()
          .eq('user_id', currentUser.value.user_id)

        if (deleteError && deleteError.code !== 'PGRST116') {
          console.warn('Erreur nettoyage progression cloud:', deleteError)
        }
      }
      
      return { success: true }
    } catch (err) {
      console.error('Clear progress error:', err)
      return { success: false, error: err.message }
    }
  }

  // Forcer synchronisation de tous les audits locaux
  const syncAllLocalAudits = async () => {
    if (!isOnline.value) return { success: false, error: 'Connexion requise' }

    try {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const unsynced = localAudits.filter(audit => !audit.synced)

      console.log(`🔄 Synchronisation de ${unsynced.length} audits locaux...`)

      for (const audit of unsynced) {
        addToSyncQueue(audit)
      }

      return { success: true, queued: unsynced.length }
    } catch (err) {
      console.error('Sync all local audits error:', err)
      return { success: false, error: err.message }
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    saveAudit,
    saveAuditLocally,
    saveAuditToCloud,
    getAllAudits,
    getUserAudits,
    deleteAudit,
    saveProgress,
    loadProgress,
    clearProgress,
    syncAllLocalAudits
  }
}
