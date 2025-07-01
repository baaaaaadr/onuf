// src/composables/useLang.js
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// État global pour la langue
const currentLanguage = ref('fr')

// ✅ CORRIGÉ: Configuration des langues supportées
const supportedLanguages = [
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
  },
  {
    code: 'en', 
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇲🇦',
    direction: 'rtl'
  }
]

export function useLang() {
  // ✅ CORRIGÉ: Utilisation conditionnelle de useI18n
  let i18n = null
  try {
    i18n = useI18n()
  } catch (error) {
    console.warn('useI18n not available in this context')
  }

  // Charger la langue sauvegardée au démarrage
  const initializeLanguage = () => {
    try {
      const savedLang = localStorage.getItem('onuf-language')
      if (savedLang && supportedLanguages.find(lang => lang.code === savedLang)) {
        currentLanguage.value = savedLang
        if (i18n) {
          i18n.locale.value = savedLang
        }
      }
    } catch (error) {
      console.error('Erreur chargement langue:', error)
    }
  }

  // Computed pour obtenir les infos de la langue actuelle
  const getCurrentLanguageInfo = computed(() => {
    return supportedLanguages.find(lang => lang.code === currentLanguage.value) || supportedLanguages[0]
  })

  // Fonction pour changer de langue
  const setLanguage = async (langCode) => {
    try {
      if (!supportedLanguages.find(lang => lang.code === langCode)) {
        console.error(`Langue non supportée: ${langCode}`)
        return
      }

      console.log(`🌍 Changement de langue vers: ${langCode}`)
      
      // Mettre à jour l'état global
      currentLanguage.value = langCode
      
      // Mettre à jour vue-i18n si disponible
      if (i18n) {
        i18n.locale.value = langCode
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem('onuf-language', langCode)
      
      // ✅ CORRIGÉ: Gérer la direction RTL/LTR
      const languageInfo = getCurrentLanguageInfo.value
      document.documentElement.setAttribute('dir', languageInfo.direction)
      document.documentElement.setAttribute('lang', langCode)
      
      // Mettre à jour Vuetify RTL si possible
      try {
        const vuetify = window.__vuetify || document.querySelector('#app').__vue__?.$vuetify
        if (vuetify && vuetify.theme) {
          vuetify.rtl = languageInfo.direction === 'rtl'
        }
      } catch (error) {
        console.warn('Impossible de mettre à jour Vuetify RTL:', error)
      }

    } catch (error) {
      console.error('Erreur changement langue:', error)
    }
  }

  // Fonction pour faire défiler les langues
  const cycleLanguage = () => {
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage.value)
    const nextIndex = (currentIndex + 1) % supportedLanguages.length
    setLanguage(supportedLanguages[nextIndex].code)
  }

  // Watcher pour les changements de langue
  watch(currentLanguage, (newLang) => {
    console.log(`👁️ Langue changée observée: ${newLang}`)
  })

  // Initialiser au premier chargement
  if (typeof window !== 'undefined') {
    initializeLanguage()
  }

  return {
    currentLanguage,
    supportedLanguages,
    getCurrentLanguageInfo,
    setLanguage,
    cycleLanguage,
    initializeLanguage
  }
}
