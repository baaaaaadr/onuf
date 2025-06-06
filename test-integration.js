// test-integration.js - Script de test post-migration
// À exécuter dans la console navigateur après migration

console.log('🧪 ONUF PWA - Test d\'Intégration Post-Migration');
console.log('===============================================');

// Test 1: Vérifier les composables
async function testComposables() {
  console.log('\n📦 Test 1: Composables');
  
  try {
    // Test useSupabase
    const { useAuth } = await import('./src/composables/useSupabase.js');
    const { isAuthenticated, currentUser } = useAuth();
    console.log('✅ useSupabase importé');
    console.log('  - Authentifié:', isAuthenticated.value);
    console.log('  - Utilisateur:', currentUser.value?.username || 'Non connecté');
    
    // Test useSyncQueue
    const { useSyncQueue } = await import('./src/composables/useSyncQueue.js');
    const { syncStats, isOnline } = useSyncQueue();
    console.log('✅ useSyncQueue importé');
    console.log('  - En ligne:', isOnline.value);
    console.log('  - Stats sync:', syncStats);
    
    // Test useGeolocation
    const { globalGeolocation } = await import('./src/composables/useGeolocation.js');
    const { currentPosition, accuracy, isGpsAvailable } = globalGeolocation;
    console.log('✅ useGeolocation importé');
    console.log('  - GPS disponible:', isGpsAvailable.value);
    console.log('  - Position actuelle:', currentPosition.value);
    console.log('  - Précision:', accuracy.value ? `±${accuracy.value}m` : 'N/A');
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test composables:', error);
    return false;
  }
}

