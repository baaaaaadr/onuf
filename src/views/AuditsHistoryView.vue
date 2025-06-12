<!-- AuditsHistoryView.vue - Version avec vrais composables + formatage corrigé -->
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
        <!-- Statistiques rapides avec vrais statuts -->
        <v-row class="mb-4">
          <v-col cols="6">
            <v-card class="text-center" color="blue-lighten-5">
              <v-card-text class="pa-3">
                <v-icon size="30" color="primary" class="mb-2">mdi-counter</v-icon>
                <div class="text-h6">{{ allAudits.length }}</div>
                <div class="text-caption">Audits</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card 
              class="text-center cursor-pointer" 
              :color="safeSyncStats.failed > 0 ? 'red-lighten-5' : 'purple-lighten-5'"
              @click="showSyncDetails = true"
            >
              <v-card-text class="pa-3">
                <v-icon 
                  size="30" 
                  :color="safeSyncStats.failed > 0 ? 'error' : 'purple'" 
                  class="mb-2"
                >
                  {{ safeSyncStats.failed > 0 ? 'mdi-cloud-alert' : 'mdi-cloud-check' }}
                </v-icon>
                <div class="text-h6">{{ safeSyncStats.success }}</div>
                <div class="text-caption">Sync</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filtres de vue -->
        <div class="filter-controls mb-4">
          <v-chip-group
            v-model="filterMode"
            mandatory
            selected-class="primary"
          >
            <v-chip
              value="all"
              variant="outlined"
              filter
            >
              <v-icon start size="small">mdi-all-inclusive</v-icon>
              Tous
              <v-chip class="ml-2" size="x-small" label>{{ allAuditsCount }}</v-chip>
            </v-chip>
            
            <v-chip
              value="synced"
              variant="outlined"
              filter
            >
              <v-icon start size="small">mdi-cloud-check</v-icon>
              Cloud
              <v-chip class="ml-2" size="x-small" label>{{ syncedCount }}</v-chip>
            </v-chip>
            
            <v-chip
              value="local"
              variant="outlined"
              filter
            >
              <v-icon start size="small">mdi-harddisk</v-icon>
              Local
              <v-chip class="ml-2" size="x-small" label>{{ localCount }}</v-chip>
            </v-chip>
            
            <v-chip
              v-if="safeSyncStats.failed > 0"
              value="failed"
              variant="outlined"
              filter
              color="error"
            >
              <v-icon start size="small">mdi-cloud-alert</v-icon>
              Échecs
              <v-chip class="ml-2" size="x-small" label color="error">{{ safeSyncStats.failed }}</v-chip>
            </v-chip>
          </v-chip-group>
        </div>

        <!-- Barre d'actions -->
        <div class="action-bar mb-4">
          <v-btn
            :icon="true"
            size="small"
            variant="tonal"
            color="secondary"
            @click="exportAllAudits"
            :disabled="filteredAudits.length === 0"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
          
          <v-btn
            :icon="true"
            size="small"
            variant="tonal"
            color="error"
            @click="showDeleteDialog = true"
            :disabled="allAudits.length === 0"
          >
            <v-icon>mdi-delete-sweep</v-icon>
          </v-btn>
          
          <v-spacer />
          
          <v-btn
            v-if="safeSyncStats.pending > 0 || safeSyncStats.failed > 0"
            color="primary"
            variant="elevated"
            @click="syncAllAudits"
            :loading="safeSyncStats.syncing > 0"
            :disabled="!isOnline"
            rounded
          >
            <v-icon start>mdi-cloud-sync</v-icon>
            Synchroniser ({{ safeSyncStats.pending + safeSyncStats.failed }})
          </v-btn>
        </div>

        <!-- Indicateur de statut réseau -->
        <v-alert
          v-if="!isOnline && (safeSyncStats.pending > 0 || safeSyncStats.failed > 0)"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <v-icon class="mr-2">mdi-wifi-off</v-icon>
          {{ safeSyncStats.pending + safeSyncStats.failed }} audit(s) seront synchronisés à la reconnexion
        </v-alert>

        <!-- Liste des audits avec vrais statuts de sync -->
        <div class="audit-list">
          <AuditCard
            v-for="audit in filteredAudits"
            :key="audit.id || audit.localId || audit.timestamp"
            :audit="audit"
            @click="viewAuditDetails"
            @view="viewAuditDetails"
            @share="shareAudit"
            @delete="deleteAudit"
            class="mb-3"
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

    <!-- Dialog détail d'audit avec vrais statuts -->
    <v-dialog v-model="showAuditDialog" max-width="600" scrollable>
      <v-card v-if="selectedAudit">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-clipboard-text</v-icon>
          Détail de l'audit
          <v-spacer />
          <v-chip 
            :color="getRealSyncStatusColor(selectedAudit)"
            size="small"
            variant="tonal"
          >
            <v-icon left size="small">{{ getRealSyncStatusIcon(selectedAudit) }}</v-icon>
            {{ getRealSyncStatusText(selectedAudit) }}
          </v-chip>
        </v-card-title>
        
        <v-divider />
        
        <v-card-text class="pa-4">
          <!-- Localisation avec formatage corrigé -->
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
                  <div class="score-circles">
                    <div 
                      v-for="n in 4" 
                      :key="n"
                      :class="['score-circle', { 'score-circle--filled': n <= scoreItem.value }]"
                      :style="{ backgroundColor: n <= scoreItem.value ? scoreItem.color : '#e0e0e0' }"
                    ></div>
                  </div>
                  <span class="score-text ml-2">({{ scoreItem.value }}/4)</span>
                </div>
              </div>
            </div>
            
            <!-- Score global -->
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-2">Score global:</span>
              <div class="d-flex align-center">
                <div class="score-circles">
                  <div 
                    v-for="n in 4" 
                    :key="n"
                    :class="['score-circle', { 'score-circle--filled': n <= calculateGlobalScore(selectedAudit) }]"
                    :style="{ backgroundColor: n <= calculateGlobalScore(selectedAudit) ? '#F3C348' : '#e0e0e0' }"
                  ></div>
                </div>
                <span class="text-h6 ml-2 font-weight-bold">
                  {{ calculateGlobalScore(selectedAudit).toFixed(1) }}/4
                </span>
              </div>
            </div>
          </div>

          <!-- Photos améliorées avec support Supabase -->
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
                    @error="handleImageError(photo, index)"
                  >
                    <div class="photo-overlay">
                      <v-icon color="white">mdi-magnify</v-icon>
                    </div>
                  </v-img>
                  <v-card-text v-else class="text-center pa-2">
                    <v-icon>mdi-image-broken</v-icon>
                    <div class="text-caption mt-1">Photo indisponible</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Debug info pour les photos -->
            <v-expansion-panels v-if="selectedAudit.photos || selectedAudit.audit_photos" variant="accordion" class="mt-3">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2">mdi-bug</v-icon>
                  Debug photos ({{ getPhotosCount(selectedAudit) }})
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="technical-info">
                    <div v-for="(photo, index) in getPhotos(selectedAudit)" :key="index" class="info-row">
                      <span class="info-label">Photo {{ index + 1 }}:</span>
                      <span class="info-value">{{ photo.name || 'Sans nom' }}</span>
                    </div>
                    <div v-if="selectedAudit.total_photos" class="info-row">
                      <span class="info-label">Total photos DB:</span>
                      <span class="info-value">{{ selectedAudit.total_photos }}</span>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Métadonnées techniques avec vrais statuts -->
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
                  <div class="info-row">
                    <span class="info-label">Statut sync:</span>
                    <span class="info-value">{{ getRealSyncStatusText(selectedAudit) }}</span>
                  </div>
                  <div class="info-row" v-if="getSyncDetails(selectedAudit)">
                    <span class="info-label">Tentatives:</span>
                    <span class="info-value">{{ getSyncDetails(selectedAudit).attempts || 0 }}/{{ getSyncDetails(selectedAudit).maxAttempts || 3 }}</span>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            v-if="getRealSyncStatusText(selectedAudit) === 'Échec'"
            color="warning"
            @click="retryAuditSync(selectedAudit)"
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

    <!-- Dialog détails de sync -->
    <v-dialog v-model="showSyncDetails" max-width="500">
      <v-card>
        <v-card-title>État de synchronisation</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6" class="text-center">
              <div class="text-h4 success--text">{{ safeSyncStats.success }}</div>
              <div class="text-caption">Synchronisés</div>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="text-h4 error--text">{{ safeSyncStats.failed }}</div>
              <div class="text-caption">Échoués</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" class="text-center">
              <div class="text-h4 warning--text">{{ safeSyncStats.pending }}</div>
              <div class="text-caption">En attente</div>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="text-h4 info--text">{{ safeSyncStats.syncing }}</div>
              <div class="text-caption">En cours</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showSyncDetails = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import AuditCard from '@/components/common/AuditCard.vue'

