<template>
  <div class="page-transition-wrapper">
    <transition
      :name="transitionName"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <slot />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps({
  name: {
    type: String,
    default: 'slide'
  },
  /* Mode supprimé car causait des problèmes avec les transitions absolues */
  duration: {
    type: Number,
    default: 300
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Route pour détecter la direction
const route = useRoute()
const previousRoute = ref('')

// Computed
const transitionName = computed(() => {
  if (props.disabled) return 'none'
  
  // Détection automatique de la direction
  if (props.name === 'auto') {
    const currentPath = route.path
    const prevPath = previousRoute.value
    
    // Navigation vers l'avant ou l'arrière
    if (currentPath === '/' || prevPath === '/') {
      return 'fade'
    }
    
    // Navigation entre pages principales
    const mainPaths = ['/', '/dashboard', '/audit', '/history', '/settings']
    const currentIndex = mainPaths.indexOf(currentPath)
    const prevIndex = mainPaths.indexOf(prevPath)
    
    if (currentIndex > prevIndex) {
      return 'slide-left'
    } else if (currentIndex < prevIndex) {
      return 'slide-right'
    }
    
    return 'fade'
  }
  
  return props.name
})

// Watchers
watch(() => route.path, (newPath, oldPath) => {
  previousRoute.value = oldPath || ''
})

// Hooks de transition
const beforeEnter = (el) => {
  el.style.transitionDuration = `${props.duration}ms`
}

const enter = (el, done) => {
  // Force reflow
  el.offsetHeight
  done()
}

const afterEnter = (el) => {
  el.style.transitionDuration = ''
}

const beforeLeave = (el) => {
  el.style.transitionDuration = `${props.duration}ms`
}

const leave = (el, done) => {
  // Force reflow
  el.offsetHeight
  done()
}

const afterLeave = (el) => {
  el.style.transitionDuration = ''
}
</script>

<style scoped>
/* Transition Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration, 300ms) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition Slide Left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transition-duration, 300ms) ease;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

/* Transition Slide Right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all var(--transition-duration, 300ms) ease;
  position: absolute;
  width: 100%;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(30%);
  opacity: 0;
}

/* Transition Scale */
.scale-enter-active,
.scale-leave-active {
  transition: all var(--transition-duration, 300ms) cubic-bezier(0.4, 0.0, 0.2, 1);
}

.scale-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.scale-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

/* Transition Slide Up */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-duration, 300ms) cubic-bezier(0.4, 0.0, 0.2, 1);
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Aucune transition */
.none-enter-active,
.none-leave-active {
  transition: none;
}

/* Fix pour éviter le chevauchement */
.page-transition-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-left-leave-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-right-enter-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1;
}

/* Amélioration performances */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
</style>
