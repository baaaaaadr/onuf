<template>
  <v-card class="audit-section mb-6" elevation="2">
    <v-card-title class="d-flex align-center bg-grey-lighten-4">
      <span class="text-h6">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <p class="text-body-2 text-grey-darken-1 mb-4">{{ description }}</p>
      
      <!-- Choix avec boutons circulaires et emojis -->
      <div class="d-flex justify-space-around flex-wrap choice-container-wrapper">
        <div
          v-for="option in options"
          :key="option.value"
          class="text-center choice-container"
          @click="selectOption(option.value)"
        >
          <!-- Bouton principal avec emoji et couleur progressive -->
          <v-btn
            :color="isSelected(option.value) ? option.color : 'grey-lighten-2'"
            :variant="isSelected(option.value) ? 'elevated' : 'tonal'"
            icon
            size="large"
            class="mb-2 choice-btn"
            :class="{ 'selected': isSelected(option.value) }"
          >
            <span class="text-h5">{{ option.emoji }}</span>
          </v-btn>
          
          <!-- Label avec icône Material Design -->
          <div class="d-flex flex-column align-center">
            <v-icon 
              :color="isSelected(option.value) ? option.color : 'grey'" 
              size="small" 
              class="mb-1"
            >
              {{ option.icon }}
            </v-icon>
            <span 
              class="text-caption choice-label"
              :class="{ 
                'font-weight-bold': isSelected(option.value),
                'text-grey': !isSelected(option.value)
              }"
            >
              {{ option.text }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Indicateur de sélection -->
      <div v-if="modelValue !== null" class="mt-4 text-center">
        <v-chip 
          :color="getSelectedOption()?.color || 'grey'" 
          size="small"
          variant="tonal"
        >
          <v-icon start size="small">mdi-check</v-icon>
          {{ getSelectedOption()?.emoji }} {{ getSelectedOption()?.text }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  description: String,
  modelValue: [String, Number, null],
  options: Array,
});

const emit = defineEmits(['update:modelValue']);

const isSelected = (value) => {
  return props.modelValue === value;
};

const selectOption = (value) => {
  const option = props.options.find(opt => opt.value === value);
  const optionText = option ? `${option.emoji} ${option.text}` : value;
  
  // Émettre l'événement vers le parent
  emit('update:modelValue', value);
  
  // Ajouter au log global si disponible
  if (window.addUserAction) {
    window.addUserAction(`🎯 Sélection "${props.title}": ${optionText}`);
  }
};

const getSelectedOption = () => {
  return props.options.find(option => option.value === props.modelValue);
};
</script>

<style scoped>
.audit-section {
  transition: all 0.3s ease;
}

.audit-section:hover {
  transform: translateY(-2px);
}

.choice-container-wrapper {
  gap: 8px;
  padding: 0 8px;
}

.choice-container {
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 8px;
  border-radius: 12px;
  flex: 1;
  min-width: 65px;
  max-width: 85px;
}

.choice-container:hover {
  transform: scale(1.05);
  background-color: rgba(0, 0, 0, 0.04);
}

.choice-btn {
  transition: all 0.3s ease !important;
  width: 60px !important;
  height: 60px !important;
}

.choice-btn.selected {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.choice-btn .text-h5 {
  font-size: 1.5rem !important;
}

.choice-label {
  word-break: break-word;
  text-align: center;
  line-height: 1.2;
  font-size: 0.75rem !important;
}

/* Responsive pour très petits écrans */
@media (max-width: 360px) {
  .choice-container {
    min-width: 60px;
    max-width: 75px;
    padding: 4px;
  }
  
  .choice-btn {
    width: 50px !important;
    height: 50px !important;
  }
  
  .choice-btn .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .choice-label {
    font-size: 0.65rem !important;
  }
}

/* Animation pour le feedback visuel */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.choice-btn.selected {
  animation: pulse 0.3s ease-in-out;
}
</style>
