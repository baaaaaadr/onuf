-- 🔧 SOLUTION RAPIDE - TEST DÉSACTIVATION RLS TEMPORAIRE

-- ========================================
-- TEST 1 : DÉSACTIVER RLS TEMPORAIREMENT
-- ========================================

-- Désactiver RLS sur audit_sessions pour voir si le problème vient de là
ALTER TABLE audit_sessions DISABLE ROW LEVEL SECURITY;

-- Tester maintenant dans l'app avec obs01
-- Si ça marche, le problème vient des politiques RLS

-- ========================================
-- REMETTRE RLS (À FAIRE APRÈS TEST)
-- ========================================

-- NE PAS OUBLIER DE REMETTRE RLS APRÈS LE TEST !
-- ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;
