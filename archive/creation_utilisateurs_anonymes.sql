-- 🎯 SCRIPT DE CRÉATION AUTOMATIQUE - 20 UTILISATEURS ANONYMES ONUF
-- ⚠️ IMPORTANT : Exécutez ce script section par section pour vérifier chaque étape

-- ========================================
-- 1️⃣ CORRECTION AGENT01 (si besoin)
-- ========================================
-- Mettre à jour agent01 pour correspondre au nouvel UUID auth.users
UPDATE profiles 
SET id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
WHERE username = 'agent01';

-- Mettre à jour les audit_sessions existantes
UPDATE audit_sessions 
SET user_id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8'
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- ========================================
-- 2️⃣ CRÉATION DES 20 UTILISATEURS ANONYMES
-- ========================================

-- Fonction temporaire pour générer les utilisateurs
DO $$
DECLARE 
    user_number INTEGER;
    new_uuid UUID;
    username_val TEXT;
    password_val TEXT;
    email_val TEXT;
    display_name_val TEXT;
    role_val TEXT;
BEGIN
    -- Boucle pour créer les utilisateurs obs01 à obs20
    FOR user_number IN 1..20 LOOP
        -- Générer un nouvel UUID
        new_uuid := gen_random_uuid();
        
        -- Définir les valeurs
        username_val := 'obs' || LPAD(user_number::TEXT, 2, '0');
        password_val := 'onuf2025-' || LPAD(user_number::TEXT, 2, '0');
        email_val := username_val || '@onuf.local';
        display_name_val := 'Observateur ' || LPAD(user_number::TEXT, 2, '0');
        
        -- Définir le rôle (obs01-15 = field_user, obs16-20 = admin)
        IF user_number <= 15 THEN
            role_val := 'field_user';
        ELSE
            role_val := 'admin';
        END IF;
        
        -- Créer dans auth.users
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            confirmation_token,
            recovery_token,
            confirmed_at
        ) VALUES (
            new_uuid,
            email_val,
            crypt(password_val, gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"username": "' || username_val || '", "display_name": "' || display_name_val || '"}',
            '',
            '',
            NOW()
        );
        
        -- Créer dans profiles (avec le même UUID)
        INSERT INTO profiles (
            id,
            username,
            password_hash,
            display_name,
            role,
            is_active,
            created_at,
            updated_at,
            last_login
        ) VALUES (
            new_uuid,
            username_val,
            crypt(password_val, gen_salt('bf')),
            display_name_val,
            role_val,
            true,
            NOW(),
            NOW(),
            NOW()
        );
        
        -- Log de progression
        RAISE NOTICE 'Créé utilisateur: % (UUID: %)', username_val, new_uuid;
    END LOOP;
    
    RAISE NOTICE '✅ TERMINÉ : 20 utilisateurs anonymes créés avec succès !';
END $$;

-- ========================================
-- 3️⃣ VÉRIFICATION
-- ========================================

-- Vérifier que tous les utilisateurs sont créés
SELECT '=== VÉRIFICATION PROFILES ===' as section;
SELECT username, role, is_active, created_at 
FROM profiles 
WHERE username LIKE 'obs%' 
ORDER BY username;

-- Vérifier la correspondance auth.users
SELECT '=== VÉRIFICATION AUTH SYNC ===' as section;
SELECT p.username, p.role, 
       CASE WHEN au.id IS NOT NULL THEN '✅ SYNC' ELSE '❌ MANQUANT' END as auth_status
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.username LIKE 'obs%'
ORDER BY p.username;

-- Compter le total
SELECT '=== RÉSUMÉ ===' as section;
SELECT 
    'TOTAL OBSERVATEURS' as type,
    COUNT(*) as count
FROM profiles 
WHERE username LIKE 'obs%'
UNION ALL
SELECT 
    'FIELD_USERS' as type,
    COUNT(*) as count
FROM profiles 
WHERE username LIKE 'obs%' AND role = 'field_user'
UNION ALL
SELECT 
    'ADMINS' as type,
    COUNT(*) as count
FROM profiles 
WHERE username LIKE 'obs%' AND role = 'admin';
