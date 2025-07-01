// check-translations.js - Script de diagnostic des traductions
// Utilisation: node check-translations.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnostic des traductions ONUF...\n');

// Vérifier les fichiers de traduction
const localesDir = path.join(__dirname, 'src', 'locales');
const requiredFiles = ['fr.json', 'en.json', 'ar.json'];

console.log('📁 Vérification des fichiers de traduction:');
requiredFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      console.log(`  ✅ ${file} - OK (${Object.keys(parsed).length} clés principales)`);
    } else {
      console.log(`  ❌ ${file} - MANQUANT`);
    }
  } catch (error) {
    console.log(`  ❌ ${file} - ERREUR: ${error.message}`);
  }
});

// Vérifier package.json
console.log('\n📦 Vérification des dépendances:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = ['vue-i18n', 'vue', 'vuetify', 'vue-router'];
  const optionalDeps = ['vuex', 'pinia'];
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep} - ${deps[dep]}`);
    } else {
      console.log(`  ❌ ${dep} - MANQUANT`);
    }
  });
  
  console.log('\n📦 Gestion d\'état:');
  optionalDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`  ✅ ${dep} - ${deps[dep]} (utilisé)`);
    } else {
      console.log(`  ⚪ ${dep} - non installé`);
    }
  });
} catch (error) {
  console.log('  ❌ Erreur lecture package.json:', error.message);
}

// Vérifier main.js
console.log('\n⚙️ Vérification de la configuration:');
try {
  const mainJs = fs.readFileSync(path.join('src', 'main.js'), 'utf8');
  
  if (mainJs.includes('createI18n')) {
    console.log('  ✅ Import createI18n trouvé');
  } else {
    console.log('  ❌ Import createI18n manquant');
  }
  
  if (mainJs.includes('app.use(i18n)')) {
    console.log('  ✅ Installation i18n trouvée');
  } else {
    console.log('  ❌ Installation i18n manquante');
  }

  // Vérifier si c'est un import statique ou dynamique
  if (mainJs.includes("import fr from './locales/fr.json'")) {
    console.log('  ✅ Import statique des traductions (recommandé pour production)');
  } else if (mainJs.includes('await import')) {
    console.log('  ⚠️ Import dynamique détecté (peut causer des problèmes en production)');
  } else {
    console.log('  ❌ Aucun import de traductions détecté');
  }

  // Vérifier la gestion d'état
  if (mainJs.includes('createPinia') || mainJs.includes('pinia')) {
    console.log('  ✅ Pinia configuré');
  } else if (mainJs.includes('createStore') || mainJs.includes('vuex')) {
    console.log('  ✅ Vuex configuré');
  } else {
    console.log('  ℹ️ Pas de store global (utilise les composables Vue 3)');
  }
  
} catch (error) {
  console.log('  ❌ Erreur lecture main.js:', error.message);
}

// Vérifier la configuration Vite
console.log('\n🏗️ Vérification configuration build:');
try {
  if (fs.existsSync('vite.config.js')) {
    const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
    if (viteConfig.includes('__VUE_I18N_FULL_INSTALL__')) {
      console.log('  ✅ Configuration Vue i18n trouvée');
    } else {
      console.log('  ⚠️ Configuration Vue i18n manquante dans vite.config.js');
    }
  } else {
    console.log('  ❌ vite.config.js manquant');
  }
} catch (error) {
  console.log('  ❌ Erreur lecture vite.config.js:', error.message);
}

// Vérifier netlify.toml
console.log('\n🚀 Vérification configuration déploiement:');
if (fs.existsSync('netlify.toml')) {
  console.log('  ✅ netlify.toml trouvé');
} else {
  console.log('  ⚠️ netlify.toml manquant (recommandé pour Netlify)');
}

console.log('\n🎯 Résumé des actions à effectuer:');
console.log('1. Tester: npm run dev');
console.log('2. Tester build: npm run build && npm run preview');
console.log('3. Déployer sur Netlify: git add . && git commit && git push');

console.log('\n✨ Diagnostic terminé !');
