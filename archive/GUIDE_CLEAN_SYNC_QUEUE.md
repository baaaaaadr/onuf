# 🧹 Guide de Nettoyage de la Queue de Synchronisation

## 🚨 Quand utiliser ce guide ?
Si vous avez des audits bloqués en synchronisation avec l'erreur `null user_id`, utilisez ce guide pour nettoyer la queue.

## 📋 Vérifier l'état actuel

### 1. Ouvrir la console du navigateur (F12)

### 2. Vérifier la queue de synchronisation
```javascript
// Voir le contenu de la queue
const queue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]');
console.log('Queue actuelle:', queue);

// Voir combien d'audits sont en erreur
const failed = queue.filter(item => item.status === 'failed');
console.log(`${failed.length} audits en erreur`);
```

### 3. Vérifier les audits locaux
```javascript
// Voir les audits locaux
const localAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]');
console.log(`${localAudits.length} audits locaux`);

// Voir les audits non synchronisés
const unsynced = localAudits.filter(audit => !audit.synced);
console.log(`${unsynced.length} audits non synchronisés`);
```

## 🔧 Options de nettoyage

### Option 1 : Nettoyer complètement la queue (RECOMMANDÉ)
```javascript
// Supprimer complètement la queue
localStorage.removeItem('onuf_sync_queue');
console.log('✅ Queue de synchronisation vidée');

// Recharger la page pour réinitialiser
location.reload();
```

### Option 2 : Retirer seulement les audits en erreur
```javascript
// Récupérer la queue
let queue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]');

// Filtrer pour garder seulement les audits non échoués
queue = queue.filter(item => item.status !== 'failed');

// Sauvegarder la queue nettoyée
localStorage.setItem('onuf_sync_queue', JSON.stringify(queue));
console.log('✅ Audits en erreur supprimés de la queue');
```

### Option 3 : Réinitialiser le statut des audits en erreur
```javascript
// Récupérer la queue
let queue = JSON.parse(localStorage.getItem('onuf_sync_queue') || '[]');

// Réinitialiser les audits en erreur
queue.forEach(item => {
    if (item.status === 'failed') {
        item.status = 'pending';
        item.attempts = 0;
        item.error = null;
    }
});

// Sauvegarder la queue modifiée
localStorage.setItem('onuf_sync_queue', JSON.stringify(queue));
console.log('✅ Audits en erreur réinitialisés pour retry');
```

## 🚀 Après le nettoyage

1. **Se reconnecter** : Assurez-vous d'être bien connecté avec votre compte
2. **Créer un nouvel audit** : Testez la création d'un nouvel audit
3. **Vérifier la synchronisation** : L'audit devrait se synchroniser automatiquement

## ⚠️ Notes importantes

- Les audits locaux ne sont PAS supprimés par ces opérations
- Seule la queue de synchronisation est affectée
- Les audits déjà synchronisés avec succès ne sont pas impactés
- Après correction du bug, les nouveaux audits devraient se synchroniser correctement

## 💡 Debug avancé
```javascript
// Afficher toutes les infos de debug
__debugONUF.getStats();
__debugONUF.getSyncQueue();
__debugONUF.getLocalAudits();
```

---
📅 Guide créé le : 19 Juin 2025