// Router
const router = useRouter()

// Composables avec vrais statuts de sync
const { getAllAudits, deleteAudit: deleteAuditData, syncAllLocalAudits } = useAudits()
const { 
  syncStats, 
  isOnline, 
  getSyncStatus, 
  getSyncDetails,
  retrySync,
  processQueue
} = getGlobalSyncQueue()

// ✅ CORRECTION: Protection défensive pour syncStats
const safeSyncStats = computed(() => syncStats || {
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

// État local
const allAudits = ref([])
const loading = ref(false)
const error = ref(null)

// Dialogs
const showAuditDialog = ref(false)
const showPhotoDialog = ref(false)
const showSyncDetails = ref(false)
const showDeleteDialog = ref(false)

// Sélections
const selectedAudit = ref(null)
const selectedPhoto = ref(null)
const selectedPhotoIndex = ref(0)

// Filtres et pagination
const filterMode = ref('all')
const currentPage = ref(1)
const auditsPerPage = 20
const deleteMode = ref('local-only')

// =====================================================
// FONCTIONS DE FORMATAGE CORRIGÉES (GARDÉES)
// =====================================================

const formatDate = (dateInput) => {
  if (!dateInput) return 'Date inconnue'
  
  try {
    let date
    if (dateInput instanceof Date) date = dateInput
    else if (typeof dateInput === 'number') date = new Date(dateInput)
    else if (typeof dateInput === 'string') date = new Date(dateInput)
    else return 'Format invalide'
    
    if (isNaN(date.getTime())) return 'Date invalide'
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    })
  } catch (error) {
    console.error('Erreur formatage date:', error, 'Input:', dateInput)
    return 'Erreur date'
  }
}

