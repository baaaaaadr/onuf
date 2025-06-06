<!-- src/views/AuditsHistoryView-enhanced.vue - Version avec indicateurs de sync -->
<template>
  <div class="audits-history-view">
    <!-- Le header est maintenant géré par StatusBar dans App.vue -->
    
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
        <!-- Statistiques rapides avec indicateurs de sync -->
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
            <v-card 
              class="text-center cursor-pointer" 
              :color="syncStats.failed > 0 ? 'red-lighten-5' : 'purple-lighten-5'"
              @click="showSyncDetails = true"
            >
              <v-card-text class="pa-3">
                <v-icon 
                  size="30" 
                  :color="syncStats.failed > 0 ? 'error' : 'purple'" 
                  class="mb-2"
                >
                  {{ syncStats.failed > 0 ? 'mdi-cloud-alert' : 'mdi-cloud-check' }}
                </v-icon>
                <div class="text-h6">{{ syncStats.success }}</div>
                <div class="text-caption">Sync</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Barre d'actions -->
        <v-row class="mb-4">
          <v-col>
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex gap-2">
                <!-- Filtres -->
                <v-btn-toggle
                  v-model="filterMode"
                  mandatory
                  density="compact"
                  variant="outlined"
                >
                  <v-btn value="all" size="small">
                    <v-icon left size="small">mdi-all-inclusive</v-icon>
                    Tous
                  </v-btn>
                  <v-btn value="synced" size="small">
                    <v-icon left size="small">mdi-cloud-check</v-icon>
                    Cloud
                  </v-btn>
                  <v-btn value="local" size="small">
                    <v-icon left size="small">mdi-harddisk</v-icon>
                    Local
                  </v-btn>
                  <v-btn value="failed" size="small" v-if="syncStats.failed > 0">
                    <v-icon left size="small">mdi-cloud-alert</v-icon>
                    Échecs
                  </v-btn>
                </v-btn-toggle>
              </div>

              <div class="d-flex gap-2">
                <!-- Actions de sync -->
                <v-btn
                  v-if="syncStats.pending > 0 || syncStats.failed > 0"
                  color="primary"
                  size="small"
                  @click="syncAllAudits"
                  :loading="syncStats.syncing > 0"
                  :disabled="!isOnline"
                >
                  <v-icon left size="small">mdi-cloud-sync</v-icon>
                  Synchroniser ({{ syncStats.pending + syncStats.failed }})
                </v-btn>

                <!-- Export -->
                <v-btn
                  color="secondary"
                  size="small"
                  @click="exportAllAudits"
                  :disabled="filteredAudits.length === 0"
                >
                  <v-icon left size="small">mdi-download</v-icon>
                  Export
                </v-btn>

                <!-- Nettoyage -->
                <v-btn
                  color="error"
                  size="small"
                  @click="showDeleteDialog = true"
                  :disabled="allAudits.length === 0"
                >
                  <v-icon left size="small">mdi-delete-sweep</v-icon>
                  Nettoyer
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Indicateur de statut réseau -->
        <v-alert
          v-if="!isOnline && (syncStats.pending > 0 || syncStats.failed > 0)"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <v-icon class="mr-2">mdi-wifi-off</v-icon>
          {{ syncStats.pending + syncStats.failed }} audit(s) seront synchronisés à la reconnexion
        </v-alert>

        <!-- Liste des audits avec nouveaux composants -->
        <div class="audit-list">
          <AuditListItem
            v-for="audit in filteredAudits"
            :key="audit.id || audit.localId"
            :audit="audit"
            :can-edit="true"
            @view-details="viewAuditDetails"
            @edit="editAudit"
            @delete="deleteAudit"
            @share="shareAudit"
          />
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

    <!-- Dialog détail d'audit (amélioré) -->
    <v-dialog v-model="showAuditDialog" max-width="600" scrollable>
      <v-card v-if="selectedAudit">
        <v-card-title class="d-flex align-center sticky-header">
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          Détail de l'audit
          <v-spacer />
          
          <!-- Indicateur de sync dans le header -->
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
          <!-- Localisation avec précision GPS -->
          <div class="mb-4">
            <h4 class="text-subtitle-1 mb-2 d-flex align-center">
              <v-icon class="mr-2" :color="getLocationAccuracyColor(selectedAudit)">
                {{ getLocationAccuracyIcon(selectedAudit) }}
              </v-icon>
              Localisation
            </h4>
            <p class="text-body-2">{{ selectedAudit.location || selectedAudit.location_text || 'Non disponible' }}</p>
            <div v-if="selectedAudit.coordinates || (selectedAudit.latitude && selectedAudit.longitude)" class="text-caption text-grey">
              Coordonnées: {{ formatCoordinates(selectedAudit) }}
              <span v-if="selectedAudit.location_accuracy" class="ml-2">
                (Précision: ±{{ selectedAudit.location_accuracy }}m)
              </span>
            </div>
          </div>

          <!-- Scores détaillés avec couleurs -->
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

          <!-- Photos améliorées -->
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
                    <span class="info-value">{{ selectedAudit.id || selectedAudit.localId }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Créé:</span>
                    <span class="info-value">{{ formatDate(selectedAudit.created_at || selectedAudit.timestamp) }}</span>
                  </div>
                  <div class="info-row" v-if="selectedAudit.updated_at">
                    <span class="info-label">Modifié:</span>
                    <span class="info-value">{{ formatDate(selectedAudit.updated_at) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Source:</span>
                    <span class="info-value">{{ selectedAudit.source || (selectedAudit.synced ? 'Cloud' : 'Local') }}</span>
                  </div>
                  <div class="info-row" v-if="selectedAudit.device_info">
                    <span class="info-label">Appareil:</span>
                    <span class="info-value">{{ getDeviceInfo(selectedAudit) }}</span>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            v-if="!selectedAudit.synced && getSyncStatus(selectedAudit.id) === 'failed'"
            color="warning"
            @click="retryAuditSync"
            :disabled="!isOnline"
          >
            <v-icon left>mdi-refresh</v-icon>
            Réessayer sync
          </v-btn>
          
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

    <!-- Autres dialogs existants -->
    <!-- Dialog photo en plein écran (inchangé) -->
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

    <!-- Dialog détails de sync -->
    <v-dialog v-model="showSyncDetails" max-width="500">
      <v-card>
        <v-card-title>État de synchronisation</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6" class="text-center">
              <div class="text-h4 success--text">{{ syncStats.success }}</div>
              <div class="text-caption">Synchronisés</div>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="text-h4 error--text">{{ syncStats.failed }}</div>
              <div class="text-caption">Échoués</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showSyncDetails = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression (amélioré) -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 d-flex align-center">
          <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
          Supprimer les audits ?
        </v-card-title>
        <v-card-text>
          <p class="mb-3">Choisissez le type de suppression :</p>
          
          <v-radio-group v-model="deleteMode" class="mt-0">
            <v-radio
              label="Supprimer uniquement les audits locaux non synchronisés"
              value="local-only"
              :disabled="localOnlyAudits.length === 0"
            >
              <template v-slot:label>
                <div>
                  <div>Supprimer les audits locaux uniquement</div>
                  <div class="text-caption text-grey">
                    ({{ localOnlyAudits.length }} audits concernés)
                  </div>
                </div>
              </template>
            </v-radio>
            <v-radio
              label="Supprimer tous les audits (local + cloud)"
              value="all"
            >
              <template v-slot:label>
                <div>
                  <div class="text-error">Supprimer TOUS les audits</div>
                  <div class="text-caption text-grey">
                    ({{ allAudits.length }} audits concernés - IRRÉVERSIBLE)
                  </div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <v-alert
            v-if="deleteMode === 'all'"
            type="error"
            variant="tonal"
            class="mt-3"
          >
            ⚠️ Cette action est irréversible et supprimera tous vos audits !
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">Annuler</v-btn>
          <v-btn 
            :color="deleteMode === 'all' ? 'error' : 'warning'" 
            @click="confirmDelete"
            :disabled="!deleteMode"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import AuditListItem from '@/components/AuditListItem.vue'

// Router
const router = useRouter()

// Composables
const { getAllAudits, deleteAudit: deleteAuditData, syncAllLocalAudits } = useAudits()
const { 
  syncStats, 
  isOnline, 
  getSyncStatus, 
  getSyncDetails,
  retrySync,
  processQueue
} = getGlobalSyncQueue()

// État local
const allAudits = ref([])
const loading = ref(false)
const error = ref(null)

// Dialogs
const showAuditDialog = ref(false)
const showPhotoDialog = ref(false)
const showDeleteDialog = ref(false)
const showSyncDetails = ref(false)

// Sélections
const selectedAudit = ref(null)
const selectedPhoto = ref(null)
const selectedPhotoIndex = ref(0)

// Filtres et pagination
const filterMode = ref('all')
const currentPage = ref(1)
const auditsPerPage = 20
const deleteMode = ref('local-only')

// Computed
const filteredAudits = computed(() => {
  let filtered = allAudits.value

  switch (filterMode.value) {
    case 'synced':
      filtered = allAudits.value.filter(audit => audit.synced || audit.source === 'cloud')
      break
    case 'local':
      filtered = allAudits.value.filter(audit => !audit.synced || audit.source === 'local')
      break
    case 'failed':
      filtered = allAudits.value.filter(audit => {
        const status = getSyncStatus(audit.id || audit.localId)
        return status === 'failed'
      })
      break
    default:
      filtered = allAudits.value
  }

  // Pagination
  const start = (currentPage.value - 1) * auditsPerPage
  const end = start + auditsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(allAudits.value.length / auditsPerPage)
})

const localOnlyAudits = computed(() => {
  return allAudits.value.filter(audit => !audit.synced && audit.source !== 'cloud')
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

// Methods
const loadAudits = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await getAllAudits()
    if (result.success) {
      allAudits.value = result.audits
      console.log(`📊 ${result.audits.length} audits chargés`)
    } else {
      error.value = result.error
    }
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
  if (score <= 1) return 'error'
  if (score <= 2) return 'warning'
  if (score <= 3) return 'primary'
  return 'success'
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
  const status = getSyncStatus(audit.id || audit.localId)
  switch (status) {
    case 'synced': return 'success'
    case 'syncing': return 'info'
    case 'pending': return 'warning'
    case 'failed': return 'error'
    default: return 'grey'
  }
}

const getSyncStatusIcon = (audit) => {
  const status = getSyncStatus(audit.id || audit.localId)
  switch (status) {
    case 'synced': return 'mdi-cloud-check'
    case 'syncing': return 'mdi-cloud-sync'
    case 'pending': return 'mdi-cloud-clock'
    case 'failed': return 'mdi-cloud-alert'
    default: return 'mdi-harddisk'
  }
}

const getSyncStatusText = (audit) => {
  const status = getSyncStatus(audit.id || audit.localId)
  switch (status) {
    case 'synced': return 'Synchronisé'
    case 'syncing': return 'En cours...'
    case 'pending': return 'En attente'
    case 'failed': return 'Échec'
    default: return 'Local'
  }
}

const getLocationAccuracyColor = (audit) => {
  const accuracy = audit.location_accuracy
  if (!accuracy) return 'grey'
  if (accuracy <= 10) return 'success'
  if (accuracy <= 50) return 'primary'
  if (accuracy <= 100) return 'warning'
  return 'error'
}

const getLocationAccuracyIcon = (audit) => {
  const accuracy = audit.location_accuracy
  if (!accuracy) return 'mdi-map-marker-question'
  if (accuracy <= 10) return 'mdi-crosshairs-gps'
  if (accuracy <= 50) return 'mdi-map-marker-check'
  return 'mdi-map-marker-alert'
}

const formatCoordinates = (audit) => {
  if (audit.coordinates) {
    return `${audit.coordinates.lat.toFixed(4)}, ${audit.coordinates.lng.toFixed(4)}`
  }
  if (audit.latitude && audit.longitude) {
    return `${audit.latitude.toFixed(4)}, ${audit.longitude.toFixed(4)}`
  }
  return 'Non disponible'
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

const getDeviceInfo = (audit) => {
  if (!audit.device_info) return 'Non disponible'
  return audit.device_info.platform || 'Navigateur web'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  
  const date = new Date(timestamp)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Actions
const viewAuditDetails = (audit) => {
  selectedAudit.value = audit
  showAuditDialog.value = true
}

const editAudit = (audit) => {
  // Naviguer vers le formulaire avec les données de l'audit
  router.push({
    name: 'audit',
    query: { edit: audit.id || audit.localId }
  })
}

const deleteAudit = async (audit) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet audit ?')) {
    const result = await deleteAuditData(audit.id || audit.localId)
    if (result.success) {
      await loadAudits() // Recharger la liste
    }
  }
}

const shareAudit = (audit) => {
  if (navigator.share && audit.synced) {
    navigator.share({
      title: 'Audit de sécurité ONUF',
      text: `Audit du ${formatDate(audit.created_at || audit.timestamp)}`,
      url: `${window.location.origin}/audit/${audit.id}`
    })
  } else {
    // Fallback: copier dans le presse-papier
    const data = {
      id: audit.id,
      location: audit.location || audit.location_text,
      score: calculateGlobalScore(audit).toFixed(1),
      date: formatDate(audit.created_at || audit.timestamp)
    }
    
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

const syncAllAudits = async () => {
  await syncAllLocalAudits()
  await processQueue()
}

const retryAuditSync = async () => {
  if (selectedAudit.value) {
    await retrySync(selectedAudit.value.id || selectedAudit.value.localId)
    showAuditDialog.value = false
  }
}

const exportSingleAudit = () => {
  if (selectedAudit.value) {
    const data = {
      ...selectedAudit.value,
      export_date: new Date().toISOString(),
      app_version: import.meta.env.VITE_APP_VERSION
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_${(selectedAudit.value.id || selectedAudit.value.localId).substring(0, 8)}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

const exportAllAudits = () => {
  const data = {
    audits: filteredAudits.value,
    export_date: new Date().toISOString(),
    app_version: import.meta.env.VITE_APP_VERSION,
    total_count: filteredAudits.value.length,
    filter_applied: filterMode.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audits_export_${filterMode.value}_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const confirmDelete = async () => {
  try {
    if (deleteMode.value === 'all') {
      // Supprimer tous les audits
      for (const audit of allAudits.value) {
        await deleteAuditData(audit.id || audit.localId)
      }
    } else {
      // Supprimer seulement les locaux
      for (const audit of localOnlyAudits.value) {
        await deleteAuditData(audit.id || audit.localId)
      }
    }
    
    await loadAudits()
    showDeleteDialog.value = false
    deleteMode.value = 'local-only'
  } catch (error) {
    console.error('❌ Erreur suppression:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadAudits()
})

// Watchers
watch(filterMode, () => {
  currentPage.value = 1 // Reset pagination when filter changes
})
</script>

<style scoped>
.audits-history-view {
  min-height: 100vh;
}

.v-container {
  max-width: 800px;
}

.audit-list .v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.audit-list .v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
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

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
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
