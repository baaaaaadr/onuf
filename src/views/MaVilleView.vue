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
                  :value="stat.format === 'percentage' ? stat.value + '%' : stat.value"
                  :subtitle="stat.subtitle"
                  :color="stat.color"
                  :loading="false"
                  class="stat-card-fixed-height"
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
            <div class="map-section">
              <CityHeatmap
                :heatmap-data="heatmapData"
                :loading="loadingMap"
                :height="mapHeight"
                @filter-change="handleFilterChange"
                @load-data="loadHeatmapData"
              />
            </div>
          </section>
  
          <!-- Section 3: Baromètre et Insights -->
          <section class="mb-8">
            <v-row class="d-flex align-stretch">
              <!-- Colonne du graphique radar -->
              <v-col cols="12" md="8" class="d-flex">
                <CriteriaRadar
                  :scores="scores"
                  :loading="loading"
                  class="flex-fill"
                />
              </v-col>
              
              <!-- Colonne des Insights -->
              <v-col cols="12" md="4" class="d-flex flex-column">
                <v-card rounded="xl" elevation="2" class="flex-fill insights-card">
                  <v-card-title>
                    <v-icon class="mr-2">mdi-lightbulb</v-icon>
                    Insights
                  </v-card-title>
                  
                  <v-card-text class="pa-0 flex-fill">
                    <div v-if="loading && formattedInsights.length === 0" class="pa-4">
                      <v-skeleton-loader 
                        v-for="i in 3" 
                        :key="i"
                        type="card"
                        class="mb-3"
                      />
                    </div>
                    
                    <div v-else class="insights-list pa-3">
                      <InsightCard
                        v-for="(insight, index) in formattedInsights"
                        :key="index"
                        :insight="insight"
                        :title="insight.title"
                        :icon="insight.icon"
                        :color="insight.color"
                        :action="insight.action"
                        :action-icon="insight.actionIcon"
                        class="mb-3"
                        @action="handleInsightAction"
                      />
                      
                      <div v-if="formattedInsights.length === 0" class="text-center py-8">
                        <v-icon size="48" color="grey-lighten-1" class="mb-3">
                          mdi-lightbulb-outline
                        </v-icon>
                        <p class="text-body-2 text-grey">
                          Aucun insight disponible
                        </p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </section>
  
          <!-- FAB Refresh - Repositionné pour éviter la bottom nav -->
          <v-btn
            v-if="!loading"
            icon="mdi-refresh"
            color="primary"
            position="fixed"
            location="bottom end"
            size="large"
            class="refresh-fab"
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

import { ref, onMounted, computed } from 'vue'
import { useCityDashboard } from '@/composables/useCityDashboard'
import PageTransition from '@/components/transitions/PageTransition.vue'
import DashboardStatCard from '@/components/common/StatCard.vue'
import CityHeatmap from '@/components/dashboard/CityHeatmap.vue'
import CriteriaRadar from '@/components/dashboard/CriteriaRadar.vue'
import InsightCard from '@/components/dashboard/InsightCard.vue'

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

// Refs
const loadingMap = ref(false)

// Computed pour la hauteur de la carte
const mapHeight = computed(() => {
  // Adapter la hauteur en fonction de la taille de l'écran
  if (window.innerWidth < 600) return '350px'
  if (window.innerWidth < 960) return '400px'
  return '450px'
})

// Handler pour le changement de filtre
const handleFilterChange = async (filterData) => {
  loadingMap.value = true
  try {
    // filterData peut être un string (ancien format) ou un objet (nouveau format)
    const filter = typeof filterData === 'string' ? filterData : filterData.filter
    const period = typeof filterData === 'object' ? filterData.period : 30
    
    await loadHeatmapData(filter, period)
  } finally {
    loadingMap.value = false
  }
}

// Handler pour les actions des insights
const handleInsightAction = (actionData) => {
  console.log('📍 Action insight:', actionData)
  // Ici on pourrait ajouter des actions comme:
  // - Centrer la carte sur une zone
  // - Filtrer les données
  // - Naviguer vers un audit spécifique
  if (actionData.type === 'show-on-map') {
    // TODO: Centrer la carte sur les coordonnées
    console.log('Centrer carte sur:', actionData.lat, actionData.lng)
  }
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
  
  /* Card des insights */
  .insights-card {
    display: flex;
    flex-direction: column;
  }
  
  .insights-card .v-card-text {
    display: flex;
    flex-direction: column;
  }
  
  .insights-list {
    padding-bottom: 16px;
  }
  
  .insight-title {
    line-height: 1.2;
  }
  
  .insight-text {
    line-height: 1.4;
  }
  

  
  /* Section de la carte */
  .map-section {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  /* Cartes de stats avec hauteur flexible */
  :deep(.stat-card-fixed-height) {
    min-height: 120px;
    height: auto;
    display: flex;
    flex-direction: column;
  }
  
  :deep(.stat-card-fixed-height .v-card) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  :deep(.stat-card-fixed-height .v-card-text) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 16px !important;
  }
  
  /* Bouton refresh repositionné */
  .refresh-fab {
    bottom: 84px !important; /* Au-dessus de la bottom nav (64px) + marge */
    right: 16px !important;
  }
  
  /* Responsive */
  @media (max-width: 960px) {
    .view-header {
      text-align: left;
    }
    
    section {
      margin-bottom: 24px !important;
    }
    
    /* Ajuster la position du refresh sur mobile */
    .refresh-fab {
      bottom: 88px !important;
      right: 12px !important;
    }
    
    /* Cartes de stats plus petites sur mobile */
    :deep(.stat-card-fixed-height) {
      min-height: 100px;
    }
    
    /* Ajustements pour les insights sur mobile */
  }
  </style>