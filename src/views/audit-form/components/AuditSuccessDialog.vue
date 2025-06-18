<template>
  <v-dialog v-model="show" max-width="400">
    <v-card class="text-center pa-4">
      <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
      <v-card-title class="text-h5 mb-2">🎉 Audit Terminé !</v-card-title>
      <v-card-text class="text-body-1">
        Merci pour votre contribution à la sécurité urbaine.
        <br>
        Vos données ont été sauvegardées{{ isOnline ? ' et synchronisées' : ' localement' }}.
      </v-card-text>
      <v-card-actions class="justify-center flex-column gap-2">
        <!-- Boutons améliorés -->
        <v-btn 
          color="primary" 
          @click="$emit('new-audit')"
          size="large"
          variant="elevated"
        >
          <v-icon start>mdi-plus</v-icon>
          Nouvel audit
        </v-btn>
        
        <div class="d-flex gap-2">
          <v-btn 
            color="secondary" 
            @click="$emit('go-history')"
            variant="outlined"
          >
            <v-icon start>mdi-history</v-icon>
            Mes audits
          </v-btn>
          
          <v-btn 
            color="grey" 
            @click="$emit('go-home')"
            variant="outlined"
          >
            <v-icon start>mdi-home</v-icon>
            Accueil
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: Boolean,
  isOnline: Boolean
})

// Emit
const emit = defineEmits(['update:modelValue', 'new-audit', 'go-history', 'go-home'])

// v-model pour le dialog
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
.v-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
