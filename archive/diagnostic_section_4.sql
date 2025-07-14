-- 🔍 SECTION 4 : VÉRIFICATION CRITIQUE AUTH.USERS
-- Cette section est CRITIQUE pour identifier le problème 406

SELECT '=== CHAMPS CRITIQUES AUTH.USERS ===' as section;
SELECT email, id,
       CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMÉ' ELSE 'NON CONFIRMÉ' END as email_status,
       CASE WHEN banned_until IS NOT NULL THEN 'BANNI' ELSE 'ACTIF' END as ban_status,
       CASE WHEN deleted_at IS NOT NULL THEN 'SUPPRIMÉ' ELSE 'EXISTANT' END as delete_status,
       is_sso_user,
       raw_app_meta_data->>'provider' as provider,
       raw_app_meta_data->>'providers' as providers,
       created_at
FROM auth.users 
WHERE email LIKE '%obs0%' OR email LIKE '%admin%' OR email LIKE '%agent%'
ORDER BY created_at;

SELECT '=== TEST AUDIT_SESSIONS PAR UTILISATEUR ===' as section;
SELECT p.username, COUNT(a.*) as nb_audits, a.user_id
FROM profiles p
LEFT JOIN audit_sessions a ON p.id = a.user_id
WHERE p.username IN ('admin', 'agent01', 'obs01', 'obs02')
GROUP BY p.username, a.user_id
ORDER BY p.username;
