@echo off
REM Script de déploiement pour ONUF PWA (Windows)
REM Ce script s'assure que les traductions sont correctement incluses dans le build

echo 🚀 Démarrage du build ONUF PWA...

REM 1. Nettoyer le dossier dist
echo 🧹 Nettoyage du dossier dist...
if exist dist rmdir /s /q dist

REM 2. Build Vite
echo 🔨 Build en cours...
call npm run build

REM 3. Vérifier que les traductions sont incluses
echo 🔍 Vérification des traductions...

REM Créer un dossier locales dans dist si nécessaire
if not exist dist\locales mkdir dist\locales

REM Copier les fichiers de traduction
echo 📋 Copie des fichiers de traduction...
copy src\locales\*.json dist\locales\

REM 4. Créer un fichier de vérification
echo 📝 Création du fichier de vérification...
(
echo // Fichier de vérification des traductions
echo // Ce fichier est créé automatiquement par le script de déploiement
echo console.log('📚 Fichiers de traduction disponibles:'^);
echo ['fr.json', 'en.json', 'ar.json'].forEach(file =^> {
echo   fetch('/locales/' + file^)
echo     .then(r =^> r.json(^)^)
echo     .then(data =^> console.log('✅ ' + file + ':', Object.keys(data^).length + ' clés'^)^)
echo     .catch(e =^> console.error('❌ ' + file + ':', e^)^);
echo }^);
) > dist\locales\check.js

REM 5. Afficher la taille du build
echo 📊 Taille du build:
dir dist /s

echo.
echo ✅ Build terminé!
echo.
echo 📌 Pour tester localement:
echo    npm run preview
echo.
echo 📌 Pour activer le debug en production:
echo    Ajouter ?debug=true à l'URL
echo.
pause
