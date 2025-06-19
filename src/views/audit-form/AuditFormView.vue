<template>
  <div class="audit-form-container">
    <!-- Header avec design moderne -->
    <div class="audit-header">
      <div class="header-content">
        <h1 class="header-title">
          <span class="header-emoji">🛡️</span>
          Audit de Sécurité
        </h1>
        <p class="header-subtitle">GPS ou quartier + au moins une question requis</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <AuditProgress :form-data="formData" :total-questions="10" />

    <!-- Form Content -->
    <div class="form-content">
      <!-- Location Widget -->
      <div class="location-section">
        <div class="section-header">
          <span class="section-emoji">📍</span>
          <h2 class="section-title">Localisation GPS</h2>
        </div>
        <div class="widget-container">
          <LocationWidget
            v-model="formData.coordinates"
            :auto-start="true"
            :show-details="true"
            map-height="200px"
            @location-obtained="handleLocationObtained"
            @error="handleLocationError"
          />
        </div>
      </div>

      <!-- Quartier Selection -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-emoji">🏘️</span>
          <h2 class="section-title">Quartier</h2>
          <p class="section-description">Alternative si le GPS ne fonctionne pas</p>
        </div>
        <div class="input-container">
          <v-select
            v-model="formData.location"
            :items="availableLocations"
            label="Sélectionner un quartier"
            variant="outlined"
            prepend-inner-icon="mdi-map-marker"
            clearable
            color="primary"
            density="comfortable"
            class="custom-select"
          />
        </div>
      </div>

      <!-- Questions Component -->
      <div class="questions-section">
        <AuditQuestions
          :form-data="formData"
          @update:form-data="updateFormData"
        />
      </div>
      
      <!-- Photo Capture Section - Cadre distinct renforcé -->
      <div class="section-card photo-section">
        <div class="section-header">
          <span class="section-emoji">📸</span>
          <h2 class="section-title">Photos (optionnel)</h2>
          <p class="section-description">Ajoutez des photos pour documenter vos observations</p>
        </div>
        <div class="widget-container">
          <PhotoCapture
            v-model="formData.photos"
            :max-photos="5"
            :max-size-kb="100"
            :compression-quality="0.8"
            @photo-added="handlePhotoAdded"
            @photo-removed="handlePhotoRemoved"
          />
        </div>
      </div>
      
      <!-- Comments Section - Cadre distinct renforcé -->
      <div class="section-card comments-section">
        <div class="section-header">
          <span class="section-emoji">💬</span>
          <h2 class="section-title">Commentaires (optionnel)</h2>
          <p class="section-description">Partagez vos observations additionnelles</p>
        </div>
        <div class="input-container">
          <v-textarea
            v-model="formData.comment"
            label="Commentaires additionnels (optionnel)"
            variant="outlined"
            rows="3"
            auto-grow
            color="primary"
            density="comfortable"
            class="custom-textarea"
          />
        </div>
      </div>

      <!-- Actions Section - Bouton avec cadre distinct -->
      <div class="actions-section">
        <div class="submit-container">
          <button
            class="submit-btn"
            :disabled="!isFormValid"
            :class="{ 'submit-btn--disabled': !isFormValid, 'submit-btn--loading': loading }"
            @click="submitForm"
          >
            <span v-if="loading" class="btn-content">
              <div class="loading-spinner"></div>
              Envoi en cours...
            </span>
            <span v-else class="btn-content">
              <span class="btn-emoji">✅</span>
              Soumettre l'audit
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Debug Mode Button -->
    <button
      v-if="debugMode"
      class="debug-fab"
      @click="showDebugDialog = true"
    >
      <span>🐛</span>
    </button>

    <!-- Dialogs -->
    <AuditDebugDialog
      v-model="showDebugDialog"
      :form-data="formData"
      :questions="questions"
      :locations="availableLocations"
      @fill-test-data="fillTestData"
    />

    <AuditSuccessDialog
      v-model="showSuccessDialog"
      :submission-id="submissionId"
      :is-online="isOnline"
      @new-audit="startNewAudit"
      @go-history="goToSubmissions"
      @go-home="goToHome"
      @update:modelValue="handleSuccessDialogClose"
    />

    <!-- Snackbar for messages -->
    <div v-if="snackbar" class="snackbar" :class="{ 'show': snackbar, 'snackbar--error': snackbarColor === 'error', 'snackbar--success': snackbarColor === 'success' }">
      <div class="snackbar-content">
        <span class="snackbar-icon">
          <span v-if="snackbarColor === 'error'">❌</span>
          <span v-else-if="snackbarColor === 'success'">✅</span>
        </span>
        <span class="snackbar-text">{{ snackbarText }}</span>
        <button class="snackbar-close" @click="snackbar = false">
          <span>✕</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuditQuestions from './components/AuditQuestions.vue'
