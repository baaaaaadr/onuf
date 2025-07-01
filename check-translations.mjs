// check-translations.mjs - Script de diagnostic des traductions (ES Module)
// Utilisation: node check-translations.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      console.log(`  ✅ ${dep} - ${deps[dep]} (installé)`);
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
    console.log('  ❌ Pinia configuré mais non installé');
  } else if (mainJs.includes('createStore') || mainJs.includes('vuex')) {
    console.log('  ✅ Vuex configuré');
  } else {
    console.log('  ✅ Pas de store global (utilise les composables Vue 3)');
  }
  
} catch (error) {
  console.log('  ❌ Erreur lecture main.js:', error.message);
}

// ✅ CORRIGÉ: Vérifier useLang.js pour les erreurs Vuetify et RTL
console.log('\n🌍 Vérification configuration RTL:');
try {
  const useLangJs = fs.readFileSync(path.join('src', 'composables', 'useLang.js'), 'utf8');
  
  if (useLangJs.includes('useVuetify')) {
    console.log('  ❌ useVuetify détecté - non disponible dans Vuetify 3');
  } else if (useLangJs.includes('useTheme')) {
    console.log('  ✅ useTheme utilisé (correct pour Vuetify 3)');
  } else {
    console.log('  ✅ Pas de dépendance directe Vuetify');
  }
  
  // ✅ CORRIGÉ: Meilleure détection du support RTL
  if (useLangJs.includes('direction: \'rtl\'') || useLangJs.includes('direction: "rtl"')) {
    console.log('  ✅ Support RTL configuré dans les langues');
  } else {
    console.log('  ⚠️ Support RTL non détecté dans la configuration des langues');
  }
  
  if (useLangJs.includes('applyRTLConfiguration')) {
    console.log('  ✅ Fonction applyRTLConfiguration trouvée');
  } else {
    console.log('  ❌ Fonction applyRTLConfiguration manquante');
  }
  
  if (useLangJs.includes('document.documentElement.setAttribute')) {
    console.log('  ✅ Configuration dir HTML trouvée');
  } else {
    console.log('  ❌ Configuration dir HTML manquante');
  }
  
  if (useLangJs.includes('isInitialized')) {
    console.log('  ✅ Prévention initialisation multiple configurée');
  } else {
    console.log('  ⚠️ Pas de protection contre initialisation multiple');
  }
  
} catch (error) {
  console.log('  ❌ Erreur lecture useLang.js:', error.message);
}

// Vérifier support RTL CSS
console.log('\n🎨 Vérification support CSS RTL:');
try {
  if (fs.existsSync(path.join('src', 'assets', 'styles', 'rtl-support.css'))) {
    const rtlCss = fs.readFileSync(path.join('src', 'assets', 'styles', 'rtl-support.css'), 'utf8');
    
    if (rtlCss.includes('html[dir="rtl"]')) {
      console.log('  ✅ Styles RTL HTML trouvés');
    } else {
      console.log('  ❌ Styles RTL HTML manquants');
    }
    
    if (rtlCss.includes('direction: rtl !important')) {
      console.log('  ✅ Direction RTL forcée');
    } else {
      console.log('  ⚠️ Direction RTL non forcée');
    }
    
    if (rtlCss.includes('text-align: right !important')) {
      console.log('  ✅ Alignement texte RTL configuré');
    } else {
      console.log('  ⚠️ Alignement texte RTL manquant');
    }
    
  } else {
    console.log('  ❌ Fichier rtl-support.css manquant');
  }
} catch (error) {
  console.log('  ❌ Erreur vérification RTL CSS:', error.message);
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

// Vérifier App.vue pour les erreurs router
console.log('\n🔄 Vérification routes:');
try {
  const appVue = fs.readFileSync(path.join('src', 'App.vue'), 'utf8');
  if (appVue.includes("name: 'dashboard'") || appVue.includes('"dashboard"')) {
    console.log('  ❌ Référence à route "dashboard" trouvée - peut causer des erreurs');
  } else {
    console.log('  ✅ Pas de référence à route inexistante');
  }
} catch (error) {
  console.log('  ❌ Erreur lecture App.vue:', error.message);
}

// ✅ NOUVEAU: Vérifier le debug mobile
console.log('\n🐛 Vérification debug mobile:');
try {
  const debugComponentPath = path.join('src', 'components', 'debug', 'MobileDebugViewer.vue');
  if (fs.existsSync(debugComponentPath)) {
    console.log('  ✅ MobileDebugViewer.vue trouvé');
    
    const debugContent = fs.readFileSync(debugComponentPath, 'utf8');
    if (debugContent.includes('i18n.locale') || debugContent.includes('translations')) {
      console.log('  ✅ Debug traductions configuré');
    } else {
      console.log('  ⚠️ Debug traductions non configuré');
    }
  } else {
    console.log('  ❌ MobileDebugViewer.vue manquant');
  }
} catch (error) {
  console.log('  ❌ Erreur vérification debug mobile:', error.message);
}

// Vérifier les erreurs communes
console.log('\n🔧 Vérification erreurs communes:');
const commonErrors = [
  {
    pattern: 'useVuetify',
    files: ['src/composables/useLang.js'],
    message: 'useVuetify non disponible dans Vuetify 3'
  },
  {
    pattern: 'createPinia',
    files: ['src/main.js'],
    message: 'Pinia importé mais non installé'
  },
  {
    pattern: "name: 'dashboard'",
    files: ['src/App.vue', 'src/router/index.js'],
    message: 'Route dashboard inexistante'
  }
];

let hasErrors = false;
commonErrors.forEach(error => {
  error.files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(error.pattern)) {
        console.log(`  ❌ ${file}: ${error.message}`);
        hasErrors = true;
      }
    }
  });
});

if (!hasErrors) {
  console.log('  ✅ Aucune erreur commune détectée');
}

console.log('\n🎯 Résumé des actions à effectuer:');
if (hasErrors) {
  console.log('1. Corriger les erreurs ❌ ci-dessus');
}
console.log('2. Tester: npm run dev');
console.log('3. Tester build: npm run build && npm run preview');
console.log('4. Debug production: Utiliser MobileDebugViewer sur Netlify');
console.log('5. Déployer: git add . && git commit && git push');

console.log('\n✨ Diagnostic terminé !');
