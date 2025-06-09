<template>
  <div class="empty-state" :class="emptyStateClasses">
    <!-- Illustration -->
    <div class="empty-illustration">
      <div v-if="illustration === 'custom'" class="empty-custom">
        <slot name="illustration"></slot>
      </div>
      <div v-else class="empty-icon">
        <v-icon 
          :size="iconSize" 
          :color="iconColor"
        >
          {{ getIllustrationIcon() }}
        </v-icon>
      </div>
    </div>
    
    <!-- Contenu principal -->
    <div class="empty-content">
      <!-- Titre -->
      <h3 class="empty-title">
        {{ title || getDefaultTitle() }}
      </h3>
      
      <!-- Description -->
      <p class="empty-description">
        {{ description || getDefaultDescription() }}
      </p>
      
      <!-- Actions -->
      <div v-if="showAction || $slots.actions" class="empty-actions">
        <slot name="actions">
          <v-btn
            v-if="showAction"
            :color="actionColor"
            :size="actionSize"
            :variant="actionVariant"
            :prepend-icon="actionIcon"
            @click="$emit('action')"
          >
            {{ actionText || getDefaultActionText() }}
          </v-btn>
        </slot>
      </div>
      
      <!-- Actions secondaires -->
      <div v-if="$slots.secondaryActions" class="empty-secondary-actions">
        <slot name="secondaryActions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Type d'état vide prédéfini
  type: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'no-data', 'no-audits', 'no-results', 'no-photos',
      'offline', 'error', 'loading', 'empty-search'
    ].includes(value)
  },
  
  // Contenu personnalisé
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  illustration: {
    type: String,
    default: 'auto',
    validator: (value) => ['auto', 'icon', 'emoji', 'custom', 'none'].includes(value)
  },
  
  // Action principale
  showAction: {
    type: Boolean,
    default: true
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionColor: {
    type: String,
    default: 'primary'
  },
  actionVariant: {
    type: String,
    default: 'elevated'
  },
  actionSize: {
    type: String,
    default: 'large'
  },
  
  // Apparence
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action'])

// Classes CSS dynamiques
const emptyStateClasses = computed(() => [
  `empty-state--${props.size}`,
  {
    'empty-state--compact': props.compact,
    'empty-state--no-illustration': props.illustration === 'none'
  }
])

// Taille de l'icône selon la taille du composant
const iconSize = computed(() => {
  const sizes = {
    small: 48,
    medium: 64,
    large: 80
  }
  return sizes[props.size] || 64
})

// Couleur de l'icône
const iconColor = computed(() => {
  switch (props.type) {
    case 'error':
      return 'error'
    case 'offline':
      return 'warning'
    case 'loading':
      return 'info'
    default:
      return 'grey-lighten-1'
  }
})

// Icône selon le type
const getIllustrationIcon = () => {
  const icons = {
    'default': 'mdi-inbox',
    'no-data': 'mdi-database-off',
    'no-audits': 'mdi-clipboard-text-off',
    'no-results': 'mdi-magnify-remove',
    'no-photos': 'mdi-image-off',
    'offline': 'mdi-wifi-off',
    'error': 'mdi-alert-circle',
    'loading': 'mdi-loading',
    'empty-search': 'mdi-file-search'
  }
  return icons[props.type] || 'mdi-inbox'
}

// Titre par défaut selon le type
const getDefaultTitle = () => {
  const titles = {
    'default': 'Aucun élément',
    'no-data': 'Aucune donnée',
    'no-audits': 'Aucun audit',
    'no-results': 'Aucun résultat',
    'no-photos': 'Aucune photo',
    'offline': 'Mode hors ligne',
    'error': 'Une erreur est survenue',
    'loading': 'Chargement...',
    'empty-search': 'Aucun résultat trouvé'
  }
  return titles[props.type] || 'Aucun élément'
}

// Description par défaut selon le type
const getDefaultDescription = () => {
  const descriptions = {
    'default': 'Il n\'y a rien à afficher pour le moment.',
    'no-data': 'Aucune donnée n\'est disponible actuellement.',
    'no-audits': 'Vous n\'avez pas encore réalisé d\'audit. Commencez votre premier audit dès maintenant !',
    'no-results': 'Votre recherche n\'a donné aucun résultat. Essayez avec d\'autres termes.',
    'no-photos': 'Aucune photo n\'a été prise pour cet audit.',
    'offline': 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.',
    'error': 'Quelque chose s\'est mal passé. Veuillez réessayer plus tard.',
    'loading': 'Veuillez patienter pendant le chargement des données.',
    'empty-search': 'Essayez de modifier vos critères de recherche ou filtres.'
  }
  return descriptions[props.type] || 'Il n\'y a rien à afficher pour le moment.'
}

// Texte d'action par défaut selon le type
const getDefaultActionText = () => {
  const actions = {
    'default': 'Commencer',
    'no-data': 'Actualiser',
    'no-audits': 'Créer un audit',
    'no-results': 'Effacer les filtres',
    'no-photos': 'Prendre une photo',
    'offline': 'Réessayer',
    'error': 'Réessayer',
    'loading': '',
    'empty-search': 'Effacer la recherche'
  }
  return actions[props.type] || 'Commencer'
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-2xl);
  min-height: 200px;
}

