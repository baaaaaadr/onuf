# 🎨 Charte Graphique - ONUF Safety Audit

> Guide visuel et règles de design pour l'application ONUF PWA  
> Version 1.0 - Décembre 2024

## 1. 🎯 Philosophie & Principes de Design

### 1.1 Vision
Une application **claire**, **intuitive** et **accessible** pour tous les agents de terrain, indépendamment de leur niveau d'alphabétisation. Le design privilégie les **indicateurs visuels** et les **icônes expressives** plutôt que le texte.

### 1.2 Principes Fondamentaux

#### 🎯 **Simplicité Radicale**
- Interface épurée avec focus sur l'essentiel
- Hiérarchie visuelle forte
- Pas de décorations superflues

#### 👁️ **Visuel d'Abord**
- Icônes et emojis comme langage principal
- Couleurs significatives pour les états
- Feedback visuel immédiat

#### 📱 **Mobile-First**
- Optimisé pour utilisation d'une main
- Zones tactiles généreuses (min 44px)
- Scrolling vertical naturel

#### 🌍 **Accessibilité Universelle**
- Contrastes élevés pour lisibilité extérieure
- Pictogrammes universels
- Support multi-langue prévu

## 2. 🎨 Palette de Couleurs

### 2.1 Couleurs Principales

```scss
// ✅ MISE À JOUR: Nouvelle couleur primaire - Bleu ONUF
$primary-blue: #125EB8;        // Bleu primaire - CTAs principaux
$primary-blue-light: #1976D2;  // Hover/Focus
$primary-blue-dark: #0D47A1;   // Active/Pressed

// Couleur Accent - Or/Jaune (ex-primaire)
$accent-gold: #CBA052;         // Jaune doré - Accents et highlights
$accent-gold-light: #FFD54F;   // Variant clair
$accent-gold-dark: #F57C00;    // Variant foncé

// Couleurs de Base
$background-main: #FFFFFF;     // Fond principal
$surface-light: #F5F3F0;       // Cartes et conteneurs
$surface-lighter: #F8F7F5;     // Fond alternatif

// Textes
$text-primary: #181611;        // Texte principal (quasi-noir)
$text-secondary: #837B67;      // Texte secondaire/labels
$text-disabled: #C4BFB3;       // Texte désactivé

// Bordures et Séparateurs
$border-light: #E6E3DB;        // Bordures subtiles
$border-selected: #125EB8;     // Bordure sélection bleue (3px)
```

### 2.2 Couleurs Sémantiques

```scss
// États et Feedback
$success-green: #4CAF50;     // Validation, succès
$warning-orange: #FF9800;    // Avertissement
$error-red: #F44336;         // Erreur, danger
$info-blue: #2196F3;         // Information

// Scores Visuels (1-4)
$score-1: #9E9E9E;          // Très mauvais (gris)
$score-2: #F44336;          // Mauvais (rouge)
$score-3: #FF9800;          // Moyen (orange)
$score-4: #4CAF50;          // Bon (vert)
```

### 2.3 Dégradés et Ombres

```scss
// Ombres (très subtiles)
$shadow-card: 0 2px 4px rgba(0, 0, 0, 0.05);
$shadow-button: 0 4px 8px rgba(0, 0, 0, 0.1);
$shadow-fab: 0 6px 12px rgba(0, 0, 0, 0.15);

// Pas de dégradés - flat design
```

## 3. 📝 Typographie

### 3.1 Police Principale

**Inter** - Police sans-serif moderne et lisible
- Excellent rendu sur écrans
- Support multilingue complet
- Poids disponibles : 400, 500, 600, 700

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 3.2 Échelle Typographique

```scss
// Titres
$h1: 24px / 700 / 1.2;      // Titre principal écran
$h2: 20px / 700 / 1.3;      // Sections principales  
$h3: 18px / 600 / 1.4;      // Sous-sections

// Corps de texte
$body-large: 16px / 400 / 1.5;   // Texte principal
$body-normal: 14px / 400 / 1.5;  // Texte standard
$body-small: 12px / 400 / 1.4;   // Petites infos

// Éléments UI
$button-text: 16px / 600 / 1;    // Boutons
$label: 12px / 500 / 1.2;        // Labels et badges
$caption: 11px / 400 / 1.3;      // Mentions légales
```

