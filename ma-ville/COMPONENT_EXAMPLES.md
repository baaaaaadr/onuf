# 🧩 Exemples de Composants - Dashboard "Ma Ville"

## 📊 StatCard Adaptée

```vue
<!-- src/components/dashboard/DashboardStatCard.vue -->
<template>
  <v-card 
    class="dashboard-stat-card" 
    :class="{ 'loading': loading }"
    elevation="2"
    rounded="xl"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon 
          :icon="icon" 
          :color="color"
          size="28"
          class="mr-3"
        />
        <div class="text-caption text-medium-emphasis">
          {{ label }}
        </div>
      </div>
      
      <div class="stat-value">
        <transition name="counter" mode="out-in">
          <div v-if="!loading" :key="value" class="text-h4 font-weight-bold">
            {{ formattedValue }}
          </div>
          <v-skeleton-loader
            v-else
            type="text"
            width="80"
            class="mt-2"
          />
        </transition>
      </div>
      
      <div v-if="subtitle" class="text-caption text-medium-emphasis mt-1">
        {{ subtitle }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  icon: String,
  label: String,
  value: Number,
  subtitle: String,
  color: { type: String, default: 'primary' },
  loading: Boolean,
  format: { type: String, default: 'number' } // number, percentage
})

// Animation du compteur
const displayValue = ref(0)

const formattedValue = computed(() => {
  if (props.format === 'percentage') {
    return `${Math.round(displayValue.value)}%`
  }
  return displayValue.value.toLocaleString('fr-FR')
})

// Animer le changement de valeur
watch(() => props.value, (newVal) => {
  if (newVal === null || newVal === undefined) return
  
  const increment = newVal / 20
  const timer = setInterval(() => {
    if (displayValue.value < newVal) {
      displayValue.value = Math.min(displayValue.value + increment, newVal)
    } else {
      displayValue.value = newVal
      clearInterval(timer)
    }
  }, 50)
}, { immediate: true })
</script>

<style scoped>
.dashboard-stat-card {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
}

.dashboard-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.stat-value {
  min-height: 40px;
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
</style>
```

## 🗺️ Composant Heatmap

