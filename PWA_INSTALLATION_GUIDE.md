# 🚀 INSTALLATION PWA ONUF - GUIDE RAPIDE

## PROBLÈME
Chrome ne propose plus automatiquement l'installation PWA car il exige maintenant des **screenshots** dans le manifest.

## SOLUTION RAPIDE (5 minutes)

### Étape 1 : Générer les Screenshots
```bash
# Ouvrir dans le navigateur
http://localhost:5173/generate-screenshots.html

# Cliquer sur les 2 boutons pour télécharger :
- screenshot-1.png (540x720)
- screenshot-2.png (720x540)

# Placer les fichiers dans /public/
```

### Étape 2 : Rebuild et Tester
```bash
npm run build
npm run preview
```

### Étape 3 : Installer la PWA
Sur Chrome Android :
1. Menu ⋮ (3 points)
2. "Ajouter à l'écran d'accueil"
3. Choisir **"Installer"** (pas "Ajouter un raccourci")

## DIAGNOSTIC
Dans la console du navigateur :
```javascript
// Copier-coller pour diagnostic rapide
await fetch('/test-pwa.js').then(r => r.text()).then(eval)
```

## VÉRIFICATION COMPLÈTE
1. Ajouter `?debug=true` à l'URL
2. Cliquer sur 🐛
3. Aller dans l'onglet "PWA"

## ✅ RÉSULTAT ATTENDU
- Le bouton "Installer l'application" dans le menu hamburger devient actif
- Chrome propose l'option "Installer" dans son menu
- L'app s'installe comme une vraie application mobile

## ⚠️ SI ÇA NE MARCHE PAS
1. Vider le cache Chrome : Paramètres → Confidentialité → Effacer données navigation
2. Désinstaller l'ancienne version PWA si elle existe
3. Attendre 30 secondes et naviguer dans l'app avant de réessayer
4. Utiliser le diagnostic PWA dans le debug panel
