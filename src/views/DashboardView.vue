<template>
  <div class="dashboard-view">
    <!-- Container principal simplifié -->
    <v-container class="dashboard-container pa-4" fluid>
      <!-- Contenu minimal - Juste un message d'accueil simple -->
      <div class="welcome-section">
        <div class="welcome-icon mb-4">👋</div>
        <h2 class="text-h5 font-weight-medium text-center mb-2">
          Bienvenue {{ userDisplayName }}
        </h2>
        <p class="text-body-2 text-center text-medium-emphasis">
          Utilisez la navigation en bas pour accéder aux différentes sections
        </p>
      </div>

      <!-- Instructions simples -->
      <v-card class="mt-6" variant="tonal" color="primary">
        <v-card-text class="text-center">
          <v-icon size="48" color="primary" class="mb-3">mdi-plus-circle</v-icon>
          <p class="text-body-1 font-weight-medium mb-2">
            Prêt pour un nouvel audit ?
          </p>
          <p class="text-body-2 text-medium-emphasis">
            Cliquez sur l'onglet "Audit" en bas ou sur le bouton + dans la barre de navigation
          </p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useSupabase'

// Auth
const { currentUser } = useAuth()

// Computed
const userDisplayName = computed(() => {
  if (currentUser.value?.display_name) {
    return currentUser.value.display_name;
  } else if (currentUser.value?.username) {
    return currentUser.value.username;
  } else if (currentUser.value?.email) {
    return currentUser.value.email.split('@')[0];
  }
  return 'Utilisateur';
})
</script>

<style scoped>
.dashboard-view {
  width: 100%;
  min-height: 100vh;
  background: var(--onuf-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-container {
  max-width: 428px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.welcome-icon {
  font-size: 4rem;
  line-height: 1;
  animation: wave 0.8s ease-in-out;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

/* Responsive */
@media (max-width: 374px) {
  .dashboard-container {
    padding: var(--spacing-sm) !important;
  }
  
  .welcome-icon {
    font-size: 3rem;
  }
}
</style>
