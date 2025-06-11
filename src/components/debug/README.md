# 🔬 Composants de Debug Mobile ONUF

## 📁 Structure

```
src/components/debug/
├── GPSTestCard.vue           # Test de géolocalisation
├── LocalStorageTestCard.vue  # Test du stockage local
├── SupabaseTestCard.vue      # Test de connexion Supabase
├── FullFlowTestCard.vue      # Test du flux complet (audit + sync)
└── LogsViewer.vue            # Affichage des logs en temps réel
```

## 🚀 Utilisation

### Page principale : `/test-mobile`

La page `MobileTestView.vue` orchestre tous les tests et peut être accédée via :
- `http://localhost:5173/test-mobile`
- `https://votre-app.netlify.app/test-mobile`
- Avec debug mobile : ajoutez `?debug=true`

### Fonctionnalités

**Tests individuels :**
- 📍 **GPS** : Teste la géolocalisation et affiche précision
- 💾 **LocalStorage** : Vérifie lecture/écriture des audits locaux  
- ☁️ **Supabase** : Teste la connexion et authentification
- 🔄 **Flux complet** : Crée un audit test et tente la synchronisation

**Actions globales :**
- 🗑️ **Nettoyer logs** : Vide l'historique des logs
- 📥 **Exporter logs** : Télécharge un fichier JSON avec tous les détails
- ▶️ **Lancer tous** : Exécute tous les tests en séquence

## 🔌 API des Composants

### Événements émis par chaque test

```javascript
// Tous les composants de test émettent :
@log(type, message, data?)     // Pour ajouter un log
@status-update(testName, status) // Pour mettre à jour le statut

// Types de log : 'info', 'success', 'error', 'warn'
// Status : 'pending', 'success', 'error'
```

### Méthodes exposées

```javascript
// Chaque composant de test expose :
runTest()  // Lance le test
results    // Ref contenant les résultats
```

## 🛠️ Ajout d'un nouveau test

1. Créer `MonTestCard.vue` dans `/components/debug/`
2. Utiliser le template :

```vue
<template>
  <v-card class="mb-4">
    <v-card-title>🆕 Mon Nouveau Test</v-card-title>
    <v-card-text>
      <v-btn @click="runTest" :loading="testing" block>
        Lancer le test
      </v-btn>
      <div v-if="results">
        <!-- Affichage des résultats -->
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['log', 'statusUpdate'])
const testing = ref(false)
const results = ref(null)

const runTest = async () => {
  testing.value = true
  emit('log', 'info', 'Début de mon test')
  
  try {
    // Logique du test
    emit('statusUpdate', 'MonTest', 'success')
  } catch (error) {
    emit('log', 'error', 'Erreur', error)
    emit('statusUpdate', 'MonTest', 'error')
  } finally {
    testing.value = false
  }
}

defineExpose({ runTest, results })
</script>
```

3. Importer dans `MobileTestView.vue`
4. Ajouter dans le template et les refs

## 📋 Logs disponibles

Les logs incluent automatiquement :
- ⏰ **Timestamp** précis (millisecondes)
- 🏷️ **Type** (INFO/SUCCESS/ERROR/WARN)
- 📝 **Message** descriptif
- 📊 **Données** (JSON quand disponible)

## 🚀 Débogage mobile

1. Déployez vers Netlify
2. Accédez à `/test-mobile?debug=true` sur mobile
3. Exécutez les tests problématiques
4. Exportez et analysez les logs

**Avantages :**
- ✅ Interface mobile-friendly
- ✅ Tests modulaires et réutilisables
- ✅ Logs détaillés exportables
- ✅ Aucune console F12 requise
- ✅ Fonctionnement offline/online

---

*Créé pour diagnostiquer les problèmes de géolocalisation et synchronisation mobile dans ONUF PWA*
