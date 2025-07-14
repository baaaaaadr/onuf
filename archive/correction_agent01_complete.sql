-- 🔧 CORRECTION COMPLÈTE AGENT01 - Ordre correct des mises à jour

-- ========================================
-- 1️⃣ IDENTIFIER TOUTES LES RÉFÉRENCES
-- ========================================
-- Vérifier quelles tables référencent agent01
SELECT 'audit_sessions' as table_name, COUNT(*) as count
FROM audit_sessions 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153'
UNION ALL
SELECT 'audits' as table_name, COUNT(*) as count
FROM audits 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153'
UNION ALL
SELECT 'audit_photos' as table_name, COUNT(*) as count
FROM audit_photos 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- ========================================
-- 2️⃣ METTRE À JOUR TOUTES LES RÉFÉRENCES (Dans l'ordre)
-- ========================================

-- A. Mettre à jour audit_sessions (déjà fait ✅)
-- UPDATE audit_sessions 
-- SET user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
-- WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- B. Mettre à jour audits
UPDATE audits 
SET user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- C. Mettre à jour audit_photos (si elles existent)
UPDATE audit_photos 
SET user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- ========================================
-- 3️⃣ MAINTENANT METTRE À JOUR PROFILES
-- ========================================
-- Ceci devrait fonctionner maintenant
UPDATE profiles 
SET id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
WHERE username = 'agent01';

-- ========================================
-- 4️⃣ VÉRIFICATION FINALE
-- ========================================
-- Vérifier que tout est synchronisé
SELECT 'profiles' as table_name, p.username, p.id
FROM profiles p 
WHERE p.username = 'agent01'
UNION ALL
SELECT 'auth.users' as table_name, au.email, au.id
FROM auth.users au 
WHERE au.email = 'agent01@onuf.local';

-- Vérifier les liens
SELECT 'audit_sessions' as table_name, COUNT(*) as count, user_id
FROM audit_sessions 
WHERE user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
GROUP BY user_id
UNION ALL
SELECT 'audits' as table_name, COUNT(*) as count, user_id
FROM audits 
WHERE user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
GROUP BY user_id;
