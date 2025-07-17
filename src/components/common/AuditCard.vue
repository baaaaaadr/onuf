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
            <span class="text-body-2 font-weight-medium">
              {{ displayLocation }}
              <span v-if="displayPrecision" class="text-caption text-grey ml-1">
                {{ displayPrecision }}
              </span>
            </span>
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

      <!-- Section des scores visuels -->
      <div class="scores-visual mb-2">
        <div class="score-item" v-for="item in scoreItems" :key="item.key">
          <span class="score-emoji">{{ item.emoji }}</span>
          <div class="score-dots">
            <span 
              v-for="n in 4" 
              :key="n"
              class="score-dot"
              :class="{ 'score-dot--filled': n <= item.value }"
              :style="{ backgroundColor: n <= item.value ? item.color : '#E0E0E0' }"
            ></span>
          </div>
        </div>
      </div>

      <!-- Indicateurs en bas -->
      <div class="audit-footer">
        <div class="audit-indicators">
          <!-- Photos -->
          <v-chip 
            v-if="photosCount > 0"
            size="x-small"
            color="info"
            variant="tonal"
            class="mr-2"
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
        
        <!-- Menu actions -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              size="x-small"
              variant="text"
              v-bind="props"
              @click.stop
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          
          <v-list density="compact">
            <v-list-item @click.stop="emit('view', audit)">
              <template v-slot:prepend>
                <v-icon size="small">mdi-eye</v-icon>
              </template>
              <v-list-item-title>Voir détails</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click.stop="emit('share', audit)">
              <template v-slot:prepend>
                <v-icon size="small">mdi-share</v-icon>
              </template>
              <v-list-item-title>Partager</v-list-item-title>
            </v-list-item>
            
            <v-divider />
            
            <v-list-item @click.stop="emit('delete', audit)" class="text-error">
              <template v-slot:prepend>
                <v-icon size="small" color="error">mdi-delete</v-icon>
              </template>
              <v-list-item-title>Supprimer</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { reverseGeocode } from '@/services/geocoding.js'

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
const enrichedLocation = ref(null)
// ✅ NOUVEAU: Réactivité forcée pour les mises à jour de sync
const syncUpdateKey = ref(0)

// ✅ NOUVEAU: Écouter les événements de synchronisation
const handleAuditSynced = (event) => {
  const { localId, cloudId } = event.detail
  // Si cet audit est concerné, forcer la mise à jour
  if (props.audit.id === localId || props.audit.localId === localId || props.audit.id === cloudId) {
    console.log('✅ AuditCard: Synchronisation détectée pour cet audit', { localId, cloudId, auditId: props.audit.id })
    
    // ✅ NOUVEAU: Vérifier les nouvelles données dans localStorage
    try {
      const allLocalAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]')
      const updatedAudit = allLocalAudits.find(a => 
        a.id === cloudId || a.cloudId === cloudId || a.id === localId || a.localId === localId
      )
      
      if (updatedAudit) {
        console.log('✅ Données audit mises à jour détectées:', {
          synced: updatedAudit.synced,
          source: updatedAudit.source,
          cloudId: updatedAudit.cloudId
        })
      }
    } catch (error) {
      console.warn('⚠️ Erreur lecture localStorage pour audit sync:', error)
    }
    
    // Forcer la mise à jour de l'interface
    syncUpdateKey.value++
  }
}

// Enrichir l'audit avec le géocodage si nécessaire
onMounted(async () => {
  // Écouter les événements de synchronisation
  window.addEventListener('onuf-audit-synced', handleAuditSynced)
  
  // Si pas de nearby_info mais des coordonnées, faire le géocodage
  if ((!props.audit.nearby_info || props.audit.nearby_info === '') && 
      props.audit.latitude && props.audit.longitude &&
      props.audit.latitude !== 0 && props.audit.longitude !== 0) {
    try {
      const geocodeResult = await reverseGeocode(props.audit.latitude, props.audit.longitude)
      enrichedLocation.value = geocodeResult.displayName
    } catch (error) {
      console.warn('Géocodage échoué pour audit:', props.audit.id)
    }
  }
})

