// src/composables/useAudits.js - Version avec intégration SyncQueue corrigée
import { ref, readonly } from 'vue'
import { supabase } from './useSupabase.js'
import { useAuth } from './useSupabase.js'
import { getGlobalSyncQueue } from './useSyncQueue.js'
import mobileDebugLogger from '@/utils/mobileDebug'
import { reverseGeocode, formatAddressForCard } from '@/services/geocoding.js'

export const useAudits = () => {
  const { currentUser } = useAuth()
  const syncQueue = getGlobalSyncQueue()
  const { addToSyncQueue, isOnline, setSaveToCloudFunction, syncStats } = syncQueue
  
  const loading = ref(false)
  const error = ref(null)

  // ✅ NOUVEAU: Fonction globale pour créer clé unique audit
  const createAuditKey = (audit) => {
    // Utiliser timestamp + coordonnées + commentaire pour identifier les doublons
    const timestamp = audit.created_at || audit.createdAt || audit.timestamp
    const lat = audit.latitude || audit.coordinates?.lat || 0
    const lng = audit.longitude || audit.coordinates?.lng || 0
    const comment = audit.comment || ''
    
    // Clé plus précise avec secondes pour éviter doublons
    const timeKey = Math.floor(new Date(timestamp).getTime() / 1000) // Précision à la seconde
    const coordKey = `${lat.toFixed(6)}_${lng.toFixed(6)}` // Plus de précision GPS
    const commentKey = comment.trim().toLowerCase().replace(/\s+/g, '_') // Normaliser commentaire
    
    return `${timeKey}_${coordKey}_${commentKey}`
  }

  // Fonction pour obtenir URL des photos Supabase Storage
  const getPhotoUrl = (storagePath) => {
    if (!storagePath) return null
    
    const { data } = supabase.storage
      .from('audit-photos')
      .getPublicUrl(storagePath)
    
    return data?.publicUrl || null
  }

  // ✅ CORRIGÉ: Marquer un audit local comme synchronisé (stratégie Local-First)
  const markLocalAuditAsSynced = async (localId, cloudId) => {
    try {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // ✅ NOUVELLE LOGIQUE: Chercher par plusieurs critères pour éviter les doublons
      const auditIndex = localAudits.findIndex(audit => 
        audit.id === localId || 
        audit.localId === localId
      )
      
      if (auditIndex >= 0) {
        // ✅ MISE À JOUR: Marquer comme synchronisé ET ajouter cloudId
        localAudits[auditIndex] = {
          ...localAudits[auditIndex],
          id: cloudId, // ✅ CRUCIAL: Utiliser cloudId comme ID principal
          cloudId: cloudId,
          synced: true,
          syncedAt: new Date().toISOString(),
          localOnly: false,
          source: 'local_synced' // ✅ NOUVEAU: Marquer comme local synchronisé
        }
        
        localStorage.setItem('onuf_audits_local', JSON.stringify(localAudits))
        console.log(`✅ Audit ${localId} marqué synchronisé (ID cloud: ${cloudId})`)
        
        return true
      } else {
        console.warn(`⚠️ Audit local non trouvé pour marquer comme synchronisé: ${localId}`)
        return false
      }
    } catch (error) {
      console.error('❌ Erreur marquage sync:', error)
      return false
    }
  }

  // Sauvegarder vers le cloud (Supabase)
  const saveAuditToCloud = async (auditData) => {
    try {
      // ✅ CORRIGÉ: Extraire coordonnées de façon sûre
      let latitude = null
      let longitude = null
      
      if (auditData.coordinates && auditData.coordinates.lat && auditData.coordinates.lng) {
        latitude = parseFloat(auditData.coordinates.lat)
        longitude = parseFloat(auditData.coordinates.lng)
      } else if (auditData.latitude && auditData.longitude) {
        latitude = parseFloat(auditData.latitude)
        longitude = parseFloat(auditData.longitude)
      } else {
        // Fallback vers position par défaut si aucune coordonnée
        console.warn('⚠️ Aucune coordonnée GPS valide - Utilisation position par défaut')
        latitude = 30.356278  // Position par défaut Agadir
        longitude = -9.545752
      }
      
      // ✅ NOUVEAU: Enrichir avec géocodage inverse si pas déjà fait
      let geocodeResult = null
      if (latitude && longitude && latitude !== 0 && longitude !== 0 && !auditData.address) {
        try {
          console.log('🌍 Géocodage inverse pour cloud:', { latitude, longitude })
          geocodeResult = await reverseGeocode(latitude, longitude)
          console.log('📍 Résultat géocodage cloud:', geocodeResult)
        } catch (geocodeError) {
          console.warn('⚠️ Erreur géocodage cloud (non bloquante):', geocodeError)
        }
      }

      // Préparer données pour la base
      // CORRIGÉ: Utiliser userId stocké dans auditData au lieu de currentUser.value
      const userId = auditData.userId || currentUser.value?.id
      
      // Validation: s'assurer que user_id n'est jamais null
      if (!userId) {
        console.error('❌ Erreur: user_id manquant pour la synchronisation')
        return { success: false, error: 'user_id manquant' }
      }
      
      const dbAudit = {
        user_id: userId,
        latitude: latitude,
        longitude: longitude,
        location_text: auditData.location || 'Position non disponible',
        location_accuracy: auditData.locationAccuracy || auditData.accuracy || 999999, // ✅ CORRIGÉ: Valeur par défaut valide
        // ✅ CORRIGÉ: Utiliser nearby_info pour stocker le géocodage inverse
        nearby_info: geocodeResult?.displayName || auditData.address || auditData.location || auditData.nearbyInfo || null,
        lighting: auditData.lighting,
        walkpath: auditData.walkpath,
        openness: auditData.openness,
        feeling: auditData.feeling,
        people_presence: auditData.peoplePresence,
        cleanliness: auditData.cleanliness,
        // Nouvelles questions d'audit
        natural_surveillance: auditData.naturalSurveillance,
        space_diversity: auditData.spaceDiversity,
        transport_access: auditData.transportAccess,
        stray_dogs: auditData.strayDogs,
        shade: auditData.shade,
        comment: auditData.comment,
        total_photos: auditData.photos?.length || 0,
        ui_language: 'fr',
        device_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          timestamp: new Date().toISOString(),
          // ✅ CORRIGÉ: Infos GPS détaillées avec fallback
          gps_accuracy: auditData.locationAccuracy || auditData.accuracy || 999999,
          gps_timestamp: auditData.gpsTimestamp || new Date().toISOString()
        },
        is_completed: true
      }
      
      console.log('📤 Envoi DB avec coordonnées:', { latitude, longitude, accuracy: dbAudit.location_accuracy })

      // Logger l'appel Supabase
      mobileDebugLogger.logSupabaseCall('insert', 'audits', dbAudit)

      // Insérer audit
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .insert(dbAudit)
        .select()
        .single()

      if (auditError) {
        mobileDebugLogger.logSupabaseCall('insert', 'audits', dbAudit, auditError)
        throw auditError
      }

      // Upload photos si présentes
      if (auditData.photos && auditData.photos.length > 0) {
        await uploadAuditPhotos(audit.id, auditData.photos)
      }

      // ✅ NOUVEAU: Marquer l'audit local comme synchronisé
      const markResult = await markLocalAuditAsSynced(auditData.id || auditData.localId, audit.id)
      
      // ✅ NOUVEAU: Attendre un peu pour que les données soient bien mises à jour
      if (markResult) {
        setTimeout(() => {
          console.log('✅ Déclenchement événement audit-synced avec délai')
          window.dispatchEvent(new CustomEvent('onuf-audit-synced', { 
            detail: { localId: auditData.id || auditData.localId, cloudId: audit.id } 
          }))
        }, 100) // Petit délai pour s'assurer que localStorage est à jour
      }

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

      // 🔍 LOG: Vérifier les données GPS reçues
      console.log('📍 Saving audit with location data:', {
        coordinates: auditData.coordinates,
        latitude: auditData.latitude,
        longitude: auditData.longitude,
        location: auditData.location,
        locationAccuracy: auditData.locationAccuracy,
        accuracy: auditData.accuracy
      })

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

  // ✅ NOUVEAU: Sauvegarder localement avec stratégie Local-First SIMPLE
  const saveAuditLocally = async (auditData) => {
    try {
      // Générer ID unique si pas présent
      if (!auditData.id) {
        auditData.id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // ✅ SIMPLE: Garantir données minimales
      const safeAuditData = {
        ...auditData,
        coordinates: auditData.coordinates || { lat: 0, lng: 0 },
        location: auditData.location || 'Position non disponible',
        locationAccuracy: auditData.locationAccuracy || auditData.accuracy || 999999,
        timestamp: auditData.timestamp || Date.now()
      }

      // 🔍 LOG: Vérifier les données avant sauvegarde locale
      console.log('💾 Saving to localStorage with:', {
        id: safeAuditData.id,
        coordinates: safeAuditData.coordinates,
        latitude: safeAuditData.latitude,
        longitude: safeAuditData.longitude,
        location: safeAuditData.location,
        locationAccuracy: safeAuditData.locationAccuracy
      })

      // ✅ NOUVEAU: Enrichir avec géocodage inverse si coordonnées valides
      let geocodeResult = null
      const lat = safeAuditData.coordinates?.lat || safeAuditData.latitude
      const lng = safeAuditData.coordinates?.lng || safeAuditData.longitude
      
      if (lat && lng && lat !== 0 && lng !== 0) {
        try {
          console.log('🌍 Géocodage inverse pour:', { lat, lng })
          geocodeResult = await reverseGeocode(lat, lng)
          console.log('📍 Résultat géocodage:', geocodeResult)
        } catch (geocodeError) {
          console.warn('⚠️ Erreur géocodage (non bloquante):', geocodeError)
        }
      }

      // Préparer données locales enrichies
      const localAudit = {
        ...safeAuditData,
        userId: currentUser.value.id,
        localId: safeAuditData.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        synced: false,
        localOnly: true,
        // ✅ NOUVEAU: Utiliser nearby_info pour le géocodage inverse
        nearby_info: geocodeResult?.displayName || null,
        // Garder address pour compatibilité avec l'interface
        address: geocodeResult?.displayName || safeAuditData.location || 'Position non disponible',
        // Garder aussi les coordonnées pour compatibilité
        latitude: lat || null,
        longitude: lng || null
      }

      // Récupérer audits existants
      const existingAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // ✅ NOUVEAU: Déduplication simple par ID uniquement
      const existingIndex = existingAudits.findIndex(existing => 
        existing.id === localAudit.id || existing.localId === localAudit.id
      )
      
      if (existingIndex !== -1) {
        // Remplacer l'audit existant (mise à jour)
        existingAudits[existingIndex] = {
          ...existingAudits[existingIndex], // Garder cloudId et statut sync
          ...localAudit,
          // Préserver ces champs importants
          synced: existingAudits[existingIndex].synced || false,
          cloudId: existingAudits[existingIndex].cloudId || null
        }
        console.log(`🔄 Audit mis à jour: ${localAudit.id}`)
      } else {
        // Ajouter nouvel audit
        existingAudits.push(localAudit)
        console.log(`➕ Nouvel audit créé: ${localAudit.id}`)
      }
      
      localStorage.setItem('onuf_audits_local', JSON.stringify(existingAudits))
      console.log(`✅ Audit sauvegardé localement: ${safeAuditData.id}`)
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
        const storagePath = `${currentUser.value.id}/${fileName}`
        
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
            user_id: currentUser.value.id,
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

  // ✅ NOUVEAU: Récupérer tous les audits avec stratégie Local-First SIMPLE
  const getAllAudits = async () => {
    loading.value = true
    error.value = null
    
    try {
      // 1. TOUJOURS charger les audits locaux (disponibles offline)
      const allLocalAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // ✅ IMPORTANT: Filtrer par utilisateur connecté
      const localAudits = allLocalAudits.filter(audit => 
        audit.userId === currentUser.value?.id
      )
      
      console.log(`📋 Local-First: ${localAudits.length} audits locaux de l'utilisateur (sur ${allLocalAudits.length} total)`)
      
      // 2. Si ONLINE: charger aussi le cloud pour détecter nouveaux audits
      let cloudAudits = []
      if (isOnline.value && currentUser.value) {
        console.log('🌐 Mode online: chargement cloud...')
        const cloudResult = await getUserAudits()
        if (cloudResult.success) {
          cloudAudits = cloudResult.audits
          console.log(`☁️ Cloud: ${cloudAudits.length} audits récupérés pour l'utilisateur`)
        } else {
          console.warn('⚠️ Erreur cloud (non bloquante):', cloudResult.error)
        }
      } else {
        console.log('📴 Mode offline: utilisation local uniquement')
      }

      // 3. Fusionner avec priorité LOCAL
      const allAudits = mergeAudits(localAudits, cloudAudits)
      
      return { success: true, audits: allAudits }
    } catch (err) {
      error.value = err.message
      console.error('❌ Get all audits error:', err)
      
      // ✅ FALLBACK: En cas d'erreur, au moins retourner le local
      try {
        const allLocalAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
        const localAudits = allLocalAudits.filter(audit => 
          audit.userId === currentUser.value?.id
        )
        console.log('🚑 Fallback: utilisation local uniquement')
        return { success: true, audits: localAudits }
      } catch (fallbackErr) {
        return { success: false, error: err.message, audits: [] }
      }
    } finally {
      loading.value = false
    }
  }

  // Récupérer audits utilisateur depuis le cloud avec photos
  const getUserAudits = async () => {
    try {
      // CORRIGÉ: Vérifier que currentUser existe avant l'appel
      if (!currentUser.value || !currentUser.value.id) {
        console.warn('⚠️ getUserAudits: Utilisateur non connecté')
        return { success: false, error: 'Utilisateur non connecté', audits: [] }
      }
      
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
        .eq('user_id', currentUser.value.id)
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

  // ✅ SUPPRIMÉ: Plus de nettoyage automatique dans la stratégie Local-First
  // Les audits restent en local pour être disponibles offline
  // Nettoyage = MANUEL UNIQUEMENT via bouton interface

  // ✅ CORRIGÉ: Fusionner audits avec stratégie Local-First ANTI-DUPLICATION
  const mergeAudits = (localAudits, cloudAudits) => {
    const merged = []
    const processedCloudIds = new Set()
    
    console.log(`🔄 Fusion Local-First: ${localAudits.length} locaux + ${cloudAudits.length} cloud`)
    
    // 1. AJOUTER TOUS LES AUDITS LOCAUX D'ABORD (priorité absolue)
    localAudits.forEach(audit => {
      const enrichedAudit = {
        ...audit,
        source: audit.synced ? 'local_synced' : 'local',
        localOnly: !audit.synced,
        synced: audit.synced || false
      }
      
      merged.push(enrichedAudit)
      
      // ✅ NOUVEAU: Enregistrer les cloudId pour éviter doublons
      if (audit.cloudId) {
        processedCloudIds.add(audit.cloudId)
        console.log(`🔗 Local audit ${audit.id} lié au cloudId: ${audit.cloudId}`)
      }
      
      // ✅ CRUCIAL: Si l'audit local utilise un cloudId comme ID principal, l'enregistrer aussi
      if (audit.id && audit.id.length > 20 && !audit.id.startsWith('audit_')) {
        // Probablement un cloudId utilisé comme ID principal
        processedCloudIds.add(audit.id)
        console.log(`🔗 Local audit utilise cloudId comme ID principal: ${audit.id}`)
      }
    })
    
    // 2. AJOUTER AUDITS CLOUD SEULEMENT S'ILS N'EXISTENT PAS DÉJÀ EN LOCAL
    cloudAudits.forEach(cloudAudit => {
      // ✅ CORRIGÉ: Vérifier si ce cloudAudit.id existe déjà comme cloudId local
      const isAlreadyLocal = processedCloudIds.has(cloudAudit.id)
      
      if (!isAlreadyLocal) {
        const enrichedAudit = {
          ...cloudAudit,
          source: 'cloud',
          localOnly: false,
          synced: true,
          cloudId: cloudAudit.id
        }
        
        merged.push(enrichedAudit)
        console.log(`📥 Audit cloud ajouté: ${cloudAudit.id}`)
      } else {
        console.log(`🚫 Audit cloud ignoré (déjà synchronisé en local): ${cloudAudit.id}`)
      }
    })
    
    // 3. TRIER PAR DATE (plus récent en premier)
    const sorted = merged.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || a.timestamp || 0)
      const dateB = new Date(b.created_at || b.createdAt || b.timestamp || 0)
      return dateB - dateA
    })
    
    console.log(`✅ Fusion terminée: ${sorted.length} audits total (${localAudits.length} locaux + ${cloudAudits.length} cloud)`)
    console.log(`🔍 Debug fusion:`, {
      processedCloudIds: Array.from(processedCloudIds),
      finalCount: sorted.length
    })
    
    return sorted
  }

  // Supprimer audit
  const deleteAudit = async (auditId) => {
    try {
      // Supprimer du local
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // ✅ IMPORTANT: Vérifier que l'audit appartient à l'utilisateur avant de supprimer
      const auditToDelete = localAudits.find(a => 
        (a.id === auditId || a.localId === auditId) && 
        a.userId === currentUser.value?.id
      )
      
      if (!auditToDelete) {
        console.warn('⚠️ Tentative de suppression d\'un audit non autorisé')
        return { success: false, error: 'Audit non trouvé ou non autorisé' }
      }
      
      const filteredLocal = localAudits.filter(a => a.id !== auditId && a.localId !== auditId)
      localStorage.setItem('onuf_audits_local', JSON.stringify(filteredLocal))

      // Supprimer du cloud si connecté
      if (isOnline.value && currentUser.value) {
        const { error: deleteError } = await supabase
          .from('audits')
          .delete()
          .eq('id', auditId)
          .eq('user_id', currentUser.value.id)

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
            user_id: currentUser.value.id,
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
          .eq('user_id', currentUser.value.id)
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
          .eq('user_id', currentUser.value.id)

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
      const allLocalAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      
      // ✅ IMPORTANT: Filtrer par utilisateur connecté
      const userAudits = allLocalAudits.filter(audit => 
        audit.userId === currentUser.value?.id
      )
      
      const unsynced = userAudits.filter(audit => !audit.synced)

      console.log(`🔄 Synchronisation de ${unsynced.length} audits locaux de l'utilisateur...`)

      for (const audit of unsynced) {
        addToSyncQueue(audit)
      }

      return { success: true, queued: unsynced.length }
    } catch (err) {
      console.error('Sync all local audits error:', err)
      return { success: false, error: err.message }
    }
  }

  // ✅ NOUVEAU: Fonctions pour les statistiques et compteurs (UI)
  const getPendingAuditsCount = async () => {
    try {
      // Compter audits en cours de progression
      const progressData = localStorage.getItem('onuf_audit_progress')
      const hasPendingProgress = progressData && JSON.parse(progressData)
      
      // Pour l'instant, retourner 1 si progression en cours, 0 sinon
      return hasPendingProgress ? 1 : 0
    } catch (error) {
      console.error('Erreur comptage audits en attente:', error)
      return 0
    }
  }

  const getAuditsStats = async () => {
    try {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const userAudits = localAudits.filter(audit => 
        audit.userId === currentUser.value?.id
      )
      
      const totalAudits = userAudits.length
      const syncedAudits = userAudits.filter(audit => audit.synced).length
      const localOnlyAudits = totalAudits - syncedAudits
      
      // Calculer score moyen (approximatif basé sur les évaluations)
      let totalScore = 0
      let scoredAudits = 0
      
      userAudits.forEach(audit => {
        // Calculer un score simple basé sur les réponses (0-100) pour 11 questions
        const scores = [
          audit.lighting,
          audit.walkpath,
          audit.openness,
          audit.feeling,
          audit.people_presence || audit.peoplePresence,
          audit.cleanliness,
          audit.natural_surveillance || audit.naturalSurveillance,
          audit.space_diversity || audit.spaceDiversity,
          audit.transport_access || audit.transportAccess,
          audit.stray_dogs || audit.strayDogs,
          audit.shade
        ].filter(s => s !== null && s !== undefined)
        
        if (scores.length > 0) {
          // Moyenne des scores (1-4) convertie en pourcentage (0-100)
          const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length
          const score = ((avgScore - 1) / 3) * 100 // Convertir de 1-4 à 0-100
          totalScore += score
          scoredAudits++
        }
      })
      
      const averageScore = scoredAudits > 0 ? Math.round(totalScore / scoredAudits) : 0
      
      // Dernière date d'audit
      const lastAudit = userAudits.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || a.timestamp || 0)
        const dateB = new Date(b.created_at || b.createdAt || b.timestamp || 0)
        return dateB - dateA
      })[0]
      
      const lastAuditDate = lastAudit 
        ? new Date(lastAudit.created_at || lastAudit.createdAt || lastAudit.timestamp).toLocaleDateString('fr-FR')
        : 'Aucun'
      
      return {
        success: true,
        stats: {
          totalAudits,
          syncedAudits,
          localOnlyAudits,
          averageScore,
          lastAuditDate,
          pendingSync: syncStats.pending || 0,
          failedSync: syncStats.failed || 0
        }
      }
    } catch (error) {
      console.error('Erreur calcul statistiques:', error)
      return {
        success: false,
        error: error.message,
        stats: {
          totalAudits: 0,
          syncedAudits: 0,
          localOnlyAudits: 0,
          averageScore: 0,
          lastAuditDate: 'Erreur',
          pendingSync: 0,
          failedSync: 0
        }
      }
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
    syncAllLocalAudits,
    // ✅ NOUVEAU: Fonctions pour l'interface
    getPendingAuditsCount,
    getAuditsStats
  }
}
