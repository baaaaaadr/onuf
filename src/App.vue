<!-- src/App.vue - Version redesign v2.0 avec navigation moderne -->
<template>
  <v-app class="onuf-app">
    <!-- Écran de connexion -->
    <div v-if="!isAuthenticated" class="login-container">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="login-card elevation-12" rounded="xl">
              <!-- Logo et titre -->
              <v-card-title class="text-center pa-8">
                <div class="login-logo mb-4">
                  🛡️
                </div>
                <div class="text-h4 font-weight-bold text-primary mb-2">
                  ONUF
                </div>
                <div class="text-subtitle-1 text-secondary">
                  Agadir Safety Audit
                </div>
              </v-card-title>
              
              <!-- Formulaire de connexion -->
              <v-card-text class="px-8 pb-8">
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginForm.username"
                    label="Nom d'utilisateur"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    rounded="lg"
                    :disabled="loggingIn"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="loginForm.password"
                    label="Mot de passe"
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    rounded="lg"
                    :disabled="loggingIn"
                    class="mb-4"
                    required
                  ></v-text-field>
                  
                  <v-alert
                    v-if="loginError"
                    type="error"
                    variant="tonal"
                    rounded="lg"
                    class="mb-4"
                  >
                    {{ loginError }}
                  </v-alert>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    rounded="pill"
                    block
                    :loading="loggingIn"
                    class="login-btn"
                  >
                    Se connecter
                  </v-btn>
                </v-form>

                <!-- Infos de test en développement -->
                <v-alert
                  v-if="isDevelopment"
                  type="info"
                  variant="tonal"
                  rounded="lg"
                  class="mt-6"
                >
                  <div class="text-caption">
                    <strong>Comptes de test :</strong><br>
                    Admin: admin / admin123!<br>
                    Agent: agent01 / field123!
                  </div>
                </v-alert>
              </v-card-text>
              
              <!-- Footer avec statut -->
              <v-card-actions class="justify-center px-8 pb-8">
                <div class="text-caption text-secondary text-center">
                  Version {{ appVersion }}<br>
                  <div class="d-flex align-center justify-center mt-2">
                    <v-icon size="12" class="mr-1" :color="isOnline ? 'success' : 'error'">
                      {{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}
                    </v-icon>
                    <span>{{ isOnline ? 'En ligne' : 'Hors ligne' }}</span>
                  </div>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    
    <!-- Application principale (authentifiée) -->
    <div v-else class="main-app">
      <!-- Header moderne -->
      <v-app-bar 
        flat 
        color="background"
        height="56"
        class="onuf-header"
        :class="{ 'onuf-header--with-back': showBackButton }"
      >
        <!-- Bouton retour -->
        <template v-if="showBackButton" #prepend>
          <v-btn 
            icon="mdi-arrow-left" 
            @click="goBack"
            class="mr-2"
          />
        </template>
        
        <!-- Titre de la page -->
        <v-app-bar-title class="text-center font-weight-medium">
          {{ pageTitle }}
        </v-app-bar-title>
        
        <!-- Actions header -->
        <template #append>
          <!-- Statut sync -->
          <v-btn
            icon
            size="small"
            @click="showSyncDialog = true"
            class="mr-2"
          >
            <v-icon :color="syncStatusColor" size="20">{{ syncStatusIcon }}</v-icon>
            <v-badge
              v-if="hasSyncIssues"
              dot
              color="warning"
              offset-x="-2"
              offset-y="-2"
            />
          </v-btn>
          
          <!-- Menu utilisateur -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar size="32" color="primary">
                  <span class="text-white font-weight-medium">
                    {{ userInitials }}
                  </span>
                </v-avatar>
              </v-btn>
            </template>
            
            <v-list density="compact" rounded="lg" class="user-menu">
              <v-list-item>
                <v-list-item-title class="font-weight-medium">
                  {{ currentUser?.display_name || 'Utilisateur' }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ currentUser?.username }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-divider class="my-1" />
              
              <v-list-item @click="logout" class="text-error">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Déconnexion</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>

      <!-- Contenu principal avec transitions -->
      <v-main class="onuf-main">
        <div class="page-container">
          <router-view v-slot="{ Component, route }">
            <PageTransition name="auto" :duration="300">
              <component :is="Component" :key="route.path" />
            </PageTransition>
          </router-view>
        </div>
      </v-main>

      <!-- Navigation bottom moderne -->
      <BottomNav
        v-if="showBottomNav"
        :pending-audits-count="pendingAuditsCount"
        :unsynced-count="unsyncedAuditsCount"
        @navigate="handleNavigation"
        @tab-change="handleTabChange"
        class="onuf-bottom-nav"
      />



      <!-- Snackbars de notification -->
      <!-- Bienvenue -->
      <v-snackbar
        v-model="showWelcomeMessage"
        color="success"
        timeout="3000"
        location="top"
        rounded="pill"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          <span>Bienvenue {{ currentUser?.display_name || currentUser?.username }} !</span>
        </div>
        <template v-slot:actions>
          <v-btn icon="mdi-close" @click="showWelcomeMessage = false" />
        </template>
      </v-snackbar>

      <!-- Progression retrouvée -->
      <v-snackbar
        v-model="showProgressNotification"
        color="info"
        timeout="5000"
        location="top"
        rounded="pill"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-content-save</v-icon>
          <span>Progression d'audit sauvegardée trouvée</span>
        </div>
        <template v-slot:actions>
          <v-btn variant="text" @click="loadSavedProgress">Reprendre</v-btn>
          <v-btn icon="mdi-close" @click="showProgressNotification = false" />
        </template>
      </v-snackbar>

      <!-- Installation PWA -->
      <v-snackbar
        v-model="showInstallPrompt"
        color="primary"
        timeout="8000"
        location="bottom"
        rounded="pill"
        class="install-prompt"
      >
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-download</v-icon>
          <span>Installer ONUF sur votre appareil ?</span>
        </div>
        <template v-slot:actions>
          <v-btn variant="text" @click="installPWA">Installer</v-btn>
          <v-btn icon="mdi-close" @click="showInstallPrompt = false" />
        </template>
      </v-snackbar>

      <!-- Dialog synchronisation -->
      <v-dialog v-model="showSyncDialog" max-width="400" rounded="lg">
        <v-card rounded="lg">
          <v-card-title class="d-flex align-center pa-6">
            <v-icon class="mr-3" :color="syncStatusColor">{{ syncStatusIcon }}</v-icon>
            <span>Synchronisation</span>
          </v-card-title>
          
          <v-card-text class="px-6 pb-6">
            <!-- Stats rapides -->
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

            <!-- Statut -->
            <v-chip
              :color="isOnline ? 'success' : 'error'"
              variant="tonal"
              size="small"
              class="mb-4"
            >
              <v-icon start>{{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}</v-icon>
              {{ isOnline ? 'En ligne' : 'Hors ligne' }}
            </v-chip>

            <!-- Actions -->
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
            <v-btn variant="text" @click="showSyncDialog = false">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Mobile Debug Viewer -->
      <MobileDebugViewer />
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import BottomNav from '@/components/navigation/BottomNav.vue'
import PageTransition from '@/components/transitions/PageTransition.vue'
import MobileDebugViewer from '@/components/debug/MobileDebugViewer.vue'

// Router
const route = useRoute()
const router = useRouter()

// Composables
const { 
  currentUser, 
  isAuthenticated, 
  login, 
  logout: authLogout
} = useAuth()

const { loadProgress, getPendingAuditsCount } = useAudits()
const { 
  syncStats, 
  isOnline, 
  processQueue,
  retryAllFailed
} = getGlobalSyncQueue()

// ✅ CORRECTION: syncStats est un objet reactive, pas une ref
const safeSyncStats = computed(() => syncStats || {
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

// État de l'application
const showWelcomeMessage = ref(false)
const showProgressNotification = ref(false)
const showInstallPrompt = ref(false)
const showSyncDialog = ref(false)
const savedProgressData = ref(null)
const pageTransition = ref('fade-slide')

// Login form
const loginForm = ref({
  username: '',
  password: ''
})
const showPassword = ref(false)
const loggingIn = ref(false)
const loginError = ref('')

// Computed
const isDevelopment = computed(() => import.meta.env.MODE === 'development')
const appVersion = computed(() => import.meta.env.VITE_APP_VERSION || '2.0.0')

// Titre de la page
const pageTitle = computed(() => {
  const titles = {
    'intro': 'Accueil',
    'dashboard': 'Accueil', 
    'audit': 'Nouvel Audit',
    'history': 'Mes Audits'
  }
  return titles[route.name] || 'ONUF'
})

// Navigation
const showBackButton = computed(() => {
  const noBackRoutes = ['intro', 'dashboard', 'history']
  return !noBackRoutes.includes(route.name)
})

const showBottomNav = computed(() => {
  const hiddenRoutes = ['login']
  return !hiddenRoutes.includes(route.name)
})

const showFab = computed(() => {
  const showFabRoutes = ['intro', 'dashboard', 'history']
  return showFabRoutes.includes(route.name)
})

const fabStyle = computed(() => ({
  bottom: showBottomNav.value ? '80px' : '24px'
}))

// Utilisateur
const userInitials = computed(() => {
  const name = currentUser.value?.display_name || currentUser.value?.username || 'U'
  return name.substring(0, 2).toUpperCase()
})

// Synchronisation
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

const hasSyncIssues = computed(() => {
  return safeSyncStats.value.failed > 0 || safeSyncStats.value.pending > 5
})

const isSyncing = computed(() => safeSyncStats.value.syncing > 0)

// Compteurs pour badges
const pendingAuditsCount = ref(0)
const unsyncedAuditsCount = computed(() => 
  safeSyncStats.value.pending + safeSyncStats.value.failed
)

// Méthodes
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    loginError.value = 'Veuillez remplir tous les champs'
    return
  }
  
  loggingIn.value = true
  loginError.value = ''
  
  try {
    const result = await login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      console.log('✅ Connexion réussie:', result.user)
      showWelcomeMessage.value = true
      
      // Vérifier progression sauvegardée
      const progressResult = await loadProgress()
      if (progressResult.hasProgress) {
        savedProgressData.value = progressResult.progress
        showProgressNotification.value = true
      }
      
      // Vérifier PWA
      checkInstallPrompt()
      
      // Rediriger vers accueil
      router.push('/')
      
    } else {
      loginError.value = result.error
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    loginError.value = 'Erreur de connexion. Veuillez réessayer.'
  } finally {
    loggingIn.value = false
  }
}

const logout = async () => {
  await authLogout()
  loginForm.value = { username: '', password: '' }
  loginError.value = ''
  showWelcomeMessage.value = false
  showProgressNotification.value = false
  router.push('/login')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const createNewAudit = () => {
  router.push('/audit')
}

const loadSavedProgress = () => {
  if (savedProgressData.value) {
    router.push({
      name: 'audit',
      query: { restore: 'true' }
    })
  }
  showProgressNotification.value = false
}

const checkInstallPrompt = () => {
  if (window.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000)
  }
}

const installPWA = async () => {
  if (window.deferredPrompt) {
    try {
      await window.deferredPrompt.prompt()
      const { outcome } = await window.deferredPrompt.userChoice
      console.log(outcome === 'accepted' ? '✅ PWA installée' : '❌ Installation refusée')
      window.deferredPrompt = null
    } catch (error) {
      console.error('❌ Erreur installation PWA:', error)
    }
  }
  showInstallPrompt.value = false
}

const manualSync = async () => {
  await processQueue()
}

const retryFailed = async () => {
  await retryAllFailed()
}

const handleNavigation = (path) => {
  console.log('Navigation vers:', path)
}

const handleTabChange = (tab) => {
  console.log('Onglet changé:', tab)
}

// Transitions
const onPageEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'translateX(30px)'
}

const onPageLeave = (el) => {
  el.style.opacity = '1'
  el.style.transform = 'translateX(0)'
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 App.vue monté')
  
  // Charger compteurs
  try {
    pendingAuditsCount.value = await getPendingAuditsCount()
  } catch (error) {
    console.error('Erreur chargement compteurs:', error)
  }
})

