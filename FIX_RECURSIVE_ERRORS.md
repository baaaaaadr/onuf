# 🔧 Corrections des Erreurs Récursives et d'Initialisation

## Problèmes identifiés

### 1. **Erreur critique : Boucle de mises à jour récursives**
- **Cause** : Le computed `safeSyncStats` créait un nouvel objet à chaque évaluation
- **Solution** : Utiliser une ref stable avec un watch pour la mise à jour

### 2. **Problème de synchronisation au démarrage**
- **Cause** : `processQueue()` appelé avant l'injection de `saveToCloudFunction`
- **Solution** : Différer le démarrage de la sync jusqu'à l'injection de la fonction

### 3. **Avertissements Vue.js répétés**
- **Cause** : Appels de composables dans des contextes asynchrones
- **Solution** : S'assurer que tous les composables sont appelés de manière synchrone

## Corrections appliquées

### 1. Dans `useSyncQueue.js`

```javascript
// AVANT
const startAutoSync = () => {
  if (!isOnline.value) return
  
  // Sync immédiat
  processQueue() // ❌ Appelé trop tôt
  
  // ...
}

// APRÈS
const startAutoSync = () => {
  if (!isOnline.value) return
  
  // ✅ Vérifier que la fonction est disponible
  if (saveToCloudFunction) {
    processQueue()
  } else {
    console.log('⏳ Auto-sync différée - En attente de la fonction de sauvegarde')
  }
  
  // ...
}
```

### 2. Dans `AuditsHistoryView.vue`

```javascript
// AVANT
const safeSyncStats = computed(() => syncStats || {
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
}) // ❌ Crée un nouvel objet à chaque fois

// APRÈS
const safeSyncStats = ref({
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

// ✅ Mise à jour stable via watch
watch(() => syncStats, (newStats) => {
  if (newStats) {
    safeSyncStats.value = { ...newStats }
  }
}, { immediate: true, deep: true })
```

### 3. Protection contre les appels multiples

```javascript
const setupAutoRefresh = () => {
  // ✅ Flag pour éviter les appels simultanés
  let isRefreshing = false
  
  const unwatch = watch(isOnline, async (newOnlineStatus, oldOnlineStatus) => {
    if (newOnlineStatus && !oldOnlineStatus && !isRefreshing) {
      isRefreshing = true
      try {
        await loadAudits()
        await processQueue()
      } finally {
        isRefreshing = false
      }
    }
  })
  
  // ...
}
```

## Instructions pour appliquer les corrections

### 1. Remplacer les sections problématiques dans `AuditsHistoryView.vue`

Cherchez et remplacez :

```javascript
// REMPLACER CETTE SECTION :
const safeSyncStats = computed(() => syncStats || {
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

// PAR :
const safeSyncStats = ref({
  pending: 0,
  syncing: 0,
  failed: 0,
  success: 0
})

watch(() => syncStats, (newStats) => {
  if (newStats) {
    safeSyncStats.value = { ...newStats }
  }
}, { immediate: true, deep: true })
```

### 2. Modifier `setupAutoRefresh` pour éviter les boucles

```javascript
const setupAutoRefresh = () => {
  let isRefreshing = false
  
  const unwatch = watch(isOnline, async (newOnlineStatus, oldOnlineStatus) => {
    if (newOnlineStatus && !oldOnlineStatus && !isRefreshing) {
      console.log('🌐 Reconnexion détectée - Refresh automatique des audits')
      isRefreshing = true
      
      setTimeout(async () => {
        try {
          await loadAudits()
          await processQueue()
        } finally {
          isRefreshing = false
        }
      }, 1000)
    }
  })
  
  const autoRefreshInterval = setInterval(async () => {
    if (isOnline.value && (safeSyncStats.value.pending > 0 || safeSyncStats.value.syncing > 0) && !isRefreshing) {
      console.log('🔄 Refresh automatique - Sync en cours')
      isRefreshing = true
      try {
        await loadAudits()
      } finally {
        isRefreshing = false
      }
    }
  }, 10000)
  
  return { interval: autoRefreshInterval, unwatch }
}
```

### 3. Mettre à jour le cycle de vie

```javascript
let autoRefreshSetup = null

onMounted(() => {
  console.log('📋 AuditsHistoryView montée avec succès!')
  loadAudits()
  autoRefreshSetup = setupAutoRefresh()
  window.addEventListener('onuf-force-reload', loadAudits)
})

onUnmounted(() => {
  if (autoRefreshSetup) {
    if (autoRefreshSetup.interval) {
      clearInterval(autoRefreshSetup.interval)
    }
    if (autoRefreshSetup.unwatch) {
      autoRefreshSetup.unwatch()
    }
  }
  window.removeEventListener('onuf-force-reload', loadAudits)
})
```

## Vérification

Après avoir appliqué ces corrections :

1. **Plus d'erreur récursive** : La boucle infinie devrait être résolue
2. **Sync fonctionnelle** : La synchronisation devrait démarrer correctement
3. **Moins d'avertissements** : Les avertissements Vue devraient diminuer

## Test

1. Redémarrez le serveur de développement
2. Ouvrez la console du navigateur
3. Vérifiez que :
   - Pas d'erreur "Maximum recursive updates exceeded"
   - La sync démarre après "✅ Fonction de sauvegarde cloud injectée"
   - Les compteurs s'affichent correctement
