@echo off
REM cleanup-old-files.bat - Nettoyer les anciens fichiers de debug i18n

echo.
echo 🧹 Nettoyage des anciens fichiers de debug i18n...
echo.
echo Ces fichiers peuvent être supprimés car le bug est maintenant résolu :
echo.

REM Liste des fichiers à supprimer
echo 📋 Fichiers qui seront supprimés :
echo.
if exist "FIX_TRANSLATIONS_PRODUCTION.md" echo   ✓ FIX_TRANSLATIONS_PRODUCTION.md
if exist "INSTRUCTIONS_FIX_TRANSLATIONS.md" echo   ✓ INSTRUCTIONS_FIX_TRANSLATIONS.md
if exist "SOLUTION_FINALE_TRANSLATIONS.md" echo   ✓ SOLUTION_FINALE_TRANSLATIONS.md
if exist "SOLUTION_FINALE_COMPLETE.md" echo   ✓ SOLUTION_FINALE_COMPLETE.md
if exist "DIAGNOSTIC_RAPIDE.md" echo   ✓ DIAGNOSTIC_RAPIDE.md
if exist "COMMANDES_RAPIDES.txt" echo   ✓ COMMANDES_RAPIDES.txt
if exist "fix-translations.bat" echo   ✓ fix-translations.bat
if exist "deploy.sh" echo   ✓ deploy.sh
if exist "deploy.bat" echo   ✓ deploy.bat
if exist "check-embedded-translations.js" echo   ✓ check-embedded-translations.js
if exist "translations-report.json" echo   ✓ translations-report.json
if exist "src\main-embedded.js" echo   ✓ src\main-embedded.js
if exist "src\main-backup.js" echo   ✓ src\main-backup.js
if exist "src\main-json.js" echo   ✓ src\main-json.js
if exist "src\composables\useI18nFallback.js" echo   ✓ src\composables\useI18nFallback.js
if exist "public\test-translations.html" echo   ✓ public\test-translations.html

echo.
echo 📌 Fichiers à GARDER (documentation importante) :
echo   ✓ Guide_de_Survie_Bug_i18n.txt
echo   ✓ ANALYSE_SOLUTION_FINALE_I18N.md
echo   ✓ VICTOIRE_BUG_I18N.md
echo   ✓ GUIDE_DEPLOIEMENT_FINAL.md
echo   ✓ CONTEXTE_CONTINUATION.md
echo.

choice /c YN /m "Voulez-vous supprimer les anciens fichiers"
if errorlevel 2 goto cancel
if errorlevel 1 goto delete

:delete
echo.
echo Suppression en cours...
echo.

if exist "FIX_TRANSLATIONS_PRODUCTION.md" del "FIX_TRANSLATIONS_PRODUCTION.md" && echo   ❌ Supprimé: FIX_TRANSLATIONS_PRODUCTION.md
if exist "INSTRUCTIONS_FIX_TRANSLATIONS.md" del "INSTRUCTIONS_FIX_TRANSLATIONS.md" && echo   ❌ Supprimé: INSTRUCTIONS_FIX_TRANSLATIONS.md
if exist "SOLUTION_FINALE_TRANSLATIONS.md" del "SOLUTION_FINALE_TRANSLATIONS.md" && echo   ❌ Supprimé: SOLUTION_FINALE_TRANSLATIONS.md
if exist "SOLUTION_FINALE_COMPLETE.md" del "SOLUTION_FINALE_COMPLETE.md" && echo   ❌ Supprimé: SOLUTION_FINALE_COMPLETE.md
if exist "DIAGNOSTIC_RAPIDE.md" del "DIAGNOSTIC_RAPIDE.md" && echo   ❌ Supprimé: DIAGNOSTIC_RAPIDE.md
if exist "COMMANDES_RAPIDES.txt" del "COMMANDES_RAPIDES.txt" && echo   ❌ Supprimé: COMMANDES_RAPIDES.txt
if exist "fix-translations.bat" del "fix-translations.bat" && echo   ❌ Supprimé: fix-translations.bat
if exist "deploy.sh" del "deploy.sh" && echo   ❌ Supprimé: deploy.sh
if exist "deploy.bat" del "deploy.bat" && echo   ❌ Supprimé: deploy.bat
if exist "check-embedded-translations.js" del "check-embedded-translations.js" && echo   ❌ Supprimé: check-embedded-translations.js
if exist "translations-report.json" del "translations-report.json" && echo   ❌ Supprimé: translations-report.json
if exist "src\main-embedded.js" del "src\main-embedded.js" && echo   ❌ Supprimé: src\main-embedded.js
if exist "src\main-backup.js" del "src\main-backup.js" && echo   ❌ Supprimé: src\main-backup.js
if exist "src\main-json.js" del "src\main-json.js" && echo   ❌ Supprimé: src\main-json.js
if exist "src\composables\useI18nFallback.js" del "src\composables\useI18nFallback.js" && echo   ❌ Supprimé: src\composables\useI18nFallback.js
if exist "public\test-translations.html" del "public\test-translations.html" && echo   ❌ Supprimé: public\test-translations.html

echo.
echo ✅ Nettoyage terminé !
goto end

:cancel
echo.
echo ❌ Nettoyage annulé.

:end
echo.
pause