```vue
<!-- src/components/dashboard/CityHeatmap.vue -->
<template>
  <v-card rounded="xl" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-map-marker-radius</v-icon>
      Carte de la Sécurité Urbaine
      
      <v-spacer />
      
      <v-btn
        icon="mdi-fullscreen"
        variant="text"
        size="small"
        @click="toggleFullscreen"
      />
    </v-card-title>
    
    <v-card-subtitle>
      <v-chip-group
        v-model="selectedFilter"
        mandatory
        selected-class="primary"
      >
        <v-chip
          v-for="filter in filters"
          :key="filter.value"
          :value="filter.value"
          variant="outlined"
          size="small"
        >
          <v-icon start size="16">{{ filter.icon }}</v-icon>
          {{ filter.label }}
        </v-chip>
      </v-chip-group>
    </v-card-subtitle>
    
    <v-card-text class="pa-0">
      <div 
        ref="mapContainer" 
        class="city-heatmap"
        :class="{ 'fullscreen': isFullscreen }"
      />
      
      <!-- Légende -->
      <div class="map-legend">
        <div class="legend-title">Intensité</div>
        <div class="legend-gradient" />
        <div class="legend-labels">
          <span>Faible</span>
          <span>Élevée</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet.heat'
import { supabase } from '@/composables/useSupabase'

// Props
const props = defineProps({
  height: { type: String, default: '400px' }
})

// Refs
const mapContainer = ref(null)
const map = ref(null)
const heatmapLayer = ref(null)
const selectedFilter = ref('all')
const isFullscreen = ref(false)
const loading = ref(false)

// Filtres disponibles
const filters = [
  { value: 'all', label: 'Toutes', icon: 'mdi-map' },
  { value: 'lighting', label: 'Éclairage', icon: 'mdi-lightbulb' },
  { value: 'feeling', label: 'Sécurité', icon: 'mdi-shield' },
  { value: 'walkpath', label: 'Mobilité', icon: 'mdi-walk' },
  { value: 'cleanliness', label: 'Propreté', icon: 'mdi-broom' }
]

// Initialiser la carte
const initMap = () => {
  // Position par défaut : Agadir
  const defaultCenter = [30.4278, -9.5981]
  
  map.value = L.map(mapContainer.value).setView(defaultCenter, 13)
  
  // Tuile de base
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map.value)
  
  // Style sombre pour mieux voir la heatmap
  mapContainer.value.style.backgroundColor = '#f5f5f5'
}

// Charger les données de heatmap
const loadHeatmapData = async () => {
  loading.value = true
  
  try {
    const { data, error } = await supabase
      .rpc('get_heatmap_points', {
        filter_type: selectedFilter.value,
        days_back: 30
      })
    
    if (error) throw error
    
    // Convertir pour Leaflet.heat
    const heatData = data.map(point => [
      point.lat,
      point.lng,
      point.intensity * (point.count / 10) // Pondérer par le nombre
    ])
    
    // Supprimer l'ancien layer
    if (heatmapLayer.value) {
      map.value.removeLayer(heatmapLayer.value)
    }
    
    // Créer nouveau heatmap
    heatmapLayer.value = L.heatLayer(heatData, {
      radius: 25,
      blur: 15,
      maxZoom: 16,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
    }).addTo(map.value)
    
  } catch (error) {
    console.error('Erreur chargement heatmap:', error)
  } finally {
    loading.value = false
  }
}

// Plein écran
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  setTimeout(() => {
    map.value.invalidateSize()
  }, 300)
}

// Watchers
watch(selectedFilter, () => {
  loadHeatmapData()
})

// Lifecycle
onMounted(() => {
  initMap()
  loadHeatmapData()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.city-heatmap {
  height: v-bind(height);
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.city-heatmap.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh !important;
  z-index: 9999;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.legend-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
}

.legend-gradient {
  width: 100px;
  height: 10px;
  background: linear-gradient(to right, blue, cyan, yellow, orange, red);
  border-radius: 5px;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-top: 3px;
}
</style>
```

## 📈 Graphique Radar

```vue
<!-- src/components/dashboard/CriteriaRadar.vue -->
<template>
  <v-card rounded="xl" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-chart-radar</v-icon>
      État de nos Espaces Publics
    </v-card-title>
    
    <v-card-text>
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
              {{ score.criterion_label }}
            </div>
            <div class="trend-value">
              {{ score.avg_score }}/{{ score.max_score }}
              <v-icon 
                :icon="getTrendIcon(score.trend)"
                :color="getTrendColor(score.trend)"
                size="16"
                class="ml-1"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { supabase } from '@/composables/useSupabase'

// Refs
const chartCanvas = ref(null)
const chart = ref(null)
const scores = ref([])
const loading = ref(false)

// Charger les scores
const loadScores = async () => {
  loading.value = true
  
  try {
    const { data, error } = await supabase
      .rpc('get_average_scores', { days_back: 30 })
    
    if (error) throw error
    
    scores.value = data
    updateChart(data)
    
  } catch (error) {
    console.error('Erreur chargement scores:', error)
  } finally {
    loading.value = false
  }
}

// Mettre à jour le graphique
const updateChart = (data) => {
  const labels = data.map(d => d.criterion_label)
  const values = data.map(d => (d.avg_score / d.max_score) * 100)
  
  if (chart.value) {
    chart.value.data.labels = labels
    chart.value.data.datasets[0].data = values
    chart.value.update()
  } else {
    const ctx = chartCanvas.value.getContext('2d')
    chart.value = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score moyen',
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 25
            }
          }
        }
      }
    })
  }
}

// Helpers
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

// Lifecycle
onMounted(() => {
  loadScores()
})
</script>

<style scoped>
canvas {
  max-height: 300px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 8px;
}

.trend-label {
  font-size: 12px;
  font-weight: 500;
}

.trend-value {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
</style>
```

## 💡 Carte d'Insight

