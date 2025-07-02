# 🚀 GUIDE DE DIAGNOSTIC RAPIDE - TRADUCTIONS ONUF

## 🔍 Diagnostic en 30 secondes

### 1. **Test rapide dans la console du navigateur**

Ouvrez votre application et tapez dans la console (F12) :

```javascript
// Diagnostic automatique
__onuf.diagnose()

// Test simple
__onuf.i18n.global.t('app.title')
// Devrait retourner "MANARA" et non "app.title"
```

### 2. **Page de test dédiée**

Ouvrez dans votre navigateur :
```
http://localhost:5173/test-translations.html
```
ou en production :
```
https://onuf.netlify.app/test-translations.html
```

## 🛠️ Solutions par ordre de priorité

### Solution 1 : Build et test local (2 minutes)

```bash
# 1. Build de production
npm run build

# 2. Test local
npm run preview

# 3. Ouvrir avec debug
# http://localhost:4173/audit?debug=true
```

### Solution 2 : Activer le debug en production (10 secondes)

Sur votre téléphone ou navigateur :
1. Aller sur : `https://onuf.netlify.app/audit?debug=true`
2. Le bouton 🐛 devrait apparaître
3. Cliquer dessus → Onglet "🌍 i18n"

### Solution 3 : Forcer les traductions intégrées (recommandé)

Si les traductions ne fonctionnent toujours pas :

```bash
# Le nouveau main.js détecte automatiquement les problèmes
# et bascule sur les traductions intégrées

# Commit et push
git add .
git commit -m "Fix: Système hybride de traductions avec fallback automatique"
git push
```

## 📱 Debug sur mobile

### Méthode 1 : Via l'URL
```
https://onuf.netlify.app/audit?debug=true
```

### Méthode 2 : Via USB (Android)
1. Activer le mode développeur sur Android
2. Connecter via USB
3. Chrome sur PC : `chrome://inspect`
4. Dans la console :
```javascript
// Activer debug permanent
localStorage.setItem('onuf-debug-enabled', 'true')
location.reload()

// Diagnostic
__onuf.diagnose()
```

## 🎯 Commandes utiles dans la console

```javascript
// 1. Diagnostic complet
__onuf.diagnose()

// 2. Tester une traduction
__onuf.i18n.global.t('audit.title')

// 3. Changer de langue
__onuf.setLocale('ar')  // ou 'en', 'fr'

// 4. Voir toutes les traductions chargées
console.log(__onuf.messages)

// 5. Réinitialiser
localStorage.clear()
location.reload()
```

## ✅ Checklist de vérification

- [ ] Le build local fonctionne avec `npm run preview`
- [ ] Les traductions s'affichent (pas de clés comme "audit.title")
- [ ] Le bouton debug apparaît avec `?debug=true`
- [ ] Le changement de langue fonctionne
- [ ] La PWA installée affiche les traductions

## 🚨 Si rien ne fonctionne

1. **Vider complètement le cache**
   - Chrome mobile : Paramètres → Confidentialité → Effacer données navigation
   - Désinstaller/réinstaller la PWA

2. **Vérifier la console pour les erreurs**
   ```javascript
   // Devrait afficher les messages de diagnostic
   // "✅ Traductions JSON chargées avec succès"
   // ou
   // "✅ Traductions intégrées chargées avec succès"
   ```

3. **Forcer un rebuild complet**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

## 📊 Résultat attendu

Quand tout fonctionne, `__onuf.diagnose()` devrait afficher :

```
🏥 Diagnostic ONUF:
- Environnement: production
- Locale actuelle: fr
- Locales disponibles: ['fr', 'en', 'ar']
- Nombre de traductions:
  fr: 7 clés principales
  en: 7 clés principales
  ar: 7 clés principales
- Test de traduction:
  app.title => MANARA
  audit.title => Audit de Sécurité
```

## 💡 Astuce finale

Le nouveau système hybride dans `main.js` :
1. Essaie d'abord de charger les JSON
2. Si échec → bascule sur les traductions intégrées
3. Si échec → utilise des traductions minimales

Donc les traductions devraient TOUJOURS fonctionner maintenant ! 🎉
