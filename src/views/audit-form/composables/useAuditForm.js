import { ref, computed } from 'vue'
import { locations } from '../config/locations'

export function useAuditForm(questions) {
  // Form data state
  const formData = ref({
    // Questions d'audit
    lighting: null,
    walkpath: null,
    openness: null,
    feeling: null,
    peoplePresence: null,
    cleanliness: null,
    naturalSurveillance: null,
    spaceDiversity: null,
    transportAccess: null,
    formalSecurity: null,
    // Location data
    location: '',
    coordinates: { lat: null, lng: null },
    locationAccuracy: null,
    gpsDetails: null,
    // Autres champs
    comment: '',
    photos: []
  })

  // Other state
  const valid = ref(false)
  const loading = ref(false)
  const availableLocations = ref([...locations])

  // Initialize form data
  const initializeFormData = () => {
    // Reset form data
    formData.value = {
      lighting: null,
      walkpath: null,
      openness: null,
      feeling: null,
      peoplePresence: null,
      cleanliness: null,
      naturalSurveillance: null,
      spaceDiversity: null,
      transportAccess: null,
      formalSecurity: null,
      location: '',
      coordinates: { lat: null, lng: null },
      locationAccuracy: null,
      gpsDetails: null,
      comment: '',
      photos: []
    }
  }

  // Load locations (could be from API in the future)
  const loadLocations = async () => {
    // For now, locations are loaded from config
    // In the future, this could load from Supabase
    return Promise.resolve()
  }

  // Update form data
  const updateFormData = (field, value) => {
    formData.value[field] = value
    
    // Save progress after each update
    if (window.saveProgress) {
      window.saveProgress(formData.value)
    }
  }

  // Fill test data for debug mode
  const fillTestData = () => {
    formData.value = {
      lighting: 4,
      walkpath: 3,
      openness: 4,
      feeling: 3,
      peoplePresence: 2,
      cleanliness: 4,
      naturalSurveillance: 3,
      spaceDiversity: 4,
      transportAccess: 5,
      formalSecurity: 2,
      location: 'Ahlaka',
      coordinates: { lat: 30.4152, lng: -9.5715 },
      locationAccuracy: 10,
      gpsDetails: null,
      comment: 'Test - Audit automatique pour debug',
      photos: []
    }
    
    if (window.addDebugLog) {
      window.addDebugLog('✅ Données de test remplies', 'success')
    }
  }

  return {
    // State
    formData,
    valid,
    loading,
    availableLocations,
    
    // Methods
    initializeFormData,
    loadLocations,
    updateFormData,
    fillTestData
  }
}
