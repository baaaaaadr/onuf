// ONUF Color System - Single Source of Truth
// This file defines all colors used across the application
// Update colors here to change the entire app theme

// ==================================================
// BRAND COLORS - PRIMARY THEME
// ==================================================

export const BRAND_COLORS = {
  // Primary Brand Color - Blue (NEW)
  primary: '#125EB8',
  primaryLight: '#1976D2', // Lighter variant for hover states
  primaryDark: '#0D47A1',  // Darker variant for pressed states
  primaryLighten1: '#1976D2',
  primaryLighten2: '#42A5F5',
  primaryLighten3: '#90CAF9',
  primaryDarken1: '#0D47A1',
  primaryDarken2: '#1565C0',
  
  // Secondary/Accent Color - Yellow/Gold
  accent: '#CBA052',
  accentLight: '#FFD54F',
  accentDark: '#F57C00',
  accentLighten1: '#FFD54F',
  accentLighten2: '#FFEB3B',
  accentDarken1: '#F57C00',
  
  // Legacy primary (yellow) - now used as accent
  legacyPrimary: '#F3C348', // Keep for reference/migration
}

// ==================================================
// UI FOUNDATION COLORS
// ==================================================

export const UI_COLORS = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F3F0',
  surfaceLight: '#F8F7F5',
  surfaceVariant: '#E6E3DB',
  surfaceLighter: '#FAFAFA',
  
  // Text Colors
  textPrimary: '#181611',    // Dark text on light backgrounds
  textSecondary: '#837B67',  // Muted text for labels/captions
  textDisabled: '#C4BFB3',   // Disabled text
  textOnPrimary: '#FFFFFF',  // Text on blue primary background
  textOnAccent: '#FFFFFF',   // Text on accent background
  
  // Borders and Dividers
  borderLight: '#E6E3DB',
  borderSelected: '#125EB8', // Use primary blue for selections
  divider: '#E0E0E0',
}

// ==================================================
// SEMANTIC COLORS (Status/Feedback)
// ==================================================

export const SEMANTIC_COLORS = {
  // Success - Green
  success: '#4CAF50',
  successLight: '#66BB6A',
  successLighten1: '#66BB6A',
  successLighten3: '#A5D6A7',
  successLighten5: '#E8F5E9',
  successDark: '#43A047',
  successDarken1: '#43A047',
  
  // Warning - Orange
  warning: '#FF9800',
  warningLight: '#FFA726',
  warningLighten1: '#FFA726',
  warningLighten3: '#FFCC80',
  warningLighten5: '#FFF3E0',
  warningDark: '#FB8C00',
  warningDarken1: '#FB8C00',
  
  // Error - Red
  error: '#F44336',
  errorLight: '#EF5350',
  errorLighten1: '#EF5350',
  errorLighten3: '#E57373',
  errorLighten5: '#FFEBEE',
  errorDark: '#E53935',
  errorDarken1: '#E53935',
  
  // Info - Light Blue (complementary to primary blue)
  info: '#2196F3',
  infoLight: '#42A5F5',
  infoLighten1: '#42A5F5',
  infoLighten3: '#90CAF9',
  infoLighten5: '#E3F2FD',
  infoDark: '#1E88E5',
  infoDarken1: '#1E88E5',
}

// ==================================================
// GRAYSCALE PALETTE
// ==================================================

export const GRAY_COLORS = {
  'grey-lighten-5': '#FAFAFA',
  'grey-lighten-4': '#F5F5F5',
  'grey-lighten-3': '#EEEEEE',
  'grey-lighten-2': '#E0E0E0',
  'grey-lighten-1': '#BDBDBD',
  'grey': '#9E9E9E',
  'grey-darken-1': '#837B67', // Custom ONUF gray
  'grey-darken-2': '#616161',
  'grey-darken-3': '#424242',
  'grey-darken-4': '#212121',
}

// ==================================================
// AUDIT SCORE COLORS
// ==================================================

export const SCORE_COLORS = {
  score1: '#9E9E9E',  // Very poor (gray)
  score2: '#F44336',  // Poor (red)  
  score3: '#FF9800',  // Average (orange)
  score4: '#4CAF50',  // Good (green)
}

// ==================================================
// COMPLETE VUETIFY THEME OBJECT
// ==================================================

