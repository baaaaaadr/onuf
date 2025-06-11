<template>
  <div class="mobile-test-page">
    <v-app-bar 
      color="primary" 
      dark 
      height="64"
      class="mobile-test-header"
    >
      <v-app-bar-title>
        🔬 Tests Mobile ONUF
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn 
        icon 
        @click="clearAllLogs"
        :disabled="logs.length === 0"
      >
        <v-icon>mdi-delete-sweep</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        @click="exportLogs"
        :disabled="logs.length === 0"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        @click="runAllTests"
        :disabled="isRunningAll"
      >
        <v-icon>mdi-play-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container class="pa-4">
      <!-- Tests Status -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              📊 État des Tests
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip 
                  v-for="test in testResults" 
                  :key="test.name"
                  :color="test.status === 'success' ? 'success' : test.status === 'error' ? 'error' : 'grey'"
                  class="ma-1"
                >
                  {{ test.status === 'success' ? '✅' : test.status === 'error' ? '❌' : '⏳' }}
                  {{ test.name }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tests Individuels -->
      <v-row>
        <v-col cols="12" md="6">
          <GPSTestCard 
            ref="gpsTest"
            @log="handleLog" 
            @status-update="handleStatusUpdate" 
          />
        </v-col>

        <v-col cols="12" md="6">
          <LocalStorageTestCard 
            ref="localStorageTest"
            @log="handleLog" 
            @status-update="handleStatusUpdate" 
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <SupabaseTestCard 
            ref="supabaseTest"
            @log="handleLog" 
            @status-update="handleStatusUpdate" 
          />
        </v-col>

        <v-col cols="12" md="6">
          <FullFlowTestCard 
            ref="fullFlowTest"
            @log="handleLog" 
            @status-update="handleStatusUpdate" 
          />
        </v-col>
      </v-row>

      <!-- Logs en temps réel -->
      <v-row>
        <v-col cols="12">
          <LogsViewer :logs="logs" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOnline } from '@vueuse/core'
import { useAuth } from '@/composables/useSupabase'
import mobileDebugLogger from '@/utils/mobileDebug'

// Imports des composants
import GPSTestCard from '@/components/debug/GPSTestCard.vue'
import LocalStorageTestCard from '@/components/debug/LocalStorageTestCard.vue'
import SupabaseTestCard from '@/components/debug/SupabaseTestCard.vue'
import FullFlowTestCard from '@/components/debug/FullFlowTestCard.vue'
import LogsViewer from '@/components/debug/LogsViewer.vue'

// Variables réactives
const isOnline = useOnline()
const { currentUser } = useAuth()
const logs = ref([])
const testStatuses = ref({
  GPS: 'pending',
  LocalStorage: 'pending',
  Supabase: 'pending',
  'Flux Complet': 'pending'
})
const isRunningAll = ref(false)

// Références aux composants
const gpsTest = ref(null)
const localStorageTest = ref(null)
const supabaseTest = ref(null)
const fullFlowTest = ref(null)

// Résultats des tests compilés
const testResults = computed(() => [
  { name: 'GPS', status: testStatuses.value.GPS },
  { name: 'LocalStorage', status: testStatuses.value.LocalStorage },
  { name: 'Supabase', status: testStatuses.value.Supabase },
  { name: 'Flux Complet', status: testStatuses.value['Flux Complet'] }
])

// Gérer les logs des composants enfants
const handleLog = (type, message, data = null) => {
  const logEntry = {
    type,
    message,
    data,
    timestamp: Date.now()
  }
  
  logs.value.push(logEntry)
  
  // Garder seulement les 100 derniers logs
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(-100)
  }
  
  // Logger aussi via le système mobile debug
  mobileDebugLogger.addLog(type, [`[TEST] ${message}`, data])
}

// Gérer les mises à jour de statut
const handleStatusUpdate = (testName, status) => {
  testStatuses.value[testName] = status
  handleLog('info', `Test ${testName}: ${status}`)
}

// Lancer tous les tests en séquence
const runAllTests = async () => {
  if (isRunningAll.value) return
  
  isRunningAll.value = true
  handleLog('info', '🚀 Lancement de tous les tests')
  
  try {
    // Reset statuses
    Object.keys(testStatuses.value).forEach(key => {
      testStatuses.value[key] = 'pending'
    })
    
    await gpsTest.value?.runTest()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await localStorageTest.value?.runTest()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await supabaseTest.value?.runTest()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await fullFlowTest.value?.runTest()
    
    handleLog('success', '✅ Tous les tests terminés')
  } catch (error) {
    handleLog('error', 'Erreur lors de l\'exécution des tests', error)
  } finally {
    isRunningAll.value = false
  }
}

// Nettoyer tous les logs
const clearAllLogs = () => {
  logs.value = []
  handleLog('info', 'Logs nettoyés')
}

// Exporter les logs
const exportLogs = () => {
  const exportData = {
    timestamp: new Date().toISOString(),
    device: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      online: isOnline.value,
      user: currentUser.value?.username || 'Non connecté'
    },
    testResults: testResults.value,
    logs: logs.value
  }
  
  const dataStr = JSON.stringify(exportData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `onuf-mobile-test-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
  
  handleLog('success', '📁 Logs exportés avec succès')
}

// Initialisation
onMounted(() => {
  handleLog('info', '🔧 Page de test mobile initialisée')
  handleLog('info', `État connexion: ${isOnline.value ? 'En ligne' : 'Hors ligne'}`)
  handleLog('info', `Utilisateur: ${currentUser.value?.username || 'Non connecté'}`)
})
</script>

<style scoped>
.mobile-test-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.mobile-test-header {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
