# Guide de Test et Vérification - ONUF 10 Questions

## 🧪 Tests à Effectuer

### 1. Test de Création d'Audit
- [ ] Ouvrir l'application et aller sur la page "Nouvel Audit"
- [ ] Vérifier que les 10 questions sont présentes :
  1. 💡 Éclairage
  2. 🚶 Cheminement
  3. 👁️ Ouverture
  4. 😊 Ressenti
  5. 👥 Présence humaine
  6. 🧹 Propreté
  7. 👁️‍🗨️ Surveillance Naturelle
  8. 👨‍👩‍👧‍👦 Mixité de l'Espace
  9. 🚌 Accès aux Transports
  10. 👮 Sécurité Formelle
- [ ] Répondre à toutes les questions
- [ ] Soumettre l'audit
- [ ] Vérifier le message de succès

### 2. Test de l'Historique
- [ ] Aller dans "Mes Audits"
- [ ] Vérifier que le nouvel audit apparaît
- [ ] Cliquer sur l'audit pour voir les détails
- [ ] Vérifier que les 10 scores s'affichent
- [ ] Vérifier que le score global est calculé sur 10

### 3. Test des Cartes d'Audit
- [ ] Dans l'historique, vérifier les cartes d'audit
- [ ] Le score global doit être une moyenne sur 10 questions
- [ ] Les icônes principales affichées peuvent être 4 ou 6 (c'est normal)

### 4. Test de Synchronisation
- [ ] Créer un audit en ligne
- [ ] Vérifier le statut "Synchronisé" ✅
- [ ] Créer un audit hors ligne (mode avion)
- [ ] Vérifier le statut "Local" 📴
- [ ] Se reconnecter et vérifier la synchronisation automatique

## 🔍 Points de Vérification dans la Console (F12)

### Console Browser
1. Ouvrir les outils développeur (F12)
2. Aller dans l'onglet "Console"
3. Lors de la création d'un audit, vérifier :
   - Pas d'erreurs rouges (les warnings jaunes sont OK)
   - Messages de succès de sauvegarde
   - Messages de synchronisation

### Stockage Local
1. Dans les outils développeur, aller dans "Application" ou "Stockage"
2. Vérifier "Local Storage" > votre domaine
3. Chercher la clé `onuf_audits_local`
4. Vérifier que les audits ont bien les 10 champs

## 📊 Requête SQL de Vérification

Pour vérifier dans Supabase :

```sql
-- Voir les derniers audits avec toutes les colonnes
SELECT 
  id,
  created_at,
  lighting,
  walkpath,
  openness,
  feeling,
  people_presence,
  cleanliness,
  natural_surveillance,
  space_diversity,
  transport_access,
  formal_security
FROM audits
WHERE user_id = '[VOTRE_USER_ID]'
ORDER BY created_at DESC
LIMIT 5;

-- Compter les audits complets (10 questions) vs anciens (6 questions)
SELECT 
  CASE 
    WHEN natural_surveillance IS NOT NULL THEN 'Audit 10 questions'
    ELSE 'Audit 6 questions'
  END as type_audit,
  COUNT(*) as nombre
FROM audits
WHERE user_id = '[VOTRE_USER_ID]'
GROUP BY type_audit;
```

## ✅ Critères de Succès

L'application fonctionne correctement si :
- [ ] Les 10 questions s'affichent dans le formulaire
- [ ] Les nouveaux audits enregistrent les 10 valeurs
- [ ] Les scores moyens sont calculés sur 10 (pas 6)
- [ ] Les anciens audits s'affichent toujours correctement
- [ ] La synchronisation fonctionne
- [ ] Pas d'erreurs bloquantes dans la console

## 🚨 Problèmes Connus (Non Bloquants)

1. **Warning Vue Transition** - Message jaune dans la console, ignorable
2. **Affichage partiel** - Certaines vues n'affichent que 4-6 critères par choix UI
3. **Scores anciens audits** - Calculés sur 6 questions seulement (normal)

---
Guide créé le : ${new Date().toLocaleString('fr-FR')}
