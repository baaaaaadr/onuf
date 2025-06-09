@echo off
REM Nettoyage final des fichiers temporaires ONUF

echo.
echo 🧹 Nettoyage final des fichiers temporaires...
echo.

REM Supprimer les fichiers de résolution CSS
del /Q src\assets\styles\hotfix.css 2>nul
del /Q RESOLUTION_CSS_URGENTE.md 2>nul
del /Q SOLUTION_RAPIDE.md 2>nul
del /Q cleanup.bat 2>nul
del /Q cleanup.sh 2>nul

echo.
echo ✅ Nettoyage terminé !
echo.
echo 📌 Projet prêt pour la suite du redesign !
echo.
pause
