<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      🔄 Test Flux Complet
    </v-card-title>
    <v-card-text>
      <p>Créer un audit complet et tenter la synchronisation</p>
      <v-btn 
        @click="runTest" 
        :loading="testing"
        color="primary"
        class="mb-2"
        block
      >
        🚀 Test Complet
      </v-btn>
      
      <div v-if="results" class="mt-3">
        <v-alert 
          :type="results.success ? 'success' : 'error'"
          density="compact"
        >
          {{ results.message }}
        </v-alert>
        
        <div v-if="results.details" class="mt-2">
          <small v-html="results.details"></small>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useOnline } from '@vueuse/core'
import { useGeolocation } from '@/composables/useGeolocation'
import { useAudits } from '@/composables/useAudits'
import { useAuth } from '@/composables/useSupabase'

const emit = defineEmits(['log', 'statusUpdate'])

const isOnline = useOnline()
const { currentUser } = useAuth()
const { getPosition } = useGeolocation()
const { saveAudit } = useAudits()
const testing = ref(false)
const results = ref(null)

const runTest = async () => {
  testing.value = true
  emit('log', 'info', 'Début test flux complet')
  
  try {
    if (!currentUser.value) {
      throw new Error('Utilisateur non connecté - impossible de tester le flux complet')
    }
    
    emit('log', 'info', 'Étape 1: Obtention GPS...')
    let position = null
    
    try {
      position = await getPosition()
      emit('log', 'success', 'GPS obtenu', position)
    } catch (gpsError) {
      emit('log', 'warn', 'GPS échoué, utilisation position par défaut', gpsError)
      position = {
        lat: 30.356278,
        lng: -9.545752,
        accuracy: 999999,
        timestamp: Date.now()
      }
    }
    
    emit('log', 'info', 'Étape 2: Création audit test...')
    const testAudit = {
      coordinates: {
        lat: position.lat,
        lng: position.lng
      },
      location: `Test Mobile - ${new Date().toLocaleString()}`,
      locationAccuracy: position.accuracy,
      lighting: 3,
      walkpath: 2,
      openness: 2,
      feeling: 3,
      peoplePresence: 1,
      cleanliness: 2,
      comment: `Test automatique mobile depuis la page de debug - ${new Date().toISOString()}`,
      photos: [],
      timestamp: Date.now()
    }
    
    emit('log', 'info', 'Données audit test', testAudit)
    
    emit('log', 'info', 'Étape 3: Sauvegarde audit...')
    const saveResult = await saveAudit(testAudit)
    
    if (saveResult.success) {
      emit('log', 'success', 'Audit sauvegardé avec succès', saveResult)
      
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const savedAudit = localAudits.find(a => a.comment === testAudit.comment)
      
      if (savedAudit) {
        emit('log', 'success', 'Audit trouvé en local', savedAudit)
      } else {
        emit('log', 'warn', 'Audit non trouvé en local')
      }
      
      results.value = {
        success: true,
        message: '✅ Flux complet réussi',
        details: `
          <strong>GPS:</strong> ${position.accuracy < 100 ? 'Précis' : 'Approximatif'} (${position.accuracy}m)<br>
          <strong>Sauvegarde locale:</strong> ${saveResult.audit ? 'OK' : 'Échec'}<br>
          <strong>Synchronisation:</strong> ${saveResult.synced ? 'OK' : 'En attente'}<br>
          <strong>Queue sync:</strong> ${saveResult.queued ? 'Ajouté' : 'Direct'}<br>
          <strong>Mode:</strong> ${saveResult.offline ? 'Hors ligne' : 'En ligne'}<br>
          <strong>ID audit:</strong> ${saveResult.audit?.id || 'Non disponible'}
        `
      }
      emit('statusUpdate', 'Flux Complet', 'success')
      
    } else {
      throw new Error(saveResult.error || 'Échec sauvegarde audit')
    }
    
  } catch (error) {
    emit('log', 'error', 'Erreur test flux complet', error)
    results.value = {
      success: false,
      message: `❌ Erreur flux complet: ${error.message}`,
      details: `
        <strong>Erreur:</strong> ${error.message}<br>
        <strong>Utilisateur:</strong> ${currentUser.value?.username || 'Non connecté'}<br>
        <strong>En ligne:</strong> ${isOnline.value ? 'Oui' : 'Non'}
      `
    }
    emit('statusUpdate', 'Flux Complet', 'error')
  } finally {
    testing.value = false
  }
}

defineExpose({ runTest, results })
</script>
