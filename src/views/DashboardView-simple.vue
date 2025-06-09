<template>
  <div class="dashboard-simple">
    <v-container class="pa-4">
      <!-- Test basique -->
      <div class="text-center mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">
          🛡️ ONUF Dashboard
        </h1>
        <p class="text-body-1">
          Version de test simplifiée
        </p>
      </div>

      <!-- Statistiques test -->
      <v-row class="mb-4">
        <v-col cols="6">
          <v-card color="surface" class="text-center pa-4">
            <div class="text-h6 font-weight-bold">{{ stats.totalAudits }}</div>
            <div class="text-body-2">Audits Réalisés</div>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card color="surface" class="text-center pa-4">
            <div class="text-h6 font-weight-bold">{{ stats.averageScore }}/100</div>
            <div class="text-body-2">Score Moyen</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Actions de test -->
      <div class="actions-test mb-4">
        <v-btn 
          color="primary" 
          size="large" 
          block 
          @click="goToAudit"
          class="mb-3"
        >
          Démarrer un Audit
        </v-btn>
        
        <v-btn 
          color="surface" 
          size="large" 
          block 
          @click="goToHistory"
        >
          Voir l'Historique
        </v-btn>
      </div>

      <!-- Infos de debug -->
      <v-card color="info" variant="tonal" class="pa-4">
        <div class="text-body-2">
          <strong>Debug Info:</strong><br>
          Utilisateur: {{ currentUser?.display_name || 'Non connecté' }}<br>
          Route: {{ $route.path }}<br>
          Timestamp: {{ new Date().toLocaleTimeString() }}
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useSupabase'

const router = useRouter()
const route = useRoute()
const { currentUser } = useAuth()

const stats = ref({
  totalAudits: 0,
  averageScore: 0
})

const goToAudit = () => {
  router.push('/audit')
}

const goToHistory = () => {
  router.push('/history')
}

onMounted(() => {
  console.log('📊 Dashboard simple monté')
  
  // Simuler des stats de test
  stats.value = {
    totalAudits: 5,
    averageScore: 78
  }
})
</script>

<style scoped>
.dashboard-simple {
  min-height: 100vh;
  background: #F5F3F0;
}
</style>