// Watchers
watch(() => route.name, (newRoute, oldRoute) => {
  // Déterminer direction de transition
  const routes = ['intro', 'audit', 'history']
  const newIndex = routes.indexOf(newRoute)
  const oldIndex = routes.indexOf(oldRoute)
  
  if (newIndex > oldIndex) {
    pageTransition.value = 'slide-left'
  } else if (newIndex < oldIndex) {
    pageTransition.value = 'slide-right'
  } else {
    pageTransition.value = 'fade-slide'
  }
})
</script>

<style scoped>
.onuf-app {
  font-family: var(--font-family-primary) !important;
}

/* === LOGIN === */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--onuf-primary) 0%, var(--onuf-secondary) 100%);
  padding: var(--spacing-lg);
}

.login-card {
  border-radius: var(--radius-xl) !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.login-logo {
  font-size: 3rem;
  line-height: 1;
}

.login-btn {
  height: 56px !important;
  font-weight: var(--font-weight-semibold) !important;
  letter-spacing: 0.5px !important;
}

/* === HEADER === */
.onuf-header {
  border-bottom: 1px solid var(--onuf-surface-variant) !important;
  backdrop-filter: blur(8px);
}

.onuf-header--with-back .v-app-bar-title {
  text-align: left !important;
}

.user-menu {
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
}

/* === MAIN === */
.onuf-main {
  padding-bottom: 64px; /* Space for bottom nav */
}

.page-container {
  min-height: calc(100vh - 56px - 64px); /* Viewport - header - bottom nav */
}

/* === BOTTOM NAV === */
.onuf-bottom-nav {
  z-index: 1000;
}

/* === FAB === */
.onuf-fab {
  transition: all var(--transition-normal) !important;
  z-index: 1001;
}

.onuf-fab:hover {
  transform: scale(1.1);
}

/* === SYNC DIALOG === */
.sync-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.sync-stat {
  text-align: center;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
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

/* === NOTIFICATIONS === */
.install-prompt {
  margin-bottom: 80px; /* Au-dessus de bottom nav */
}

/* === TRANSITIONS === */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* === RESPONSIVE === */
@media (max-width: 374px) {
  .login-container {
    padding: var(--spacing-md);
  }
  
  .login-card .v-card-title {
    padding: var(--spacing-lg) !important;
  }
  
  .login-card .v-card-text {
    padding: var(--spacing-md) var(--spacing-lg) !important;
  }
}

/* === DARK MODE PREPARATION === */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 30, 30, 0.95) !important;
  }
}

/* === ACCESSIBILITY === */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active,
  .onuf-fab {
    transition: none !important;
  }
}

.v-btn:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: 2px;
}
</style>
