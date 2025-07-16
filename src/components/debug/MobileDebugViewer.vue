<!-- src/components/debug/MobileDebugViewer.vue -->
<template>
  <!-- Panel debug fullscreen (ouvert depuis le menu StatusBar) -->
  <v-dialog
    v-model="showDebug"
    fullscreen
    transition="dialog-bottom-transition"
    scrollable
  >
    <v-card>
      <!-- Header -->
      <v-toolbar color="primary" dark>
        <v-toolbar-title>🐛 Debug Mobile - ONUF</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="refreshData">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="clearLogs">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn icon @click="showDebug = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenu -->
      <v-card-text class="pa-0">
        <v-tabs v-model="activeTab" color="error">
          <v-tab value="i18n">🌍 i18n</v-tab>
          <v-tab value="vue">⚡ Vue</v-tab>
          <v-tab value="logs">📝 Logs</v-tab>
          <v-tab value="network">🌐 Réseau</v-tab>
          <v-tab value="storage">💾 Storage</v-tab>
          <v-tab value="pwa">📱 PWA</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <!-- Tab i18n -->
          <v-tabs-window-item value="i18n">
            <v-container>
              <v-card class="mb-4" variant="outlined">
                <v-card-title>🌍 État des traductions</v-card-title>
                <v-card-text>
                  <div class="debug-section">
                    <strong>Locale actuelle:</strong> {{ currentLocale }}<br>
                    <strong>Disponible:</strong> {{ availableLocales?.join(', ') }}<br>
                    <strong>Fallback:</strong> {{ fallbackLocale }}<br>
                    <strong>Missing:</strong> {{ missingKeys.length }} clés<br>
                    <strong>Legacy mode:</strong> {{ legacyMode }}<br>
                  </div>
                  
                  <v-divider class="my-3" />
                  
                  <strong>Test traductions:</strong><br>
                  <div class="mt-2">
                    <div><code>app.title</code> → "{{ testTranslation('app.title') }}"</div>
                    <div><code>audit.title</code> → "{{ testTranslation('audit.title') }}"</div>
                    <div><code>navigation.audit</code> → "{{ testTranslation('navigation.audit') }}"</div>
                  </div>
                  
                  <v-divider class="my-3" />
                  
                  <strong>Messages chargés:</strong><br>
                  <pre class="text-caption">{{ JSON.stringify(loadedMessages, null, 2) }}</pre>
                </v-card-text>
              </v-card>

              <v-card class="mb-4" variant="outlined">
                <v-card-title>🔧 Configuration i18n</v-card-title>
                <v-card-text>
                  <pre class="text-caption">{{ i18nConfig }}</pre>
                </v-card-text>
              </v-card>

              <v-card class="mb-4" variant="outlined" v-if="missingKeys.length > 0">
                <v-card-title>⚠️ Clés manquantes ({{ missingKeys.length }})</v-card-title>
                <v-card-text>
                  <div v-for="key in missingKeys.slice(0, 20)" :key="key" class="text-caption">
                    {{ key }}
                  </div>
                  <div v-if="missingKeys.length > 20" class="text-caption">
                    ... et {{ missingKeys.length - 20 }} autres
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tabs-window-item>

          <!-- Tab Vue -->
          <v-tabs-window-item value="vue">
            <v-container>
              <v-card class="mb-4" variant="outlined">
                <v-card-title>⚡ État Vue</v-card-title>
                <v-card-text>
                  <div class="debug-section">
                    <strong>Version Vue:</strong> {{ vueVersion }}<br>
                    <strong>Mode:</strong> {{ buildMode }}<br>
                    <strong>Route actuelle:</strong> {{ currentRoute }}<br>
                    <strong>Composants:</strong> {{ componentCount }}<br>
                    <strong>Plugins:</strong> {{ installedPlugins?.join(', ') }}<br>
                  </div>
                </v-card-text>
              </v-card>

              <v-card class="mb-4" variant="outlined">
                <v-card-title>📱 Environnement</v-card-title>
                <v-card-text>
                  <div class="debug-section">
                    <strong>User Agent:</strong><br>
                    <div class="text-caption">{{ userAgent }}</div><br>
                    <strong>Viewport:</strong> {{ viewport.width }}x{{ viewport.height }}<br>
                    <strong>Online:</strong> {{ navigator.onLine }}<br>
                    <strong>Langue navigateur:</strong> {{ navigator.language }}<br>
                    <strong>Plateforme:</strong> {{ navigator.platform }}<br>
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tabs-window-item>

          <!-- Tab Logs -->
          <v-tabs-window-item value="logs">
            <v-container>
              <v-card variant="outlined">
                <v-card-title>📝 Console Logs ({{ logs.length }})</v-card-title>
                <v-card-text>
                  <div 
                    v-for="(log, index) in logs.slice(-50)" 
                    :key="index"
                    class="log-entry mb-1 pa-2"
                    :class="`log-${log.level}`"
                  >
                    <div class="d-flex">
                      <div class="log-time">{{ formatTime(log.timestamp) }}</div>
                      <div class="log-level ml-2">{{ log.level.toUpperCase() }}</div>
                      <div class="log-message ml-2 flex-grow-1">{{ log.message }}</div>
                    </div>
                    <div v-if="log.data" class="log-data mt-1">
                      <pre class="text-caption">{{ formatLogData(log.data) }}</pre>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tabs-window-item>

          <!-- Tab Network -->
          <v-tabs-window-item value="network">
            <v-container>
              <v-card class="mb-4" variant="outlined">
                <v-card-title>🌐 Tests réseau</v-card-title>
                <v-card-text>
                  <v-btn @click="testTranslationFiles" color="primary" class="mb-2">
                    Tester fichiers traductions
                  </v-btn>
                  <div v-if="networkTests.length > 0">
                    <div v-for="test in networkTests" :key="test.url" class="mt-2">
                      <div class="d-flex align-center">
                        <v-icon 
                          :color="test.status === 200 ? 'success' : 'error'" 
                          class="mr-2"
                        >
                          {{ test.status === 200 ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                        <code>{{ test.url }}</code>
                        <v-spacer />
                        <span>{{ test.status }}</span>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tabs-window-item>

          <!-- Tab Storage -->
          <v-tabs-window-item value="storage">
            <v-container>
              <v-card class="mb-4" variant="outlined">
                <v-card-title>💾 LocalStorage</v-card-title>
                <v-card-text>
                  <div v-for="[key, value] in localStorageItems" :key="key" class="mb-2">
                    <strong>{{ key }}:</strong> {{ value }}
                  </div>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tabs-window-item>
          
          <!-- Tab PWA -->
          <v-tabs-window-item value="pwa">
            <PWADiagnostic />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-btn @click="copyDebugInfo" color="success">
          <v-icon start>mdi-content-copy</v-icon>
          Copier debug info
        </v-btn>
        <v-btn @click="downloadDebugInfo" color="info">
          <v-icon start>mdi-download</v-icon>
          Télécharger
        </v-btn>
        <v-spacer />
        <v-switch
          v-model="forceShow"
          label="Forcer affichage"
          @change="updateForceShow"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import PWADiagnostic from './PWADiagnostic.vue'

// État
const showDebug = ref(false)
const activeTab = ref('i18n')
const logs = ref([])
const networkTests = ref([])
const forceShow = ref(false)

// Vue et route
const route = useRoute()
let i18n = null
try {
  i18n = useI18n()
} catch (error) {
  console.warn('useI18n non disponible dans debug viewer')
}

// ✅ NOUVEAU: Écouter l'événement du menu pour ouvrir le debug
const handleToggleDebug = () => {
  console.log('🐛 Toggle debug panel:', !showDebug.value)
  showDebug.value = !showDebug.value
}

// Computed

const currentLocale = computed(() => {
  return i18n?.locale?.value || 'non disponible'
})

const availableLocales = computed(() => {
  return i18n?.availableLocales || []
})

const fallbackLocale = computed(() => {
  return i18n?.fallbackLocale?.value || 'non disponible'
})

const legacyMode = computed(() => {
  return i18n?.legacy || false
})

const missingKeys = ref([])

const loadedMessages = computed(() => {
  if (!i18n?.messages?.value) return {}
  
  const messages = {}
  for (const [locale, msgs] of Object.entries(i18n.messages.value)) {
    messages[locale] = {
      keys: Object.keys(msgs || {}).length,
      sample: Object.keys(msgs || {}).slice(0, 5)
    }
  }
  return messages
})

const i18nConfig = computed(() => {
  if (!i18n) return 'i18n non disponible'
  
  return {
    locale: i18n.locale?.value,
    availableLocales: i18n.availableLocales,
    fallbackLocale: i18n.fallbackLocale?.value,
    legacy: i18n.legacy,
    mode: i18n.mode,
    globalInjection: i18n.globalInjection,
    missingWarn: i18n.missingWarn,
    fallbackWarn: i18n.fallbackWarn
  }
})

const vueVersion = computed(() => {
  return window.__VUE__ ? '3.x' : 'non détecté'
})

const buildMode = computed(() => {
  return import.meta.env.MODE
})

const currentRoute = computed(() => {
  return route.name || route.path
})

const componentCount = computed(() => {
  const app = document.querySelector('#app')?.__vue_app__
  return app?._instance?.components?.size || 'non détecté'
})

const installedPlugins = computed(() => {
  const app = document.querySelector('#app')?.__vue_app__
  return app?._plugins ? Object.keys(app._plugins) : ['non détecté']
})

const userAgent = computed(() => {
  return navigator.userAgent
})

const viewport = ref({ width: window.innerWidth, height: window.innerHeight })

const localStorageItems = computed(() => {
  const items = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('onuf') || key?.includes('lang')) {
      items.push([key, localStorage.getItem(key)])
    }
  }
  return items
})

