# 🗄️ Requêtes SQL pour Dashboard "Ma Ville"

## 📝 Instructions
Copiez et exécutez ces requêtes dans l'éditeur SQL de Supabase, dans l'ordre indiqué.

## 1️⃣ Fonction : Statistiques Globales

```sql
-- Fonction pour récupérer les statistiques globales du dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_audits BIGINT,
  active_users BIGINT,
  total_photos BIGINT,
  avg_score NUMERIC,
  zones_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_audits,
    COUNT(DISTINCT user_id)::BIGINT as active_users,
    COALESCE(SUM(total_photos), 0)::BIGINT as total_photos,
    ROUND(AVG(
      (COALESCE(lighting, 0) + 
       COALESCE(walkpath, 0) + 
       COALESCE(openness, 0) + 
       COALESCE(feeling, 0) + 
       COALESCE(people_presence, 0) + 
       COALESCE(cleanliness, 0)) / 
      NULLIF(
        (CASE WHEN lighting IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN walkpath IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN openness IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN feeling IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN people_presence IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN cleanliness IS NOT NULL THEN 1 ELSE 0 END), 0)
    ), 2) as avg_score,
    COUNT(DISTINCT 
      CONCAT(
        ROUND(latitude::numeric, 3)::text, 
        '_', 
        ROUND(longitude::numeric, 3)::text
      )
    )::INTEGER as zones_count
  FROM public.audits
  WHERE is_completed = true
    AND latitude IS NOT NULL 
    AND longitude IS NOT NULL;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
```

## 2️⃣ Fonction : Points pour Heatmap

```sql
-- Fonction pour récupérer les points de la heatmap avec filtres
CREATE OR REPLACE FUNCTION public.get_heatmap_points(
  filter_type TEXT DEFAULT 'all',
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  lat FLOAT8,
  lng FLOAT8,
  intensity FLOAT8,
  count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Pour des raisons de confidentialité, on groupe par zones arrondies
  RETURN QUERY
  SELECT 
    ROUND(latitude::numeric, 4)::FLOAT8 as lat,
    ROUND(longitude::numeric, 4)::FLOAT8 as lng,
    CASE 
      WHEN filter_type = 'lighting' THEN AVG((5 - COALESCE(lighting, 3))::FLOAT8 / 4)
      WHEN filter_type = 'feeling' THEN AVG((5 - COALESCE(feeling, 3))::FLOAT8 / 4)
      WHEN filter_type = 'walkpath' THEN AVG((4 - COALESCE(walkpath, 2))::FLOAT8 / 3)
      WHEN filter_type = 'cleanliness' THEN AVG((4 - COALESCE(cleanliness, 2))::FLOAT8 / 3)
      ELSE 1.0
    END as intensity,
    COUNT(*)::BIGINT as count
  FROM public.audits
  WHERE 
    is_completed = true
    AND latitude IS NOT NULL 
    AND longitude IS NOT NULL
    AND latitude != 0 
    AND longitude != 0
    AND created_at > NOW() - INTERVAL '1 day' * days_back
    AND CASE
      WHEN filter_type = 'lighting' THEN lighting <= 2
      WHEN filter_type = 'feeling' THEN feeling <= 2
      WHEN filter_type = 'walkpath' THEN walkpath <= 2
      WHEN filter_type = 'cleanliness' THEN cleanliness <= 2
      ELSE true
    END
  GROUP BY 
    ROUND(latitude::numeric, 4),
    ROUND(longitude::numeric, 4)
  HAVING COUNT(*) >= 1; -- On peut ajuster ce seuil pour plus d'anonymat
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION public.get_heatmap_points(TEXT, INTEGER) TO authenticated;
```

## 3️⃣ Fonction : Scores Moyens par Critère

