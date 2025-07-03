# 🤖 Instructions IA Codeur - Intégration Phase 3.3

## 📋 Tâche : Intégrer les nouveaux widgets dans l'application

### 1. Modifier main.css
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\assets\main.css`

**Action** : Ajouter cette ligne EN TOUT PREMIER (ligne 1) :
```css
@import './styles/animations.css';
```

### 2. Modifier App.vue
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\App.vue`

**Action 1** : Après la ligne `import BottomNav from '@/components/navigation/BottomNav.vue'`, ajouter :
```javascript
import PageTransition from '@/components/transitions/PageTransition.vue'
```

**Action 2** : Remplacer le bloc `<router-view />` par :
```vue
<PageTransition name="auto" :duration="300">
  <router-view />
</PageTransition>
```

### 3. Modifier AuditFormView.vue - PARTIE 1 (Imports)
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\AuditFormView.vue`

**Action** : Dans la section `<script setup>`, après l'import de `AuditSectionModern`, ajouter :
```javascript
import LocationWidget from '@/components/widgets/LocationWidget.vue'
import PhotoCapture from '@/components/widgets/PhotoCapture.vue'
```

### 4. Modifier AuditFormView.vue - PARTIE 2 (GPS)
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\AuditFormView.vue`

**Action** : Chercher le commentaire `<!-- Widget de géolocalisation avec carte -->` et remplacer TOUT le v-card qui suit (environ 75 lignes) par :
```vue
<!-- Widget de géolocalisation moderne -->
<v-card class="mb-4" variant="outlined">
  <LocationWidget
    v-model="coordinates"
    :auto-start="true"
    @location-obtained="handleLocationObtained"
    @error="handleLocationError"
  />
</v-card>
```

### 5. Modifier AuditFormView.vue - PARTIE 3 (Photos)
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\AuditFormView.vue`

**Action** : Chercher le commentaire `<!-- Section Photos -->` et remplacer TOUT le bloc photos (environ 70 lignes jusqu'au prochain `</v-card>`) par :
```vue
<!-- Section Photos moderne -->
<v-divider class="my-6"></v-divider>
<v-card variant="outlined">
  <v-card-title class="d-flex align-center">
    <v-icon class="mr-2">mdi-camera</v-icon>
    📸 Photos de l'audit
  </v-card-title>
  <v-card-text>
    <PhotoCapture
      v-model="formData.photos"
      :max-photos="10"
      :max-size-kb="100"
      @photo-added="handlePhotoAdded"
      @photo-removed="handlePhotoRemoved"
    />
  </v-card-text>
</v-card>
```

### 6. Modifier AuditFormView.vue - PARTIE 4 (Handlers)
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\AuditFormView.vue`

**Action** : Dans la section `<script setup>`, après la fonction `addUserAction`, ajouter :
```javascript
// Handlers pour LocationWidget
const handleLocationObtained = (data) => {
  formData.value.location = locationText.value || data.coordinates.lat + ', ' + data.coordinates.lng
  formData.value.coordinates = data.coordinates
  locationAccuracy.value = data.accuracy
  addUserAction('📍 Position GPS obtenue via LocationWidget')
}

const handleLocationError = (error) => {
  addDebugLog(`❌ Erreur GPS: ${error.message}`, 'error')
  locationText.value = '⚠️ Erreur de géolocalisation'
}

// Handlers pour PhotoCapture  
const handlePhotoAdded = (photo) => {
  addUserAction(`📷 Photo ajoutée: ${photo.name}`)
  saveProgress()
}

const handlePhotoRemoved = (photo) => {
  addUserAction(`🗑️ Photo supprimée: ${photo.name}`)
  saveProgress()
}
```

### 7. Nettoyer le code obsolète
**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\AuditFormView.vue`

**Actions** : SUPPRIMER ces fonctions (si elles existent) :
- `getCurrentLocation()`
- `takePhoto()`
- `removePhoto()`
- `updateMap()`
- `openMapDialog()`
- `refreshLocation()`

**NE PAS SUPPRIMER** :
- `coordinates`
- `formData`
- `locationText`
- `locationAccuracy`
- `addUserAction`
- `saveProgress`

## ✅ Vérification

Après toutes ces modifications :
1. Sauvegarder tous les fichiers
2. Relancer le serveur : `npm run dev`
3. Aller sur http://localhost:5173/audit
4. Vérifier :
   - Le nouveau widget GPS s'affiche
   - Le nouveau widget Photos s'affiche
   - Les transitions entre pages fonctionnent

## ⚠️ En cas d'erreur

Si des erreurs apparaissent dans la console :
1. Vérifier que tous les imports sont corrects
2. Vérifier que les handlers sont bien ajoutés
3. NE PAS paniquer, noter l'erreur exacte

## 📌 Résultat attendu

L'interface d'audit sera modernisée avec :
- Un widget GPS avec carte et animations
- Une interface photo avec drag & drop
- Des transitions fluides entre pages
