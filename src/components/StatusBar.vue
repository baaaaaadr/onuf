<!-- src/components/StatusBar.vue -->
<!-- Barre de statut unifiée avec tous les indicateurs -->
<template>
  <v-app-bar
    app
    color="primary"
    dark
    prominent
    class="status-bar"
  >
    <!-- Ligne principale -->
    <div class="d-flex align-center justify-space-between w-100">
      <!-- Gauche: Logo + Titre -->
      <div class="d-flex align-center">
        <v-btn
          icon
          @click="goBack"
          v-if="showBackButton"
          class="mr-2"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        
        <v-icon class="mr-2" size="28">mdi-shield-check</v-icon>
        <div>
          <div class="text-h6 font-weight-bold">{{ appTitle }}</div>
          <div class="text-caption opacity-80" v-if="pageTitle">{{ pageTitle }}</div>
        </div>
      </div>

      <!-- Droite: Indicateurs de statut -->
      <div class="d-flex align-center gap-2">
        <!-- Indicateur de sync -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              small
              v-bind="props"
              @click="showSyncDialog = true"
              :color="syncIndicatorColor"
            >
              <v-icon size="20">{{ syncIcon }}</v-icon>
              <v-badge
                v-if="syncStats.pending > 0 || syncStats.failed > 0"
                :content="syncStats.pending + syncStats.failed"
                color="error"
                overlap
                offset-x="10"
                offset-y="10"
              />
            </v-btn>
          </template>
          <span>{{ syncTooltip }}</span>
        </v-tooltip>

        <!-- Indicateur réseau -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              :color="networkColor"
              size="20"
            >
              {{ networkIcon }}
            </v-icon>
          </template>
          <span>{{ isOnline ? 'En ligne' : 'Hors ligne' }}</span>
        </v-tooltip>

        <!-- Indicateur GPS -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              small
              v-bind="props"
              @click="toggleGpsDetails"
              :color="gpsAccuracyLevel.color"
            >
              <v-icon size="20">{{ gpsAccuracyLevel.icon }}</v-icon>
            </v-btn>
          </template>
          <span>
            GPS: {{ gpsAccuracyLevel.text }}
            <span v-if="formattedPosition">
              ({{ formattedPosition.accuracy }})
            </span>
          </span>
        </v-tooltip>

        <!-- Menu utilisateur -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
            >
              <v-avatar size="32" color="secondary">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ currentUser?.display_name || 'Utilisateur' }}</v-list-item-title>
              <v-list-item-subtitle>{{ currentUser?.username }}</v-list-item-subtitle>
            </v-list-item>
            
            <v-divider />
            
            <v-list-item @click="$router.push('/profile')">
              <template v-slot:prepend>
                <v-icon>mdi-account-settings</v-icon>
              </template>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="logout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Barre de progression sync (si sync en cours) -->
    <v-progress-linear
      v-if="syncStats.syncing > 0"
      :value="syncProgress"
      color="accent"
      height="2"
      class="sync-progress"
    />
  </v-app-bar>

  <!-- Dialog détails GPS -->
  <v-dialog v-model="showGpsDetails" max-width="400">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" :color="gpsAccuracyLevel.color">
          {{ gpsAccuracyLevel.icon }}
        </v-icon>
        Géolocalisation GPS
      </v-card-title>
      
      <v-card-text>
        <div v-if="currentPosition" class="gps-details">
          <v-row>
            <v-col cols="6">
              <div class="text-caption text--secondary">Latitude</div>
              <div class="text-body-1 font-weight-medium">{{ formattedPosition.lat }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text--secondary">Longitude</div>
              <div class="text-body-1 font-weight-medium">{{ formattedPosition.lng }}</div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="6">
              <div class="text-caption text--secondary">Précision</div>
              <div class="text-body-1" :class="`${gpsAccuracyLevel.color}--text`">
                {{ formattedPosition.accuracy }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text--secondary">Qualité</div>
              <div class="text-body-1" :class="`${gpsAccuracyLevel.color}--text`">
                {{ gpsAccuracyLevel.text }}
              </div>
            </v-col>
          </v-row>
          
          <v-row v-if="lastUpdate">
            <v-col cols="12">
              <div class="text-caption text--secondary">Dernière mise à jour</div>
              <div class="text-body-2">{{ formatLastUpdate }}</div>
            </v-col>
          </v-row>
        </div>
        
        <div v-else class="text-center py-4">
          <v-icon size="48" color="grey">mdi-map-marker-off</v-icon>
          <div class="text-body-1 mt-2">Position GPS non disponible</div>
          <div class="text-caption text--secondary">
            {{ error || 'Activation de la géolocalisation en cours...' }}
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-btn
          text
          @click="refreshGps"
          :loading="isTracking"
          color="primary"
        >
          <v-icon left>mdi-refresh</v-icon>
          Actualiser
        </v-btn>
        <v-spacer />
        <v-btn text @click="showGpsDetails = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog détails sync -->
  <v-dialog v-model="showSyncDialog" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" :color="syncIndicatorColor">{{ syncIcon }}</v-icon>
        Synchronisation Cloud
      </v-card-title>
      
      <v-card-text>
        <!-- Statistiques globales -->
        <div class="sync-stats mb-4">
          <v-row>
            <v-col cols="3" class="text-center">
              <div class="text-h4 success--text">{{ syncStats.success }}</div>
              <div class="text-caption">Synchronisés</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 warning--text">{{ syncStats.pending }}</div>
              <div class="text-caption">En attente</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 info--text">{{ syncStats.syncing }}</div>
              <div class="text-caption">En cours</div>
            </v-col>
            <v-col cols="3" class="text-center">
              <div class="text-h4 error--text">{{ syncStats.failed }}</div>
              <div class="text-caption">Échoués</div>
            </v-col>
          </v-row>
        </div>

        <!-- Statut réseau -->
        <v-alert
          :type="isOnline ? 'success' : 'warning'"
          text
          dense
          class="mb-3"
        >
          <span v-if="isOnline">
            ✅ Connecté - Synchronisation automatique active
          </span>
          <span v-else>
            📴 Hors ligne - Les audits seront synchronisés à la reconnexion
          </span>
        </v-alert>

        <!-- Dernière sync -->
        <div v-if="lastSync" class="text-caption text--secondary mb-3">
          Dernière synchronisation: {{ formatTime(lastSync) }}
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2">
          <v-btn
            small
            color="primary"
            @click="manualSync"
            :loading="syncStats.syncing > 0"
            :disabled="!isOnline"
          >
            <v-icon left small>mdi-cloud-sync</v-icon>
            Synchroniser maintenant
          </v-btn>
          
          <v-btn
            small
            color="warning"
            @click="retryFailed"
            :disabled="syncStats.failed === 0 || !isOnline"
          >
            <v-icon left small>mdi-refresh</v-icon>
            Réessayer ({{ syncStats.failed }})
          </v-btn>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="showSyncDialog = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useSupabase'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import { globalGeolocation } from '@/composables/useGeolocation'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'StatusBar',
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    showBackButton: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    // Composables
    const { currentUser, logout: authLogout } = useAuth()
    const { 
      syncStats, 
      isOnline, 
      lastSync,
      hasFailedItems,
      hasPendingItems,
      syncProgress,
      processQueue,
      retryAllFailed
    } = getGlobalSyncQueue()
    
    const {
      currentPosition,
      accuracy,
      isTracking,
      lastUpdate,
      error,
      accuracyLevel: gpsAccuracyLevel,
      formattedPosition,
      getCurrentPosition
    } = globalGeolocation
    
    // État local
    const showSyncDialog = ref(false)
    const showGpsDetails = ref(false)
    
    // Computed
    const appTitle = computed(() => {
      return import.meta.env.VITE_APP_TITLE || 'ONUF - Agadir'
    })
    
    const syncIndicatorColor = computed(() => {
      if (syncStats.syncing > 0) return 'info'
      if (syncStats.failed > 0) return 'error'
      if (syncStats.pending > 0) return 'warning'
      return 'success'
    })
    
    const syncIcon = computed(() => {
      if (syncStats.syncing > 0) return 'mdi-cloud-sync'
      if (syncStats.failed > 0) return 'mdi-cloud-alert'
      if (syncStats.pending > 0) return 'mdi-cloud-clock'
      return 'mdi-cloud-check'
    })
    
    const syncTooltip = computed(() => {
      if (syncStats.syncing > 0) return `Synchronisation en cours (${syncStats.syncing})`
      if (syncStats.failed > 0) return `${syncStats.failed} audit(s) échoué(s)`
      if (syncStats.pending > 0) return `${syncStats.pending} audit(s) en attente`
      return 'Tous les audits sont synchronisés'
    })
    
    const networkColor = computed(() => {
      return isOnline.value ? 'success' : 'error'
    })
    
    const networkIcon = computed(() => {
      return isOnline.value ? 'mdi-wifi' : 'mdi-wifi-off'
    })
    
    const formatLastUpdate = computed(() => {
      if (!lastUpdate.value) return 'Jamais'
      return formatTime(lastUpdate.value)
    })
    
    // Méthodes
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }
    
    const logout = async () => {
      await authLogout()
      router.push('/login')
    }
    
    const toggleGpsDetails = () => {
      showGpsDetails.value = !showGpsDetails.value
    }
    
    const refreshGps = async () => {
      try {
        await getCurrentPosition()
      } catch (error) {
        console.error('Erreur actualisation GPS:', error)
      }
    }
    
    const manualSync = async () => {
      await processQueue()
    }
    
    const retryFailed = async () => {
      const retried = await retryAllFailed()
      if (retried > 0) {
        console.log(`🔁 ${retried} audit(s) remis en queue`)
      }
    }
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'À l\'instant'
      if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)}min`
      if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    return {
      // Data
      currentUser,
      showSyncDialog,
      showGpsDetails,
      
      // Sync
      syncStats,
      isOnline,
      lastSync,
      syncProgress,
      
      // GPS
      currentPosition,
      accuracy,
      isTracking,
      lastUpdate,
      error,
      gpsAccuracyLevel,
      formattedPosition,
      
      // Computed
      appTitle,
      syncIndicatorColor,
      syncIcon,
      syncTooltip,
      networkColor,
      networkIcon,
      formatLastUpdate,
      
      // Methods
      goBack,
      logout,
      toggleGpsDetails,
      refreshGps,
      manualSync,
      retryFailed,
      formatTime
    }
  }
}
</script>

<style scoped>
.status-bar {
  position: relative;
}

.sync-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.gap-2 > * + * {
  margin-left: 8px;
}

.gps-details .row {
  margin-bottom: 8px;
}

.sync-stats .text-h4 {
  font-weight: 600;
}
</style>
