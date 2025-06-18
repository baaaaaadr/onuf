# Plan de Refactoring AuditFormView.vue

## 🎯 Objectifs
- Réduire la taille du fichier principal (1,787 lignes → ~300 lignes)
- Améliorer la réutilisabilité et la maintenabilité
- Séparer les responsabilités
- Faciliter les tests et la compréhension

## 📁 Structure proposée

```
src/views/audit-form/
├── AuditFormView.vue          # Composant principal (simplifié)
├── components/
│   ├── AuditProgress.vue      # Barre de progression
│   ├── AuditQuestions.vue     # Container pour les 10 questions
│   ├── AuditDebugDialog.vue   # Console de debug
│   └── AuditSuccessDialog.vue # Dialog de succès
├── composables/
│   ├── useAuditForm.js        # Logique du formulaire
│   ├── useAuditDebug.js       # Fonctions de debug
│   └── useAuditSubmission.js  # Logique de soumission
├── config/
│   └── auditQuestions.js      # Configuration des 10 questions
└── utils/
    └── photoUtils.js          # Utilitaires pour les photos
```

## 🔧 Étapes de refactoring

### Phase 1: Extraction de la configuration
1. Créer `config/auditQuestions.js` avec toutes les définitions d'options
2. Structurer les questions de manière uniforme

### Phase 2: Création des composables
1. `useAuditForm.js` - État du formulaire et validation
2. `useAuditDebug.js` - Toute la logique de debug
3. `useAuditSubmission.js` - Sauvegarde et soumission

### Phase 3: Extraction des composants
1. `AuditProgress.vue` - Barre de progression
2. `AuditQuestions.vue` - Génération dynamique des 10 questions
3. `AuditDebugDialog.vue` - Console de debug complète
4. `AuditSuccessDialog.vue` - Dialog de confirmation

### Phase 4: Simplification du composant principal
1. Nettoyer AuditFormView.vue
2. Importer et utiliser les nouveaux composants
3. Déléguer la logique aux composables

## 🚀 Bénéfices attendus
- Code plus lisible et maintenable
- Réutilisabilité des composants
- Tests unitaires plus faciles
- Performance améliorée (moins de code à parser)
- Meilleure séparation des responsabilités
