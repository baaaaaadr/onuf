# CHROME FLAGS POUR PWA - Instructions

## 🚀 Pour forcer l'installation PWA sur Chrome :

### 1. Ouvrez Chrome Flags
```
chrome://flags/
```

### 2. Activez ces flags :

**Bypass App Banner Engagement Checks**
```
chrome://flags/#bypass-app-banner-engagement-checks
```
➡️ **Enable**

**Desktop PWAs**
```
chrome://flags/#enable-desktop-pwas
```
➡️ **Enable**

**Desktop PWAs Remove Status Bar**
```
chrome://flags/#enable-desktop-pwas-remove-status-bar
```
➡️ **Enable**

**PWA Install Prompt**
```
chrome://flags/#enable-pwa-install-prompt
```
➡️ **Enable**

### 3. Redémarrez Chrome
Cliquez sur "Relaunch" en bas de la page

### 4. Retestez l'app
- Naviguez vers http://localhost:4174
- L'icône + devrait apparaître dans la barre d'adresse
- OU Menu → "Installer ONUF"

### 5. Si toujours pas d'installation :

**DevTools Method :**
1. F12 → Application
2. Manifest → Vérifier validité
3. Bouton "Install" dans DevTools

**Menu Method :**
1. Menu Chrome ⋮
2. Plus d'outils
3. Créer un raccourci...
4. ✅ Cocher "Ouvrir dans une fenêtre"

## 📱 Pour Mobile Android :

L'installation devrait fonctionner sans flags sur :
- https://onuf.netlify.app (HTTPS requis)
- Chrome mobile récent
- Tous critères PWA remplis ✅

## 🔧 Debugging :
Si problème persiste, vérifiez dans DevTools → Console :
```
window.__onuf.diagnose()
```
