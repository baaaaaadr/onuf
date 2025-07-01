// Configuration Vuetify pour ONUF PWA - Thème Redesign v2.0
// Mise à jour : Phase 1 du redesign - CORRECTION ERREURS AFFICHAGE

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale' // ✅ NOUVEAU: Support français
import '@mdi/font/css/materialdesignicons.css'

// ✅ CORRECTION: Traductions françaises personnalisées pour éviter les erreurs
const frenchTranslations = {
  ...fr,
  rating: {
    ariaLabel: {
      item: 'Note {0} sur {1}'
    }
  }
}

// Définition du thème ONUF
const onufLightTheme = {
  dark: false,
  colors: {
    // Couleurs principales
    background: '#FFFFFF',
    surface: '#F5F3F0',
    'surface-light': '#F8F7F5',
    'surface-variant': '#E6E3DB',
    
    // Primary - Jaune doré
    primary: '#F3C348',
    'primary-darken-1': '#E5A716',
    'primary-lighten-1': '#F9D876',
    
    // Secondary - Beige foncé
    secondary: '#837B67',
    'secondary-darken-1': '#6A6356',
    'secondary-lighten-1': '#9C9484',
    
    // États sémantiques
    success: '#4CAF50',
    'success-lighten-1': '#66BB6A',
    'success-lighten-3': '#A5D6A7',
    'success-lighten-5': '#E8F5E9',
    'success-darken-1': '#43A047',
    
    warning: '#FF9800',
    'warning-lighten-1': '#FFA726',
    'warning-lighten-3': '#FFCC80',
    'warning-lighten-5': '#FFF3E0',
    'warning-darken-1': '#FB8C00',
    
    error: '#F44336',
    'error-lighten-1': '#EF5350',
    'error-lighten-3': '#E57373',
    'error-lighten-5': '#FFEBEE',
    'error-darken-1': '#E53935',
    
    info: '#2196F3',
    'info-lighten-1': '#42A5F5',
    'info-lighten-3': '#90CAF9',
    'info-lighten-5': '#E3F2FD',
    'info-darken-1': '#1E88E5',
    
    // Textes
    'on-background': '#181611',
    'on-surface': '#181611',
    'on-primary': '#181611',
    'on-secondary': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#181611',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    
    // Gris
    'grey-lighten-5': '#FAFAFA',
    'grey-lighten-4': '#F5F5F5',
    'grey-lighten-3': '#EEEEEE',
    'grey-lighten-2': '#E0E0E0',
    'grey-lighten-1': '#BDBDBD',
    'grey': '#9E9E9E',
    'grey-darken-1': '#837B67',
    'grey-darken-2': '#616161',
    'grey-darken-3': '#424242',
    'grey-darken-4': '#212121',
  }
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
  ...onufLightTheme,
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
