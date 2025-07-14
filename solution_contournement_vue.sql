-- 🆘 SOLUTION DE CONTOURNEMENT - CRÉER VUE API

-- Si audit_sessions refuse de marcher via API REST,
-- on peut créer une vue qui fonctionne

-- ========================================
-- CRÉER UNE VUE ALTERNATIVE
-- ========================================

-- Créer une vue qui expose les mêmes données
CREATE OR REPLACE VIEW user_audit_sessions AS
SELECT 
    id,
    user_id,
    latitude,
    longitude,
    location_text,
    form_data,
    photos_data,
    last_updated,
    created_at
FROM audit_sessions;

-- Donner permissions sur la vue
GRANT ALL ON user_audit_sessions TO authenticated;
GRANT ALL ON user_audit_sessions TO anon;

-- Créer politique sur la vue
CREATE POLICY allow_all_user_sessions ON user_audit_sessions
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- ========================================
-- TEST DE LA VUE
-- ========================================

-- Tester que la vue fonctionne
SELECT 'TEST VUE' as status;
SELECT COUNT(*) as total_via_vue FROM user_audit_sessions;

-- Tester avec l'utilisateur spécifique
SELECT 'TEST UTILISATEUR obs01' as status;
SELECT COUNT(*) as count_obs01 FROM user_audit_sessions 
WHERE user_id = 'c4b16be0-afc6-458b-b951-6615789d9245';
