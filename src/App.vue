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
                  MANARA
                </div>
                <div class="text-subtitle-1 text-secondary">
                  Audit genré des quartiers d'Agadir
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
      <!-- StatusBar avec menu hamburger -->
      <StatusBar 
        :page-title="pageTitle" 
        :show-back-button="showBackButton"
      />

      <!-- Contenu principal avec transitions et swipe navigation -->
      <v-main class="onuf-main">
        <SwipeNavigation>
          <div class="page-container">
            <router-view v-slot="{ Component, route }">
              <PageTransition name="auto" :duration="300">
                <component :is="Component" :key="route.path" />
              </PageTransition>
            </router-view>
          </div>
        </SwipeNavigation>
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

      <!-- Pop-up d'introduction pour les observatrices -->
      <v-dialog 
        v-model="showIntroDialog" 
        max-width="500" 
        rounded="lg"
      >
        <v-card rounded="lg">
          <v-card-title class="pa-6 text-center">
            <div class="intro-icon mb-3">
              <v-icon size="64" color="primary">mdi-map-marker-check</v-icon>
            </div>
            <div class="text-h5 font-weight-bold">
              Bienvenue dans MANARA !
            </div>
            <div class="text-subtitle-1 text-secondary mt-2">
              Application d'audit de sécurité des quartiers
            </div>
          </v-card-title>
          
          <v-card-text class="px-6">
            <div class="intro-content">
              <p class="text-body-1 mb-4">
                En tant qu'observatrice, vous allez évaluer la sécurité et l'accessibilité de votre quartier selon différents critères.
              </p>
              
              <div class="intro-features mb-4">
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon class="mr-3" color="primary">mdi-crosshairs-gps</v-icon>
                  <div>
                    <div class="font-weight-medium">Localisation automatique</div>
                    <div class="text-caption text-secondary">Votre position GPS sera détectée automatiquement</div>
                  </div>
                </div>
                
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon class="mr-3" color="primary">mdi-clipboard-list</v-icon>
                  <div>
                    <div class="font-weight-medium">Questions simples</div>
                    <div class="text-caption text-secondary">Évaluez l'éclairage, la propreté, le ressenti, etc.</div>
                  </div>
                </div>
                
                <div class="feature-item d-flex align-center mb-3">
                  <v-icon class="mr-3" color="primary">mdi-camera</v-icon>
                  <div>
                    <div class="font-weight-medium">Photos optionnelles</div>
                    <div class="text-caption text-secondary">Documentez vos observations si vous le souhaitez</div>
                  </div>
                </div>
              </div>
              
              <v-alert
                type="info"
                variant="tonal"
                rounded="lg"
                class="mb-4"
              >
                <div class="text-body-2">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  Vos données sont sauvegardées localement et synchronisées de manière sécurisée.
                </div>
              </v-alert>
            </div>
          </v-card-text>
          
          <v-card-actions class="px-6 pb-6">
            <v-btn
              color="primary"
              size="large"
              rounded="pill"
              block
              @click="startFirstAudit"
              class="cta-button mb-3"
              style="background-color: #F3C348 !important; color: #181611 !important;"
            >
              <v-icon start>mdi-play-circle</v-icon>
              Faire un audit
            </v-btn>
            
            <v-btn
              variant="text"
              size="small"
              block
              @click="skipIntroForever"
              class="skip-button"
            >
              Ne plus afficher cette introduction
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
import StatusBar from '@/components/StatusBar.vue'
import BottomNav from '@/components/navigation/BottomNav.vue'
import PageTransition from '@/components/transitions/PageTransition.vue'
import SwipeNavigation from '@/components/navigation/SwipeNavigation.vue'
import MobileDebugViewer from '@/components/debug/MobileDebugViewer.vue'
import { performStartupCleanup } from '@/utils/cleanupUtils'

// Router
const route = useRoute()
const router = useRouter()

// Composables
const { 
  currentUser, 
  isAuthenticated, 
  login, 
  loginDirect,
  logout: authLogout
} = useAuth()

