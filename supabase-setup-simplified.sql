-- =============================================================
-- ONUF PWA - Supabase Setup (Version Simplifiée RGPD-Free)
-- =============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================================
-- 1. PROFILES TABLE (Simplified User Management)
-- =============================================================

-- Simplified profiles without email requirement
CREATE TABLE public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Simple auth fields
  username TEXT UNIQUE NOT NULL, -- nickname/login
  password_hash TEXT NOT NULL, -- hashed password
  
  -- User info (no personal data)
  display_name TEXT, -- What shows in UI
  role TEXT CHECK (role IN ('admin', 'field_user')) DEFAULT 'field_user',
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- =============================================================
-- 2. AUDITS TABLE (Main Data)
-- =============================================================

CREATE TABLE public.audits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_text TEXT,
  location_accuracy INTEGER, -- GPS accuracy in meters
  nearby_info TEXT, -- Road, amenity info from geocoding
  
  -- Audit responses (1-4 scale)
  lighting INTEGER CHECK (lighting BETWEEN 1 AND 4),
  walkpath INTEGER CHECK (walkpath BETWEEN 1 AND 4), 
  openness INTEGER CHECK (openness BETWEEN 1 AND 4),
  feeling INTEGER CHECK (feeling BETWEEN 1 AND 4),
  people_presence INTEGER CHECK (people_presence BETWEEN 1 AND 4),
  cleanliness INTEGER CHECK (cleanliness BETWEEN 1 AND 4),
  
  -- Additional data
  comment TEXT,
  total_photos INTEGER DEFAULT 0,
  
  -- UI Language used (for future translation)
  ui_language TEXT DEFAULT 'fr' CHECK (ui_language IN ('fr', 'ar', 'en')),
  
  -- Metadata
  is_completed BOOLEAN DEFAULT true,
  device_info JSONB, -- Browser, platform info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;

-- Policies for audits
CREATE POLICY "Users can view their own audits" ON public.audits
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own audits" ON public.audits
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own audits" ON public.audits
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all audits" ON public.audits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX idx_audits_user_id ON public.audits(user_id);
CREATE INDEX idx_audits_created_at ON public.audits(created_at);
CREATE INDEX idx_audits_location ON public.audits(latitude, longitude);
CREATE INDEX idx_audits_language ON public.audits(ui_language);

-- =============================================================
-- 3. AUDIT PHOTOS TABLE
-- =============================================================

CREATE TABLE public.audit_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- File info
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  original_size INTEGER, -- Bytes
  compressed_size INTEGER, -- Bytes
  mime_type TEXT DEFAULT 'image/jpeg',
  
  -- Metadata
  upload_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_photos ENABLE ROW LEVEL SECURITY;

-- Policies for photos
CREATE POLICY "Users can view their own photos" ON public.audit_photos
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own photos" ON public.audit_photos
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all photos" ON public.audit_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_audit_photos_audit_id ON public.audit_photos(audit_id);
CREATE INDEX idx_audit_photos_user_id ON public.audit_photos(user_id);

-- =============================================================
-- 4. AUDIT SESSIONS TABLE (Progress Saves)
-- =============================================================

CREATE TABLE public.audit_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Location data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_text TEXT,
  
  -- Partial responses
  form_data JSONB NOT NULL, -- All form data as JSON
  photos_data JSONB DEFAULT '[]', -- Temporary photo data
  
  -- Metadata
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
CREATE POLICY "Users can manage their own sessions" ON public.audit_sessions
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Index
CREATE INDEX idx_audit_sessions_user_id ON public.audit_sessions(user_id);

-- =============================================================
-- 5. AUTHENTICATION FUNCTIONS
-- =============================================================

-- Function to authenticate user with username/password
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
  SELECT id, username, display_name, role, password_hash
  INTO user_record
  FROM public.profiles
  WHERE profiles.username = username_input 
    AND is_active = true;
  
  -- Check if user exists and password matches
  IF user_record.id IS NOT NULL AND 
     crypt(password_input, user_record.password_hash) = user_record.password_hash THEN
    
    -- Update last login
    UPDATE public.profiles 
    SET last_login = NOW() 
    WHERE id = user_record.id;
    
    -- Generate simple session token (you might want JWT here)
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
    -- Invalid credentials
    RETURN;
  END IF;
END;
$$;

-- Function to create user (admin only)
CREATE OR REPLACE FUNCTION public.create_field_user(
  username_input TEXT,
  password_input TEXT,
  display_name_input TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  password_encrypted TEXT;
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id::text = auth.uid()::text AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;
  
  -- Encrypt password
  password_encrypted := crypt(password_input, gen_salt('bf'));
  
  -- Create user
  INSERT INTO public.profiles (username, password_hash, display_name, role)
  VALUES (username_input, password_encrypted, display_name_input, 'field_user')
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$;

-- =============================================================
-- 6. DATABASE FUNCTIONS & TRIGGERS
-- =============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- 7. STORAGE BUCKET SETUP
-- =============================================================

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('audit-photos', 'audit-photos', false);

-- =============================================================
-- 8. SAMPLE DATA CREATION
-- =============================================================

-- Create admin user (change credentials!)
INSERT INTO public.profiles (username, password_hash, display_name, role)
VALUES (
  'admin', 
  crypt('admin123!', gen_salt('bf')), 
  'Administrateur ONUF', 
  'admin'
);

-- Create sample field users
INSERT INTO public.profiles (username, password_hash, display_name, role)
VALUES 
  ('agent01', crypt('field123!', gen_salt('bf')), 'Agent Terrain 01', 'field_user'),
  ('agent02', crypt('field123!', gen_salt('bf')), 'Agent Terrain 02', 'field_user'),
  ('agent03', crypt('field123!', gen_salt('bf')), 'Agent Terrain 03', 'field_user');

-- =============================================================
-- 9. VERIFICATION QUERIES
-- =============================================================

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Check users created
-- SELECT id, username, display_name, role, is_active, created_at 
-- FROM public.profiles 
-- ORDER BY role, username;

-- Test authentication
-- SELECT * FROM public.authenticate_user('admin', 'admin123!');
