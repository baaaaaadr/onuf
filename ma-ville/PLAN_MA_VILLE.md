# 🏙️ Plan de Développement - Tableau de Bord "Ma Ville"

## 📋 Vue d'ensemble

### Objectif
Créer un tableau de bord collectif qui transforme les données individuelles en intelligence collective, permettant aux observatrices de visualiser l'impact de leur travail sur Agadir.

### Philosophie
- **"Nous" avant "Je"** : Valoriser l'effort collectif
- **Visuel avant Chiffre** : Privilégier les représentations graphiques
- **Anonymat Garanti** : Toujours agréger les données
- **Simplicité** : 3-4 informations clés maximum par vue

## 🎨 Design & Intégration

### Navigation
- Nouvel onglet dans `BottomNav.vue` : "Ma Ville"
- Icône : `mdi-city-variant-outline`
- Position : Entre "Historique" et "Profil"
- Route : `/ma-ville`

### Cohérence visuelle
- Réutiliser les composants existants :
  - `StatCard.vue` pour les statistiques
  - Styles du redesign Phase 3.3
  - Animations et transitions existantes
- Palette de couleurs ONUF (variables CSS existantes)

## 📊 Structure du Tableau de Bord

### Section 1 : Impact Collectif
**Titre** : "Notre Impact sur Agadir"

**Cartes de statistiques** (utiliser `StatCard.vue` modifié) :
1. **Total des Audits**
   - Icône : `mdi-clipboard-check-multiple`
   - Requête : `COUNT(*) FROM audits WHERE is_completed = true`
   - Animation : Compteur progressif au chargement

2. **Observatrices Actives**
   - Icône : `mdi-account-group`
   - Requête : `COUNT(DISTINCT user_id) FROM audits WHERE created_at > NOW() - INTERVAL '30 days'`
   - Sous-titre : "Ce mois-ci"

3. **Zones Couvertes**
   - Icône : `mdi-map-marker-radius`
   - Calcul : Nombre de zones uniques (basé sur clustering GPS)
   - Animation : Effet de pulsation

4. **Photos Documentées** (optionnel)
   - Icône : `mdi-camera-burst`
   - Requête : `SUM(total_photos) FROM audits`

### Section 2 : Carte Interactive
**Titre** : "Carte de la Sécurité Urbaine"

**Fonctionnalités** :
1. **Heatmap de base**
   - Utiliser Leaflet.heat (déjà compatible avec notre setup)
   - Intensité basée sur la densité d'audits
   - Rayon adaptatif selon le zoom

2. **Filtres intelligents** (chips Vuetify) :
   - Toutes les données
   - Zones mal éclairées (lighting <= 2)
   - Points d'insécurité (feeling <= 2)
   - Problèmes de mobilité (walkpath <= 2)
   - Période : 7 jours / 30 jours / Tout

3. **Améliorations proposées** :
   - **Clusters intelligents** : Grouper les points proches avec nombre d'audits
   - **Info-bulles agrégées** : Au survol d'une zone, afficher :
     - Nombre d'audits dans cette zone
     - Score moyen de sécurité
     - Principal problème identifié
   - **Légende dynamique** : Échelle de couleurs avec signification

### Section 3 : Baromètre des Quartiers
**Titre** : "État de nos Espaces Publics"

**Visualisations** :
1. **Graphique en radar** (au lieu de barres simples)
   - Plus visuel et impactant
   - Montre l'équilibre entre les différents critères
   - Utiliser Chart.js (déjà dans les dépendances)

2. **Scores moyens par critère** :
   - Éclairage
   - Cheminement
   - Ouverture visuelle
   - Sentiment de sécurité
   - Présence humaine
   - Propreté

3. **Indicateurs de tendance** (nouveau) :
   - Flèche ↑↓ pour montrer l'évolution sur 30 jours
   - Couleur verte/rouge selon amélioration/dégradation

### Section 4 : Insights Automatiques (Innovation)
**Titre** : "Ce que nous révèlent les données"

**Contenu dynamique** :
- "La zone la plus auditée ce mois : [Nom via géocodage]"
- "Amélioration notable : +15% du sentiment de sécurité Rue [X]"
- "Point d'attention : 8 signalements de mauvais éclairage à [Zone]"
- "Heure critique : 65% des audits négatifs entre 18h et 20h"

## 🗄️ Architecture Technique

### Base de données (Supabase)

#### Fonctions PostgreSQL à créer :

