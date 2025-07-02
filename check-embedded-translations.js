// check-embedded-translations.js
// Script pour vérifier que les traductions intégrées sont complètes

import { fr, en, ar } from './src/i18n/embedded.js';
import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification des traductions intégrées...\n');

// Charger les JSON originaux pour comparaison
let jsonFr, jsonEn, jsonAr;
try {
    jsonFr = JSON.parse(fs.readFileSync('./src/locales/fr.json', 'utf8'));
    jsonEn = JSON.parse(fs.readFileSync('./src/locales/en.json', 'utf8'));
    jsonAr = JSON.parse(fs.readFileSync('./src/locales/ar.json', 'utf8'));
} catch (error) {
    console.log('⚠️  Impossible de charger les fichiers JSON pour comparaison');
}

// Fonction pour compter les clés récursivement
function countKeys(obj, prefix = '') {
    let count = 0;
    let keys = [];
    
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const subResult = countKeys(obj[key], fullKey);
            count += subResult.count;
            keys = keys.concat(subResult.keys);
        } else {
            count++;
            keys.push(fullKey);
        }
    }
    
    return { count, keys };
}

// Analyser chaque langue
const languages = { fr, en, ar };
const jsonLanguages = { fr: jsonFr, en: jsonEn, ar: jsonAr };

console.log('📊 Analyse des traductions intégrées:\n');

Object.entries(languages).forEach(([lang, translations]) => {
    const result = countKeys(translations);
    console.log(`${lang.toUpperCase()}:`);
    console.log(`  - Nombre total de clés: ${result.count}`);
    console.log(`  - Clés principales: ${Object.keys(translations).join(', ')}`);
    
    // Vérifier quelques clés importantes
    const importantKeys = [
        'app.title',
        'navigation.audit',
        'audit.title',
        'audit.sections.lighting.title',
        'common.save'
    ];
    
    console.log('  - Vérification des clés essentielles:');
    importantKeys.forEach(key => {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }
        console.log(`    ${key}: ${value ? '✅' : '❌'} ${value || 'MANQUANT'}`);
    });
    
    // Comparer avec JSON si disponible
    if (jsonLanguages[lang]) {
        const jsonResult = countKeys(jsonLanguages[lang]);
        const diff = jsonResult.count - result.count;
        if (diff > 0) {
            console.log(`  ⚠️  ${diff} clés manquantes par rapport au JSON`);
        } else if (diff < 0) {
            console.log(`  ✨ ${Math.abs(diff)} clés supplémentaires par rapport au JSON`);
        } else {
            console.log('  ✅ Nombre de clés identique au JSON');
        }
    }
    
    console.log('');
});

// Vérifier la cohérence entre les langues
console.log('🔄 Vérification de la cohérence entre langues:\n');

const frKeys = countKeys(fr).keys.sort();
const enKeys = countKeys(en).keys.sort();
const arKeys = countKeys(ar).keys.sort();

// Trouver les clés manquantes
const allKeys = new Set([...frKeys, ...enKeys, ...arKeys]);
const missingKeys = {
    fr: [],
    en: [],
    ar: []
};

allKeys.forEach(key => {
    if (!frKeys.includes(key)) missingKeys.fr.push(key);
    if (!enKeys.includes(key)) missingKeys.en.push(key);
    if (!arKeys.includes(key)) missingKeys.ar.push(key);
});

Object.entries(missingKeys).forEach(([lang, keys]) => {
    if (keys.length > 0) {
        console.log(`${lang.toUpperCase()} - ${keys.length} clés manquantes:`);
        keys.slice(0, 5).forEach(key => console.log(`  - ${key}`));
        if (keys.length > 5) console.log(`  ... et ${keys.length - 5} autres`);
    } else {
        console.log(`${lang.toUpperCase()} - ✅ Toutes les clés présentes`);
    }
});

console.log('\n✅ Vérification terminée!');

// Générer un rapport
const report = {
    timestamp: new Date().toISOString(),
    summary: {
        fr: countKeys(fr).count,
        en: countKeys(en).count,
        ar: countKeys(ar).count
    },
    missingKeys,
    status: Object.values(missingKeys).every(keys => keys.length === 0) ? 'OK' : 'INCOMPLETE'
};

fs.writeFileSync('./translations-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport généré: translations-report.json');
