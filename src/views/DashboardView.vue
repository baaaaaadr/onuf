<template>
  <div class="dashboard-view">
    <!-- Container principal -->
    <v-container class="dashboard-container pa-4" fluid>
      <!-- En-tête de bienvenue -->
      <div class="welcome-header mb-6 text-center">
        <h1 class="welcome-title text-h4 font-weight-bold mb-2">
          MANARA
        </h1>
        <p class="welcome-subtitle text-body-1 text-secondary">
          Bonjour {{ userDisplayName }} !
        </p>
        <p class="text-caption text-medium-emphasis">
          Votre solution de gestion urbaine intelligente
        </p>
      </div>

      <!-- Statistiques rapides -->
      <section class="stats-section mb-6">
        <h2 class="section-title text-h6 font-weight-semibold mb-3">
          Vos contributions
        </h2>
        
        <v-row class="stats-grid" dense>
          <v-col cols="12">
            <StatCard
              label="Audits Réalisés"
              :value="stats.totalAudits"
              :subtitle="stats.totalAudits > 0 ? 'Merci !' : 'Commencez maintenant'"
              :icon="stats.totalAudits > 0 ? 'mdi-check-circle' : 'mdi-clipboard-plus'"
              :color="stats.totalAudits > 0 ? 'success' : 'surface'"
              size="large"
              variant="elevated"
              @click="viewHistory"
              :clickable="stats.totalAudits > 0"
            />
          </v-col>
        </v-row>

        <v-row v-if="stats.totalAudits > 0" class="mt-2" dense>
          <v-col cols="12">
            <StatCard
              label="Dernier Audit"
              :value="stats.lastAuditDate"
              :subtitle="stats.lastAuditLocation"
              icon="mdi-clock-outline"
              color="surface"
              size="small"
              variant="tonal"
              @click="viewHistory"
              clickable
            />
          </v-col>
        </v-row>
      </section>

      <!-- Actions rapides -->
      <section class="actions-section mb-6">
        <h2 class="section-title text-h6 font-weight-semibold mb-3">
          Actions rapides
        </h2>
        
        <div class="actions-grid">
          <!-- Action principale -->
          <v-btn
            color="primary"
            size="x-large"
            rounded="pill"
            block
            class="main-action-btn mb-3"
            @click="startNewAudit"
          >
            <v-icon start size="24">mdi-plus-circle</v-icon>
            Démarrer un Audit
          </v-btn>
          
          <!-- Action secondaire -->
          <v-btn
            color="surface"
            size="large"
            rounded="pill"
            block
            variant="elevated"
            @click="viewHistory"
            :disabled="stats.totalAudits === 0"
          >
            <v-icon start>mdi-history</v-icon>
            Historique
          </v-btn>
        </div>
      </section>

      <!-- Statut système -->
      <section class="system-section mb-6">
        <h2 class="section-title text-h6 font-weight-semibold mb-3">
          Statut système
        </h2>
        
        <v-list class="system-list" rounded="lg">
          <!-- Synchronisation -->
          <v-list-item
            @click="showSyncDetails = true"
            class="system-item"
          >
            <template #prepend>
              <v-icon :color="syncStatusColor">{{ syncStatusIcon }}</v-icon>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              Synchronisation Cloud
            </v-list-item-title>
            
            <v-list-item-subtitle>
              {{ syncStatusText }}
            </v-list-item-subtitle>
            
            <template #append>
              <v-chip
              v-if="hasSyncIssues"
              color="warning"
              size="x-small"
              variant="tonal"
              >
              {{ safeSyncStats.pending + safeSyncStats.failed }}
              </v-chip>
              <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
          
          <v-divider />
          
          <!-- Connectivité -->
          <v-list-item class="system-item">
            <template #prepend>
              <v-icon :color="isOnline ? 'success' : 'error'">
                {{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}
              </v-icon>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              Connectivité Réseau
            </v-list-item-title>
            
            <v-list-item-subtitle>
              {{ isOnline ? 'Connecté' : 'Hors ligne' }}
            </v-list-item-subtitle>
            
            <template #append>
              <v-chip
                :color="isOnline ? 'success' : 'error'"
                size="x-small"
                variant="tonal"
              >
                {{ isOnline ? 'En ligne' : 'Offline' }}
              </v-chip>
            </template>
          </v-list-item>
          
          <v-divider />
          
          <!-- GPS -->
          <v-list-item
            @click="showGpsInfo = true"
            class="system-item"
          >
            <template #prepend>
              <v-icon :color="gpsStatusColor">{{ gpsStatusIcon }}</v-icon>
            </template>
            
            <v-list-item-title class="font-weight-medium">
              Géolocalisation GPS
            </v-list-item-title>
            
            <v-list-item-subtitle>
              {{ gpsStatusText }}
            </v-list-item-subtitle>
            
            <template #append>
              <v-chip
                :color="gpsStatusColor"
                size="x-small"
                variant="tonal"
              >
                {{ safeGpsAccuracyLevel && safeGpsAccuracyLevel.value && safeGpsAccuracyLevel.value.text ? safeGpsAccuracyLevel.value.text : 'Inconnu' }}
              </v-chip>
              <v-icon color="grey-lighten-1">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </section>

      <!-- Guide rapide (si premier utilisateur) -->
      <section v-if="stats.totalAudits === 0" class="guide-section">
        <v-card color="primary" variant="tonal" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2" color="primary">mdi-lightbulb-outline</v-icon>
              <span class="text-h6 font-weight-semibold">Première visite ?</span>
            </div>
            
            <p class="text-body-2 mb-3">
              Découvrez comment contribuer à la sécurité urbaine d'Agadir en quelques étapes simples.
            </p>
            
            <v-btn
              color="primary"
              size="small"
              rounded="pill"
              @click="showOnboarding = true"
            >
              <v-icon start>mdi-play</v-icon>
              Guide de démarrage
            </v-btn>
          </v-card-text>
        </v-card>
      </section>
    </v-container>

    <!-- Dialog infos GPS -->
    <v-dialog v-model="showGpsInfo" max-width="500" rounded="lg">
      <v-card rounded="lg">
        <v-card-title class="pa-6">
          <v-icon class="mr-3" :color="gpsStatusColor">{{ gpsStatusIcon }}</v-icon>
          Géolocalisation GPS
        </v-card-title>
        
        <v-card-text class="px-6">
          <!-- Statut actuel -->
          <div class="gps-status mb-4">
            <v-chip
              :color="gpsStatusColor"
              variant="tonal"
              size="large"
              class="mb-3"
            >
              <v-icon start>{{ gpsStatusIcon }}</v-icon>
              {{ safeGpsAccuracyLevel && safeGpsAccuracyLevel.value && safeGpsAccuracyLevel.value.text ? safeGpsAccuracyLevel.value.text : 'Inconnu' }}
            </v-chip>
            
            <div v-if="safeCurrentPosition && safeCurrentPosition.value" class="gps-details">
              <div class="text-body-2 mb-2">
                <strong>Position actuelle :</strong><br>
                {{ safeFormattedPosition && safeFormattedPosition.value && safeFormattedPosition.value.lat ? safeFormattedPosition.value.lat : '0' }}, {{ safeFormattedPosition && safeFormattedPosition.value && safeFormattedPosition.value.lng ? safeFormattedPosition.value.lng : '0' }}
              </div>
              <div class="text-body-2 mb-2">
                <strong>Précision :</strong> {{ safeFormattedPosition && safeFormattedPosition.value && safeFormattedPosition.value.accuracy ? safeFormattedPosition.value.accuracy : 'Inconnue' }}
              </div>
              <div class="text-caption text-secondary">
                Dernière mise à jour : {{ formatLastUpdate }}
              </div>
            </div>
            
            <div v-else class="text-body-2 text-secondary">
              {{ safeError && safeError.value ? safeError.value : 'Géolocalisation en cours d\'activation...' }}
            </div>
          </div>
          
          <!-- Conseils -->
          <v-expansion-panels variant="accordion" class="gps-tips">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-2 font-weight-medium">
                <v-icon class="mr-2">mdi-help-circle-outline</v-icon>
                Comment améliorer la précision ?
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-2">
                <div class="tips-content">
                  <p><strong>📱 Sur mobile :</strong></p>
                  <ul class="tips-list">
                    <li>Activez "Haute précision" dans les paramètres de localisation</li>
                    <li>Autorisez l'accès GPS pour cette application</li>
                    <li>Sortez à l'extérieur (évitez les toits et bâtiments)</li>
                    <li>Attendez 30-60 secondes pour la synchronisation</li>
                  </ul>
                  
                  <p class="mt-3"><strong>💻 Sur ordinateur :</strong></p>
                  <ul class="tips-list">
                    <li>Utilisez Chrome ou Firefox récent</li>
                    <li>Cliquez "Autoriser" quand demandé</li>
                    <li>La précision sera limitée (WiFi/IP)</li>
                    <li>Préférez votre mobile pour plus de précision</li>
                  </ul>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="primary"
            @click="refreshGps"
            :loading="safeIsTrackingGps && safeIsTrackingGps.value"
          >
            <v-icon start>mdi-refresh</v-icon>
            Actualiser
          </v-btn>
          
          <v-spacer />
          
          <v-btn variant="text" @click="showGpsInfo = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog détails sync -->
    <v-dialog v-model="showSyncDetails" max-width="400" rounded="lg">
      <v-card rounded="lg">
        <v-card-title class="pa-6">
          <v-icon class="mr-3" :color="syncStatusColor">{{ syncStatusIcon }}</v-icon>
          Synchronisation
        </v-card-title>
        
        <v-card-text class="px-6">
          <!-- Stats -->
          <div class="sync-stats-grid mb-4">
            <div class="sync-stat">
              <div class="sync-stat-value text-success">{{ safeSyncStats.success }}</div>
              <div class="sync-stat-label">Synchronisés</div>
            </div>
            <div class="sync-stat">
              <div class="sync-stat-value text-warning">{{ safeSyncStats.pending }}</div>
              <div class="sync-stat-label">En attente</div>
            </div>
            <div class="sync-stat">
              <div class="sync-stat-value text-error">{{ safeSyncStats.failed }}</div>
              <div class="sync-stat-label">Échoués</div>
            </div>
          </div>

          <v-alert
            :type="isOnline ? 'success' : 'warning'"
            variant="tonal"
            density="compact"
            class="mb-4"
          >
            {{ isOnline ? '✅ Connecté - Synchronisation automatique' : '📴 Hors ligne - Sync différée' }}
          </v-alert>

          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              size="small"
              @click="manualSync"
              :loading="isSyncing"
              :disabled="!isOnline"
            >
              <v-icon start>mdi-cloud-sync</v-icon>
              Synchroniser
            </v-btn>
            
            <v-btn
              v-if="safeSyncStats.failed > 0"
              color="warning"
              variant="tonal"
              size="small"
              @click="retryFailed"
              :disabled="!isOnline"
            >
              <v-icon start>mdi-refresh</v-icon>
              Réessayer
            </v-btn>
          </div>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="text" @click="showSyncDetails = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog onboarding -->
    <v-dialog v-model="showOnboarding" max-width="600" rounded="lg">
      <v-card rounded="lg">
        <v-card-title class="pa-6 text-center">
          <div class="onboarding-icon mb-3">🎯</div>
          <div class="text-h5 font-weight-bold">
            Bienvenue dans ONUF !
          </div>
        </v-card-title>
        
        <v-card-text class="px-6">
          <div class="onboarding-steps">
            <div class="onboarding-step mb-4">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3 class="text-h6 font-weight-semibold mb-2">📍 Activez votre GPS</h3>
                <p class="text-body-2">
                  Pour contextualiser vos audits de sécurité, l'application a besoin de votre position.
                </p>
              </div>
            </div>
            
            <div class="onboarding-step mb-4">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3 class="text-h6 font-weight-semibold mb-2">🔍 Observez votre environnement</h3>
                <p class="text-body-2">
                  Évaluez les aspects de sécurité : éclairage, cheminement, ouverture, ressenti...
                </p>
              </div>
            </div>
            
            <div class="onboarding-step mb-4">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3 class="text-h6 font-weight-semibold mb-2">📱 Répondez aux questions</h3>
                <p class="text-body-2">
                  Interface simple avec emojis et choix visuels. Prise de photos optionnelle.
                </p>
              </div>
            </div>
            
            <div class="onboarding-step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3 class="text-h6 font-weight-semibold mb-2">☁️ Synchronisation automatique</h3>
                <p class="text-body-2">
                  Vos données sont sauvegardées localement et synchronisées quand possible.
                </p>
              </div>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="primary"
            size="large"
            rounded="pill"
            block
            @click="startFirstAudit"
          >
            <v-icon start>mdi-rocket-launch</v-icon>
            Commencer mon premier audit !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import { globalGeolocation } from '@/composables/useGeolocation'
import StatCard from '@/components/common/StatCard.vue'

// Router et composables
const router = useRouter()
const { currentUser } = useAuth()
const { getAuditsStats } = useAudits()
const { 
  syncStats, 
  isOnline, 
  processQueue,
  retryAllFailed
} = getGlobalSyncQueue()

const {
  currentPosition,
  isTracking: isTrackingGps,
  error,
  accuracyLevel: gpsAccuracyLevel,
  formattedPosition,
  getCurrentPosition
} = globalGeolocation || {}

// Protection supplémentaire pour les refs GPS
const safeCurrentPosition = currentPosition || ref(null)
const safeIsTrackingGps = isTrackingGps || ref(false)
const safeError = error || ref(null)
const safeGpsAccuracyLevel = gpsAccuracyLevel || ref({ text: 'Inconnu', color: 'grey', icon: 'mdi-crosshairs-gps' })
const safeFormattedPosition = formattedPosition || ref({ lat: '0', lng: '0', accuracy: 'Inconnue' })
const safeGetCurrentPosition = getCurrentPosition || (() => Promise.resolve())

// État local
const stats = ref({
  totalAudits: 0,
  averageScore: 0,
  lastAuditDate: 'Aucun audit',
  lastAuditLocation: ''
})

const showGpsInfo = ref(false)
const showSyncDetails = ref(false)
const showOnboarding = ref(false)

// Computed
const userDisplayName = computed(() => {
  // Check if the user object has a display_name or username property
  // If not, fall back to the user's email (without the domain) or 'Utilisateur'
  if (currentUser.value?.display_name) {
    return currentUser.value.display_name;
  } else if (currentUser.value?.username) {
    return currentUser.value.username;
  } else if (currentUser.value?.email) {
    // Return the part before the @ in the email
    return currentUser.value.email.split('@')[0];
  }
  return 'Utilisateur';
})

// ✅ CORRECTION: syncStats est un objet reactive, pas une ref
const safeSyncStats = computed(() => {
  // S'assurer qu'on a toujours un objet valide
  // syncStats peut être undefined au démarrage
  if (!syncStats) {
    return {
      pending: 0,
      syncing: 0,
      failed: 0,
      success: 0
    }
  }
  
  return {
    pending: syncStats.pending || 0,
    syncing: syncStats.syncing || 0,
    failed: syncStats.failed || 0,
    success: syncStats.success || 0
  }
})

// Statut sync
const syncStatusColor = computed(() => {
  if (safeSyncStats.value.syncing > 0) return 'info'
  if (safeSyncStats.value.failed > 0) return 'error'
  if (safeSyncStats.value.pending > 0) return 'warning'
  return 'success'
})

const syncStatusIcon = computed(() => {
  if (safeSyncStats.value.syncing > 0) return 'mdi-cloud-sync'
  if (safeSyncStats.value.failed > 0) return 'mdi-cloud-alert'
  if (safeSyncStats.value.pending > 0) return 'mdi-cloud-clock'
  return 'mdi-cloud-check'
})

const syncStatusText = computed(() => {
  if (safeSyncStats.value.syncing > 0) return 'Synchronisation en cours...'
  if (safeSyncStats.value.failed > 0) return `${safeSyncStats.value.failed} audit(s) échoué(s)`
  if (safeSyncStats.value.pending > 0) return `${safeSyncStats.value.pending} audit(s) en attente`
  return 'Tous les audits sont synchronisés'
})

const hasSyncIssues = computed(() => {
  return safeSyncStats.value.failed > 0 || safeSyncStats.value.pending > 5
})

const isSyncing = computed(() => safeSyncStats.value.syncing > 0)

// Statut GPS
const gpsStatusColor = computed(() => {
  if (!safeGpsAccuracyLevel || !safeGpsAccuracyLevel.value) {
    return 'grey'
  }
  return safeGpsAccuracyLevel.value.color || 'grey'
})

const gpsStatusIcon = computed(() => {
  if (!safeGpsAccuracyLevel || !safeGpsAccuracyLevel.value) {
    return 'mdi-crosshairs-gps'
  }
  return safeGpsAccuracyLevel.value.icon || 'mdi-crosshairs-gps'
})

const gpsStatusText = computed(() => {
  if (safeCurrentPosition && safeCurrentPosition.value) {
    const accuracy = safeFormattedPosition && safeFormattedPosition.value ? safeFormattedPosition.value.accuracy : 'Inconnue'
    return `Précision: ${accuracy}`
  }
  const errorText = safeError && safeError.value ? safeError.value : 'Activation en cours...'
  return errorText
})

const formatLastUpdate = computed(() => {
  // Implémenter le formatage de la dernière mise à jour GPS
  return 'À l\'instant'
})

// Utilitaires score
const getScoreQuality = (score) => {
  if (score === 0) return 'Pas encore d\'audit'
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Bon'
  if (score >= 40) return 'Moyen'
  return 'À améliorer'
}

const getScoreColor = (score) => {
  if (score === 0) return 'surface'
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  if (score >= 40) return 'warning'
  return 'error'
}

// Méthodes
const loadStats = async () => {
  try {
    const auditsStatsResult = await getAuditsStats()
    if (auditsStatsResult.success) {
      const auditsStats = auditsStatsResult.stats
      stats.value = {
        totalAudits: auditsStats.totalAudits || 0,
        averageScore: Math.round(auditsStats.averageScore || 0),
        lastAuditDate: auditsStats.lastAuditDate || 'Aucun audit',
        lastAuditLocation: auditsStats.lastAuditLocation || ''
      }
    }
  } catch (error) {
    console.error('Erreur chargement stats:', error)
  }
}

const startNewAudit = () => {
  router.push('/audit')
}

const startFirstAudit = () => {
  showOnboarding.value = false
  router.push('/audit')
}

const viewHistory = () => {
  if (stats.value.totalAudits > 0) {
    router.push('/history')
  }
}

const refreshGps = async () => {
  try {
    await safeGetCurrentPosition()
  } catch (error) {
    console.error('Erreur actualisation GPS:', error)
  }
}

const manualSync = async () => {
  await processQueue()
}

const retryFailed = async () => {
  await retryAllFailed()
}

// Lifecycle
onMounted(async () => {
  console.log('📊 Dashboard monté - Chargement des stats')
  console.log('🔍 Vérification visibilité:', {
    element: document.querySelector('.dashboard-view'),
    container: document.querySelector('.dashboard-container'),
    statCards: document.querySelectorAll('.stat-card').length
  })
  await loadStats()
})
</script>

<style scoped>
.dashboard-view {
  width: 100%; /* ✅ FIX: Ajout de la largeur manquante */
  min-height: 100vh;
  background: var(--onuf-background);
  position: relative;
  display: block;
}

.dashboard-container {
  max-width: 428px;
  margin: 0 auto;
}

/* === WELCOME === */
.welcome-header {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.welcome-icon {
  font-size: 3rem;
  line-height: 1;
}

.welcome-title {
  color: var(--onuf-text-primary);
}

.welcome-subtitle {
  color: var(--onuf-text-secondary);
  max-width: 280px;
  margin: 0 auto;
}

/* === SECTIONS === */
.section-title {
  color: var(--onuf-text-primary);
  margin-bottom: var(--spacing-md);
}

/* === ACTIONS === */
.actions-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.main-action-btn {
  height: 64px !important;
  font-size: 1.125rem !important;
  font-weight: var(--font-weight-semibold) !important;
  letter-spacing: 0.5px !important;
}

/* === SYSTEM LIST === */
.system-list {
  background: var(--onuf-surface) !important;
  overflow: hidden;
}

.system-item {
  min-height: 64px !important;
  padding: var(--spacing-md) !important;
}

.system-item:hover {
  background: rgba(243, 195, 72, 0.04) !important;
}

/* === SYNC STATS === */
.sync-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.sync-stat {
  text-align: center;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--onuf-surface-light);
}

.sync-stat-value {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

.sync-stat-label {
  font-size: 0.75rem;
  color: var(--onuf-text-secondary);
  margin-top: 2px;
}

/* === GPS TIPS === */
.gps-tips {
  background: var(--onuf-surface-light);
  border-radius: var(--radius-md);
}

.tips-content {
  padding: var(--spacing-sm) 0;
}

.tips-list {
  margin-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.tips-list li {
  margin-bottom: var(--spacing-xs);
  font-size: 0.875rem;
  line-height: 1.4;
}

/* === ONBOARDING === */
.onboarding-icon {
  font-size: 3rem;
  line-height: 1;
}

.onboarding-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.onboarding-step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--onuf-primary);
  color: var(--onuf-text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

/* === RESPONSIVE === */
@media (max-width: 374px) {
  .dashboard-container {
    padding: var(--spacing-sm) !important;
  }
  
  .welcome-header {
    padding: var(--spacing-md) 0;
  }
  
  .welcome-icon {
    font-size: 2.5rem;
  }
  
  .main-action-btn {
    height: 56px !important;
    font-size: 1rem !important;
  }
}

/* === ANIMATIONS === */
.stats-grid {
  animation: fadeInUp 0.4s ease-out;
}

.actions-grid {
  animation: fadeInUp 0.4s ease-out 0.1s both;
}

.system-section {
  animation: fadeInUp 0.4s ease-out 0.2s both;
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

/* === ACCESSIBILITY === */
@media (prefers-reduced-motion: reduce) {
  .stats-grid,
  .actions-grid,
  .system-section {
    animation: none;
  }
}
</style>
