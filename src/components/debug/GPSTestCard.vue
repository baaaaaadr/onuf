<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      📍 Test GPS
    </v-card-title>
    <v-card-text>
      <p>Vérifier la géolocalisation et la précision</p>
      <v-btn 
        @click="runTest" 
        :loading="testing"
        color="primary"
        class="mb-2"
        block
      >
        🧭 Tester GPS
      </v-btn>
      
      <div v-if="results" class="mt-3">
        <v-alert 
          :type="results.success ? 'success' : 'error'"
          density="compact"
        >
          {{ results.message }}
        </v-alert>
        
        <div v-if="results.position" class="mt-2">
          <small>
            <strong>Coordonnées:</strong> {{ results.position.lat.toFixed(6) }}, {{ results.position.lng.toFixed(6) }}<br>
            <strong>Précision:</strong> {{ results.position.accuracy }}m<br>
            <strong>Timestamp:</strong> {{ new Date(results.position.timestamp).toLocaleString() }}
          </small>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits(['log', 'statusUpdate'])

const { getPosition } = useGeolocation()
const testing = ref(false)
const results = ref(null)

const runTest = async () => {
  testing.value = true
  emit('log', 'info', 'Début test GPS')
  
  try {
    emit('log', 'info', 'Demande de géolocalisation...')
    const position = await getPosition()
    
    if (position && position.lat && position.lng) {
      results.value = {
        success: true,
        message: '✅ GPS fonctionne correctement',
        position: {
          lat: position.lat,
          lng: position.lng,
          accuracy: position.accuracy || 'Inconnue',
          timestamp: position.timestamp || Date.now()
        }
      }
      emit('statusUpdate', 'GPS', 'success')
      emit('log', 'success', 'Position obtenue', position)
    } else {
      throw new Error('Position invalide ou incomplète')
    }
  } catch (error) {
    emit('log', 'error', 'Erreur GPS', error)
    results.value = {
      success: false,
      message: `❌ Erreur GPS: ${error.message}`
    }
    emit('statusUpdate', 'GPS', 'error')
  } finally {
    testing.value = false
  }
}

defineExpose({ runTest, results })
</script>
