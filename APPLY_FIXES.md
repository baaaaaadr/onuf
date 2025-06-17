# 🚀 Instructions pour Appliquer les Corrections

## 1. Sauvegarder le fichier actuel
```bash
# Dans le terminal, depuis le dossier du projet
cd C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa

# Créer une sauvegarde
copy src\views\AuditsHistoryView.vue src\views\AuditsHistoryView_BACKUP.vue
```

## 2. Remplacer par la version corrigée
```bash
# Remplacer le fichier problématique
copy src\views\AuditsHistoryView_CORRECTED.vue src\views\AuditsHistoryView.vue
```

## 3. Vérifier que les corrections dans `useSyncQueue.js` sont appliquées

Les changements principaux sont déjà appliqués dans le fichier. Vérifiez que vous voyez ces lignes :

- Ligne ~12 : `let autoSyncInterval = null`
- Ligne ~181 : La fonction `startAutoSync` vérifie `saveToCloudFunction` avant d'appeler `processQueue()`
- Ligne ~331 : La fonction `setSaveToCloudFunction` déclenche `processQueue()` après l'injection

## 4. Redémarrer le serveur de développement
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

## 5. Vérifier dans la console du navigateur

Après le redémarrage, ouvrez la console du navigateur (F12) et vérifiez :

1. **Plus d'erreur récursive** : Pas de message "Maximum recursive updates exceeded"
2. **Ordre correct** : Vous devriez voir :
   - `📋 Queue de sync initialisée - En attente de la fonction de sauvegarde`
   - `✅ Fonction de sauvegarde cloud injectée`
   - `🚀 Démarrage sync automatique après injection` (si des audits en attente)
3. **Compteurs stables** : Les compteurs de sync ne devraient pas clignoter

## 6. Test rapide

1. Créez un nouvel audit en mode offline (désactivez le WiFi)
2. Réactivez la connexion
3. Vérifiez que la synchronisation démarre automatiquement
4. Les compteurs devraient se mettre à jour sans erreur

## 7. Si des problèmes persistent

Si vous avez encore des avertissements `[Vue warn]`, ils sont probablement causés par Vuetify et non par votre code. Pour les réduire :

1. Assurez-vous d'utiliser la dernière version de Vuetify 3
2. Vérifiez que tous les composables sont appelés au niveau racine du `<script setup>`

## 🎉 Résultat attendu

- ✅ Plus de boucle récursive
- ✅ Synchronisation fonctionnelle
- ✅ Compteurs stables
- ✅ Application utilisable

## 📝 Note

Les fichiers créés :
- `AuditsHistoryView_CORRECTED.vue` : Version corrigée
- `FIX_RECURSIVE_ERRORS.md` : Documentation des corrections
- `useSyncQueue.js` : Déjà corrigé avec les bonnes modifications

Après avoir vérifié que tout fonctionne, vous pouvez supprimer :
- `AuditsHistoryView_BACKUP.vue`
- `AuditsHistoryView_CORRECTED.vue`
