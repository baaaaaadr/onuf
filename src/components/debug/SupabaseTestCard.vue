<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      ☁️ Test Supabase
    </v-card-title>
    <v-card-text>
      <p>Vérifier la connexion à la base de données</p>
      <v-btn 
        @click="runTest" 
        :loading="testing"
        color="primary"
        class="mb-2"
        block
      >
        🌐 Tester Supabase
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
import { supabase } from '@/composables/useSupabase'
import { useAuth } from '@/composables/useSupabase'

const emit = defineEmits(['log', 'statusUpdate'])

const isOnline = useOnline()
const { currentUser } = useAuth()
const testing = ref(false)
const results = ref(null)

const runTest = async () => {
  testing.value = true
  emit('log', 'info', 'Début test Supabase')
  
  try {
    emit('log', 'info', 'Test de connexion Supabase...')
    
    // Test de connexion simple
    const { data, error } = await supabase
      .from('audits')
      .select('count')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    emit('log', 'success', 'Connexion Supabase OK', data)
    
    // Test authentification
    const authTest = currentUser.value ? 'Connecté' : 'Non connecté'
    emit('log', 'info', `État authentification: ${authTest}`)
    
    // Test avec utilisateur connecté
    if (currentUser.value) {
      emit('log', 'info', 'Test récupération audits utilisateur...')
      const { data: userAudits, error: userError } = await supabase
        .from('audits')
        .select('id, created_at')
        .eq('user_id', currentUser.value.user_id)
        .limit(5)
      
      if (userError) {
        emit('log', 'warn', 'Erreur récupération audits utilisateur', userError)
      } else {
        emit('log', 'success', `Audits utilisateur récupérés: ${userAudits?.length || 0}`)
      }
    }
    
    results.value = {
      success: true,
      message: '✅ Supabase fonctionne correctement',
      details: `
        <strong>Connexion:</strong> OK<br>
        <strong>Authentification:</strong> ${authTest}<br>
        <strong>Utilisateur:</strong> ${currentUser.value?.username || 'Aucun'}<br>
        <strong>En ligne:</strong> ${isOnline.value ? 'Oui' : 'Non'}
      `
    }
    emit('statusUpdate', 'Supabase', 'success')
    
  } catch (error) {
    emit('log', 'error', 'Erreur test Supabase', error)
    results.value = {
      success: false,
      message: `❌ Erreur Supabase: ${error.message}`,
      details: `
        <strong>Erreur:</strong> ${error.message}<br>
        <strong>Code:</strong> ${error.code || 'Non disponible'}<br>
        <strong>En ligne:</strong> ${isOnline.value ? 'Oui' : 'Non'}
      `
    }
    emit('statusUpdate', 'Supabase', 'error')
  } finally {
    testing.value = false
  }
}

defineExpose({ runTest, results })
</script>
