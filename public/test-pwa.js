// Test rapide PWA MANARA
// Copier-coller ce code dans la console du navigateur

console.log('🔍 Test PWA MANARA - Début du diagnostic...\n');

// 1. Vérifier les critères de base
const checkBasicCriteria = () => {
  const criteria = {
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    serviceWorker: 'serviceWorker' in navigator,
    manifest: !!document.querySelector('link[rel="manifest"]'),
    standalone: window.matchMedia('(display-mode: standalone)').matches
  };
  
  console.log('✅ Critères de base:');
  Object.entries(criteria).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}: ${value}`);
  });
  
  return criteria;
};

// 2. Vérifier le Service Worker
const checkServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`\n✅ Service Worker: ${registrations.length} enregistrement(s)`);
    registrations.forEach(reg => {
      console.log(`  - Scope: ${reg.scope}`);
      console.log(`  - Active: ${reg.active ? 'Oui' : 'Non'}`);
    });
  } else {
    console.log('\n❌ Service Worker non supporté');
  }
};

// 3. Vérifier le Manifest
const checkManifest = async () => {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    try {
      const response = await fetch(manifestLink.href);
      const manifest = await response.json();
      
      console.log('\n✅ Manifest PWA trouvé:');
      console.log(`  - Nom: ${manifest.name}`);
      console.log(`  - Icônes: ${manifest.icons?.length || 0}`);
      console.log(`  - Screenshots: ${manifest.screenshots?.length || 0} ${manifest.screenshots?.length ? '✅' : '⚠️ MANQUANTS'}`);
      console.log(`  - Shortcuts: ${manifest.shortcuts?.length || 0} ${manifest.shortcuts?.length ? '✅' : '⚠️ MANQUANTS'}`);
      console.log(`  - Display: ${manifest.display}`);
      
      // Vérifier les screenshots
      if (!manifest.screenshots || manifest.screenshots.length === 0) {
        console.log('\n⚠️ ATTENTION: Les screenshots sont requis par Chrome 2025!');
        console.log('  → Générez-les avec: /generate-screenshots.html');
      }
      
      return manifest;
    } catch (error) {
      console.log('\n❌ Erreur lecture manifest:', error.message);
    }
  } else {
    console.log('\n❌ Pas de manifest trouvé');
  }
};

// 4. Vérifier l'installabilité
const checkInstallability = () => {
  console.log('\n📱 État d\'installation:');
  
  // Vérifier si déjà installé
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInstalled = isStandalone || window.navigator.standalone === true;
  
  if (isInstalled) {
    console.log('  ✅ L\'application est déjà installée!');
  } else {
    console.log('  ❌ L\'application n\'est pas installée');
    console.log('\n💡 Comment installer:');
    
    const ua = navigator.userAgent;
    if (/Android/.test(ua)) {
      console.log('  Android: Menu ⋮ → "Ajouter à l\'écran d\'accueil"');
    } else if (/iPhone|iPad|iPod/.test(ua)) {
      console.log('  iOS: Partager 􀈂 → "Sur l\'écran d\'accueil"');
    } else {
      console.log('  Desktop: Icône + dans la barre d\'adresse');
      console.log('          OU Menu → "Installer MANARA"');
    }
  }
};

// 5. Tester l'installation
const testInstall = () => {
  console.log('\n🚀 Test d\'installation:');
  
  if (window.installPWA) {
    console.log('  ✅ Fonction installPWA disponible');
    console.log('  → Tapez: window.installPWA() pour tester');
  } else {
    console.log('  ❌ Fonction installPWA non disponible');
  }
  
  // Vérifier si le prompt est disponible
  if (window.deferredPrompt) {
    console.log('  ✅ Prompt d\'installation disponible!');
  } else {
    console.log('  ⚠️ Prompt d\'installation non disponible');
    console.log('     (Normal si déjà installé ou critères non remplis)');
  }
};

// Exécuter tous les tests
(async () => {
  checkBasicCriteria();
  await checkServiceWorker();
  await checkManifest();
  checkInstallability();
  testInstall();
  
  console.log('\n📊 Diagnostic terminé!');
  console.log('Pour plus de détails, activez le debug: ?debug=true');
})();