```sql
-- Fonction pour récupérer les scores moyens avec tendances
CREATE OR REPLACE FUNCTION public.get_average_scores(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  criterion TEXT,
  criterion_label TEXT,
  avg_score NUMERIC,
  max_score INTEGER,
  trend NUMERIC,
  count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT
      AVG(lighting) as lighting_avg,
      AVG(walkpath) as walkpath_avg,
      AVG(openness) as openness_avg,
      AVG(feeling) as feeling_avg,
      AVG(people_presence) as people_presence_avg,
      AVG(cleanliness) as cleanliness_avg,
      COUNT(*) as total_count
    FROM public.audits
    WHERE is_completed = true
      AND created_at > NOW() - INTERVAL '1 day' * days_back
  ),
  previous_period AS (
    SELECT
      AVG(lighting) as lighting_avg,
      AVG(walkpath) as walkpath_avg,
      AVG(openness) as openness_avg,
      AVG(feeling) as feeling_avg,
      AVG(people_presence) as people_presence_avg,
      AVG(cleanliness) as cleanliness_avg
    FROM public.audits
    WHERE is_completed = true
      AND created_at BETWEEN 
        NOW() - INTERVAL '1 day' * (days_back * 2) 
        AND NOW() - INTERVAL '1 day' * days_back
  )
  SELECT 
    t.criterion,
    t.criterion_label,
    t.avg_score,
    t.max_score,
    t.trend,
    current_period.total_count
  FROM (
    VALUES 
      ('lighting', 'Éclairage', 
       ROUND(current_period.lighting_avg, 2), 4, 
       ROUND(COALESCE(
         ((current_period.lighting_avg - previous_period.lighting_avg) / 
          NULLIF(previous_period.lighting_avg, 0)) * 100, 0
       ), 1)),
      ('walkpath', 'Cheminement', 
       ROUND(current_period.walkpath_avg, 2), 3,
       ROUND(COALESCE(
         ((current_period.walkpath_avg - previous_period.walkpath_avg) / 
          NULLIF(previous_period.walkpath_avg, 0)) * 100, 0
       ), 1)),
      ('openness', 'Ouverture', 
       ROUND(current_period.openness_avg, 2), 3,
       ROUND(COALESCE(
         ((current_period.openness_avg - previous_period.openness_avg) / 
          NULLIF(previous_period.openness_avg, 0)) * 100, 0
       ), 1)),
      ('feeling', 'Ressenti', 
       ROUND(current_period.feeling_avg, 2), 4,
       ROUND(COALESCE(
         ((current_period.feeling_avg - previous_period.feeling_avg) / 
          NULLIF(previous_period.feeling_avg, 0)) * 100, 0
       ), 1)),
      ('people_presence', 'Présence', 
       ROUND(current_period.people_presence_avg, 2), 3,
       ROUND(COALESCE(
         ((current_period.people_presence_avg - previous_period.people_presence_avg) / 
          NULLIF(previous_period.people_presence_avg, 0)) * 100, 0
       ), 1)),
      ('cleanliness', 'Propreté', 
       ROUND(current_period.cleanliness_avg, 2), 3,
       ROUND(COALESCE(
         ((current_period.cleanliness_avg - previous_period.cleanliness_avg) / 
          NULLIF(previous_period.cleanliness_avg, 0)) * 100, 0
       ), 1))
  ) AS t(criterion, criterion_label, avg_score, max_score, trend),
  current_period, 
  previous_period
  WHERE t.avg_score IS NOT NULL;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION public.get_average_scores(INTEGER) TO authenticated;
```

## 4️⃣ Fonction : Insights Automatiques

