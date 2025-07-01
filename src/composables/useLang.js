// src/composables/useLang.js
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

// État global pour la langue
const currentLanguage = ref('fr')
const isInitialized = ref(false) // ✅ NOUVEAU: Éviter les initialisations multiples

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
  // ✅ CORRIGÉ: Utilisation conditionnelle de useI18n et useTheme
  let i18n = null
  let theme = null
  
  try {
    i18n = useI18n()
  } catch (error) {
    console.warn('useI18n not available in this context')
  }
  
  try {
    theme = useTheme()
  } catch (error) {
    console.warn('useTheme not available in this context')
  }

  // ✅ CORRIGÉ: Charger la langue sauvegardée seulement si pas encore initialisé
  const initializeLanguage = () => {
    if (isInitialized.value) {
      console.log('🌍 useLang déjà initialisé, ignoré')
      return
    }
    
    try {
      const savedLang = localStorage.getItem('onuf-language')
      console.log('🌍 Langue sauvegardée trouvée:', savedLang)
      
      if (savedLang && supportedLanguages.find(lang => lang.code === savedLang)) {
        console.log(`🌍 Initialisation langue: ${savedLang}`)
        currentLanguage.value = savedLang
        
        if (i18n) {
          i18n.locale.value = savedLang
        }
        
        // ✅ NOUVEAU: Appliquer RTL seulement si différent de la langue actuelle
        if (savedLang !== 'fr') { // Fr est la langue par défaut
          applyRTLConfiguration(savedLang)
        }
      } else {
        console.log('🌍 Pas de langue sauvegardée, utilisation du français par défaut')
      }
      
      isInitialized.value = true
    } catch (error) {
      console.error('Erreur chargement langue:', error)
    }
  }

  // Computed pour obtenir les infos de la langue actuelle
  const getCurrentLanguageInfo = computed(() => {
    return supportedLanguages.find(lang => lang.code === currentLanguage.value) || supportedLanguages[0]
  })

  // ✅ NOUVEAU: Fonction pour appliquer la configuration RTL
  const applyRTLConfiguration = (langCode) => {
    const languageInfo = supportedLanguages.find(lang => lang.code === langCode)
    if (!languageInfo) return

    const isRTL = languageInfo.direction === 'rtl'
    
    console.log(`🌍 Application de la configuration RTL: ${langCode} (${languageInfo.direction})`)
    
    // 1. Mettre à jour l'attribut dir du document
    document.documentElement.setAttribute('dir', languageInfo.direction)
    document.documentElement.setAttribute('lang', langCode)
    
    // 2. ✅ CORRIGÉ: Mettre à jour Vuetify RTL via instance globale
    try {
      // Méthode 1: Via l'instance Vuetify globale
      const app = document.querySelector('#app')?.__vue_app__
      if (app?.config?.globalProperties?.$vuetify) {
        app.config.globalProperties.$vuetify.rtl = isRTL
        console.log(`📖 Vuetify RTL mis à jour via instance globale: ${isRTL}`)
      }
      
      // Méthode 2: Via l'instance Vuetify dans window
      if (window.__vuetify) {
        window.__vuetify.rtl = isRTL
        console.log(`📖 Vuetify RTL mis à jour via window: ${isRTL}`)
      }
      
      // Méthode 3: Via CSS custom property pour forcer RTL
      document.documentElement.style.setProperty('--v-rtl', isRTL ? '1' : '0')
      
    } catch (error) {
      console.warn('Impossible de mettre à jour Vuetify RTL:', error)
    }
    
    // 3. Ajouter/supprimer classe RTL sur body pour CSS custom
    if (isRTL) {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }
    
    // 4. Forcer un re-render en émettant un événement
    window.dispatchEvent(new CustomEvent('language-direction-changed', {
      detail: { direction: languageInfo.direction, isRTL }
    }))
    
    console.log(`✅ Configuration RTL appliquée: ${langCode} (${languageInfo.direction})`)
  }

  // ✅ CORRIGÉ: Fonction pour changer de langue (seulement sur action utilisateur)
  const setLanguage = async (langCode) => {
    try {
      if (!supportedLanguages.find(lang => lang.code === langCode)) {
        console.error(`Langue non supportée: ${langCode}`)
        return
      }

      console.log(`🌍 CHANGEMENT DE LANGUE (action utilisateur): ${currentLanguage.value} → ${langCode}`)
      
      // Mettre à jour l'état global
      currentLanguage.value = langCode
      
      // Mettre à jour vue-i18n si disponible
      if (i18n) {
        i18n.locale.value = langCode
        console.log(`📖 Vue i18n locale mise à jour: ${langCode}`)
      }
      
      // Sauvegarder dans localStorage
      localStorage.setItem('onuf-language', langCode)
      console.log(`💾 Langue sauvegardée: ${langCode}`)
      
      // ✅ CORRIGÉ: Toujours appliquer la configuration RTL lors d'un changement
      applyRTLConfiguration(langCode)
      
      // ✅ NOUVEAU: Petite attente pour laisser Vue réagir
      await new Promise(resolve => setTimeout(resolve, 100))

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

  // Watcher pour les changements de langue (seulement si initialisé)
  watch(currentLanguage, (newLang) => {
    if (isInitialized.value) {
      console.log(`👁️ Langue changée observée: ${newLang}`)
    }
  })

  // ✅ CORRIGÉ: Initialiser seulement au premier appel global (pas à chaque utilisation du composable)
  if (typeof window !== 'undefined' && !isInitialized.value) {
    // Ne s'exécute qu'une seule fois
    console.log('🌍 Initialisation initiale useLang')
    initializeLanguage()
  }

  return {
    currentLanguage,
    supportedLanguages,
    getCurrentLanguageInfo,
    setLanguage,
    cycleLanguage,
    initializeLanguage,
    applyRTLConfiguration,
    isInitialized: isInitialized.value
  }
}
