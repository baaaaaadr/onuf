<template>
  <label 
    class="option-card"
    :class="optionClasses"
    @click="handleSelect"
    @keydown.enter="handleSelect"
    @keydown.space="handleSelect"
    tabindex="0"
    role="radio"
    :aria-checked="isSelected"
    :aria-describedby="option.description ? `${optionId}-desc` : undefined"
  >
    <!-- Input radio caché -->
    <input 
      type="radio" 
      :value="option.value"
      :checked="isSelected"
      :name="name"
      class="option-input"
      tabindex="-1"
    >
    
    <!-- Contenu principal -->
    <div class="option-content">
      <!-- Emoji/Icône -->
      <div class="option-visual">
        <span v-if="option.emoji" class="option-emoji">
          {{ option.emoji }}
        </span>
        <v-icon 
          v-else-if="option.icon" 
          :color="iconColor"
          :size="iconSize"
        >
          {{ option.icon }}
        </v-icon>
        <div v-else class="option-placeholder"></div>
      </div>
      
      <!-- Texte -->
      <div class="option-text">
        <div class="option-label">
          {{ option.text || option.label }}
        </div>
        <div 
          v-if="option.description" 
          class="option-description"
          :id="`${optionId}-desc`"
        >
          {{ option.description }}
        </div>
      </div>
      
      <!-- Badge optionnel -->
      <div v-if="option.badge" class="option-badge">
        <v-chip 
          size="x-small" 
          :color="option.badgeColor || 'info'"
          variant="tonal"
        >
          {{ option.badge }}
        </v-chip>
      </div>
    </div>
    
    <!-- Indicateur de sélection -->
    <div class="option-indicator">
      <v-icon 
        v-if="isSelected"
        color="primary"
        size="20"
      >
        mdi-check-circle
      </v-icon>
      <div v-else class="option-radio"></div>
    </div>
    
    <!-- Overlay de sélection -->
    <div v-if="isSelected" class="option-overlay"></div>
  </label>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  // Option data
  option: {
    type: Object,
    required: true,
    validator: (option) => {
      return option && (option.text || option.label) && option.value !== undefined
    }
  },
  
  // État de sélection
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  
  // Props communes
  name: {
    type: String,
    default: 'option'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'card'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

// ID unique pour l'accessibilité
const optionId = computed(() => 
  `option-${props.name}-${props.option.value}`.replace(/[^a-zA-Z0-9-]/g, '-')
)

// État de sélection
const isSelected = computed(() => 
  props.modelValue === props.option.value
)

// Classes CSS dynamiques
const optionClasses = computed(() => [
  `option-card--${props.size}`,
  `option-card--${props.variant}`,
  {
    'option-card--selected': isSelected.value,
    'option-card--disabled': props.disabled,
    'option-card--readonly': props.readonly,
    'option-card--with-description': !!props.option.description
  }
])

// Couleur de l'icône
const iconColor = computed(() => {
  if (props.disabled) return 'grey'
  if (isSelected.value) return 'primary'
  return 'grey-darken-1'
})

// Taille de l'icône
const iconSize = computed(() => {
  const sizes = {
    small: 20,
    medium: 24,
    large: 28
  }
  return sizes[props.size] || 24
})

// Gestion de la sélection
const handleSelect = () => {
  if (props.disabled || props.readonly) return
  
  emit('update:modelValue', props.option.value)
  emit('select', props.option)
}
</script>

<style scoped>
.option-card {
  display: block;
  position: relative;
  border: 2px solid var(--onuf-surface-variant);
  border-radius: var(--radius-md);
  background: var(--onuf-background);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  overflow: hidden;
}

/* Input caché */
.option-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Contenu principal */
.option-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  position: relative;
  z-index: 1;
}

/* Visuel (emoji/icône) */
.option-visual {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.option-emoji {
  font-size: 24px;
  line-height: 1;
}

.option-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--onuf-surface-variant);
  opacity: 0.5;
}

/* Texte */
.option-text {
  flex: 1;
  min-width: 0;
}

.option-label {
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--onuf-text-primary);
  line-height: 1.4;
}

.option-description {
  font-size: 12px;
  color: var(--onuf-text-secondary);
  line-height: 1.3;
  margin-top: 2px;
}

/* Badge */
.option-badge {
  flex-shrink: 0;
}

/* Indicateur de sélection */
.option-indicator {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.option-radio {
  width: 16px;
  height: 16px;
  border: 2px solid var(--onuf-surface-variant);
  border-radius: 50%;
  transition: all var(--transition-fast);
}

/* Overlay de sélection */
.option-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(243, 195, 72, 0.05);
  pointer-events: none;
  z-index: 0;
}

/* Variants de taille */
.option-card--small .option-content {
  padding: var(--spacing-sm) var(--spacing-md);
  gap: var(--spacing-sm);
}

.option-card--small .option-visual {
  width: 32px;
  height: 32px;
}

.option-card--small .option-emoji {
  font-size: 20px;
}

.option-card--small .option-label {
  font-size: 13px;
}

.option-card--large .option-content {
  padding: var(--spacing-lg);
  gap: var(--spacing-lg);
}

.option-card--large .option-visual {
  width: 48px;
  height: 48px;
}

.option-card--large .option-emoji {
  font-size: 28px;
}

.option-card--large .option-label {
  font-size: 16px;
}

/* Variants de style */
.option-card--compact .option-content {
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);
}

.option-card--card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* États */
.option-card:hover:not(.option-card--disabled):not(.option-card--readonly) {
  border-color: rgba(243, 195, 72, 0.5);
  background: rgba(243, 195, 72, 0.02);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.option-card:active:not(.option-card--disabled):not(.option-card--readonly) {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}

.option-card--selected {
  border-color: var(--onuf-primary) !important;
  background: rgba(243, 195, 72, 0.05) !important;
  box-shadow: 0 0 0 1px rgba(243, 195, 72, 0.2) !important;
}

.option-card--selected .option-radio {
  border-color: var(--onuf-primary);
  background: var(--onuf-primary);
}

.option-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.option-card--readonly {
  cursor: default;
}

.option-card--readonly:hover {
  transform: none !important;
  box-shadow: none !important;
  border-color: var(--onuf-surface-variant) !important;
}

/* Focus */
.option-card:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: 2px;
}

/* Avec description */
.option-card--with-description .option-visual {
  align-self: flex-start;
  margin-top: 2px;
}

/* Responsive */
@media (max-width: 374px) {
  .option-content {
    gap: var(--spacing-sm) !important;
  }
  
  .option-label {
    font-size: 13px !important;
  }
  
  .option-description {
    font-size: 11px !important;
  }
}

/* Animation d'apparition */
.option-card {
  animation: optionAppear 0.3s ease-out;
}

@keyframes optionAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
