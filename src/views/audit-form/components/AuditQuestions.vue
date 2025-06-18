<template>
  <div class="audit-questions">
    <!-- Afficher toutes les questions -->
    <AuditSectionModern
      v-for="question in questions"
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
import AuditSectionModern from '@/components/AuditSectionModern.vue'
import { questions } from '../config/questions'

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['update:formData'])

// Mettre à jour une question spécifique
const updateQuestion = (questionId, value) => {
  emit('update:formData', questionId, value)
  
  // Logger l'action si la fonction globale existe
  if (window.addUserAction) {
    const question = questions.find(q => q.id === questionId)
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