```sql
-- 1. Statistiques globales
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_audits BIGINT,
  active_users BIGINT,
  total_photos BIGINT,
  avg_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_audits,
    COUNT(DISTINCT user_id)::BIGINT as active_users,
    COALESCE(SUM(total_photos), 0)::BIGINT as total_photos,
    ROUND(AVG((lighting + walkpath + openness + feeling + people_presence + cleanliness) / 6.0), 2) as avg_score
  FROM audits
  WHERE is_completed = true;
END;
$$ LANGUAGE plpgsql;

-- 2. Points pour heatmap avec filtres
CREATE OR REPLACE FUNCTION get_heatmap_points(
  filter_type TEXT DEFAULT 'all',
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  lat FLOAT8,
  lng FLOAT8,
  intensity FLOAT8
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    latitude as lat,
    longitude as lng,
    CASE 
      WHEN filter_type = 'lighting' THEN (5 - lighting)::FLOAT8 / 4
      WHEN filter_type = 'feeling' THEN (5 - feeling)::FLOAT8 / 4
      WHEN filter_type = 'walkpath' THEN (4 - walkpath)::FLOAT8 / 3
      ELSE 1.0
    END as intensity
  FROM audits
  WHERE 
    is_completed = true
    AND created_at > NOW() - INTERVAL '1 day' * days_back
    AND CASE
      WHEN filter_type = 'lighting' THEN lighting <= 2
      WHEN filter_type = 'feeling' THEN feeling <= 2
      WHEN filter_type = 'walkpath' THEN walkpath <= 2
      ELSE true
    END;
END;
$$ LANGUAGE plpgsql;

-- 3. Scores moyens par critère
CREATE OR REPLACE FUNCTION get_average_scores(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  criterion TEXT,
  avg_score NUMERIC,
  max_score INTEGER,
  trend NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH current_scores AS (
    SELECT
      AVG(lighting) as lighting_avg,
      AVG(walkpath) as walkpath_avg,
      AVG(openness) as openness_avg,
      AVG(feeling) as feeling_avg,
      AVG(people_presence) as people_presence_avg,
      AVG(cleanliness) as cleanliness_avg
    FROM audits
    WHERE created_at > NOW() - INTERVAL '1 day' * days_back
  ),
  previous_scores AS (
    SELECT
      AVG(lighting) as lighting_avg,
      AVG(walkpath) as walkpath_avg,
      AVG(openness) as openness_avg,
      AVG(feeling) as feeling_avg,
      AVG(people_presence) as people_presence_avg,
      AVG(cleanliness) as cleanliness_avg
    FROM audits
    WHERE created_at BETWEEN NOW() - INTERVAL '1 day' * (days_back * 2) 
      AND NOW() - INTERVAL '1 day' * days_back
  )
  SELECT * FROM (
    VALUES 
      ('lighting', ROUND(current_scores.lighting_avg, 2), 4, 
       ROUND(((current_scores.lighting_avg - previous_scores.lighting_avg) / NULLIF(previous_scores.lighting_avg, 0)) * 100, 1)),
      ('walkpath', ROUND(current_scores.walkpath_avg, 2), 3,
       ROUND(((current_scores.walkpath_avg - previous_scores.walkpath_avg) / NULLIF(previous_scores.walkpath_avg, 0)) * 100, 1)),
      ('openness', ROUND(current_scores.openness_avg, 2), 3,
       ROUND(((current_scores.openness_avg - previous_scores.openness_avg) / NULLIF(previous_scores.openness_avg, 0)) * 100, 1)),
      ('feeling', ROUND(current_scores.feeling_avg, 2), 4,
       ROUND(((current_scores.feeling_avg - previous_scores.feeling_avg) / NULLIF(previous_scores.feeling_avg, 0)) * 100, 1)),
      ('people_presence', ROUND(current_scores.people_presence_avg, 2), 3,
       ROUND(((current_scores.people_presence_avg - previous_scores.people_presence_avg) / NULLIF(previous_scores.people_presence_avg, 0)) * 100, 1)),
      ('cleanliness', ROUND(current_scores.cleanliness_avg, 2), 3,
       ROUND(((current_scores.cleanliness_avg - previous_scores.cleanliness_avg) / NULLIF(previous_scores.cleanliness_avg, 0)) * 100, 1))
  ) AS t(criterion, avg_score, max_score, trend)
  FROM current_scores, previous_scores;
END;
$$ LANGUAGE plpgsql;

-- 4. Insights automatiques
CREATE OR REPLACE FUNCTION get_insights(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  insight_type TEXT,
  insight_text TEXT,
  insight_value JSONB
) AS $$
BEGIN
  RETURN QUERY
  -- Zone la plus auditée
  WITH zone_counts AS (
    SELECT 
      ROUND(latitude::numeric, 3) as lat_zone,
      ROUND(longitude::numeric, 3) as lng_zone,
      COUNT(*) as audit_count,
      AVG(latitude) as avg_lat,
      AVG(longitude) as avg_lng
    FROM audits
    WHERE created_at > NOW() - INTERVAL '1 day' * days_back
    GROUP BY lat_zone, lng_zone
    ORDER BY audit_count DESC
    LIMIT 1
  )
  SELECT 
    'most_audited_zone'::TEXT,
    'Zone la plus étudiée ce mois'::TEXT,
    jsonb_build_object(
      'lat', avg_lat,
      'lng', avg_lng,
      'count', audit_count
    )
  FROM zone_counts
  
  UNION ALL
  
  -- Problème le plus fréquent
  WITH problem_scores AS (
    SELECT
      CASE
        WHEN lighting <= 2 THEN 'Éclairage insuffisant'
        WHEN walkpath <= 2 THEN 'Problèmes de cheminement'
        WHEN feeling <= 2 THEN 'Sentiment d''insécurité'
        WHEN cleanliness <= 2 THEN 'Problèmes de propreté'
        ELSE 'Aucun problème majeur'
      END as problem,
      COUNT(*) as problem_count
    FROM audits
    WHERE created_at > NOW() - INTERVAL '1 day' * days_back
    GROUP BY problem
    ORDER BY problem_count DESC
    LIMIT 1
  )
  SELECT
    'main_issue'::TEXT,
    problem::TEXT,
    jsonb_build_object('count', problem_count)
  FROM problem_scores;
END;
$$ LANGUAGE plpgsql;
```

