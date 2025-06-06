-- =============================================================
-- CORRECTION - Fonction d'authentification
-- =============================================================

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.authenticate_user(TEXT, TEXT);

-- Recréer la fonction corrigée
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
  -- Find user by username (correction: spécifier explicitement la table)
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
    -- Invalid credentials - return nothing
    RETURN;
  END IF;
END;
$$;

-- Test de la fonction
SELECT * FROM public.authenticate_user('admin', 'admin123!');
