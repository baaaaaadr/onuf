# 🔧 Guide d'intégration - Phase 3.2

## 📋 Checklist d'intégration

### 1. AuditFormView.vue
- [ ] Remplacer `import AuditSection` par `import AuditSectionModern`
- [ ] Mettre à jour les templates `<AuditSection>` → `<AuditSectionModern>`
- [ ] Vérifier que les props sont compatibles
- [ ] Tester sur mobile

### 2. AuditsHistoryView.vue
- [ ] Importer `AuditCard` depuis `@/components/common/AuditCard.vue`
- [ ] Remplacer les v-card de la liste par `<AuditCard>`
- [ ] Connecter les événements (@view, @share, @delete)
- [ ] Ajuster les styles si nécessaire

### 3. Tests à effectuer
- [ ] Navigation entre les pages
- [ ] Sélection des options dans le formulaire
- [ ] Affichage correct des scores
- [ ] Actions sur les audits (voir, partager, supprimer)
- [ ] Mode offline
- [ ] Performances sur mobile

## 💻 Code d'intégration

### Pour AuditFormView.vue

```vue
<script setup>
// Remplacer
import AuditSection from '@/components/AuditSection.vue'
// Par
import AuditSectionModern from '@/components/AuditSectionModern.vue'

// Utiliser AuditSectionModern au lieu de AuditSection
</script>

<template>
  <!-- Remplacer -->
  <AuditSection
    title="💡 Éclairage"
    description="..."
    v-model="formData.lighting"
    :options="lightingOptions"
  />
  
  <!-- Par -->
  <AuditSectionModern
    title="💡 Éclairage"
    description="..."
    v-model="formData.lighting"
    :options="lightingOptions"
  />
</template>
```

### Pour AuditsHistoryView.vue

```vue
<script setup>
// Ajouter l'import
import AuditCard from '@/components/common/AuditCard.vue'
</script>

<template>
  <!-- Remplacer la liste actuelle -->
  <div class="audit-list">
    <AuditCard
      v-for="audit in filteredAudits"
      :key="audit.id || audit.localId"
      :audit="audit"
      @click="viewAuditDetails"
      @view="viewAuditDetails"
      @share="shareAudit"
      @delete="deleteAudit"
    />
  </div>
</template>
```

## 🎨 Ajustements CSS recommandés

Si nécessaire, ajouter ces styles pour une meilleure intégration :

```css
/* Dans AuditFormView */
.audit-form-view {
  /* Espacement entre sections */
  .audit-section-modern {
    margin-bottom: var(--spacing-xl);
  }
}

/* Dans AuditsHistoryView */
.audit-list {
  /* Supprimer les marges doubles */
  .audit-card:last-child {
    margin-bottom: 0;
  }
}
```

## 🚀 Commandes pour tester

```bash
# Relancer le serveur après modifications
npm run dev

# Tester en mode production
npm run build
npm run preview
```

## 📱 Points d'attention mobile

1. **Taille des zones tactiles** : Minimum 44x44px
2. **Espacement** : Suffisant entre les éléments cliquables
3. **Feedback** : Visuel immédiat au toucher
4. **Performance** : Animations fluides même sur appareils anciens

## ✅ Validation finale

Une fois l'intégration terminée :
1. Tester tous les parcours utilisateur
2. Vérifier la cohérence visuelle
3. Valider les performances
4. Tester en mode offline

Bonne intégration ! 🎉
