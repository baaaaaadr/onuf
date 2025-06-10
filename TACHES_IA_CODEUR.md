# 🤖 Instructions pour IA Codeur - Phase 3.3

## 📋 Tâches simples à effectuer

### 1. Nettoyage de fichiers
```bash
# Supprimer ces fichiers obsolètes :
- C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\old_cleanup_final.bat.delete
- C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\INTEGRATION_GUIDE.md
- C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\INTEGRATION_GUIDE_COMPLET.md
- C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\MIGRATION_RAPIDE.md
- C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\MIGRATION_VISUELLE.md
```

### 2. Créer le dossier pour les nouveaux widgets
```bash
# Créer le dossier :
C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\components\widgets\
```

### 3. Ajouter les animations CSS globales
Dans le fichier `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\assets\styles\animations.css`, ajouter :

```css
/* Animations globales ONUF */
@keyframes pulse-gps {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-pulse-gps {
  animation: pulse-gps 2s infinite;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in;
}
```

### 4. Importer le fichier animations.css
Dans `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\assets\main.css`, ajouter en haut :
```css
@import './styles/animations.css';
```

### 5. Mettre à jour package.json
Dans `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\package.json`, vérifier que ces dépendances sont présentes :
```json
"leaflet": "^1.9.4",
"@vuetify/labs": "^3.4.0"
```

Si elles ne sont pas là, les ajouter et faire `npm install`.

### 6. Créer un fichier de test
Créer `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\test-widgets.html` :
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Widgets ONUF</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Page de test pour les nouveaux widgets</h1>
    <p>Cette page servira à tester LocationWidget et PhotoCapture</p>
</body>
</html>
```

## ✅ Checklist de vérification
- [ ] Tous les fichiers obsolètes supprimés
- [ ] Dossier widgets créé
- [ ] Animations CSS ajoutées
- [ ] Import animations.css ajouté
- [ ] Dépendances vérifiées
- [ ] Fichier de test créé

## 📌 Notes importantes
- Ne PAS modifier les fichiers Vue existants
- Faire un backup avant de supprimer des fichiers
- Si une erreur se produit, noter le message exact
- Confirmer chaque action avant de l'exécuter

## 🎯 Résultat attendu
Une fois ces tâches terminées, l'environnement sera prêt pour l'intégration des nouveaux widgets LocationWidget et PhotoCapture.
