# 🧪 Guide de Test - Tableau de Bord "Ma Ville"

## ✅ Checklist de Vérification

### 1. Navigation et Accès
- [ ] L'onglet "Ma Ville" apparaît dans la navigation du bas
- [ ] Clic sur l'onglet charge la page sans erreur
- [ ] L'icône change entre outline/filled selon l'état actif
- [ ] La route `/ma-ville` fonctionne directement

### 2. Section Impact Collectif
- [ ] Les 4 cartes de statistiques s'affichent
- [ ] Les valeurs se chargent (pas de "0" permanent)
- [ ] Les icônes correspondent aux statistiques
- [ ] Les skeleton loaders apparaissent pendant le chargement

**Cartes attendues :**
- 📋 Audits Réalisés (nombre total)
- 👥 Observatrices Actives (ce mois-ci)
- 📍 Zones Couvertes (nombre de zones)
- ⭐ Score Moyen (pourcentage)

### 3. Carte Interactive 
- [ ] La carte Leaflet s'affiche correctement
- [ ] La heatmap apparaît avec des couleurs (bleu → rouge)
- [ ] Les filtres par critère fonctionnent :
  - [ ] Toutes
  - [ ] Éclairage  
  - [ ] Sécurité
  - [ ] Mobilité
  - [ ] Propreté
- [ ] Les filtres temporels fonctionnent :
  - [ ] 7j
  - [ ] 30j  
  - [ ] Tout
- [ ] Clic sur les marqueurs colorés affiche un popup
- [ ] Le bouton plein écran fonctionne
- [ ] La légende s'affiche en bas à droite

### 4. Graphique Radar
- [ ] Le graphique radar (toile d'araignée) s'affiche
- [ ] Les 6 critères sont visibles autour du graphique
- [ ] Les valeurs et indicateurs de tendance s'affichent en dessous
- [ ] Les flèches de tendance (↗️ ↘️) apparaissent si applicable
- [ ] Le nombre d'audits s'affiche dans le coin

### 5. Section Insights
- [ ] Des cartes d'insight s'affichent à droite
- [ ] Chaque insight a une icône et une couleur appropriée
- [ ] Les valeurs formatées s'affichent (pourcentages, nombres, etc.)
- [ ] Les insights sont pertinents par rapport aux données

**Types d'insights attendus :**
- 📍 Zone Focus (zone la plus auditée)
- ⚠️ Problème Principal (critique le plus fréquent)
- 📈 Amélioration (si tendance positive)

### 6. Bouton Refresh
- [ ] Le bouton flottant refresh (↻) apparaît en bas à droite
- [ ] Clic sur le bouton recharge toutes les données
- [ ] Tooltip "Actualiser les données" apparaît au survol

## 🐛 Debug et Résolution de Problèmes

### Console du Navigateur
Vérifiez que ces messages apparaissent dans la console (F12) :
```
🏙️ Ma Ville view montée
📊 Stats chargées: {données}
📈 Scores chargés: X critères  
💡 Insights chargés: X insights
🗺️ Heatmap chargée (all): X points
🗺️ Carte initialisée
```

### Erreurs Courantes

**❌ "Failed to execute 'rpc'"**
- Vérifiez que les fonctions PostgreSQL sont créées dans Supabase
- Consultez le fichier `SQL_QUERIES.md` dans `/ma-ville/`

**❌ Carte ne s'affiche pas**
- Vérifiez que `leaflet.heat` est installé : `npm install leaflet.heat`
- Refresh de la page peut aider

**❌ Graphique radar vide**
- Vérifiez qu'il y a des audits avec is_completed = true dans la DB
- Les critères doivent avoir des valeurs > 0

**❌ Stats à zéro**
- Vérifiez les données dans Supabase
- Testez les fonctions RPC directement dans l'interface Supabase

### Tests avec Vraies Données
1. **Créez quelques audits** via l'interface normale
2. **Marquez-les comme complétés** (is_completed = true)
3. **Rafraîchissez Ma Ville** avec le bouton ↻
4. **Vérifiez que les stats se mettent à jour**

### Tests de Performance
- [ ] **Mobile** : Testez sur un vrai téléphone
- [ ] **Réseau lent** : Throttling dans DevTools
- [ ] **Données importantes** : Testez avec 50+ audits
- [ ] **Changements rapides** : Cliquez rapidement sur les filtres

## 📊 Données de Test Recommandées

Pour des tests optimaux, avoir au minimum :
- **5-10 audits complétés** dans différentes zones
- **Scores variés** pour les critères (1-4)
- **Audits récents** (derniers 7-30 jours)
- **Géolocalisation diverse** autour d'Agadir

## 🎯 Critères de Réussite

### Interface
- ✅ Toutes les sections s'affichent sans erreur
- ✅ Les animations sont fluides
- ✅ Responsive sur mobile et desktop
- ✅ Skeleton loaders pendant les chargements

### Fonctionnalités  
- ✅ Filtres temps réel sans rechargement de page
- ✅ Cache fonctionne (2ème chargement plus rapide)
- ✅ Interactions carte (zoom, popups, plein écran)
- ✅ Données cohérentes entre sections

### Performance
- ✅ Chargement initial < 3 secondes
- ✅ Changement de filtre < 1 seconde  
- ✅ Pas de lag sur mobile
- ✅ Mémoire stable (pas de fuites)

---

**🎉 Si tous les tests passent, le tableau de bord "Ma Ville" est prêt pour la production !**

En cas de problème, consultez :
1. La console navigateur pour les erreurs
2. L'onglet Network pour les requêtes échouées  
3. Le fichier `PLAN_MA_VILLE.md` pour l'architecture
4. Le composable `useCityDashboard.js` pour le debug des données
