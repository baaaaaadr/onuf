# 🔄 Guide de Migration Visuelle ONUF

> Guide pas à pas pour migrer l'interface actuelle vers le nouveau design  
> Version 1.0 - Décembre 2024

## 📋 Sommaire

1. [Préparation](#1-préparation)
2. [Configuration Vuetify](#2-configuration-vuetify)
3. [Migration par Composant](#3-migration-par-composant)
4. [Migration des Vues](#4-migration-des-vues)
5. [Tests et Validation](#5-tests-et-validation)
6. [Rollback Plan](#6-rollback-plan)

---

## 1. 🛠️ Préparation

### 1.1 Checklist Pré-Migration

- [ ] **Backup complet** du projet actuel
- [ ] **Créer branche** `feature/redesign-v2`
- [ ] **Installer dépendances** nécessaires
- [ ] **Documenter** l'état actuel (screenshots)
- [ ] **Tester** que tout fonctionne avant migration

### 1.2 Structure des Branches

```bash
main
├── develop
│   └── feature/redesign-v2
│       ├── redesign/config    # Configuration Vuetify
│       ├── redesign/components # Nouveaux composants
│       └── redesign/views      # Nouvelles vues
```

### 1.3 Installation des Dépendances

```bash
# Police Inter
npm install @fontsource/inter

# Icônes supplémentaires si besoin
npm install @mdi/font
```

---

## 2. ⚙️ Configuration Vuetify

### 2.1 Mise à jour du fichier `src/plugins/vuetify.js`

```javascript
// src/plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Thème ONUF
const onufLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F5F3F0',
    'surface-light': '#F8F7F5',
    'surface-variant': '#E6E3DB',
    primary: '#F3C348',
    'primary-darken-1': '#E5A716',
    'primary-lighten-1': '#F9D876',
    secondary: '#837B67',
    'secondary-darken-1': '#6A6356',
    success: '#4CAF50',
    'success-lighten-5': '#E8F5E9',
    warning: '#FF9800',
    'warning-lighten-5': '#FFF3E0',
    error: '#F44336',
    'error-lighten-5': '#FFEBEE',
    info: '#2196F3',
    'info-lighten-5': '#E3F2FD',
    'on-background': '#181611',
    'on-surface': '#181611',
    'on-primary': '#181611',
    'grey-lighten-5': '#FAFAFA',
    'grey-lighten-4': '#F5F5F5',
    'grey-lighten-3': '#EEEEEE',
    'grey-lighten-2': '#E0E0E0',
    'grey-lighten-1': '#BDBDBD',
    'grey': '#9E9E9E',
    'grey-darken-1': '#837B67',
    'grey-darken-2': '#616161',
    'grey-darken-3': '#424242',
    'grey-darken-4': '#212121',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'onufLight',
    themes: {
      onufLight: onufLightTheme
    }
  },
  defaults: {
    global: {
      ripple: true,
    },
    VApp: {
      style: 'background: var(--v-theme-background);'
    },
    VBtn: {
      rounded: 'pill',
      elevation: 0,
      height: 48,
      class: 'text-none font-weight-semibold',
      style: 'letter-spacing: 0.5px;'
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
      color: 'surface',
      class: 'overflow-hidden'
    },
    VChip: {
      rounded: 'pill',
      size: 'small',
      elevation: 0
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg'
    },
    VList: {
      rounded: 'lg',
      elevation: 0
    },
    VListItem: {
      rounded: 'lg',
      minHeight: 56
    },
    VProgressLinear: {
      rounded: true,
      height: 8
    },
    VProgressCircular: {
      width: 4
    },
    VBottomNavigation: {
      elevation: 0,
      height: 64
    },
    VAppBar: {
      elevation: 0,
      height: 56
    },
    VDialog: {
      maxWidth: 500,
      width: 'calc(100% - 32px)'
    },
    VSnackbar: {
      location: 'top',
      rounded: 'pill',
      variant: 'elevated',
      elevation: 3
    }
  }
})
```

### 2.2 Variables CSS Globales

```css
/* src/assets/styles/variables.css */
:root {
  /* Spacing System (4px base) */
  --spacing-unit: 4px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 9999px;
  
  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.16);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
  
  /* Z-index Scale */
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  
  /* Breakpoints */
  --screen-xs: 320px;
  --screen-sm: 375px;
  --screen-md: 428px;
  --screen-lg: 768px;
  --screen-xl: 1024px;
}

/* Utility Classes */
.onuf-container {
  width: 100%;
  max-width: var(--screen-md);
  margin: 0 auto;
  padding: var(--spacing-md);
}

.onuf-safe-area-padding {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Animations */
@keyframes onuf-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes onuf-slide-up {
  from { 
    opacity: 0;
    transform: translateY(var(--spacing-md));
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes onuf-scale-in {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Touch Feedback */
.onuf-touchable {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  cursor: pointer;
}

.onuf-touchable:active {
  transform: scale(0.98);
  opacity: 0.9;
}
```

### 2.3 Import des Styles

```javascript
// src/main.js
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import './assets/styles/variables.css'
import './assets/styles/transitions.css'
import './assets/main.css'
```

---

## 3. 🧩 Migration par Composant

### 3.1 Ordre de Migration

1. **Composants de base** (boutons, cards, chips)
2. **Composants de formulaire** (inputs, selects)
3. **Composants métier** (AuditSection, PhotoCapture)
4. **Layout** (navigation, header)
5. **Vues complètes**

### 3.2 Mapping Ancien → Nouveau

| Ancien Composant | Nouveau Composant | Changements Clés |
|-----------------|-------------------|------------------|
| `AuditSection.vue` | `AuditSectionNew.vue` | Options visuelles avec emojis |
| `v-btn` standard | `v-btn` customisé | Rounded pill, hauteur 48px |
| `v-card` standard | `StatCard.vue` | Design épuré, props typées |
| `v-expansion-panels` | `v-card` simple | Plus de complexité inutile |
| `v-rating` | `OptionCard.vue` | Sélection par cards tactiles |

### 3.3 Script de Migration Automatique

```javascript
// scripts/migrate-components.js
const fs = require('fs')
const path = require('path')

const replacements = [
  // Remplacer les anciens boutons
  {
    from: /<v-btn\s+color="primary">/g,
    to: '<v-btn color="primary" rounded="pill" size="large">'
  },
  // Remplacer les ratings
  {
    from: /<v-rating\s+v-model="(.+?)"\s+length="4"/g,
    to: '<option-card v-model="$1" :options="options"'
  },
  // Ajouter les classes Vuetify
  {
    from: /<v-card>/g,
    to: '<v-card flat>'
  }
]

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to)
  })
  
  fs.writeFileSync(filePath, content)
  console.log(`✅ Migrated: ${filePath}`)
}

// Exécuter sur tous les fichiers Vue
function migrateAll(dir) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      migrateAll(fullPath)
    } else if (file.endsWith('.vue')) {
      migrateFile(fullPath)
    }
  })
}

// Lancer la migration
migrateAll('./src')
```

---

## 4. 📱 Migration des Vues

### 4.1 IntroView → DashboardView

**Étapes :**

1. **Renommer** `IntroView.vue` en `DashboardView.vue`
2. **Copier** le template depuis `VUES_TEMPLATES.md`
3. **Adapter** la logique métier existante
4. **Tester** les fonctionnalités

**Mapping des données :**

```javascript
// Ancien
data() {
  return {
    totalAudits: 0,
    averageScore: 0,
    lastSync: null
  }
}

// Nouveau
const stats = computed(() => ({
  totalAudits: allAudits.value.length,
  averageScore: calculateAverageScore(allAudits.value),
  lastSync: formatDate(lastSyncTime.value)
}))
```

### 4.2 AuditFormView - Refonte

**Changements majeurs :**

1. **Structure** : Sections visuelles au lieu de v-expansion-panels
2. **Sélection** : OptionCard au lieu de v-rating
3. **Photos** : Composant dédié avec compression
4. **Validation** : Visuelle avec progress bar

**Migration du v-model :**

```vue
<!-- Ancien -->
<v-rating 
  v-model="lightingScore" 
  length="4"
/>

<!-- Nouveau -->
<option-card
  v-for="option in lightingOptions"
  :key="option.value"
  :option="option"
  v-model="formData.lighting"
/>
```

### 4.3 AuditsHistoryView - Modernisation

**Améliorations :**

1. **Filtres** : Chips visuels au lieu de boutons
2. **Cards** : AuditCard enrichi avec preview scores
3. **Actions** : Contextual menu au lieu de boutons multiples
4. **Recherche** : Champ unique en haut

---

## 5. ✅ Tests et Validation

### 5.1 Tests Unitaires Composants

```javascript
// tests/unit/components/OptionCard.spec.js
import { mount } from '@vue/test-utils'
import OptionCard from '@/components/common/OptionCard.vue'

describe('OptionCard', () => {
  const option = {
    value: 1,
    text: 'Faible',
    emoji: '🌒'
  }
  
  it('renders option correctly', () => {
    const wrapper = mount(OptionCard, {
      props: { option, modelValue: null }
    })
    
    expect(wrapper.find('.option-emoji').text()).toBe('🌒')
    expect(wrapper.find('.option-label').text()).toBe('Faible')
  })
  
  it('shows selected state', () => {
    const wrapper = mount(OptionCard, {
      props: { option, modelValue: 1 }
    })
    
    expect(wrapper.classes()).toContain('option-card--selected')
  })
  
  it('emits update on click', async () => {
    const wrapper = mount(OptionCard, {
      props: { option, modelValue: null }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([1])
  })
})
```

### 5.2 Tests E2E

```javascript
// tests/e2e/specs/audit-flow.js
describe('Audit Flow', () => {
  it('completes full audit', () => {
    cy.visit('/audit')
    
    // Localisation
    cy.contains('📍 Localisation').should('be.visible')
    cy.get('[data-cy=locate-btn]').click()
    cy.contains('Précision').should('be.visible')
    
    // Sélection options
    cy.contains('💡 Éclairage').should('be.visible')
    cy.get('[data-cy=option-lighting-3]').click()
    cy.get('[data-cy=option-lighting-3]').should('have.class', 'option-card--selected')
    
    // Photos
    cy.get('[data-cy=photo-capture]').click()
    cy.get('input[type=file]').attachFile('test-image.jpg')
    cy.contains('1 photo').should('be.visible')
    
    // Soumission
    cy.get('[data-cy=submit-audit]').click()
    cy.contains('Audit enregistré').should('be.visible')
  })
})
```

### 5.3 Checklist de Test Manuel

#### Mobile (iOS/Android)
- [ ] Navigation bottom fonctionne
- [ ] Zones tactiles >= 44px
- [ ] Pas de scroll horizontal
- [ ] Clavier ne cache pas les inputs
- [ ] GPS fonctionne correctement
- [ ] Camera capture fonctionne
- [ ] Mode offline opérationnel

#### Desktop/Tablet
- [ ] Layout responsive centré
- [ ] Hover states fonctionnels
- [ ] Navigation adaptée
- [ ] Pas d'éléments trop grands

#### Accessibilité
- [ ] Navigation clavier possible
- [ ] Screen reader compatible
- [ ] Contrastes WCAG AA
- [ ] Focus visible
- [ ] Labels ARIA présents

#### Performance
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] Animations 60fps
- [ ] Pas de layout shifts
- [ ] Images optimisées

---

## 6. 🔄 Rollback Plan

### 6.1 Points de Sauvegarde

1. **Tag Git** avant migration : `git tag pre-redesign-v2`
2. **Backup** base de données locale
3. **Export** préférences utilisateur
4. **Screenshots** état actuel

### 6.2 Procédure de Rollback

```bash
# Si problème critique
git checkout pre-redesign-v2
npm install
npm run build

# Si problème partiel
git revert <commit-hash>
```

### 6.3 Migration Progressive

Pour minimiser les risques, migrer par étapes :

1. **Semaine 1** : Config + Composants base
2. **Semaine 2** : Dashboard uniquement
3. **Semaine 3** : Formulaire audit
4. **Semaine 4** : Historique + finitions

Activer via feature flag :

```javascript
// config/features.js
export const FEATURES = {
  NEW_DESIGN: process.env.VUE_APP_NEW_DESIGN === 'true'
}

// Dans les composants
<template>
  <component 
    :is="FEATURES.NEW_DESIGN ? 'DashboardView' : 'IntroView'"
  />
</template>
```

---

## 🚀 Commandes Utiles

```bash
# Développement avec hot-reload
npm run dev

# Build de production
npm run build

# Analyser la taille du bundle
npm run build -- --report

# Linter et fix
npm run lint -- --fix

# Tests unitaires
npm run test:unit

# Tests E2E
npm run test:e2e

# Audit Lighthouse
npm run lighthouse
```

---

## 📚 Ressources

- [Guide Vuetify Migration](https://vuetifyjs.com/en/getting-started/upgrade-guide/)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Material Design 3](https://m3.material.io/)
- [Web Vitals](https://web.dev/vitals/)

---

Ce guide vous accompagne étape par étape dans la migration visuelle. N'hésitez pas à l'adapter selon vos besoins spécifiques !