export const VUETIFY_THEME_COLORS = {
  // Core colors
  background: UI_COLORS.background,
  surface: UI_COLORS.surface,
  'surface-light': UI_COLORS.surfaceLight,
  'surface-variant': UI_COLORS.surfaceVariant,
  
  // Primary - Blue theme
  primary: BRAND_COLORS.primary,
  'primary-darken-1': BRAND_COLORS.primaryDarken1,
  'primary-lighten-1': BRAND_COLORS.primaryLighten1,
  'primary-lighten-2': BRAND_COLORS.primaryLighten2,
  'primary-lighten-3': BRAND_COLORS.primaryLighten3,
  
  // Secondary - Use the beige from original theme
  secondary: UI_COLORS.textSecondary, // '#837B67'
  'secondary-darken-1': '#6A6356',
  'secondary-lighten-1': '#9C9484',
  
  // Accent - Yellow/Gold
  accent: BRAND_COLORS.accent,
  'accent-darken-1': BRAND_COLORS.accentDarken1,
  'accent-lighten-1': BRAND_COLORS.accentLighten1,
  
  // Semantic colors
  success: SEMANTIC_COLORS.success,
  'success-lighten-1': SEMANTIC_COLORS.successLighten1,
  'success-lighten-3': SEMANTIC_COLORS.successLighten3,
  'success-lighten-5': SEMANTIC_COLORS.successLighten5,
  'success-darken-1': SEMANTIC_COLORS.successDarken1,
  
  warning: SEMANTIC_COLORS.warning,
  'warning-lighten-1': SEMANTIC_COLORS.warningLighten1,
  'warning-lighten-3': SEMANTIC_COLORS.warningLighten3,
  'warning-lighten-5': SEMANTIC_COLORS.warningLighten5,
  'warning-darken-1': SEMANTIC_COLORS.warningDarken1,
  
  error: SEMANTIC_COLORS.error,
  'error-lighten-1': SEMANTIC_COLORS.errorLighten1,
  'error-lighten-3': SEMANTIC_COLORS.errorLighten3,
  'error-lighten-5': SEMANTIC_COLORS.errorLighten5,
  'error-darken-1': SEMANTIC_COLORS.errorDarken1,
  
  info: SEMANTIC_COLORS.info,
  'info-lighten-1': SEMANTIC_COLORS.infoLighten1,
  'info-lighten-3': SEMANTIC_COLORS.infoLighten3,
  'info-lighten-5': SEMANTIC_COLORS.infoLighten5,
  'info-darken-1': SEMANTIC_COLORS.infoDarken1,
  
  // Text colors
  'on-background': UI_COLORS.textPrimary,
  'on-surface': UI_COLORS.textPrimary,
  'on-primary': UI_COLORS.textOnPrimary,
  'on-secondary': '#FFFFFF',
  'on-accent': UI_COLORS.textOnAccent,
  'on-success': '#FFFFFF',
  'on-warning': UI_COLORS.textPrimary,
  'on-error': '#FFFFFF',
  'on-info': '#FFFFFF',
  
  // Gray scale
  ...GRAY_COLORS,
}

// ==================================================
// CSS CUSTOM PROPERTIES FOR GLOBAL USE
// ==================================================

export const CSS_CUSTOM_PROPERTIES = {
  '--onuf-primary': BRAND_COLORS.primary,
  '--onuf-primary-light': BRAND_COLORS.primaryLight,
  '--onuf-primary-dark': BRAND_COLORS.primaryDark,
  '--onuf-accent': BRAND_COLORS.accent,
  '--onuf-accent-light': BRAND_COLORS.accentLight,
  '--onuf-accent-dark': BRAND_COLORS.accentDark,
  '--onuf-background': UI_COLORS.background,
  '--onuf-surface': UI_COLORS.surface,
  '--onuf-text-primary': UI_COLORS.textPrimary,
  '--onuf-text-secondary': UI_COLORS.textSecondary,
  '--onuf-border-light': UI_COLORS.borderLight,
  '--onuf-success': SEMANTIC_COLORS.success,
  '--onuf-warning': SEMANTIC_COLORS.warning,
  '--onuf-error': SEMANTIC_COLORS.error,
  '--onuf-info': SEMANTIC_COLORS.info,
}

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

/**
 * Apply CSS custom properties to document root
 * Call this in main.js to make colors available globally
 */
export function applyGlobalCSSProperties() {
  const root = document.documentElement
  Object.entries(CSS_CUSTOM_PROPERTIES).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

/**
 * Get a color value by key for programmatic use
 * @param {string} colorKey - dot notation key like 'brand.primary' or 'semantic.success'
 * @returns {string} hex color value
 */
export function getColor(colorKey) {
  const [category, color, variant] = colorKey.split('.')
  
  const colorMaps = {
    brand: BRAND_COLORS,
    ui: UI_COLORS,
    semantic: SEMANTIC_COLORS,
    gray: GRAY_COLORS,
    score: SCORE_COLORS,
  }
  
  const colorMap = colorMaps[category]
  if (!colorMap) return null
  
  if (variant) {
    const variantKey = `${color}${variant.charAt(0).toUpperCase() + variant.slice(1)}`
    return colorMap[variantKey] || colorMap[color]
  }
  
  return colorMap[color]
}

/**
 * Get PWA theme color (for manifest and meta tags)
 * @returns {string} primary brand color
 */
export function getPWAThemeColor() {
  return BRAND_COLORS.primary
}

export default {
  BRAND_COLORS,
  UI_COLORS,
  SEMANTIC_COLORS,
  GRAY_COLORS,
  SCORE_COLORS,
  VUETIFY_THEME_COLORS,
  CSS_CUSTOM_PROPERTIES,
  applyGlobalCSSProperties,
  getColor,
  getPWAThemeColor,
}