const { loadProgress, getPendingAuditsCount } = useAudits()
const { 
  syncStats, 
  isOnline
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
const showIntroDialog = ref(false)
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
    'history': 'Mes Audits',
    'ma-ville': 'Ma Ville'
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
    console.log('🔐 Tentative de connexion (méthode principale)...', { username: loginForm.value.username })
    const result = await login(loginForm.value.username, loginForm.value.password)
    
    // Si la méthode principale échoue avec "Identifiants incorrects" (RPC retourne tableau vide)
    // on essaie la méthode fallback
    if (!result.success && result.error === 'Identifiants incorrects') {
      console.log('🔄 Méthode principale échouée, tentative fallback...')
      
      const fallbackResult = await loginDirect(loginForm.value.username, loginForm.value.password)
      
      if (fallbackResult.success) {
        console.log('✅ Connexion réussie (fallback):', fallbackResult.user)
        
        // Connexion réussie avec fallback - forcer rechargement pour éviter les problèmes d'état
        localStorage.setItem('onuf_user', JSON.stringify(fallbackResult.user))
        localStorage.setItem('onuf_token', fallbackResult.user.token)
        localStorage.setItem('onuf_login_success', 'true') // Marquer le succès
        
        console.log('🔄 Rechargement de la page après authentification fallback...')
        window.location.reload()
      } else {
        loginError.value = fallbackResult.error
        return
      }
    }
    
    if (result.success) {
      console.log('✅ Connexion réussie (méthode principale):', result.user)
      
      // Vérifier si l'utilisateur veut voir l'intro
      const skipIntro = localStorage.getItem('manara_skip_intro')
      if (skipIntro !== 'true') {
        showIntroDialog.value = true
      } else {
        showWelcomeMessage.value = true
      }
      
      // Vérifier progression sauvegardée
      const progressResult = await loadProgress()
      if (progressResult.hasProgress) {
        savedProgressData.value = progressResult.progress
        showProgressNotification.value = true
      }
      
      // Vérifier PWA
      checkInstallPrompt()
      
      // Rediriger vers audit directement
      nextTick(() => {
        router.replace({ name: 'audit' })
      })
      
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
  try {
    await authLogout()
    loginForm.value = { username: '', password: '' }
    loginError.value = ''
    showWelcomeMessage.value = false
    showProgressNotification.value = false
    
    // Forcer le rechargement de la page pour éviter les problèmes de state
    window.location.reload()
  } catch (error) {
    console.error('❌ Erreur de déconnexion:', error)
  }
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

const handleNavigation = (path) => {
  console.log('Navigation vers:', path)
}

const handleTabChange = (tab) => {
  console.log('Onglet changé:', tab)
}

const startFirstAudit = () => {
  showIntroDialog.value = false
  showWelcomeMessage.value = true
  router.push({ name: 'audit' })
}

const skipIntroForever = () => {
  localStorage.setItem('manara_skip_intro', 'true')
  showIntroDialog.value = false
  showWelcomeMessage.value = true
  router.push({ name: 'audit' })
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
  
  // Effectuer le nettoyage au démarrage
  try {
    const userId = currentUser.value?.id || currentUser.value?.user_id
    performStartupCleanup(userId)
  } catch (error) {
    console.error('Erreur nettoyage au démarrage:', error)
  }
  
  // Vérifier si on arrive après un login fallback réussi
  const loginSuccess = localStorage.getItem('onuf_login_success')
  if (loginSuccess === 'true') {
    localStorage.removeItem('onuf_login_success')
    
    // Vérifier si l'utilisateur veut voir l'intro
    const skipIntro = localStorage.getItem('manara_skip_intro')
    if (skipIntro !== 'true') {
      showIntroDialog.value = true
    } else {
      showWelcomeMessage.value = true
    }
    
    // Vérifier progression sauvegardée
    try {
      const progressResult = await loadProgress()
      if (progressResult.hasProgress) {
        savedProgressData.value = progressResult.progress
        showProgressNotification.value = true
      }
    } catch (error) {
      console.error('Erreur chargement progression:', error)
    }
    
    // Vérifier PWA
    checkInstallPrompt()
  }
  
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
  const routes = ['dashboard', 'audit', 'history', 'ma-ville']
  const newIndex = routes.indexOf(newRoute)
  const oldIndex = routes.indexOf(oldRoute)
  
  if (newIndex > oldIndex) {
    pageTransition.value = 'slide-left'
  } else if (newIndex < oldIndex) {
    pageTransition.value = 'slide-right'
  } else {
    pageTransition.value = 'fade-slide'
  }
}, { immediate: false })

// Watch pour l'authentification (sans déclenchement immédiat)
watch(isAuthenticated, (authenticated) => {
  if (authenticated && route.path === '/') {
    // Utilisateur connecté et sur la page racine, rediriger vers dashboard
    nextTick(() => {
      if (route.name !== 'dashboard') {
        router.replace({ name: 'dashboard' })
      }
    })
  }
}, { immediate: false })
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

/* === INTRO DIALOG === */
.intro-icon {
  display: flex;
  justify-content: center;
}

.intro-content {
  text-align: left;
}

.feature-item {
  background: rgba(25, 118, 210, 0.05);
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid var(--v-theme-primary);
}

.cta-button {
  height: 56px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  box-shadow: 0 4px 12px rgba(243, 195, 72, 0.3) !important;
}

.cta-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(243, 195, 72, 0.4) !important;
}

.skip-button {
  color: #837B67 !important;
  font-size: 12px !important;
  text-decoration: underline;
  opacity: 0.8;
}

.skip-button:hover {
  opacity: 1;
  background-color: rgba(131, 123, 103, 0.1) !important;
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
  
  .cta-button:hover {
    transform: none;
  }
}

.v-btn:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: 2px;
}
</style>
