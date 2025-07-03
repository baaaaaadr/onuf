# 🚀 Guide de Déploiement Final - ONUF PWA

## ✅ Checklist Pré-déploiement

### 1. **Vérification locale**
```bash
# Build de production
npm run build

# Test local
npm run preview

# Ouvrir dans le navigateur
http://localhost:4173/audit?debug=true
```

### 2. **Tests à effectuer**
- [ ] Les traductions s'affichent (pas de clés comme "audit.title")
- [ ] Le changement de langue fonctionne (FR/EN/AR)
- [ ] Le support RTL fonctionne pour l'arabe
- [ ] Le bouton debug apparaît avec `?debug=true`
- [ ] Dans la console : `__onuf.diagnose()` affiche les bonnes infos

### 3. **Nettoyage du cache**
```javascript
// Dans la console du navigateur
localStorage.clear()
// Puis Ctrl+Shift+Delete pour vider tout le cache
```

## 📦 Déploiement

### Option A : Via Git (recommandé)
```bash
git add .
git commit -m "Production: i18n fix avec injection manuelle"
git push origin main
```
Netlify déploiera automatiquement.

### Option B : Build manuel
```bash
npm run build
# Uploader le dossier 'dist' sur Netlify
```

## 🧪 Vérification Post-déploiement

### 1. **Sur Desktop**
1. Ouvrir : `https://onuf.netlify.app/audit?debug=true`
2. Vérifier les traductions
3. Console : `__onuf.diagnose()`

### 2. **Sur Mobile**
1. **IMPORTANT** : Vider complètement les données du site
   - Chrome : Paramètres → Confidentialité → Effacer données
   - Cocher toutes les cases
2. Réinstaller la PWA fraîche
3. Vérifier avec `?debug=true`

## 🔧 En cas de problème

### Si les traductions ne s'affichent pas :
1. Vérifier que `src/plugins/i18n.js` utilise bien l'injection manuelle
2. Vérifier la console pour "☢️ NUCLEAR-OPTION-V5 APPLIED"
3. S'assurer que le cache est VRAIMENT vidé

### Si le debug n'apparaît pas :
```javascript
// Dans la console
localStorage.setItem('onuf-debug-enabled', 'true')
location.reload()
```

## 📋 Configuration actuelle à ne PAS modifier

### `src/plugins/i18n.js`
```javascript
// ✅ CORRECT - Ne pas changer
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  // PAS de messages ici !
});

// Injection manuelle APRÈS
for (const lang in messages) {
  i18n.global.setLocaleMessage(lang, messages[lang]);
}
```

### `src/main.js`
```javascript
// ✅ CORRECT - Import simple
import i18n from './plugins/i18n'
// ...
app.use(i18n);
```

## 🎯 Commandes utiles

```bash
# Dev local
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Vérifier la taille du bundle
npm run build -- --report
```

## ✨ C'est parti !

Avec cette configuration, les traductions fonctionnent parfaitement en production. 

**N'oubliez pas** : Le secret est de TOUJOURS vider le cache complètement lors des tests !

Bonne mise en production ! 🚀
