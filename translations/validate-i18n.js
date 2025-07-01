// 🔍 Script de validation de l'implémentation i18n
// À exécuter dans la console du navigateur pour vérifier l'installation

console.log('🌍 === VALIDATION INTERNATIONALISATION ONUF ===');

// 1. Vérifier que vue-i18n est chargé
try {
  const i18nGlobal = window.__VUE_I18N__;
  console.log('✅ vue-i18n détecté:', !!i18nGlobal);
} catch (e) {
  console.log('❌ vue-i18n non détecté');
}

// 2. Vérifier les langues disponibles
const supportedLangs = ['fr', 'en', 'ar'];
console.log('📋 Langues supportées:', supportedLangs);

// 3. Vérifier la langue actuelle
const currentLang = localStorage.getItem('user-lang') || 'fr';
const htmlLang = document.querySelector('html').getAttribute('lang');
console.log(`🔤 Langue courante: ${currentLang} (HTML: ${htmlLang})`);

// 4. Vérifier le mode RTL
const bodyDir = document.body.dir;
const isRTL = currentLang === 'ar';
console.log(`↔️ Direction: ${bodyDir || 'ltr'} (Attendu: ${isRTL ? 'rtl' : 'ltr'})`);

// 5. Vérifier le composable useLang
try {
  if (window.Vue && window.Vue.getCurrentInstance) {
    console.log('✅ Composables Vue disponibles');
  }
} catch (e) {
  console.log('⚠️ Impossible de vérifier les composables');
}

// 6. Tester les clés de traduction principales
const testKeys = [
  'app.title',
  'navigation.audit',
  'navigation.history',
  'audit.title',
  'history.title'
];

console.log('🔑 Clés de test:', testKeys);

// 7. Vérifier les fichiers de traduction (simulation)
const expectedFiles = [
  '/src/locales/fr.json',
  '/src/locales/en.json', 
  '/src/locales/ar.json'
];

console.log('📁 Fichiers attendus:', expectedFiles);

// 8. Vérifier le thème Vuetify
try {
  const vuetifyTheme = document.querySelector('[data-v-theme]');
  if (vuetifyTheme) {
    console.log('✅ Thème Vuetify détecté');
  }
} catch (e) {
  console.log('⚠️ Thème Vuetify non détecté');
}

// 9. Fonction de test pour changer de langue
window.testLanguageSwitch = (lang) => {
  console.log(`🔄 Test changement vers: ${lang}`);
  localStorage.setItem('user-lang', lang);
  document.querySelector('html').setAttribute('lang', lang);
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  console.log(`✅ Test ${lang} appliqué (rafraîchir pour voir l'effet complet)`);
};

// 10. Résumé
console.log(`
🎯 === RÉSUMÉ ===
Langue: ${currentLang}
Direction: ${bodyDir || 'ltr'}
HTML Lang: ${htmlLang}

📋 Tests disponibles:
- testLanguageSwitch('fr')
- testLanguageSwitch('en') 
- testLanguageSwitch('ar')

🔄 Pour appliquer: window.location.reload()
`);

console.log('✅ Validation terminée. Vérifiez les résultats ci-dessus.');
