# 🔍 GUIDE COMPLET - DIAGNOSTIC AUTOMATIQUE SUPABASE

## 🎯 **ÉTAPE 1 : Récupérer vos Credentials Supabase**

### **Dans Supabase Dashboard :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet ONUF
3. Allez dans **Settings** > **Database**
4. Dans la section **Connection info**, notez :
   - **Host** : `xciqkmnnrmejvrtschrh.supabase.co` (ou similaire)
   - **Database name** : `postgres`
   - **Username** : `postgres`
   - **Port** : `5432`
5. Dans **Database password**, cliquez sur **Reset password** si besoin
6. **COPIEZ LE MOT DE PASSE** qui apparaît (vous en aurez besoin)

## 🛠️ **ÉTAPE 2 : Choisir votre méthode**

### **🏆 OPTION 1 : PowerShell + psql (RECOMMANDÉE)**

#### **Installation psql :**
1. Téléchargez PostgreSQL : https://www.postgresql.org/download/windows/
2. Installez (cochez "psql" dans les composants)
3. Ajoutez psql au PATH si demandé

#### **Configuration :**
1. Ouvrez `diagnostic_auto.ps1`
2. Remplacez les valeurs :
```powershell
$SUPABASE_HOST = "xciqkmnnrmejvrtschrh.supabase.co"  # VOTRE HOST
$SUPABASE_PASSWORD = "VOTRE_VRAI_MOT_DE_PASSE"      # MOT DE PASSE DB
```

#### **Exécution :**
```powershell
# Dans PowerShell, naviguez vers votre dossier ONUF
cd "C:\Users\Monster\Documents\My Apps\ONUF\onuf"

# Exécutez le script
.\diagnostic_auto.ps1
```

---

### **🔧 OPTION 2 : Node.js (SI OPTION 1 NE MARCHE PAS)**

#### **Installation :**
```bash
# Installez la dépendance PostgreSQL
npm install pg
```

#### **Configuration :**
1. Ouvrez `diagnostic_node.js`
2. Remplacez les valeurs :
```javascript
const SUPABASE_CONFIG = {
    host: 'xciqkmnnrmejvrtschrh.supabase.co',  // VOTRE HOST
    password: 'VOTRE_VRAI_MOT_DE_PASSE',      // MOT DE PASSE DB
    // ... autres configs
};
```

#### **Exécution :**
```bash
# Dans le terminal, naviguez vers votre dossier ONUF
cd "C:\Users\Monster\Documents\My Apps\ONUF\onuf"

# Exécutez le script
node diagnostic_node.js
```

## 📊 **ÉTAPE 3 : Récupérer les résultats**

### **Le script va créer un fichier :**
- `diagnostic_result_YYYYMMDD_HHMMSS.txt` (PowerShell)
- `diagnostic_result_YYYY-MM-DDTHH-MM-SS.txt` (Node.js)

### **Méthodes pour me donner les résultats :**

#### **Option A : Copier-coller direct**
```powershell
# PowerShell : Copier dans le presse-papier
Get-Content diagnostic_result_*.txt | Set-Clipboard
# Puis Ctrl+V dans le chat
```

#### **Option B : Upload fichier**
- Glissez-déposez le fichier de résultat dans le chat Claude

#### **Option C : Lecture automatique**
- Je peux lire le fichier directement si vous me donnez le chemin complet

## 🚨 **DÉPANNAGE**

### **Erreur "psql non trouvé" :**
- Installez PostgreSQL complet
- Ou utilisez l'OPTION 2 (Node.js)

### **Erreur de connexion :**
- Vérifiez le HOST (sans https://)
- Vérifiez le mot de passe Database (pas API Key!)
- Vérifiez que le projet Supabase est actif

### **Erreur permissions :**
```powershell
# Si PowerShell bloque l'exécution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## ✅ **COMMANDES RAPIDES**

### **Tout en une fois (PowerShell) :**
```powershell
cd "C:\Users\Monster\Documents\My Apps\ONUF\onuf"
.\diagnostic_auto.ps1
Get-Content diagnostic_result_*.txt | Set-Clipboard
```

### **Tout en une fois (Node.js) :**
```bash
cd "C:\Users\Monster\Documents\My Apps\ONUF\onuf"
npm install pg
node diagnostic_node.js
```

## 🎯 **RÉSULTAT ATTENDU**

Le diagnostic va analyser :
- ✅ Configuration RLS et permissions
- ✅ Différences entre utilisateurs qui marchent/ne marchent pas  
- ✅ Structure des tables et contraintes
- ✅ Métadonnées auth.users
- ✅ Configuration Supabase spécifique

**Une fois les résultats obtenus, je pourrai identifier précisément le problème et proposer la solution définitive !** 🔍