## 4. 📐 Grille et Espacement

### 4.1 Système de Grille

Basé sur une unité de **4px** pour cohérence parfaite :

```scss
$spacing-unit: 4px;

// Échelle d'espacement
$spacing-xs: 4px;   // 1 unit
$spacing-sm: 8px;   // 2 units
$spacing-md: 16px;  // 4 units
$spacing-lg: 24px;  // 6 units
$spacing-xl: 32px;  // 8 units
$spacing-2xl: 48px; // 12 units
```

### 4.2 Layout Mobile

```scss
// Conteneur principal
.container {
  padding: 16px;
  max-width: 428px; // iPhone 14 Pro Max
  margin: 0 auto;
}

// Marges sections
.section {
  margin-bottom: 24px;
}

// Espacement entre éléments
.gap-xs { gap: 4px; }
.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
```

## 5. 🧩 Composants UI

### 5.1 Boutons

#### Bouton Primaire (CTA)
```scss
.btn-primary {
  background: $primary-blue;         // ✅ Bleu primaire
  color: $text-primary;
  border-radius: 9999px;             // Pilule
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  min-height: 48px;
  box-shadow: $shadow-button;
  
  &:active {
    transform: scale(0.98);
  }
}
```

#### Bouton Secondaire
```scss
.btn-secondary {
  background: $surface-light;
  color: $text-primary;
  border-radius: 9999px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
}
```

#### Bouton Flottant (FAB)
```scss
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $primary-blue;         // ✅ Bleu primaire
  box-shadow: $shadow-fab;
  
  // Forme ovale pour mobile
  @media (max-width: 428px) {
    width: 56px;
    height: 56px;
    border-radius: 28px 28px 8px 28px;
  }
}
```

### 5.2 Cartes d'Options (Radio Visual)

```scss
.option-card {
  border: 1px solid $border-light;
  border-radius: 12px;
  padding: 12px 16px;
  min-height: 44px;
  transition: all 0.2s ease;
  
  &.selected {
    border: 3px solid $primary-blue;     // ✅ Bordure bleue
    padding: 10px 14px;                  // Compenser la bordure
    background: rgba($primary-blue, 0.05); // ✅ Fond bleu très léger
  }
  
  &:active {
    transform: scale(0.98);
    background: $surface-light;
  }
}
```

### 5.3 Cartes d'Information

```scss
.info-card {
  background: $surface-light;
  border-radius: 12px;
  padding: 16px;
  
  .card-icon {
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }
  
  .card-value {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }
  
  .card-label {
    font-size: 14px;
    color: $text-secondary;
  }
}
```

### 5.4 Navigation Bottom

```scss
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid $border-light;
  display: flex;
  justify-content: space-around;
  align-items: center;
  
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    
    &.active {
      color: $text-primary;
      
      .nav-icon {
        background: $primary-gold;
        border-radius: 8px;
        padding: 4px;
      }
    }
    
    &:not(.active) {
      color: $text-secondary;
    }
  }
}
```

## 6. 🎭 Iconographie et Visuels

### 6.1 Système d'Icônes

**Bibliothèque principale** : Phosphor Icons
- Style : Regular (outline)
- Taille standard : 24px
- Taille petite : 20px
- Taille grande : 32px

### 6.2 Emojis comme Langage

Les emojis sont utilisés systématiquement pour améliorer la compréhension :

```javascript
// Sections d'audit
const sectionIcons = {
  lighting: '💡',
  pathways: '🚶',
  security: '🔒',
  community: '👥',
  environment: '🌳',
  housing: '🏠'
}

// États et feedback
const stateIcons = {
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  location: '📍',
  camera: '📸'
}

// Scores visuels (1-4)
const scoreEmojis = {
  1: '😰', // Très mauvais
  2: '😟', // Mauvais  
  3: '😐', // Moyen
  4: '😊'  // Bon
}
```

## 7. 📱 Patterns d'Interaction

### 7.1 Feedback Tactile

