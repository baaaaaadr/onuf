# 🚀 Guide de Redesign ONUF PWA

> Plan complet et structuré pour la refonte visuelle de l'application ONUF  
> Version 1.0 - Décembre 2024

## 📋 Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [État Actuel vs Objectif](#2-état-actuel-vs-objectif)
3. [Stratégie de Migration](#3-stratégie-de-migration)
4. [Phases du Redesign](#4-phases-du-redesign)
5. [Tâches Détaillées](#5-tâches-détaillées)
6. [Guide d'Implémentation](#6-guide-dimplémentation)
7. [Checklist de Validation](#7-checklist-de-validation)

---

## 1. 🎯 Vue d'Ensemble

### 1.1 Contexte du Projet

**Application** : ONUF PWA - Audit de sécurité urbaine à Agadir  
**Stack Technique** : Vue.js 3 + Vuetify 3 + Supabase + PWA  
**Objectif** : Redesign complet pour améliorer l'UX et l'accessibilité visuelle

### 1.2 Objectifs du Redesign

1. **🎨 Moderniser l'interface** avec un design épuré et professionnel
2. **👁️ Privilégier le visuel** pour les utilisateurs peu alphabétisés
3. **📱 Optimiser l'expérience mobile** (utilisation terrain)
4. **🚀 Améliorer les performances** et la fluidité
5. **♿ Garantir l'accessibilité** universelle

### 1.3 Contraintes Techniques

- Conserver Vue.js 3 et Vuetify 3
- Maintenir la compatibilité PWA
- Préserver la logique métier existante
- Garder la stratégie Local-First
- Respecter l'architecture actuelle

### 1.4 Documents de Référence

- **Charte Graphique** : `CHARTE_GRAPHIQUE.md`
- **Contexte Technique** : `CONTEXTE_CONTINUATION.md`
- **Stratégie Data** : `STRATEGIE_LOCAL_FIRST.md`
- **Mockups** : Images fournies (3 écrans principaux)

---

## 2. 📊 État Actuel vs Objectif

### 2.1 Analyse de l'Existant

#### Écran Home (IntroView.vue)
**Actuel** :
- Template Vue.js par défaut
- Design générique avec gradient
- Icônes Material Design basiques
- Expansion panels pour l'aide GPS

**Problèmes** :
- ❌ Pas assez visuel
- ❌ Hiérarchie confuse
- ❌ Style daté

#### Écran Audit (AuditFormView.vue)
**Actuel** :
- Composant AuditSection custom
- Progress bar en haut
- Options avec icônes + texte
- Dialog debug complexe

**Problèmes** :
- ❌ Trop de texte
- ❌ Options peu visuelles
- ❌ Interface chargée

#### Écran Historique (AuditsHistoryView.vue)
**Actuel** :
- Cards avec ratings
- Statistiques en haut
- Filtres boutons toggle
- Actions multiples

**Problèmes** :
- ❌ Design incohérent
- ❌ Trop d'informations
- ❌ Navigation confuse

### 2.2 Vision Cible

#### 🏠 Dashboard (Nouveau Home)
- Statistiques visuelles en cards
- Actions rapides prominentes
- Statut sync/GPS clair
- Navigation bottom fixe

#### 📝 Nouvel Audit
- Options visuelles (emoji + label minimal)
- Sélection par cards tactiles
- Feedback immédiat
- Progression visuelle

#### 📊 Historique Audits
- Liste épurée avec infos essentielles
- Recherche simple
- Filtres visuels
- Actions contextuelles

---

## 3. 🔄 Stratégie de Migration

### 3.1 Approche Incrémentale

1. **Phase 1** : Configuration et fondations (1-2 jours)
2. **Phase 2** : Composants de base (2-3 jours)
3. **Phase 3** : Écrans principaux (3-4 jours)
4. **Phase 4** : Finitions et tests (2 jours)

### 3.2 Priorités

1. **Critique** : Navigation et structure
2. **Élevée** : Écran audit (cœur métier)
3. **Normale** : Dashboard et historique
4. **Basse** : Animations et polish

### 3.3 Compatibilité

- Garder les mêmes routes
- Préserver localStorage/IndexedDB
- Maintenir l'API Supabase
- Conserver la logique métier

---

## 4. 📅 Phases du Redesign

### Phase 1 : Fondations (Jours 1-2)

#### Objectifs
- ✅ Configurer le thème Vuetify
- ✅ Installer les polices et assets
- ✅ Créer la structure de navigation
- ✅ Définir les composants de base

#### Livrables
- `vuetify.js` configuré avec thème ONUF
- Layout principal avec navigation
- Composants Button, Card, Chip custom
- Variables CSS globales

### Phase 2 : Composants UI (Jours 3-4)

#### Objectifs
- ✅ Créer les composants réutilisables
- ✅ Implémenter le système d'icônes
- ✅ Développer les patterns d'interaction
- ✅ Tester l'accessibilité

#### Livrables
- `OptionCard.vue` - Sélection visuelle
- `StatCard.vue` - Affichage métriques
- `AuditCard.vue` - Item liste
- `BottomNav.vue` - Navigation

### Phase 3 : Écrans Principaux (Jours 5-8)

#### Objectifs
- ✅ Refondre les 3 vues principales
- ✅ Intégrer les nouveaux composants
- ✅ Optimiser pour mobile
- ✅ Connecter avec la logique existante

#### Livrables
- `DashboardView.vue` - Nouveau home
- `AuditFormView.vue` - Refonte complète
- `AuditsHistoryView.vue` - Liste modernisée
- Transitions entre écrans

### Phase 4 : Finitions (Jours 9-10)

#### Objectifs
- ✅ Animations et micro-interactions
- ✅ Optimisation performances
- ✅ Tests cross-browser
- ✅ Documentation

#### Livrables
- PWA manifest mis à jour
- Assets optimisés
- Guide utilisateur visuel
- Rapport de tests

---

## 5. 📝 Tâches Détaillées

### 5.1 Configuration Initiale

```javascript
// Tâche 1.1 : Configurer Vuetify Theme
// Fichier : src/plugins/vuetify.js

export default createVuetify({
  theme: {
    defaultTheme: 'onufLight',
    themes: {
      onufLight: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#F5F3F0',
          'surface-light': '#F8F7F5',
          primary: '#F3C348',
          'primary-darken-1': '#E5A716',
          secondary: '#837B67',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
          info: '#2196F3',
        }
      }
    }
  },
  defaults: {
    // Voir CHARTE_GRAPHIQUE.md section 10.1
  }
})
```

```css
/* Tâche 1.2 : Variables CSS Globales */
/* Fichier : src/assets/main.css */

:root {
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

### 5.2 Layout Principal

```vue
<!-- Tâche 2.1 : Nouveau Layout -->
<!-- Fichier : src/App.vue -->

<template>
  <v-app>
    <!-- Status Bar -->
    <v-app-bar 
      flat 
      color="background"
      height="56"
      class="onuf-header"
    >
      <template v-if="showBackButton" #prepend>
        <v-btn 
          icon="mdi-arrow-left" 
          @click="$router.back()"
        />
      </template>
      
      <v-app-bar-title class="text-center">
        {{ pageTitle }}
      </v-app-bar-title>
      
      <template #append>
        <v-btn 
          v-if="showSettingsButton"
          icon="mdi-cog" 
        />
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="onuf-main">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-if="showBottomNav"
      grow
      color="primary"
      height="64"
      class="onuf-bottom-nav"
    >
      <v-btn to="/" value="home">
        <v-icon>mdi-home{{ route.name === 'home' ? '' : '-outline' }}</v-icon>
        <span class="text-caption">Accueil</span>
      </v-btn>
      
      <v-btn to="/audit" value="audit">
        <v-icon>mdi-file-document{{ route.name === 'audit' ? '' : '-outline' }}</v-icon>
        <span class="text-caption">Audit</span>
      </v-btn>
      
      <v-btn to="/history" value="history">
        <v-icon>mdi-history</v-icon>
        <span class="text-caption">Historique</span>
      </v-btn>
    </v-bottom-navigation>

    <!-- FAB pour nouvel audit -->
    <v-fab
      v-if="showFab"
      color="primary"
      icon="mdi-plus"
      location="bottom end"
      size="large"
      class="onuf-fab"
      :style="{ bottom: '80px' }"
      @click="$router.push('/audit')"
    />
  </v-app>
</template>

<style scoped>
.onuf-header {
  border-bottom: 1px solid #E6E3DB;
}

.onuf-main {
  padding-bottom: 64px; /* Space for bottom nav */
}

.onuf-bottom-nav {
  border-top: 1px solid #E6E3DB;
}

.onuf-fab {
  transition: all 0.3s ease;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
```

### 5.3 Composants Réutilisables

```vue
<!-- Tâche 3.1 : Composant OptionCard -->
<!-- Fichier : src/components/OptionCard.vue -->

<template>
  <label 
    class="option-card"
    :class="{ 'option-card--selected': isSelected }"
    @click="$emit('select', option.value)"
  >
    <input 
      type="radio" 
      :value="option.value"
      :checked="isSelected"
      class="d-none"
    >
    <div class="option-content">
      <span class="option-emoji">{{ option.emoji }}</span>
      <span class="option-label">{{ option.text }}</span>
    </div>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  option: Object,
  modelValue: [Number, String],
})

const emit = defineEmits(['select'])

const isSelected = computed(() => 
  props.modelValue === props.option.value
)
</script>

<style scoped>
.option-card {
  display: block;
  border: 1px solid #E6E3DB;
  border-radius: 12px;
  padding: 12px 16px;
  min-height: 48px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.option-card:active {
  transform: scale(0.98);
  background: #F5F3F0;
}

.option-card--selected {
  border: 3px solid #F3C348;
  padding: 10px 14px;
  background: rgba(243, 195, 72, 0.05);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-emoji {
  font-size: 24px;
  line-height: 1;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #181611;
}
</style>
```

```vue
<!-- Tâche 3.2 : Composant StatCard -->
<!-- Fichier : src/components/StatCard.vue -->

<template>
  <v-card 
    class="stat-card" 
    :color="color || 'surface'"
    flat
  >
    <v-card-text class="pa-4">
      <div class="stat-label text-body-2 mb-2">
        {{ label }}
      </div>
      <div class="stat-value text-h4 font-weight-bold">
        {{ value }}
      </div>
      <div v-if="subtitle" class="stat-subtitle text-caption mt-1">
        {{ subtitle }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  subtitle: String,
  color: String
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  text-align: center;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label {
  color: #837B67;
  font-weight: 500;
}

.stat-value {
  color: #181611;
  line-height: 1.2;
}

.stat-subtitle {
  color: #837B67;
}
</style>
```

### 5.4 Refonte des Écrans

```vue
<!-- Tâche 4.1 : Nouveau Dashboard -->
<!-- Fichier : src/views/DashboardView.vue -->

<template>
  <v-container class="dashboard-view pa-4">
    <!-- Stats Grid -->
    <v-row class="mb-4">
      <v-col cols="6">
        <stat-card
          label="Audits Réalisés"
          :value="stats.totalAudits"
          color="surface"
        />
      </v-col>
      <v-col cols="6">
        <stat-card
          label="Score Moyen"
          :value="`${stats.averageScore}/100`"
          color="surface"
        />
      </v-col>
    </v-row>
    
    <v-row class="mb-6">
      <v-col cols="12">
        <stat-card
          label="Dernier Audit"
          :value="stats.lastAuditDate"
          color="surface"
        />
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <h2 class="text-h6 font-weight-bold mb-3">Actions Rapides</h2>
    <div class="actions-grid mb-6">
      <v-btn
        color="primary"
        size="large"
        block
        rounded="pill"
        @click="$router.push('/audit')"
      >
        Démarrer un Audit
      </v-btn>
      
      <v-btn
        color="surface"
        size="large"
        block
        rounded="pill"
        class="mt-3"
        @click="$router.push('/history')"
      >
        Voir l'Historique
      </v-btn>
    </div>

    <!-- Status Section -->
    <h2 class="text-h6 font-weight-bold mb-3">Statut Sync</h2>
    <v-list class="status-list">
      <v-list-item>
        <template #prepend>
          <v-icon color="success">mdi-cloud-check</v-icon>
        </template>
        <v-list-item-title>Synchronisation Cloud</v-list-item-title>
        <template #append>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-list-item>
      
      <v-list-item>
        <v-list-item-title>Dernière Sync</v-list-item-title>
        <template #append>
          <span class="text-body-2">{{ lastSync }}</span>
        </template>
      </v-list-item>
    </v-list>

    <!-- GPS Status -->
    <h2 class="text-h6 font-weight-bold mb-3 mt-6">Statut GPS</h2>
    <v-list class="status-list">
      <v-list-item>
        <v-list-item-title>Précision GPS</v-list-item-title>
        <template #append>
          <span class="text-body-2 text-success">Élevée</span>
        </template>
      </v-list-item>
      
      <v-list-item>
        <v-list-item-title>Connectivité Réseau</v-list-item-title>
        <template #append>
          <span class="text-body-2 text-success">Connecté</span>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style scoped>
.dashboard-view {
  max-width: 428px;
  margin: 0 auto;
}

.status-list {
  background: #F5F3F0;
  border-radius: 12px;
  padding: 0;
}

.status-list .v-list-item {
  min-height: 56px;
}
</style>
```

### 5.5 Guide de Migration Vue

```javascript
// Tâche 5.1 : Script de migration
// Fichier : migrate-views.js

const migrations = {
  // Remplacer HomeView par DashboardView
  'src/router/index.js': {
    from: "import HomeView from '../views/HomeView.vue'",
    to: "import DashboardView from '../views/DashboardView.vue'"
  },
  
  // Mettre à jour les routes
  'src/router/index.js': {
    from: "component: HomeView",
    to: "component: DashboardView"
  },
  
  // Renommer IntroView
  'src/views/IntroView.vue': {
    rename: 'src/views/OnboardingView.vue'
  }
}
```

---

## 6. 🛠️ Guide d'Implémentation

### 6.1 Structure des Fichiers

```
src/
├── assets/
│   ├── fonts/           # Police Inter
│   ├── icons/           # Icônes custom si nécessaire
│   └── styles/
│       ├── main.css     # Styles globaux
│       └── variables.css # Variables CSS
├── components/
│   ├── common/
│   │   ├── OptionCard.vue
│   │   ├── StatCard.vue
│   │   └── LoadingState.vue
│   ├── audit/
│   │   ├── AuditSection.vue
│   │   ├── PhotoCapture.vue
│   │   └── ProgressBar.vue
│   └── navigation/
│       └── BottomNav.vue
├── views/
│   ├── DashboardView.vue    # Nouveau home
│   ├── AuditFormView.vue    # Refonte
│   └── AuditsHistoryView.vue # Refonte
└── plugins/
    └── vuetify.js           # Config thème
```

### 6.2 Conventions de Code

```javascript
// Naming conventions pour les classes CSS
.onuf-[component]        // Prefix global
.onuf-[component]--[modifier]  // Modificateur
.onuf-[component]__[element]   // Élément enfant

// Exemples
.onuf-card
.onuf-card--selected
.onuf-card__title

// Props communes pour composants
{
  variant: 'primary' | 'secondary' | 'surface',
  size: 'small' | 'medium' | 'large',
  rounded: boolean | 'sm' | 'md' | 'lg' | 'pill',
  elevation: 0 | 1 | 2
}
```

### 6.3 Patterns Vue 3 Composition API

```vue
<script setup>
// Structure recommandée
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudits } from '@/composables/useAudits'

// Props & Emits
const props = defineProps({
  // ...
})
const emit = defineEmits(['update', 'delete'])

// State
const localState = ref(null)

// Computed
const computedValue = computed(() => {
  // ...
})

// Methods
const handleAction = () => {
  // ...
}

// Lifecycle
onMounted(() => {
  // ...
})
</script>
```

---

## 7. ✅ Checklist de Validation

### 7.1 Avant Chaque Commit

- [ ] Code formaté avec Prettier
- [ ] Pas d'erreurs ESLint
- [ ] Composants testés sur mobile
- [ ] Accessibilité vérifiée (contrastes, zones tactiles)
- [ ] Performance acceptable (< 3s chargement)

### 7.2 Par Phase

#### Phase 1 - Fondations
- [ ] Thème Vuetify configuré
- [ ] Police Inter installée
- [ ] Variables CSS définies
- [ ] Layout principal créé
- [ ] Navigation fonctionnelle

#### Phase 2 - Composants
- [ ] OptionCard responsive
- [ ] StatCard avec props
- [ ] AuditCard optimisé
- [ ] Tous les états gérés (loading, error, empty)

#### Phase 3 - Écrans
- [ ] DashboardView complet
- [ ] AuditFormView refait
- [ ] AuditsHistoryView modernisé
- [ ] Transitions fluides
- [ ] Données connectées

#### Phase 4 - Finitions
- [ ] Animations subtiles
- [ ] Feedback tactile
- [ ] Mode offline géré
- [ ] PWA manifest à jour
- [ ] Tests cross-browser

### 7.3 Critères d'Acceptation

1. **Performance**
   - First Contentful Paint < 1.5s
   - Time to Interactive < 3s
   - Lighthouse score > 90

2. **Accessibilité**
   - WCAG 2.1 niveau AA
   - Zones tactiles ≥ 44px
   - Contrastes validés

3. **Compatibilité**
   - iOS Safari 14+
   - Chrome Android 90+
   - Mode offline fonctionnel

4. **UX**
   - Navigation intuitive
   - Feedback immédiat
   - États d'erreur clairs
   - Chargements non bloquants

---

## 🚀 Prochaines Étapes

1. **Valider** ce guide avec l'équipe
2. **Créer** une branche `feature/redesign-v2`
3. **Commencer** par la Phase 1
4. **Documenter** les décisions prises
5. **Tester** avec de vrais utilisateurs

---

## 📚 Ressources

- [Vuetify 3 Documentation](https://vuetifyjs.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Material Design 3](https://m3.material.io/)
- [Phosphor Icons](https://phosphoricons.com/)
- [Web.dev Performance](https://web.dev/performance/)

---

**Note** : Ce guide est un document vivant. Mettez-le à jour au fur et à mesure de l'avancement du projet pour refléter les décisions prises et les apprentissages.