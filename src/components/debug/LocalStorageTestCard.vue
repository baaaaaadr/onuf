<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      💾 Test LocalStorage
    </v-card-title>
    <v-card-text>
      <p>Vérifier le stockage local des données</p>
      <v-btn 
        @click="runTest" 
        :loading="testing"
        color="primary"
        class="mb-2"
        block
      >
        🗄️ Tester LocalStorage
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

const emit = defineEmits(['log', 'statusUpdate'])

const testing = ref(false)
const results = ref(null)

const runTest = async () => {
  testing.value = true
  emit('log', 'info', 'Début test LocalStorage')
  
  try {
    const testData = {
      id: `test_${Date.now()}`,
      message: 'Test LocalStorage mobile',
      timestamp: new Date().toISOString()
    }
    
    emit('log', 'info', 'Tentative sauvegarde test data', testData)
    
    // Sauvegarder
    localStorage.setItem('onuf_test_data', JSON.stringify(testData))
    emit('log', 'success', 'Données sauvegardées avec succès')
    
    // Lire
    const retrievedRaw = localStorage.getItem('onuf_test_data')
    const retrieved = JSON.parse(retrievedRaw)
    emit('log', 'info', 'Données récupérées', retrieved)
    
    // Vérifier
    if (retrieved && retrieved.message === testData.message) {
      const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const auditProgress = localStorage.getItem('onuf_audit_progress')
      
      results.value = {
        success: true,
        message: '✅ LocalStorage fonctionne correctement',
        details: `
          <strong>Sauvegarde:</strong> OK<br>
          <strong>Lecture:</strong> OK<br>
          <strong>Vérification:</strong> OK<br>
          <strong>Audits locaux:</strong> ${localAudits.length} audit(s)<br>
          <strong>Progression sauvée:</strong> ${auditProgress ? 'Oui' : 'Non'}<br>
          <strong>Test ID:</strong> ${testData.id}
        `
      }
      emit('statusUpdate', 'LocalStorage', 'success')
    } else {
      throw new Error('Données récupérées incorrectes')
    }
    
    // Nettoyer
    localStorage.removeItem('onuf_test_data')
    emit('log', 'info', 'Nettoyage test data terminé')
    
  } catch (error) {
    emit('log', 'error', 'Erreur test LocalStorage', error)
    results.value = {
      success: false,
      message: `❌ Erreur LocalStorage: ${error.message}`,
      details: `
        <strong>Erreur:</strong> ${error.message}<br>
        <strong>Stack:</strong> ${error.stack || 'Non disponible'}
      `
    }
    emit('statusUpdate', 'LocalStorage', 'error')
  } finally {
    testing.value = false
  }
}

defineExpose({ runTest, results })
</script>
