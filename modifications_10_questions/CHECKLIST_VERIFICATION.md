# Checklist de vérification après modifications

## ✅ Fichiers modifiés

- [ ] `src/views/AuditFormView.vue`
  - [ ] Imports SVG ajoutés
  - [ ] formData avec 10 champs
  - [ ] 10 sections AuditSectionModern dans le template
  - [ ] Options pour les 10 questions avec SVG
  - [ ] getAnsweredQuestions() compte sur 10
  - [ ] progressPercentage calcule sur 10
  - [ ] isFormValid vérifie 10 champs
  - [ ] startNewAudit() réinitialise 10 champs
  - [ ] Affichage "X/10" dans la console debug

- [ ] `src/composables/useAudits.js`
  - [ ] saveAuditToCloud() inclut les 4 nouvelles colonnes
  - [ ] getAuditsStats() calcule les moyennes sur 10 questions

- [ ] `src/views/AuditsHistoryView.vue`
  - [ ] calculateGlobalScore() inclut les 10 questions
  - [ ] getScoreItems() affiche les 10 critères

- [ ] `src/components/common/AuditCard.vue`
  - [ ] globalScore computed calcule sur 10 questions

- [ ] Base de données Supabase
  - [ ] Colonnes ajoutées : natural_surveillance, space_diversity, transport_access, formal_security
  - [ ] Contraintes CHECK ajoutées
  - [ ] Commentaires de colonnes ajoutés

## 🧪 Tests à effectuer

### Test 1 : Création d'un nouvel audit
1. [ ] Aller sur la page audit
2. [ ] Vérifier que les 10 questions s'affichent correctement
3. [ ] Vérifier que les icônes SVG s'affichent pour chaque question
4. [ ] Répondre à toutes les questions
5. [ ] Vérifier que la progression atteint 100%
6. [ ] Soumettre l'audit

### Test 2 : Vérification dans l'historique
1. [ ] Aller dans l'historique des audits
2. [ ] Vérifier que le score global est calculé correctement (moyenne sur 10)
3. [ ] Cliquer sur un audit pour voir le détail
4. [ ] Vérifier que les 10 critères s'affichent dans le détail

### Test 3 : Vérification dans Supabase
1. [ ] Se connecter à Supabase
2. [ ] Aller dans la table audits
3. [ ] Vérifier que les nouvelles colonnes contiennent des données
4. [ ] Vérifier que les valeurs sont entre 1 et 4

### Test 4 : Synchronisation
1. [ ] Créer un audit en mode offline
2. [ ] Se reconnecter
3. [ ] Vérifier que l'audit se synchronise avec les 10 questions

## 🐛 Problèmes possibles et solutions

### Problème : Les icônes ne s'affichent pas
- Vérifier que tous les fichiers SVG sont présents dans `src/assets/icons/`
- Vérifier que les noms de fichiers correspondent exactement aux imports

### Problème : Erreur lors de la sauvegarde
- Vérifier la console pour les erreurs JavaScript
- Vérifier que les colonnes existent dans Supabase
- Vérifier que les noms de champs correspondent (camelCase vs snake_case)

### Problème : La progression reste bloquée
- Vérifier que toutes les questions sont bien comptées dans progressPercentage
- Vérifier que isFormValid vérifie les 10 champs

### Problème : Le score n'est pas correct
- Vérifier que calculateGlobalScore inclut les 10 questions
- Vérifier que les valeurs null ou undefined sont filtrées correctement

## 📝 Notes

- Les colonnes de la base de données utilisent snake_case : natural_surveillance, space_diversity, transport_access, formal_security
- Le code JavaScript utilise camelCase : naturalSurveillance, spaceDiversity, transportAccess, formalSecurity
- Les calculs de moyennes doivent gérer le cas où certaines questions anciennes n'ont pas les nouveaux champs
