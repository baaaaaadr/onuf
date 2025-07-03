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
        :fullscreen="$vuetify.display.mobile"
        scrollable
        class="intro-dialog"
        :class="{ 'intro-dialog--mobile': $vuetify.display.mobile }"
      >
        <v-card class="intro-card" :class="{ 'intro-card--mobile': $vuetify.display.mobile }">
          <!-- Header -->
          <v-toolbar 
            v-if="$vuetify.display.mobile"
            color="transparent" 
            flat 
            class="intro-toolbar"
          >
            <v-toolbar-title class="text-h6 font-weight-bold text-center w-100">
              Bienvenue dans MANARA !
            </v-toolbar-title>
            <v-btn
              icon="mdi-close"
              @click="showIntroDialog = false"
            ></v-btn>
          </v-toolbar>
          
          <!-- Desktop Header -->
          <v-card-title v-if="!$vuetify.display.mobile" class="intro-header text-center pa-6">
            <div class="intro-icon mb-3">
              <v-icon size="48" color="primary">mdi-map-marker-check</v-icon>
            </div>
            <div class="text-h5 font-weight-bold mb-2">
              Bienvenue dans MANARA !
            </div>
            <div class="text-subtitle-1 text-secondary">
              Application d'audit de sécurité des quartiers
            </div>
          </v-card-title>
          
          <!-- Content -->
          <v-card-text class="intro-content" :class="{ 'intro-content--mobile': $vuetify.display.mobile }">
            <!-- Mobile Icon -->
            <div v-if="$vuetify.display.mobile" class="text-center mb-4">
              <v-icon size="64" color="primary">mdi-map-marker-check</v-icon>
              <div class="text-subtitle-1 text-secondary mt-2">
                Application d'audit de sécurité des quartiers
              </div>
            </div>
            
            <p class="text-body-1 mb-4">
              En tant qu'observatrice, vous allez évaluer la sécurité et l'accessibilité de votre quartier selon différents critères.
            </p>
            
            <div class="intro-features mb-4">
              <div class="feature-item mb-3">
                <div class="d-flex align-center">
                  <div class="feature-icon mr-3">
                    <v-icon color="primary" size="24">mdi-crosshairs-gps</v-icon>
                  </div>
                  <div class="feature-content">
                    <div class="font-weight-medium mb-1">Localisation automatique</div>
                    <div class="text-caption text-secondary">Votre position GPS sera détectée automatiquement</div>
                  </div>
                </div>
              </div>
              
              <div class="feature-item mb-3">
                <div class="d-flex align-center">
                  <div class="feature-icon mr-3">
                    <v-icon color="primary" size="24">mdi-clipboard-list</v-icon>
                  </div>
                  <div class="feature-content">
                    <div class="font-weight-medium mb-1">Questions simples</div>
                    <div class="text-caption text-secondary">Évaluez l'éclairage, la propreté, le ressenti, etc.</div>
                  </div>
                </div>
              </div>
              
              <div class="feature-item mb-3">
                <div class="d-flex align-center">
                  <div class="feature-icon mr-3">
                    <v-icon color="primary" size="24">mdi-camera</v-icon>
                  </div>
                  <div class="feature-content">
                    <div class="font-weight-medium mb-1">Photos optionnelles</div>
                    <div class="text-caption text-secondary">Documentez vos observations si vous le souhaitez</div>
                  </div>
                </div>
              </div>
            </div>
            
            <v-alert
              type="info"
              variant="tonal"
              rounded="lg"
              density="compact"
              class="mb-4"
            >
              <template v-slot:prepend>
                <v-icon size="20">mdi-information</v-icon>
              </template>
              <div class="text-body-2">
                Vos données sont sauvegardées localement et synchronisées de manière sécurisée.
              </div>
            </v-alert>
          </v-card-text>
          
          <!-- Actions -->
          <v-card-actions class="intro-actions" :class="{ 'intro-actions--mobile': $vuetify.display.mobile }">
            <div class="w-100">
              <v-btn
                color="primary"
                size="large"
                rounded="pill"
                block
                @click="startFirstAudit"
                class="cta-button mb-3"
                style="background-color: #F3C348 !important; color: #181611 !important;"
              >
                <v-icon start size="20">mdi-play-circle</v-icon>
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
            </div>
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
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()

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

// Titre de la page - ✅ CORRIGÉ: suppression 'dashboard'
const pageTitle = computed(() => {
  const titles = {
    'audit': t('navigation.newAudit'),
    'history': t('navigation.myAudits'),
    'ma-ville': t('navigation.myCity')
  }
  return titles[route.name] || t('app.title')
})

// Navigation - ✅ CORRIGÉ: suppression 'dashboard'
const showBackButton = computed(() => {
  const noBackRoutes = ['audit', 'history', 'ma-ville']
  return !noBackRoutes.includes(route.name)
})

