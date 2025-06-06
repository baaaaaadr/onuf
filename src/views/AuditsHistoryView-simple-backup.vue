<!-- AuditsHistoryView.vue - Version corrigée pour affichage dates/position -->
<template>
  <div class="audits-history-view">
    <v-container class="pa-4">
      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <div class="text-body-1 mt-4">Chargement des audits...</div>
      </div>

      <!-- Aucun audit -->
      <div v-else-if="allAudits.length === 0" class="text-center mt-8">
        <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-clipboard-list-outline</v-icon>
        <h3 class="text-h5 mb-2">Aucun audit enregistré</h3>
        <p class="text-body-2 text-grey mb-4">
          Vos audits de sécurité apparaîtront ici une fois terminés.
        </p>
        <v-btn color="primary" to="/audit" size="large">
          <v-icon left>mdi-plus</v-icon>
          Commencer un audit
        </v-btn>
      </div>

      <!-- Audits existants -->
      <div v-else>
        <!-- Statistiques rapides -->
        <v-row class="mb-4">
          <v-col cols="3">
            <v-card class="text-center" color="blue-lighten-5">
              <v-card-text class="pa-3">
                <v-icon size="30" color="primary" class="mb-2">mdi-counter</v-icon>
                <div class="text-h6">{{ allAudits.length }}</div>
                <div class="text-caption">Audits</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="text-center" color="green-lighten-5">
              <v-card-text class="pa-3">
                <v-icon size="30" color="success" class="mb-2">mdi-chart-line</v-icon>
                <div class="text-h6">{{ averageScore.toFixed(1) }}</div>
                <div class="text-caption">Score</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="text-center" color="orange-lighten-5">
              <v-card-text class="pa-3">
                <v-icon size="30" color="warning" class="mb-2">mdi-image</v-icon>
                <div class="text-h6">{{ totalPhotos }}</div>
                <div class="text-caption">Photos</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card class="text-center" color="purple-lighten-5">
              <v-card-text class="pa-3">
                <v-icon size="30" color="purple" class="mb-2">mdi-cloud-check</v-icon>
                <div class="text-h6">{{ syncedCount }}</div>
                <div class="text-caption">Sync</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Liste des audits avec formatage corrigé -->
        <div class="audit-list">
          <v-card
            v-for="audit in sortedAudits"
            :key="audit.id || audit.localId || audit.timestamp"
            class="mb-3 audit-card"
            hover
          >
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-start mb-3">
                <div class="flex-grow-1">
                  <!-- TITRE AVEC INDICATEUR SYNC -->
                  <div class="d-flex align-center mb-2">
                    <h3 class="text-h6 mr-2">
                      {{ audit.comment || getAuditTitle(audit) }}
                    </h3>
                    <v-chip 
                      :color="getSyncStatusColor(audit)" 
                      size="small" 
                      variant="tonal"
                    >
                      <v-icon left size="small">{{ getSyncStatusIcon(audit) }}</v-icon>
                      {{ getSyncStatusText(audit) }}
                    </v-chip>
                  </div>
                  
                  <!-- LOCALISATION ET DATE CORRIGÉES -->
                  <div class="text-caption text-grey mb-2">
                    {{ formatLocationLine(audit) }}
                  </div>
                  
                  <!-- SCORES VISUELS -->
                  <div class="d-flex align-center gap-3 mb-2">
                    <div class="score-badge">
                      <span class="score-icon">💡</span>
                      <v-rating 
                        :model-value="audit.lighting || 0" 
                        :color="getScoreColor(audit.lighting)"
                        size="small" 
                        readonly 
                        density="compact" 
                        :length="4"
                      ></v-rating>
                    </div>
                    <div class="score-badge">
                      <span class="score-icon">🚶</span>
                      <v-rating 
                        :model-value="audit.walkpath || 0" 
                        :color="getScoreColor(audit.walkpath)"
                        size="small" 
                        readonly 
                        density="compact" 
                        :length="4"
                      ></v-rating>
                    </div>
                    <div class="score-badge">
                      <span class="score-icon">😊</span>
                      <v-rating 
                        :model-value="audit.feeling || 0" 
                        :color="getScoreColor(audit.feeling)"
                        size="small" 
                        readonly 
                        density="compact" 
                        :length="4"
                      ></v-rating>
                    </div>
                  </div>
                  
                  <!-- PHOTOS INFO -->
                  <div v-if="getPhotosCount(audit) > 0" class="text-caption text-blue">
                    📸 {{ getPhotosCount(audit) }} photo(s)
                  </div>
                </div>
                
                <!-- SCORE GLOBAL -->
                <div class="text-center ml-3">
                  <div class="text-h4 font-weight-bold" :style="{ color: getScoreColor(calculateGlobalScore(audit)) + ' !important' }">
                    {{ calculateGlobalScore(audit).toFixed(1) }}
                  </div>
                  <div class="text-caption">Score</div>
                </div>
              </div>
              
              <!-- ACTIONS -->
              <div class="d-flex justify-space-between align-center">
                <v-btn
                  variant="outlined"
                  size="small"
                  @click="viewAuditDetails(audit)"
                >
                  <v-icon left size="small">mdi-eye</v-icon>
                  Voir détails
                </v-btn>
                
                <div class="d-flex gap-2">
                  <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-pencil"
                    @click="editAudit(audit)"
                  ></v-btn>
                  
                  <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-share"
                    @click="shareAudit(audit)"
                  ></v-btn>
                  
                  <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-delete"
                    color="error"
                    @click="deleteAudit(audit)"
                  ></v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Pagination si beaucoup d'audits -->
        <div v-if="allAudits.length > auditsPerPage" class="text-center mt-4">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            color="primary"
          ></v-pagination>
        </div>
      </div>
    </v-container>

    <!-- Dialog détail d'audit -->
    <v-dialog v-model="showAuditDialog" max-width="600" scrollable>
      <v-card v-if="selectedAudit">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          Détail de l'audit
          <v-spacer />
          <v-chip 
            :color="getSyncStatusColor(selectedAudit)"
            size="small"
            variant="tonal"
          >
            <v-icon left size="small">{{ getSyncStatusIcon(selectedAudit) }}</v-icon>
            {{ getSyncStatusText(selectedAudit) }}
          </v-chip>
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="pa-4">
          <!-- Localisation -->
          <div class="mb-4">
            <h4 class="text-subtitle-1 mb-2 d-flex align-center">
              <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
              Localisation
            </h4>
            <p class="text-body-2">{{ formatAddress(selectedAudit) }}</p>
            <div v-if="hasCoordinates(selectedAudit)" class="text-caption text-grey">
              Coordonnées: {{ formatCoordinates(selectedAudit) }}
            </div>
            <div class="text-caption text-grey">
              Date: {{ formatDate(getAuditDate(selectedAudit)) }}
            </div>
          </div>

          <!-- Scores détaillés -->
          <div class="mb-4">
            <h4 class="text-subtitle-1 mb-2">📊 Évaluations</h4>
            <div class="audit-scores">
              <div class="score-item" v-for="scoreItem in getScoreItems(selectedAudit)" :key="scoreItem.key">
                <span class="score-label">{{ scoreItem.icon }} {{ scoreItem.label }}:</span>
                <div class="score-display">
                  <v-rating 
                    :model-value="scoreItem.value" 
                    :color="scoreItem.color"
                    size="small" 
                    readonly 
                    density="compact" 
                    :length="4"
                  ></v-rating>
                  <span class="score-text ml-2">({{ scoreItem.value }}/4)</span>
                </div>
              </div>
            </div>
            
            <!-- Score global -->
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-2">Score global:</span>
              <div class="d-flex align-center">
                <v-rating 
                  :model-value="calculateGlobalScore(selectedAudit)" 
                  color="primary"
                  size="small" 
                  readonly 
                  density="compact" 
                  :length="4"
                  half-increments
                ></v-rating>
                <span class="text-h6 ml-2 font-weight-bold">
                  {{ calculateGlobalScore(selectedAudit).toFixed(1) }}/4
                </span>
              </div>
            </div>
          </div>

          <!-- Commentaire -->
          <div v-if="selectedAudit.comment" class="mb-4">
            <h4 class="text-subtitle-1 mb-2">💬 Commentaire</h4>
            <v-card variant="tonal" color="blue-grey" class="pa-3">
              <p class="text-body-2 mb-0">{{ selectedAudit.comment }}</p>
            </v-card>
          </div>

          <!-- Photos -->
          <div v-if="hasPhotos(selectedAudit)" class="mb-4">
            <h4 class="text-subtitle-1 mb-2">
              📸 Photos ({{ getPhotosCount(selectedAudit) }})
            </h4>
            
            <v-row dense>
              <v-col
                v-for="(photo, index) in getPhotos(selectedAudit)" 
                :key="photo.id || index"
                cols="4"
              >
                <v-card
                  class="photo-preview"
                  @click="openPhotoDialog(photo, index)"
                  hover
                >
                  <v-img
                    v-if="photo.data"
                    :src="photo.data"
                    aspect-ratio="1"
                    cover
                    class="cursor-pointer"
                  >
                    <div class="photo-overlay">
                      <v-icon color="white">mdi-magnify</v-icon>
                    </div>
                  </v-img>
                  <v-card-text v-else class="text-center pa-2">
                    <v-icon>mdi-image-broken</v-icon>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Métadonnées techniques -->
          <v-expansion-panels variant="accordion" class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-information</v-icon>
                Informations techniques
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="technical-info">
                  <div class="info-row">
                    <span class="info-label">ID:</span>
                    <span class="info-value">{{ selectedAudit.id || selectedAudit.localId || 'N/A' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Créé:</span>
                    <span class="info-value">{{ formatDate(getAuditDate(selectedAudit)) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Source:</span>
                    <span class="info-value">{{ getAuditSource(selectedAudit) }}</span>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            color="secondary"
            @click="exportSingleAudit"
          >
            <v-icon left>mdi-download</v-icon>
            Exporter
          </v-btn>
          
          <v-spacer />
          <v-btn @click="showAuditDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog photo en plein écran -->
    <v-dialog v-model="showPhotoDialog" max-width="90vw" max-height="90vh">
      <v-card v-if="selectedPhoto">
        <v-card-title class="d-flex justify-space-between align-center pa-2">
          <span class="text-subtitle-1">📸 {{ selectedPhoto.name || `Photo ${selectedPhotoIndex + 1}` }}</span>
          <v-btn icon="mdi-close" @click="showPhotoDialog = false" variant="text" size="small"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-2">
          <v-img
            :src="selectedPhoto.data"
            class="photo-full cursor-pointer"
            contain
            max-height="70vh"
            @click="showPhotoDialog = false"
          >
            <div class="photo-overlay-close">
              <v-btn 
                icon="mdi-close" 
                @click.stop="showPhotoDialog = false" 
                variant="elevated" 
                color="white"
                size="small"
              />
            </div>
          </v-img>
        </v-card-text>
        
        <v-card-actions class="pa-2">
          <v-spacer />
          <v-btn @click="showPhotoDialog = false" color="primary">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// État local
const allAudits = ref([])
const loading = ref(false)
const error = ref(null)

// Dialogs
const showAuditDialog = ref(false)
const showPhotoDialog = ref(false)

// Sélections
const selectedAudit = ref(null)
const selectedPhoto = ref(null)
const selectedPhotoIndex = ref(0)

// Pagination
const currentPage = ref(1)
const auditsPerPage = 20

// =====================================================
// FONCTIONS DE FORMATAGE CORRIGÉES
// =====================================================

// Fonction robuste pour formater les dates
const formatDate = (dateInput) => {
  if (!dateInput) return 'Date inconnue'
  
  try {
    let date
    
    // Si c'est déjà un objet Date
    if (dateInput instanceof Date) {
      date = dateInput
    }
    // Si c'est un timestamp number
    else if (typeof dateInput === 'number') {
      date = new Date(dateInput)
    }
    // Si c'est une string ISO
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput)
    }
    // Fallback
    else {
      return 'Format invalide'
    }
    
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide'
    }
    
    // Format français DD/MM/YY HH:MM
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
    
  } catch (error) {
    console.error('Erreur formatage date:', error, 'Input:', dateInput)
    return 'Erreur date'
  }
}

// Fonction pour formater l'adresse
const formatAddress = (audit) => {
  // Priorité : adresse calculée > coordonnées > "Position inconnue"
  if (audit.address && audit.address !== '') {
    return audit.address
  }
  
  if (audit.location && audit.location !== '') {
    return audit.location
  }
  
  if (audit.location_text && audit.location_text !== '') {
    return audit.location_text
  }
  
  if (audit.latitude && audit.longitude) {
    return `${audit.latitude.toFixed(4)}, ${audit.longitude.toFixed(4)}`
  }
  
  return 'Position inconnue'
}

// Fonction pour obtenir la date d'un audit
const getAuditDate = (audit) => {
  return audit.created_at || audit.timestamp || audit.lastUpdate || audit.date || Date.now()
}

// Fonction pour ligne complète localisation/date
const formatLocationLine = (audit) => {
  const address = formatAddress(audit)
  const coordinates = hasCoordinates(audit) 
    ? `${audit.latitude?.toFixed(4) || '0.0000'}, ${audit.longitude?.toFixed(4) || '0.0000'}`
    : null
    
  const dateField = getAuditDate(audit)
  const formattedDate = formatDate(dateField)
  
  if (coordinates) {
    return `${address} • ${coordinates} • ${formattedDate}`
  } else {
    return `${address} • ${formattedDate}`
  }
}

// =====================================================
// AUTRES FONCTIONS UTILITAIRES
// =====================================================

const hasCoordinates = (audit) => {
  return (audit.latitude && audit.longitude) || 
         (audit.coordinates && audit.coordinates.lat && audit.coordinates.lng)
}

const formatCoordinates = (audit) => {
  if (audit.coordinates && audit.coordinates.lat && audit.coordinates.lng) {
    return `${audit.coordinates.lat.toFixed(4)}, ${audit.coordinates.lng.toFixed(4)}`
  }
  if (audit.latitude && audit.longitude) {
    return `${audit.latitude.toFixed(4)}, ${audit.longitude.toFixed(4)}`
  }
  return 'Non disponible'
}

const getAuditTitle = (audit) => {
  if (audit.comment) return audit.comment
  if (audit.id) return `Audit ${audit.id.substring(0, 8)}`
  if (audit.localId) return `Audit ${audit.localId.substring(0, 8)}`
  return `Audit ${formatDate(getAuditDate(audit))}`
}

const getAuditSource = (audit) => {
  if (audit.synced || audit.source === 'cloud') return 'Cloud Supabase'
  if (audit.source === 'local') return 'Local (non synchronisé)'
  return 'LocalStorage'
}

// Computed
const sortedAudits = computed(() => {
  const sorted = [...allAudits.value].sort((a, b) => {
    const getTimestamp = (audit) => {
      const dateField = getAuditDate(audit)
      if (typeof dateField === 'number') return dateField
      if (typeof dateField === 'string') return new Date(dateField).getTime()
      if (dateField instanceof Date) return dateField.getTime()
      return 0
    }
    
    return getTimestamp(b) - getTimestamp(a) // Plus récent en premier
  })
  
  // Pagination
  const start = (currentPage.value - 1) * auditsPerPage
  const end = start + auditsPerPage
  return sorted.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(allAudits.value.length / auditsPerPage)
})

const averageScore = computed(() => {
  if (allAudits.value.length === 0) return 0
  
  const totalScore = allAudits.value.reduce((sum, audit) => {
    return sum + calculateGlobalScore(audit)
  }, 0)
  
  return totalScore / allAudits.value.length
})

const totalPhotos = computed(() => {
  return allAudits.value.reduce((sum, audit) => {
    return sum + getPhotosCount(audit)
  }, 0)
})

const syncedCount = computed(() => {
  return allAudits.value.filter(audit => audit.synced || audit.source === 'cloud').length
})

// Methods
const loadAudits = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Charger depuis localStorage
    const localAudits = JSON.parse(localStorage.getItem('safety_audits') || '[]')
    
    // TODO: Si composable useAudits disponible, charger aussi depuis cloud
    // const { getAllAudits } = useAudits()
    // const result = await getAllAudits()
    
    allAudits.value = localAudits
    console.log(`📊 ${localAudits.length} audits chargés depuis localStorage`)
    
  } catch (err) {
    error.value = err.message
    console.error('❌ Erreur chargement audits:', err)
  } finally {
    loading.value = false
  }
}

