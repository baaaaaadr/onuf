<template>
  <label 
    class="option-card"
    :class="optionClasses"
    :style="svgBorderColor ? { 
      '--svg-border-color': svgBorderColor,
      '--svg-shadow-color': svgBorderColor + '40'
    } : {}"
    @click="handleSelect($event)"
    @keydown.enter="handleSelect($event)"
    @keydown.space="handleSelect($event)"
    tabindex="0"
    role="radio"
    :aria-checked="isSelected"
    :aria-describedby="option.description ? `${optionId}-desc` : undefined"
  >
    <!-- Input radio caché (seulement si pas SVG) -->
    <input 
      v-if="!option.svgPath"
      type="radio" 
      :value="option.value"
      :checked="isSelected"
      :name="name"
      class="option-input"
      tabindex="-1"
    >
    
    <!-- Contenu principal -->
    <div class="option-content">
      <!-- SVG/Emoji/Icône -->
      <div class="option-visual">
        <!-- SVG personnalisé (mode épuré) -->
        <div 
          v-if="option.svgPath" 
          class="option-svg option-svg--clean"
          :class="{ 'option-svg--selected': isSelected }"
        >
          <img 
            :src="option.svgPath" 
            :alt="option.text || option.label"
            class="svg-icon"
          />
        </div>
        
        <!-- Mode classique avec texte pour autres options -->
        <template v-else>
          <!-- Emoji -->
          <span v-if="option.emoji" class="option-emoji">
            {{ option.emoji }}
          </span>
          
          <!-- Icône Vuetify -->
          <v-icon 
            v-else-if="option.icon" 
            :color="iconColor"
            :size="iconSize"
          >
            {{ option.icon }}
          </v-icon>
          
          <div v-else class="option-placeholder"></div>
        </template>
      </div>
      
      <!-- Texte (seulement si pas SVG) -->
      <div v-if="!option.svgPath" class="option-text">
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
      
      <!-- Badge optionnel (seulement si pas SVG) -->
      <div v-if="option.badge && !option.svgPath" class="option-badge">
        <v-chip 
          size="x-small" 
          :color="option.badgeColor || 'info'"
          variant="tonal"
        >
          {{ option.badge }}
        </v-chip>
      </div>
    </div>
    
    <!-- Indicateur de sélection (seulement si pas SVG) -->
    <div v-if="!option.svgPath" class="option-indicator">
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
    'option-card--with-description': !!props.option.description,
    'option-card--svg-clean': !!props.option.svgPath // Pour compatibilité CSS
  }
])

// Couleur de l'icône
const iconColor = computed(() => {
  if (props.disabled) return 'grey'
  if (isSelected.value) return 'primary'
  return 'grey-darken-1'
})

// Couleur de cadre selon la valeur pour SVG
const svgBorderColor = computed(() => {
  if (!props.option.svgPath || !isSelected.value) return null
  
  const value = props.option.value
  if (value === 1) return '#f44336' // Rouge (très mauvais)
  if (value === 2) return '#ff9800' // Orange (mauvais)
  if (value === 3) return '#fdd835' // Jaune (correct)
  if (value === 4) return '#4caf50' // Vert (excellent)
  return null
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

// Gestion de la sélection/désélection
const handleSelect = (event) => {
  if (props.disabled || props.readonly) return
  
  // Prévenir la propagation double
  event?.preventDefault()
  event?.stopPropagation()
  
  // Désélection si déjà sélectionné (seulement pour SVG)
  const newValue = (isSelected.value && props.option.svgPath) ? null : props.option.value
  
  emit('update:modelValue', newValue)
  emit('select', props.option)
  
  // Feedback haptique amélioré pour SVG (seulement ici, pas dans AuditSectionModern)
  if (window.navigator?.vibrate) {
    if (props.option.svgPath) {
      if (newValue === null) {
        // Vibration courte pour désélection
        window.navigator.vibrate(5)
      } else {
        // Vibration plus longue pour sélection
        window.navigator.vibrate([15, 10, 15])
      }
    } else {
      // Vibration standard pour les autres
      window.navigator.vibrate(10)
    }
  }
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
  height: 100%;
  width: 100%;
  min-width: 65px;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 70px;
}

/* Mode épuré - plus de padding pour SVG uniquement */
.option-card:has(.option-svg--clean) .option-content,
.option-card.option-card--svg-clean .option-content {
  min-height: 80px;
  padding: var(--spacing-md);
}

/* Visuel (emoji/icône) */
.option-visual {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  margin-bottom: 4px;
}

.option-emoji {
  font-size: 24px;
  line-height: 1;
}

/* Styles pour les SVG */
.option-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transition: all var(--transition-fast);
}

/* Mode épuré pour SVG (sans texte) */
.option-svg--clean {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-icon {
  width: 90%;
  height: 90%;
  object-fit: contain;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Animation SVG lorsque sélectionné - SANS glow pour éviter confusion éclairage */
.option-svg--selected .svg-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15)) contrast(1.1) saturate(1.2);
}

/* Animation au tap/touch pour mobile */
.option-card:active .option-svg--clean .svg-icon {
  transform: scale(0.95);
  transition: all 0.1s ease;
}

.option-card:active .option-svg--selected .svg-icon {
  transform: scale(1.05);
  transition: all 0.1s ease;
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
  word-break: normal;
  white-space: normal;
  overflow-wrap: break-word;
  text-overflow: unset;
  display: block;
  width: 100%;
  text-align: center;
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
  position: absolute;
  top: 8px;
  right: 8px;
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
  padding: var(--spacing-xs);
  gap: var(--spacing-xs);
  min-height: 60px;
}

.option-card--small .option-visual {
  margin-bottom: 2px;
}

.option-card--small .option-emoji {
  font-size: 20px;
}

.option-card--small .option-svg {
  width: 28px;
  height: 28px;
}

.option-card--small .option-svg--clean {
  width: 50px;
  height: 50px;
}

.option-card--small .option-label {
  font-size: 12px;
  font-weight: normal;
}

.option-card--large .option-content {
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
  min-height: 90px;
}

.option-card--large .option-visual {
  margin-bottom: 6px;
}

.option-card--large .option-emoji {
  font-size: 28px;
}

.option-card--large .option-svg {
  width: 44px;
  height: 44px;
}

.option-card--large .option-svg--clean {
  width: 70px;
  height: 70px;
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

/* États - Pas de hover pour mobile */

.option-card:active:not(.option-card--disabled):not(.option-card--readonly) {
  transform: scale(0.98);
  box-shadow: var(--shadow-sm);
}

.option-card--selected {
  border-color: var(--onuf-primary) !important;
  background: rgba(243, 195, 72, 0.05) !important;
  box-shadow: 0 0 0 2px rgba(243, 195, 72, 0.3) !important;
}

/* Sélection améliorée pour mode épuré SVG */
.option-card--selected:has(.option-svg--clean),
.option-card--selected.option-card--svg-clean {
  border-color: var(--svg-border-color, var(--onuf-primary)) !important;
  background: rgba(243, 195, 72, 0.08) !important;
  box-shadow: 0 0 0 3px var(--svg-shadow-color, rgba(243, 195, 72, 0.4)), 
              0 4px 12px var(--svg-shadow-color, rgba(243, 195, 72, 0.2)) !important;
  transform: translateY(-2px);
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