const formatAddress = (audit) => {
  if (audit.address && audit.address !== '') return audit.address
  if (audit.location_text && audit.location_text !== '') return audit.location_text
  if (audit.location && audit.location !== '') return audit.location
  if (audit.latitude && audit.longitude) return `${audit.latitude.toFixed(4)}, ${audit.longitude.toFixed(4)}`
  return 'Position inconnue'
}

const getAuditDate = (audit) => {
  return audit.created_at || audit.createdAt || audit.timestamp || audit.lastUpdate || audit.date || Date.now()
}

const formatLocationLine = (audit) => {
  const address = formatAddress(audit)
  const coordinates = hasCoordinates(audit) 
    ? `${audit.latitude?.toFixed(4) || '0.0000'}, ${audit.longitude?.toFixed(4) || '0.0000'}`
    : null
  const formattedDate = formatDate(getAuditDate(audit))
  
  return coordinates ? 
    `${address} • ${coordinates} • ${formattedDate}` : 
    `${address} • ${formattedDate}`
}

// =====================================================
// FONCTIONS DE STATUT SYNC AVEC VRAIS COMPOSABLES
// =====================================================

const getRealSyncStatusColor = (audit) => {
  const auditId = audit.id || audit.localId
  const queueStatus = getSyncStatus(auditId)
  
  // Priorité aux vrais statuts de la queue
  switch (queueStatus) {
    case 'synced': return 'success'
    case 'syncing': return 'info'
    case 'pending': return 'warning'
    case 'failed': return 'error'
    default:
      // Fallback sur les propriétés de l'audit
      if (audit.synced || audit.source === 'cloud') return 'success'
      if (audit.source === 'local' || audit.localOnly) return 'orange'
      return 'grey'
  }
}

const getRealSyncStatusIcon = (audit) => {
  const auditId = audit.id || audit.localId
  const queueStatus = getSyncStatus(auditId)
  
  switch (queueStatus) {
    case 'synced': return 'mdi-cloud-check'
    case 'syncing': return 'mdi-cloud-sync'
    case 'pending': return 'mdi-cloud-clock'
    case 'failed': return 'mdi-cloud-alert'
    default:
      if (audit.synced || audit.source === 'cloud') return 'mdi-cloud-check'
      return 'mdi-harddisk'
  }
}