/* Tailles */
.empty-state--small {
  padding: var(--spacing-lg);
  min-height: 150px;
}

.empty-state--large {
  padding: var(--spacing-2xl) var(--spacing-xl);
  min-height: 300px;
}

.empty-state--compact {
  padding: var(--spacing-lg) var(--spacing-md);
  min-height: 120px;
}

/* Illustration */
.empty-illustration {
  margin-bottom: var(--spacing-lg);
  opacity: 0.7;
}

.empty-state--compact .empty-illustration {
  margin-bottom: var(--spacing-md);
}

.empty-state--no-illustration .empty-illustration {
  display: none;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: var(--onuf-surface);
  border-radius: 50%;
  transition: all var(--transition-normal);
}

.empty-state--small .empty-icon {
  width: 80px;
  height: 80px;
}

.empty-state--large .empty-icon {
  width: 140px;
  height: 140px;
}

.empty-state--compact .empty-icon {
  width: 60px;
  height: 60px;
}

/* Animation de l'icône de chargement */
.empty-icon .v-icon {
  animation: none;
}

.empty-state .empty-icon .mdi-loading {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Contenu */
.empty-content {
  max-width: 400px;
  width: 100%;
}

.empty-state--compact .empty-content {
  max-width: 300px;
}

/* Titre */
.empty-title {
  font-size: 1.25rem;
  font-weight: var(--font-weight-semibold);
  color: var(--onuf-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.3;
}

.empty-state--small .empty-title {
  font-size: 1.125rem;
}

.empty-state--large .empty-title {
  font-size: 1.5rem;
}

.empty-state--compact .empty-title {
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
}

/* Description */
.empty-description {
  font-size: 0.875rem;
  color: var(--onuf-text-secondary);
  line-height: 1.5;
  margin: 0 0 var(--spacing-xl) 0;
}

.empty-state--small .empty-description {
  font-size: 0.8125rem;
  margin-bottom: var(--spacing-lg);
}

.empty-state--large .empty-description {
  font-size: 1rem;
}

.empty-state--compact .empty-description {
  font-size: 0.75rem;
  margin-bottom: var(--spacing-md);
}

/* Actions */
.empty-actions {
  margin-bottom: var(--spacing-md);
}

.empty-state--compact .empty-actions {
  margin-bottom: var(--spacing-sm);
}

.empty-secondary-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
}

/* États spéciaux */
.empty-state[data-type="error"] .empty-icon {
  background: rgba(244, 67, 54, 0.1);
}

.empty-state[data-type="offline"] .empty-icon {
  background: rgba(255, 152, 0, 0.1);
}

.empty-state[data-type="loading"] .empty-icon {
  background: rgba(33, 150, 243, 0.1);
}

/* Animation d'apparition */
.empty-state {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 374px) {
  .empty-state {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .empty-title {
    font-size: 1.125rem !important;
  }
  
  .empty-description {
    font-size: 0.8125rem !important;
  }
  
  .empty-icon {
    width: 80px !important;
    height: 80px !important;
  }
}

/* Mode sombre (préparation) */
@media (prefers-color-scheme: dark) {
  .empty-icon {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