```sql
-- Fonction pour générer des insights automatiques
CREATE OR REPLACE FUNCTION public.get_insights(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  insight_type TEXT,
  insight_text TEXT,
  insight_value JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  
  -- 1. Zone la plus auditée
  WITH zone_counts AS (
    SELECT 
      ROUND(latitude::numeric, 3) as lat_zone,
      ROUND(longitude::numeric, 3) as lng_zone,
      COUNT(*) as audit_count,
      AVG(latitude) as avg_lat,
      AVG(longitude) as avg_lng,
      STRING_AGG(DISTINCT nearby_info, ', ') as zone_names
    FROM public.audits
    WHERE is_completed = true
      AND created_at > NOW() - INTERVAL '1 day' * days_back
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
    GROUP BY lat_zone, lng_zone
    ORDER BY audit_count DESC
    LIMIT 1
  )
  SELECT 
    'most_audited_zone'::TEXT,
    CASE 
      WHEN zone_names IS NOT NULL AND zone_names != '' 
      THEN 'Zone la plus étudiée : ' || SUBSTRING(zone_names, 1, 50)
      ELSE 'Zone la plus étudiée ce mois'
    END::TEXT,
    jsonb_build_object(
      'lat', avg_lat,
      'lng', avg_lng,
      'count', audit_count,
      'zone_name', zone_names
    )
  FROM zone_counts
  
  UNION ALL
  
  -- 2. Problème le plus fréquent
  WITH problem_counts AS (
    SELECT 
      problem_type,
      problem_text,
      COUNT(*) as count
    FROM (
      SELECT 
        CASE
          WHEN lighting <= 2 THEN 'lighting'
          WHEN walkpath <= 2 THEN 'walkpath'
          WHEN feeling <= 2 THEN 'feeling'
          WHEN cleanliness <= 2 THEN 'cleanliness'
          ELSE 'none'
        END as problem_type,
        CASE
          WHEN lighting <= 2 THEN 'Éclairage insuffisant'
          WHEN walkpath <= 2 THEN 'Problèmes de cheminement'
          WHEN feeling <= 2 THEN 'Sentiment d''insécurité'
          WHEN cleanliness <= 2 THEN 'Problèmes de propreté'
          ELSE 'Aucun problème majeur'
        END as problem_text
      FROM public.audits
      WHERE is_completed = true
        AND created_at > NOW() - INTERVAL '1 day' * days_back
    ) problems
    WHERE problem_type != 'none'
    GROUP BY problem_type, problem_text
    ORDER BY count DESC
    LIMIT 1
  )
  SELECT
    'main_issue'::TEXT,
    problem_text::TEXT,
    jsonb_build_object(
      'type', problem_type,
      'count', count,
      'percentage', ROUND((count::numeric / (
        SELECT COUNT(*) 
        FROM public.audits 
        WHERE is_completed = true 
          AND created_at > NOW() - INTERVAL '1 day' * days_back
      )) * 100, 1)
    )
  FROM problem_counts
  
  UNION ALL
  
  -- 3. Heure critique
  WITH hour_analysis AS (
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour,
      AVG(feeling) as avg_feeling,
      COUNT(*) as count
    FROM public.audits
    WHERE is_completed = true
      AND created_at > NOW() - INTERVAL '1 day' * days_back
      AND feeling IS NOT NULL
    GROUP BY hour
    HAVING COUNT(*) >= 3  -- Au moins 3 audits pour être significatif
    ORDER BY avg_feeling ASC
    LIMIT 1
  )
  SELECT
    'critical_hour'::TEXT,
    'Heure la plus critique : ' || hour || 'h00'::TEXT,
    jsonb_build_object(
      'hour', hour,
      'avg_feeling', ROUND(avg_feeling, 2),
      'count', count
    )
  FROM hour_analysis
  
  UNION ALL
  
  -- 4. Amélioration notable
  WITH improvements AS (
    SELECT 
      criterion,
      current_avg,
      previous_avg,
      improvement
    FROM (
      SELECT 
        'feeling' as criterion,
        AVG(CASE WHEN created_at > NOW() - INTERVAL '1 day' * days_back THEN feeling END) as current_avg,
        AVG(CASE WHEN created_at <= NOW() - INTERVAL '1 day' * days_back THEN feeling END) as previous_avg,
        AVG(CASE WHEN created_at > NOW() - INTERVAL '1 day' * days_back THEN feeling END) - 
        AVG(CASE WHEN created_at <= NOW() - INTERVAL '1 day' * days_back THEN feeling END) as improvement
      FROM public.audits
      WHERE is_completed = true
        AND created_at > NOW() - INTERVAL '1 day' * (days_back * 2)
        AND feeling IS NOT NULL
    ) t
    WHERE improvement > 0.1
    ORDER BY improvement DESC
    LIMIT 1
  )
  SELECT
    'improvement'::TEXT,
    'Amélioration du sentiment de sécurité : +' || ROUND(improvement * 25, 0) || '%'::TEXT,
    jsonb_build_object(
      'criterion', criterion,
      'current_avg', ROUND(current_avg, 2),
      'previous_avg', ROUND(previous_avg, 2),
      'improvement_percent', ROUND(improvement * 25, 1)
    )
  FROM improvements;
  
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION public.get_insights(INTEGER) TO authenticated;
```

