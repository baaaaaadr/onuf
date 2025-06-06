<!-- src/App-enhanced.vue - Version avec StatusBar unifié -->
<template>
  <v-app>
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="login-container">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-card-title class="text-center pa-6">
                <div class="text-h4 font-weight-bold text-primary">
                  🛡️ ONUF
                </div>
                <div class="text-subtitle-1 text-grey">
                  Agadir Safety Audit
                </div>
              </v-card-title>
              
              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="loginForm.username"
                    label="Nom d'utilisateur"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    :disabled="loggingIn"
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
                    :disabled="loggingIn"
                    required
                  ></v-text-field>
                  
                  <v-alert
                    v-if="loginError"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                  >
                    {{ loginError }}
                  </v-alert>
                  
                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loggingIn"
                    class="mb-4"
                  >
                    Se connecter
                  </v-btn>
                </v-form>

                <!-- Infos de test en développement -->
                <v-alert
                  v-if="isDevelopment"
                  type="info"
                  variant="tonal"
                  class="mt-4"
                >
                  <div class="text-caption">
                    <strong>Comptes de test :</strong><br>
                    Admin: admin / admin123!<br>
                    Agent: agent01 / field123!
                  </div>
                </v-alert>
              </v-card-text>
              
              <v-card-actions class="justify-center pb-6">
                <div class="text-caption text-grey text-center">
                  Version {{ appVersion }} • Offline-First PWA<br>
                  <span class="d-flex align-center justify-center mt-1">
                    <v-icon size="12" class="mr-1" :color="isOnline ? 'success' : 'error'">
                      {{ isOnline ? 'mdi-wifi' : 'mdi-wifi-off' }}
                    </v-icon>
                    {{ isOnline ? 'En ligne' : 'Hors ligne' }}
                  </span>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    
    <!-- Main App (when authenticated) -->
    <div v-else>
      <!-- StatusBar unifié remplace l'ancien v-app-bar -->
      <StatusBar 
        :page-title="currentPageTitle"
        :show-back-button="showBackButton"
      />
      
      <!-- Router View for Main App -->
      <v-main>
        <router-view />
      </v-main>
      
      <!-- Toast de bienvenue -->
      <v-snackbar
        v-model="showWelcomeMessage"
        color="success"
        timeout="3000"
        location="top"
      >
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        Bienvenue {{ currentUser?.display_name || currentUser?.username }} !
        <template v-slot:actions>
          <v-btn variant="text" @click="showWelcomeMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <!-- Notification de progression retrouvée -->
      <v-snackbar
        v-model="showProgressNotification"
        color="info"
        timeout="5000"
        location="top"
      >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Progression d'audit sauvegardée trouvée
        <template v-slot:actions>
          <v-btn variant="text" @click="loadSavedProgress">
            Reprendre
          </v-btn>
          <v-btn variant="text" @click="showProgressNotification = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <!-- Notification de première installation PWA -->
      <v-snackbar
        v-model="showInstallPrompt"
        color="primary"
        timeout="8000"
        location="bottom"
      >
        <v-icon class="mr-2">mdi-download</v-icon>
        Installer ONUF sur votre appareil pour un accès rapide ?
        <template v-slot:actions>
          <v-btn variant="text" @click="installPWA">
            Installer
          </v-btn>
          <v-btn variant="text" @click="showInstallPrompt = false">
            Plus tard
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <!-- User Management Dialog (Admin only) -->
    <v-dialog v-model="showUserManagement" max-width="600" v-if="currentUser?.role === 'admin'">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-account-multiple</v-icon>
          Gestion des utilisateurs
        </v-card-title>
        
        <v-card-text>
          <v-form @submit.prevent="createUser">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.username"
                  label="Nom d'utilisateur"
                  variant="outlined"
                  :rules="[rules.required, rules.username]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.password"
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  :rules="[rules.required, rules.password]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newUser.displayName"
                  label="Nom d'affichage"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn 
                  type="submit" 
                  color="primary" 
                  :loading="creatingUser"
                  :disabled="!isFormValid"
                >
                  <v-icon left>mdi-account-plus</v-icon>
                  Créer utilisateur
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <!-- Affichage des erreurs de création -->
          <v-alert
            v-if="userCreationError"
            type="error"
            variant="tonal"
            class="mt-4"
            closable
            @click:close="userCreationError = ''"
          >
            {{ userCreationError }}
          </v-alert>

          <!-- Succès de création -->
          <v-alert
            v-if="userCreationSuccess"
            type="success"
            variant="tonal"
            class="mt-4"
            closable
            @click:close="userCreationSuccess = ''"
          >
            {{ userCreationSuccess }}
          </v-alert>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeUserManagement">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'
import StatusBar from '@/components/StatusBar.vue'

// Router
const route = useRoute()
const router = useRouter()

// Composables
const { 
  currentUser, 
  isAuthenticated, 
  isAdmin, 
  login, 
  logout, 
  checkAuthStatus,
  createUser: createNewUser 
} = useAuth()

