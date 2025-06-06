-- =============================================================
-- CORRECTION COMPLÈTE - Authentification Supabase ONUF
-- =============================================================

-- 1. ACTIVER L'EXTENSION PGCRYPTO (ESSENTIEL !)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. NETTOYER LES DONNÉES EXISTANTES
DELETE FROM public.profiles WHERE username IN ('admin', 'agent01', 'agent02', 'agent03');

-- 3. RECRÉER LES UTILISATEURS AVEC DES HASH VALIDES
INSERT INTO public.profiles (username, password_hash, display_name, role)
VALUES 
  -- Admin user
  ('admin', crypt('admin123!', gen_salt('bf')), 'Administrateur ONUF', 'admin'),
  
  -- Field agents
  ('agent01', crypt('field123!', gen_salt('bf')), 'Agent Terrain 01', 'field_user'),
  ('agent02', crypt('field123!', gen_salt('bf')), 'Agent Terrain 02', 'field_user'),
  ('agent03', crypt('field123!', gen_salt('bf')), 'Agent Terrain 03', 'field_user');

-- 4. CORRECTION DE LA FONCTION D'AUTHENTIFICATION
DROP FUNCTION IF EXISTS public.authenticate_user(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.authenticate_user(
  username_input TEXT,
  password_input TEXT
) RETURNS TABLE(
  user_id UUID,
  username TEXT,
  display_name TEXT,
  role TEXT,
  token TEXT
) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  jwt_token TEXT;
BEGIN
  -- Find user by username
  SELECT p.id, p.username, p.display_name, p.role, p.password_hash
  INTO user_record
  FROM public.profiles p
  WHERE p.username = username_input 
    AND p.is_active = true;
  
  -- Check if user exists and password matches
  IF user_record.id IS NOT NULL AND 
     crypt(password_input, user_record.password_hash) = user_record.password_hash THEN
    
    -- Update last login
    UPDATE public.profiles 
    SET last_login = NOW() 
    WHERE id = user_record.id;
    
    -- Generate simple session token
    jwt_token := encode(
      ('{"user_id":"' || user_record.id || '","exp":' || 
       extract(epoch from (now() + interval '24 hours')) || '}')::bytea, 
      'base64'
    );
    
    -- Return user info
    RETURN QUERY SELECT 
      user_record.id,
      user_record.username,
      user_record.display_name,
      user_record.role,
      jwt_token;
  ELSE
    -- Return empty result if authentication fails
    RETURN;
  END IF;
  
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    RAISE WARNING 'Authentication error: %', SQLERRM;
    RETURN;
END;
$$;

-- 5. TESTS DE VÉRIFICATION
DO $$
DECLARE
  test_result RECORD;
BEGIN
  -- Test de l'authentification admin
  SELECT * INTO test_result 
  FROM public.authenticate_user('admin', 'admin123!');
  
  IF test_result.user_id IS NOT NULL THEN
    RAISE NOTICE 'SUCCESS: Admin authentication works! User ID: %', test_result.user_id;
  ELSE
    RAISE NOTICE 'ERROR: Admin authentication failed!';
  END IF;
  
  -- Test de l'authentification agent
  SELECT * INTO test_result 
  FROM public.authenticate_user('agent01', 'field123!');
  
  IF test_result.user_id IS NOT NULL THEN
    RAISE NOTICE 'SUCCESS: Agent authentication works! User ID: %', test_result.user_id;
  ELSE
    RAISE NOTICE 'ERROR: Agent authentication failed!';
  END IF;
END $$;

-- 6. AFFICHER LES UTILISATEURS CRÉÉS
SELECT 
  id,
  username, 
  display_name, 
  role, 
  is_active,
  created_at,
  CASE 
    WHEN password_hash LIKE '$2a$%' OR password_hash LIKE '$2b$%' THEN 'Hash valide (bcrypt)'
    ELSE 'Hash invalide'
  END as password_status
FROM public.profiles 
ORDER BY role DESC, username;

-- 7. TEST FINAL MANUEL
-- SELECT * FROM public.authenticate_user('admin', 'admin123!');
-- SELECT * FROM public.authenticate_user('agent01', 'field123!');
