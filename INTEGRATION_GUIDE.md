# 🚀 Instructions d'Intégration Supabase

## 📋 **Étapes à Suivre**

### 1. **Setup Supabase**
```bash
# Dans ton projet Supabase, va dans SQL Editor et exécute :
# Le fichier : supabase-setup-simplified.sql
```

### 2. **Installation Dépendances**
```bash
npm install @supabase/supabase-js
```

### 3. **Configuration Environment**
```bash
# Copier le template
cp .env.example .env

# Éditer .env avec tes credentials Supabase :
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ta-clé-publique-ici
```

### 4. **Test de Login**
Credentials de test créés dans la DB :
- **Admin** : `admin` / `admin123!`
- **Agent** : `agent01` / `field123!`

### 5. **Remplacement de App.vue**
```bash
# Backup ton App.vue actuel
mv src/App.vue src/App-old.vue

# Utiliser la version avec auth
mv src/AppWithAuth.vue src/App.vue
```

### 6. **Modification AuditFormView**
Ajouter ces imports en haut de `src/views/AuditFormView.vue` :

```javascript
// Ajouter après les imports existants
import { useAuth } from '@/composables/useSupabase'
import { useAudits } from '@/composables/useAudits'

// Dans script setup, ajouter :
const { currentUser, isAuthenticated } = useAuth()
const { saveAudit, saveProgress: saveProgressCloud } = useAudits()

// Modifier la fonction submitAudit :
const submitAudit = async () => {
  addUserAction('🚀 Tentative soumission audit');
  
  if (!isFormValid.value) {
    addUserAction('⚠️ Échec: questions incomplètes');
    alert('⚠️ Veuillez répondre à toutes les questions obligatoires.');
    return;
  }

  // Sauvegarder localement d'abord
  saveLocally();
  
  // Puis essayer de sauvegarder en cloud si connecté
  if (isAuthenticated.value && navigator.onLine) {
    addUserAction('☁️ Sauvegarde cloud en cours...');
    const result = await saveAudit(formData.value);
    if (result.success) {
      addUserAction('✅ Audit sauvegardé en cloud');
    } else {
      addUserAction('⚠️ Échec sauvegarde cloud (restera local)');
    }
  }
  
  auditCompleted.value = true;
  showSuccessDialog.value = true;
};

// Modifier saveProgress pour inclure le cloud :
const saveProgress = () => {
  // Sauvegarde locale existante
  const progressData = {
    ...formData.value,
    isProgress: true,
    lastUpdate: new Date().toISOString()
  };
  
  localStorage.setItem('audit_progress', JSON.stringify(progressData));
  lastSaved.value = new Date().toLocaleTimeString();
  addDebugLog('🔄 Progrès sauvegardé (temporaire)', 'info');
  addUserAction('💾 Sauvegarde automatique du progrès');
  
  // Sauvegarde cloud si connecté
  if (isAuthenticated.value && navigator.onLine) {
    saveProgressCloud(formData.value);
  }
};
```

## 🎯 **Fonctionnalités Activées**

### ✅ **Immédiatement Disponible**
- Login/logout avec credentials simples
- Interface d'auth intégrée
- Gestion utilisateurs (admin)
- Statut de synchronisation
- Sauvegarde cloud des audits

### 🔄 **Prochaines Étapes (Optionnel)**
- Synchronisation bidirectionnelle
- Workbox pour sync offline
- Migration IndexedDB + Dexie
- Interface multilingue

## 🧪 **Test Rapide**
1. Démarre l'app : `npm run dev`
2. Login avec `admin` / `admin123!`
3. Fait un audit complet
4. Vérifie dans Supabase > Table Editor > audits

## 🆘 **Si Problème**
- Vérifier les credentials dans `.env`
- Vérifier que le SQL a été exécuté
- Ouvrir la console navigateur pour debug
- Tester d'abord avec `admin` / `admin123!`

**L'app fonctionnera en mode dégradé (local seulement) si Supabase n'est pas configuré !** 🚀
