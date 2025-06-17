# Instructions pour passer de 6 à 10 questions dans l'application ONUF

## Vue d'ensemble

Cette modification ajoute 4 nouvelles questions d'audit à votre application ONUF :
- Question 7 : Surveillance Naturelle
- Question 8 : Mixité de l'Espace
- Question 9 : Accès aux Transports
- Question 10 : Sécurité Formelle

## Étape 1 : Base de données Supabase

Exécutez ces requêtes SQL dans votre éditeur SQL Supabase :

```sql
-- Ajouter les 4 nouvelles colonnes à la table audits
ALTER TABLE audits 
ADD COLUMN IF NOT EXISTS natural_surveillance integer,
ADD COLUMN IF NOT EXISTS space_diversity integer,
ADD COLUMN IF NOT EXISTS transport_access integer,
ADD COLUMN IF NOT EXISTS formal_security integer;

-- Ajouter des contraintes CHECK pour les nouvelles colonnes (valeurs entre 1 et 4)
ALTER TABLE audits
ADD CONSTRAINT check_natural_surveillance CHECK (natural_surveillance IS NULL OR (natural_surveillance >= 1 AND natural_surveillance <= 4)),
ADD CONSTRAINT check_space_diversity CHECK (space_diversity IS NULL OR (space_diversity >= 1 AND space_diversity <= 4)),
ADD CONSTRAINT check_transport_access CHECK (transport_access IS NULL OR (transport_access >= 1 AND transport_access <= 4)),
ADD CONSTRAINT check_formal_security CHECK (formal_security IS NULL OR (formal_security >= 1 AND formal_security <= 4));

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN audits.natural_surveillance IS 'Surveillance Naturelle - Le sentiment d''être visible depuis les bâtiments (Yeux sur la rue)';
COMMENT ON COLUMN audits.space_diversity IS 'Mixité de l''Espace - La présence et la diversité des genres et des âges (femmes, enfants)';
COMMENT ON COLUMN audits.transport_access IS 'Accès aux Transports - La proximité et la facilité d''accès aux transports en commun';
COMMENT ON COLUMN audits.formal_security IS 'Sécurité Formelle - La présence visible de la police ou de gardiens de sécurité';
```

## Étape 2 : Vérifier les icônes

Assurez-vous que toutes les icônes suivantes sont présentes dans `src/assets/icons/` :
- visibility1.svg à visibility4.svg (pour Ouverture)
- clean1.svg à clean4.svg (pour Propreté)
- feeling1.svg à feeling4.svg (pour Ressenti)
- frequentation1.svg à frequentation4.svg (pour Présence humaine)
- surveillance1.svg à surveillance4.svg (pour Surveillance Naturelle)
- mix1.svg à mix4.svg (pour Mixité de l'Espace)
- bus1.svg à bus4.svg (pour Accès aux Transports)
- police1.svg à police4.svg (pour Sécurité Formelle)

## Étape 3 : Modifications du code

Les modifications détaillées sont dans les artifacts de ce chat. Voici un résumé des fichiers à modifier :

### 1. `src/views/AuditFormView.vue`
- Ajouter les imports SVG
- Mettre à jour formData avec les 4 nouveaux champs
- Ajouter les 4 nouvelles sections AuditSectionModern dans le template
- Créer les options pour les 4 nouvelles questions
- Mettre à jour les fonctions :
  - getAnsweredQuestions() : compter sur 10
  - progressPercentage : calculer sur 10
  - isFormValid : valider les 10 champs
  - startNewAudit() : réinitialiser les 10 champs
- Mettre à jour l'affichage "Questions répondues: X/10" dans la console debug

### 2. `src/composables/useAudits.js`
- Modifier saveAuditToCloud() pour inclure les 4 nouvelles colonnes dans dbAudit
- Mettre à jour getAuditsStats() pour calculer les moyennes sur 10 questions

### 3. `src/views/AuditsHistoryView.vue`
- Modifier calculateGlobalScore() pour inclure les 10 questions
- Modifier getScoreItems() pour afficher les 10 critères dans le détail d'audit

### 4. `src/components/common/AuditCard.vue`
- Modifier le computed globalScore pour calculer sur 10 questions
- Optionnel : Adapter l'affichage pour montrer plus de critères dans la carte

## Étape 4 : Tests

Après les modifications :
1. Relancer votre serveur de développement
2. Créer un nouvel audit et vérifier que les 10 questions s'affichent
3. Répondre à toutes les questions et vérifier que la progression atteint 100%
4. Soumettre l'audit et vérifier qu'il se sauvegarde correctement
5. Vérifier dans l'historique que les scores sont calculés correctement
6. Vérifier dans Supabase que les nouvelles colonnes sont remplies

## Notes importantes

- Les noms des colonnes dans la base de données utilisent des underscores (snake_case) : natural_surveillance, space_diversity, transport_access, formal_security
- Les noms des champs dans le code JavaScript utilisent camelCase : naturalSurveillance, spaceDiversity, transportAccess, formalSecurity
- Le calcul des moyennes prend maintenant en compte 10 questions au lieu de 6
- La validation du formulaire nécessite maintenant que les 10 questions soient répondues

## En cas de problème

- Vérifiez la console du navigateur pour les erreurs JavaScript
- Vérifiez les logs de Supabase pour les erreurs SQL
- Assurez-vous que toutes les icônes SVG sont bien présentes et accessibles
- Vérifiez que les imports SVG correspondent exactement aux noms de fichiers
