<!-- src/components/dashboard/CriteriaRadar.vue -->
<template>
  <v-card rounded="xl" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-radar</v-icon>
      État de nos Espaces Publics
      
      <v-spacer />
      
      <v-chip
        size="small"
        variant="tonal"
        v-if="totalAudits > 0"
      >
        {{ totalAudits }} audits
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
      
      <div v-else-if="scores.length > 0" class="radar-container">
        <canvas ref="chartCanvas" />
        
        <!-- Indicateurs de tendance -->
        <v-row class="mt-4" dense>
          <v-col 
            v-for="score in scores" 
            :key="score.criterion"
            cols="6"
            md="4"
          >
            <div class="trend-item">
              <div class="trend-label">
                <v-icon 
                  :icon="getCriterionIcon(score.criterion)"
                  size="16"
                  class="mr-1"
                />
                {{ score.criterion_label }}
              </div>
              <div class="trend-value">
                <span class="font-weight-medium">
                  {{ score.avg_score }}/{{ score.max_score }}
                </span>
                <v-icon 
                  v-if="score.trend && score.trend !== 0"
                  :icon="getTrendIcon(score.trend)"
                  :color="getTrendColor(score.trend)"
                  size="16"
                  class="ml-1"
                />
                <span 
                  v-if="score.trend && score.trend !== 0"
                  :class="['trend-percent', score.trend > 0 ? 'text-success' : 'text-error']"
                >
                  {{ score.trend > 0 ? '+' : '' }}{{ score.trend }}%
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
      
      <div v-else class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-chart-box-outline
        </v-icon>
        <p class="text-body-2 text-grey">
          Aucune donnée disponible
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// Props
const props = defineProps({
  scores: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Refs
const chartCanvas = ref(null)
const chart = ref(null)

// Computed
const totalAudits = computed(() => {
  if (props.scores.length > 0 && props.scores[0].count) {
    return parseInt(props.scores[0].count)
  }
  return 0
})

// Icônes pour chaque critère
const getCriterionIcon = (criterion) => {
  const icons = {
    'lighting': 'mdi-lightbulb',
    'walkpath': 'mdi-walk',
    'openness': 'mdi-eye',
    'feeling': 'mdi-shield-check',
    'people_presence': 'mdi-account-group',
    'cleanliness': 'mdi-broom'
  }
  return icons[criterion] || 'mdi-help-circle'
}

// Couleur en fonction du score
const getScoreColor = (score, maxScore) => {
  const percentage = (score / maxScore) * 100
  if (percentage >= 75) return 'rgba(76, 175, 80, 0.2)' // Vert
  if (percentage >= 50) return 'rgba(33, 150, 243, 0.2)' // Bleu
  if (percentage >= 25) return 'rgba(255, 152, 0, 0.2)' // Orange
  return 'rgba(244, 67, 54, 0.2)' // Rouge
}

const getBorderColor = (score, maxScore) => {
  const percentage = (score / maxScore) * 100
  if (percentage >= 75) return 'rgb(76, 175, 80)' // Vert
  if (percentage >= 50) return 'rgb(33, 150, 243)' // Bleu
  if (percentage >= 25) return 'rgb(255, 152, 0)' // Orange
  return 'rgb(244, 67, 54)' // Rouge
}

// Créer ou mettre à jour le graphique
const updateChart = () => {
  if (!chartCanvas.value || !props.scores.length) return
  
  const labels = props.scores.map(s => s.criterion_label)
  const data = props.scores.map(s => (s.avg_score / s.max_score) * 100)
  
  // Déterminer les couleurs en fonction des scores
  const avgScore = data.reduce((sum, val) => sum + val, 0) / data.length
  const backgroundColor = getScoreColor(avgScore, 100)
  const borderColor = getBorderColor(avgScore, 100)
  
  if (chart.value) {
    // Mettre à jour le graphique existant
    chart.value.data.labels = labels
    chart.value.data.datasets[0].data = data
    chart.value.data.datasets[0].backgroundColor = backgroundColor
    chart.value.data.datasets[0].borderColor = borderColor
    chart.value.update('active')
  } else {
    // Créer un nouveau graphique
    const ctx = chartCanvas.value.getContext('2d')
    chart.value = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score moyen (%)',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: borderColor,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const score = props.scores[context.dataIndex]
                return [
                  `${score.criterion_label}: ${context.parsed.r.toFixed(1)}%`,
                  `(${score.avg_score}/${score.max_score})`
                ]
              }
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 25,
              callback: (value) => value + '%'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    })
  }
}

// Helpers pour les tendances
const getTrendIcon = (trend) => {
  if (trend > 5) return 'mdi-trending-up'
  if (trend < -5) return 'mdi-trending-down'
  return 'mdi-minus'
}

const getTrendColor = (trend) => {
  if (trend > 5) return 'success'
  if (trend < -5) return 'error'
  return 'grey'
}

// Watchers
watch(() => props.scores, async () => {
  await nextTick()
  updateChart()
}, { deep: true })

// Lifecycle
onMounted(() => {
  updateChart()
})
</script>

<style scoped>
.radar-container {
  position: relative;
  height: 300px;
  margin-bottom: 16px;
}

canvas {
  max-height: 300px !important;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.trend-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.trend-label {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.trend-value {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-percent {
  font-size: 11px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 600px) {
  .radar-container {
    height: 250px;
  }
  
  .trend-item {
    padding: 6px 8px;
  }
  
  .trend-label {
    font-size: 11px;
  }
  
  .trend-value {
    font-size: 12px;
  }
}
</style>
