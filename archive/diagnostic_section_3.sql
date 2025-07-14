-- 🔍 SECTION 3 : COMPARAISON UTILISATEURS
-- Copiez-collez cette section dans Supabase SQL Editor

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
