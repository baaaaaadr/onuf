<!-- Version alternative de CriteriaRadar.vue avec CDN -->
<!-- À utiliser si l'import local de Chart.js continue de poser problème -->

<template>
  <v-card rounded="xl" elevation="2" class="criteria-radar-card">
    <v-card-title class="d-flex align-center flex-wrap">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-chart-radar</v-icon>
        <span class="text-h6 text-sm-h5">État de nos Espaces Publics</span>
      </div>
      
      <v-spacer />
      
      <v-chip
        size="small"
        variant="tonal"
        v-if="totalAudits > 0"
      >
        {{ totalAudits }} audits
      </v-chip>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" />
      </div>
      
      <div v-else-if="scores.length > 0" class="radar-content">
        <!-- Graphique radar avec hauteur flexible -->
        <div class="radar-wrapper pa-4">
          <canvas ref="chartCanvas" />
        </div>
        
        <!-- Indicateurs de tendance dans un conteneur scrollable si nécessaire -->
        <div class="scores-container">
          <v-row class="ma-0" dense>
            <v-col 
              v-for="score in scores" 
              :key="score.criterion"
              cols="12"
              sm="6"
              md="4"
              class="pa-2"
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

// Charger Chart.js depuis CDN
const loadChartJS = async () => {
  if (window.Chart) {
    console.log('📈 Chart.js déjà chargé')
    return
  }
  
  console.log('📈 Chargement de Chart.js depuis CDN...')
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.js'
    script.onload = () => {
      console.log('✅ Chart.js chargé avec succès')
      resolve()
    }
    script.onerror = () => {
      console.error('❌ Erreur chargement Chart.js')
      reject(new Error('Impossible de charger Chart.js'))
    }
    document.head.appendChild(script)
  })
}

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
    'cleanliness': 'mdi-broom',
    'natural_surveillance': 'mdi-eye-outline',
    'space_diversity': 'mdi-account-multiple',
    'transport_access': 'mdi-bus',
    'formal_security': 'mdi-shield-account'
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
const updateChart = async () => {
  if (!chartCanvas.value || !props.scores.length) {
    console.warn('📈 Canvas ou scores non disponibles')
    return
  }
  
  // S'assurer que Chart.js est chargé
  if (!window.Chart) {
    try {
      await loadChartJS()
    } catch (error) {
      console.error('❌ Impossible de charger Chart.js:', error)
      return
    }
  }
  
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
    chart.value = new window.Chart(ctx, {
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
  // Attendre que le DOM soit prêt
  nextTick(() => {
    setTimeout(() => {
      updateChart()
    }, 100)
  })
})
</script>

<style scoped>
/* Styles identiques à la version originale */
.criteria-radar-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.radar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.radar-wrapper {
  position: relative;
  flex: 0 0 auto;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  max-height: 100% !important;
  max-width: 100% !important;
}

.scores-container {
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 16px 8px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: white;
  border-radius: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
  min-height: 56px;
}

.trend-item:hover {
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.trend-label {
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 12px;
}

.trend-value {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.trend-percent {
  font-size: 11px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 600px) {
  .radar-wrapper {
    height: 280px;
  }
  
  .trend-item {
    padding: 8px 12px;
    min-height: 50px;
  }
  
  .trend-label {
    font-size: 12px;
  }
  
  .trend-value {
    font-size: 13px;
  }
}

@media (max-width: 960px) {
  .radar-wrapper {
    height: 320px;
  }
}
</style>
