// Script de diagnostic PWA complet - À exécuter dans la console

console.log('🔍 === DIAGNOSTIC PWA COMPLET ===');

// 1. Vérifier Service Worker
console.log('\n📋 1. SERVICE WORKER:');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`✅ Service Workers: ${registrations.length}`);
    registrations.forEach((reg, i) => {
      console.log(`  ${i+1}. Scope: ${reg.scope}`);
      console.log(`     Active: ${!!reg.active}`);
      console.log(`     Installing: ${!!reg.installing}`);
      console.log(`     Waiting: ${!!reg.waiting}`);
    });
  });
} else {
  console.log('❌ Service Worker non supporté');
}

// 2. Vérifier Manifest
console.log('\n📋 2. MANIFEST:');
fetch('/manifest.webmanifest')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest trouvé:');
    console.log(`  - Name: ${manifest.name}`);
    console.log(`  - Short name: ${manifest.short_name}`);
    console.log(`  - Start URL: ${manifest.start_url}`);
    console.log(`  - Display: ${manifest.display}`);
    console.log(`  - Theme color: ${manifest.theme_color}`);
    console.log(`  - Icons: ${manifest.icons?.length || 0}`);
    
    // Vérifier icônes requises
    const requiredSizes = ['192x192', '512x512'];
    const missingIcons = requiredSizes.filter(size => 
      !manifest.icons?.some(icon => icon.sizes === size)
    );
    
    if (missingIcons.length > 0) {
      console.log(`❌ Icônes manquantes: ${missingIcons.join(', ')}`);
    } else {
      console.log('✅ Icônes principales présentes');
    }
  })
  .catch(error => console.log('❌ Erreur manifest:', error));

// 3. Vérifier HTTPS
console.log('\n📋 3. SÉCURITÉ:');
console.log(`Protocol: ${location.protocol}`);
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  console.log('✅ HTTPS ou localhost - OK');
} else {
  console.log('❌ HTTPS requis pour PWA');
}

// 4. Vérifier Installation Criteria
console.log('\n📋 4. CRITÈRES D\'INSTALLATION:');
console.log(`User Agent: ${navigator.userAgent}`);
console.log(`Display mode: ${window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}`);
console.log(`beforeinstallprompt capturé: ${!!window.deferredPrompt}`);

// 5. Vérifier Meta Tags
console.log('\n📋 5. META TAGS:');
const metaTags = [
  'theme-color',
  'apple-mobile-web-app-capable',
  'mobile-web-app-capable',
  'apple-mobile-web-app-status-bar-style'
];

metaTags.forEach(tag => {
  const meta = document.querySelector(`meta[name="${tag}"]`);
  if (meta) {
    console.log(`✅ ${tag}: ${meta.content}`);
  } else {
    console.log(`❌ ${tag}: manquant`);
  }
});

// 6. Test d'icônes
console.log('\n📋 6. TEST ICÔNES:');
const iconSizes = ['64x64', '144x144', '192x192', '512x512'];
const iconPromises = iconSizes.map(size => {
  return fetch(`/pwa-${size}.png`)
    .then(response => {
      if (response.ok) {
        console.log(`✅ pwa-${size}.png disponible`);
        return true;
      } else {
        console.log(`❌ pwa-${size}.png manquante (${response.status})`);
        return false;
      }
    })
    .catch(() => {
      console.log(`❌ pwa-${size}.png inaccessible`);
      return false;
    });
});

Promise.all(iconPromises).then(results => {
  const availableIcons = results.filter(r => r).length;
  console.log(`\n📊 RÉSUMÉ: ${availableIcons}/${iconSizes.length} icônes disponibles`);
});

// 7. Forcer Event Listener
console.log('\n📋 7. FORCER DETECTION:');
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🎉 beforeinstallprompt DÉTECTÉ !');
  window.deferredPrompt = e;
  e.preventDefault();
});

// 8. Diagnostic final
setTimeout(() => {
  console.log('\n📋 8. DIAGNOSTIC FINAL:');
  console.log('Si aucun beforeinstallprompt après 5s:');
  console.log('- Vérifiez que l\'app répond aux critères PWA');
  console.log('- Essayez en navigation privée');
  console.log('- Videz le cache complètement');
  console.log('- Redémarrez Chrome');
}, 5000);

console.log('\n⏳ Diagnostic en cours... Attendez 5 secondes pour le résumé final.');
