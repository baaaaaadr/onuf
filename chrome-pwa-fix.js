// SOLUTION CHROME DESKTOP PWA - À exécuter dans la console

console.log('🔧 === ACTIVATION MANUELLE PWA CHROME ===');

// 1. Vérifier DevTools PWA
console.log('\n📋 1. CHROME DEVTOOLS:');
console.log('- Ouvrez DevTools (F12)');
console.log('- Onglet "Application"');
console.log('- Section "Manifest" → Vérifiez la validité');
console.log('- Section "Service Workers" → Vérifiez l\'état');
console.log('- Bouton "Install" dans DevTools si disponible');

// 2. Forcer refresh du manifest
console.log('\n📋 2. FORCER REFRESH MANIFEST:');
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
  const href = manifestLink.href;
  manifestLink.href = href + '?v=' + Date.now();
  console.log('✅ Manifest rechargé:', manifestLink.href);
} else {
  console.log('❌ Lien manifest non trouvé');
}

// 3. Chrome Flags pour PWA
console.log('\n📋 3. CHROME FLAGS:');
console.log('Si installation toujours bloquée, activez ces flags:');
console.log('chrome://flags/#bypass-app-banner-engagement-checks');
console.log('chrome://flags/#enable-desktop-pwas');
console.log('chrome://flags/#enable-desktop-pwas-remove-status-bar');

// 4. Test manuel Chrome
console.log('\n📋 4. MÉTHODES MANUELLES:');
console.log('Méthode 1: Icône + dans barre d\'adresse (parfois invisible)');
console.log('Méthode 2: Menu Chrome → Plus d\'outils → Créer un raccourci');
console.log('Méthode 3: Menu Chrome → Installer [Nom App] (si visible)');

// 5. Trigger forcé pour Chrome
window.triggerPWAInstall = () => {
  console.log('🚀 Tentative de trigger PWA...');
  
  // Méthode 1: Créer un event
  const installEvent = new Event('beforeinstallprompt');
  window.dispatchEvent(installEvent);
  
  // Méthode 2: Chrome interne
  if (window.chrome && window.chrome.webstore) {
    console.log('Chrome detected - tentative installation');
  }
  
  // Méthode 3: Check installation capability
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      console.log('SW prêt - PWA devrait être installable');
      
      // Instructions spécifiques
      const isDesktop = window.innerWidth > 768;
      if (isDesktop) {
        console.log('💻 DESKTOP: Cherchez l\'icône + dans la barre d\'adresse');
        console.log('OU Menu Chrome → Installer ONUF');
      } else {
        console.log('📱 MOBILE: Menu → Ajouter à l\'écran d\'accueil');
      }
    });
  }
};

// 6. Test navigation private
console.log('\n📋 5. TEST NAVIGATION PRIVÉE:');
console.log('- Ouvrez un onglet privé');
console.log('- Naviguez vers l\'app');
console.log('- L\'installation devrait être proposée');

// Lancer le trigger
window.triggerPWAInstall();

console.log('\n🎯 INSTRUCTIONS FINALES:');
console.log('1. Vérifiez DevTools → Application → Manifest');
console.log('2. Cherchez icône + dans barre d\'adresse');
console.log('3. Menu Chrome → Installer [App Name]');
console.log('4. Navigation privée si besoin');
console.log('5. Activez les Chrome flags si nécessaire');

// 7. Auto-check de l'icône d'installation
setTimeout(() => {
  console.log('\n🔍 VÉRIFICATION AUTO:');
  const addressBar = 'Vérifiez manuellement la barre d\'adresse pour l\'icône +';
  console.log(addressBar);
  
  // Simuler un clic sur l'icône d'installation si elle existe
  // (Impossible via JS mais on peut guider l'utilisateur)
  console.log('👆 Si vous voyez une icône + ou d\'installation, cliquez dessus');
}, 2000);
