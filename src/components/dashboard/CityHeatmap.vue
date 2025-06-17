<!-- src/components/dashboard/CityHeatmap.vue -->
<template>
    <v-card rounded="xl" elevation="2">
      <v-card-title class="d-flex align-center flex-wrap">
        <div class="d-flex align-center">
          <v-icon class="mr-2">mdi-map-marker-radius</v-icon>
          <span class="text-h6 text-sm-h5">Carte de la Sécurité Urbaine</span>
        </div>
        
        <v-spacer />
        
        <v-btn
          :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
          variant="text"
          size="small"
          @click="toggleFullscreen"
        />
      </v-card-title>
      
      <v-card-subtitle>
        <!-- Filtres par critère -->
        <div class="mb-3">
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
        </div>
        
        <!-- Filtres temporels -->
        <div>
          <span class="text-caption text-medium-emphasis mr-2">Période:</span>
          <v-chip-group
            v-model="selectedPeriod"
            mandatory
            selected-class="secondary"
          >
            <v-chip
              v-for="period in periods"
              :key="period.value"
              :value="period.value"
              variant="outlined"
              size="x-small"
            >
              {{ period.label }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-card-subtitle>
      
      <v-card-text class="pa-0">
        <div 
          ref="mapContainer" 
          class="city-heatmap"
          :class="{ 'fullscreen': isFullscreen }"
        />
        
        <!-- Bouton de fermeture en mode plein écran -->
        <v-btn
          v-if="isFullscreen"
          icon="mdi-close"
          color="primary"
          size="large"
          class="fullscreen-close-btn"
          @click="toggleFullscreen"
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
    default: '450px' 
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
  const selectedPeriod = ref(30)
  const isFullscreen = ref(false)
  
  // Filtres disponibles
  const filters = [
    { value: 'all', label: 'Toutes', icon: 'mdi-map' },
    { value: 'lighting', label: 'Éclairage', icon: 'mdi-lightbulb' },
    { value: 'feeling', label: 'Sécurité', icon: 'mdi-shield' },
    { value: 'walkpath', label: 'Mobilité', icon: 'mdi-walk' },
    { value: 'cleanliness', label: 'Propreté', icon: 'mdi-broom' }
  ]
  
  // Périodes temporelles
  const periods = [
    { value: 7, label: '7j' },
    { value: 30, label: '30j' },
    { value: 365, label: 'Tout' }
  ]
  
  // Centre d'Agadir et limites
  const AGADIR_CENTER = [30.4278, -9.5981]
  const MAX_DISTANCE_KM = 10
  
  // Calculer les bounds maximum (approximation : 1° ≈ 111km)
  // Mais pour la latitude, la distance varie avec la latitude
  const degreesPerKmLat = 1 / 111
  const degreesPerKmLng = 1 / (111 * Math.cos(AGADIR_CENTER[0] * Math.PI / 180))
  
  const maxDegreesLat = MAX_DISTANCE_KM * degreesPerKmLat
  const maxDegreesLng = MAX_DISTANCE_KM * degreesPerKmLng
  
  const AGADIR_BOUNDS = [
    [AGADIR_CENTER[0] - maxDegreesLat, AGADIR_CENTER[1] - maxDegreesLng], // Sud-Ouest
    [AGADIR_CENTER[0] + maxDegreesLat, AGADIR_CENTER[1] + maxDegreesLng]  // Nord-Est
  ]
  
  // Initialiser la carte
  const initMap = () => {
    // Créer la carte avec contraintes
    map.value = L.map(mapContainer.value, {
      zoomControl: true,
      attributionControl: true,
      maxBounds: AGADIR_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 10,
      maxZoom: 16
    }).setView(AGADIR_CENTER, 12)
    
    // Ajouter les tuiles de base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 16
    }).addTo(map.value)
    
    // Style pour mieux voir la heatmap
    mapContainer.value.style.backgroundColor = '#f5f5f5'
    
    console.log('🗺️ Carte initialisée avec limites:', AGADIR_BOUNDS)
  }
  
  // Mettre à jour la heatmap
  const updateHeatmap = () => {
    if (!map.value) {
      console.warn('🗺️ Map non initialisée')
      return
    }
    
    console.log('🔥 Mise à jour heatmap:', props.heatmapData.length, 'points')
    
    // Supprimer l'ancien layer
    if (heatmapLayer.value && map.value.hasLayer(heatmapLayer.value)) {
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
    try {
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
      })
      
      if (map.value) {
        heatmapLayer.value.addTo(map.value)
      }
    } catch (e) {
      console.error('Erreur création heatmap:', e)
    }
    
    // Ajouter des marqueurs informatifs pour les zones avec beaucoup de données
    addInfoMarkers()
    
    // Ajuster la vue si on a des données, mais rester dans les limites d'Agadir
    if (heatData.length > 0) {
      const bounds = L.latLngBounds(heatData.map(point => [point[0], point[1]]))
      
      // Limiter les bounds à la zone d'Agadir
      const agadirBounds = L.latLngBounds(AGADIR_BOUNDS)
      
      // Utiliser l'intersection des bounds si disponible
      let viewBounds = bounds
      
      // Vérifier si les données sont dans la zone d'Agadir
      if (bounds.getNorth() > agadirBounds.getNorth() ||
          bounds.getSouth() < agadirBounds.getSouth() ||
          bounds.getEast() > agadirBounds.getEast() ||
          bounds.getWest() < agadirBounds.getWest()) {
        // Si les données dépassent, recentrer sur Agadir
        map.value.setView(AGADIR_CENTER, 12)
      } else {
        // Ajuster la vue sur les données avec padding
        map.value.fitBounds(bounds, { 
          padding: [50, 50], 
          maxZoom: 14 
        })
      }
    } else {
      // Pas de données, centrer sur Agadir
      map.value.setView(AGADIR_CENTER, 12)
    }
  }
  
  // Variable pour stocker les marqueurs
  const markers = ref([])
  
  // Ajouter des marqueurs informatifs
  const addInfoMarkers = () => {
    if (!map.value) return
    
    // Supprimer les anciens marqueurs
    markers.value.forEach(marker => {
      try {
        if (map.value && map.value.hasLayer(marker)) {
          map.value.removeLayer(marker)
        }
      } catch (e) {
        console.warn('Erreur suppression marqueur:', e)
      }
    })
    markers.value = []
    // Grouper les points proches et ajouter des marqueurs pour les zones importantes
    const significantZones = props.heatmapData.filter(point => 
      point.count && point.count >= 3 // Minimum 3 audits pour afficher un marqueur
    )
    
    significantZones.forEach(zone => {
      const marker = L.circleMarker([zone.lat, zone.lng], {
        radius: 8,
        fillColor: getZoneColor(zone.intensity),
        color: '#fff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6
      })
      
      // Popup avec informations
      const popupContent = `
        <div style="font-family: 'Roboto', sans-serif; min-width: 200px;">
          <h4 style="margin: 0 0 8px; color: #1976d2; font-size: 14px;">
            📍 Zone d'audits
          </h4>
          <div style="margin-bottom: 8px;">
            <strong>${zone.count || 1} audit${(zone.count || 1) > 1 ? 's' : ''}</strong>
          </div>
          <div style="margin-bottom: 4px; font-size: 12px;">
            🎯 Intensité: ${(zone.intensity * 100).toFixed(0)}%
          </div>
          <div style="font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 4px; margin-top: 8px;">
            Coordonnées: ${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}
          </div>
        </div>
      `
      
      marker.bindPopup(popupContent)
      
      // Effet hover
      marker.on('mouseover', function() {
        this.setStyle({
          radius: 12,
          weight: 3
        })
      })
      
      marker.on('mouseout', function() {
        this.setStyle({
          radius: 8,
          weight: 2
        })
      })
      
      marker.addTo(map.value)
      markers.value.push(marker)
    })
  }
  
  // Couleur en fonction de l'intensité
  const getZoneColor = (intensity) => {
    if (intensity > 0.8) return '#ff4444'
    if (intensity > 0.6) return '#ff8800'
    if (intensity > 0.4) return '#ffaa00'
    if (intensity > 0.2) return '#88dd00'
    return '#00aa88'
  }
  
  // Plein écran
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    
    // Attendre que l'animation CSS soit terminée
    setTimeout(() => {
      if (map.value) {
        try {
          map.value.invalidateSize()
          // Recentrer la carte
          map.value.setView(AGADIR_CENTER, map.value.getZoom())
        } catch (e) {
          console.warn('Erreur invalidateSize:', e)
        }
      }
    }, 350)
  }
  
  // Watchers
  watch(selectedFilter, (newFilter) => {
    console.log('🔄 Changement de filtre:', newFilter)
    loadData()
  })
  
  watch(selectedPeriod, (newPeriod) => {
    console.log('📅 Changement de période:', newPeriod, 'jours')
    loadData()
  })
  
  // Helper pour charger les données
  const loadData = () => {
    emit('filter-change', {
      filter: selectedFilter.value,
      period: selectedPeriod.value
    })
    emit('load-data', selectedFilter.value, selectedPeriod.value)
  }
  
  watch(() => props.heatmapData, () => {
    if (map.value) {
      updateHeatmap()
    }
  }, { deep: true, immediate: false })
  
  // Lifecycle
  onMounted(() => {
    // Attendre que le container soit prêt
    setTimeout(() => {
      if (mapContainer.value) {
        initMap()
        updateHeatmap()
      }
    }, 100)
  })
  
  onUnmounted(() => {
    // Nettoyer les marqueurs
    markers.value.forEach(marker => {
      if (map.value && map.value.hasLayer(marker)) {
        map.value.removeLayer(marker)
      }
    })
    markers.value = []
    
    // Nettoyer la heatmap
    if (heatmapLayer.value && map.value && map.value.hasLayer(heatmapLayer.value)) {
      map.value.removeLayer(heatmapLayer.value)
      heatmapLayer.value = null
    }
    
    // Supprimer la carte
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
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }
  
  .city-heatmap.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh !important;
    z-index: 2000;
    background: white;
  }
  
  /* Bouton de fermeture en mode plein écran */
  .fullscreen-close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2001;
    background: white !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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