import AuditProgress from './components/AuditProgress.vue'
import AuditDebugDialog from './components/AuditDebugDialog.vue'
import AuditSuccessDialog from './components/AuditSuccessDialog.vue'
import LocationWidget from '@/components/widgets/LocationWidget.vue'
import PhotoCapture from '@/components/widgets/PhotoCapture.vue'
import { useDebugMode } from './composables/useDebugMode'
import { useAuditForm } from './composables/useAuditForm'
import { useAuditSubmission } from './composables/useAuditSubmission'
import { questions } from './config/questions'

export default {
  name: 'AuditFormView',
  components: {
    AuditQuestions,
    AuditProgress,
    AuditDebugDialog,
    AuditSuccessDialog,
    LocationWidget,
    PhotoCapture
  },
  setup() {
    const router = useRouter()
    const isOnline = ref(navigator.onLine)
    
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
    
    // Debug mode
    const { debugMode, showDebugDialog, addDebugLog, addUserAction } = useDebugMode()
    
    // Form state
    const {
      formData,
      valid,
      loading,
      availableLocations,
      initializeFormData,
      loadLocations,
      updateFormData,
      fillTestData
    } = useAuditForm(questions)
    
    // Submission
    const {
      showSuccessDialog,
      submissionId,
      snackbar,
      snackbarText,
      snackbarColor,
      submitForm,
      showError
    } = useAuditSubmission()
    
    // Location handling
    const handleLocationObtained = (locationData) => {
      if (window.addDebugLog) {
        window.addDebugLog(`📍 Position obtenue: ${locationData.coordinates.lat}, ${locationData.coordinates.lng} (±${locationData.accuracy}m)`, 'success')
      }
      
      // Store location details
      formData.value.locationAccuracy = locationData.accuracy
      formData.value.gpsDetails = locationData.details
      
      if (window.addUserAction) {
        window.addUserAction('📍 Position GPS obtenue')
      }
    }
    
    const handleLocationError = (error) => {
      if (window.addDebugLog) {
        window.addDebugLog(`❌ Erreur GPS: ${error.message}`, 'error')
      }
      showError("Impossible d'obtenir la position GPS")
    }
    
    // Photo handling
    const handlePhotoAdded = (photo) => {
      if (window.addUserAction) {
        window.addUserAction(`📸 Photo ajoutée: ${photo.name}`)
      }
    }
    
    const handlePhotoRemoved = (photo) => {
      if (window.addUserAction) {
        window.addUserAction(`🗑️ Photo supprimée: ${photo.name}`)
      }
    }
    
    // Check if form is valid
    const isFormValid = computed(() => {
      // 1. Vérifier la localisation : GPS OU quartier sélectionné
      const hasGPS = formData.value.coordinates && 
                     formData.value.coordinates.lat !== null && 
                     formData.value.coordinates.lng !== null
                     
      const hasQuartier = formData.value.location && formData.value.location.trim() !== ''
      
      const hasLocation = hasGPS || hasQuartier
      
      // 2. Vérifier qu'au moins une question est répondue
      const questionFields = [
        'lighting', 'walkpath', 'openness', 'feeling',
        'peoplePresence', 'cleanliness', 'naturalSurveillance',
        'spaceDiversity', 'transportAccess', 'formalSecurity'
      ]
      
      const hasAtLeastOneAnswer = questionFields.some(field => {
        const value = formData.value[field]
        return value !== null && value !== undefined && value !== ''
      })
      
      // Le formulaire est valide si : (GPS OU quartier) ET au moins une question
      return hasLocation && hasAtLeastOneAnswer
    })
    
    // Initialize component
    onMounted(async () => {
      initializeFormData()
      await loadLocations()
    })
    
    // Methods
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        // Message d'erreur contextuel
        const hasGPS = formData.value.coordinates && 
                       formData.value.coordinates.lat !== null && 
                       formData.value.coordinates.lng !== null
        const hasQuartier = formData.value.location && formData.value.location.trim() !== ''
        const hasLocation = hasGPS || hasQuartier
        
        const questionFields = [
          'lighting', 'walkpath', 'openness', 'feeling',
          'peoplePresence', 'cleanliness', 'naturalSurveillance',
          'spaceDiversity', 'transportAccess', 'formalSecurity'
        ]
        const hasAtLeastOneAnswer = questionFields.some(field => {
          const value = formData.value[field]
          return value !== null && value !== undefined && value !== ''
        })
        
        if (!hasLocation && !hasAtLeastOneAnswer) {
          showError("Veuillez obtenir votre position GPS ou choisir un quartier, et répondre à au moins une question")
        } else if (!hasLocation) {
          showError("Veuillez obtenir votre position GPS ou choisir un quartier")
        } else if (!hasAtLeastOneAnswer) {
          showError("Veuillez répondre à au moins une question")
        }
        return
      }
      
      loading.value = true
      try {
        const result = await submitForm(formData.value)
        if (result.success) {
          // Success is handled by the composable
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        showError("Erreur lors de la soumission du formulaire")
      } finally {
        loading.value = false
      }
    }
    
    const startNewAudit = () => {
      showSuccessDialog.value = false
      initializeFormData()
    }
    
    const handleSuccessDialogClose = (value) => {
      showSuccessDialog.value = value
      if (!value) {
        // Réinitialiser le formulaire quand on ferme le dialogue
        initializeFormData()
      }
    }
    
    const goToSubmissions = () => {
      router.push('/history')
    }
    
    const goToHome = () => {
      router.push('/')
    }
    
    return {
      // State
      questions,
      formData,
      valid,
      loading,
      availableLocations,
      debugMode,
      showDebugDialog,
      showSuccessDialog,
      submissionId,
      snackbar,
      snackbarText,
      snackbarColor,
      isOnline,
      
      // Computed
      isFormValid,
      
      // Methods
      updateFormData,
      submitForm: handleSubmit,
      fillTestData,
      startNewAudit,
      goToSubmissions,
      goToHome,
      handleLocationObtained,
      handleLocationError,
      handlePhotoAdded,
      handlePhotoRemoved,
      handleSuccessDialogClose
    }
  }
}
</script>

