-- 🔍 SECTION 5 : TESTS D'ACCÈS DIRECT
-- Copiez-collez cette section dans Supabase SQL Editor

SELECT '=== RÉSUMÉ SYNCHRONISATION ===' as section;
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
JOIN auth.users au ON p.id = au.id;

SELECT '=== CONTRAINTES audit_sessions ===' as section;
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass;

SELECT '=== RÔLES SUPABASE ===' as section;
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles 
WHERE rolname IN ('postgres', 'authenticated', 'anon', 'service_role')
ORDER BY rolname;
