# 🔧 Correction Erreur Synchronisation - user_id null

## 🚨 Problème identifié
Lors de la synchronisation des audits, l'erreur suivante apparaissait :
```
"null value in column \"user_id\" of relation \"audits\" violates not-null constraint"
```

## 🔍 Cause du problème
1. **Context perdu lors de la synchronisation asynchrone** : 
   - Les audits sont synchronisés via une queue asynchrone (`useSyncQueue.js`)
   - Au moment de la synchronisation, `currentUser.value` peut être `null` ou `undefined`
   - Le `user_id` n'était pas inclus dans les données envoyées à Supabase

2. **Incohérence de stockage** :
   - Localement, l'audit est stocké avec `userId` (I minuscule)
   - Lors de la sync cloud, on essayait d'utiliser `currentUser.value.id` qui pouvait être null

## ✅ Corrections appliquées

### 1. Dans `saveAuditToCloud()` (useAudits.js)
- **Avant** : `user_id: currentUser.value.id`
- **Après** : `user_id: auditData.userId || currentUser.value?.id`
- **+ Validation** : Vérification que `user_id` n'est jamais null avant l'envoi

### 2. Dans `getUserAudits()` (useAudits.js)
- Ajout d'une vérification de l'existence de `currentUser` avant l'appel Supabase
- Retour d'une erreur explicite si l'utilisateur n'est pas connecté

## 📋 Impact
- Les audits créés localement conservent maintenant leur `userId`
- La synchronisation peut se faire même si le contexte utilisateur n'est pas disponible
- Prévention des erreurs de contrainte NOT NULL dans la base de données

## 🧪 Test de la correction
1. Créer un nouvel audit
2. Vérifier dans les logs que le `userId` est bien présent
3. Attendre la synchronisation automatique
4. Vérifier que l'audit apparaît bien dans Supabase avec le bon `user_id`

## 🔄 État actuel
- ✅ Les nouveaux audits devraient se synchroniser correctement
- ⚠️ Les audits déjà en erreur dans la queue devront être re-synchronisés manuellement ou supprimés de la queue

## 💡 Recommandations
1. Vider la queue de synchronisation des audits en erreur :
   ```javascript
   localStorage.removeItem('onuf_sync_queue')
   ```
2. Ou utiliser la fonction de retry dans l'interface
3. S'assurer que l'utilisateur est bien connecté avant de créer des audits

---
📅 Date de correction : 19 Juin 2025