### Frontend (Vue.js)

#### Nouveau composable : `useCityDashboard.js`
```javascript
// Gestion des données du tableau de bord
// - Cache des résultats
// - Refresh automatique
// - Gestion des erreurs
```

#### Composants à créer :
1. `MaVilleView.vue` - Vue principale
2. `CityHeatmap.vue` - Carte avec heatmap
3. `CriteriaRadar.vue` - Graphique radar
4. `InsightCard.vue` - Carte d'insight

## 📅 Phases de Développement

### Phase 1 : Infrastructure (2-3h)
- [ ] Créer les fonctions PostgreSQL dans Supabase
- [ ] Créer le composable `useCityDashboard.js`
- [ ] Ajouter la route et l'onglet navigation
- [ ] Créer la vue de base `MaVilleView.vue`

### Phase 2 : Section Impact (2-3h)
- [ ] Adapter `StatCard.vue` pour les besoins spécifiques
- [ ] Implémenter les appels API pour les stats
- [ ] Ajouter les animations de chargement
- [ ] Gérer le cache et le refresh

### Phase 3 : Carte Interactive (4-5h)
- [ ] Intégrer Leaflet.heat
- [ ] Créer le composant `CityHeatmap.vue`
- [ ] Implémenter les filtres
- [ ] Ajouter les interactions (zoom, info-bulles)

### Phase 4 : Baromètre & Insights (3-4h)
- [ ] Intégrer Chart.js pour le radar
- [ ] Créer `CriteriaRadar.vue`
- [ ] Implémenter les insights automatiques
- [ ] Ajouter les indicateurs de tendance

### Phase 5 : Optimisation & Polish (2h)
- [ ] Optimiser les performances (lazy loading)
- [ ] Ajouter les transitions entre sections
- [ ] Implémenter le mode offline (cache)
- [ ] Tests sur mobile

## 🔒 Considérations de Sécurité

1. **Anonymisation** : Jamais d'info permettant d'identifier un audit spécifique
2. **Agrégation** : Minimum 3 audits pour afficher une zone
3. **Précision GPS** : Arrondir les coordonnées pour créer des zones
4. **Permissions** : Vérifier que l'utilisateur est connecté

## 📱 Adaptation Mobile

- Carte plein écran avec overlay pour les filtres
- Sections scrollables verticalement
- Graphiques responsives
- Touch gestures pour la carte

## 🚀 Extensions Futures

1. **Export PDF** : Rapport mensuel automatique
2. **Comparaison temporelle** : Évolution mois par mois
3. **Alertes** : Notifications pour zones problématiques
4. **Gamification** : Badges collectifs ("100 audits ce mois!")
5. **Mode quartier** : Vue détaillée par quartier

## 📝 Notes d'implémentation

- Utiliser les transactions Supabase pour la cohérence
- Implémenter un système de cache avec TTL de 5 minutes
- Prévoir un mode dégradé si pas assez de données
- Logger les erreurs pour monitoring
- Ajouter des skeleton loaders pendant le chargement

---

Ce plan peut être exécuté progressivement, phase par phase. Chaque phase produit une fonctionnalité utilisable, permettant des tests et ajustements en cours de route.
