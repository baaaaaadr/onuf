<template>
  <v-card class="audit-progress mb-4">
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-2">
        <span class="text-body-2 font-weight-bold">Progression</span>
        <span class="text-body-2">{{ progressPercentage }}%</span>
      </div>
      <v-progress-linear
        :model-value="progressPercentage"
        color="primary"
        height="8"
        rounded
      ></v-progress-linear>
      <div class="text-caption text-grey mt-2">
        {{ completedQuestions }} / {{ totalQuestions }} questions répondues
      </div>
    </v-card-text>
  </v-card>
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
</script>

<style scoped>
.audit-progress {
  transition: all 0.3s ease;
}
</style>
