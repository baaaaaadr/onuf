#!/bin/bash
# Script de nettoyage et rebuild PWA

echo "🧹 Nettoyage du cache et rebuild PWA..."

# Nettoyer le cache de build
echo "📁 Suppression du dossier dist..."
rm -rf dist

# Nettoyer le cache node_modules si nécessaire
echo "🔄 Nettoyage du cache npm..."
npm run clean 2>/dev/null || echo "Pas de script clean, continuons..."

# Nettoyer le cache Vite
echo "⚡ Nettoyage du cache Vite..."
rm -rf node_modules/.vite

# Rebuild complet
echo "🔨 Build de production..."
npm run build

# Test avec preview
echo "🚀 Démarrage du serveur de preview..."
echo "Une fois le serveur démarré :"
echo "1. Ouvrez http://localhost:4174"
echo "2. Testez window.installPWA() dans la console"
echo "3. Vérifiez le menu hamburger pour le bouton d'installation"
echo ""
npm run preview
