<template>
  <div class="audit-progress">
    <div class="progress-card">
      <div class="progress-header">
        <div class="progress-info">
          <span class="progress-emoji">📊</span>
          <div class="progress-text">
            <h3 class="progress-title">Progression</h3>
            <p class="progress-subtitle">{{ completedQuestions }} / {{ totalQuestions }} questions</p>
          </div>
        </div>
        <div class="progress-percentage">
          <span class="percentage-value">{{ progressPercentage }}%</span>
        </div>
      </div>
      
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
            :class="{
              'progress-fill--low': progressPercentage < 30,
              'progress-fill--medium': progressPercentage >= 30 && progressPercentage < 70,
              'progress-fill--high': progressPercentage >= 70
            }"
          ></div>
        </div>
      </div>
      
      <!-- Points de progression visuels -->
      <div class="progress-indicators">
        <div 
          v-for="i in totalQuestions" 
          :key="i"
          class="progress-dot"
          :class="{ 'progress-dot--completed': i <= completedQuestions }"
        >
          <span v-if="i <= completedQuestions">✓</span>
          <span v-else>{{ i }}</span>
        </div>
      </div>
      
      <!-- Message d'encouragement -->
      <div class="progress-message" v-if="progressMessage">
        <span class="message-emoji">{{ progressMessage.emoji }}</span>
        <span class="message-text">{{ progressMessage.text }}</span>
      </div>
      
      <!-- Rappel des règles de soumission -->
      <div class="requirements-reminder">
        <div class="requirement-item">
          <span class="requirement-emoji">📍</span>
          <span class="requirement-text">GPS ou quartier requis</span>
        </div>
        <div class="requirement-item">
          <span class="requirement-emoji">❓</span>
          <span class="requirement-text">Au moins 1 question</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true,
    default: () => ({})
  },
  totalQuestions: {
    type: Number,
    default: 10
  }
})

// Questions fields
const questionFields = [
  'lighting', 'walkpath', 'openness', 'feeling', 
  'peoplePresence', 'cleanliness', 'naturalSurveillance',
  'spaceDiversity', 'transportAccess', 'formalSecurity'
]

// Calculate completed questions
const completedQuestions = computed(() => {
  if (!props.formData) return 0
  
  return questionFields.filter(field => {
    const value = props.formData[field]
    return value !== null && value !== undefined && value !== ''
  }).length
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  return Math.round((completedQuestions.value / props.totalQuestions) * 100)
})

// Message d'encouragement basé sur le progrès
const progressMessage = computed(() => {
  const percentage = progressPercentage.value
  
  if (percentage === 0) {
    return { emoji: '🚀', text: 'Commencez par répondre à au moins une question!' }
  } else if (percentage < 30) {
    return { emoji: '💪', text: 'Bon début, continuez!' }
  } else if (percentage < 70) {
    return { emoji: '🔥', text: 'Excellent progrès!' }
  } else if (percentage < 100) {
    return { emoji: '⭐', text: 'Presque toutes les questions!' }
  } else {
    return { emoji: '🎉', text: 'Toutes les questions répondues!' }
  }
})
</script>

<style scoped>
/* ==== Variables de la Charte Graphique ==== */
:root {
  --primary-gold: #F3C348;
  --primary-gold-light: #F9D876;
  --primary-gold-dark: #E5A716;
  --background-main: #FFFFFF;
  --surface-light: #F5F3F0;
  --text-primary: #181611;
  --text-secondary: #837B67;
  --text-disabled: #C4BFB3;
  --border-light: #E6E3DB;
  --success-green: #4CAF50;
  --warning-orange: #FF9800;
  --info-blue: #2196F3;
  --shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* ==== Container Principal ==== */
.audit-progress {
  max-width: 428px;
  margin: 0 auto var(--spacing-lg);
  padding: 0 var(--spacing-md);
}

/* ==== Progress Card ==== */
.progress-card {
  background: var(--background-main);
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

/* ==== Header ==== */
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.progress-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.progress-emoji {
  font-size: 24px;
}

.progress-text {
  flex: 1;
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.progress-subtitle {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--text-secondary);
  margin: 0;
}

.progress-percentage {
  text-align: right;
}

.percentage-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: var(--primary-gold-dark);
}

/* ==== Progress Bar ==== */
.progress-bar-container {
  margin-bottom: var(--spacing-md);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--surface-light);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill--low {
  background: linear-gradient(90deg, var(--warning-orange) 0%, #FFB74D 100%);
}

.progress-fill--medium {
  background: linear-gradient(90deg, var(--primary-gold) 0%, var(--primary-gold-light) 100%);
}

.progress-fill--high {
  background: linear-gradient(90deg, var(--success-green) 0%, #66BB6A 100%);
}

/* Animation de progression */
.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: progress-shimmer 2s infinite;
}

@keyframes progress-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

/* ==== Progress Indicators ==== */
.progress-indicators {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.progress-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-light);
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.progress-dot--completed {
  background: var(--primary-gold);
  border-color: var(--primary-gold-dark);
  color: var(--text-primary);
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(243, 195, 72, 0.3);
}

/* ==== Progress Message ==== */
.progress-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  background: var(--surface-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 9999px;
  animation: pulse-message 2s infinite;
}

.message-emoji {
  font-size: 16px;
}

.message-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

@keyframes pulse-message {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* ==== GPS Reminder ==== */
.requirements-reminder {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.requirement-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  background: rgba(33, 150, 243, 0.1);
  color: var(--info-blue);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 8px;
}

.requirement-emoji {
  font-size: 12px;
}

.requirement-text {
  font-size: 10px;
  font-weight: 500;
}

/* ==== Responsive ==== */
@media (max-width: 375px) {
  .progress-indicators {
    gap: 2px;
  }
  
  .progress-dot {
    width: 24px;
    height: 24px;
    font-size: 9px;
  }
  
  .percentage-value {
    font-size: 20px;
  }
  
  .progress-title {
    font-size: 14px;
  }
  
  .requirements-reminder {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .requirement-text {
    font-size: 9px;
  }
}

/* Adaptation pour écrans très petits */
@media (max-width: 320px) {
  .progress-indicators {
    justify-content: center;
  }
  
  .progress-dot {
    width: 20px;
    height: 20px;
    font-size: 8px;
  }
}

/* ==== Animations d'entrée ==== */
.progress-card {
  animation: slideInDown 0.5s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==== États spéciaux ==== */
.progress-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ==== Accessibilité ==== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Amélioration du contraste pour l'accessibilité */
@media (prefers-contrast: high) {
  .progress-fill--low {
    background: #E65100;
  }
  
  .progress-fill--medium {
    background: var(--primary-gold-dark);
  }
  
  .progress-fill--high {
    background: #2E7D32;
  }
}
</style>
