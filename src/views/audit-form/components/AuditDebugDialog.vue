<template>
  <div v-if="show" class="debug-overlay" @click="closeDialog">
    <div class="debug-dialog" @click.stop>
      <!-- Header -->
      <div class="debug-header">
        <div class="header-content">
          <span class="debug-emoji">🐛</span>
          <h2 class="debug-title">Mode Debug</h2>
        </div>
        <button class="close-btn" @click="closeDialog">
          <span>✕</span>
        </button>
      </div>
      
      <!-- Content -->
      <div class="debug-content">
        <!-- Test Data Section -->
        <div class="debug-section">
          <div class="section-header">
            <span class="section-emoji">🧪</span>
            <h3 class="section-title">Données de Test</h3>
            <p class="section-description">Remplir automatiquement le formulaire avec des données d'exemple</p>
          </div>
          <div class="section-content">
            <button 
              class="test-btn"
              @click="$emit('fill-test-data')"
            >
              <span class="btn-emoji">⚡</span>
              <span class="btn-text">Remplir le formulaire</span>
            </button>
          </div>
        </div>

        <!-- Current Form Data -->
        <div class="debug-section">
          <div class="section-header">
            <span class="section-emoji">📋</span>
            <h3 class="section-title">Données Actuelles</h3>
            <p class="section-description">État actuel des données du formulaire</p>
          </div>
          <div class="section-content">
            <!-- Résumé rapide -->
            <div class="data-summary">
              <div class="summary-item">
                <span class="summary-label">Questions répondues:</span>
                <span class="summary-value">{{ answeredQuestions }}/{{ totalQuestions }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">GPS:</span>
                <span class="summary-value" :class="gpsStatusClass">{{ gpsStatus }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Photos:</span>
                <span class="summary-value">{{ photosCount }}</span>
              </div>
            </div>
            
            <!-- Bouton pour afficher/masquer les détails -->
            <button 
              class="toggle-details-btn"
              @click="showDetails = !showDetails"
            >
              <span class="btn-emoji">{{ showDetails ? '🔼' : '🔽' }}</span>
              <span class="btn-text">{{ showDetails ? 'Masquer' : 'Afficher' }} les détails</span>
            </button>
            
            <!-- Détails complets -->
            <div v-if="showDetails" class="debug-details">
              <div class="json-container">
                <pre class="json-display">{{ formattedData }}</pre>
              </div>
              <div class="details-actions">
                <button class="copy-btn" @click="copyToClipboard">
                  <span class="btn-emoji">📋</span>
                  <span class="btn-text">Copier</span>
                </button>
                <button class="export-btn" @click="exportData">
                  <span class="btn-emoji">💾</span>
                  <span class="btn-text">Exporter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="debug-section">
          <div class="section-header">
            <span class="section-emoji">⚙️</span>
            <h3 class="section-title">Informations Système</h3>
          </div>
          <div class="section-content">
            <div class="system-info">
              <div class="info-item">
                <span class="info-label">Navigateur:</span>
                <span class="info-value">{{ browserInfo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Écran:</span>
                <span class="info-value">{{ screenInfo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Timestamp:</span>
                <span class="info-value">{{ currentTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="debug-footer">
        <button class="footer-btn footer-btn--secondary" @click="closeDialog">
          <span class="btn-text">Fermer</span>
        </button>
        <button class="footer-btn footer-btn--primary" @click="clearForm">
          <span class="btn-emoji">🗑️</span>
          <span class="btn-text">Vider le formulaire</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

// Props
const props = defineProps({
  modelValue: Boolean,
  formData: {
    type: Object,
    required: true
  },
  questions: {
    type: Array,
    default: () => []
  },
  locations: {
    type: Array,
    default: () => []
  }
})

// Emit
const emit = defineEmits(['update:modelValue', 'fill-test-data', 'clear-form'])

// State
const showDetails = ref(false)
const currentTime = ref('')

// v-model pour le dialog
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Computed properties
const formattedData = computed(() => {
  return JSON.stringify(props.formData, null, 2)
})

const answeredQuestions = computed(() => {
  const questionFields = [
    'lighting', 'walkpath', 'openness', 'feeling',
    'peoplePresence', 'cleanliness', 'naturalSurveillance',
    'spaceDiversity', 'transportAccess', 'formalSecurity'
  ]
  
  return questionFields.filter(field => {
    const value = props.formData[field]
    return value !== null && value !== undefined && value !== ''
  }).length
})

const totalQuestions = computed(() => {
  return props.questions.length || 10
})

const gpsStatus = computed(() => {
  const coords = props.formData.coordinates
  if (coords && coords.lat && coords.lng) {
    return '✅ Actif'
  }
  return '❌ Inactif'
})

const gpsStatusClass = computed(() => {
  const coords = props.formData.coordinates
  if (coords && coords.lat && coords.lng) {
    return 'status-success'
  }
  return 'status-error'
})

const photosCount = computed(() => {
  return props.formData.photos ? props.formData.photos.length : 0
})

const browserInfo = computed(() => {
  return `${navigator.userAgent.split(' ')[0]} • ${navigator.platform}`
})

const screenInfo = computed(() => {
  return `${window.screen.width}×${window.screen.height} • ${window.devicePixelRatio}x`
})

// Methods
const closeDialog = () => {
  show.value = false
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('fr-FR')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedData.value)
    // Feedback visuel optionnel
  } catch (error) {
    console.error('Erreur de copie:', error)
  }
}

const exportData = () => {
  const dataStr = JSON.stringify(props.formData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `audit-debug-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const clearForm = () => {
  emit('clear-form')
}

// Lifecycle
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
/* ==== Variables de la Charte Graphique ==== */
:root {
  --primary-gold: #F3C348;
  --primary-gold-light: #F9D876;
  --primary-gold-dark: #E5A716;
  --background-main: #FFFFFF;
  --surface-light: #F5F3F0;
  --surface-lighter: #F8F7F5;
  --text-primary: #181611;
  --text-secondary: #837B67;
  --text-disabled: #C4BFB3;
  --border-light: #E6E3DB;
  --success-green: #4CAF50;
  --error-red: #F44336;
  --info-blue: #2196F3;
  --shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-button: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-dialog: 0 12px 32px rgba(0, 0, 0, 0.15);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* ==== Overlay ==== */
.debug-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: var(--spacing-md);
  animation: fadeIn 0.3s ease-out;
  overflow-y: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ==== Dialog Container ==== */
.debug-dialog {
  background: var(--background-main);
  border-radius: 16px;
  box-shadow: var(--shadow-dialog);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

@keyframes slideUp {
  from {
    transform: translateY(40px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* ==== Header ==== */
.debug-header {
  background: var(--info-blue);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.debug-emoji {
  font-size: 24px;
}

.debug-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* ==== Content ==== */
.debug-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

/* ==== Sections ==== */
.debug-section {
  background: var(--surface-lighter);
  border-radius: 12px;
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.section-header {
  padding: var(--spacing-md);
  background: var(--surface-light);
  border-bottom: 1px solid var(--border-light);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-emoji {
  font-size: 18px;
}

.section-description {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.3;
}

.section-content {
  padding: var(--spacing-md);
}

/* ==== Buttons ==== */
.test-btn,
.toggle-details-btn,
.copy-btn,
.export-btn {
  background: var(--primary-gold);
  color: var(--text-primary);
  border: none;
  border-radius: 8px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.test-btn {
  width: 100%;
  justify-content: center;
  background: var(--success-green);
  color: white;
}

.toggle-details-btn {
  width: 100%;
  justify-content: center;
  background: var(--surface-light);
  color: var(--text-primary);
  margin-top: var(--spacing-md);
}

.copy-btn,
.export-btn {
  flex: 1;
}

.test-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.toggle-details-btn:hover,
.copy-btn:hover,
.export-btn:hover {
  background: var(--primary-gold-dark);
  transform: translateY(-1px);
}

.btn-emoji {
  font-size: 14px;
}

/* ==== Data Summary ==== */
.data-summary {
  background: var(--background-main);
  border-radius: 8px;
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid var(--border-light);
}

.summary-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.status-success {
  color: var(--success-green);
}

.status-error {
  color: var(--error-red);
}

/* ==== Debug Details ==== */
.debug-details {
  margin-top: var(--spacing-md);
}

.json-container {
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.json-display {
  color: #f8f8f2;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  padding: var(--spacing-md);
  margin: 0;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.4;
}

.details-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

/* ==== System Info ==== */
.system-info {
  background: var(--background-main);
  border-radius: 8px;
  padding: var(--spacing-md);
  border: 1px solid var(--border-light);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
  font-size: 12px;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid var(--border-light);
}

.info-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
  font-weight: 400;
  font-family: monospace;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==== Footer ==== */
.debug-footer {
  background: var(--surface-light);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.footer-btn {
  border: none;
  border-radius: 8px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.footer-btn--secondary {
  background: var(--background-main);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.footer-btn--primary {
  background: var(--error-red);
  color: white;
}

.footer-btn:hover {
  transform: translateY(-1px);
}

.footer-btn--secondary:hover {
  background: var(--surface-lighter);
  color: var(--text-primary);
}

.footer-btn--primary:hover {
  background: #d32f2f;
}

/* ==== Responsive ==== */
@media (max-width: 768px) {
  .debug-dialog {
    margin: var(--spacing-sm);
    max-height: 95vh;
  }
  
  .debug-header {
    padding: var(--spacing-md);
  }
  
  .debug-content {
    padding: var(--spacing-md);
  }
  
  .debug-footer {
    padding: var(--spacing-md);
    flex-direction: column;
  }
  
  .details-actions {
    flex-direction: column;
  }
}

@media (max-width: 375px) {
  .json-display {
    font-size: 10px;
  }
  
  .info-value {
    max-width: 50%;
  }
}

/* ==== Accessibilité ==== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states */
button:focus-visible {
  outline: 2px solid var(--primary-gold-dark);
  outline-offset: 2px;
}
</style>
