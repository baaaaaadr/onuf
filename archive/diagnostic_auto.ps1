# 🔍 SCRIPT DIAGNOSTIC SUPABASE - PowerShell + psql
# Exécute le diagnostic complet et sauvegarde dans un fichier

# ========================================
# CONFIGURATION
# ========================================

# REMPLACEZ CES VALEURS PAR VOS VRAIES CREDENTIALS SUPABASE
$SUPABASE_HOST = "VOTRE_HOST.supabase.co"  # Ex: xciqkmnnrmejvrtschrh.supabase.co
$SUPABASE_DB = "postgres"
$SUPABASE_USER = "postgres"
$SUPABASE_PASSWORD = "VOTRE_MOT_DE_PASSE_POSTGRES"  # Mot de passe Database depuis Supabase Dashboard
$SUPABASE_PORT = "5432"

# Fichiers
$SQL_FILE = "diagnostic_complet.sql"
$OUTPUT_FILE = "diagnostic_result_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"

# ========================================
# VÉRIFICATIONS
# ========================================

Write-Host "🔍 DIAGNOSTIC SUPABASE AUTOMATIQUE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Vérifier que psql est installé
try {
    psql --version | Out-Null
    Write-Host "✅ psql détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ psql non trouvé!" -ForegroundColor Red
    Write-Host "Installez PostgreSQL depuis: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Ou utilisez l'OPTION 2 (Node.js)" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le fichier SQL existe
if (!(Test-Path $SQL_FILE)) {
    Write-Host "❌ Fichier $SQL_FILE non trouvé!" -ForegroundColor Red
    Write-Host "Assurez-vous que le fichier est dans le même dossier." -ForegroundColor Yellow
    exit 1
}

# ========================================
# CONNEXION ET EXÉCUTION
# ========================================

Write-Host "🔗 Connexion à Supabase..." -ForegroundColor Blue

# Construction de la connection string
$CONNECTION_STRING = "postgresql://$SUPABASE_USER:$SUPABASE_PASSWORD@$SUPABASE_HOST:$SUPABASE_PORT/$SUPABASE_DB"

Write-Host "📊 Exécution du diagnostic..." -ForegroundColor Blue

# Exécution du diagnostic avec capture d'erreurs
try {
    # Exécuter le SQL et sauvegarder le résultat
    psql $CONNECTION_STRING -f $SQL_FILE -o $OUTPUT_FILE

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Diagnostic terminé avec succès!" -ForegroundColor Green
        Write-Host "📄 Résultat sauvé dans: $OUTPUT_FILE" -ForegroundColor Green
        Write-Host "" -ForegroundColor White
        Write-Host "🔍 Aperçu des premiers résultats:" -ForegroundColor Yellow
        Get-Content $OUTPUT_FILE | Select-Object -First 20
        Write-Host "" -ForegroundColor White
        Write-Host "📁 Fichier complet: $(Resolve-Path $OUTPUT_FILE)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Erreur lors de l'exécution!" -ForegroundColor Red
        Write-Host "Vérifiez vos credentials Supabase." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Vérifiez vos paramètres de connexion." -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🎯 PROCHAINES ÉTAPES:" -ForegroundColor Green
Write-Host "1. Ouvrez le fichier $OUTPUT_FILE" -ForegroundColor White
Write-Host "2. Copiez-collez le contenu pour Claude" -ForegroundColor White
Write-Host "3. Ou utilisez la commande: Get-Content $OUTPUT_FILE | Set-Clipboard" -ForegroundColor White
