# 📊 Suivi d'Avancement - Dashboard "Ma Ville"

## 🎯 Statut Global : 0% (Non démarré)

## Phase 1 : Infrastructure
**Statut** : ⏳ À faire
- [ ] Créer les fonctions PostgreSQL dans Supabase
- [ ] Créer le composable `useCityDashboard.js`
- [ ] Ajouter la route dans le router
- [ ] Ajouter l'onglet dans `BottomNav.vue`
- [ ] Créer la vue de base `MaVilleView.vue`

## Phase 2 : Section Impact
**Statut** : ⏳ À faire
- [ ] Adapter/étendre `StatCard.vue`
- [ ] Implémenter `getDashboardStats()`
- [ ] Ajouter animations de compteur
- [ ] Gérer le cache des données

## Phase 3 : Carte Interactive
**Statut** : ⏳ À faire
- [ ] Installer leaflet.heat
- [ ] Créer `CityHeatmap.vue`
- [ ] Implémenter les filtres
- [ ] Ajouter les contrôles de carte

## Phase 4 : Baromètre & Insights
**Statut** : ⏳ À faire
- [ ] Créer `CriteriaRadar.vue`
- [ ] Implémenter `getAverageScores()`
- [ ] Créer `InsightCard.vue`
- [ ] Implémenter `getInsights()`

## Phase 5 : Optimisation
**Statut** : ⏳ À faire
- [ ] Optimiser les requêtes
- [ ] Ajouter le mode offline
- [ ] Tests performance mobile
- [ ] Documentation utilisateur

## 📝 Notes de développement

### Décisions prises :
- Utiliser un radar chart au lieu de barres simples (plus visuel)
- Ajouter des insights automatiques (valeur ajoutée)
- Implémenter un système de cache pour performance
- Arrondir les coordonnées GPS pour l'anonymat

### Points d'attention :
- Toujours vérifier l'anonymat des données
- Prévoir un fallback si pas assez de données
- Optimiser pour mobile first
- Garder la cohérence avec le design existant

### Dépendances à ajouter :
```bash
npm install leaflet.heat
# Chart.js est déjà installé
```

## 🔗 Fichiers créés/modifiés

### Nouveaux fichiers :
- `/ma-ville/PLAN_MA_VILLE.md` ✅
- `/ma-ville/SQL_QUERIES.md` ✅
- `/ma-ville/PROGRESS.md` ✅ (ce fichier)

### À créer :
- `/src/views/MaVilleView.vue`
- `/src/composables/useCityDashboard.js`
- `/src/components/dashboard/CityHeatmap.vue`
- `/src/components/dashboard/CriteriaRadar.vue`
- `/src/components/dashboard/InsightCard.vue`

### À modifier :
- `/src/router/index.js` (ajouter route)
- `/src/components/navigation/BottomNav.vue` (ajouter onglet)
- `/src/components/common/StatCard.vue` (si nécessaire)

## 🐛 Bugs rencontrés
_Section à remplir au fur et à mesure_

## 💡 Idées d'amélioration
- Ajouter un mode "temps réel" avec WebSocket
- Permettre de comparer deux périodes
- Exporter les données en CSV pour les chercheurs
- Ajouter des notifications push pour milestones collectifs
