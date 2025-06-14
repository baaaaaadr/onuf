<!-- src/components/dashboard/DashboardStatCard.vue -->
<template>
  <v-card 
    class="dashboard-stat-card" 
    :class="{ 'loading': loading }"
    :color="cardColor"
    elevation="2"
    rounded="xl"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon 
          :icon="icon" 
          :color="iconColor"
          size="32"
          class="mr-3"
        />
        <div class="flex-grow-1">
          <div class="text-caption text-medium-emphasis">
            {{ label }}
          </div>
          <div v-if="subtitle" class="text-caption" style="opacity: 0.7">
            {{ subtitle }}
          </div>
        </div>
      </div>
      
      <div class="stat-value mt-3">
        <transition name="counter" mode="out-in">
          <div v-if="!loading" :key="value" class="d-flex align-center">
            <span class="text-h4 font-weight-bold">
              {{ format === 'percentage' ? '' : '' }}{{ animatedValue }}{{ format === 'percentage' ? '%' : '' }}
            </span>
            <v-icon 
              v-if="trend"
              :icon="trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
              :color="trend > 0 ? 'success' : 'error'"
              size="24"
              class="ml-2"
            />
          </div>
          <v-skeleton-loader
            v-else
            type="text"
            width="80"
            class="mt-2"
          />
        </transition>
      </div>
      
      <v-progress-linear
        v-if="showProgress"
        :model-value="progressValue"
        :color="color"
        height="4"
        rounded
        class="mt-3"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  subtitle: String,
  color: { 
    type: String, 
    default: 'primary' 
  },
  loading: {
    type: Boolean,
    default: false
  },
  format: { 
    type: String, 
    default: 'number' // number, percentage
  },
  trend: Number, // Pourcentage de changement
  maxValue: Number, // Pour la barre de progression
  lightBackground: {
    type: Boolean,
    default: true
  }
})

// Animation du compteur
const displayValue = ref(0)
const animatedValue = computed(() => {
  if (props.format === 'percentage') {
    return Math.round(displayValue.value)
  }
  // Formater avec des espaces pour les milliers
  return displayValue.value.toLocaleString('fr-FR')
})

// Couleurs
const cardColor = computed(() => {
  if (!props.lightBackground) return props.color
  
  // Couleurs claires pour le fond
  const lightColors = {
    'primary': 'amber-lighten-5',
    'success': 'green-lighten-5',
    'info': 'blue-lighten-5',
    'warning': 'orange-lighten-5',
    'error': 'red-lighten-5'
  }
  return lightColors[props.color] || 'grey-lighten-5'
})

const iconColor = computed(() => {
  // Couleurs sombres pour les icônes
  const darkColors = {
    'primary': 'amber-darken-2',
    'success': 'green-darken-2',
    'info': 'blue-darken-2',
    'warning': 'orange-darken-2',
    'error': 'red-darken-2'
  }
  return darkColors[props.color] || props.color
})

// Barre de progression
const showProgress = computed(() => props.maxValue && props.maxValue > 0)
const progressValue = computed(() => {
  if (!showProgress.value) return 0
  return Math.min((props.value / props.maxValue) * 100, 100)
})

// Animer le changement de valeur
watch(() => props.value, (newVal) => {
  if (newVal === null || newVal === undefined) return
  
  const startValue = displayValue.value
  const endValue = newVal
  const duration = 1000 // 1 seconde
  const steps = 30
  const increment = (endValue - startValue) / steps
  const stepDuration = duration / steps
  
  let currentStep = 0
  const timer = setInterval(() => {
    currentStep++
    if (currentStep < steps) {
      displayValue.value = startValue + (increment * currentStep)
    } else {
      displayValue.value = endValue
      clearInterval(timer)
    }
  }, stepDuration)
}, { immediate: true })
</script>

<style scoped>
.dashboard-stat-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(45deg);
  pointer-events: none;
}

.dashboard-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.stat-value {
  min-height: 48px;
  display: flex;
  align-items: center;
}

.counter-enter-active,
.counter-leave-active {
  transition: all 0.3s ease;
}

.counter-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.counter-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animation au chargement */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-stat-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 600px) {
  .dashboard-stat-card {
    min-height: 120px;
  }
  
  .text-h4 {
    font-size: 1.75rem !important;
  }
}
</style>