const showBottomNav = computed(() => {
  const hiddenRoutes = ['login']
  return !hiddenRoutes.includes(route.name)
})

const showFab = computed(() => {
  const showFabRoutes = ['history']
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
      
      // ✅ CORRIGÉ: Rediriger vers audit au lieu de dashboard
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

// Watchers - ✅ CORRIGÉ: suppression des références à 'dashboard'
watch(() => route.name, (newRoute, oldRoute) => {
  // Déterminer direction de transition
  const routes = ['audit', 'history', 'ma-ville']
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

// ✅ CORRIGÉ: Watch pour l'authentification - redirection vers audit
watch(isAuthenticated, (authenticated) => {
  if (authenticated && route.path === '/') {
    // Utilisateur connecté et sur la page racine, rediriger vers audit
    nextTick(() => {
      if (route.name !== 'audit') {
        router.replace({ name: 'audit' })
      }
    })
  }
}, { immediate: false })
</script>

<style scoped>
.onuf-app {
  font-family: var(--font-family-primary) !important;
  
  /* Variables CSS pour éviter les incohérences entre dev et prod */
  --onuf-primary: #F3C348;
  --onuf-secondary: #F9D876;
  --onuf-surface-variant: #E6E3DB;
  --onuf-background: #FFFFFF;
  --onuf-surface-light: #F5F3F0;
  --radius-xl: 24px;
  --radius-lg: 16px;
  --radius-md: 12px;
  --spacing-lg: 24px;
  --spacing-md: 16px;
  --font-weight-semibold: 600;
  --transition-normal: 0.3s ease;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* === LOGIN === */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #F3C348 0%, #F9D876 100%) !important;
  padding: 24px;
}

.login-card {
  border-radius: 24px !important;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

/* Force le texte à être sombre sur fond blanc */
.login-card .v-card-title,
.login-card .v-card-text,
.login-card .v-card-actions {
  color: #181611 !important;
}

.login-card .text-primary {
  color: #F3C348 !important;
}

.login-card .text-secondary {
  color: #837B67 !important;
}

.login-logo {
  font-size: 3rem;
  line-height: 1;
}

.login-btn {
  height: 56px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  background-color: #F3C348 !important;
  color: #181611 !important;
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

/* === INTRO DIALOG === */
.intro-dialog {
  /* Desktop: Dialog centré normal */
}

.intro-dialog--mobile {
  /* Mobile: Fullscreen */
}

.intro-card {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.intro-card--mobile {
  height: 100vh !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
}

.intro-toolbar {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.intro-header {
  flex-shrink: 0;
}

.intro-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px !important;
}

.intro-content--mobile {
  padding: 16px !important;
  flex: 1;
  overflow-y: auto;
  /* Assurer que le contenu peut scroller */
  max-height: calc(100vh - 120px); /* 100vh - toolbar - actions */
}

.intro-actions {
  flex-shrink: 0;
  padding: 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.intro-actions--mobile {
  padding: 16px !important;
  /* Position fixe en bas sur mobile */
  position: sticky;
  bottom: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.intro-icon {
  display: flex;
  justify-content: center;
}

.intro-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  background: rgba(243, 195, 72, 0.08);
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #F3C348;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(243, 195, 72, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
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
  height: 36px !important;
}

.skip-button:hover {
  opacity: 1;
  background-color: rgba(131, 123, 103, 0.1) !important;
}

/* Mobile Responsive */
@media (max-width: 599px) {
  .feature-item {
    padding: 12px;
  }
  
  .feature-icon {
    width: 36px;
    height: 36px;
  }
  
  .cta-button {
    height: 48px !important;
    font-size: 15px !important;
  }
  
  .intro-content--mobile {
    /* Ajustement pour très petits écrans */
    max-height: calc(100vh - 140px);
  }
}

/* Très petits écrans */
@media (max-width: 374px) {
  .intro-content--mobile {
    padding: 12px !important;
    max-height: calc(100vh - 130px);
  }
  
  .intro-actions--mobile {
    padding: 12px !important;
  }
  
  .feature-item {
    padding: 10px;
  }
  
  .feature-icon {
    width: 32px;
    height: 32px;
  }
  
  .cta-button {
    height: 44px !important;
    font-size: 14px !important;
  }
}

/* Desktop - Dialog normal */
@media (min-width: 600px) {
  .intro-dialog .v-overlay__content {
    margin: 24px;
    max-width: 500px;
    max-height: calc(100vh - 48px);
  }
  
  .intro-card {
    border-radius: 16px !important;
    max-height: calc(100vh - 48px);
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
  
  .cta-button:hover {
    transform: none;
  }
}

.v-btn:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: 2px;
}
</style>
