# 🔐 Stratégies de Mots de Passe Sécurisés - ONUF

## 🚨 **Problème Identifié**
Pattern actuel `onuf2025-XX` = **TRÈS PRÉVISIBLE** 
- obs16 connaît `onuf2025-16` → devine facilement `onuf2025-17`, `onuf2025-18`, etc.
- **RISQUE MAJEUR** pour la sécurité des données d'audit

## 🎯 **Stratégies Sécurisées**

### **🌟 STRATÉGIE 1 : Mots + Nombres Aléatoires (RECOMMANDÉE)**

**Principe :** Mots simples en français/arabe + nombres aléatoires à 3 chiffres

**Exemples :**
- `obs01` → `Soleil-847` 
- `obs02` → `Lune-392`
- `obs03` → `Mer-156`
- `obs04` → `Atlas-673`
- `obs05` → `Sable-924`

**Avantages :**
- ✅ **Impossible à deviner** (nombres aléatoires)
- ✅ **Facile à mémoriser** (mot + nombre)
- ✅ **Culturellement approprié** (mots locaux)
- ✅ **Sécurisé** (aucun pattern détectable)

---

### **🔧 STRATÉGIE 2 : Hash SHA256 Tronqué**

**Principe :** Hash(username + salt secret) → 8 premiers caractères

**Exemples :**
- `obs01` → `A7k9mX2p`
- `obs02` → `N4j8vL1z`
- `obs03` → `R6m3qC9t`

**Avantages :**
- ✅ **Totalement imprévisible**
- ✅ **Générés automatiquement**
- ✅ **Aucun pattern humain**

**Inconvénients :**
- ❌ **Difficiles à mémoriser**
- ❌ **Nécessitent d'être écrits**

---

### **🎲 STRATÉGIE 3 : Générateur Aléatoire Sécurisé**

**Principe :** Mots de passe complètement aléatoires de 8-10 caractères

**Exemples :**
- `obs01` → `Kp7nM4qL`
- `obs02` → `Vx9jR2sQ`
- `obs03` → `Hm8kP5tN`

**Avantages :**
- ✅ **Maximum de sécurité**
- ✅ **Impossible à prédire**

**Inconvénients :**
- ❌ **Très difficiles à mémoriser**
- ❌ **Risque d'oubli élevé**

---

### **🌍 STRATÉGIE 4 : Mots Locaux + Codes**

**Principe :** Mots berbères/arabes + codes alphanumériques courts

**Exemples :**
- `obs01` → `Agadir-K7m`
- `obs02` → `Tamazirt-P3q`
- `obs03` → `Amellal-N8x`
- `obs04` → `Azref-M2v`

**Avantages :**
- ✅ **Identité culturelle forte**
- ✅ **Faciles à retenir localement**
- ✅ **Sécurisés** (codes aléatoires)

---

## 📊 **Recommandation**

### **🏆 STRATÉGIE 1 : Mots + Nombres Aléatoires**

**Meilleur équilibre** entre :
- 🔐 **Sécurité** (impossible à deviner)
- 🧠 **Mémorabilité** (mot simple + nombre)
- 🌍 **Praticité** (facile à communiquer)

### **📋 Liste de Mots Proposés :**

**Français/Locaux :**
- Soleil, Lune, Mer, Atlas, Sable, Oasis, Palme, Rose, Ciel, Vent
- Agadir, Souss, Massa, Inezgane, Tiznit, Taroudant, Igherm, Tafraout

**Nombres :** 3 chiffres aléatoires (100-999)

## 🚀 **Prochaine Étape**

Choisir la stratégie et je génère :
1. **Script SQL** de mise à jour des mots de passe
2. **Nouveau fichier credentials** avec mots de passe sécurisés
3. **Guide de distribution** pour les observateurs

---

## ⚠️ **Note Sécurité**

Une fois la stratégie choisie, **recommander aux observateurs** :
- ✅ **Changer le mot de passe** à la première connexion
- ✅ **Ne jamais partager** leurs identifiants
- ✅ **Signaler** toute suspicion de compromission
