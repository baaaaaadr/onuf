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
              </v-card-text>
              
              <v-card-actions class="justify-center pb-6">
                <div class="text-caption text-grey">
                  Version 1.0.0 • Offline-First PWA
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    
    <!-- Main App (when authenticated) -->
    <div v-else>
      <!-- App Bar with User Info -->
      <v-app-bar color="primary" density="compact" elevation="2">
        <v-app-bar-title class="font-weight-bold">
          🛡️ ONUF - {{ currentUser?.display_name || currentUser?.username }}
        </v-app-bar-title>
        
        <template v-slot:append>
          <v-chip
            :color="syncStatus.color"
            size="small"
            variant="tonal"
            class="mr-2"
          >
            <v-icon start size="small">{{ syncStatus.icon }}</v-icon>
            {{ syncStatus.text }}
          </v-chip>
          
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-account-circle"
                variant="text"
              ></v-btn>
            </template>
            
            <v-list>
              <v-list-item>
                <v-list-item-title>{{ currentUser?.display_name || currentUser?.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ currentUser?.role === 'admin' ? 'Administrateur' : 'Agent terrain' }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item @click="handleSync" :disabled="syncStatus.syncing">
                <template v-slot:prepend>
                  <v-icon>mdi-sync</v-icon>
                </template>
                <v-list-item-title>Synchroniser</v-list-item-title>
              </v-list-item>
              
              <v-list-item v-if="currentUser?.role === 'admin'" @click="showUserManagement = true">
                <template v-slot:prepend>
                  <v-icon>mdi-account-multiple</v-icon>
                </template>
                <v-list-item-title>Gestion utilisateurs</v-list-item-title>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item @click="handleLogout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Déconnexion</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>
      
      <!-- Router View for Main App -->
      <v-main>
        <router-view />
      </v-main>
      
      <!-- Sync Status Snackbar -->
      <v-snackbar
        v-model="showSyncMessage"
        :color="syncMessage.type"
        timeout="3000"
      >
        {{ syncMessage.text }}
        <template v-slot:actions>
          <v-btn variant="text" @click="showSyncMessage = false">
            Fermer
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <!-- User Management Dialog (Admin only) -->
    <v-dialog v-model="showUserManagement" max-width="600" v-if="currentUser?.role === 'admin'">
      <v-card>
        <v-card-title>Gestion des utilisateurs</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createUser">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.username"
                  label="Nom d'utilisateur"
                  variant="outlined"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newUser.password"
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
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
                <v-btn type="submit" color="primary" :loading="creatingUser">
                  Créer utilisateur
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showUserManagement = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'

// Auth composable
const { 
  currentUser, 
  isAuthenticated, 
  isAdmin, 
  login, 
  logout, 
  checkAuthStatus,
  createUser: createNewUser 
} = useAuth()

// Audits composable
const { saveProgress, loadProgress } = useAudits()

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

// Sync status
const syncStatus = ref({
  color: 'grey',
  icon: 'mdi-cloud-off',
  text: 'Hors ligne',
  syncing: false
})

const showSyncMessage = ref(false)
const syncMessage = ref({
  type: 'info',
  text: ''
})

// Computed
const isOnline = computed(() => navigator.onLine)

// Methods
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    loginError.value = 'Veuillez remplir tous les champs'
    return
  }
  
  loggingIn.value = true
  loginError.value = ''
  
  const result = await login(loginForm.value.username, loginForm.value.password)
  
  if (result.success) {
    // Check for saved progress
    const progressResult = await loadProgress()
    if (progressResult.hasProgress) {
      showSyncMessage.value = true
      syncMessage.value = {
        type: 'info',
        text: 'Progression sauvegardée trouvée'
      }
    }
  } else {
    loginError.value = result.error
  }
  
  loggingIn.value = false
}

const handleLogout = () => {
  logout()
  loginForm.value = { username: '', password: '' }
  loginError.value = ''
}

const handleSync = async () => {
  if (!isOnline.value) {
    showSyncMessage.value = true
    syncMessage.value = {
      type: 'warning',
      text: 'Connexion internet requise pour la synchronisation'
    }
    return
  }
  
  syncStatus.value.syncing = true
  syncStatus.value.text = 'Synchronisation...'
  
  // TODO: Implement actual sync logic
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  syncStatus.value.syncing = false
  updateSyncStatus()
  
  showSyncMessage.value = true
  syncMessage.value = {
    type: 'success',
    text: 'Synchronisation terminée'
  }
}

const createUser = async () => {
  if (!newUser.value.username || !newUser.value.password) return
  
  creatingUser.value = true
  
  const result = await createNewUser(
    newUser.value.username,
    newUser.value.password,
    newUser.value.displayName
  )
  
  if (result.success) {
    newUser.value = { username: '', password: '', displayName: '' }
    showSyncMessage.value = true
    syncMessage.value = {
      type: 'success',
      text: 'Utilisateur créé avec succès'
    }
  } else {
    showSyncMessage.value = true
    syncMessage.value = {
      type: 'error',
      text: result.error
    }
  }
  
  creatingUser.value = false
}

const updateSyncStatus = () => {
  if (syncStatus.value.syncing) return
  
  if (isOnline.value) {
    syncStatus.value = {
      color: 'success',
      icon: 'mdi-cloud-check',
      text: 'En ligne',
      syncing: false
    }
  } else {
    syncStatus.value = {
      color: 'warning',
      icon: 'mdi-cloud-off',
      text: 'Hors ligne',
      syncing: false
    }
  }
}

// Watchers
watch(isOnline, updateSyncStatus)

// Lifecycle
onMounted(() => {
  checkAuthStatus()
  updateSyncStatus()
  
  // Listen for online/offline events
  window.addEventListener('online', updateSyncStatus)
  window.addEventListener('offline', updateSyncStatus)
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
</style>
