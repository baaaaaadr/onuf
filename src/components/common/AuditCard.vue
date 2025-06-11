<template>
  <v-card 
    class="audit-card"
    :class="cardClasses"
    rounded="lg"
    :elevation="hover ? 3 : 1"
    @click="handleClick"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <v-card-text class="pa-3">
      <!-- En-tête avec localisation et date -->
      <div class="audit-header mb-2">
        <div class="audit-main-info">
          <div class="audit-location">
            <v-icon size="small" color="primary" class="mr-1">mdi-map-marker</v-icon>
            <span class="text-body-2 font-weight-medium">{{ displayLocation }}</span>
          </div>
          <div class="audit-date text-caption text-secondary">
            {{ formattedDate }}
          </div>
        </div>
        <div class="audit-score-badge">
          <span 
            class="score-value text-h6 font-weight-bold"
            :style="{ color: getScoreColor(globalScore) }"
          >
            {{ globalScore.toFixed(1) }}
          </span>
        </div>
      </div>

      <!-- Commentaire si présent -->
      <div v-if="audit.comment" class="audit-comment mb-2">
        <p class="text-caption text-secondary mb-0">{{ audit.comment }}</p>
      </div>

      <!-- Indicateurs en bas -->
      <div class="audit-footer">
        <div class="audit-indicators">
          <!-- Photos -->
          <v-icon 
            v-if="photosCount > 0"
            size="small"
            color="info"
            class="mr-3"
          >
            mdi-camera
          </v-icon>

          <!-- Commercial/rue si disponible -->
          <span v-if="displayCommerce" class="text-caption text-secondary mr-3">
            {{ displayCommerce }}
          </span>

          <!-- Statut sync -->
          <v-icon
            size="small"
            :color="syncStatus.color"
          >
            {{ syncStatus.icon }}
          </v-icon>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  audit: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'view', 'share', 'delete'])

const hover = ref(false)

// Classes dynamiques
const cardClasses = computed(() => ({
  'audit-card--selected': props.selected,
  'audit-card--synced': props.audit.synced,
  'audit-card--pending': !props.audit.synced && props.audit.source === 'local'
}))

// Localisation formatée
const displayLocation = computed(() => {
  if (props.audit.address) return props.audit.address
  if (props.audit.location_text) return props.audit.location_text
  if (props.audit.latitude && props.audit.longitude) {
    return `${props.audit.latitude.toFixed(4)}, ${props.audit.longitude.toFixed(4)}`
  }
  return 'Position inconnue'
})

// Commerce ou rue proche
const displayCommerce = computed(() => {
  // Si on a un nom de commerce ou de rue stocké
  if (props.audit.nearby_commerce) return props.audit.nearby_commerce
  if (props.audit.street_name) return props.audit.street_name
  return null
})

// Date formatée
const formattedDate = computed(() => {
  const date = new Date(props.audit.created_at || props.audit.timestamp)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Items de score avec emojis
const scoreItems = computed(() => [
  { 
    key: 'lighting', 
    emoji: '💡', 
    value: props.audit.lighting || 0,
    color: getScoreColor(props.audit.lighting || 0)
  },
  { 
    key: 'walkpath', 
    emoji: '🚶', 
    value: props.audit.walkpath || 0,
    color: getScoreColor(props.audit.walkpath || 0)
  },
  { 
    key: 'feeling', 
    emoji: '😊', 
    value: props.audit.feeling || 0,
    color: getScoreColor(props.audit.feeling || 0)
  }
])

// Score global
const globalScore = computed(() => {
  const scores = [
    props.audit.lighting,
    props.audit.walkpath,
    props.audit.openness,
    props.audit.feeling,
    props.audit.people_presence || props.audit.peoplePresence,
    props.audit.cleanliness
  ].filter(score => score > 0)
  
  if (scores.length === 0) return 0
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
})

// Nombre de photos
const photosCount = computed(() => {
  if (props.audit.photos?.length > 0) return props.audit.photos.length
  if (props.audit.audit_photos?.length > 0) return props.audit.audit_photos.length
  return props.audit.total_photos || 0
})

// Statut de synchronisation
const syncStatus = computed(() => {
  if (props.audit.synced || props.audit.source === 'cloud') {
    return { color: 'success', icon: 'mdi-cloud-check', text: 'Sync' }
  }
  if (props.audit.sync_error) {
    return { color: 'error', icon: 'mdi-cloud-alert', text: 'Erreur' }
  }
  return { color: 'warning', icon: 'mdi-cloud-clock', text: 'Local' }
})

// Couleur selon le score (1-4)
function getScoreColor(score) {
  if (!score || score <= 0) return '#9E9E9E'
  if (score <= 1) return '#F44336'
  if (score <= 2) return '#FF9800'
  if (score <= 3) return '#2196F3'
  return '#4CAF50'
}

// Gestion du clic
const handleClick = () => {
  emit('click', props.audit)
}
</script>

<style scoped>
.audit-card {
  transition: all var(--transition-normal);
  cursor: pointer;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.audit-card:hover {
  transform: translateY(-2px);
}

.audit-card--selected {
  border: 2px solid var(--onuf-primary);
}

.audit-card--pending {
  position: relative;
}

.audit-card--pending::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: var(--onuf-warning);
}

/* En-tête */
.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.audit-main-info {
  flex: 1;
  min-width: 0;
}

.audit-location {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.audit-location span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audit-score-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--onuf-surface-light);
}

/* Commentaire */
.audit-comment {
  padding: 8px 0;
  border-top: 1px solid var(--onuf-border-light);
  border-bottom: 1px solid var(--onuf-border-light);
}

.audit-comment p {
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Footer */
.audit-footer {
  display: flex;
  align-items: center;
  padding-top: 8px;
}

.audit-indicators {
  display: flex;
  align-items: center;
  flex: 1;
}

/* Responsive */
@media (max-width: 374px) {
  .scores-container {
    gap: var(--spacing-md);
  }
  
  .audit-footer {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
    text-align: center;
  }
  
  .audit-actions {
    justify-content: center;
  }
}

/* Animations */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.audit-card--pending::after {
  animation: pulse 2s ease-in-out infinite;
}

/* Accessibilité */
.audit-card:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: 2px;
}
</style>
