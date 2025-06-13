<template>
  <div class="audit-section-modern mb-6">
    <!-- En-tête de section -->
    <div class="section-header mb-4">
      <h3 class="section-title text-h6 font-weight-semibold">
        {{ title }}
      </h3>
      <p class="section-description text-body-2 text-secondary mt-1">
        {{ description }}
      </p>
    </div>

    <!-- Grille d'options avec OptionCard -->
    <div class="options-grid">
      <OptionCard
        v-for="option in options"
        :key="option.value"
        :option="option"
        :modelValue="modelValue"
        @update:modelValue="selectOption"
      />
    </div>

    <!-- Feedback de sélection -->
    <transition name="fade-slide">
      <div v-if="modelValue !== null" class="selection-feedback mt-4">
        <v-chip
          :color="getSelectedOption?.color || 'primary'"
          variant="tonal"
          size="small"
          class="selection-chip"
        >
          <v-icon start size="small">mdi-check-circle</v-icon>
          <span>{{ getSelectedOption?.emoji }} {{ getSelectedOption?.text }}</span>
        </v-chip>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OptionCard from '@/components/common/OptionCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(opt => 
        opt.hasOwnProperty('value') && 
        opt.hasOwnProperty('text') && 
        opt.hasOwnProperty('emoji')
      )
    }
  }
})

const emit = defineEmits(['update:modelValue'])

// Sélectionner une option
const selectOption = (value) => {
  const option = props.options.find(opt => opt.value === value)
  const optionText = option ? `${option.emoji} ${option.text}` : value
  
  // Émettre l'événement
  emit('update:modelValue', value)
  
  // Feedback haptique seulement pour les options non-SVG
  if (window.navigator?.vibrate && !option?.svgPath) {
    window.navigator.vibrate(10)
  }
  
  // Log global si disponible
  if (window.addUserAction) {
    if (value === null) {
      window.addUserAction(`🗙️ Désélection "${props.title}"`)
    } else {
      window.addUserAction(`🎯 Sélection "${props.title}": ${optionText}`)
    }
  }
  
  // Sauvegarder le progrès si disponible
  if (window.saveProgress) {
    window.saveProgress()
  }
}

// Obtenir l'option sélectionnée
const getSelectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})
</script>

<style scoped>
.audit-section-modern {
  /* Pas de carte englobante pour un design plus aéré */
}

/* En-tête de section */
.section-header {
  padding: 0 var(--spacing-xs);
}

.section-title {
  color: var(--onuf-text-primary);
  line-height: 1.3;
}

.section-description {
  color: var(--onuf-text-secondary);
  line-height: 1.5;
}

/* Grille d'options */
.options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  padding: 0;
  margin: 0 auto;
  max-width: 500px;
}

/* Feedback de sélection */
.selection-feedback {
  text-align: center;
  padding: 0 var(--spacing-xs);
}

.selection-chip {
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.25px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all var(--transition-normal);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 380px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
}

@media (min-width: 381px) and (max-width: 580px) {
  .options-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
  }
}

@media (min-width: 581px) {
  .options-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 500px;
    gap: var(--spacing-md);
  }
}

/* Mode sombre (préparation) */
@media (prefers-color-scheme: dark) {
  .section-title {
    color: var(--onuf-text-primary-dark, #FFFFFF);
  }
  
  .section-description {
    color: var(--onuf-text-secondary-dark, #B0B0B0);
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}
</style>
