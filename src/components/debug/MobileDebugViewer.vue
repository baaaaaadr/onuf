<!-- src/components/debug/MobileDebugViewer.vue -->
<template>
  <v-dialog
    v-model="showDebug"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <!-- Bouton flottant pour ouvrir le debug -->
      <v-btn
        v-bind="props"
        v-if="isDebugMode"
        position="fixed"
        location="bottom end"
        class="mb-16 mr-2"
        icon="mdi-bug"
        color="error"
        size="small"
        elevation="8"
        style="z-index: 9999;"
      />
    </template>

    <v-card>
      <v-toolbar color="error" dark>
        <v-btn icon="mdi-close" @click="showDebug = false" />
        <v-toolbar-title>Debug Mobile</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="clearLogs">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon @click="exportLogs">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Filtres -->
      <v-card-text class="pa-2">
        <v-chip-group
          v-model="selectedTypes"
          multiple
          dense
          class="mb-2"
        >
          <v-chip
            value="log"
            color="blue"
            variant="outlined"
            size="small"
          >
            Logs ({{ countByType.log }})
          </v-chip>
          <v-chip
            value="warn"
            color="orange"
            variant="outlined"
            size="small"
          >
            Warnings ({{ countByType.warn }})
          </v-chip>
          <v-chip
            value="error"
            color="error"
            variant="outlined"
            size="small"
          >
            Errors ({{ countByType.error }})
          </v-chip>
        </v-chip-group>

        <!-- Recherche -->
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Rechercher dans les logs"
          clearable
          density="compact"
          variant="outlined"
          hide-details
          class="mb-2"
        />
      </v-card-text>

      <!-- Liste des logs -->
      <v-virtual-scroll
        :items="filteredLogs"
        :height="scrollHeight"
        item-height="80"
      >
        <template v-slot:default="{ item }">
          <v-card
            class="ma-2"
            :color="getLogColor(item.type)"
            variant="outlined"
            @click="expandedLog = expandedLog === item.id ? null : item.id"
          >
            <v-card-text class="pa-2">
              <div class="d-flex align-center mb-1">
                <v-icon
                  :icon="getLogIcon(item.type)"
                  :color="getLogIconColor(item.type)"
                  size="small"
                  class="mr-2"
                />
                <span class="text-caption">
                  {{ formatTimestamp(item.timestamp) }}
                </span>
              </div>
              
              <div 
                class="log-message"
                :class="{ 'expanded': expandedLog === item.id }"
              >
                {{ item.message }}
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-virtual-scroll>

      <!-- Actions rapides -->
      <v-card-actions class="pa-2">
        <v-btn
          block
          variant="tonal"
          color="primary"
          @click="shareLogsViaEmail"
        >
          <v-icon start>mdi-email</v-icon>
          Envoyer par email
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import mobileDebugLogger from '@/utils/mobileDebug'

const showDebug = ref(false)
const searchQuery = ref('')
const selectedTypes = ref(['log', 'warn', 'error'])
const expandedLog = ref(null)
// Force le mode debug en production pour les tests
const isDebugMode = computed(() => {
  return window.location.search.includes('debug=true')
})

// Computed
const scrollHeight = computed(() => window.innerHeight - 250)

const filteredLogs = computed(() => {
  return mobileDebugLogger.logs.value.filter(log => {
    if (!selectedTypes.value.includes(log.type)) return false
    if (searchQuery.value) {
      return log.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    return true
  })
})

const countByType = computed(() => {
  const counts = { log: 0, warn: 0, error: 0 }
  mobileDebugLogger.logs.value.forEach(log => {
    counts[log.type] = (counts[log.type] || 0) + 1
  })
  return counts
})

// Methods
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  })
}

const getLogColor = (type) => {
  switch (type) {
    case 'error': return 'error'
    case 'warn': return 'warning'
    default: return 'surface'
  }
}

const getLogIcon = (type) => {
  switch (type) {
    case 'error': return 'mdi-alert-circle'
    case 'warn': return 'mdi-alert'
    default: return 'mdi-information'
  }
}

const getLogIconColor = (type) => {
  switch (type) {
    case 'error': return 'error'
    case 'warn': return 'warning'
    default: return 'info'
  }
}

const clearLogs = () => {
  if (confirm('Effacer tous les logs ?')) {
    mobileDebugLogger.clear()
  }
}

const exportLogs = () => {
  mobileDebugLogger.downloadLogs('text')
}

const shareLogsViaEmail = () => {
  const logs = mobileDebugLogger.exportAsText()
  const subject = `ONUF Debug Logs - ${new Date().toLocaleString('fr-FR')}`
  const body = encodeURIComponent(logs.substring(0, 2000) + '\n\n[Logs tronqués - Téléchargez le fichier complet]')
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

// Auto-refresh
let refreshInterval
onMounted(() => {
  refreshInterval = setInterval(() => {
    // Force reactivity update
  }, 1000)
})

onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>

<style scoped>
.log-message {
  font-family: monospace;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  color: #212121; /* Dark gray for better contrast */
}

.log-message.expanded {
  white-space: pre-wrap;
  word-break: break-word;
}

:deep(.v-virtual-scroll__item) {
  padding: 0 !important;
}

/* Ensure text is visible in dark mode */
:deep(.v-theme--light) .log-message {
  color: #212121; /* Dark gray for light theme */
}

:deep(.v-theme--dark) .log-message {
  color: #e0e0e0; /* Light gray for dark theme */
}
</style>