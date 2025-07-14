-- 🔍 DIAGNOSTIC API REST - ERREUR 406 PERSISTANTE
-- La contrainte UNIQUE n'était pas la vraie cause

-- ========================================
-- 1️⃣ VÉRIFICATION EXPOSITION API REST
-- ========================================

-- Vérifier que audit_sessions est exposée via l'API REST
SELECT 'API REST EXPOSURE CHECK' as section;

-- Vérifier les permissions API spécifiques
SHOW rls;

-- Vérifier les rôles et leurs permissions sur audit_sessions
SELECT 'PERMISSIONS DÉTAILLÉES' as section;
SELECT 
    r.rolname,
    CASE WHEN has_table_privilege(r.rolname, 'audit_sessions', 'SELECT') THEN 'OUI' ELSE 'NON' END as can_select,
    CASE WHEN has_table_privilege(r.rolname, 'audit_sessions', 'INSERT') THEN 'OUI' ELSE 'NON' END as can_insert,
    CASE WHEN has_table_privilege(r.rolname, 'audit_sessions', 'UPDATE') THEN 'OUI' ELSE 'NON' END as can_update,
    CASE WHEN has_table_privilege(r.rolname, 'audit_sessions', 'DELETE') THEN 'OUI' ELSE 'NON' END as can_delete
FROM pg_roles r 
WHERE r.rolname IN ('authenticated', 'anon', 'service_role')
ORDER BY r.rolname;

-- ========================================
-- 2️⃣ TEST ACCÈS AVEC RÔLE AUTHENTICATED
-- ========================================

-- Simuler l'accès API REST avec le rôle authenticated
SELECT 'TEST RÔLE AUTHENTICATED' as section;

-- Simuler la requête exacte qui échoue
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub":"c4b16be0-afc6-458b-b951-6615789d9245","role":"authenticated","aud":"authenticated"}';
SET LOCAL request.jwt.claim.sub = 'c4b16be0-afc6-458b-b951-6615789d9245';
SET LOCAL request.jwt.claim.role = 'authenticated';

-- Test de la requête qui échoue
SELECT 'REQUÊTE QUI ÉCHOUE' as test;
SELECT * FROM audit_sessions WHERE user_id = 'c4b16be0-afc6-458b-b951-6615789d9245';

-- Reset
RESET ROLE;
RESET ALL;

-- ========================================
-- 3️⃣ VÉRIFICATION SCHÉMA API
-- ========================================

-- Vérifier si audit_sessions est dans le bon schéma pour l'API
SELECT 'SCHÉMA ET API' as section;
SELECT schemaname, tablename, tableowner, hasindexes, hasrules, hastriggers
FROM pg_tables 
WHERE tablename = 'audit_sessions';

-- Vérifier les vues API exposées
SELECT 'VUES API PUBLIQUES' as section;
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%audit%'
ORDER BY table_name;

-- ========================================
-- 4️⃣ COMPARAISON AVEC TABLE QUI FONCTIONNE
-- ========================================

-- Comparer audit_sessions avec profiles (qui fonctionne pour l'auth)
SELECT 'COMPARAISON PROFILES vs AUDIT_SESSIONS' as section;

SELECT 'PROFILES' as table_name,
       schemaname, rowsecurity as rls_enabled,
       CASE WHEN has_table_privilege('authenticated', 'profiles', 'SELECT') THEN 'OUI' ELSE 'NON' END as auth_select
FROM pg_tables WHERE tablename = 'profiles'

UNION ALL

SELECT 'AUDIT_SESSIONS' as table_name,
       schemaname, rowsecurity as rls_enabled,
       CASE WHEN has_table_privilege('authenticated', 'audit_sessions', 'SELECT') THEN 'OUI' ELSE 'NON' END as auth_select
FROM pg_tables WHERE tablename = 'audit_sessions';

-- Comparer les politiques
SELECT 'POLITIQUES PROFILES' as section;
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE tablename = 'profiles'

UNION ALL

SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE tablename = 'audit_sessions';

-- ========================================
-- 5️⃣ VÉRIFICATION CONTRAINTES RESTANTES
-- ========================================

SELECT 'CONTRAINTES RESTANTES' as section;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass
ORDER BY contype;