const getRealSyncStatusText = (audit) => {
  const auditId = audit.id || audit.localId
  const queueStatus = getSyncStatus(auditId)
  
  switch (queueStatus) {
    case 'synced': return 'Synchronisé'
    case 'syncing': return 'En cours...'
    case 'pending': return 'En attente'
    case 'failed': return 'Échec'
    default:
      if (audit.synced || audit.source === 'cloud') return 'Synchronisé'
      if (audit.source === 'local' || audit.localOnly) return 'En attente'
      return 'Local'
  }
}

// =====================================================
// AUTRES FONCTIONS UTILITAIRES (GARDÉES)
// =====================================================

const hasCoordinates = (audit) => {
  // ✅ CORRIGÉ: Vérifier toutes les sources de coordonnées possibles
  const lat = audit.latitude || audit.coordinates?.lat
  const lng = audit.longitude || audit.coordinates?.lng
  
  return lat && lng && lat !== 0 && lng !== 0
}

const formatCoordinates = (audit) => {
  // ✅ CORRIGÉ: Utiliser la même logique que hasCoordinates
  const lat = audit.latitude || audit.coordinates?.lat
  const lng = audit.longitude || audit.coordinates?.lng
  
  if (lat && lng && lat !== 0 && lng !== 0) {
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`
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

// Computed pour les compteurs de filtres
const allAuditsCount = computed(() => allAudits.value.length)

const syncedCount = computed(() => {
  return allAudits.value.filter(audit => 
    audit.synced || audit.source === 'cloud' || 
    getSyncStatus(audit.id || audit.localId) === 'synced'
  ).length
})

const localCount = computed(() => {
  return allAudits.value.filter(audit => 
    !audit.synced || audit.source === 'local' || 
    ['pending', 'failed', 'local_only'].includes(getSyncStatus(audit.id || audit.localId))
  ).length
})

// Computed avec vrais composables
const filteredAudits = computed(() => {
  let filtered = allAudits.value

  switch (filterMode.value) {
    case 'synced':
      filtered = allAudits.value.filter(audit => 
        audit.synced || audit.source === 'cloud' || 
        getSyncStatus(audit.id || audit.localId) === 'synced'
      )
      break
    case 'local':
      filtered = allAudits.value.filter(audit => 
        !audit.synced || audit.source === 'local' || 
        ['pending', 'failed', 'local_only'].includes(getSyncStatus(audit.id || audit.localId))
      )
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
  return allAudits.value.filter(audit => 
    !audit.synced && audit.source !== 'cloud' && 
    getSyncStatus(audit.id || audit.localId) !== 'synced'
  )
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

// Methods avec vrais composables
const loadAudits = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await getAllAudits()
    if (result.success) {
      allAudits.value = result.audits
      console.log(`📊 ${result.audits.length} audits chargés avec vrais statuts sync`)
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

// Fonction pour obtenir URL photo Supabase
const getPhotoUrl = (storagePath) => {
  if (!storagePath) return null
  // URL publique Supabase Storage
  return `https://xciqkmnnrmejvrtschrh.supabase.co/storage/v1/object/public/audit-photos/${storagePath}`
}

const hasPhotos = (audit) => {
  // Vérifier photos locales ou cloud
  return (audit.photos && audit.photos.length > 0) || 
         (audit.audit_photos && audit.audit_photos.length > 0) ||
         (audit.total_photos && audit.total_photos > 0)
}

const getPhotosCount = (audit) => {
  // Priorité aux photos enrichies, puis total_photos
  if (audit.photos && audit.photos.length > 0) return audit.photos.length
  if (audit.audit_photos && audit.audit_photos.length > 0) return audit.audit_photos.length
  if (audit.total_photos) return audit.total_photos
  return 0
}

const getPhotos = (audit) => {
  // Retourner photos enrichies ou adapter audit_photos
  if (audit.photos && audit.photos.length > 0) {
    return audit.photos
  }
  
  // Si audit_photos de Supabase, les adapter
  if (audit.audit_photos && audit.audit_photos.length > 0) {
    return audit.audit_photos.map(photo => ({
      id: photo.id,
      name: photo.filename,
      data: getPhotoUrl(photo.storage_path),
      originalSize: photo.original_size,
      compressedSize: photo.compressed_size,
      order: photo.upload_order
    }))
  }
  
  return []
}

const openPhotoDialog = (photo, index) => {
  if (photo.data) {
    selectedPhoto.value = photo
    selectedPhotoIndex.value = index
    showPhotoDialog.value = true
  } else {
    console.warn('Photo sans données:', photo)
  }
}

const handleImageError = (photo, index) => {
  console.error(`Erreur chargement photo ${index + 1}:`, photo)
}

// Actions avec vrais composables
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
    const result = await deleteAuditData(audit.id || audit.localId)
    if (result.success) {
      await loadAudits()
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

const syncAllAudits = async () => {
  await syncAllLocalAudits()
  await processQueue()
}

const retryAuditSync = async (audit) => {
  const auditId = audit.id || audit.localId
  await retrySync(auditId)
  if (showAuditDialog.value) {
    showAuditDialog.value = false
  }
}

const exportSingleAudit = () => {
  if (selectedAudit.value) {
    const data = {
      ...selectedAudit.value,
      export_date: new Date().toISOString(),
      formatted_date: formatDate(getAuditDate(selectedAudit.value)),
      formatted_location: formatAddress(selectedAudit.value),
      sync_status: getRealSyncStatusText(selectedAudit.value)
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

const exportAllAudits = () => {
  const data = {
    audits: filteredAudits.value.map(audit => ({
      ...audit,
      formatted_date: formatDate(getAuditDate(audit)),
      formatted_location: formatAddress(audit),
      sync_status: getRealSyncStatusText(audit)
    })),
    export_date: new Date().toISOString(),
    total_count: filteredAudits.value.length,
    filter_applied: filterMode.value,
    sync_summary: {
    success: safeSyncStats.success,
    pending: safeSyncStats.pending,
    failed: safeSyncStats.failed,
    syncing: safeSyncStats.syncing
    }
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
      for (const audit of allAudits.value) {
        await deleteAuditData(audit.id || audit.localId)
      }
    } else {
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

// ✅ NOUVEAU: Setup auto-refresh à la reconnexion
const setupAutoRefresh = () => {
  // Watcher sur l'état de connexion
  watch(isOnline, async (newOnlineStatus, oldOnlineStatus) => {
    // Quand on passe de offline à online
    if (newOnlineStatus && !oldOnlineStatus) {
      console.log('🌐 Reconnexion détectée - Refresh automatique des audits')
      
      // Attendre un peu pour que la connexion se stabilise
      setTimeout(async () => {
        await loadAudits()
        // Déclencher aussi la sync queue
        await processQueue()
      }, 1000)
    }
  })
  
  // Refresh périodique si des audits en attente
  const autoRefreshInterval = setInterval(async () => {
    if (isOnline.value && (safeSyncStats.value.pending > 0 || safeSyncStats.value.syncing > 0)) {
      console.log('🔄 Refresh automatique - Sync en cours')
      await loadAudits()
    }
  }, 10000) // Toutes les 10 secondes
  
  return autoRefreshInterval
}

// Lifecycle
let autoRefreshInterval = null

onMounted(() => {
  console.log('📊 AuditsHistoryView montée avec succès!')
  console.log('🔍 Vérification DOM:', {
    view: document.querySelector('.audits-history-view'),
    container: document.querySelector('.v-container'),
    auditsCount: allAudits.value.length
  })
  
  loadAudits()
  
  // ✅ NOUVEAU: Configurer auto-refresh
  autoRefreshInterval = setupAutoRefresh()
  
  // Écouter événements de force reload
  window.addEventListener('onuf-force-reload', loadAudits)
})

onUnmounted(() => {
  // Nettoyer les intervals et listeners
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }
  window.removeEventListener('onuf-force-reload', loadAudits)
})

// Watchers
watch(filterMode, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.audits-history-view {
  width: 100%; /* ✅ FIX: Ajout de la largeur manquante */
  min-height: 100vh;
  background: var(--onuf-background);
  position: relative;
  display: block;
}

/* Styles pour les filtres et actions */
.filter-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
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

/* ✅ NOUVEAU: Remplacement des v-rating par des cercles personnalisés */
.score-circles {
  display: flex;
  gap: 2px;
  align-items: center;
}

.score-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e0e0e0;
  transition: all 0.2s ease;
}

.score-circle--filled {
  background-color: #F3C348 !important;
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

.cursor-pointer {
  cursor: pointer;
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
  
  .photo-preview {
    margin-bottom: 8px;
  }
  
  .photo-preview:hover {
    transform: none;
  }
}
</style>