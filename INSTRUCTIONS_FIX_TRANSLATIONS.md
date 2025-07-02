# 🚨 INSTRUCTIONS POUR RÉSOUDRE LES PROBLÈMES DE TRADUCTION ET DEBUG

## 📋 Résumé des modifications effectuées

### 1. **Amélioration de main.js**
- Ajout de vérifications pour s'assurer que les traductions sont chargées
- Configuration i18n avec options pour la production (désactivation des warnings)
- Exposition globale de i18n pour le debug (`window.__i18n`)

### 2. **Modification du bouton debug**
- Le bouton peut maintenant apparaître en production via :
  - URL avec `?debug=true`
  - localStorage avec `onuf-debug-enabled=true`
  - Le switch "Forcer affichage" dans le panel debug

### 3. **Ajout d'un composable de fallback**
- `useI18nFallback.js` contient des traductions de secours intégrées
- Peut être utilisé si les imports JSON échouent

### 4. **Configuration Vite améliorée**
- Ajout de `commonjsOptions` pour inclure les fichiers de locales
- Configuration pour s'assurer que les JSON sont bundlés

### 5. **Configuration Netlify**
- Fichier `netlify.toml` pour servir correctement les fichiers JSON
- Headers appropriés pour le Content-Type et le CORS

### 6. **Scripts de déploiement**
- `deploy.bat` (Windows) et `deploy.sh` (Linux/Mac)
- Copient automatiquement les traductions dans le dossier dist

## 🛠️ Actions à effectuer

### 1. **Test local**
```bash
# 1. Build de production
npm run build

# 2. Exécuter le script de déploiement
deploy.bat  # Sur Windows
# ou
./deploy.sh  # Sur Linux/Mac

# 3. Tester localement
npm run preview

# 4. Ouvrir http://localhost:4173/audit?debug=true
```

### 2. **Vérifier les traductions**
Dans la console du navigateur (F12), tapez :
```javascript
// Vérifier que i18n est chargé
window.__i18n

// Vérifier les messages chargés
window.__i18n.messages.value

// Tester une traduction
window.__i18n.t('app.title')
```

### 3. **Déploiement sur Netlify**
```bash
# 1. Commit les changements
git add .
git commit -m "Fix: Traductions et debug en production"

# 2. Push vers GitHub
git push origin main

# Netlify va automatiquement déployer avec la nouvelle configuration
```

### 4. **Test en production**
1. Aller sur `https://onuf.netlify.app/audit?debug=true`
2. Le bouton debug 🐛 devrait apparaître
3. Cliquer dessus et vérifier l'onglet "🌍 i18n"
4. Vérifier que les traductions sont chargées

## 🔍 Debug avancé

### Si les traductions ne fonctionnent toujours pas :

1. **Utiliser le fallback**
   Modifier les composants pour utiliser `useI18nFallback` :
   ```javascript
   import { useI18nFallback } from '@/composables/useI18nFallback'
   
   const { t } = useI18nFallback()
   // Au lieu de
   // const { t } = useI18n()
   ```

2. **Vérifier les imports dans le build**
   ```bash
   # Chercher les traductions dans le build
   grep -r "MANARA" dist/
   grep -r "audit.title" dist/
   ```

3. **Forcer l'inclusion des traductions dans le bundle**
   Ajouter dans `main.js` :
   ```javascript
   // Forcer l'inclusion des traductions
   if (import.meta.env.PROD) {
     window.__translations = { fr, en, ar }
   }
   ```

## 📱 Test sur mobile

1. **Installer la PWA fraîche**
   - Désinstaller l'ancienne PWA
   - Vider le cache du navigateur
   - Réinstaller depuis `https://onuf.netlify.app?debug=true`

2. **Activer le debug permanent**
   Dans la console mobile (via USB debugging) :
   ```javascript
   localStorage.setItem('onuf-debug-enabled', 'true')
   location.reload()
   ```

## 🎯 Points de vérification

- [ ] Le bouton debug apparaît avec `?debug=true`
- [ ] Les traductions s'affichent correctement (pas de clés)
- [ ] Le changement de langue fonctionne
- [ ] Les logs dans la console montrent les traductions chargées
- [ ] La PWA fonctionne offline avec les traductions

## 💡 Solution alternative

Si rien ne fonctionne, on peut intégrer les traductions directement dans le code :

1. Créer `src/i18n/embedded.js` avec toutes les traductions
2. Importer ce fichier au lieu des JSON
3. Cela garantit que les traductions sont dans le bundle JS

Faites-moi savoir si vous avez besoin d'aide pour cette approche !