```vue
<!-- src/components/dashboard/InsightCard.vue -->
<template>
  <v-card 
    class="insight-card"
    :color="color"
    rounded="xl"
    elevation="1"
  >
    <v-card-text class="pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon 
          :icon="icon" 
          size="24"
          class="mr-2"
        />
        <div class="insight-title">{{ title }}</div>
      </div>
      
      <div class="insight-text">
        {{ text }}
      </div>
      
      <div v-if="action" class="mt-3">
        <v-btn
          :color="actionColor"
          variant="tonal"
          size="small"
          @click="$emit('action', insight)"
        >
          {{ action }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  insight: Object,
  title: String,
  icon: String,
  color: { type: String, default: 'blue-lighten-5' },
  action: String,
  actionColor: { type: String, default: 'primary' }
})

const emit = defineEmits(['action'])

const text = computed(() => {
  return props.insight?.insight_text || ''
})
</script>

<style scoped>
.insight-card {
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.insight-title {
  font-weight: 600;
  font-size: 14px;
}

.insight-text {
  font-size: 16px;
  line-height: 1.4;
}
</style>
```

## 🎯 Composable Principal

```javascript
// src/composables/useCityDashboard.js
import { ref, computed } from 'vue'
import { supabase } from './useSupabase'

// Cache simple avec TTL
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const getCached = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

const setCached = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

export const useCityDashboard = () => {
  // État
  const loading = ref(false)
  const error = ref(null)
  const stats = ref(null)
  const heatmapData = ref([])
  const scores = ref([])
  const insights = ref([])
  
  // Charger les statistiques
  const loadDashboardStats = async (forceRefresh = false) => {
    const cacheKey = 'dashboard_stats'
    
    if (!forceRefresh) {
      const cached = getCached(cacheKey)
      if (cached) {
        stats.value = cached
        return cached
      }
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: err } = await supabase
        .rpc('get_dashboard_stats')
      
      if (err) throw err
      
      stats.value = data[0] // RPC retourne un array
      setCached(cacheKey, data[0])
      
      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Erreur stats:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Charger les insights
  const loadInsights = async (days = 30) => {
    const cacheKey = `insights_${days}`
    
    const cached = getCached(cacheKey)
    if (cached) {
      insights.value = cached
      return cached
    }
    
    try {
      const { data, error: err } = await supabase
        .rpc('get_insights', { days_back: days })
      
      if (err) throw err
      
      insights.value = data
      setCached(cacheKey, data)
      
      return data
    } catch (err) {
      console.error('Erreur insights:', err)
      return []
    }
  }
  
  // Statistiques formatées
  const formattedStats = computed(() => {
    if (!stats.value) return null
    
    return {
      totalAudits: {
        value: stats.value.total_audits || 0,
        label: 'Audits Réalisés',
        icon: 'mdi-clipboard-check-multiple',
        color: 'primary'
      },
      activeUsers: {
        value: stats.value.active_users || 0,
        label: 'Observatrices Actives',
        icon: 'mdi-account-group',
        color: 'success',
        subtitle: 'Ce mois-ci'
      },
      zonesCount: {
        value: stats.value.zones_count || 0,
        label: 'Zones Couvertes',
        icon: 'mdi-map-marker-radius',
        color: 'info'
      },
      avgScore: {
        value: Math.round((stats.value.avg_score || 0) * 25),
        label: 'Score Moyen',
        icon: 'mdi-star',
        color: 'warning',
        format: 'percentage'
      }
    }
  })
  
  // Refresh toutes les données
  const refreshAll = async () => {
    await Promise.all([
      loadDashboardStats(true),
      loadInsights(30)
    ])
  }
  
  return {
    // État
    loading,
    error,
    stats,
    insights,
    
    // Computed
    formattedStats,
    
    // Actions
    loadDashboardStats,
    loadInsights,
    refreshAll
  }
}
```

## 🎨 Vue Principale Complète

