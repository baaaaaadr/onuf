-- 🔍 SECTION 2 : ÉTAT RLS ET PERMISSIONS
-- Copiez-collez cette section dans Supabase SQL Editor

SELECT '=== ÉTAT RLS audit_sessions ===' as section;
SELECT schemaname, tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'audit_sessions';

SELECT '=== POLITIQUES RLS ===' as section;
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

SELECT '=== PERMISSIONS TABLE ===' as section;
SELECT grantee, privilege_type, is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'audit_sessions' AND grantee IN ('authenticated', 'anon', 'public')
ORDER BY grantee, privilege_type;