onUnmounted(() => {
  // Nettoyer les listeners
  window.removeEventListener('onuf-audit-synced', handleAuditSynced)
})

// Classes dynamiques
const cardClasses = computed(() => ({
  'audit-card--selected': props.selected,
  'audit-card--synced': props.audit.synced,
  'audit-card--pending': !props.audit.synced && props.audit.source === 'local'
}))

// Localisation formatée avec priorité à nearby_info
const displayLocation = computed(() => {
  // Priorité 1: nearby_info (géocodage inverse de Supabase ou local)
  if (props.audit.nearby_info && props.audit.nearby_info !== '') {
    return props.audit.nearby_info
  }
  
  // Priorité 2: Localisation enrichie dynamiquement
  if (enrichedLocation.value) {
    return enrichedLocation.value
  }
  
  // Priorité 3: Adresse enrichie par géocodage (local seulement)
  if (props.audit.address && props.audit.address !== 'Position non disponible') {
    return props.audit.address
  }
  
  // Priorité 4: Texte de localisation existant
  if (props.audit.location_text && props.audit.location_text !== 'Position non disponible') {
    return props.audit.location_text
  }
  
  // Priorité 5: Coordonnées GPS
  if (props.audit.latitude && props.audit.longitude) {
    return `${props.audit.latitude.toFixed(4)}, ${props.audit.longitude.toFixed(4)}`
  }
  
  return 'Position inconnue'
})

// Afficher la précision GPS si disponible
const displayPrecision = computed(() => {
  const accuracy = props.audit.location_accuracy || props.audit.locationAccuracy || props.audit.accuracy
  if (accuracy && accuracy < 999999) {
    return `±${Math.round(accuracy)}m`
  }
  return null
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

// Items de score avec emojis - afficher 6 critères principaux
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
  },
  { 
    key: 'natural_surveillance', 
    emoji: '👁️‍🗨️', 
    value: props.audit.natural_surveillance || props.audit.naturalSurveillance || 0,
    color: getScoreColor(props.audit.natural_surveillance || props.audit.naturalSurveillance || 0)
  },
  { 
    key: 'transport_access', 
    emoji: '🚌', 
    value: props.audit.transport_access || props.audit.transportAccess || 0,
    color: getScoreColor(props.audit.transport_access || props.audit.transportAccess || 0)
  },
  { 
    key: 'formal_security', 
    emoji: '👮', 
    value: props.audit.formal_security || props.audit.formalSecurity || 0,
    color: getScoreColor(props.audit.formal_security || props.audit.formalSecurity || 0)
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
    props.audit.cleanliness,
    props.audit.natural_surveillance || props.audit.naturalSurveillance,
    props.audit.space_diversity || props.audit.spaceDiversity,
    props.audit.transport_access || props.audit.transportAccess,
    props.audit.formal_security || props.audit.formalSecurity
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

// Statut de synchronisation AMÉLIORÉ
const syncStatus = computed(() => {
  // ✅ NOUVEAU: Utiliser syncUpdateKey pour forcer la réactivité
  syncUpdateKey.value // Déclencheur de réactivité
  
  // ✅ PRIORITÉ 1: Vérifier si synchronisé (plusieurs conditions)
  if (props.audit.synced || 
      props.audit.source === 'cloud' || 
      props.audit.source === 'local_synced' ||
      (props.audit.cloudId && props.audit.cloudId !== null)) {
    return { color: 'success', icon: 'mdi-cloud-check', text: 'Sync' }
  }
  
  // ✅ PRIORITÉ 2: Vérifier erreurs de sync
  if (props.audit.sync_error) {
    return { color: 'error', icon: 'mdi-cloud-alert', text: 'Erreur' }
  }
  
  // ✅ PRIORITÉ 3: Par défaut = Local
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

/* Scores visuels */
.scores-visual {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.score-emoji {
  font-size: 16px;
}

.score-dots {
  display: flex;
  gap: 2px;
}

.score-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.score-dot--filled {
  transform: scale(1.1);
}

/* Footer */
.audit-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
}

.audit-indicators {
  display: flex;
  align-items: center;
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
