// Test d'accessibilité des icônes PWA
// À exécuter dans la console pour vérifier que toutes les icônes sont disponibles

const iconSizes = ['64x64', '144x144', '192x192', '512x512'];
const specialIcons = [
  'apple-touch-icon-180x180.png',
  'safari-pinned-tab.svg', 
  'maskable-icon-512x512.png'
];

console.log('🔍 Test d\'accessibilité des icônes PWA...');

// Test icônes principales
const testIcon = (url) => {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        console.log(`✅ ${url} - OK (${response.status})`);
        return true;
      } else {
        console.log(`❌ ${url} - ERREUR (${response.status})`);
        return false;
      }
    })
    .catch(error => {
      console.log(`❌ ${url} - INACCESSIBLE (${error.message})`);
      return false;
    });
};

// Tester toutes les icônes
Promise.all([
  ...iconSizes.map(size => testIcon(`/pwa-${size}.png`)),
  ...specialIcons.map(icon => testIcon(`/${icon}`))
]).then(results => {
  const successCount = results.filter(r => r).length;
  const totalCount = results.length;
  
  console.log(`\n📊 RÉSULTAT: ${successCount}/${totalCount} icônes accessibles`);
  
  if (successCount < totalCount) {
    console.log('❌ Icônes manquantes détectées - PWA ne sera pas installable');
    console.log('💡 Solution: Régénérez les icônes manquantes');
  } else {
    console.log('✅ Toutes les icônes sont accessibles');
    console.log('💡 Si PWA toujours pas installable, vérifiez le manifest');
  }
});

// Test manifest
fetch('/manifest.webmanifest')
  .then(response => response.json())
  .then(manifest => {
    console.log('\n📋 MANIFEST:');
    console.log('✅ Manifest accessible');
    console.log(`Name: ${manifest.name}`);
    console.log(`Icons: ${manifest.icons?.length || 0}`);
    
    // Vérifier que toutes les icônes du manifest existent
    if (manifest.icons) {
      manifest.icons.forEach((icon, i) => {
        console.log(`Icon ${i+1}: ${icon.src} (${icon.sizes})`);
        testIcon(`/${icon.src}`);
      });
    }
  })
  .catch(error => {
    console.log('\n❌ MANIFEST INACCESSIBLE:', error);
  });
