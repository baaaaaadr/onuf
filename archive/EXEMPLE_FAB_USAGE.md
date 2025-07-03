# 💡 Exemple d'utilisation du FloatingActionButton

## 📍 Dans DashboardView.vue

### Code à ajouter

**Fichier** : `C:\Users\MiniMonster\Documents\my apps\ONUF\ONUF-pwa\src\views\DashboardView.vue`

#### 1. Ajouter l'import (dans script setup)
```javascript
import FloatingActionButton from '@/components/common/FloatingActionButton.vue'
```

#### 2. Ajouter le FAB (avant la fermeture </template>)
```vue
<!-- Floating Action Button -->
<FloatingActionButton
  icon="mdi-plus"
  text="Nouvel audit"
  color="primary"
  size="regular"
  :extended="fabExtended"
  :badge="pendingAudits"
  @click="startNewAudit"
  style="position: fixed; bottom: 80px; right: 16px; z-index: 100;"
/>
```

#### 3. Ajouter la logique (dans script setup)
```javascript
// État du FAB
const fabExtended = ref(true)

// Nombre d'audits en attente
const pendingAudits = computed(() => {
  const pending = audits.value.filter(a => !a.synced).length
  return pending > 0 ? pending : null
})

// Action nouveau audit
const startNewAudit = () => {
  router.push('/audit')
}

// Rétracter le FAB au scroll
onMounted(() => {
  let lastScrollY = window.scrollY
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY
    fabExtended.value = currentScrollY < lastScrollY || currentScrollY < 50
    lastScrollY = currentScrollY
  }, { passive: true })
})
```

## 🎨 Variantes d'utilisation

### FAB Simple
```vue
<FloatingActionButton
  icon="mdi-plus"
  color="primary"
  @click="action"
/>
```

### FAB avec badge
```vue
<FloatingActionButton
  icon="mdi-sync"
  color="secondary"
  :badge="5"
  @click="sync"
/>
```

### FAB étendu
```vue
<FloatingActionButton
  icon="mdi-camera"
  text="Prendre photo"
  color="success"
  :extended="true"
  @click="capture"
/>
```

### FAB avec loading
```vue
<FloatingActionButton
  icon="mdi-cloud-upload"
  color="primary"
  :loading="uploading"
  @click="upload"
/>
```

### Mini FAB
```vue
<FloatingActionButton
  icon="mdi-message"
  size="mini"
  color="warning"
  @click="chat"
/>
```

## 🎯 Positions recommandées

### Bottom Right (défaut)
```css
position: fixed;
bottom: 80px;  /* Au-dessus de la navigation */
right: 16px;
```

### Bottom Center
```css
position: fixed;
bottom: 80px;
left: 50%;
transform: translateX(-50%);
```

### Multiple FABs (Speed Dial)
```vue
<div class="fab-container">
  <FloatingActionButton
    icon="mdi-plus"
    @click="toggleSpeedDial"
  />
  
  <transition-group name="scale">
    <FloatingActionButton
      v-for="action in speedDialActions"
      v-show="speedDialOpen"
      :key="action.id"
      :icon="action.icon"
      size="small"
      @click="action.handler"
      :style="action.style"
    />
  </transition-group>
</div>
```

## 🎨 Personnalisation CSS

### Effet de pulsation
```css
.fab-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(243, 195, 72, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(243, 195, 72, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(243, 195, 72, 0);
  }
}
```

### Effet de rebond
```css
.fab-bounce {
  animation: bounce 2s infinite;
}
```

## 📱 Comportement mobile

Le FAB s'adapte automatiquement :
- Touch feedback optimisé
- Ripple effect au toucher
- Zone de tap élargie (48x48 minimum)
- Position ajustée pour éviter les conflits avec la navigation

## ✅ Bonnes pratiques

1. **Un seul FAB principal** par écran
2. **Action principale** uniquement (création, ajout)
3. **Position cohérente** dans toute l'app
4. **Badge** pour indiquer des notifications
5. **Extended** se rétracte au scroll

## 🐛 Troubleshooting

### FAB caché derrière la navigation
```css
z-index: 100;  /* Augmenter si nécessaire */
bottom: 80px;  /* Ajuster selon hauteur nav */
```

### Ripple effect ne fonctionne pas
Vérifier que le composant est bien importé et que les styles ne sont pas écrasés.

### Performance sur mobile
Si lag au toucher, désactiver temporairement les animations complexes.
