-- ======================================================================
-- MODIFICATIONS BASE DE DONNÉES - QUESTIONS D'AUDIT
-- Date : 14/07/2025
-- Description : Transformation de la question "formal_security" en "stray_dogs"
--               et ajout de la question "shade"
-- ======================================================================

-- IMPORTANT : La colonne "formal_security" dans la table "audits" sera réutilisée
-- pour stocker les données de "stray_dogs" afin d'éviter de perdre les données existantes

-- 1. RENOMMER LA COLONNE formal_security EN stray_dogs
-- Note : Cette opération conserve toutes les données existantes
ALTER TABLE audits 
RENAME COLUMN formal_security TO stray_dogs;

-- 2. AJOUTER LA NOUVELLE COLONNE shade
ALTER TABLE audits 
ADD COLUMN shade INTEGER CHECK (shade >= 1 AND shade <= 4);

-- 3. METTRE À JOUR LES COMMENTAIRES DES COLONNES
COMMENT ON COLUMN audits.stray_dogs IS 'Présence de chiens errants (1=Beaucoup, 2=Quelques-uns, 3=Peu, 4=Aucun)';
COMMENT ON COLUMN audits.shade IS 'Présence d''ombrage (1=Aucun, 2=Peu, 3=Modéré, 4=Abondant)';

-- 4. OPTIONNEL : Si vous voulez réinitialiser les données existantes de formal_security
-- ATTENTION : Ceci effacera les données existantes !
-- UPDATE audits SET stray_dogs = NULL WHERE stray_dogs IS NOT NULL;

-- 5. VÉRIFICATION
-- Pour vérifier que les modifications ont été appliquées :
/*
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    check_constraint
FROM information_schema.columns 
WHERE table_name = 'audits' 
AND column_name IN ('stray_dogs', 'shade')
ORDER BY ordinal_position;
*/

-- 6. FONCTION DE MIGRATION (si nécessaire)
-- Cette fonction peut être utilisée pour migrer les données si besoin
/*
CREATE OR REPLACE FUNCTION migrate_audit_questions()
RETURNS void AS $$
BEGIN
    -- Logique de migration si nécessaire
    -- Par exemple, définir des valeurs par défaut pour la nouvelle colonne
    UPDATE audits 
    SET shade = 2 -- Valeur par défaut "Peu"
    WHERE shade IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration
SELECT migrate_audit_questions();
*/

-- ======================================================================
-- NOTES IMPORTANTES :
-- 1. La colonne "formal_security" est renommée en "stray_dogs" pour conserver les données
-- 2. Une nouvelle colonne "shade" est ajoutée
-- 3. Les applications clientes doivent être mises à jour pour utiliser les nouveaux noms
-- 4. Les traductions dans l'interface ont déjà été mises à jour
-- ======================================================================
