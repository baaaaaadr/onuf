# 🔧 Guide de Dépannage - Redesign ONUF

> Solutions aux problèmes courants rencontrés lors du redesign  
> Version 1.0 - Décembre 2024

## 📋 Table des Matières

1. [Problèmes Vuetify](#1-problèmes-vuetify)
2. [Problèmes CSS/Style](#2-problèmes-cssstyle)
3. [Problèmes de Composants](#3-problèmes-de-composants)
4. [Problèmes de Performance](#4-problèmes-de-performance)
5. [Problèmes Mobile/PWA](#5-problèmes-mobilepwa)
6. [Problèmes de Migration](#6-problèmes-de-migration)

---

## 1. 🎨 Problèmes Vuetify

### Problème : Les couleurs du thème ne s'appliquent pas

**Symptômes :**
- Les boutons restent bleus au lieu du jaune doré
- Les surfaces ne prennent pas la couleur définie

**Solutions :**

1. **Vérifier l'import du plugin :**
```javascript
// main.js
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(vuetify) // ⚠️ Important : AVANT le mount
app.mount('#app')
```

2. **Forcer le thème :**
```vue
<v-app theme="onufLight">
  <!-- Contenu -->
</v-app>
```

3. **Nettoyer le cache :**
```bash
rm -rf node_modules/.vite
npm run dev
```

### Problème : Les defaults Vuetify ne marchent pas

**Solutions :**

1. **Utiliser la bonne syntaxe :**
```javascript
// ❌ Incorrect
defaults: {
  VBtn: {
    color: 'primary' // Ne marche pas toujours
  }
}

// ✅ Correct
defaults: {
  VBtn: {
    color: 'primary',
    variant: 'flat',
    rounded: 'pill'
  }
}
```

2. **Override spécifique :**
```vue
<v-btn 
  v-bind="$vuetify.defaults.VBtn"
  color="secondary"
>
  Override couleur seulement
</v-btn>
```

### Problème : Icônes MDI manquantes

**Solutions :**

1. **Installer la font :**
```bash
npm install @mdi/font
```

2. **Importer dans main.js :**
```javascript
import '@mdi/font/css/materialdesignicons.css'
```

3. **Utiliser le bon préfixe :**
```vue
<!-- ✅ Correct -->
<v-icon>mdi-home</v-icon>

<!-- ❌ Incorrect -->
<v-icon>home</v-icon>
```

---

## 2. 🎯 Problèmes CSS/Style

### Problème : Styles qui ne s'appliquent pas

**Symptômes :**
- Les classes custom ne fonctionnent pas
- Les variables CSS non reconnues

**Solutions :**

1. **Ordre d'import correct :**
```javascript
// main.js
// 1. D'abord Vuetify
import vuetify from './plugins/vuetify'

// 2. Puis vos styles
import './assets/styles/variables.css'
import './assets/styles/main.css'
```

2. **Spécificité CSS :**
```css
/* ❌ Trop faible */
.my-button {
  background: red;
}

/* ✅ Plus spécifique */
.v-btn.my-button {
  background: red !important;
}

/* ✅ Ou utiliser deep */
:deep(.v-btn) {
  background: red;
}
```

3. **Scoped vs Global :**
```vue
<!-- Pour styles locaux -->
<style scoped>
.my-class { }
</style>

<!-- Pour override Vuetify -->
<style>
/* Sans scoped */
.v-card {
  border: 2px solid red;
}
</style>
```

### Problème : Responsive cassé

**Solutions :**

1. **Utiliser les breakpoints Vuetify :**
```vue
<template>
  <v-container>
    <v-row>
      <v-col 
        cols="12" 
        sm="6" 
        md="4"
      >
        <!-- Contenu -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { mobile, mdAndUp } = useDisplay()

// Utiliser dans la logique
if (mobile.value) {
  // Logic mobile
}
</script>
```

2. **CSS responsive :**
```css
/* Utiliser les variables */
@media (max-width: 428px) {
  .my-class {
    padding: var(--spacing-sm);
  }
}
```

---

## 3. 🧩 Problèmes de Composants

### Problème : v-model ne fonctionne pas sur OptionCard

**Solutions :**

1. **Implémenter correctement :**
```vue
<!-- Parent -->
<option-card
  v-model="selectedValue"
  :option="option"
/>

<!-- OptionCard.vue -->
<script setup>
const props = defineProps(['modelValue', 'option'])
const emit = defineEmits(['update:modelValue'])

const handleClick = () => {
  emit('update:modelValue', props.option.value)
}
</script>
```

2. **Debug v-model :**
```vue
<template>
  <!-- Ajouter temporairement -->
  <pre>{{ { modelValue, selectedValue } }}</pre>
</template>
```

### Problème : Transitions/Animations saccadées

**Solutions :**

1. **Utiliser transform au lieu de position :**
```css
/* ❌ Mauvais pour perf */
.animate {
  transition: left 0.3s;
  left: 100px;
}

/* ✅ Bon pour perf */
.animate {
  transition: transform 0.3s;
  transform: translateX(100px);
}
```

2. **Will-change pour optimiser :**
```css
.will-animate {
  will-change: transform;
}

/* Enlever après animation */
.animation-done {
  will-change: auto;
}
```

3. **Désactiver pour reduced motion :**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 4. ⚡ Problèmes de Performance

### Problème : App lente au démarrage

**Solutions :**

1. **Lazy loading des vues :**
```javascript
// router/index.js
const routes = [
  {
    path: '/',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/audit',
    component: () => import('../views/AuditFormView.vue')
  }
]
```

2. **Optimiser les images :**
```javascript
// Compression automatique
import { compressImage } from '@/utils/imageUtils'

const compressed = await compressImage(file, 100) // 100KB max
```

3. **Suspense pour le chargement :**
```vue
<Suspense>
  <template #default>
    <DashboardView />
  </template>
  <template #fallback>
    <LoadingScreen />
  </template>
</Suspense>
```

### Problème : Re-renders excessifs

**Solutions :**

1. **Utiliser v-once pour contenu statique :**
```vue
<div v-once>
  {{ staticContent }}
</div>
```

2. **Computed vs Methods :**
```javascript
// ✅ Cached
const filtered = computed(() => 
  items.value.filter(i => i.active)
)

// ❌ Recalculé à chaque render
const filtered = () => 
  items.value.filter(i => i.active)
```

3. **v-memo pour listes :**
```vue
<div
  v-for="item in list"
  :key="item.id"
  v-memo="[item.id, item.updated]"
>
  <!-- Contenu complexe -->
</div>
```

---

## 5. 📱 Problèmes Mobile/PWA

### Problème : Bottom nav caché par le clavier

**Solutions :**

1. **Détecter le clavier :**
```javascript
// composables/useKeyboard.js
export function useKeyboard() {
  const isKeyboardOpen = ref(false)
  
  onMounted(() => {
    const threshold = 150
    const initialHeight = window.innerHeight
    
    window.addEventListener('resize', () => {
      isKeyboardOpen.value = 
        window.innerHeight < initialHeight - threshold
    })
  })
  
  return { isKeyboardOpen }
}
```

2. **Masquer la nav :**
```vue
<v-bottom-navigation
  v-show="!isKeyboardOpen"
>
```

### Problème : Safe areas iOS

**Solutions :**

1. **CSS env() :**
```css
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}

.top-bar {
  padding-top: env(safe-area-inset-top);
}
```

2. **Dans Vuetify :**
```vue
<v-app-bar
  :height="56 + safeAreaTop"
>

<script setup>
const safeAreaTop = ref(0)

onMounted(() => {
  const root = document.documentElement
  const style = getComputedStyle(root)
  safeAreaTop.value = parseInt(
    style.getPropertyValue('--sat') || 0
  )
})
</script>
```

### Problème : PWA ne se met pas à jour

**Solutions :**

1. **Forcer la mise à jour :**
```javascript
// registerServiceWorker.js
import { register } from 'register-service-worker'

register('/service-worker.js', {
  updated(registration) {
    console.log('Nouvelle version disponible')
    
    // Afficher notification
    if (confirm('Nouvelle version disponible. Recharger ?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }
})
```

2. **Version dans manifest :**
```json
// public/manifest.json
{
  "version": "2.0.0",
  "version_name": "Redesign"
}
```

---

## 6. 🔄 Problèmes de Migration

### Problème : Données localStorage incompatibles

**Solutions :**

1. **Migration des données :**
```javascript
// utils/dataMigration.js
export function migrateLocalStorage() {
  const oldData = localStorage.getItem('audits')
  
  if (oldData && !localStorage.getItem('audits_v2')) {
    try {
      const parsed = JSON.parse(oldData)
      const migrated = parsed.map(audit => ({
        ...audit,
        // Nouveaux champs
        version: 2,
        lighting: audit.lightingScore, // Renommer
        walkpath: audit.walkpathScore
      }))
      
      localStorage.setItem('audits_v2', JSON.stringify(migrated))
      localStorage.setItem('migration_done', 'true')
    } catch (e) {
      console.error('Migration failed:', e)
    }
  }
}
```

2. **Appeler au démarrage :**
```javascript
// main.js
import { migrateLocalStorage } from '@/utils/dataMigration'

migrateLocalStorage()
```

### Problème : Routes cassées après renommage

**Solutions :**

1. **Redirections :**
```javascript
// router/index.js
const routes = [
  // Nouvelle route
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  // Ancienne route redirige
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/intro',
    redirect: '/'
  }
]
```

2. **Alias pour compatibilité :**
```javascript
{
  path: '/',
  alias: ['/home', '/intro'],
  component: DashboardView
}
```

---

## 🆘 Debug Helpers

### Console debugging amélioré

```javascript
// utils/debug.js
export const debug = {
  log: (label, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `%c${label}`,
        'background: #F3C348; color: #181611; padding: 2px 8px; border-radius: 4px;',
        data
      )
    }
  },
  
  error: (label, error) => {
    console.error(
      `%c${label}`,
      'background: #F44336; color: white; padding: 2px 8px; border-radius: 4px;',
      error
    )
  },
  
  group: (label, fn) => {
    console.group(`🔍 ${label}`)
    fn()
    console.groupEnd()
  }
}

// Usage
debug.log('Audit Data', formData)
debug.group('API Call', () => {
  debug.log('Request', request)
  debug.log('Response', response)
})
```

### Vue DevTools helpers

```javascript
// Exposer des données pour debug
if (process.env.NODE_ENV === 'development') {
  window.__app_debug__ = {
    audits: allAudits,
    sync: syncQueue,
    reset: () => localStorage.clear()
  }
}
```

---

## 📞 Besoin d'Aide ?

1. **Vérifier la documentation**
   - [Vuetify 3](https://vuetifyjs.com/)
   - [Vue 3](https://vuejs.org/)
   - [MDI Icons](https://materialdesignicons.com/)

2. **Logs détaillés**
```bash
# Dev avec logs verbose
DEBUG=* npm run dev
```

3. **Issues GitHub**
   - Créer une issue avec :
     - Description du problème
     - Code minimal de reproduction
     - Screenshots si visuel
     - Logs de console

---

💡 **Astuce finale** : La plupart des problèmes viennent de :
- Cache navigateur (Ctrl+Shift+R)
- Node modules corrompus (`rm -rf node_modules && npm install`)
- Ordre d'import incorrect
- Oubli de redémarrer le serveur dev
