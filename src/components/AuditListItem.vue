<!-- src/components/AuditListItem.vue -->
<!-- Item d'audit avec indicateurs de sync détaillés -->
<template>
  <v-card class="audit-item mb-3" :class="{ 'audit-item--syncing': syncDetails?.status === 'syncing' }">
    <v-card-text>
      <div class="d-flex justify-space-between align-start">
        <!-- Informations principales -->
        <div class="flex-grow-1">
          <div class="d-flex align-center mb-2">
            <v-icon :color="locationColor" class="mr-2">
              {{ locationIcon }}
            </v-icon>
            <div>
              <div class="text-body-1 font-weight-medium">{{ audit.location_text || 'Position GPS' }}</div>
              <div class="text-caption text--secondary">
                {{ formattedCoordinates }} • {{ formattedDate }}
              </div>
            </div>
          </div>
          
          <!-- Scores d'audit -->
          <div class="audit-scores mb-2">
            <v-row dense>
              <v-col cols="4" v-for="score in auditScores" :key="score.key">
                <div class="text-center">
                  <v-icon :color="score.color" size="16">{{ score.icon }}</v-icon>
                  <div class="text-caption font-weight-medium">{{ score.value }}/4</div>
                  <div class="text-caption text--secondary">{{ score.label }}</div>
                </div>
              </v-col>
            </v-row>
          </div>
          
          <!-- Photos -->
          <div v-if="audit.total_photos > 0" class="d-flex align-center">
            <v-icon size="16" class="mr-1">mdi-camera</v-icon>
            <span class="text-caption">{{ audit.total_photos }} photo(s)</span>
          </div>
          
          <!-- Commentaire (si présent) -->
          <div v-if="audit.comment" class="text-caption text--secondary mt-1">
            "{{ audit.comment.substring(0, 100) }}{{ audit.comment.length > 100 ? '...' : '' }}"
          </div>
        </div>
        
        <!-- Indicateurs de statut -->
        <div class="ml-3 d-flex flex-column align-center">
          <!-- Statut de synchronisation -->
          <v-tooltip left>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                small
                v-bind="props"
                :color="syncStatusColor"
                @click="handleSyncAction"
                :loading="syncDetails?.status === 'syncing'"
              >
                <v-icon size="20">{{ syncStatusIcon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ syncStatusTooltip }}</span>
          </v-tooltip>
          
          <!-- Score global -->
          <div class="text-center mt-2">
            <div class="text-h6 font-weight-bold" :class="`${globalScoreColor}--text`">
              {{ globalScore.toFixed(1) }}
            </div>
            <div class="text-caption text--secondary">Score</div>
          </div>
        </div>
      </div>
      
      <!-- Barre de progression sync (si en cours) -->
      <v-progress-linear
        v-if="syncDetails?.status === 'syncing'"
        indeterminate
        color="primary"
        height="2"
        class="mt-2"
      />
      
      <!-- Détails d'erreur (si échec) -->
      <v-alert
        v-if="syncDetails?.status === 'failed'"
        type="error"
        text
        dense
        class="mt-2 mb-0"
      >
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-caption font-weight-medium">Échec synchronisation</div>
            <div class="text-caption">{{ syncDetails.error || 'Erreur inconnue' }}</div>
          </div>
          <v-btn
            x-small
            color="error"
            outlined
            @click="retrySync"
            :disabled="!isOnline"
          >
            <v-icon left x-small>mdi-refresh</v-icon>
            Réessayer
          </v-btn>
        </div>
      </v-alert>
      
      <!-- Queue info (si en attente) -->
      <v-alert
        v-if="syncDetails?.status === 'pending'"
        type="warning"
        text
        dense
        class="mt-2 mb-0"
      >
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-caption font-weight-medium">En attente de synchronisation</div>
            <div class="text-caption">
              Tentative {{ syncDetails.attempts }}/{{ syncDetails.maxAttempts }}
              <span v-if="!isOnline"> • Connexion requise</span>
            </div>
          </div>
          <v-btn
            v-if="isOnline"
            x-small
            color="warning"
            outlined
            @click="forceSyncNow"
          >
            <v-icon left x-small>mdi-cloud-upload</v-icon>
            Maintenant
          </v-btn>
        </div>
      </v-alert>
    </v-card-text>
    
    <!-- Actions -->
    <v-card-actions class="pt-0">
      <v-btn
        text
        small
        color="primary"
        @click="viewDetails"
      >
        <v-icon left small>mdi-eye</v-icon>
        Voir détails
      </v-btn>
      
      <v-btn
        v-if="canEdit"
        text
        small
        color="secondary"
        @click="editAudit"
      >
        <v-icon left small>mdi-pencil</v-icon>
        Modifier
      </v-btn>
      
      <v-spacer />
      
      <!-- Menu d'actions -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon small v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        
        <v-list dense>
          <v-list-item @click="shareAudit" :disabled="syncDetails?.status !== 'synced'">
            <template v-slot:prepend>
              <v-icon>mdi-share</v-icon>
            </template>
            <v-list-item-title>Partager</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="exportAudit">
            <template v-slot:prepend>
              <v-icon>mdi-download</v-icon>
            </template>
            <v-list-item-title>Exporter</v-list-item-title>
          </v-list-item>
          
          <v-divider />
          
          <v-list-item @click="deleteAudit" class="text-error">
            <template v-slot:prepend>
              <v-icon color="error">mdi-delete</v-icon>
            </template>
            <v-list-item-title>Supprimer</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script>
