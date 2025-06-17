@echo off
REM Script de résolution des problèmes de dépendances ONUF (Windows)

echo ====================================
echo 🔧 Resolution des problemes de dependances ONUF...
echo ====================================
echo.

REM Nettoyer le cache npm
echo 📦 Nettoyage du cache npm...
call npm cache clean --force
echo.

REM Supprimer node_modules et package-lock
echo 🗑️ Suppression des anciens fichiers...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo.

REM Réinstaller les dépendances
echo 📥 Reinstallation des dependances...
call npm install
echo.

REM Vérifier spécifiquement chart.js
echo ✅ Verification de chart.js...
call npm list chart.js
echo.

echo ====================================
echo ✨ Termine ! Vous pouvez maintenant lancer 'npm run dev'
echo ====================================
pause
