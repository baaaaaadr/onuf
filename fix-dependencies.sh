#!/bin/bash
# Script de résolution des problèmes de dépendances ONUF

echo "🔧 Résolution des problèmes de dépendances ONUF..."
echo ""

# Nettoyer le cache npm
echo "📦 Nettoyage du cache npm..."
npm cache clean --force

# Supprimer node_modules et package-lock
echo "🗑️ Suppression des anciens fichiers..."
rm -rf node_modules
rm -f package-lock.json

# Réinstaller les dépendances
echo "📥 Réinstallation des dépendances..."
npm install

# Vérifier spécifiquement chart.js
echo ""
echo "✅ Vérification de chart.js..."
npm list chart.js

echo ""
echo "✨ Terminé ! Vous pouvez maintenant lancer 'npm run dev'"
