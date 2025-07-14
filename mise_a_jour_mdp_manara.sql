-- 🔐 MISE À JOUR SÉCURISÉE DES MOTS DE PASSE - FORMULE MANARA
-- Formule : Manara-(90-X) où X = numéro observateur

-- ========================================
-- MISE À JOUR DES MOTS DE PASSE 
-- ========================================

DO $$
DECLARE 
    user_number INTEGER;
    username_val TEXT;
    new_password TEXT;
    password_number INTEGER;
BEGIN
    -- Boucle pour mettre à jour obs01 à obs20
    FOR user_number IN 1..20 LOOP
        username_val := 'obs' || LPAD(user_number::TEXT, 2, '0');
        password_number := 90 - user_number;  -- FORMULE : 90 - X
        new_password := 'Manara-' || password_number::TEXT;
        
        -- Mettre à jour auth.users
        UPDATE auth.users 
        SET encrypted_password = crypt(new_password, gen_salt('bf'))
        WHERE email = username_val || '@onuf.local';
        
        -- Mettre à jour profiles
        UPDATE profiles 
        SET password_hash = crypt(new_password, gen_salt('bf'))
        WHERE username = username_val;
        
        -- Log de progression
        RAISE NOTICE 'MàJ %: %', username_val, new_password;
    END LOOP;
    
    RAISE NOTICE '✅ TERMINÉ : 20 mots de passe mis à jour avec la formule Manara !';
END $$;

-- ========================================
-- VÉRIFICATION
-- ========================================

-- Test de quelques utilisateurs pour vérifier
SELECT '=== VÉRIFICATION ÉCHANTILLON ===' as section;
SELECT username, 'Manara-' || (90 - CAST(SUBSTRING(username FROM 4) AS INTEGER))::TEXT as mot_de_passe_attendu
FROM profiles 
WHERE username IN ('obs01', 'obs05', 'obs10', 'obs15', 'obs20')
ORDER BY username;

-- Compter le total mis à jour
SELECT '=== RÉSUMÉ ===' as section;
SELECT COUNT(*) as utilisateurs_totaux
FROM profiles 
WHERE username LIKE 'obs%';
