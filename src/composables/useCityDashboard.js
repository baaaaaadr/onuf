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
      
      // RPC retourne un array, on prend le premier élément
      const statsData = data && data.length > 0 ? data[0] : null
      stats.value = statsData
      setCached(cacheKey, statsData)
      
      console.log('📊 Stats chargées:', statsData)
      return statsData
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur stats:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Charger les données de heatmap
  const loadHeatmapData = async (filterType = 'all', daysBack = 30) => {
    const cacheKey = `heatmap_${filterType}_${daysBack}`
    
    const cached = getCached(cacheKey)
    if (cached) {
      heatmapData.value = cached
      return cached
    }
    
    try {
      const { data, error: err } = await supabase
        .rpc('get_heatmap_points', { 
          filter_type: filterType, 
          days_back: daysBack 
        })
      
      if (err) throw err
      
      heatmapData.value = data || []
      setCached(cacheKey, data)
      
      console.log(`🗺️ Heatmap chargée (${filterType}):`, data?.length || 0, 'points')
      return data
    } catch (err) {
      console.error('❌ Erreur heatmap:', err)
      return []
    }
  }
  
  // Charger les scores moyens
  const loadAverageScores = async (daysBack = 30) => {
    const cacheKey = `scores_${daysBack}`
    
    const cached = getCached(cacheKey)
    if (cached) {
      scores.value = cached
      return cached
    }
    
    try {
      const { data, error: err } = await supabase
        .rpc('get_average_scores', { days_back: daysBack })
      
      if (err) throw err
      
      scores.value = data || []
      setCached(cacheKey, data)
      
      console.log('📈 Scores chargés:', data?.length || 0, 'critères')
      return data
    } catch (err) {
      console.error('❌ Erreur scores:', err)
      return []
    }
  }
  
  // Charger les insights
  const loadInsights = async (daysBack = 30) => {
    const cacheKey = `insights_${daysBack}`
    
    const cached = getCached(cacheKey)
    if (cached) {
      insights.value = cached
      return cached
    }
    
    try {
      const { data, error: err } = await supabase
        .rpc('get_insights', { days_back: daysBack })
      
      if (err) throw err
      
      insights.value = data || []
      setCached(cacheKey, data)
      
      console.log('💡 Insights chargés:', data?.length || 0, 'insights')
      return data
    } catch (err) {
      console.error('❌ Erreur insights:', err)
      return []
    }
  }
  
  // Statistiques formatées pour les cartes
  const formattedStats = computed(() => {
    if (!stats.value) return null
    
    return {
      totalAudits: {
        value: parseInt(stats.value.total_audits) || 0,
        label: 'Audits Réalisés',
        icon: 'mdi-clipboard-check-multiple',
        color: 'primary'
      },
      activeUsers: {
        value: parseInt(stats.value.active_users) || 0,
        label: 'Observatrices Actives',
        icon: 'mdi-account-group',
        color: 'success',
        subtitle: 'Ce mois-ci'
      },
      zonesCount: {
        value: parseInt(stats.value.zones_count) || 0,
        label: 'Zones Couvertes',
        icon: 'mdi-map-marker-radius',
        color: 'info'
      },
      avgScore: {
        value: Math.round((parseFloat(stats.value.avg_score) || 0) * 25),
        label: 'Score Moyen',
        icon: 'mdi-star',
        color: 'warning',
        format: 'percentage'
      }
    }
  })
  
  // Formater les insights pour l'affichage
  const formattedInsights = computed(() => {
    return insights.value.map(insight => ({
      ...insight,
      title: getInsightTitle(insight.insight_type),
      icon: getInsightIcon(insight.insight_type),
      color: getInsightColor(insight.insight_type),
      formattedValue: formatInsightValue(insight)
    }))
  })
  
  // Helpers pour les insights
  const getInsightTitle = (type) => {
    const titles = {
      'most_audited_zone': '📍 Zone Focus',
      'main_issue': '⚠️ Problème Principal',
      'critical_hour': '🕐 Heure Critique',
      'improvement': '📈 Amélioration'
    }
    return titles[type] || '💡 Insight'
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
  
  const formatInsightValue = (insight) => {
    const value = insight.insight_value
    if (!value) return null
    
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value
      return parsed
    } catch (e) {
      return value
    }
  }
  
  // Refresh toutes les données
  const refreshAll = async () => {
    loading.value = true
    
    try {
      await Promise.all([
        loadDashboardStats(true),
        loadHeatmapData('all', 30),
        loadAverageScores(30),
        loadInsights(30)
      ])
      
      console.log('🔄 Toutes les données rafraîchies')
    } catch (err) {
      console.error('❌ Erreur refresh:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Vider le cache
  const clearCache = () => {
    cache.clear()
    console.log('🧹 Cache vidé')
  }
  
  return {
    // État
    loading,
    error,
    stats,
    heatmapData,
    scores,
    insights,
    
    // Computed
    formattedStats,
    formattedInsights,
    
    // Actions
    loadDashboardStats,
    loadHeatmapData,
    loadAverageScores,
    loadInsights,
    refreshAll,
    clearCache
  }
}