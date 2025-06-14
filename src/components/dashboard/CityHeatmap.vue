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
        <div class="map-legend" v-show="!loading && heatmapData.length > 0">
          <div class="legend-title">Intensité</div>
          <div class="legend-gradient" />
          <div class="legend-labels">
            <span>Faible</span>
            <span>Élevée</span>
          </div>
        </div>
        
        <!-- Loading overlay -->
        <v-overlay
          :model-value="loading"
          contained
          persistent
          class="align-center justify-center"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
        </v-overlay>
        
        <!-- Message si pas de données -->
        <v-overlay
          :model-value="!loading && heatmapData.length === 0"
          contained
          persistent
          class="align-center justify-center"
        >
          <div class="text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              mdi-map-marker-off
            </v-icon>
            <p class="text-body-2 text-grey">
              Aucune donnée disponible pour ce filtre
            </p>
          </div>
        </v-overlay>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onUnmounted } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.heat'
  
  // Props
  const props = defineProps({
    height: { 
      type: String, 
      default: '400px' 
    },
    heatmapData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  // Emit
  const emit = defineEmits(['filter-change', 'load-data'])
  
  // Refs
  const mapContainer = ref(null)
  const map = ref(null)
  const heatmapLayer = ref(null)
  const selectedFilter = ref('all')
  const isFullscreen = ref(false)
  
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
    // Position par défaut : Agadir (vous pouvez ajuster)
    const defaultCenter = [30.4278, -9.5981]
    
    // Créer la carte
    map.value = L.map(mapContainer.value, {
      zoomControl: true,
      attributionControl: true
    }).setView(defaultCenter, 13)
    
    // Ajouter les tuiles de base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map.value)
    
    // Style pour mieux voir la heatmap
    mapContainer.value.style.backgroundColor = '#f5f5f5'
    
    console.log('🗺️ Carte initialisée')
  }
  
  // Mettre à jour la heatmap
  const updateHeatmap = () => {
    console.log('🔥 Mise à jour heatmap:', props.heatmapData.length, 'points')
    
    // Supprimer l'ancien layer
    if (heatmapLayer.value) {
      map.value.removeLayer(heatmapLayer.value)
      heatmapLayer.value = null
    }
    
    // Si pas de données, ne rien faire
    if (!props.heatmapData || props.heatmapData.length === 0) {
      return
    }
    
    // Convertir les données pour Leaflet.heat
    // Format attendu : [[lat, lng, intensity], ...]
    const heatData = props.heatmapData.map(point => {
      // Utiliser l'intensité et le nombre de points pour pondérer
      const weight = point.intensity * Math.min(point.count / 5, 2)
      return [
        point.lat,
        point.lng,
        weight
      ]
    })
    
    // Créer le nouveau layer heatmap
    heatmapLayer.value = L.heatLayer(heatData, {
      radius: 30,
      blur: 20,
      maxZoom: 15,
      max: 1.0,
      gradient: {
        0.0: 'blue',
        0.3: 'cyan',
        0.5: 'lime',
        0.7: 'yellow',
        0.9: 'orange',
        1.0: 'red'
      }
    }).addTo(map.value)
    
    // Ajuster la vue si on a des données
    if (heatData.length > 0) {
      const bounds = L.latLngBounds(heatData.map(point => [point[0], point[1]]))
      map.value.fitBounds(bounds, { padding: [50, 50] })
    }
  }
  
  // Plein écran
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    
    // Attendre que l'animation CSS soit terminée
    setTimeout(() => {
      if (map.value) {
        map.value.invalidateSize()
      }
    }, 300)
  }
  
  // Watchers
  watch(selectedFilter, (newFilter) => {
    console.log('🔄 Changement de filtre:', newFilter)
    emit('filter-change', newFilter)
    emit('load-data', newFilter)
  })
  
  watch(() => props.heatmapData, () => {
    updateHeatmap()
  }, { deep: true })
  
  // Lifecycle
  onMounted(() => {
    // Attendre que le container soit prêt
    setTimeout(() => {
      initMap()
      updateHeatmap()
    }, 100)
  })
  
  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })
  </script>
  
  <style scoped>
  .city-heatmap {
    height: v-bind(height);
    width: 100%;
    position: relative;
    transition: all 0.3s ease;
    z-index: 1;
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
  
  /* Légende */
  .map-legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 120px;
  }
  
  .legend-title {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .legend-gradient {
    width: 100%;
    height: 12px;
    background: linear-gradient(to right, blue, cyan, lime, yellow, orange, red);
    border-radius: 6px;
    margin-bottom: 4px;
  }
  
  .legend-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.6);
  }
  
  /* Fix pour Leaflet avec Vuetify */
  :deep(.leaflet-control-container) {
    .leaflet-top,
    .leaflet-bottom {
      z-index: 400 !important;
    }
  }
  
  :deep(.leaflet-control) {
    margin: 10px;
  }
  
  :deep(.leaflet-control-zoom) {
    border: none !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  :deep(.leaflet-control-zoom a) {
    background-color: white !important;
    color: #333 !important;
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
    font-size: 18px !important;
    font-weight: normal !important;
    text-indent: 0 !important;
    border: none !important;
  }
  
  :deep(.leaflet-control-zoom a:hover) {
    background-color: #f4f4f4 !important;
  }
  
  :deep(.leaflet-control-attribution) {
    background: rgba(255, 255, 255, 0.8) !important;
    font-size: 10px;
  }
  
  /* Mobile */
  @media (max-width: 600px) {
    .map-legend {
      bottom: 10px;
      right: 10px;
      padding: 8px;
      min-width: 100px;
    }
    
    .legend-title {
      font-size: 11px;
    }
    
    .legend-gradient {
      height: 10px;
    }
    
    .legend-labels {
      font-size: 9px;
    }
  }
  </style>