<template>
  <button
    class="fab-button"
    :class="[
      `fab-button--${size}`,
      `fab-button--${color}`,
      {
        'fab-button--extended': extended,
        'fab-button--loading': loading,
        'fab-button--disabled': disabled
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
    @mousedown="createRipple"
  >
    <!-- Ripple container -->
    <span class="fab-ripple-container" ref="rippleContainer"></span>
    
    <!-- Content -->
    <transition name="rotate" mode="out-in">
      <v-icon
        v-if="!loading"
        :key="icon"
        :size="iconSize"
        class="fab-icon"
      >
        {{ icon }}
      </v-icon>
      <v-progress-circular
        v-else
        :size="20"
        :width="2"
        indeterminate
        color="white"
      />
    </transition>
    
    <!-- Extended text -->
    <transition name="slide">
      <span v-if="extended && text" class="fab-text">
        {{ text }}
      </span>
    </transition>
    
    <!-- Badge -->
    <span v-if="badge" class="fab-badge">
      {{ badge }}
    </span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-plus'
  },
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  },
  size: {
    type: String,
    default: 'regular',
    validator: (value) => ['mini', 'small', 'regular', 'large'].includes(value)
  },
  extended: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  badge: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['click'])

// Refs
const rippleContainer = ref(null)

// Computed
const iconSize = computed(() => {
  const sizes = {
    mini: 18,
    small: 20,
    regular: 24,
    large: 28
  }
  return sizes[props.size]
})

// Methods
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const createRipple = (event) => {
  if (props.disabled || props.loading) return
  
  const button = event.currentTarget
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('fab-ripple')
  
  rippleContainer.value.appendChild(ripple)
  
  // Animation
  requestAnimationFrame(() => {
    ripple.classList.add('fab-ripple--active')
  })
  
  // Cleanup
  setTimeout(() => {
    ripple.remove()
  }, 600)
}
</script>

<style scoped>
/* Base button */
.fab-button {
  position: relative;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
              0 6px 10px 0 rgba(0, 0, 0, 0.14),
              0 1px 18px 0 rgba(0, 0, 0, 0.12);
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Extended variant */
.fab-button--extended {
  border-radius: 28px;
  padding: 0 20px;
}

/* Sizes */
.fab-button--mini {
  width: 40px;
  height: 40px;
  font-size: 11px;
}

.fab-button--small {
  width: 48px;
  height: 48px;
  font-size: 12px;
}

.fab-button--regular {
  width: 56px;
  height: 56px;
  font-size: 14px;
}

.fab-button--large {
  width: 64px;
  height: 64px;
  font-size: 16px;
}

/* Extended sizes */
.fab-button--mini.fab-button--extended {
  height: 40px;
  min-width: 80px;
}

.fab-button--small.fab-button--extended {
  height: 48px;
  min-width: 96px;
}

.fab-button--regular.fab-button--extended {
  height: 56px;
  min-width: 112px;
}

.fab-button--large.fab-button--extended {
  height: 64px;
  min-width: 128px;
}

/* Colors */
.fab-button--primary {
  background-color: var(--onuf-primary);
  color: var(--onuf-dark);
}

.fab-button--secondary {
  background-color: var(--onuf-secondary);
  color: white;
}

.fab-button--success {
  background-color: #4CAF50;
  color: white;
}

.fab-button--warning {
  background-color: #FF9800;
  color: white;
}

.fab-button--error {
  background-color: #F44336;
  color: white;
}

/* States */
.fab-button:hover:not(.fab-button--disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
              0 8px 10px 1px rgba(0, 0, 0, 0.14),
              0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.fab-button:active:not(.fab-button--disabled) {
  transform: translateY(0);
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),
              0 3px 4px 0 rgba(0, 0, 0, 0.14),
              0 1px 8px 0 rgba(0, 0, 0, 0.12);
}

.fab-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.fab-button--loading {
  cursor: wait;
}

/* Icon */
.fab-icon {
  transition: transform 0.3s ease;
}

.fab-button:hover:not(.fab-button--disabled) .fab-icon {
  transform: scale(1.1);
}

.fab-button:active:not(.fab-button--disabled) .fab-icon {
  transform: scale(0.95);
}

/* Text */
.fab-text {
  white-space: nowrap;
  transition: all 0.3s ease;
}

/* Badge */
.fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: #F44336;
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badge-pop 0.3s ease-out;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Ripple effect */
.fab-ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.fab-ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  pointer-events: none;
}

.fab-ripple--active {
  transform: scale(4);
  opacity: 0;
  transition: transform 0.6s ease-out, opacity 0.6s ease-out;
}

/* Transitions */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease;
}

.rotate-enter-from {
  transform: rotate(180deg);
  opacity: 0;
}

.rotate-leave-to {
  transform: rotate(-180deg);
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Responsive */
@media (max-width: 600px) {
  .fab-button {
    touch-action: manipulation;
  }
}

/* Accessibility */
.fab-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .fab-button {
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.5),
                0 6px 10px 0 rgba(0, 0, 0, 0.3),
                0 1px 18px 0 rgba(0, 0, 0, 0.25);
  }
  
  .fab-ripple {
    background-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
