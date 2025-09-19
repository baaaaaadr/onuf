// Configuration Vuetify pour ONUF PWA - Thème Blue Redesign v3.0
// Mise à jour : Changement de couleur primaire Yellow → Blue (#125EB8)
// Source unique de vérité pour les couleurs: src/theme/colors.js

import 'vuetify/styles' // Import des styles Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale' // ✅ Support français
import '@mdi/font/css/materialdesignicons.css'

// ✅ NOUVEAU: Import du système de couleurs centralisé
import { VUETIFY_THEME_COLORS } from '@/theme/colors.js'

// ✅ CORRECTION: Traductions françaises personnalisées pour éviter les erreurs
const frenchTranslations = {
  ...fr,
  rating: {
    ariaLabel: {
      item: 'Note {0} sur {1}'
    }
  }
}

// ✅ NOUVEAU: Thème ONUF utilisant le système de couleurs centralisé
// Primary: Blue (#125EB8) | Accent: Gold (#CBA052)
const onufLightTheme = {
  dark: false,
  colors: VUETIFY_THEME_COLORS // Utilise la source unique de vérité
}

// Configuration des defaults pour tous les composants
const defaults = {
  global: {
    ripple: true,
  },
  
  // Boutons
  VBtn: {
    rounded: 'pill',
    elevation: 0,
    height: 48,
    class: 'text-none font-weight-medium',
    style: 'letter-spacing: 0.5px; transition: all 0.2s ease;'
  },
  
  // Cards
  VCard: {
    rounded: 'lg',
    elevation: 0,
    color: 'surface',
    class: 'overflow-hidden'
  },
  
  VCardTitle: {
    class: 'text-h6 font-weight-bold'
  },
  
  VCardText: {
    class: 'text-body-2'
  },
  
  // Form inputs
  VTextField: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: 'lg',
    hideDetails: 'auto'
  },
  
  VTextarea: {
    variant: 'outlined',
    rounded: 'lg',
    hideDetails: 'auto'
  },
  
  VSelect: {
    variant: 'outlined',
    density: 'comfortable',
    rounded: 'lg',
    hideDetails: 'auto'
  },
  
  // ✅ NOUVEAU: Configuration Rating pour éviter les erreurs
  VRating: {
    density: 'compact',
    size: 'small',
    color: 'primary',
    emptyIcon: 'mdi-star-outline',
    fullIcon: 'mdi-star',
    halfIcon: 'mdi-star-half-full',
    readonly: true,
    length: 4
  },
  
  // ✅ NOUVEAU: Configuration Chip
  VChip: {
    size: 'small',
    rounded: 'pill',
    variant: 'tonal'
  },
  
  // ✅ NOUVEAU: Configuration Alert
  VAlert: {
    rounded: 'lg',
    variant: 'tonal',
    density: 'comfortable'
  },
  
  // Lists
  VList: {
    rounded: 'lg',
    elevation: 0,
    color: 'surface',
    density: 'comfortable'
  },
  
  VListItem: {
    rounded: 'lg',
    minHeight: 56,
    class: 'px-4'
  },
  
  // Navigation
  VBottomNavigation: {
    elevation: 0,
    height: 64,
    color: 'background',
    grow: true
  },
  
  VAppBar: {
    elevation: 0,
    height: 56,
    flat: true
  },
  
  VAppBarTitle: {
    class: 'text-h6 font-weight-medium text-center'
  },
  
  // Progress
  VProgressLinear: {
    rounded: true,
    height: 8,
    color: 'primary'
  },
  
  // Icons
  VIcon: {
    size: 24
  },
  
  // FAB
  VFab: {
    size: 'large',
    icon: true,
    elevation: 3,
    color: 'primary'
  }
}

// ✅ NOUVEAU: Créer thème RTL pour l'arabe
const onufLightRTL = {
  dark: false,
  colors: VUETIFY_THEME_COLORS, // Utilise la même source unique de vérité
  rtl: true // Activer le mode RTL
}

// ✅ NOUVEAU: Fonction pour déterminer le thème initial basé sur la langue
const getInitialTheme = () => {
  const storedLang = localStorage.getItem('user-lang') || 'fr'
  return storedLang === 'ar' ? 'onufLightRTL' : 'onufLight'
}

// Export de la configuration complète
export default createVuetify({
  components,
  directives,
  // ✅ NOUVEAU: Configuration RTL globale
  rtl: getInitialTheme() === 'onufLightRTL',
  defaults: {
    VCardTitle: {
      class: 'text-h5 font-weight-bold',
      style: 'letter-spacing: 0.0125em;' // Slightly increase letter spacing for better readability
    }
  },
  theme: {
    defaultTheme: getInitialTheme(), // ✅ MODIFIÉ: Thème basé sur la langue
    themes: {
      onufLight: onufLightTheme,
      onufLightRTL: onufLightRTL // ✅ NOUVEAU: Thème RTL
    },
    variations: {
      colors: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      lighten: 5,
      darken: 4,
    },
  },
  defaults,
  icons: {
    defaultSet: 'mdi',
  },
  locale: {
    locale: 'fr',
    fallback: 'en',
    messages: {
      fr: frenchTranslations
    }
  },
})
