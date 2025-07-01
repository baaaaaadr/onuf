// src/composables/useLang.js
// Composable pour la gestion des langues et du support RTL

import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

// ✅ CORRECTION: État global simple sans composables
const currentLanguage = ref('fr')

// Liste des langues supportées
const supportedLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'en', name: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', rtl: true }
]

// ✅ NOUVEAU: Fonctions utilitaires sans composables
const getStoredLanguage = () => {
  return localStorage.getItem('user-lang') || 'fr'
}

const setStoredLanguage = (lang) => {
  localStorage.setItem('user-lang', lang)
}

const applyHtmlDirection = (langCode) => {
  const isRTL = langCode === 'ar'
  document.body.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.querySelector('html').setAttribute('lang', langCode)
}

export function useLang() {
  const { locale } = useI18n()
  const theme = useTheme()

  // Initialiser la langue depuis le localStorage
  const initializeLanguage = () => {
    const storedLang = getStoredLanguage()
    currentLanguage.value = storedLang
    
    // Synchroniser avec i18n
    locale.value = storedLang
    
    // Appliquer la direction HTML
    applyHtmlDirection(storedLang)
    
    // Appliquer le thème approprié
    applyTheme(storedLang)
    
    console.log(`🌍 Langue initialisée: ${storedLang}`)
  }

  // Appliquer le thème basé sur la langue
  const applyTheme = (langCode) => {
    const isRTL = langCode === 'ar'
    
    // Changer le thème
    theme.global.name.value = isRTL ? 'onufLightRTL' : 'onufLight'
    
    // ✅ NOUVEAU: Changer la configuration RTL de Vuetify
    if (theme.global.current) {
      theme.global.current.rtl = isRTL
    }
    
    console.log(`🎨 Thème appliqué: ${theme.global.name.value} (RTL: ${isRTL})`)
  }

  // Changer de langue
  const setLanguage = (langCode) => {
    if (!supportedLanguages.find(lang => lang.code === langCode)) {
      console.error(`❌ Langue non supportée: ${langCode}`)
      return
    }

    // 1. Mettre à jour l'état local
    currentLanguage.value = langCode
    
    // 2. Mettre à jour i18n
    locale.value = langCode
    
    // 3. Appliquer la direction HTML
    applyHtmlDirection(langCode)
    
    // 4. Appliquer le thème approprié (RTL/LTR)
    applyTheme(langCode)
    
    // 5. Sauvegarder dans localStorage
    setStoredLanguage(langCode)
    
    console.log(`🌍 Langue changée vers: ${langCode}`)
  }

  // Obtenir les informations de la langue actuelle
  const getCurrentLanguageInfo = computed(() => {
    return supportedLanguages.find(lang => lang.code === currentLanguage.value) || supportedLanguages[0]
  })

  // Vérifier si la langue actuelle est RTL
  const isRTL = computed(() => {
    return getCurrentLanguageInfo.value.rtl
  })

  // Obtenir la langue suivante dans la liste (pour un bouton de cycle)
  const getNextLanguage = () => {
    const currentIndex = supportedLanguages.findIndex(lang => lang.code === currentLanguage.value)
    const nextIndex = (currentIndex + 1) % supportedLanguages.length
    return supportedLanguages[nextIndex].code
  }

  // Cycler vers la langue suivante
  const cycleLanguage = () => {
    const nextLang = getNextLanguage()
    setLanguage(nextLang)
  }

  // Obtenir les traductions pour les labels de langue
  const getLanguageLabel = (langCode) => {
    const lang = supportedLanguages.find(l => l.code === langCode)
    return lang ? `${lang.flag} ${lang.name}` : langCode
  }

  return {
    // État
    currentLanguage: computed(() => currentLanguage.value),
    supportedLanguages,
    
    // Informations calculées
    getCurrentLanguageInfo,
    isRTL,
    
    // Méthodes
    initializeLanguage,
    setLanguage,
    cycleLanguage,
    getNextLanguage,
    getLanguageLabel,
    applyTheme
  }
}

// ✅ CORRECTION: Initialisation côté client sans composables
if (typeof window !== 'undefined') {
  // Initialiser la langue et la direction au chargement de la page
  const storedLang = getStoredLanguage()
  currentLanguage.value = storedLang
  applyHtmlDirection(storedLang)
  
  console.log(`🌍 Langue initialisée globalement: ${storedLang}`)
}
