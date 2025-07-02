#!/bin/bash
# cleanup-old-files.sh - Nettoyer les anciens fichiers de debug i18n

echo "🧹 Nettoyage des anciens fichiers de debug i18n..."
echo ""
echo "Ces fichiers peuvent être supprimés car le bug est maintenant résolu :"
echo ""

# Liste des fichiers à supprimer (créés pendant le debug)
FILES_TO_DELETE=(
  "FIX_TRANSLATIONS_PRODUCTION.md"
  "INSTRUCTIONS_FIX_TRANSLATIONS.md"
  "SOLUTION_FINALE_TRANSLATIONS.md"
  "SOLUTION_FINALE_COMPLETE.md"
  "DIAGNOSTIC_RAPIDE.md"
  "COMMANDES_RAPIDES.txt"
  "fix-translations.bat"
  "deploy.sh"
  "deploy.bat"
  "check-embedded-translations.js"
  "translations-report.json"
  "src/main-embedded.js"
  "src/main-backup.js"
  "src/main-json.js"
  "src/composables/useI18nFallback.js"
  "public/test-translations.html"
)

echo "📋 Fichiers à supprimer :"
for file in "${FILES_TO_DELETE[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  fi
done

echo ""
echo "📌 Fichiers à GARDER (documentation importante) :"
echo "  ✓ Guide_de_Survie_Bug_i18n.txt"
echo "  ✓ ANALYSE_SOLUTION_FINALE_I18N.md"
echo "  ✓ VICTOIRE_BUG_I18N.md"
echo "  ✓ GUIDE_DEPLOIEMENT_FINAL.md"
echo "  ✓ CONTEXTE_CONTINUATION.md"
echo ""

read -p "Voulez-vous supprimer les anciens fichiers ? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
      rm "$file"
      echo "  ❌ Supprimé: $file"
    fi
  done
  echo ""
  echo "✅ Nettoyage terminé !"
else
  echo "❌ Nettoyage annulé."
fi
