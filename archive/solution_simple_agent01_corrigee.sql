-- 🔧 SOLUTION SIMPLE CORRIGÉE : Recréer auth.users avec le bon UUID

-- ========================================
-- 1️⃣ SUPPRIMER L'UTILISATEUR AUTH.USERS ACTUEL
-- ========================================
-- Supprimer agent01@onuf.local avec le mauvais UUID
DELETE FROM auth.users 
WHERE email = 'agent01@onuf.local' 
AND id = 'e6ebe9ce-59c7-4fbc-a5f8-55cec27cfed8';

-- ========================================
-- 2️⃣ RECRÉER AVEC LE BON UUID (CORRIGÉ)
-- ========================================
-- Créer agent01 dans auth.users avec l'UUID qui existe déjà dans profiles
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
    recovery_token
    -- confirmed_at RETIRÉ (colonne générée automatiquement)
) VALUES (
    'a46d3190-f20e-4790-97fa-1914d57be153',  -- LE BON UUID !
    'agent01@onuf.local',
    crypt('onuf2025-agent01', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "agent01", "display_name": "Agent Terrain 01"}',
    '',
    ''
    -- confirmed_at sera généré automatiquement
);

-- ========================================
-- 3️⃣ VÉRIFICATION FINALE
-- ========================================
-- Vérifier que tout est synchronisé maintenant
SELECT 'SYNCHRONISATION CHECK' as status;

SELECT 
    p.username,
    p.id as profiles_uuid,
    au.email,
    au.id as auth_uuid,
    CASE 
        WHEN p.id = au.id THEN '✅ SYNC' 
        ELSE '❌ DIFFÉRENT' 
    END as sync_status
FROM profiles p
LEFT JOIN auth.users au ON p.username = SPLIT_PART(au.email, '@', 1)
WHERE p.username = 'agent01';

-- Vérifier les données liées
SELECT 'DONNÉES LIÉES' as status;
SELECT 
    'audits' as table_name,
    COUNT(*) as count,
    user_id
FROM audits 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153'
GROUP BY user_id
UNION ALL
SELECT 
    'audit_photos' as table_name,
    COUNT(*) as count,
    user_id
FROM audit_photos 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153'
GROUP BY user_id;

-- ========================================
-- 4️⃣ TEST DE CONNEXION
-- ========================================
-- Vérifier que l'utilisateur peut se connecter
SELECT 'TEST DE CONNEXION' as status;
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
WHERE email = 'agent01@onuf.local';
