<template>
  <div v-if="show" class="success-overlay" @click="closeDialog">
    <div class="success-dialog" @click.stop>
      <!-- Icône de succès animée -->
      <div class="success-icon-container">
        <div class="success-circle">
          <div class="success-checkmark">
            <div class="checkmark-stem"></div>
            <div class="checkmark-kick"></div>
          </div>
        </div>
      </div>
      
      <!-- Contenu principal -->
      <div class="success-content">
        <h2 class="success-title">
          <span class="title-emoji">🎉</span>
          Audit Terminé !
        </h2>
        
        <p class="success-message">
          Merci pour votre contribution à la sécurité urbaine.
          <br>
          <span class="sync-status">
            <span v-if="isOnline" class="status-online">
              <span class="status-emoji">☁️</span>
              Données synchronisées
            </span>
            <span v-else class="status-offline">
              <span class="status-emoji">💾</span>
              Sauvegardé localement
            </span>
          </span>
        </p>
        
        <!-- ID de soumission si disponible -->
        <div v-if="submissionId" class="submission-info">
          <span class="submission-label">ID d'audit :</span>
          <span class="submission-id">#{{ submissionId }}</span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="success-actions">
        <!-- Bouton principal -->
        <button 
          class="action-btn action-btn--primary"
          @click="$emit('new-audit')"
        >
          <span class="btn-emoji">➕</span>
          <span class="btn-text">Nouvel audit</span>
        </button>
        
        <!-- Boutons secondaires -->
        <div class="secondary-actions">
          <button 
            class="action-btn action-btn--secondary"
            @click="$emit('go-history')"
          >
            <span class="btn-emoji">📋</span>
            <span class="btn-text">Mes audits</span>
          </button>
          
          <button 
            class="action-btn action-btn--secondary"
            @click="$emit('go-home')"
          >
            <span class="btn-emoji">🏠</span>
            <span class="btn-text">Accueil</span>
          </button>
        </div>
      </div>
      
      <!-- Bouton de fermeture -->
      <button class="close-btn" @click="closeDialog">
        <span>✕</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: Boolean,
  isOnline: {
    type: Boolean,
    default: true
  },
  submissionId: {
    type: String,
    default: null
  }
})

// Emit
const emit = defineEmits(['update:modelValue', 'new-audit', 'go-history', 'go-home'])

// v-model pour le dialog
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Méthode pour fermer le dialog
const closeDialog = () => {
  show.value = false
}
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
  --shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-button: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-dialog: 0 12px 32px rgba(0, 0, 0, 0.15);
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* ==== Overlay ==== */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: var(--spacing-md);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ==== Dialog Container ==== */
.success-dialog {
  background: var(--background-main);
  border-radius: 20px;
  box-shadow: var(--shadow-dialog);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
}

@keyframes slideUp {
  from {
    transform: translateY(40px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* ==== Icône de Succès ==== */
.success-icon-container {
  padding: var(--spacing-xl) var(--spacing-md) var(--spacing-lg);
}

.success-circle {
  width: 80px;
  height: 80px;
  background: var(--success-green);
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounceIn 0.6s ease-out 0.2s both;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

/* ==== Checkmark Animation ==== */
.success-checkmark {
  width: 32px;
  height: 32px;
  position: relative;
}

.checkmark-stem,
.checkmark-kick {
  position: absolute;
  background: white;
  border-radius: 2px;
  animation: checkmarkDraw 0.4s ease-out 0.6s both;
}

.checkmark-stem {
  width: 3px;
  height: 14px;
  top: 12px;
  left: 14px;
  transform: rotate(45deg);
  transform-origin: bottom;
}

.checkmark-kick {
  width: 3px;
  height: 8px;
  top: 16px;
  left: 8px;
  transform: rotate(-45deg);
  transform-origin: bottom;
}

@keyframes checkmarkDraw {
  0% {
    height: 0;
  }
  100% {
    height: var(--checkmark-height);
  }
}

.checkmark-stem {
  --checkmark-height: 14px;
}

.checkmark-kick {
  --checkmark-height: 8px;
}

/* ==== Contenu ==== */
.success-content {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.title-emoji {
  font-size: 28px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.success-message {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md);
}

/* ==== Statut de synchronisation ==== */
.sync-status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  margin-top: var(--spacing-sm);
}

.status-online {
  background: rgba(76, 175, 80, 0.1);
  color: var(--success-green);
}

.status-offline {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.status-emoji {
  font-size: 12px;
}

/* ==== Info de soumission ==== */
.submission-info {
  background: var(--surface-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  margin-top: var(--spacing-sm);
  font-size: 12px;
}

.submission-label {
  color: var(--text-secondary);
  margin-right: var(--spacing-xs);
}

.submission-id {
  color: var(--text-primary);
  font-weight: 600;
  font-family: monospace;
}

/* ==== Actions ==== */
.success-actions {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ==== Boutons d'Action ==== */
.action-btn {
  border: none;
  border-radius: 9999px;
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
  font-size: 16px;
  min-height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.action-btn--primary {
  background: var(--primary-gold);
  color: var(--text-primary);
  box-shadow: var(--shadow-button);
}

.action-btn--primary:hover {
  background: var(--primary-gold-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.action-btn--primary:active {
  transform: scale(0.98) translateY(0);
}

.action-btn--secondary {
  background: var(--surface-light);
  color: var(--text-primary);
  box-shadow: var(--shadow-card);
  font-size: 14px;
  min-height: 40px;
  flex: 1;
}

.action-btn--secondary:hover {
  background: var(--border-light);
  transform: translateY(-1px);
}

.action-btn--secondary:active {
  transform: scale(0.98);
}

.btn-emoji {
  font-size: 16px;
}

.btn-text {
  font-size: inherit;
}

/* ==== Actions Secondaires ==== */
.secondary-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* ==== Bouton de Fermeture ==== */
.close-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border: none;
  background: var(--surface-light);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--border-light);
  color: var(--text-primary);
  transform: scale(1.1);
}

.close-btn:active {
  transform: scale(0.9);
}

/* ==== Responsive ==== */
@media (max-width: 375px) {
  .success-dialog {
    margin: var(--spacing-sm);
    border-radius: 16px;
  }
  
  .success-title {
    font-size: 20px;
  }
  
  .success-message {
    font-size: 14px;
  }
  
  .action-btn--primary {
    font-size: 14px;
    min-height: 44px;
  }
  
  .secondary-actions {
    flex-direction: column;
  }
  
  .action-btn--secondary {
    flex: none;
  }
}

/* ==== Accessibilité ==== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states pour l'accessibilité */
.action-btn:focus-visible,
.close-btn:focus-visible {
  outline: 2px solid var(--primary-gold-dark);
  outline-offset: 2px;
}

/* Amélioration du contraste */
@media (prefers-contrast: high) {
  .success-circle {
    background: #2E7D32;
  }
  
  .status-online {
    background: #E8F5E8;
    color: #2E7D32;
  }
  
  .status-offline {
    background: #FFF3E0;
    color: #E65100;
  }
}
</style>
