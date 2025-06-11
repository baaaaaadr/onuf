# 🐛 Guide de Debug Mobile ONUF

## Accès rapide aux outils de debug

### 1. **Bouton Debug Mobile** (visible en mode développement)
- Un bouton rouge avec icône bug apparaît en bas à droite
- Cliquez dessus pour voir tous les logs en temps réel
- Filtrez par type : Logs, Warnings, Errors
- Recherchez des mots-clés spécifiques

### 2. **Page de Test Mobile**
Accédez à : `/test-mobile`

Cette page permet de tester individuellement :
- ✅ Géolocalisation GPS
- ✅ IndexedDB (stockage local)
- ✅ Connexion Supabase
- ✅ Flux complet (création + sync d'un audit)

### 3. **Récupération des logs**

#### Option A : Via l'interface
1. Ouvrez le debug viewer (bouton rouge)
2. Cliquez sur l'icône télécharger pour sauver un fichier
3. Ou cliquez "Envoyer par email" pour partager rapidement

#### Option B : Via la console mobile
```javascript
// Afficher tous les logs
__mobileDebug.logs.value

// Exporter en texte
__mobileDebug.exportAsText()

// Télécharger directement
__mobileDebug.downloadLogs()

// Chercher erreurs spécifiques
__mobileDebug.logs.value.filter(l => l.type === 'error')

// Chercher problèmes Supabase
__mobileDebug.logs.value.filter(l => l.message.includes('SUPABASE'))

// Chercher problèmes GPS
__mobileDebug.logs.value.filter(l => l.message.includes('GEOLOCATION'))
```

## 🔍 Que chercher dans les logs

### Pour le problème "Position inconnue" :
1. Cherchez "Saving audit with location data"
2. Vérifiez les valeurs de `latitude`, `longitude`, `coordinates`
3. Cherchez "Saving to localStorage with"
4. Vérifiez que les coordonnées sont bien sauvegardées

### Pour le problème de synchronisation :
1. Cherchez "SUPABASE insert audits"
2. Regardez les erreurs après "Résultat sync:"
3. Vérifiez "Sync impossible:" pour voir la raison
4. Cherchez les erreurs d'authentification

## 📱 Test sur mobile

1. **Déployez sur Netlify**
2. **Sur votre téléphone :**
   - Ouvrez l'app
   - Connectez-vous
   - Allez sur `/test-mobile`
   - Exécutez les tests dans l'ordre
   - Si erreur, exportez les logs

## 🚨 Points à vérifier

- **HTTPS obligatoire** pour la géolocalisation
- **Permissions GPS** accordées dans les paramètres
- **Mode avion** désactivé pour la sync
- **Stockage disponible** pour IndexedDB

## 💡 Astuce debug rapide

Ajoutez `?debug=true` à l'URL pour activer plus de logs :
```
https://votre-app.netlify.app/?debug=true
```

## 📤 Partager les résultats

Après avoir reproduit le problème :
1. Exportez les logs (bouton télécharger)
2. Ou copiez le résultat de `__mobileDebug.exportAsText()`
3. Partagez ici pour analyse

Le système capture automatiquement :
- ✅ Toutes les erreurs JavaScript
- ✅ Les appels Supabase (succès/échecs)
- ✅ Les positions GPS avec précision
- ✅ Les tentatives de synchronisation
- ✅ L'état du réseau (online/offline)