const calculateGlobalScore = (audit) => {
  const scores = [
    audit.lighting,
    audit.walkpath,
    audit.openness,
    audit.feeling,
    audit.people_presence || audit.peoplePresence,
    audit.cleanliness
  ].filter(score => score > 0)
  
  if (scores.length === 0) return 0
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

const getScoreColor = (score) => {
  if (!score || score <= 0) return 'grey'
  if (score <= 1) return 'red'
  if (score <= 2) return 'orange'
  if (score <= 3) return 'blue'
  return 'green'
}

const getScoreItems = (audit) => {
  return [
    { key: 'lighting', icon: '💡', label: 'Éclairage', value: audit.lighting || 0, color: getScoreColor(audit.lighting) },
    { key: 'walkpath', icon: '🚶', label: 'Cheminement', value: audit.walkpath || 0, color: getScoreColor(audit.walkpath) },
    { key: 'openness', icon: '👁️', label: 'Ouverture', value: audit.openness || 0, color: getScoreColor(audit.openness) },
    { key: 'feeling', icon: '😊', label: 'Ressenti', value: audit.feeling || 0, color: getScoreColor(audit.feeling) },
    { key: 'people_presence', icon: '👥', label: 'Présence', value: audit.people_presence || audit.peoplePresence || 0, color: getScoreColor(audit.people_presence || audit.peoplePresence) },
    { key: 'cleanliness', icon: '🧹', label: 'Propreté', value: audit.cleanliness || 0, color: getScoreColor(audit.cleanliness) }
  ]
}

const getSyncStatusColor = (audit) => {
  if (audit.synced || audit.source === 'cloud') return 'green'
  if (audit.source === 'local' || !audit.synced) return 'orange'
  return 'grey'
}

const getSyncStatusIcon = (audit) => {
  if (audit.synced || audit.source === 'cloud') return 'mdi-cloud-check'
  if (audit.source === 'local' || !audit.synced) return 'mdi-cloud-clock'
  return 'mdi-harddisk'
}

const getSyncStatusText = (audit) => {
  if (audit.synced || audit.source === 'cloud') return 'Synchronisé'
  if (audit.source === 'local' || !audit.synced) return 'En attente'
  return 'Local'
}

const hasPhotos = (audit) => {
  return (audit.photos && audit.photos.length > 0) || 
         (audit.total_photos && audit.total_photos > 0)
}

const getPhotosCount = (audit) => {
  if (audit.photos) return audit.photos.length
  if (audit.total_photos) return audit.total_photos
  return 0
}

const getPhotos = (audit) => {
  return audit.photos || []
}

// Actions
const viewAuditDetails = (audit) => {
  selectedAudit.value = audit
  showAuditDialog.value = true
}

const editAudit = (audit) => {
  router.push({
    name: 'audit',
    query: { edit: audit.id || audit.localId }
  })
}

const deleteAudit = async (audit) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet audit ?')) {
    try {
      // Supprimer de localStorage
      const audits = JSON.parse(localStorage.getItem('safety_audits') || '[]')
      const filtered = audits.filter(a => 
        (a.id !== audit.id) && 
        (a.localId !== audit.localId) &&
        (a.timestamp !== audit.timestamp)
      )
      localStorage.setItem('safety_audits', JSON.stringify(filtered))
      
      // TODO: Si composable useAudits disponible, supprimer aussi du cloud
      
      await loadAudits() // Recharger la liste
    } catch (error) {
      console.error('❌ Erreur suppression audit:', error)
    }
  }
}

