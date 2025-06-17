<template>
  <div 
    ref="swipeContainer"
    class="swipe-navigation-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot />
    
    <!-- Indicateur de swipe -->
    <transition name="swipe-indicator">
      <div 
        v-if="showIndicator"
        class="swipe-indicator"
        :class="swipeDirection"
        :style="indicatorStyle"
      >
        <v-icon size="32" color="white">
          {{ swipeDirection === 'left' ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
        </v-icon>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Router
const router = useRouter()
const route = useRoute()

// Routes principales dans l'ordre
const mainRoutes = [
  { path: '/', name: 'Accueil' },
  { path: '/audit', name: 'Audit' },
  { path: '/history', name: 'Historique' },
  { path: '/ma-ville', name: 'Ma Ville' }
]

// État du swipe
const swipeContainer = ref(null)
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const touchStartTime = ref(0)
const isDragging = ref(false)
const swipeDistance = ref(0)
const showIndicator = ref(false)
const swipeDirection = ref('')

// Seuils
const MIN_SWIPE_DISTANCE = 50 // Distance minimale pour déclencher un swipe
const MAX_SWIPE_TIME = 300 // Temps maximum pour un swipe rapide
const SWIPE_VELOCITY_THRESHOLD = 0.5 // Vitesse minimale pour un swipe
const VERTICAL_THRESHOLD = 50 // Seuil pour ignorer les swipes verticaux

// Computed
const currentRouteIndex = computed(() => {
  return mainRoutes.findIndex(r => r.path === route.path)
})

const canSwipeLeft = computed(() => {
  return currentRouteIndex.value > 0
})

const canSwipeRight = computed(() => {
  return currentRouteIndex.value < mainRoutes.length - 1 && currentRouteIndex.value >= 0
})

const indicatorStyle = computed(() => {
  const progress = Math.min(Math.abs(swipeDistance.value) / MIN_SWIPE_DISTANCE, 1)
  const opacity = progress * 0.8
  const scale = 0.8 + (progress * 0.2)
  const translateX = swipeDirection.value === 'left' 
    ? `${20 + (progress * 20)}px`
    : `${-20 - (progress * 20)}px`
  
  return {
    opacity,
    transform: `translateX(${translateX}) scale(${scale})`
  }
})

// Méthodes
const handleTouchStart = (e) => {
  // Ignorer si on est sur un élément interactif
  const target = e.target
  const isInteractive = target.closest('button, a, input, textarea, .v-btn, .v-card, .v-list-item')
  if (isInteractive) return

  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchStartTime.value = Date.now()
  isDragging.value = true
  swipeDistance.value = 0
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return

  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = currentX - touchStartX.value
  const deltaY = currentY - touchStartY.value

  // Ignorer si le mouvement est principalement vertical
  if (Math.abs(deltaY) > VERTICAL_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
    isDragging.value = false
    showIndicator.value = false
    return
  }

  // Déterminer la direction
  if (Math.abs(deltaX) > 20) {
    swipeDistance.value = deltaX
    
    if (deltaX > 0 && canSwipeLeft.value) {
      swipeDirection.value = 'left'
      showIndicator.value = true
      // Empêcher le défilement natif
      e.preventDefault()
    } else if (deltaX < 0 && canSwipeRight.value) {
      swipeDirection.value = 'right'
      showIndicator.value = true
      // Empêcher le défilement natif
      e.preventDefault()
    } else {
      showIndicator.value = false
    }
  }
}

const handleTouchEnd = (e) => {
  if (!isDragging.value) return

  touchEndX.value = e.changedTouches[0].clientX
  touchEndY.value = e.changedTouches[0].clientY

  const deltaX = touchEndX.value - touchStartX.value
  const deltaY = touchEndY.value - touchStartY.value
  const swipeTime = Date.now() - touchStartTime.value
  const velocity = Math.abs(deltaX) / swipeTime

  // Réinitialiser
  isDragging.value = false
  showIndicator.value = false
  swipeDistance.value = 0

  // Vérifier si c'est un swipe valide
  if (Math.abs(deltaY) > VERTICAL_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX)) {
    return // Mouvement vertical, on ignore
  }

  // Vérifier la distance et la vitesse
  const isValidSwipe = Math.abs(deltaX) > MIN_SWIPE_DISTANCE || 
                      (velocity > SWIPE_VELOCITY_THRESHOLD && swipeTime < MAX_SWIPE_TIME)

  if (!isValidSwipe) return

  // Navigation
  if (deltaX > 0 && canSwipeLeft.value) {
    // Swipe vers la droite -> page précédente
    navigateToPrevious()
  } else if (deltaX < 0 && canSwipeRight.value) {
    // Swipe vers la gauche -> page suivante
    navigateToNext()
  }
}

const navigateToPrevious = () => {
  const prevIndex = currentRouteIndex.value - 1
  if (prevIndex >= 0) {
    router.push(mainRoutes[prevIndex].path)
  }
}

const navigateToNext = () => {
  const nextIndex = currentRouteIndex.value + 1
  if (nextIndex < mainRoutes.length) {
    router.push(mainRoutes[nextIndex].path)
  }
}

// Gestion clavier pour desktop (optionnel)
const handleKeydown = (e) => {
  // Ignorer si on est dans un champ de texte
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

  if (e.key === 'ArrowLeft' && canSwipeLeft.value) {
    navigateToPrevious()
  } else if (e.key === 'ArrowRight' && canSwipeRight.value) {
    navigateToNext()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.swipe-navigation-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  touch-action: pan-y; /* Permet le scroll vertical mais capture l'horizontal */
}

/* Indicateur de swipe */
.swipe-indicator {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1000;
}

.swipe-indicator.left {
  left: 20px;
}

.swipe-indicator.right {
  right: 20px;
}

/* Transition de l'indicateur */
.swipe-indicator-enter-active,
.swipe-indicator-leave-active {
  transition: all 0.2s ease-out;
}

.swipe-indicator-enter-from,
.swipe-indicator-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.5);
}

/* Feedback visuel optionnel sur le container pendant le swipe */
.swipe-navigation-container.swiping {
  cursor: grabbing;
}

/* Animation subtile sur mobile */
@media (max-width: 768px) {
  .swipe-navigation-container {
    /* Amélioration des performances sur mobile */
    -webkit-overflow-scrolling: touch;
  }
}

/* Désactiver sur desktop si souhaité */
@media (min-width: 769px) {
  .swipe-indicator {
    display: none;
  }
}
</style>
