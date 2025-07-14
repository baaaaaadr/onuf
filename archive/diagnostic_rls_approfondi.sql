-- 🚨 DIAGNOSTIC APPROFONDI - PROBLÈME RLS GÉNÉRAL
-- Le problème affecte TOUS les nouveaux utilisateurs, pas seulement obs01

-- ========================================
-- 1️⃣ VÉRIFICATION POLITIQUES RLS DÉTAILLÉES
-- ========================================

-- Voir toutes les politiques sur audit_sessions
SELECT 'POLITIQUES RLS audit_sessions' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

-- Vérifier si RLS est activé
SELECT 'STATUT RLS' as section;
SELECT schemaname, tablename, rowsecurity as rls_enabled, forcerowsecurity as force_rls
FROM pg_tables 
WHERE tablename = 'audit_sessions';

-- ========================================
-- 2️⃣ TEST PERMISSIONS UTILISATEURS
-- ========================================

-- Vérifier les permissions de table pour rôle authenticated
SELECT 'PERMISSIONS TABLE' as section;
SELECT table_name, privilege_type, grantee, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'audit_sessions' AND grantee IN ('authenticated', 'anon', 'public');

-- ========================================
-- 3️⃣ COMPARAISON UTILISATEURS QUI MARCHENT VS CEUX QUI NE MARCHENT PAS
-- ========================================

-- Utilisateurs qui fonctionnent (admin, agent01)
SELECT 'UTILISATEURS QUI MARCHENT' as section;
SELECT p.username, p.role, au.email, au.email_confirmed_at, au.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.username IN ('admin', 'agent01')
ORDER BY au.created_at;

-- Utilisateurs qui ne marchent pas (obs01, obs02)
SELECT 'UTILISATEURS QUI NE MARCHENT PAS' as section;
SELECT p.username, p.role, au.email, au.email_confirmed_at, au.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.username IN ('obs01', 'obs02')
ORDER BY au.created_at;

-- ========================================
-- 4️⃣ VÉRIFICATION CONTRAINTES ET TRIGGERS
-- ========================================

-- Chercher des triggers sur audit_sessions
SELECT 'TRIGGERS audit_sessions' as section;
SELECT trigger_name, event_manipulation, action_timing, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'audit_sessions';

-- Vérifier les foreign keys
SELECT 'FOREIGN KEYS' as section;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass AND contype = 'f';

-- ========================================
-- 5️⃣ TEST DIRECT ACCÈS
-- ========================================

-- Test d'accès direct sans RLS
SELECT 'TEST ACCÈS DIRECT (avec BYPASS RLS)' as section;
SET LOCAL row_security = off;
SELECT COUNT(*) as total_audit_sessions FROM audit_sessions;
RESET row_security;

-- Test avec simulation utilisateur obs01
SELECT 'TEST SIMULATION obs01' as section;
SET LOCAL request.jwt.claims = '{"sub":"c4b16be0-afc6-458b-b951-6615789d9245","role":"authenticated"}';
SET LOCAL request.jwt.claim.sub = 'c4b16be0-afc6-458b-b951-6615789d9245';
SELECT COUNT(*) as count_obs01 FROM audit_sessions WHERE user_id = 'c4b16be0-afc6-458b-b951-6615789d9245';
RESET ALL;

-- Test avec simulation utilisateur admin
SELECT 'TEST SIMULATION admin' as section;
SET LOCAL request.jwt.claims = '{"sub":"b179b9a0-26bd-45a7-b01a-fd014ed404ed","role":"authenticated"}';
SET LOCAL request.jwt.claim.sub = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';
SELECT COUNT(*) as count_admin FROM audit_sessions WHERE user_id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';
RESET ALL;
