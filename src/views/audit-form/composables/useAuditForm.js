import { ref, computed } from 'vue'
import { getTranslatedLocations, locationLabels } from '../config/locations'

export function useAuditForm(questions, t) {
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
    strayDogs: null,
    shade: null,
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
  
  // Computed property pour les locations traduites
  const availableLocations = computed(() => {
    if (t) {
      // Utiliser le nouveau système de traduction
      return getTranslatedLocations(t).map(location => ({
        title: location.label,
        value: location.key
      }))
    } else {
      // Fallback vers l'ancien système
      return locationLabels.map(label => ({
        title: label,
        value: label
      }))
    }
  })

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
      strayDogs: null,
      shade: null,
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
      strayDogs: 2,
      shade: 3,
      location: 'ahlaka', // Utilise la clé au lieu du label
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
