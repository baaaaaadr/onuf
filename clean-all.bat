@echo off
REM Script de nettoyage complet pour ONUF (Windows)

echo ====================================
echo 🧹 Nettoyage complet ONUF
echo ====================================
echo.

REM Arrêter le serveur dev s'il tourne
echo ⏹️ Arret du serveur de developpement...
taskkill /F /IM node.exe 2>nul
echo.

REM Nettoyer le cache Vite
echo 🗑️ Nettoyage du cache Vite...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo.

REM Nettoyer le cache npm
echo 📦 Nettoyage du cache npm...
call npm cache clean --force
echo.

REM Supprimer les fichiers temporaires
echo 🗑️ Suppression des fichiers temporaires...
if exist .eslintcache del .eslintcache
if exist dist rmdir /s /q dist
echo.

echo ====================================
echo ✨ Nettoyage termine !
echo.
echo Prochaines etapes :
echo 1. Executez 'fix-dependencies.bat' pour reinstaller
echo 2. Puis lancez 'npm run dev'
echo ====================================
pause
