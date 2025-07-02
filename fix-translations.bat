@echo off
REM fix-translations.bat - Script de correction automatique des traductions ONUF

echo =============================================
echo 🔧 ONUF - Correction automatique traductions
echo =============================================
echo.

echo 📦 [1/5] Build de production...
call npm run build
if errorlevel 1 goto error

echo.
echo 📋 [2/5] Copie des traductions...
if not exist dist\locales mkdir dist\locales
copy src\locales\*.json dist\locales\ > nul 2>&1

echo.
echo 🧪 [3/5] Création fichier de test...
if not exist dist\test-translations.html (
    copy public\test-translations.html dist\ > nul 2>&1
)

echo.
echo 🚀 [4/5] Lancement du serveur de preview...
start cmd /c "npm run preview"

echo.
echo ⏳ [5/5] Attente du serveur (5 secondes)...
timeout /t 5 /nobreak > nul

echo.
echo =============================================
echo ✅ Build terminé avec succès!
echo =============================================
echo.
echo 📌 TESTS À EFFECTUER :
echo.
echo 1. Page de test    : http://localhost:4173/test-translations.html
echo 2. App avec debug  : http://localhost:4173/audit?debug=true
echo 3. App normale     : http://localhost:4173/audit
echo.
echo 📱 CONSOLE (F12) :
echo    __onuf.diagnose()
echo.
echo =============================================
echo.

choice /c YN /m "Ouvrir la page de test dans le navigateur"
if errorlevel 2 goto skip_browser
if errorlevel 1 start http://localhost:4173/test-translations.html

:skip_browser
echo.
choice /c YN /m "Déployer sur Git/Netlify"
if errorlevel 2 goto end
if errorlevel 1 goto deploy

:deploy
echo.
echo 🚀 Déploiement en cours...
git add .
git commit -m "Fix: Traductions hybrides avec fallback automatique"
git push
echo.
echo ✅ Déployé! Vérifiez dans quelques minutes sur :
echo    https://onuf.netlify.app/audit?debug=true
goto end

:error
echo.
echo ❌ ERREUR lors du build!
echo Vérifiez les erreurs ci-dessus.
pause
exit /b 1

:end
echo.
echo 🎉 Terminé!
pause