// Test 2: Vérifier Supabase
async function testSupabase() {
  console.log('\n☁️ Test 2: Connexion Supabase');
  
  try {
    // Importer le client Supabase
    const { supabase } = await import('./src/composables/useSupabase.js');
    
    // Test de connexion basique
    const { data: healthCheck, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erreur connexion Supabase:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase OK');
    console.log('  - Nombre de profils:', healthCheck);
    
    // Test fonction d'authentification
    try {
      const { data: authTest } = await supabase.rpc('authenticate_user', {
        username_input: 'test_nonexistent_user',
        password_input: 'test'
      });
      console.log('✅ Fonction authenticate_user disponible');
    } catch (authError) {
      if (authError.message.includes('function')) {
        console.error('❌ Fonction authenticate_user manquante');
        return false;
      }
      console.log('✅ Fonction authenticate_user OK (échec attendu)');
    }
    
    // Test fonction création utilisateur
    try {
      await supabase.rpc('create_field_user', {
        username_input: 'test_check',
        password_input: 'test',
        display_name_input: 'Test'
      });
      console.log('✅ Fonction create_field_user disponible');
    } catch (createError) {
      if (createError.message.includes('function')) {
        console.error('❌ Fonction create_field_user manquante');
        return false;
      }
      console.log('✅ Fonction create_field_user OK');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test Supabase:', error);
    return false;
  }
}

// Test 3: Vérifier le stockage local
function testLocalStorage() {
  console.log('\n💾 Test 3: Stockage Local');
  
  try {
    // Test localStorage
    const testKey = 'onuf_test_key';
    const testValue = { test: true, timestamp: Date.now() };
    
    localStorage.setItem(testKey, JSON.stringify(testValue));
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    localStorage.removeItem(testKey);
    
    if (retrieved.test !== true) {
      throw new Error('localStorage non fonctionnel');
    }
    
    console.log('✅ localStorage fonctionne');
    
    // Vérifier les clés ONUF existantes
    const onufKeys = Object.keys(localStorage).filter(key => key.startsWith('onuf_'));
    console.log('  - Clés ONUF trouvées:', onufKeys);
    
    // Test IndexedDB (via Dexie si disponible)
    if (window.Dexie) {
      console.log('✅ Dexie.js disponible');
    } else {
      console.log('⚠️ Dexie.js non trouvé (normal si pas encore installé)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test stockage:', error);
    return false;
  }
}

// Test 4: Vérifier les APIs navigateur
function testBrowserAPIs() {
  console.log('\n🌐 Test 4: APIs Navigateur');
  
  const apis = {
    'Géolocalisation': 'geolocation' in navigator,
    'Service Workers': 'serviceWorker' in navigator,
    'Notifications': 'Notification' in window,
    'Cache API': 'caches' in window,
    'IndexedDB': 'indexedDB' in window,
    'Fetch API': 'fetch' in window,
    'WebRTC': 'RTCPeerConnection' in window,
    'Camera/Media': 'mediaDevices' in navigator,
    'Clipboard': 'clipboard' in navigator,
    'Share API': 'share' in navigator
  };
  
  let supportCount = 0;
  for (const [api, supported] of Object.entries(apis)) {
    const status = supported ? '✅' : '❌';
    console.log(`  ${status} ${api}: ${supported ? 'Supporté' : 'Non supporté'}`);
    if (supported) supportCount++;
  }
  
  console.log(`\n📊 Support navigateur: ${supportCount}/${Object.keys(apis).length} APIs`);
  
  // Test spécifique GPS
  if ('geolocation' in navigator) {
    navigator.permissions?.query({ name: 'geolocation' })
      .then(result => {
        console.log('  🛰️ Permission GPS:', result.state);
      })
      .catch(() => {
        console.log('  🛰️ Permission GPS: API non supportée');
      });
  }
  
  return supportCount >= 7; // Minimum requis
}

// Test 5: Vérifier les composants Vue
function testVueComponents() {
  console.log('\n⚡ Test 5: Composants Vue');
  
  try {
    // Vérifier si Vue est monté
    const vueApp = document.querySelector('#app').__vueParentComponent;
    if (vueApp) {
      console.log('✅ Application Vue montée');
    } else {
      console.log('❌ Application Vue non trouvée');
      return false;
    }
    
    // Vérifier éléments UI critiques
    const criticalElements = {
      'Header/StatusBar': '.v-app-bar, [data-testid="status-bar"]',
      'Container principal': '.v-main',
      'Navigation': '.v-navigation-drawer, .v-bottom-navigation',
      'Boutons': '.v-btn',
      'Cards': '.v-card'
    };
    
    for (const [element, selector] of Object.entries(criticalElements)) {
      const found = document.querySelector(selector);
      const status = found ? '✅' : '⚠️';
      console.log(`  ${status} ${element}: ${found ? 'Trouvé' : 'Non trouvé'}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test Vue:', error);
    return false;
  }
}

// Test 6: Performance et métriques
function testPerformance() {
  console.log('\n⚡ Test 6: Performance');
  
  try {
    // Métriques de base
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    
    console.log(`  📊 Temps de chargement: ${loadTime}ms`);
    console.log(`  📊 DOM ready: ${domReady}ms`);
    
    // Mémoire (si disponible)
    if (performance.memory) {
      const memory = performance.memory;
      console.log(`  💾 Mémoire utilisée: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  💾 Limite mémoire: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Connexion réseau
    if (navigator.connection) {
      const conn = navigator.connection;
      console.log(`  🌐 Type connexion: ${conn.effectiveType || 'Inconnu'}`);
      console.log(`  🌐 Bande passante: ${conn.downlink || 'Inconnue'}Mbps`);
    }
    
    // Évaluation performance
    const isGood = loadTime < 3000 && domReady < 2000;
    console.log(`  ${isGood ? '✅' : '⚠️'} Performance: ${isGood ? 'Bonne' : 'Peut être améliorée'}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test performance:', error);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'intégration...\n');
  
  const tests = [
    { name: 'Composables', fn: testComposables },
    { name: 'Supabase', fn: testSupabase },
    { name: 'Stockage Local', fn: testLocalStorage },
    { name: 'APIs Navigateur', fn: testBrowserAPIs },
    { name: 'Composants Vue', fn: testVueComponents },
    { name: 'Performance', fn: testPerformance }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.error(`❌ Erreur test ${test.name}:`, error);
      results.push({ name: test.name, success: false, error });
    }
  }
  
  // Résumé final
  console.log('\n🎯 RÉSUMÉ DES TESTS');
  console.log('==================');
  
  let successCount = 0;
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.success ? 'SUCCÈS' : 'ÉCHEC'}`);
    if (result.success) successCount++;
  });
  
  const globalSuccess = successCount === results.length;
  const percentage = ((successCount / results.length) * 100).toFixed(0);
  
  console.log(`\n📊 Score global: ${successCount}/${results.length} (${percentage}%)`);
  console.log(`🎯 Status: ${globalSuccess ? '✅ TOUS LES TESTS PASSENT' : '⚠️ CERTAINS TESTS ÉCHOUENT'}`);
  
  if (globalSuccess) {
    console.log('\n🎉 Migration réussie ! L\'application ONUF PWA est prête à l\'emploi.');
  } else {
    console.log('\n🔧 Migration incomplète. Vérifiez les erreurs ci-dessus.');
  }
  
  return { success: globalSuccess, results, score: percentage };
}

// Auto-exécution si dans un navigateur
if (typeof window !== 'undefined') {
  // Attendre que la page soit chargée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runAllTests, 1000); // Attendre 1s pour Vue
    });
  } else {
    setTimeout(runAllTests, 1000);
  }
}

// Export pour utilisation manuelle
window.testONUFIntegration = runAllTests;

console.log('\n💡 Pour lancer les tests manuellement: testONUFIntegration()');
