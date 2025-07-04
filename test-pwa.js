// Script de test PWA - À exécuter dans la console du navigateur

console.log('🔍 Test de Configuration PWA ONUF');

// Test 1: Service Worker
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker supporté');
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`📊 Service Workers actifs: ${registrations.length}`);
    registrations.forEach(reg => console.log('SW:', reg.scope));
  });
} else {
  console.log('❌ Service Worker non supporté');
}

// Test 2: Manifest
fetch('/manifest.webmanifest')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest trouvé:', manifest.name);
    console.log('📱 Icons disponibles:', manifest.icons.length);
    manifest.icons.forEach(icon => {
      console.log(`  - ${icon.sizes}: ${icon.src}`);
    });
  })
  .catch(error => console.log('❌ Erreur manifest:', error));

// Test 3: Capacité d'installation
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ PWA installable détectée');
  window.installPrompt = e;
});

// Test 4: Vérification des icônes
const iconSizes = ['64x64', '144x144', '192x192', '512x512'];
const iconChecks = iconSizes.map(size => {
  return fetch(`/pwa-${size}.png`)
    .then(response => {
      if (response.ok) {
        console.log(`✅ Icône ${size} disponible`);
      } else {
        console.log(`❌ Icône ${size} manquante`);
      }
    })
    .catch(() => console.log(`❌ Erreur icône ${size}`));
});

// Test 5: Icônes spéciales
const specialIcons = [
  'apple-touch-icon-180x180.png',
  'safari-pinned-tab.svg',
  'maskable-icon-512x512.png'
];

specialIcons.forEach(icon => {
  fetch(`/${icon}`)
    .then(response => {
      if (response.ok) {
        console.log(`✅ Icône spéciale ${icon} disponible`);
      } else {
        console.log(`❌ Icône spéciale ${icon} manquante`);
      }
    })
    .catch(() => console.log(`❌ Erreur icône ${icon}`));
});

// Fonction pour forcer l'installation
window.installPWA = function() {
  if (window.installPrompt) {
    window.installPrompt.prompt();
    window.installPrompt.userChoice.then((result) => {
      console.log('Installation:', result.outcome);
      window.installPrompt = null;
    });
  } else {
    console.log('💡 Pas de prompt d\'installation disponible');
  }
};

console.log('🎯 Tests lancés. Vérifiez les résultats ci-dessus.');
console.log('💡 Pour tester l\'installation: installPWA()');
