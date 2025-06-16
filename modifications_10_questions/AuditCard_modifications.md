# Modifications pour AuditCard.vue

## 1. Remplacer le computed globalScore

```javascript
// Score global
const globalScore = computed(() => {
  const scores = [
    props.audit.lighting,
    props.audit.walkpath,
    props.audit.openness,
    props.audit.feeling,
    props.audit.people_presence || props.audit.peoplePresence,
    props.audit.cleanliness,
    props.audit.natural_surveillance || props.audit.naturalSurveillance,
    props.audit.space_diversity || props.audit.spaceDiversity,
    props.audit.transport_access || props.audit.transportAccess,
    props.audit.formal_security || props.audit.formalSecurity
  ].filter(score => score > 0)
  
  if (scores.length === 0) return 0
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
})
```

## 2. Optionnel : Si vous voulez afficher plus de critères dans la carte

Actuellement, la carte n'affiche que 3 critères (éclairage, cheminement, ressenti). Si vous voulez en afficher plus, vous pouvez modifier :

```javascript
// Items de score avec emojis - afficher 6 critères principaux
const scoreItems = computed(() => [
  { 
    key: 'lighting', 
    emoji: '💡', 
    value: props.audit.lighting || 0,
    color: getScoreColor(props.audit.lighting || 0)
  },
  { 
    key: 'walkpath', 
    emoji: '🚶', 
    value: props.audit.walkpath || 0,
    color: getScoreColor(props.audit.walkpath || 0)
  },
  { 
    key: 'feeling', 
    emoji: '😊', 
    value: props.audit.feeling || 0,
    color: getScoreColor(props.audit.feeling || 0)
  },
  { 
    key: 'natural_surveillance', 
    emoji: '👁️‍🗨️', 
    value: props.audit.natural_surveillance || props.audit.naturalSurveillance || 0,
    color: getScoreColor(props.audit.natural_surveillance || props.audit.naturalSurveillance || 0)
  },
  { 
    key: 'transport_access', 
    emoji: '🚌', 
    value: props.audit.transport_access || props.audit.transportAccess || 0,
    color: getScoreColor(props.audit.transport_access || props.audit.transportAccess || 0)
  },
  { 
    key: 'formal_security', 
    emoji: '👮', 
    value: props.audit.formal_security || props.audit.formalSecurity || 0,
    color: getScoreColor(props.audit.formal_security || props.audit.formalSecurity || 0)
  }
])
```

Et dans le template, ajuster si nécessaire :

```vue
<!-- Section des scores visuels -->
<div class="scores-visual mb-2">
  <div class="score-item" v-for="item in scoreItems.slice(0, 6)" :key="item.key">
    <span class="score-emoji">{{ item.emoji }}</span>
    <div class="score-dots">
      <span 
        v-for="n in 4" 
        :key="n"
        class="score-dot"
        :class="{ 'score-dot--filled': n <= item.value }"
        :style="{ backgroundColor: n <= item.value ? item.color : '#E0E0E0' }"
      ></span>
    </div>
  </div>
</div>
```

Et ajouter dans le style :

```css
/* Adapter la grille pour 6 éléments */
.scores-visual {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  padding: var(--spacing-sm) 0;
}

.score-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 0 0 auto;
}

/* Sur mobile, 3 par ligne */
@media (max-width: 374px) {
  .score-item {
    flex: 0 0 30%;
  }
}
```
