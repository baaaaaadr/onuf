<!-- src/views/MobileTestView.vue -->
<template>
  <v-container class="pa-4">
    <v-card>
      <v-card-title>
        🧪 Test Mobile ONUF
        <v-spacer />
        <v-chip :color="isOnline ? 'success' : 'error'" size="small">
          {{ isOnline ? 'Online' : 'Offline' }}
        </v-chip>
      </v-card-title>
      
      <v-card-text>
        <!-- Test GPS -->
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-h6">
            📍 Test GPS
          </v-card-title>
          <v-card-text>
            <v-btn 
              @click="testGPS" 
              :loading="gpsLoading"
              color="primary"
              block
            >
              Tester la géolocalisation
            </v-btn>
            
            <v-alert 
              v-if="gpsResult" 
              :type="gpsResult.success ? 'success' : 'error'"
              class="mt-4"
            >
              <pre>{{ JSON.stringify(gpsResult, null, 2) }}</pre>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Test IndexedDB -->
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-h6">
            💾 Test IndexedDB
          </v-card-title>
          <v-card-text>
            <v-btn 
              @click="testIndexedDB" 
              :loading="dbLoading"
              color="primary"
              block
            >
              Tester le stockage local
            </v-btn>
            
            <v-alert 
              v-if="dbResult" 
              :type="dbResult.success ? 'success' : 'error'"
              class="mt-4"
            >
              <pre>{{ JSON.stringify(dbResult, null, 2) }}</pre>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Test Supabase -->
        <v-card class="mb-4" variant="outlined">
          <v-card-title class="text-h6">
            ☁️ Test Supabase
          </v-card-title>
          <v-card-text>
            <v-btn 
              @click="testSupabase" 
              :loading="supabaseLoading"
              color="primary"
              block
            >
              Tester la connexion Supabase
            </v-btn>
            
            <v-alert 
              v-if="supabaseResult" 
              :type="supabaseResult.success ? 'success' : 'error'"
              class="mt-4"
            >
              <pre>{{ JSON.stringify(supabaseResult, null, 2) }}</pre>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Test complet -->
        <v-card variant="outlined">
          <v-card-title class="text-h6">
            🚀 Test Complet (Audit + Sync)
          </v-card-title>
          <v-card-text>
            <v-btn 
              @click="testFullFlow" 
              :loading="fullLoading"
              color="error"
              block
            >
              Créer et synchroniser un audit test
            </v-btn>
            
            <v-stepper v-if="fullSteps.length > 0" class="mt-4">
              <v-stepper-item
                v-for="(step, i) in fullSteps"
                :key="i"
                :complete="step.complete"
                :error="step.error"
              >
                <template v-slot:title>
                  {{ step.title }}
                </template>
                <template v-slot:subtitle>
                  {{ step.message }}
                </template>
              </v-stepper-item>
            </v-stepper>
          </v-card-text>
        </v-card>

        <!-- Logs -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              📋 Logs détaillés ({{ logs.length }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-btn @click="clearLogs" size="small" class="mb-2">
                Effacer
              </v-btn>
              <v-btn @click="copyLogs" size="small" class="mb-2 ml-2">
                Copier
              </v-btn>
              <pre class="text-caption">{{ logsText }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOnline } from '@vueuse/core'
import { supabase } from '@/lib/supabase'
import localDB from '@/services/localDatabase'

const isOnline = useOnline()
const logs = ref([])

// States
const gpsLoading = ref(false)
const gpsResult = ref(null)
const dbLoading = ref(false)
const dbResult = ref(null)
const supabaseLoading = ref(false)
const supabaseResult = ref(null)
const fullLoading = ref(false)
const fullSteps = ref([])

// Computed
const logsText = computed(() => logs.value.join('\n'))

// Logger
const log = (message, data = null) => {
  const timestamp = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
  
  const logEntry = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`
  logs.value.push(logEntry)
  console.log(message, data || '')
}

// Test GPS
const testGPS = async () => {
  gpsLoading.value = true
  gpsResult.value = null
  log('🛰️ Starting GPS test...')
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          log('✅ GPS Success')
          resolve(pos)
        },
        (err) => {
          log('❌ GPS Error', err)
          reject(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      )
    })
    
    gpsResult.value = {
      success: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp).toISOString()
    }
    
  } catch (error) {
    gpsResult.value = {
      success: false,
      error: error.message,
      code: error.code
    }
  } finally {
    gpsLoading.value = false
  }
}

// Test IndexedDB
const testIndexedDB = async () => {
  dbLoading.value = true
  dbResult.value = null
  log('💾 Starting IndexedDB test...')
  
  try {
    // Test write
    const testAudit = {
      id: `test_${Date.now()}`,
      user_id: 'test_user',
      latitude: 48.8566,
      longitude: 2.3522,
      location_name: 'Test Location',
      created_at: new Date().toISOString(),
      data: { test: true }
    }
    
    log('Writing test audit...', testAudit)
    await localDB.saveAudit(testAudit)
    
    // Test read
    log('Reading audits...')
    const audits = await localDB.getAudits()
    
    // Test delete
    log('Deleting test audit...')
    await localDB.deleteAudit(testAudit.id)
    
    dbResult.value = {
      success: true,
      auditsCount: audits.length,
      testId: testAudit.id,
      operations: ['write', 'read', 'delete']
    }
    
    log('✅ IndexedDB test passed')
    
  } catch (error) {
    dbResult.value = {
      success: false,
      error: error.message,
      stack: error.stack
    }
    log('❌ IndexedDB error', error)
  } finally {
    dbLoading.value = false
  }
}

// Test Supabase
const testSupabase = async () => {
  supabaseLoading.value = true
  supabaseResult.value = null
  log('☁️ Starting Supabase test...')
  
  try {
    // Test auth status
    log('Checking auth...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) throw authError
    
    // Test simple query
    log('Testing database query...')
    const { data, error } = await supabase
      .from('audits')
      .select('id')
      .limit(1)
    
    if (error) throw error
    
    supabaseResult.value = {
      success: true,
      authenticated: !!user,
      userId: user?.id,
      canQuery: true,
      testQuery: data
    }
    
    log('✅ Supabase test passed')
    
  } catch (error) {
    supabaseResult.value = {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    }
    log('❌ Supabase error', error)
  } finally {
    supabaseLoading.value = false
  }
}

// Test complet
const testFullFlow = async () => {
  fullLoading.value = true
  fullSteps.value = []
  log('🚀 Starting full flow test...')
  
  const addStep = (title, message, complete = false, error = false) => {
    fullSteps.value.push({ title, message, complete, error })
  }
  
  try {
    // Step 1: GPS
    addStep('GPS', 'Obtention position...')
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 30000
      })
    })
    fullSteps.value[0].complete = true
    fullSteps.value[0].message = `Lat: ${position.coords.latitude.toFixed(6)}`
    
    // Step 2: Create audit
    addStep('Audit', 'Création audit test...')
    const testAudit = {
      id: `test_sync_${Date.now()}`,
      user_id: (await supabase.auth.getUser()).data.user?.id || 'test',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      position_accuracy: position.coords.accuracy,
      location_name: 'Test Sync Mobile',
      location_details: {
        type: 'test',
        mobile: true,
        userAgent: navigator.userAgent
      },
      created_at: new Date().toISOString(),
      data: {
        sections: {
          eclairage: { rating: 3, issues: ['test'] },
          cheminement: { rating: 4, issues: [] }
        }
      }
    }
    
    await localDB.saveAudit(testAudit)
    fullSteps.value[1].complete = true
    fullSteps.value[1].message = `ID: ${testAudit.id}`
    
    // Step 3: Add to sync queue
    addStep('Queue', 'Ajout à la queue de sync...')
    await localDB.addToSyncQueue({
      id: testAudit.id,
      type: 'audit',
      data: testAudit,
      timestamp: Date.now()
    })
    fullSteps.value[2].complete = true
    
    // Step 4: Sync to Supabase
    addStep('Sync', 'Synchronisation Supabase...')
    const { data, error } = await supabase
      .from('audits')
      .insert([testAudit])
      .select()
    
    if (error) throw error
    
    fullSteps.value[3].complete = true
    fullSteps.value[3].message = 'Synchronisé avec succès!'
    
    log('✅ Full flow test completed successfully!', data)
    
  } catch (error) {
    const currentStep = fullSteps.value.findIndex(s => !s.complete)
    if (currentStep >= 0) {
      fullSteps.value[currentStep].error = true
      fullSteps.value[currentStep].message = error.message
    }
    log('❌ Full flow error', error)
  } finally {
    fullLoading.value = false
  }
}

// Utils
const clearLogs = () => {
  logs.value = []
}

const copyLogs = async () => {
  try {
    await navigator.clipboard.writeText(logsText.value)
    alert('Logs copiés!')
  } catch (e) {
    alert('Erreur copie: ' + e.message)
  }
}

// Init
onMounted(() => {
  log('📱 Mobile test page loaded', {
    userAgent: navigator.userAgent,
    online: isOnline.value,
    url: window.location.href
  })
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}
</style>