// Méthodes
const refreshData = () => {
  viewport.value = { width: window.innerWidth, height: window.innerHeight }
  captureErrors()
}

const clearLogs = () => {
  logs.value = []
}

const testTranslation = (key) => {
  try {
    if (!i18n?.t) return 'fonction t() non disponible'
    const result = i18n.t(key)
    if (result === key) {
      missingKeys.value.push(key)
      return `❌ MANQUANT: ${key}`
    }
    return result
  } catch (error) {
    return `❌ ERREUR: ${error.message}`
  }
}

const testTranslationFiles = async () => {
  networkTests.value = []
  const files = ['/src/locales/fr.json', '/src/locales/en.json', '/src/locales/ar.json']
  
  for (const file of files) {
    try {
      const response = await fetch(file)
      networkTests.value.push({
        url: file,
        status: response.status,
        ok: response.ok
      })
    } catch (error) {
      networkTests.value.push({
        url: file,
        status: 'ERREUR',
        ok: false,
        error: error.message
      })
    }
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatLogData = (data) => {
  if (typeof data === 'object') {
    return JSON.stringify(data, null, 2)
  }
  return String(data)
}

const copyDebugInfo = async () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    i18n: {
      locale: currentLocale.value,
      availableLocales: availableLocales.value,
      messages: loadedMessages.value,
      missingKeys: missingKeys.value.slice(0, 50)
    },
    vue: {
      version: vueVersion.value,
      mode: buildMode.value,
      route: currentRoute.value
    },
    logs: logs.value.slice(-20),
    localStorage: Object.fromEntries(localStorageItems.value)
  }
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
    addLog('info', 'Debug info copié dans le presse-papier')
  } catch (error) {
    addLog('error', 'Erreur copie:', error)
  }
}

