@echo off
echo 🧹 Nettoyage du cache et rebuild PWA...

REM Nettoyer le cache de build
echo 📁 Suppression du dossier dist...
if exist dist rmdir /s /q dist

REM Nettoyer le cache Vite
echo ⚡ Nettoyage du cache Vite...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Rebuild complet
echo 🔨 Build de production...
npm run build

REM Test avec preview
echo 🚀 Démarrage du serveur de preview...
echo Une fois le serveur démarré :
echo 1. Ouvrez http://localhost:4174
echo 2. Testez window.installPWA() dans la console
echo 3. Vérifiez le menu hamburger pour le bouton d'installation
echo.
npm run preview
