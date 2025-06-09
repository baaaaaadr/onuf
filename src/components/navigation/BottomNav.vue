<template>
  <v-bottom-navigation
    :model-value="activeTab"
    class="onuf-bottom-nav"
    :class="bottomNavClasses"
    :height="navHeight"
    grow
  >
    <!-- Onglet Accueil -->
    <v-btn 
      :value="homeValue"
      class="nav-btn"
      :class="{ 'nav-btn--active': isActive(homeValue) }"
      @click="navigateTo('/')"
    >
      <div class="nav-content">
        <v-icon :size="iconSize">
          {{ isActive(homeValue) ? 'mdi-home' : 'mdi-home-outline' }}
        </v-icon>
        <span class="nav-label">{{ homeLabel }}</span>
        <div v-if="isActive(homeValue)" class="nav-indicator"></div>
      </div>
    </v-btn>

    <!-- Onglet Audit -->
    <v-btn 
      :value="auditValue"
      class="nav-btn nav-btn--primary"
      :class="{ 'nav-btn--active': isActive(auditValue) }"
      @click="navigateTo('/audit')"
    >
      <div class="nav-content">
        <div class="nav-icon-container">
          <v-icon :size="iconSize">
            {{ isActive(auditValue) ? 'mdi-clipboard-check' : 'mdi-clipboard-check-outline' }}
          </v-icon>
          <div v-if="pendingAuditsCount > 0" class="nav-badge">
            {{ pendingAuditsCount > 99 ? '99+' : pendingAuditsCount }}
          </div>
        </div>
        <span class="nav-label">{{ auditLabel }}</span>
        <div v-if="isActive(auditValue)" class="nav-indicator"></div>
      </div>
    </v-btn>

    <!-- Onglet Historique -->
    <v-btn 
      :value="historyValue"
      class="nav-btn"
      :class="{ 'nav-btn--active': isActive(historyValue) }"
      @click="navigateTo('/history')"
    >
      <div class="nav-content">
        <div class="nav-icon-container">
          <v-icon :size="iconSize">
            {{ isActive(historyValue) ? 'mdi-history' : 'mdi-history' }}
          </v-icon>
          <div v-if="unsyncedCount > 0" class="nav-badge nav-badge--warning">
            {{ unsyncedCount > 99 ? '99+' : unsyncedCount }}
          </div>
        </div>
        <span class="nav-label">{{ historyLabel }}</span>
        <div v-if="isActive(historyValue)" class="nav-indicator"></div>
      </div>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  // Labels personnalisés
  homeLabel: {
    type: String,
    default: 'Accueil'
  },
  auditLabel: {
    type: String,
    default: 'Audit'
  },
  historyLabel: {
    type: String,
    default: 'Historique'
  },
  
  // Valeurs des onglets
  homeValue: {
    type: String,
    default: 'home'
  },
  auditValue: {
    type: String,
    default: 'audit'
  },
  historyValue: {
    type: String,
    default: 'history'
  },
  
  // Apparence
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'elevated'].includes(value)
  },
  
  // Badges/Notifications
  pendingAuditsCount: {
    type: Number,
    default: 0
  },
  unsyncedCount: {
    type: Number,
    default: 0
  },
  
  // Options
  hideLabels: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['tab-change', 'navigate'])

const route = useRoute()
const router = useRouter()

// Onglet actif basé sur la route
const activeTab = computed(() => {
  const path = route.path
  if (path === '/' || path.includes('/intro') || path.includes('/dashboard')) {
    return props.homeValue
  }
  if (path.includes('/audit')) {
    return props.auditValue
  }
  if (path.includes('/history')) {
    return props.historyValue
  }
  return props.homeValue
})

// Classes CSS dynamiques
const bottomNavClasses = computed(() => [
  `onuf-bottom-nav--${props.variant}`,
  {
    'onuf-bottom-nav--no-labels': props.hideLabels
  }
])

// Hauteur de la navigation
const navHeight = computed(() => {
  if (props.hideLabels) return 56
  return props.variant === 'compact' ? 60 : 64
})

// Taille des icônes
const iconSize = computed(() => {
  return props.variant === 'compact' ? 20 : 24
})

// Vérification si un onglet est actif
const isActive = (tabValue) => {
  return activeTab.value === tabValue
}

// Navigation
const navigateTo = (path) => {
  if (route.path !== path) {
    router.push(path)
    emit('navigate', path)
  }
}

