// Forcer la détection PWA - Méthode de dernier recours
// À ajouter dans la console après connexion

// 1. Simuler l'événement beforeinstallprompt
const fakeInstallPrompt = {
  prompt: async () => {
    const userChoice = confirm('Installer ONUF en tant qu\'application ?');
    return { outcome: userChoice ? 'accepted' : 'dismissed' };
  },
  userChoice: Promise.resolve({ outcome: 'accepted' })
};

// 2. Forcer canInstall
if (window.Vue && window.Vue.config && window.Vue.config.globalProperties) {
  // Vue 3 app instance
  const apps = document.querySelectorAll('[data-v-app]');
  if (apps.length > 0) {
    console.log('🔧 Forçage de la détection PWA...');
    
    // Simuler un beforeinstallprompt
    window.deferredPrompt = fakeInstallPrompt;
    
    // Déclencher l'événement
    const event = new CustomEvent('beforeinstallprompt', {
      detail: fakeInstallPrompt
    });
    window.dispatchEvent(event);
    
    console.log('✅ Événement PWA simulé - Vérifiez le menu');
  }
}

// 3. Instructions manuelles pour Android Chrome
console.log('\n📱 INSTRUCTIONS MANUELLES:');
console.log('Sur Android Chrome:');
console.log('1. Menu ⋮ → "Ajouter à l\'écran d\'accueil"');
console.log('2. OU icône + dans la barre d\'adresse');
console.log('3. OU Paramètres → "Installer l\'application"');

// 4. Test d'installation forcée
window.forceInstallTest = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      console.log('✅ Service Worker prêt - PWA devrait être installable');
      
      // Vérifier les critères manuellement
      const criteria = {
        https: location.protocol === 'https:' || location.hostname === 'localhost',
        manifest: !!document.querySelector('link[rel="manifest"]'),
        serviceWorker: 'serviceWorker' in navigator,
        icons: true // On suppose qu'elles sont là
      };
      
      console.log('📋 Critères PWA:', criteria);
      
      const allMet = Object.values(criteria).every(Boolean);
      console.log(allMet ? '✅ Tous critères remplis' : '❌ Critères manquants');
      
      if (allMet) {
        console.log('💡 PWA devrait être installable. Si ce n\'est pas le cas:');
        console.log('- Essayez en navigation privée');
        console.log('- Redémarrez Chrome');
        console.log('- Videz le cache complet');
      }
    });
  }
};

// Lancer le test
window.forceInstallTest();

console.log('\n🔧 Tests terminés. Tapez forceInstallTest() pour relancer.');