import { computed } from 'vue'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'

export default {
  name: 'AuditListItem',
  props: {
    audit: {
      type: Object,
      required: true
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  emits: ['view-details', 'edit', 'delete', 'share'],
  setup(props, { emit }) {
    const { 
      getSyncStatus, 
      getSyncDetails, 
      retrySync: retrySyncQueue,
      processQueue,
      isOnline,
      SYNC_STATUS 
    } = getGlobalSyncQueue()
    
    // Détails de synchronisation
    const syncDetails = computed(() => {
      return getSyncDetails(props.audit.id)
    })
    
    const syncStatus = computed(() => {
      return getSyncStatus(props.audit.id)
    })
    
    // Formatage des données
    const formattedCoordinates = computed(() => {
      if (!props.audit.latitude || !props.audit.longitude) return 'Position inconnue'
      return `${props.audit.latitude.toFixed(4)}, ${props.audit.longitude.toFixed(4)}`
    })
    
    const formattedDate = computed(() => {
      const date = new Date(props.audit.created_at)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    })
    
    // Scores d'audit - Afficher 4 critères principaux
    const auditScores = computed(() => [
      { 
        key: 'lighting', 
        value: props.audit.lighting || 0, 
        label: 'Éclairage',
        icon: 'mdi-lightbulb',
        color: getScoreColor(props.audit.lighting)
      },
      { 
        key: 'feeling', 
        value: props.audit.feeling || 0, 
        label: 'Ressenti',
        icon: 'mdi-emoticon',
        color: getScoreColor(props.audit.feeling)
      },
      { 
        key: 'natural_surveillance', 
        value: props.audit.natural_surveillance || props.audit.naturalSurveillance || 0, 
        label: 'Surveillance',
        icon: 'mdi-eye-outline',
        color: getScoreColor(props.audit.natural_surveillance || props.audit.naturalSurveillance)
      },
      { 
        key: 'formal_security', 
        value: props.audit.formal_security || props.audit.formalSecurity || 0, 
        label: 'Sécurité',
        icon: 'mdi-shield-account',
        color: getScoreColor(props.audit.formal_security || props.audit.formalSecurity)
      }
    ])
    
    // Calcul du score global sur 10 critères
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
    
    const globalScoreColor = computed(() => {
      return getScoreColor(globalScore.value)
    })
    
    // Indicateurs de localisation
    const locationIcon = computed(() => {
      const accuracy = props.audit.location_accuracy
      if (!accuracy) return 'mdi-map-marker-question'
      if (accuracy <= 10) return 'mdi-crosshairs-gps'
      if (accuracy <= 50) return 'mdi-map-marker-check'
      return 'mdi-map-marker-alert'
    })
    
    const locationColor = computed(() => {
      const accuracy = props.audit.location_accuracy
      if (!accuracy) return 'grey'
      if (accuracy <= 10) return 'success'
      if (accuracy <= 50) return 'primary'
      return 'warning'
    })
    
    // Indicateurs de sync
    const syncStatusColor = computed(() => {
      switch (syncStatus.value) {
        case SYNC_STATUS.SYNCED: return 'success'
        case SYNC_STATUS.SYNCING: return 'info'
        case SYNC_STATUS.PENDING: return 'warning'
        case SYNC_STATUS.FAILED: return 'error'
        default: return 'grey'
      }
    })
    
    const syncStatusIcon = computed(() => {
      switch (syncStatus.value) {
        case SYNC_STATUS.SYNCED: return 'mdi-cloud-check'
        case SYNC_STATUS.SYNCING: return 'mdi-cloud-sync'
        case SYNC_STATUS.PENDING: return 'mdi-cloud-clock'
        case SYNC_STATUS.FAILED: return 'mdi-cloud-alert'
        default: return 'mdi-cloud-off'
      }
    })
    
    const syncStatusTooltip = computed(() => {
      switch (syncStatus.value) {
        case SYNC_STATUS.SYNCED: return 'Synchronisé avec le cloud'
        case SYNC_STATUS.SYNCING: return 'Synchronisation en cours...'
        case SYNC_STATUS.PENDING: return 'En attente de synchronisation'
        case SYNC_STATUS.FAILED: return 'Échec synchronisation - Cliquer pour réessayer'
        default: return 'Sauvegardé localement uniquement'
      }
    })
    
    // Méthodes utilitaires
    const getScoreColor = (score) => {
      if (!score || score <= 0) return 'grey'
      if (score <= 1) return 'error'
      if (score <= 2) return 'warning'
      if (score <= 3) return 'primary'
      return 'success'
    }
    
    // Actions
    const handleSyncAction = () => {
      if (syncStatus.value === SYNC_STATUS.FAILED) {
        retrySync()
      } else if (syncStatus.value === SYNC_STATUS.PENDING && isOnline.value) {
        forceSyncNow()
      }
    }
    
    const retrySync = async () => {
      await retrySyncQueue(props.audit.id)
    }
    
    const forceSyncNow = async () => {
      await processQueue()
    }
    
    const viewDetails = () => {
      emit('view-details', props.audit)
    }
    
    const editAudit = () => {
      emit('edit', props.audit)
    }
    
    const shareAudit = () => {
      emit('share', props.audit)
    }
    
    const exportAudit = () => {
      // Créer et télécharger un fichier JSON de l'audit
      const data = {
        ...props.audit,
        export_date: new Date().toISOString(),
        app_version: import.meta.env.VITE_APP_VERSION
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_${props.audit.id.substring(0, 8)}_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    const deleteAudit = () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet audit ?')) {
        emit('delete', props.audit)
      }
    }
    
    return {
      // Data
      syncDetails,
      syncStatus,
      isOnline,
      
      // Computed
      formattedCoordinates,
      formattedDate,
      auditScores,
      globalScore,
      globalScoreColor,
      locationIcon,
      locationColor,
      syncStatusColor,
      syncStatusIcon,
      syncStatusTooltip,
      
      // Methods
      handleSyncAction,
      retrySync,
      forceSyncNow,
      viewDetails,
      editAudit,
      shareAudit,
      exportAudit,
      deleteAudit
    }
  }
}
</script>

<style scoped>
.audit-item {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.audit-item--syncing {
  border-left-color: var(--v-info-base);
  background-color: rgba(33, 150, 243, 0.05);
}

.audit-scores {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 8px;
}

.audit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}
</style>
