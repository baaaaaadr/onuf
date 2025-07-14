// 🔍 SCRIPT DIAGNOSTIC SUPABASE - Node.js
// Alternative si psql n'est pas disponible

const fs = require('fs');
const { Client } = require('pg');

// ========================================
// CONFIGURATION
// ========================================

// REMPLACEZ CES VALEURS PAR VOS VRAIES CREDENTIALS SUPABASE
const SUPABASE_CONFIG = {
    host: 'VOTRE_HOST.supabase.co',  // Ex: xciqkmnnrmejvrtschrh.supabase.co
    database: 'postgres',
    user: 'postgres',
    password: 'VOTRE_MOT_DE_PASSE_POSTGRES',  // Database password depuis Supabase Dashboard
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

const SQL_FILE = 'diagnostic_complet.sql';
const OUTPUT_FILE = `diagnostic_result_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;

// ========================================
// FONCTIONS
// ========================================

async function runDiagnostic() {
    console.log('🔍 DIAGNOSTIC SUPABASE AUTOMATIQUE');
    console.log('======================================');

    // Vérifier que le fichier SQL existe
    if (!fs.existsSync(SQL_FILE)) {
        console.log(`❌ Fichier ${SQL_FILE} non trouvé!`);
        process.exit(1);
    }

    // Lire le contenu SQL
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
    
    const client = new Client(SUPABASE_CONFIG);
    
    try {
        console.log('🔗 Connexion à Supabase...');
        await client.connect();
        
        console.log('📊 Exécution du diagnostic...');
        const result = await client.query(sqlContent);
        
        // Formatter les résultats
        let output = '';
        output += `DIAGNOSTIC SUPABASE - ${new Date().toISOString()}\n`;
        output += '='.repeat(60) + '\n\n';
        
        if (Array.isArray(result)) {
            // Plusieurs requêtes
            result.forEach((res, index) => {
                output += `REQUÊTE ${index + 1}:\n`;
                output += JSON.stringify(res.rows, null, 2) + '\n\n';
            });
        } else {
            // Une seule requête
            output += JSON.stringify(result.rows, null, 2) + '\n';
        }
        
        // Sauvegarder le résultat
        fs.writeFileSync(OUTPUT_FILE, output);
        
        console.log('✅ Diagnostic terminé avec succès!');
        console.log(`📄 Résultat sauvé dans: ${OUTPUT_FILE}`);
        console.log('\n🔍 Aperçu des premiers résultats:');
        console.log(output.slice(0, 500) + '...');
        
    } catch (error) {
        console.log('❌ Erreur:', error.message);
        console.log('Vérifiez vos credentials Supabase.');
    } finally {
        await client.end();
    }
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log(`1. Ouvrez le fichier ${OUTPUT_FILE}`);
    console.log('2. Copiez-collez le contenu pour Claude');
}

// ========================================
// EXÉCUTION
// ========================================

runDiagnostic().catch(console.error);
