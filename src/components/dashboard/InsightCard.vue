<!-- src/components/dashboard/InsightCard.vue -->
<template>
  <v-card 
    class="insight-card"
    :color="color"
    rounded="xl"
    elevation="1"
    hover
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon 
          :icon="icon" 
          size="24"
          class="mr-2"
        />
        <div class="insight-title text-subtitle-2 font-weight-medium">
          {{ title }}
        </div>
      </div>
      
      <div class="insight-text text-body-2 mb-3">
        {{ text }}
      </div>
      
      <!-- Valeur formatée selon le type d'insight -->
      <div v-if="formattedValue" class="insight-value">
        <!-- Zone la plus auditée -->
        <div v-if="type === 'most_audited_zone'" class="d-flex align-center">
          <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
          <span class="text-caption">
            {{ formattedValue.count }} audits dans cette zone
          </span>
        </div>
        
        <!-- Problème principal -->
        <div v-else-if="type === 'main_issue'" class="d-flex align-center">
          <v-progress-linear
            :model-value="formattedValue.percentage"
            color="warning"
            height="6"
            rounded
            class="mr-2"
            style="max-width: 100px"
          />
          <span class="text-caption font-weight-medium">
            {{ formattedValue.percentage }}%
          </span>
        </div>
        
        <!-- Heure critique -->
        <div v-else-if="type === 'critical_hour'" class="d-flex align-center">
          <v-chip
            size="small"
            variant="tonal"
            color="error"
          >
            <v-icon start size="16">mdi-clock</v-icon>
            {{ formattedValue.hour }}h00
          </v-chip>
          <span class="text-caption ml-2">
            Score: {{ formattedValue.avg_feeling }}/4
          </span>
        </div>
        
        <!-- Amélioration -->
        <div v-else-if="type === 'improvement'" class="d-flex align-center">
          <v-icon 
            icon="mdi-arrow-up"
            color="success"
            size="20"
            class="mr-1"
          />
          <span class="text-caption font-weight-medium text-success">
            +{{ formattedValue.improvement_percent }}%
          </span>
        </div>
      </div>
      
      <!-- Action optionnelle -->
      <div v-if="action" class="mt-3">
        <v-btn
          :color="actionColor"
          variant="tonal"
          size="small"
          block
          @click="$emit('action', insight)"
        >
          <v-icon start size="16">{{ actionIcon }}</v-icon>
          {{ action }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  insight: {
    type: Object,
    required: true
  },
  title: String,
  icon: String,
  color: { 
    type: String, 
    default: 'blue-lighten-5' 
  },
  action: String,
  actionIcon: {
    type: String,
    default: 'mdi-arrow-right'
  },
  actionColor: { 
    type: String, 
    default: 'primary' 
  }
})

const emit = defineEmits(['action'])

// Computed
const type = computed(() => props.insight?.insight_type)
const text = computed(() => props.insight?.insight_text || '')
const formattedValue = computed(() => {
  const value = props.insight?.insight_value
  if (!value) return null
  
  try {
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch (e) {
    return value
  }
})

// Actions selon le type
const showOnMap = () => {
  if (type.value === 'most_audited_zone' && formattedValue.value) {
    emit('action', {
      type: 'show-on-map',
      lat: formattedValue.value.lat,
      lng: formattedValue.value.lng
    })
  }
}
</script>

<style scoped>
.insight-card {
  transition: all 0.3s ease;
  cursor: default;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.insight-title {
  line-height: 1.2;
}

.insight-text {
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
}

.insight-value {
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

/* Animation d'apparition */
.insight-card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
