<template>
  <div class="audit-questions">
    <!-- Afficher toutes les questions traduites -->
    <AuditSectionModern
      v-for="question in translatedQuestions"
      :key="question.id"
      :title="question.title"
      :description="question.description"
      :model-value="formData[question.id]"
      :options="question.options"
      @update:model-value="updateQuestion(question.id, $event)"
      class="mb-4"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n' // ✅ NOUVEAU: Import i18n
import AuditSectionModern from '@/components/AuditSectionModern.vue'
import { questionsConfig, createTranslatedQuestions } from '../config/questions'

// ✅ NOUVEAU: Utiliser i18n
const { t } = useI18n()

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['update:formData'])

// ✅ NOUVEAU: Créer les questions traduites
const translatedQuestions = computed(() => {
  return createTranslatedQuestions(t)
})

// Mettre à jour une question spécifique
const updateQuestion = (questionId, value) => {
  emit('update:formData', questionId, value)
  
  // Logger l'action si la fonction globale existe
  if (window.addUserAction) {
    const question = translatedQuestions.value.find(q => q.id === questionId)
    const option = question?.options.find(o => o.value === value)
    window.addUserAction(`✅ ${question?.title}: ${option?.text}`)
  }
  
  // Sauvegarder le progrès si la fonction existe
  if (window.saveProgress) {
    window.saveProgress()
  }
}
</script>

<style scoped>
.audit-questions {
  display: flex;
  flex-direction: column;
}
</style>
