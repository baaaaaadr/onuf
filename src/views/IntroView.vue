<template>
  <v-container class="fill-height d-flex flex-column justify-center align-center text-center">
    <v-icon size="120" color="primary" class="mb-6">mdi-shield-check-outline</v-icon>
    <h1 class="text-h3 mb-4 font-weight-bold">🏙️ Agadir Safety Audit</h1>
    <p class="text-h6 mb-8 text-grey-darken-1" style="max-width: 400px;">
      Contribuez à rendre notre ville plus sûre. 
      Cette application vous permet de signaler rapidement les aspects de sécurité urbaine.
    </p>
    
    <!-- Boutons principaux -->
    <div class="d-flex flex-column ga-3 mb-6">
      <v-btn 
        color="primary" 
        size="x-large" 
        to="/audit"
        rounded="lg"
        elevation="2"
        min-width="250"
      >
        🚀 Commencer un Audit
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      
      <v-btn 
        color="secondary" 
        size="large" 
        to="/history"
        rounded="lg"
        variant="tonal"
        min-width="250"
      >
        📈 Voir mes audits
        <v-icon end>mdi-history</v-icon>
      </v-btn>
    </div>
    
    <p class="text-caption text-grey">
      📱 Fonctionnement hors ligne • 📸 Photos • 📍 Géolocalisation
    </p>
    
    <!-- Avertissement géolocalisation -->
    <v-alert
      type="info"
      variant="tonal"
      class="mt-4 text-left"
      max-width="400"
    >
      <v-icon start>mdi-map-marker-check</v-icon>
      <strong>Géolocalisation requise</strong><br>
      L'application utilisera votre position pour contextualiser l'audit de sécurité.
      
      <v-expansion-panels class="mt-3" variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title class="text-caption">
            🎯 Comment améliorer la précision GPS ?
          </v-expansion-panel-title>
          <v-expansion-panel-text class="text-caption">
            <div class="mt-2">
              <p><strong>📱 Sur mobile :</strong></p>
              <ul class="text-left pl-4">
                <li>Activez "Haute précision" dans Localisation</li>
                <li>Autorisez l'accès GPS dans les paramètres</li>
                <li>Sortez à l'extérieur (pas sous un toit)</li>
                <li>Attendez 30-60 secondes pour la synchronisation GPS</li>
              </ul>
              <p class="mt-2"><strong>💻 Sur ordinateur :</strong></p>
              <ul class="text-left pl-4">
                <li>Utilisez Chrome/Firefox récent</li>
                <li>Cliquez "Autoriser" quand demandé</li>
                <li>La précision sera limitée (WiFi/IP)</li>
                <li>Préférez le mobile pour la précision</li>
              </ul>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-alert>
    
    <!-- Statistiques rapides -->
    <v-card 
      v-if="auditCount > 0" 
      class="mt-4" 
      color="green-lighten-5" 
      variant="tonal"
      max-width="300"
    >
      <v-card-text class="text-center py-3">
        <v-icon class="mb-2" color="success">mdi-check-circle</v-icon>
        <div class="text-body-2">
          <strong>{{ auditCount }}</strong> audit{{ auditCount > 1 ? 's' : '' }} réalisé{{ auditCount > 1 ? 's' : '' }}
        </div>
        <div class="text-caption text-grey">
          Merci pour votre contribution !
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const auditCount = ref(0);

// Charger le nombre d'audits sauvegardés
const loadAuditCount = () => {
  try {
    const saved = localStorage.getItem('safety_audits');
    if (saved) {
      const audits = JSON.parse(saved);
      auditCount.value = audits.length;
    }
  } catch (error) {
    console.error('Erreur chargement compteur audits:', error);
  }
};

onMounted(() => {
  loadAuditCount();
  
  // Mettre à jour le compteur quand on revient sur cette page
  window.addEventListener('focus', loadAuditCount);
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
