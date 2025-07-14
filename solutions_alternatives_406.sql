-- 🔧 SOLUTIONS ALTERNATIVES ERREUR 406 API REST

-- ========================================
-- SOLUTION 1 : RECRÉER LA POLITIQUE RLS
-- ========================================

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS allow_all_sessions ON audit_sessions;

-- Créer une nouvelle politique plus explicite
CREATE POLICY allow_authenticated_sessions ON audit_sessions
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Vérification
SELECT policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

-- ========================================
-- SOLUTION 2 : POLITIQUE BASÉE SUR AUTH.UID()
-- ========================================

-- Alternative : Politique basée sur l'utilisateur connecté
DROP POLICY IF EXISTS allow_authenticated_sessions ON audit_sessions;

CREATE POLICY user_own_sessions ON audit_sessions
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- SOLUTION 3 : PERMISSIONS GRANT EXPLICITES
-- ========================================

-- Donner permissions explicites au rôle authenticated
GRANT ALL ON audit_sessions TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ========================================
-- SOLUTION 4 : REFRESH SCHEMA SUPABASE
-- ========================================

-- Forcer le refresh du schéma API (Supabase spécifique)
NOTIFY pgrst, 'reload schema';

-- ========================================
-- SOLUTION 5 : DÉSACTIVER RLS TEMPORAIREMENT POUR CONFIRMER
-- ========================================

-- Test final : désactiver complètement RLS pour voir si c'est la cause
-- ALTER TABLE audit_sessions DISABLE ROW LEVEL SECURITY;
-- (Tester dans l'app, puis remettre RLS avec une politique qui marche)

-- ========================================
-- VÉRIFICATION APRÈS CHAQUE SOLUTION
-- ========================================

SELECT 'VÉRIFICATION FINALE' as status;
SELECT policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

SELECT 'PERMISSIONS AUTHENTICATED' as status;
SELECT 
    CASE WHEN has_table_privilege('authenticated', 'audit_sessions', 'SELECT') THEN 'SELECT: OUI' ELSE 'SELECT: NON' END,
    CASE WHEN has_table_privilege('authenticated', 'audit_sessions', 'INSERT') THEN 'INSERT: OUI' ELSE 'INSERT: NON' END;
