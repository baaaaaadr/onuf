<template>
  <v-container class="pa-4">
    <v-card elevation="3" class="mx-auto" max-width="800">
      <!-- Header -->
      <v-card-title class="text-h5 primary white--text">
        Formulaire d'Audit de Sécurité
      </v-card-title>

      <!-- Progress Bar -->
      <AuditProgress :form-data="formData" :total-questions="10" />

      <!-- Form Content -->
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- Location Widget -->
          <v-card class="mb-4" elevation="0">
            <v-card-title class="text-h6 pb-2">
              📍 Localisation GPS
            </v-card-title>
            <v-card-text>
              <LocationWidget
                v-model="formData.coordinates"
                :auto-start="true"
                :show-details="true"
                map-height="200px"
                @location-obtained="handleLocationObtained"
                @error="handleLocationError"
              />
            </v-card-text>
          </v-card>

          <!-- Quartier Selection -->
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <h3 class="text-h6 mb-3">🏘️ Quartier (optionnel)</h3>
              <v-select
                v-model="formData.location"
                :items="availableLocations"
                label="Sélectionner un quartier"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                clearable
              />
            </v-card-text>
          </v-card>

          <!-- Questions Component -->
          <AuditQuestions
            :form-data="formData"
            @update:form-data="updateFormData"
          />
          
          <!-- Photo Capture Section -->
          <v-card class="mt-4" elevation="0">
            <v-card-title class="text-h6 pb-2">
              📸 Photos (optionnel)
            </v-card-title>
            <v-card-text>
              <PhotoCapture
                v-model="formData.photos"
                :max-photos="5"
                :max-size-kb="100"
                :compression-quality="0.8"
                @photo-added="handlePhotoAdded"
                @photo-removed="handlePhotoRemoved"
              />
            </v-card-text>
          </v-card>
          
          <!-- Comments Section -->
          <v-card class="mt-4" elevation="0">
            <v-card-text>
              <h3 class="text-h6 mb-3">💬 Commentaires</h3>
              <v-textarea
                v-model="formData.comment"
                label="Commentaires additionnels (optionnel)"
                variant="outlined"
                rows="3"
                auto-grow
              />
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          size="large"
          :disabled="!isFormValid"
          :loading="loading"
          @click="submitForm"
        >
          Soumettre l'audit
          <v-icon right>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Debug Mode Button -->
    <v-btn
      v-if="debugMode"
      fab
      dark
      fixed
      bottom
      right
      color="info"
      @click="showDebugDialog = true"
    >
      <v-icon>mdi-bug</v-icon>
    </v-btn>

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
      @new-audit="startNewAudit"
      @view-submissions="goToSubmissions"
    />

    <!-- Snackbar for errors -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="6000">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
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
      // Check if all required questions are answered
      const requiredFields = [
        'lighting', 'walkpath', 'openness', 'feeling',
        'peoplePresence', 'cleanliness', 'naturalSurveillance',
        'spaceDiversity', 'transportAccess', 'formalSecurity'
      ]
      
      const allFieldsFilled = requiredFields.every(field => 
        formData.value[field] !== null && formData.value[field] !== undefined
      )
      
      // Check if GPS coordinates are available
      const hasCoordinates = formData.value.coordinates && 
                           formData.value.coordinates.lat !== null && 
                           formData.value.coordinates.lng !== null
      
      return allFieldsFilled && hasCoordinates && valid.value
    })
    
    // Initialize component
    onMounted(async () => {
      initializeFormData()
      await loadLocations()
    })
    
    // Methods
    const handleSubmit = async () => {
      if (!isFormValid.value) {
        showError("Veuillez répondre à toutes les questions et obtenir votre position GPS")
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
    
    const goToSubmissions = () => {
      router.push('/submissions')
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
      
      // Computed
      isFormValid,
      
      // Methods
      updateFormData,
      submitForm: handleSubmit,
      fillTestData,
      startNewAudit,
      goToSubmissions,
      handleLocationObtained,
      handleLocationError,
      handlePhotoAdded,
      handlePhotoRemoved
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}

.v-card-title {
  background: linear-gradient(45deg, #1976d2 30%, #42a5f5 90%);
}

/* Animations pour le GPS */
@keyframes pulse-gps {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
