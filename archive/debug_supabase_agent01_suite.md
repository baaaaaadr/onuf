# 🔍 Investigation Supplémentaire - Erreur 406 agent01

## 🎯 Tests critiques à effectuer

### 1️⃣ **Vérifier la correspondance avec auth.users**
```sql
-- CRUCIAL : Vérifier si agent01 existe dans auth.users
SELECT id, email, phone, email_confirmed_at, phone_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- Comparer avec admin
SELECT id, email, phone, email_confirmed_at, phone_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';

-- Vérifier s'il y a une différence de statut
SELECT id, email, email_confirmed_at, banned_until, deleted_at
FROM auth.users 
WHERE id IN ('a46d3190-f20e-4790-97fa-1914d57be153', 'b179b9a0-26bd-45a7-b01a-fd014ed404ed');
```

### 2️⃣ **Vérifier TOUTES les politiques RLS (pas seulement audit_sessions)**
```sql
-- Lister TOUTES les politiques qui pourraient affecter audit_sessions
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('audit_sessions', 'profiles') 
ORDER BY tablename, policyname;

-- Vérifier s'il y a des politiques cachées ou désactivées
SELECT t.tablename, t.rowsecurity, t.forcerowsecurity
FROM pg_tables t
WHERE t.tablename IN ('audit_sessions', 'profiles');
```

### 3️⃣ **Test de foreign key integrity**
```sql
-- Vérifier que la foreign key fonctionne bien
SELECT a.id as audit_id, a.user_id, p.username, p.role
FROM audit_sessions a
JOIN profiles p ON a.user_id = p.id
WHERE p.username IN ('agent01', 'admin');

-- Vérifier s'il y a des audit_sessions orphelines
SELECT a.id, a.user_id, 'ORPHANED' as status
FROM audit_sessions a
LEFT JOIN profiles p ON a.user_id = p.id
WHERE p.id IS NULL;
```

### 4️⃣ **Simuler la requête exacte qui échoue**
```sql
-- Simuler exactement ce que fait la requête REST API
SET LOCAL rls.force_row_level_security = on;
SET LOCAL request.jwt.claims = '{"sub":"a46d3190-f20e-4790-97fa-1914d57be153","role":"authenticated"}';

SELECT * FROM audit_sessions WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- Reset
RESET ALL;
```

### 5️⃣ **Vérifier les triggers et fonctions**
```sql
-- Chercher des triggers qui pourraient interférer
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'audit_sessions';

-- Vérifier les fonctions custom
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%audit%' OR proname LIKE '%session%';
```

## 🎯 **Solution probable**

**Ma suspicion principale :** L'utilisateur `agent01` n'existe pas dans `auth.users` ou a un statut problématique (banned, deleted, etc.).

Supabase REST API vérifie automatiquement que l'utilisateur authentifié existe dans `auth.users` avant d'appliquer les politiques RLS. Si l'utilisateur n'existe que dans `profiles` mais pas dans `auth.users`, cela peut causer une erreur 406.

## 🚀 **Solution rapide à tester**

Si le test 1 confirme que `agent01` n'existe pas dans `auth.users`, la solution serait :

1. **Créer l'utilisateur dans auth via Supabase Dashboard**
2. **Ou synchroniser les tables** avec cette requête :

```sql
-- NE PAS EXÉCUTER SANS CONFIRMATION
-- INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   'a46d3190-f20e-4790-97fa-1914d57be153',
--   'agent01@example.com',
--   NOW(),
--   NOW(),
--   NOW()
-- );
```

**⚠️ IMPORTANT :** Ne pas exécuter l'INSERT sans d'abord confirmer le diagnostic avec les tests ci-dessus.