const shareAudit = (audit) => {
  const data = {
    id: audit.id || audit.localId,
    location: formatAddress(audit),
    score: calculateGlobalScore(audit).toFixed(1),
    date: formatDate(getAuditDate(audit))
  }
  
  if (navigator.share) {
    navigator.share({
      title: 'Audit de sécurité ONUF',
      text: `Audit du ${formatDate(getAuditDate(audit))} - Score: ${data.score}/4`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => alert('Données de l\'audit copiées dans le presse-papier'))
      .catch(() => alert('Impossible de partager cet audit'))
  }
}

const openPhotoDialog = (photo, index) => {
  if (photo.data) {
    selectedPhoto.value = photo
    selectedPhotoIndex.value = index
    showPhotoDialog.value = true
  }
}

const exportSingleAudit = () => {
  if (selectedAudit.value) {
    const data = {
      ...selectedAudit.value,
      export_date: new Date().toISOString(),
      formatted_date: formatDate(getAuditDate(selectedAudit.value)),
      formatted_location: formatAddress(selectedAudit.value)
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_${(selectedAudit.value.id || selectedAudit.value.localId || 'unknown').substring(0, 8)}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Lifecycle
onMounted(() => {
  loadAudits()
})
</script>

<style scoped>
.audits-history-view {
  min-height: 100vh;
}

.v-container {
  max-width: 800px;
}

.audit-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.audit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.score-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-icon {
  font-size: 16px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.score-item:last-child {
  border-bottom: none;
}

.score-label {
  min-width: 140px;
  font-weight: 500;
}

.score-display {
  display: flex;
  align-items: center;
}

.score-text {
  font-weight: 600;
  min-width: 40px;
}

.photo-preview {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.photo-preview:hover {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-preview:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.cursor-pointer {
  cursor: pointer;
}

.technical-info .info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.technical-info .info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  min-width: 80px;
}

.info-value {
  text-align: right;
  font-family: monospace;
  font-size: 0.875rem;
}

/* Responsive design */
@media (max-width: 600px) {
  .v-container {
    padding: 8px;
  }
  
  .score-badge {
    flex-direction: column;
    gap: 2px;
  }
  
  .score-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .score-label {
    min-width: auto;
  }
  
  .technical-info .info-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .info-value {
    text-align: left;
  }
}
</style>