<style>
/* ==== Variables Globales de la Charte Graphique ==== */
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
  --border-medium: #D1CCC0;
  --border-strong: #B8B0A0;
  --success-green: #4CAF50;
  --warning-orange: #FF9800;
  --error-red: #F44336;
  --shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-card-elevated: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-button: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-button-strong: 0 6px 16px rgba(0, 0, 0, 0.15);
  --shadow-fab: 0 6px 12px rgba(0, 0, 0, 0.15);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
}
</style>

<style scoped>

/* ==== Container Principal ==== */
.audit-form-container {
  min-height: 100vh;
  background: var(--background-main);
  padding-bottom: 32px;
}

/* ==== Header ==== */
.audit-header {
  background: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-gold-light) 100%);
  padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.header-content {
  max-width: 428px;
  margin: 0 auto;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.header-emoji {
  font-size: 28px;
}

.header-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* ==== Form Content ==== */
.form-content {
  max-width: 428px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* ==== Sections ==== */
.section-card, .location-section {
  background: var(--background-main);
  border-radius: 12px;
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.location-section {
  background: var(--surface-light);
}

/* ==== Sections Spéciales avec Fond Gris ==== */
.photo-section,
.comments-section {
  background: var(--surface-light);
}

.section-header {
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-emoji {
  font-size: 20px;
}

.section-description {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--text-secondary);
  margin: 0;
}

/* ==== Widget Containers ==== */
.widget-container {
  padding: 0 var(--spacing-md) var(--spacing-md);
}



.input-container {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
}



/* ==== Questions Section ==== */
.questions-section {
  margin-bottom: var(--spacing-lg);
}

/* ==== Actions Section ==== */
.actions-section {
  margin-top: var(--spacing-xl);
  padding: 0;
}

.submit-container {
  background: var(--background-main);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: none;
  border: none;
}

/* ==== Submit Button CTA ==== */
.submit-btn {
  width: 100%;
  background: var(--primary-gold);
  color: var(--text-primary);
  border: none;
  border-radius: 9999px;
  padding: var(--spacing-lg) var(--spacing-xl);
  font-weight: 700;
  font-size: 18px;
  min-height: 56px;
  box-shadow: 0 4px 16px rgba(243, 195, 72, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  text-transform: none;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--primary-gold-dark);
  box-shadow: 0 2px 8px rgba(243, 195, 72, 0.4);
}

.submit-btn:active:not(:disabled)::before {
  left: 100%;
}

.submit-btn--disabled {
  background: var(--text-disabled);
  color: var(--text-secondary);
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.submit-btn--loading {
  background: var(--primary-gold-light);
  cursor: wait;
  box-shadow: 0 2px 8px rgba(243, 195, 72, 0.2);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
}

.btn-emoji {
  font-size: 20px;
  margin-right: var(--spacing-xs);
}

/* ==== Loading Spinner ==== */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid var(--text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ==== Debug FAB ==== */
.debug-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px 28px 8px 28px;
  background: var(--primary-gold);
  border: none;
  box-shadow: var(--shadow-fab);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;
  z-index: 1000;
}

.debug-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.debug-fab:active {
  transform: scale(0.95);
}

/* ==== Snackbar ==== */
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 16px;
  right: 16px;
  z-index: 2000;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
}

.snackbar.show {
  transform: translateY(0);
  opacity: 1;
}

.snackbar-content {
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: 12px;
  box-shadow: var(--shadow-fab);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  max-width: 428px;
  margin: 0 auto;
  transition: background-color 0.3s ease;
}

/* Error variant */
.snackbar--error .snackbar-content {
  background: var(--error-red);
  color: white;
}

/* Success variant */
.snackbar--success .snackbar-content {
  background: var(--success-green);
  color: white;
}

.snackbar-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.snackbar-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.snackbar-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.snackbar-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* ==== Custom Vuetify Overrides ==== */
.custom-select :deep(.v-field) {
  border-radius: 12px;
}

.custom-select :deep(.v-field__outline) {
  --v-field-border-color: var(--border-light);
}

.custom-select :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: var(--primary-gold);
  border-width: 2px;
}

.custom-textarea :deep(.v-field) {
  border-radius: 12px;
}

.custom-textarea :deep(.v-field__outline) {
  --v-field-border-color: var(--border-light);
}

.custom-textarea :deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: var(--primary-gold);
  border-width: 2px;
}

/* ==== Responsive ==== */
@media (max-width: 375px) {
  .header-title {
    font-size: 20px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .submit-btn {
    font-size: 14px;
    min-height: 44px;
  }
  
  .form-content {
    padding: 0 12px;
  }
  
  .submit-container {
    padding: var(--spacing-md);
  }
}

/* ==== Animations ==== */
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

.section-card, .location-section {
  animation: fadeInUp 0.3s ease-out;
}

.photo-section, .comments-section {
  animation: fadeInUp 0.4s ease-out;
}

.submit-container {
  animation: fadeInUp 0.5s ease-out;
}

/* ==== Accessibility ==== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states pour l'accessibilité */
.submit-btn:focus-visible {
  outline: 3px solid var(--primary-gold-dark);
  outline-offset: 3px;
}

.debug-fab:focus-visible {
  outline: 2px solid var(--primary-gold-dark);
  outline-offset: 2px;
}


</style>
