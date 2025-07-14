# 🔍 Guide d'Investigation - Erreur Supabase 406 avec agent01

## 🎯 Objectif
Comprendre pourquoi l'utilisateur `agent01` reçoit une erreur 406 sur `audit_sessions` mais pas `admin`.

## 📋 Tests à effectuer dans Supabase SQL Editor

### 1️⃣ **Vérifier les permissions utilisateur**
```sql
-- Vérifier le profil de agent01
SELECT * FROM profiles WHERE username = 'agent01';

-- Vérifier le profil de admin
SELECT * FROM profiles WHERE username = 'admin';

-- Comparer les rôles
SELECT username, role, is_active FROM profiles 
WHERE username IN ('agent01', 'admin');
```

### 2️⃣ **Tester l'accès direct à audit_sessions**
```sql
-- Test avec l'ID de agent01 spécifiquement
SELECT * FROM audit_sessions 
WHERE user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';

-- Vérifier si l'UUID est valide
SELECT 'a46d3190-f20e-4790-97fa-1914d57be153'::uuid;

-- Comparer avec l'admin
SELECT * FROM audit_sessions 
WHERE user_id = 'b179b9a0-26bd-45a7-b01a-fd014ed404ed';
```

### 3️⃣ **Analyser les politiques RLS en détail**
```sql
-- Lister toutes les politiques sur audit_sessions
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'audit_sessions';

-- Vérifier les permissions de la table
SELECT table_name, privilege_type, grantee 
FROM information_schema.table_privileges 
WHERE table_name = 'audit_sessions';
```

### 4️⃣ **Tester la fonction RLS**
```sql
-- Simuler la connexion agent01 (si possible)
SET LOCAL rls.user_id = 'a46d3190-f20e-4790-97fa-1914d57be153';
SELECT * FROM audit_sessions;

-- Reset
RESET rls.user_id;
```

### 5️⃣ **Vérifier les contraintes de la table**
```sql
-- Contraintes et index
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'audit_sessions'::regclass;

-- Structure complète
\d audit_sessions
```

## 🚨 **Causes probables identifiées**

### **A. Problème de rôle utilisateur**
- `agent01` n'a peut-être pas le bon rôle
- Vérifiez `profiles.role` et `profiles.is_active`

### **B. Politique RLS trop restrictive**
- Même si elle dit `qual: "true"`, il pourrait y avoir une sous-condition

### **C. Problème de foreign key**
- L'UUID de `agent01` pourrait ne pas exister dans `auth.users`

### **D. Cache/Session**
- Problème de cache côté client ou serveur

## 🔧 **Solutions suggérées**

### **Si c'est un problème de rôle :**
```sql
UPDATE profiles 
SET role = 'field_user', is_active = true 
WHERE username = 'agent01';
```

### **Si c'est un problème RLS :**
```sql
-- Temporairement désactiver RLS pour tester
ALTER TABLE audit_sessions DISABLE ROW LEVEL SECURITY;
-- TEST ICI
ALTER TABLE audit_sessions ENABLE ROW LEVEL SECURITY;
```

### **Si c'est un problème d'UUID :**
```sql
-- Vérifier que l'utilisateur existe dans auth.users
SELECT id, email FROM auth.users 
WHERE id = 'a46d3190-f20e-4790-97fa-1914d57be153';
```

## 📊 **Prochaines étapes**

1. Exécutez les requêtes ci-dessus
2. Comparez les résultats entre `agent01` et `admin`
3. Partagez les résultats pour diagnostic précis
4. Implémentez la solution appropriée

---

💡 **Astuce :** L'erreur 406 "Not Acceptable" avec Supabase est souvent liée aux politiques RLS ou aux permissions utilisateur, pas à la structure de la requête elle-même.