const { loadProgress } = useAudits()
const { isOnline } = getGlobalSyncQueue()

// État de l'application
const showWelcomeMessage = ref(false)
const showProgressNotification = ref(false)
const showInstallPrompt = ref(false)
const savedProgressData = ref(null)

// Login form
const loginForm = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const loggingIn = ref(false)
const loginError = ref('')

// User management (admin)
const showUserManagement = ref(false)
const newUser = ref({
  username: '',
  password: '',
  displayName: ''
})
const creatingUser = ref(false)
const userCreationError = ref('')
const userCreationSuccess = ref('')

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis',
  username: value => {
    if (value && value.length < 3) return 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
    if (value && !/^[a-zA-Z0-9_]+$/.test(value)) return 'Seuls les lettres, chiffres et underscore sont autorisés'
    return true
  },
  password: value => {
    if (value && value.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères'
    return true
  }
}

// Computed
const isDevelopment = computed(() => {
  return import.meta.env.MODE === 'development'
})

const appVersion = computed(() => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
})

const currentPageTitle = computed(() => {
  const routeTitles = {
    'intro': '',
    'audit': 'Nouvel Audit',
    'history': 'Mes Audits'
  }
  return routeTitles[route.name] || ''
})

const showBackButton = computed(() => {
  return route.name !== 'intro'
})

const isFormValid = computed(() => {
  return newUser.value.username && 
         newUser.value.password && 
         newUser.value.username.length >= 3 && 
         newUser.value.password.length >= 6
})

// Methods
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
      
      // Afficher message de bienvenue
      showWelcomeMessage.value = true
      
      // Vérifier progression sauvegardée
      const progressResult = await loadProgress()
      if (progressResult.hasProgress) {
        savedProgressData.value = progressResult.progress
        showProgressNotification.value = true
      }
      
      // Vérifier si PWA peut être installée
      checkInstallPrompt()
      
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

const handleLogout = () => {
  logout()
  loginForm.value = { username: '', password: '' }
  loginError.value = ''
  showWelcomeMessage.value = false
  showProgressNotification.value = false
}

const loadSavedProgress = () => {
  if (savedProgressData.value) {
    // Naviguer vers le formulaire d'audit avec les données
    router.push({
      name: 'audit',
      query: { restore: 'true' }
    })
  }
  showProgressNotification.value = false
}

const createUser = async () => {
  if (!isFormValid.value) return
  
  creatingUser.value = true
  userCreationError.value = ''
  userCreationSuccess.value = ''
  
  try {
    const result = await createNewUser(
      newUser.value.username,
      newUser.value.password,
      newUser.value.displayName
    )
    
    if (result.success) {
      userCreationSuccess.value = `Utilisateur "${newUser.value.username}" créé avec succès !`
      newUser.value = { username: '', password: '', displayName: '' }
    } else {
      userCreationError.value = result.error
    }
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error)
    userCreationError.value = 'Erreur lors de la création. Veuillez réessayer.'
  } finally {
    creatingUser.value = false
  }
}

const closeUserManagement = () => {
  showUserManagement.value = false
  newUser.value = { username: '', password: '', displayName: '' }
  userCreationError.value = ''
  userCreationSuccess.value = ''
}

const checkInstallPrompt = () => {
  // Vérifier si PWA peut être installée et pas déjà installée
  if (window.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
    setTimeout(() => {
      showInstallPrompt.value = true
    }, 3000) // Attendre 3 secondes après connexion
  }
}

const installPWA = async () => {
  if (window.deferredPrompt) {
    try {
      await window.deferredPrompt.prompt()
      const { outcome } = await window.deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ PWA installée par l\'utilisateur')
      } else {
        console.log('❌ Installation PWA refusée')
      }
      
      window.deferredPrompt = null
    } catch (error) {
      console.error('❌ Erreur installation PWA:', error)
    }
  }
  showInstallPrompt.value = false
}

// Expose pour utilisation globale (debugging/admin)
const openUserManagement = () => {
  if (currentUser.value?.role === 'admin') {
    showUserManagement.value = true
  }
}

// Exposer pour l'utilisation dans les composants enfants si nécessaire
window.__onuf_openUserManagement = openUserManagement

// Lifecycle
onMounted(() => {
  console.log('🚀 App.vue monté - Vérification auth...')
  checkAuthStatus()
})

// Watchers
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    console.log('✅ Utilisateur authentifié:', currentUser.value)
  } else {
    console.log('❌ Utilisateur non authentifié')
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  border-radius: 16px !important;
}

/* Amélioration de l'accessibilité */
.login-container .v-text-field {
  margin-bottom: 8px;
}

/* Animation pour les notifications */
.v-snackbar {
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 600px) {
  .login-container .v-col {
    padding: 12px;
  }
  
  .v-card-title {
    padding: 16px !important;
  }
}
</style>