## 5️⃣ Fonction : Statistiques par Zone (Bonus)

```sql
-- Fonction pour obtenir des stats par zone géographique
CREATE OR REPLACE FUNCTION public.get_zone_stats(
  zone_precision INTEGER DEFAULT 3  -- 3 = quartier, 4 = rue
)
RETURNS TABLE (
  zone_lat FLOAT8,
  zone_lng FLOAT8,
  audit_count BIGINT,
  avg_score NUMERIC,
  main_issue TEXT,
  zone_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH zone_data AS (
    SELECT 
      ROUND(latitude::numeric, zone_precision) as lat_zone,
      ROUND(longitude::numeric, zone_precision) as lng_zone,
      COUNT(*) as count,
      AVG((COALESCE(lighting, 0) + COALESCE(walkpath, 0) + 
           COALESCE(openness, 0) + COALESCE(feeling, 0) + 
           COALESCE(people_presence, 0) + COALESCE(cleanliness, 0)) / 6.0) as score,
      MODE() WITHIN GROUP (ORDER BY 
        CASE
          WHEN lighting <= 2 THEN 'Éclairage'
          WHEN walkpath <= 2 THEN 'Cheminement'
          WHEN feeling <= 2 THEN 'Sécurité'
          WHEN cleanliness <= 2 THEN 'Propreté'
          ELSE 'RAS'
        END
      ) as issue,
      STRING_AGG(DISTINCT NULLIF(nearby_info, ''), ', ') as names
    FROM public.audits
    WHERE is_completed = true
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL
    GROUP BY lat_zone, lng_zone
    HAVING COUNT(*) >= 3  -- Minimum 3 audits pour préserver l'anonymat
  )
  SELECT 
    lat_zone::FLOAT8 as zone_lat,
    lng_zone::FLOAT8 as zone_lng,
    count as audit_count,
    ROUND(score, 2) as avg_score,
    issue as main_issue,
    COALESCE(SUBSTRING(names, 1, 100), 'Zone ' || lat_zone || ',' || lng_zone) as zone_name
  FROM zone_data
  ORDER BY count DESC;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION public.get_zone_stats(INTEGER) TO authenticated;
```

## 📌 Notes d'utilisation

### Dans Supabase :
1. Allez dans l'éditeur SQL
2. Exécutez chaque fonction une par une
3. Vérifiez qu'il n'y a pas d'erreurs

### Dans Vue.js :
```javascript
// Exemple d'appel depuis Vue
const { data, error } = await supabase
  .rpc('get_dashboard_stats')

const { data: heatmapData } = await supabase
  .rpc('get_heatmap_points', { 
    filter_type: 'lighting', 
    days_back: 30 
  })
```

### Tests recommandés :
```sql
-- Tester les fonctions
SELECT * FROM get_dashboard_stats();
SELECT * FROM get_heatmap_points('all', 30);
SELECT * FROM get_average_scores(30);
SELECT * FROM get_insights(30);
SELECT * FROM get_zone_stats(3);
```
