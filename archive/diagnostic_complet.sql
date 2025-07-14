-- 🔍 DIAGNOSTIC COMPLET SUPABASE - ERREUR 406
-- Script SQL exhaustif pour identifier le problème

-- ========================================
-- 1️⃣ INFORMATIONS GÉNÉRALES
-- ========================================

SELECT '======================================' as separator;
SELECT 'DIAGNOSTIC COMPLET ERREUR 406' as titre;
SELECT NOW() as timestamp_diagnostic;
SELECT version() as postgres_version;
SELECT '======================================' as separator;

-- ========================================
-- 2️⃣ ÉTAT DES TABLES ET PERMISSIONS
-- ========================================

SELECT '=== ÉTAT RLS audit_sessions ===' as section;
SELECT schemaname, tablename, rowsecurity as rls_enabled, 
       CASE WHEN has_table_privilege('authenticated', 'audit_sessions', 'SELECT') 
            THEN 'OUI' ELSE 'NON' END as select_permission
FROM pg_tables 
WHERE tablename = 'audit_sessions';

-- Politiques RLS
SELECT '=== POLITIQUES RLS ===' as section;
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

-- Permissions de table
SELECT '=== PERMISSIONS TABLE ===' as section;
SELECT grantee, privilege_type, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'audit_sessions' 
ORDER BY grantee, privilege_type;

-- ========================================
-- 3️⃣ COMPARAISON UTILISATEURS
-- ========================================

SELECT '=== UTILISATEURS QUI MARCHENT ===' as section;
SELECT p.username, p.role, au.email, au.id, au.email_confirmed_at, 
       au.raw_app_meta_data, au.raw_user_meta_data, au.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.username IN ('admin', 'agent01')
ORDER BY au.created_at;

SELECT '=== UTILISATEURS QUI NE MARCHENT PAS ===' as section;
SELECT p.username, p.role, au.email, au.id, au.email_confirmed_at,
       au.raw_app_meta_data, au.raw_user_meta_data, au.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.username IN ('obs01', 'obs02', 'obs03')
ORDER BY au.created_at;

-- ========================================
-- 4️⃣ VÉRIFICATION DONNÉES AUTH.USERS
-- ========================================

SELECT '=== CHAMPS CRITIQUES AUTH.USERS ===' as section;
SELECT email, 
       CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMÉ' ELSE 'NON CONFIRMÉ' END as email_status,
       CASE WHEN banned_until IS NOT NULL THEN 'BANNI' ELSE 'ACTIF' END as ban_status,
       CASE WHEN deleted_at IS NOT NULL THEN 'SUPPRIMÉ' ELSE 'EXISTANT' END as delete_status,
       is_sso_user,
       raw_app_meta_data->>'provider' as provider,
       raw_app_meta_data->>'providers' as providers
FROM auth.users 
WHERE email LIKE '%obs0%' OR email LIKE '%admin%' OR email LIKE '%agent%'
ORDER BY created_at;

-- ========================================
-- 5️⃣ VÉRIFICATION CONTRAINTES ET FOREIGN KEYS
-- ========================================

SELECT '=== CONTRAINTES audit_sessions ===' as section;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass;

-- Vérifier index
SELECT '=== INDEX audit_sessions ===' as section;
SELECT indexname, indexdef
FROM pg_indexes 
WHERE tablename = 'audit_sessions';

-- ========================================
-- 6️⃣ TESTS D'ACCÈS DIRECT
-- ========================================

SELECT '=== TEST ACCÈS SANS RLS ===' as section;
SET LOCAL row_security = off;
SELECT COUNT(*) as total_audit_sessions FROM audit_sessions;
SELECT COUNT(DISTINCT user_id) as utilisateurs_uniques FROM audit_sessions;
RESET row_security;

-- Test accès par utilisateur
SELECT '=== AUDIT_SESSIONS PAR UTILISATEUR ===' as section;
SELECT p.username, COUNT(a.*) as nb_audits, a.user_id
FROM profiles p
LEFT JOIN audit_sessions a ON p.id = a.user_id
WHERE p.username IN ('admin', 'agent01', 'obs01', 'obs02')
GROUP BY p.username, a.user_id
ORDER BY p.username;

-- ========================================
-- 7️⃣ VÉRIFICATION SCHÉMA ET COLONNES
-- ========================================

SELECT '=== STRUCTURE audit_sessions ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'audit_sessions'
ORDER BY ordinal_position;

-- ========================================
-- 8️⃣ TRIGGERS ET FONCTIONS
-- ========================================

SELECT '=== TRIGGERS audit_sessions ===' as section;
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'audit_sessions';

-- Fonctions custom liées
SELECT '=== FONCTIONS CUSTOM ===' as section;
SELECT proname, prosrc
FROM pg_proc 
WHERE prosrc LIKE '%audit_sessions%' OR proname LIKE '%audit%'
ORDER BY proname;

-- ========================================
-- 9️⃣ VÉRIFICATION SUPABASE SPÉCIFIQUE
-- ========================================

SELECT '=== CONFIGURATION SUPABASE ===' as section;
SELECT name, setting, source
FROM pg_settings 
WHERE name LIKE '%rls%' OR name LIKE '%row%' OR name LIKE '%auth%'
ORDER BY name;

-- Vérifier les rôles Supabase
SELECT '=== RÔLES SUPABASE ===' as section;
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles 
WHERE rolname IN ('postgres', 'authenticated', 'anon', 'service_role')
ORDER BY rolname;

-- ========================================
-- 🔟 RÉSUMÉ FINAL
-- ========================================

SELECT '=== RÉSUMÉ DIAGNOSTIC ===' as section;
SELECT 
    'TOTAL UTILISATEURS PROFILES' as metric,
    COUNT(*) as valeur
FROM profiles
UNION ALL
SELECT 
    'TOTAL UTILISATEURS AUTH.USERS' as metric,
    COUNT(*) as valeur
FROM auth.users
UNION ALL
SELECT 
    'UTILISATEURS SYNCHRONISÉS' as metric,
    COUNT(*) as valeur
FROM profiles p
JOIN auth.users au ON p.id = au.id
UNION ALL
SELECT 
    'AUDIT_SESSIONS TOTAL' as metric,
    COUNT(*) as valeur
FROM audit_sessions;

SELECT '======================================' as separator;
SELECT 'FIN DIAGNOSTIC' as titre;
SELECT NOW() as timestamp_fin;
SELECT '======================================' as separator;