const downloadDebugInfo = () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    i18n: i18nConfig.value,
    logs: logs.value,
    tests: networkTests.value
  }
  
  const blob = new Blob([JSON.stringify(debugInfo, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `onuf-debug-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const updateForceShow = () => {
  localStorage.setItem('onuf-debug-force', forceShow.value.toString())
}

const addLog = (level, message, data = null) => {
  logs.value.push({
    timestamp: Date.now(),
    level,
    message,
    data
  })
  
  // Garder seulement les 200 derniers logs
  if (logs.value.length > 200) {
    logs.value = logs.value.slice(-200)
  }
}

const captureErrors = () => {
  // Capturer les erreurs Vue
  const app = document.querySelector('#app')?.__vue_app__
  if (app) {
    app.config.errorHandler = (error, instance, info) => {
      addLog('error', `Vue Error: ${error.message}`, { error: error.stack, info })
    }
  }
  
  // Capturer les erreurs globales
  window.addEventListener('error', (event) => {
    addLog('error', `Global Error: ${event.message}`, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })
  
  // Capturer les promesses rejetées
  window.addEventListener('unhandledrejection', (event) => {
    addLog('error', `Unhandled Promise: ${event.reason}`, event.reason)
  })
}

// Lifecycle
onMounted(() => {
  // ✅ NOUVEAU: Écouter l'événement du menu pour ouvrir le debug
  window.addEventListener('toggle-debug-panel', handleToggleDebug)
  
  // Récupérer l'état forcé
  forceShow.value = localStorage.getItem('onuf-debug-force') === 'true'
  
  // Capturer les erreurs
  captureErrors()
  
  // Intercepter console.log pour debug
  const originalLog = console.log
  const originalError = console.error
  const originalWarn = console.warn
  
  console.log = (...args) => {
    // Convertir les objets en string de façon sûre
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch (e) {
          return '[Object]'
        }
      }
      return String(arg)
    }).join(' ')
    
    addLog('log', message)
    originalLog(...args)
  }
  
  console.error = (...args) => {
    // Convertir les objets en string de façon sûre
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch (e) {
          return '[Object]'
        }
      }
      return String(arg)
    }).join(' ')
    
    addLog('error', message)
    originalError(...args)
  }
  
  console.warn = (...args) => {
    // Convertir les objets en string de façon sûre
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg)
        } catch (e) {
          return '[Object]'
        }
      }
      return String(arg)
    }).join(' ')
    
    addLog('warn', message)
    originalWarn(...args)
  }
  
  // Log initial
  addLog('info', '🐛 MobileDebugViewer initialisé')
  addLog('info', `Mode: ${buildMode.value}, Locale: ${currentLocale.value}`)
  
  // Tester les traductions au démarrage
  nextTick(() => {
    testTranslation('app.title')
    testTranslation('audit.title')
    testTranslation('navigation.audit')
  })
})

// Cleanup
onUnmounted(() => {
  // ✅ NOUVEAU: Nettoyer l'event listener
  window.removeEventListener('toggle-debug-panel', handleToggleDebug)
})
</script>

<style scoped>
.debug-section {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.4;
}

.log-entry {
  font-family: monospace;
  font-size: 12px;
  border-left: 3px solid #ccc;
  background: #f5f5f5;
}

.log-entry.log-error {
  border-left-color: #f44336;
  background: #ffebee;
}

.log-entry.log-warn {
  border-left-color: #ff9800;
  background: #fff8e1;
}

.log-entry.log-info {
  border-left-color: #2196f3;
  background: #e3f2fd;
}

.log-time {
  font-size: 10px;
  opacity: 0.7;
  min-width: 60px;
}

.log-level {
  font-size: 10px;
  font-weight: bold;
  min-width: 50px;
}

.log-message {
  word-break: break-word;
}

.log-data {
  padding-left: 120px;
  opacity: 0.8;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}
</style>
