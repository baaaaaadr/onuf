import { ref } from 'vue'
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'

export function useAuditSubmission() {
  // State
  const showSuccessDialog = ref(false)
  const submissionId = ref(null)
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('error')
  const isSubmitting = ref(false)
  
  // Get composables
  const { currentUser, isAuthenticated } = useAuth()
  const { saveAudit } = useAudits()
  const { isOnline, addToSyncQueue } = getGlobalSyncQueue()

  // Show error message
  const showError = (message) => {
    snackbarText.value = message
    snackbarColor.value = 'error'
    snackbar.value = true
  }

  // Show success message
  const showSuccess = (message) => {
    snackbarText.value = message
    snackbarColor.value = 'success'
    snackbar.value = true
  }

  // Submit form
  const submitForm = async (formData) => {
    if (isSubmitting.value) {
      showError('Soumission déjà en cours')
      return
    }
    
    isSubmitting.value = true
    
    try {
      // Prepare audit data with all GPS information
      // The useAudits composable expects coordinates as an object with lat/lng
      const auditData = {
        ...formData,
        // Ensure coordinates are properly formatted
        coordinates: formData.coordinates || { lat: null, lng: null },
        // Also add latitude/longitude for compatibility
        latitude: formData.coordinates?.lat,
        longitude: formData.coordinates?.lng,
        // Keep locationAccuracy
        locationAccuracy: formData.locationAccuracy,
        accuracy: formData.locationAccuracy, // Alias for compatibility
        // Timestamp
        timestamp: new Date().toISOString(),
        userId: currentUser?.value?.user_id,
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Add geolocation details if available
      if (formData.gpsDetails) {
        auditData.gpsTimestamp = formData.gpsDetails.timestamp
        auditData.altitude = formData.gpsDetails.altitude
        auditData.speed = formData.gpsDetails.speed
        auditData.heading = formData.gpsDetails.heading
        auditData.nearbyInfo = formData.location // Use the selected quartier as nearbyInfo
      }

      // Use the saveAudit function from useAudits which handles both local and cloud saving
      const result = await saveAudit(auditData)
      
      if (result.success) {
        submissionId.value = result.audit?.id || result.data?.id || auditData.id
        showSuccessDialog.value = true
        
        // Ne pas afficher de snackbar quand on affiche le dialogue de succès
        // Le statut de synchronisation est déjà affiché dans le dialogue
        
        // Clear progress from localStorage
        localStorage.removeItem('audit_progress')
        localStorage.removeItem('onuf_audit_progress')
      } else {
        showError(result.error || 'Erreur lors de la sauvegarde')
      }
      
      return result
    } catch (error) {
      console.error('Error submitting form:', error)
      showError(`Erreur: ${error.message}`)
      return { success: false, error: error.message }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    // State
    showSuccessDialog,
    submissionId,
    snackbar,
    snackbarText,
    snackbarColor,
    isSubmitting,
    
    // Methods
    submitForm,
    showError,
    showSuccess
  }
}
