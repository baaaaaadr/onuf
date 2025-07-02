#!/bin/bash

# Script de déploiement pour ONUF PWA
# Ce script s'assure que les traductions sont correctement incluses dans le build

echo "🚀 Démarrage du build ONUF PWA..."

# 1. Nettoyer le dossier dist
echo "🧹 Nettoyage du dossier dist..."
rm -rf dist

# 2. Build Vite
echo "🔨 Build en cours..."
npm run build

# 3. Vérifier que les traductions sont incluses
echo "🔍 Vérification des traductions..."

# Créer un dossier locales dans dist si nécessaire
mkdir -p dist/locales

# Copier les fichiers de traduction
echo "📋 Copie des fichiers de traduction..."
cp src/locales/*.json dist/locales/

# 4. Créer un fichier de vérification
echo "📝 Création du fichier de vérification..."
cat > dist/locales/check.js << EOF
// Fichier de vérification des traductions
// Ce fichier est créé automatiquement par le script de déploiement
console.log('📚 Fichiers de traduction disponibles:');
['fr.json', 'en.json', 'ar.json'].forEach(file => {
  fetch('/locales/' + file)
    .then(r => r.json())
    .then(data => console.log('✅ ' + file + ':', Object.keys(data).length + ' clés'))
    .catch(e => console.error('❌ ' + file + ':', e));
});
EOF

# 5. Vérifier la taille du build
echo "📊 Taille du build:"
du -sh dist

echo "✅ Build terminé!"
echo ""
echo "📌 Pour tester localement:"
echo "   npm run preview"
echo ""
echo "📌 Pour activer le debug en production:"
echo "   Ajouter ?debug=true à l'URL"
echo ""
