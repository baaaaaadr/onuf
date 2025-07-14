-- 🔧 SOLUTION ERREUR 406 - SUPPRESSION CONTRAINTE UNIQUE

-- ========================================
-- PROBLÈME IDENTIFIÉ
-- ========================================
-- La contrainte UNIQUE(user_id) sur audit_sessions empêche :
-- 1. D'avoir plusieurs audits par utilisateur
-- 2. L'API REST de fonctionner correctement pour les utilisateurs sans audit

-- ========================================
-- SOLUTION 1 : SUPPRIMER LA CONTRAINTE UNIQUE (RECOMMANDÉ)
-- ========================================

-- Supprimer la contrainte user_id unique
ALTER TABLE audit_sessions DROP CONSTRAINT audit_sessions_user_id_key;

-- Vérification que la contrainte est supprimée
SELECT conname, contype, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass;

-- ========================================
-- SOLUTION 2 : TEST CRÉATION AUDIT_SESSION VIDE (OPTIONNEL)
-- ========================================

-- Créer des audit_sessions vides pour les nouveaux utilisateurs (pour test)
INSERT INTO audit_sessions (user_id, form_data, photos_data) 
SELECT id, '{}', '[]'
FROM profiles 
WHERE username LIKE 'obs%' 
AND id NOT IN (SELECT DISTINCT user_id FROM audit_sessions WHERE user_id IS NOT NULL);

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================

-- Vérifier que les utilisateurs ont maintenant accès
SELECT p.username, COUNT(a.*) as nb_audits
FROM profiles p
LEFT JOIN audit_sessions a ON p.id = a.user_id
WHERE p.username IN ('admin', 'agent01', 'obs01', 'obs02')
GROUP BY p.username
ORDER BY p.username;
