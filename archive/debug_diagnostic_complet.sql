-- 🔍 SCRIPT DE DIAGNOSTIC COMPLET - ONUF PWA
-- Copiez-collez ce script section par section dans Supabase SQL Editor

-- ========================================
-- 1️⃣ VÉRIFICATION AUTH.USERS
-- ========================================
SELECT '=== AGENT01 DANS AUTH.USERS ===' as section;
SELECT id, email, phone, email_confirmed_at, phone_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE id = 'a46d3190-f20e-4790-97fa-1914d57be153';

SELECT '=== ADMIN DANS AUTH.USERS ===' as section;
SELECT id, email, phone, email_confirmed_at, phone_confirmed_at, raw_user_meta_data 
FROM auth.users 
WHERE id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';

-- ========================================
-- 2️⃣ VÉRIFICATION PROFILES
-- ========================================
SELECT '=== PROFILES COMPARISON ===' as section;
SELECT username, role, is_active, created_at, last_login 
FROM profiles 
WHERE username IN ('agent01', 'admin')
ORDER BY username;

-- ========================================
-- 3️⃣ VÉRIFICATION AUDIT_SESSIONS
-- ========================================
SELECT '=== AUDIT_SESSIONS PAR UTILISATEUR ===' as section;
SELECT COUNT(*) as count, p.username, p.role
FROM audit_sessions a
JOIN profiles p ON a.user_id = p.id
GROUP BY p.username, p.role;

-- ========================================
-- 4️⃣ VÉRIFICATION RLS
-- ========================================
SELECT '=== POLITIQUES RLS ===' as section;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('audit_sessions', 'profiles') 
ORDER BY tablename, policyname;

-- ========================================
-- 5️⃣ TEST DIRECT AUDIT_SESSIONS
-- ========================================
SELECT '=== TEST DIRECT AGENT01 ===' as section;
SELECT COUNT(*) as count_agent01
FROM audit_sessions 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

SELECT '=== TEST DIRECT ADMIN ===' as section;
SELECT COUNT(*) as count_admin
FROM audit_sessions 
WHERE user_id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';

-- ========================================
-- 6️⃣ RÉSUMÉ DIAGNOSTIC
-- ========================================
SELECT '=== RÉSUMÉ ===' as section;
SELECT 
  'PROFILES' as table_name,
  COUNT(*) as total_users,
  COUNT(CASE WHEN username = 'agent01' THEN 1 END) as has_agent01,
  COUNT(CASE WHEN username = 'admin' THEN 1 END) as has_admin
FROM profiles
UNION ALL
SELECT 
  'AUTH.USERS' as table_name,
  COUNT(*) as total_users,
  COUNT(CASE WHEN id = 'a46d3190-f20e-4790-97fa-1914d57be153' THEN 1 END) as has_agent01,
  COUNT(CASE WHEN id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed' THEN 1 END) as has_admin
FROM auth.users;