```scss
// Tous les éléments interactifs
.interactive {
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  &:active {
    transform: scale(0.96);
    opacity: 0.8;
  }
}

// Sélection d'options
.selectable {
  &.selected {
    animation: pulse 0.3s ease;
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### 7.2 États de Chargement

```scss
.loading-state {
  // Skeleton screens pour les cartes
  .skeleton {
    background: linear-gradient(
      90deg,
      $surface-light 0%,
      $surface-lighter 50%,
      $surface-light 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 8. 🌐 Adaptations Responsive

### 8.1 Breakpoints

```scss
// Mobile first
$mobile-sm: 320px;  // Petits téléphones
$mobile: 375px;     // iPhone standard
$mobile-lg: 428px;  // Grands téléphones
$tablet: 768px;     // Tablettes
$desktop: 1024px;   // Desktop (non prioritaire)
```

### 8.2 Règles Responsive

```scss
// Tailles de police adaptatives
@media (max-width: $mobile-sm) {
  body { font-size: 14px; }
  .h1 { font-size: 20px; }
  .button { min-height: 44px; }
}

// Padding adaptatif
.container {
  padding: 16px;
  
  @media (min-width: $tablet) {
    padding: 24px;
    max-width: 600px;
  }
}
```

## 9. ♿ Accessibilité

### 9.1 Contrastes Minimum

- Texte normal : ratio 4.5:1
- Texte large : ratio 3:1
- Éléments UI : ratio 3:1

### 9.2 Zones Tactiles

- Minimum : 44x44px
- Recommandé : 48x48px
- Espacement entre zones : min 8px

### 9.3 Alternatives Textuelles

```html
<!-- Toujours fournir un texte alternatif -->
<button aria-label="Prendre une photo">
  <span aria-hidden="true">📸</span>
  <span class="visually-hidden">Prendre une photo</span>
</button>
```

## 10. 🚀 Implémentation Vuetify

### 10.1 Configuration du Thème

```javascript
// src/plugins/vuetify.js
export default createVuetify({
  theme: {
    defaultTheme: 'onufLight',
    themes: {
      onufLight: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#F5F3F0',
          primary: '#125EB8',        // ✅ Bleu primaire
          accent: '#CBA052',         // ✅ Or/Jaune accent
          secondary: '#837B67',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
          info: '#2196F3',
          'on-background': '#181611',
          'on-surface': '#181611',
          'on-primary': '#FFFFFF',   // ✅ Texte blanc sur bleu
        }
      }
    }
  },
  defaults: {
    VBtn: {
      rounded: 'pill',
      elevation: 0,
      height: 48,
      class: 'font-weight-semibold'
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
      color: 'surface'
    },
    VChip: {
      rounded: 'pill',
      size: 'small'
    }
  }
})
```

## 11. 📊 Exemples d'Application

### 11.1 Card d'Audit

```vue
<v-card class="audit-card pa-4 mb-3">
  <div class="d-flex justify-space-between align-center mb-3">
    <div>
      <div class="d-flex align-center gap-2">
        <v-icon color="grey">mdi-cloud-check</v-icon>
        <h3 class="text-body-1 font-weight-semibold">
          Audit #12345
        </h3>
      </div>
      <p class="text-caption text-secondary mt-1">
        Score Global: 85 • Agadir, Morocco
      </p>
    </div>
    <v-icon>mdi-chevron-down</v-icon>
  </div>
</v-card>
```

### 11.2 Bouton d'Option

```vue
<label class="option-card">
  <input 
    type="radio" 
    v-model="lighting" 
    :value="2"
    class="d-none"
  >
  <div class="d-flex align-center gap-2">
    <span class="text-h6">🌒</span>
    <span class="text-body-2">Faible</span>
  </div>
</label>
```

## 12. 🎯 Checklist de Conformité

Avant chaque déploiement, vérifier :

- [ ] Contrastes de couleurs respectés
- [ ] Zones tactiles ≥ 44px
- [ ] Textes alternatifs présents
- [ ] Animations respectueuses (reduced-motion)
- [ ] Performance < 3s premier affichage
- [ ] Poids des images optimisé
- [ ] Police Inter chargée correctement
- [ ] Thème Vuetify configuré
- [ ] Emojis cohérents avec la charte
- [ ] Responsive testé sur mobile réel

---

Cette charte est un document vivant qui évoluera avec les besoins du projet et les retours utilisateurs.