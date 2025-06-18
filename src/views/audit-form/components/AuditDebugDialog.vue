<template>
  <v-dialog v-model="show" max-width="600">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>🐛 Mode Debug</span>
        <v-btn icon="mdi-close" @click="show = false" size="small"></v-btn>
      </v-card-title>
      
      <v-card-text>
        <!-- Test Data Section -->
        <v-card class="mb-4" elevation="0">
          <v-card-title class="text-h6">
            Remplir avec des données de test
          </v-card-title>
          <v-card-text>
            <v-btn 
              color="primary" 
              @click="$emit('fill-test-data')"
              prepend-icon="mdi-test-tube"
            >
              Remplir le formulaire
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Current Form Data -->
        <v-card elevation="0">
          <v-card-title class="text-h6">
            Données actuelles du formulaire
          </v-card-title>
          <v-card-text>
            <pre class="debug-pre">{{ JSON.stringify(formData, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="show = false" color="primary">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: Boolean,
  formData: {
    type: Object,
    required: true
  },
  questions: {
    type: Array,
    default: () => []
  },
  locations: {
    type: Array,
    default: () => []
  }
})

// Emit
const emit = defineEmits(['update:modelValue', 'fill-test-data'])

// v-model pour le dialog
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
.debug-pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}
</style>
