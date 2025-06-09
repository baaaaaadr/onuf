<template>
  <v-card 
    class="audit-card"
    :class="cardClasses"
    rounded="lg"
    :elevation="hover ? 3 : 1"
    @click="handleClick"
  >
    <v-card-text class="pa-4">
      <!-- En-tête avec localisation et date -->
      <div class="audit-header mb-3">
        <div class="audit-location">
          <v-icon size="small" color="primary" class="mr-1">mdi-map-marker</v-icon>
          <span class="text-body-2 font-weight-medium">{{ displayLocation }}</span>
        </div>
        <div class="audit-date text-caption text-secondary">
          {{ formattedDate }}
        </div>
      </div>

      <!-- Scores visuels -->
      <div class="scores-container mb-3">
        <div 
          v-for="score in scoreItems" 
          :key="score.key"
          class="score-item"
        >
          <span class="score-emoji">{{ score.emoji }}</span>
          <div class="score-dots">
            <span 
              v-for="n in 4" 
              :key="n"
              class="score-dot"
              :class="{ 'active': n <= score.value }"
              :style="{ backgroundColor: n <= score.value ? score.color : '#E0E0E0' }"
            />
          </div>
        </div>
      </div>

      <!-- Score global et métadonnées -->
      <div class="audit-footer">
        <div class="global-score">
          <span class="score-label text-caption">Score</span>
          <span 
            class="score-value text-h6 font-weight-bold"
            :style="{ color: getScoreColor(globalScore) }"
          >
            {{ globalScore.toFixed(1) }}
          </span>
        </div>

        <!-- Indicateurs -->
        <div class="audit-indicators">
          <!-- Photos -->
          <v-chip 
            v-if="photosCount > 0"
            size="x-small"
            variant="tonal"
            color="info"
            class="mr-1"
          >
            <v-icon start size="x-small">mdi-camera</v-icon>
            {{ photosCount }}
          </v-chip>

          <!-- Statut sync -->
          <v-chip
            size="x-small"
            :color="syncStatus.color"
            variant="tonal"
          >
            <v-icon start size="x-small">{{ syncStatus.icon }}</v-icon>
            {{ syncStatus.text }}
          </v-chip>
        </div>

        <!-- Actions -->
        <div class="audit-actions">
          <v-btn
            icon="mdi-eye"
            size="x-small"
            variant="text"
            @click.stop="$emit('view', audit)"
          />
          <v-btn
            icon="mdi-share"
            size="x-small"
            variant="text"
            @click.stop="$emit('share', audit)"
          />
          <v-btn
            icon="mdi-delete"
            size="x-small"
            variant="text"
            color="error"
            @click.stop="$emit('delete', audit)"
          />
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
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.audit-location {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.audit-location span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scores */
.scores-container {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.score-emoji {
  font-size: 1.2rem;
}

.score-dots {
  display: flex;
  gap: 4px;
}

.score-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.score-dot.active {
  transform: scale(1.2);
}

/* Footer */
.audit-footer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-md);
}

.global-score {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  color: var(--onuf-text-secondary);
}

.audit-indicators {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: center;
}

.audit-actions {
  display: flex;
  gap: var(--spacing-xs);
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
