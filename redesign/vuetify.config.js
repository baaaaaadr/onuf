// Fichier de configuration Vuetify pour ONUF PWA
// À placer dans : src/plugins/vuetify.js

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

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
  
  // App
  VApp: {
    style: 'background: var(--v-theme-background);'
  },
  
  // Boutons
  VBtn: {
    rounded: 'pill',
    elevation: 0,
    height: 48,
    class: 'text-none font-weight-semibold',
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
  
  // Chips
  VChip: {
    rounded: 'pill',
    size: 'small',
    elevation: 0,
    class: 'font-weight-medium'
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
  
  VCheckbox: {
    color: 'primary',
    hideDetails: 'auto'
  },
  
  VRadio: {
    color: 'primary',
    hideDetails: 'auto'
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
  
  VListItemTitle: {
    class: 'text-body-1'
  },
  
  VListItemSubtitle: {
    class: 'text-body-2'
  },
  
  // Progress
  VProgressLinear: {
    rounded: true,
    height: 8,
    color: 'primary'
  },
  
  VProgressCircular: {
    width: 4,
    color: 'primary'
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
    class: 'text-h6 font-weight-semibold text-center'
  },
  
  // Dialogs
  VDialog: {
    maxWidth: 500,
    width: 'calc(100% - 32px)',
    scrim: 'black',
    opacity: 0.5
  },
  
  // Alerts
  VAlert: {
    rounded: 'lg',
    variant: 'tonal',
    density: 'comfortable'
  },
  
  // Snackbars
  VSnackbar: {
    location: 'top',
    rounded: 'pill',
    variant: 'elevated',
    elevation: 3,
    minWidth: 200,
    maxWidth: 400
  },
  
  // Dividers
  VDivider: {
    class: 'border-opacity-50'
  },
  
  // Icons
  VIcon: {
    size: 24
  },
  
  // Rating
  VRating: {
    activeColor: 'warning',
    color: 'grey-lighten-1',
    emptyIcon: 'mdi-star-outline',
    fullIcon: 'mdi-star',
    halfIcon: 'mdi-star-half-full',
    density: 'comfortable'
  },
  
  // Expansion panels
  VExpansionPanels: {
    rounded: 'lg',
    elevation: 0
  },
  
  VExpansionPanel: {
    elevation: 0,
    rounded: 'lg',
    color: 'surface'
  },
  
  // FAB
  VFab: {
    size: 'large',
    icon: true,
    elevation: 3,
    color: 'primary'
  },
  
  // Menu
  VMenu: {
    rounded: 'lg',
    elevation: 3,
    offset: 8
  },
  
  // Skeleton
  VSkeletonLoader: {
    elevation: 0,
    boilerplate: false
  }
}

// Breakpoints personnalisés
const breakpoints = {
  mobileBreakpoint: 'md',
  thresholds: {
    xs: 0,
    sm: 375,
    md: 428,
    lg: 768,
    xl: 1024,
  },
}

// Options d'affichage
const display = {
  mobileBreakpoint: 'md',
}

// Configuration des icônes
const icons = {
  defaultSet: 'mdi',
  sets: {
    mdi: {
      component: null,
    },
  },
}

// Export de la configuration complète
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'onufLight',
    themes: {
      onufLight: onufLightTheme
    },
    variations: {
      colors: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      lighten: 5,
      darken: 4,
    },
  },
  defaults,
  breakpoints,
  display,
  icons,
  locale: {
    locale: 'fr',
  },
})
