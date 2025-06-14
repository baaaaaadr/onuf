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
            
            <v-row v-if="loading && !formattedStats">
              <v-col v-for="i in 4" :key="i" cols="6" md="3">
                <v-skeleton-loader 
                  type="card"
                  height="120"
                />
              </v-col>
            </v-row>
            
            <v-row v-else-if="formattedStats">
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
                  :loading="false"
                />
              </v-col>
            </v-row>
  
            <v-alert
              v-else-if="error"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ error }}
            </v-alert>
          </section>
  
          <!-- Section 2: Carte Interactive -->
            <section class="mb-8">
            <CityHeatmap
                :heatmap-data="heatmapData"
                :loading="loadingMap"
                height="500px"
                @filter-change="handleFilterChange"
                @load-data="loadHeatmapData"
            />
            </section>
  
          <!-- Section 3: Baromètre -->
          <section class="mb-8">
            <v-row>
              <v-col cols="12" md="8">
                <v-card rounded="xl" elevation="2">
                  <v-card-title>
                    <v-icon class="mr-2">mdi-chart-bar</v-icon>
                    État de nos Espaces Publics
                  </v-card-title>
                  <v-card-text>
                    <div v-if="loading && scores.length === 0" class="text-center py-8">
                      <v-progress-circular indeterminate color="primary" />
                    </div>
                    
                    <div v-else-if="scores.length > 0">
                      <div 
                        v-for="score in scores" 
                        :key="score.criterion"
                        class="score-item mb-4"
                      >
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span class="text-body-2 font-weight-medium">
                            {{ score.criterion_label }}
                          </span>
                          <span class="text-caption">
                            {{ score.avg_score }}/{{ score.max_score }}
                            <v-icon 
                              v-if="score.trend !== 0"
                              :icon="score.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                              :color="score.trend > 0 ? 'success' : 'error'"
                              size="small"
                              class="ml-1"
                            />
                          </span>
                        </div>
                        <v-progress-linear
                          :model-value="(score.avg_score / score.max_score) * 100"
                          :color="getScoreColor(score.avg_score, score.max_score)"
                          height="8"
                          rounded
                        />
                      </div>
                    </div>
                    
                    <p v-else class="text-center text-grey py-8">
                      Aucune donnée disponible
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <!-- Section 4: Insights -->
              <v-col cols="12" md="4">
                <h2 class="text-h6 mb-4">Insights</h2>
                
                <div v-if="loading && formattedInsights.length === 0">
                  <v-skeleton-loader 
                    v-for="i in 3" 
                    :key="i"
                    type="card"
                    class="mb-3"
                  />
                </div>
                
                <div v-else class="insights-list">
                  <v-card
                    v-for="(insight, index) in formattedInsights"
                    :key="index"
                    :color="insight.color"
                    rounded="xl"
                    elevation="1"
                    class="mb-3"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center mb-2">
                        <v-icon 
                          :icon="insight.icon" 
                          size="24"
                          class="mr-2"
                        />
                        <div class="insight-title text-subtitle-2 font-weight-medium">
                          {{ insight.title }}
                        </div>
                      </div>
                      
                      <div class="insight-text text-body-2">
                        {{ insight.insight_text }}
                      </div>
                    </v-card-text>
                  </v-card>
                  
                  <p v-if="formattedInsights.length === 0" class="text-center text-grey">
                    Aucun insight disponible
                  </p>
                </div>
              </v-col>
            </v-row>
          </section>
  
          <!-- FAB Refresh -->
          <v-btn
            v-if="!loading"
            icon="mdi-refresh"
            color="primary"
            position="fixed"
            location="bottom end"
            size="large"
            class="ma-4"
            elevation="8"
            @click="refreshAll"
          >
            <v-icon>mdi-refresh</v-icon>
            <v-tooltip
              activator="parent"
              location="start"
            >
              Actualiser les données
            </v-tooltip>
          </v-btn>
        </v-container>
      </div>
    </PageTransition>
  </template>
  
  <script setup>
  // src/views/MaVilleView.vue -> <script setup>

import { ref, onMounted } from 'vue' // Assurez-vous d'importer ref
import { useCityDashboard } from '@/composables/useCityDashboard'
import PageTransition from '@/components/transitions/PageTransition.vue'
import DashboardStatCard from '@/components/common/StatCard.vue'
import CityHeatmap from '@/components/dashboard/CityHeatmap.vue'

// Composable (UN SEUL APPEL)
const {
  loading,
  error,
  scores,
  formattedStats,
  formattedInsights,
  heatmapData,          // Ajouté ici
  loadDashboardStats,
  loadAverageScores,
  loadInsights,
  loadHeatmapData,      // Ajouté ici
  refreshAll
} = useCityDashboard()

// Ref pour le loading spécifique à la carte (c'est une bonne pratique)
const loadingMap = ref(false)

// Handler pour le changement de filtre
const handleFilterChange = async (filter) => {
  loadingMap.value = true
  try {
    await loadHeatmapData(filter, 30)
  } finally {
    loadingMap.value = false
  }
}

// ... le reste de votre script ...
  
  // Helpers
  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 75) return 'success'
    if (percentage >= 50) return 'info'
    if (percentage >= 25) return 'warning'
    return 'error'
  }
  
  // Lifecycle
  onMounted(async () => {
    console.log('🏙️ Ma Ville view montée')
    
    // Charger les données en parallèle
    await Promise.all([
      loadDashboardStats(),
      loadAverageScores(30),
      loadInsights(30),
      loadHeatmapData('all', 30)    
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
  
  .score-item:last-child {
    margin-bottom: 0 !important;
  }
  
  .insights-list {
    max-height: 600px;
    overflow-y: auto;
    padding-right: 8px;
  }
  
  .insight-title {
    line-height: 1.2;
  }
  
  .insight-text {
    line-height: 1.4;
  }
  
  /* Scrollbar personnalisée */
  .insights-list::-webkit-scrollbar {
    width: 4px;
  }
  
  .insights-list::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .insights-list::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
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