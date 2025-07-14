# 👥 Stratégie de Création des Utilisateurs Anonymes - ONUF

## 🎯 **Objectifs**
- Créer 20 utilisateurs anonymes pour RGPD
- Pattern simple et mémorisable
- Pas d'emails réels
- Synchronisation parfaite auth.users ↔ profiles

## 📋 **Pattern Proposé**

### **Noms d'utilisateur :**
```
obs01, obs02, obs03, ..., obs20
```

### **Mots de passe :**
```
onuf2025-01, onuf2025-02, onuf2025-03, ..., onuf2025-20
```

### **Emails factices :**
```
obs01@onuf.local, obs02@onuf.local, ..., obs20@onuf.local
```

## 🚀 **Méthodes de Création**

### **Méthode 1 : Script SQL Automatisé (RECOMMANDÉ)**

#### **Avantages :**
- ✅ UUIDs synchronisés automatiquement
- ✅ Rapide (1 seule exécution)
- ✅ Pas d'erreurs manuelles

#### **Inconvénients :**
- ⚠️ Accès direct à auth.users (plus technique)

### **Méthode 2 : Dashboard + SQL**

#### **Avantages :**
- ✅ Plus sûr (utilise l'interface Supabase)
- ✅ Validation automatique

#### **Inconvénients :**
- ❌ 20 créations manuelles
- ❌ Mise à jour profiles requise après

### **Méthode 3 : Script Node.js**

#### **Avantages :**
- ✅ Utilise l'API officielle Supabase
- ✅ Le plus sûr
- ✅ Automatisable

#### **Inconvénients :**
- ❌ Nécessite setup Node.js
- ❌ Plus complexe

## 🎯 **Recommandation**

**Méthode 1 (Script SQL)** car :
1. Vous maîtrisez déjà SQL
2. Création rapide et fiable
3. Contrôle total des UUIDs

## 📊 **Répartition suggérée**

### **Par rôles :**
- `obs01` à `obs15` : field_user (observateurs terrain)
- `obs16` à `obs20` : admin (superviseurs)

### **Par zones géographiques :**
- `obs01` à `obs05` : Zone Nord Agadir
- `obs06` à `obs10` : Zone Centre Agadir  
- `obs11` à `obs15` : Zone Sud Agadir
- `obs16` à `obs20` : Superviseurs (toutes zones)

## 🔐 **Sécurité RGPD**

### **Anonymisation :**
- Aucun nom réel dans username
- Emails factices (@onuf.local)
- Pas de metadata personnelle

### **Documentation :**
- Créer une liste de correspondance séparée
- Distribuer les credentials individuellement
- Pas de stockage centralisé des mots de passe

## 📝 **Prochaine étape**

Choisir la méthode et je fournirai le script complet correspondant.
