-- 🚨 DIAGNOSTIC URGENT - ERREUR 406 obs01
-- UUID observé dans l'app: c4b16be0-afc6-458b-b951-6615789d9245

-- ========================================
-- 1️⃣ VÉRIFICATION ÉTAT ACTUEL obs01
-- ========================================

-- Vérifier tous les obs01 dans auth.users
SELECT 'AUTH.USERS - TOUS LES obs01' as table_name;
SELECT id, email, created_at, updated_at
FROM auth.users 
WHERE email LIKE '%obs01%'
ORDER BY created_at;

-- Vérifier tous les obs01 dans profiles  
SELECT 'PROFILES - TOUS LES obs01' as table_name;
SELECT id, username, created_at, updated_at
FROM profiles 
WHERE username = 'obs01'
ORDER BY created_at;

-- ========================================
-- 2️⃣ VÉRIFICATION UUID SPÉCIFIQUE
-- ========================================

-- Chercher l'UUID c4b16be0-afc6-458b-b951-6615789d9245 partout
SELECT 'AUTH.USERS - UUID ACTUEL' as source;
SELECT id, email, email_confirmed_at
FROM auth.users 
WHERE id = 'c4b16be0-afc6-458b-b951-6615789d9245';

SELECT 'PROFILES - UUID ACTUEL' as source;
SELECT id, username, role, is_active
FROM profiles 
WHERE id = 'c4b16be0-afc6-458b-b951-6615789d9245';

-- ========================================
-- 3️⃣ RECHERCHE UUID ORPHELINS
-- ========================================

-- Chercher l'ancien UUID dans profiles
SELECT 'PROFILES - ANCIEN UUID' as source;
SELECT id, username, role, is_active
FROM profiles 
WHERE id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- Vérifier les audit_sessions liées
SELECT 'AUDIT_SESSIONS - ANCIEN UUID' as source;
SELECT COUNT(*) as count, user_id
FROM audit_sessions 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153'
GROUP BY user_id;

-- Vérifier les audit_sessions avec le nouvel UUID
SELECT 'AUDIT_SESSIONS - NOUVEL UUID' as source;
SELECT COUNT(*) as count, user_id
FROM audit_sessions 
WHERE user_id = 'c4b16be0-afc6-458b-b951-6615789d9245'
GROUP BY user_id;

-- ========================================
-- 4️⃣ RÉSUMÉ PROBLÈME
-- ========================================

SELECT 'RÉSUMÉ SYNCHRONISATION' as status;
SELECT 
    au.email,
    au.id as auth_uuid,
    p.username,
    p.id as profiles_uuid,
    CASE 
        WHEN au.id = p.id THEN '✅ SYNC'
        WHEN au.id IS NULL THEN '❌ AUTH MANQUANT'
        WHEN p.id IS NULL THEN '❌ PROFILE MANQUANT'
        ELSE '⚠️ UUID DIFFÉRENTS'
    END as sync_status
FROM auth.users au
FULL OUTER JOIN profiles p ON au.id = p.id
WHERE au.email LIKE '%obs01%' OR p.username = 'obs01'
ORDER BY au.created_at, p.created_at;