// Gestion du changement d'onglet
const handleTabChange = (newValue) => {
  let targetPath = '/'
  
  switch (newValue) {
    case props.auditValue:
      targetPath = '/audit'
      break
    case props.historyValue:
      targetPath = '/history'
      break
    default:
      targetPath = '/'
  }
  
  navigateTo(targetPath)
  emit('tab-change', newValue)
}
</script>

<style scoped>
.onuf-bottom-nav {
  border-top: 1px solid var(--onuf-surface-variant) !important;
  background: var(--onuf-background) !important;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1) !important;
}

.onuf-bottom-nav--elevated {
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15) !important;
}

.onuf-bottom-nav--compact {
  border-top-width: 0 !important;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1) !important;
}

/* Boutons de navigation */
.nav-btn {
  flex-direction: column !important;
  height: 100% !important;
  border-radius: 0 !important;
  min-width: 0 !important;
  padding: var(--spacing-xs) var(--spacing-sm) !important;
  position: relative;
  transition: all var(--transition-normal) !important;
}

.nav-btn .v-btn__content {
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 100%;
  position: relative;
}

/* Icônes */
.nav-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn .v-icon {
  color: var(--onuf-text-secondary) !important;
  transition: all var(--transition-fast) !important;
}

.nav-btn--active .v-icon {
  color: var(--onuf-primary) !important;
}

.nav-btn--primary .v-icon {
  color: var(--onuf-text-secondary) !important;
}

.nav-btn--primary.nav-btn--active .v-icon {
  color: var(--onuf-primary) !important;
}

/* Labels */
.nav-label {
  font-size: 0.75rem !important;
  font-weight: var(--font-weight-medium) !important;
  color: var(--onuf-text-secondary) !important;
  line-height: 1 !important;
  text-transform: none !important;
  letter-spacing: 0.025em !important;
  transition: all var(--transition-fast) !important;
  margin-top: 2px;
}

.nav-btn--active .nav-label {
  color: var(--onuf-primary) !important;
  font-weight: var(--font-weight-semibold) !important;
}

.onuf-bottom-nav--no-labels .nav-label {
  display: none;
}

/* Indicateur actif */
.nav-indicator {
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--onuf-primary);
  border-radius: 50%;
  animation: indicatorAppear 0.2s ease-out;
}

@keyframes indicatorAppear {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

/* Badges de notification */
.nav-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: var(--onuf-error);
  color: white;
  font-size: 0.625rem;
  font-weight: var(--font-weight-bold);
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  border: 2px solid var(--onuf-background);
  z-index: 1;
}

.nav-badge--warning {
  background: var(--onuf-warning);
  color: var(--onuf-text-primary);
}

/* États d'interaction */
.nav-btn:hover:not(.nav-btn--active) {
  background: rgba(243, 195, 72, 0.04) !important;
}

.nav-btn:hover:not(.nav-btn--active) .v-icon {
  color: var(--onuf-primary) !important;
  opacity: 0.8;
}

.nav-btn:hover:not(.nav-btn--active) .nav-label {
  color: var(--onuf-primary) !important;
  opacity: 0.8;
}

.nav-btn:active {
  background: rgba(243, 195, 72, 0.08) !important;
  transform: scale(0.98);
}

/* Animation de pression tactile */
.nav-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(243, 195, 72, 0.2);
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

.nav-btn:active::before {
  width: 48px;
  height: 48px;
}

/* Variants */
.onuf-bottom-nav--compact .nav-btn {
  padding: var(--spacing-xs) !important;
}

.onuf-bottom-nav--compact .nav-label {
  font-size: 0.6875rem !important;
}

/* Responsive */
@media (max-width: 374px) {
  .nav-btn {
    padding: var(--spacing-xs) 2px !important;
  }
  
  .nav-label {
    font-size: 0.6875rem !important;
  }
  
  .nav-badge {
    min-width: 14px;
    height: 14px;
    font-size: 0.5625rem !important;
    top: -4px;
    right: -6px;
  }
}

/* Mode paysage mobile */
@media (orientation: landscape) and (max-height: 500px) {
  .onuf-bottom-nav {
    height: 48px !important;
  }
  
  .nav-btn {
    padding: 2px var(--spacing-xs) !important;
  }
  
  .nav-label {
    font-size: 0.625rem !important;
  }
  
  .nav-content {
    gap: 1px;
  }
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .nav-btn,
  .nav-indicator,
  .nav-badge {
    transition: none !important;
    animation: none !important;
  }
}

/* Focus pour accessibilité */
.nav-btn:focus-visible {
  outline: 2px solid var(--onuf-primary);
  outline-offset: -2px;
}
</style>
