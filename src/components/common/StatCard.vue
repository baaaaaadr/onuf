<template>
  <v-card 
    class="stat-card" 
    :color="cardColor"
    :class="cardClasses"
    flat
    @click="handleClick"
  >
    <v-card-text class="stat-content">
      <!-- Icône optionnelle -->
      <div v-if="icon" class="stat-icon mb-2">
        <v-icon :color="iconColor" :size="iconSize">{{ icon }}</v-icon>
      </div>
      
      <!-- Label/Titre -->
      <div class="stat-label text-body-2 mb-2">
        {{ label }}
      </div>
      
      <!-- Valeur principale -->
      <div class="stat-value text-h4 font-weight-bold mb-1">
        {{ displayValue }}
      </div>
      
      <!-- Sous-titre optionnel -->
      <div v-if="subtitle" class="stat-subtitle text-caption">
        {{ subtitle }}
      </div>
      
      <!-- Badge/Chip optionnel -->
      <div v-if="badge" class="stat-badge mt-2">
        <v-chip 
          :color="badgeColor" 
          size="small" 
          variant="tonal"
        >
          {{ badge }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Contenu principal
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  
  // Apparence
  color: {
    type: String,
    default: 'surface'
  },
  variant: {
    type: String,
    default: 'elevated',
    validator: (value) => ['flat', 'elevated', 'tonal', 'outlined'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Icône
  icon: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  
  // Badge
  badge: {
    type: String,
    default: ''
  },
  badgeColor: {
    type: String,
    default: 'success'
  },
  
  // Interaction
  clickable: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Valeur d'affichage formatée
const displayValue = computed(() => {
  if (props.loading) return '...'
  if (typeof props.value === 'number') {
    // Formatage des nombres avec séparateurs
    return props.value.toLocaleString('fr-FR')
  }
  return props.value
})

// Couleur de la card
const cardColor = computed(() => {
  if (props.variant === 'tonal') return props.color
  return 'surface'
})

// Classes CSS dynamiques
const cardClasses = computed(() => [
  `stat-card--${props.size}`,
  `stat-card--${props.variant}`,
  {
    'stat-card--clickable': props.clickable,
    'stat-card--loading': props.loading
  }
])

// Taille de l'icône selon la taille de la card
const iconSize = computed(() => {
  const sizes = {
    small: 20,
    medium: 24,
    large: 32
  }
  return sizes[props.size] || 24
})

// Gestion du clic
const handleClick = () => {
  if (props.clickable && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: var(--radius-lg) !important;
  text-align: center;
  transition: all var(--transition-normal);
  overflow: hidden;
  background-color: var(--onuf-surface, #F5F3F0) !important; /* ✅ FIX */
  color: var(--onuf-text-primary, #181611) !important; /* ✅ FIX */
}

/* Variants */
.stat-card--flat {
  box-shadow: none !important;
}

.stat-card--elevated {
  box-shadow: var(--shadow-md) !important;
}

.stat-card--outlined {
  border: 1px solid var(--onuf-surface-variant) !important;
  box-shadow: none !important;
}

.stat-card--tonal {
  background: rgba(243, 195, 72, 0.08) !important;
}

/* Tailles */
.stat-card--small {
  min-height: 100px;
}

.stat-card--small .stat-content {
  padding: var(--spacing-md) !important;
}

.stat-card--small .stat-value {
  font-size: 1.5rem !important;
}

.stat-card--medium {
  min-height: 120px;
}

.stat-card--medium .stat-content {
  padding: var(--spacing-lg) !important;
}

.stat-card--large {
  min-height: 160px;
}

.stat-card--large .stat-content {
  padding: var(--spacing-xl) !important;
}

.stat-card--large .stat-value {
  font-size: 2.5rem !important;
}

/* États interactifs */
.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg) !important;
}

.stat-card--clickable:active {
  transform: translateY(0);
}

.stat-card--loading {
  opacity: 0.7;
  pointer-events: none;
}

.stat-card--loading .stat-value {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Contenu */
.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.stat-icon {
  opacity: 0.8;
}

.stat-label {
  color: var(--onuf-text-secondary, #837B67) !important; /* ✅ FIX */
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.stat-value {
  color: var(--onuf-text-primary, #181611) !important; /* ✅ FIX */
  line-height: 1.2;
  font-weight: var(--font-weight-bold) !important;
}

.stat-subtitle {
  color: var(--onuf-text-secondary, #837B67) !important; /* ✅ FIX */
  opacity: 1 !important; /* ✅ FIX: Augmenter l'opacité */
}

.stat-badge {
  margin-top: var(--spacing-sm);
}

/* Animation de pulsation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 374px) {
  .stat-card--medium {
    min-height: 100px;
  }
  
  .stat-card--large {
    min-height: 140px;
  }
  
  .stat-card--large .stat-value {
    font-size: 2rem !important;
  }
}
</style>