```vue
<!-- src/views/MaVilleView.vue -->
<template>
  <PageTransition>
    <div class="ma-ville-view">
      <v-container class="py-4">
        <!-- Header -->
        <div class="view-header mb-6">
          <h1 class="text-h4 font-weight-bold mb-2">Ma Ville</h1>
          <p class="text-body-1 text-medium-emphasis">
            Tableau de bord collectif de la sécurité urbaine à Agadir
          </p>
        </div>
        
        <!-- Section 1: Impact Collectif -->
        <section class="mb-8">
          <h2 class="text-h6 mb-4">Notre Impact sur Agadir</h2>
          
          <v-row>
            <v-col 
              v-for="(stat, key) in formattedStats" 
              :key="key"
              cols="6"
              md="3"
            >
              <DashboardStatCard
                :icon="stat.icon"
                :label="stat.label"
                :value="stat.value"
                :subtitle="stat.subtitle"
                :color="stat.color"
                :format="stat.format"
                :loading="loading"
              />
            </v-col>
          </v-row>
        </section>
        
        <!-- Section 2: Carte Interactive -->
        <section class="mb-8">
          <CityHeatmap height="500px" />
        </section>
        
        <!-- Section 3: Baromètre -->
        <section class="mb-8">
          <v-row>
            <v-col cols="12" md="8">
              <CriteriaRadar />
            </v-col>
            
            <!-- Section 4: Insights -->
            <v-col cols="12" md="4">
              <h2 class="text-h6 mb-4">Insights</h2>
              
              <div class="insights-list">
                <InsightCard
                  v-for="(insight, index) in insights"
                  :key="index"
                  :insight="insight"
                  :title="getInsightTitle(insight.insight_type)"
                  :icon="getInsightIcon(insight.insight_type)"
                  :color="getInsightColor(insight.insight_type)"
                  class="mb-3"
                />
              </div>
            </v-col>
          </v-row>
        </section>
        
        <!-- FAB Refresh -->
        <FloatingActionButton
          icon="mdi-refresh"
          color="primary"
          :loading="loading"
          @click="refreshAll"
          tooltip="Actualiser les données"
        />
      </v-container>
    </div>
  </PageTransition>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCityDashboard } from '@/composables/useCityDashboard'
import PageTransition from '@/components/transitions/PageTransition.vue'
import FloatingActionButton from '@/components/common/FloatingActionButton.vue'
import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue'
import CityHeatmap from '@/components/dashboard/CityHeatmap.vue'
import CriteriaRadar from '@/components/dashboard/CriteriaRadar.vue'
import InsightCard from '@/components/dashboard/InsightCard.vue'

// Composable
const {
  loading,
  formattedStats,
  insights,
  loadDashboardStats,
  loadInsights,
  refreshAll
} = useCityDashboard()

// Helpers pour les insights
const getInsightTitle = (type) => {
  const titles = {
    'most_audited_zone': '📍 Zone Focus',
    'main_issue': '⚠️ Problème Principal',
    'critical_hour': '🕐 Heure Critique',
    'improvement': '📈 Amélioration'
  }
  return titles[type] || 'Insight'
}

const getInsightIcon = (type) => {
  const icons = {
    'most_audited_zone': 'mdi-map-marker-multiple',
    'main_issue': 'mdi-alert-circle',
    'critical_hour': 'mdi-clock-alert',
    'improvement': 'mdi-trending-up'
  }
  return icons[type] || 'mdi-information'
}

const getInsightColor = (type) => {
  const colors = {
    'most_audited_zone': 'blue-lighten-5',
    'main_issue': 'orange-lighten-5',
    'critical_hour': 'purple-lighten-5',
    'improvement': 'green-lighten-5'
  }
  return colors[type] || 'grey-lighten-5'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadDashboardStats(),
    loadInsights(30)
  ])
})
</script>

<style scoped>
.ma-ville-view {
  min-height: 100vh;
  background: var(--onuf-background);
}

.view-header {
  text-align: center;
}

.insights-list {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Responsive */
@media (max-width: 960px) {
  .view-header {
    text-align: left;
  }
  
  section {
    margin-bottom: 24px !important;
  }
}
</style>
```

---

Ces exemples fournissent une base solide pour implémenter le dashboard "Ma Ville". Ils suivent les patterns de l'application existante tout en ajoutant les nouvelles fonctionnalités.
