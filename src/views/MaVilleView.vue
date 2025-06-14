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
                <CriteriaRadar
                  :scores="scores"
                  :loading="loading"
                />
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
                  
                  <p v-if="formattedInsights.length === 0" class="text-center text-grey">
                    Aucun insight disponible
                  </p>
                </div>
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

import { ref, onMounted } from 'vue' // Assurez-vous d'importer ref
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

// Ref pour le loading spécifique à la carte (c'est une bonne pratique)
const loadingMap = ref(false)

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
  
  /* Cartes de stats avec hauteur fixe */
  :deep(.stat-card-fixed-height) {
    height: 140px;
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
      height: 120px;
    }
  }
  </style>