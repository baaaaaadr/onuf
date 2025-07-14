# 🔍 Knowledge Base - Problèmes Supabase Résolus

## 🚨 **Erreur 406 "Not Acceptable" sur audit_sessions**

### **📊 Symptômes**
- Utilisateurs obs01, obs02... → Erreur 406 sur GET audit_sessions  
- Utilisateurs admin, agent01 → Fonctionnent normalement
- Authentification réussie mais accès aux données échoue

### **🎯 Cause Identifiée**
**Contrainte `UNIQUE (user_id)` sur table `audit_sessions`**

```sql
-- Contrainte problématique
audit_sessions_user_id_key | u | UNIQUE (user_id)
```

### **🔍 Analyse Technique**
1. **admin** avait déjà des audit_sessions → Accès OK
2. **Nouveaux utilisateurs** (obs01-obs20) → 0 audit_sessions → Erreur 406
3. **Contrainte UNIQUE** empêche plusieurs audits par utilisateur
4. **API REST Supabase** retourne 406 pour requêtes sur tables vides avec certaines contraintes

### **✅ Solution Appliquée**
```sql
-- Suppression de la contrainte unique
ALTER TABLE audit_sessions DROP CONSTRAINT audit_sessions_user_id_key;
```

### **📈 Résultat**
- ✅ Tous les utilisateurs peuvent maintenant accéder à audit_sessions
- ✅ Possibilité d'avoir plusieurs audits par utilisateur  
- ✅ Plus d'erreur 406

---

## 🔐 **Gestion Utilisateurs Anonymes - Stratégie Manara**

### **🎯 Pattern de Mots de Passe Sécurisés**
**Formule :** `Manara-(90-X)` où X = numéro observateur

**Exemples :**
- obs01 → Manara-89
- obs10 → Manara-80  
- obs20 → Manara-70

### **🛡️ Avantages Sécurité**
- ✅ **Non-prévisible** (formule cachée)
- ✅ **Culturellement approprié** (Manara = phare en arabe)
- ✅ **Facile à calculer** pour l'admin
- ✅ **Impossible à deviner** sans connaître la formule

### **👥 Structure Utilisateurs**
- **obs01-obs15** : field_user (observateurs terrain)
- **obs16-obs20** : admin (superviseurs)
- **Emails** : obs01@onuf.local (factices, conformité RGPD)

---

## 🗄️ **Structure Database Critique**

### **🔗 Foreign Keys Importantes**
```sql
-- audit_sessions → profiles
audit_sessions_user_id_fkey | FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE

-- Synchronisation requise : auth.users ↔ profiles (même UUID)
```

### **🔒 Politiques RLS**
```sql
-- Policy permissive sur audit_sessions
allow_all_sessions | PERMISSIVE | {public} | ALL | true | true
```

### **⚠️ Points d'Attention**
1. **Synchronisation UUID** : auth.users.id DOIT = profiles.id
2. **Contraintes UNIQUE** : Vérifier impact sur API REST
3. **Nouveaux utilisateurs** : Tester accès données avant déploiement

---

## 🛠️ **Outils de Diagnostic**

### **📋 Scripts Utiles**
- `diagnostic_complet.sql` : Diagnostic exhaustif Supabase
- `solution_contrainte_unique.sql` : Correction erreur 406
- `mise_a_jour_mdp_manara.sql` : Mise à jour mots de passe sécurisés

### **🔍 Requêtes de Vérification**
```sql
-- Vérifier synchronisation utilisateurs
SELECT p.username, 
       CASE WHEN au.id IS NOT NULL THEN '✅ SYNC' ELSE '❌ MANQUANT' END as auth_status
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.username;

-- Vérifier accès audit_sessions  
SELECT p.username, COUNT(a.*) as nb_audits
FROM profiles p
LEFT JOIN audit_sessions a ON p.id = a.user_id
GROUP BY p.username
ORDER BY p.username;
```

---

## 📚 **Leçons Apprises**

### **🎯 Erreurs 406 Supabase**
- Pas toujours liées à l'authentification
- Souvent causées par contraintes DB ou données manquantes
- Diagnostic complet nécessaire avant modification RLS

### **🔐 Sécurité Mots de Passe**
- Éviter patterns prévisibles (increment simple)
- Utiliser formules mathématiques cachées
- Préférer mots culturellement appropriés

### **🗄️ Design Database**
- Contraintes UNIQUE : Impact sur API REST
- Foreign keys CASCADE : Simplifier maintenance
- RLS permissif : Commencer simple, raffiner ensuite
