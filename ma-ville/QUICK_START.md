# 🚀 Guide de Démarrage Rapide - Dashboard "Ma Ville"

## 📋 Checklist de démarrage

### 1. Base de données Supabase (30 min)
1. Ouvrir Supabase > SQL Editor
2. Copier et exécuter les fonctions depuis `SQL_QUERIES.md`
3. Tester avec : `SELECT * FROM get_dashboard_stats();`
4. Vérifier les permissions

### 2. Installation des dépendances (5 min)
```bash
cd C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa
npm install leaflet.heat
```

### 3. Création de la structure (15 min)
```bash
# Créer les dossiers
mkdir src/components/dashboard
mkdir src/views/MaVille

# Créer les fichiers de base
touch src/views/MaVilleView.vue
touch src/composables/useCityDashboard.js
touch src/components/dashboard/CityHeatmap.vue
```

### 4. Ajout de la route (5 min)
Dans `/src/router/index.js`, ajouter :
```javascript
{
  path: '/ma-ville',
  name: 'ma-ville',
  component: () => import('@/views/MaVilleView.vue'),
  meta: { requiresAuth: true }
}
```

### 5. Ajout dans la navigation (5 min)
Dans `/src/components/navigation/BottomNav.vue`, ajouter :
```javascript
{
  icon: 'mdi-city-variant-outline',
  text: 'Ma Ville',
  to: '/ma-ville'
}
```

## 🏃 Commencer par...

### Option A : Vue squelette (Recommandé)
Créer d'abord `MaVilleView.vue` avec une structure basique :
```vue
<template>
  <div class="ma-ville-view">
    <v-container>
      <h1>Ma Ville - Tableau de Bord</h1>
      <p>Dashboard en construction...</p>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Ma Ville view mounted')
})
</script>
```

### Option B : Composable d'abord
Créer `useCityDashboard.js` pour tester les appels API :
```javascript
import { ref } from 'vue'
import { supabase } from './useSupabase'

export const useCityDashboard = () => {
  const loading = ref(false)
  const stats = ref(null)

  const loadDashboardStats = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .rpc('get_dashboard_stats')
      
      if (error) throw error
      stats.value = data
      console.log('Stats loaded:', data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    stats,
    loadDashboardStats
  }
}
```

## 📊 Tester les fonctions SQL

Dans la console Supabase ou via l'app :
```javascript
// Test depuis la console du navigateur
const testDashboard = async () => {
  const { data: stats } = await supabase.rpc('get_dashboard_stats')
  console.log('Stats:', stats)
  
  const { data: heatmap } = await supabase.rpc('get_heatmap_points', {
    filter_type: 'all',
    days_back: 30
  })
  console.log('Heatmap points:', heatmap)
  
  const { data: scores } = await supabase.rpc('get_average_scores', {
    days_back: 30
  })
  console.log('Average scores:', scores)
  
  const { data: insights } = await supabase.rpc('get_insights', {
    days_back: 30
  })
  console.log('Insights:', insights)
}

// Exécuter
testDashboard()
```

## 🎯 Ordre de développement suggéré

1. **Setup de base** (1h)
   - Routes et navigation
   - Vue squelette
   - Composable de base

2. **Section Stats** (2h)
   - Adapter StatCard
   - Connecter aux données
   - Ajouter animations

3. **Carte Heatmap** (3h)
   - Intégrer Leaflet
   - Ajouter heatmap layer
   - Implémenter filtres

4. **Graphiques** (2h)
   - Radar chart
   - Insights cards
   - Tendances

5. **Polish** (1h)
   - Animations
   - Loading states
   - Error handling

## 🐛 Debug tips

### Si les fonctions SQL ne marchent pas :
1. Vérifier les permissions : `GRANT EXECUTE ON FUNCTION...`
2. Tester directement dans Supabase SQL Editor
3. Vérifier que l'utilisateur est authentifié

### Si la carte ne s'affiche pas :
1. Vérifier que Leaflet CSS est importé
2. Donner une hauteur fixe au container
3. Appeler `map.invalidateSize()` après montage

### Si pas de données :
1. Vérifier qu'il y a des audits dans la base
2. Vérifier les filtres de date
3. Logger les erreurs Supabase

## 📚 Ressources

- [Leaflet.heat documentation](https://github.com/Leaflet/Leaflet.heat)
- [Chart.js Radar Chart](https://www.chartjs.org/docs/latest/charts/radar.html)
- [Supabase RPC](https://supabase.com/docs/guides/database/functions)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

---

💡 **Astuce** : Commencez simple, testez souvent, itérez rapidement !
