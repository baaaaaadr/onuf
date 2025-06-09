# ✅ Checklist de Validation - Redesign ONUF

> Liste complète des points à vérifier avant et après le redesign  
> Version 1.0 - Décembre 2024

## 📋 Checklist Globale

### 🎨 Design & UI
- [ ] Toutes les couleurs correspondent à la charte graphique
- [ ] Police Inter chargée correctement sur tous les écrans
- [ ] Icônes MDI visibles et cohérentes
- [ ] Emojis affichés correctement (cross-platform)
- [ ] Animations fluides (60 fps)
- [ ] Pas de décalage visuel (layout shift)
- [ ] Mode sombre désactivé (si non implémenté)

### 📱 Mobile & Responsive
- [ ] Testé sur iPhone (Safari iOS 14+)
- [ ] Testé sur Android (Chrome 90+)
- [ ] Zones tactiles >= 44px
- [ ] Pas de scroll horizontal
- [ ] Bottom navigation toujours visible (sauf clavier)
- [ ] Safe areas iOS respectées
- [ ] Viewport meta tag correct
- [ ] Orientation portrait/paysage gérée

### ♿ Accessibilité
- [ ] Contraste texte/fond >= 4.5:1 (normal)
- [ ] Contraste texte/fond >= 3:1 (large)
- [ ] Navigation clavier fonctionnelle
- [ ] Focus visible sur tous les éléments
- [ ] ARIA labels sur boutons icon-only
- [ ] Alternatives texte pour emojis importants
- [ ] Hiérarchie des headings correcte (h1, h2, h3)
- [ ] Formulaires avec labels associés

### ⚡ Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB (gzipped)
- [ ] Images optimisées et lazy-loaded
- [ ] Pas de re-renders inutiles
- [ ] Service Worker actif
- [ ] Cache strategy implémentée

### 🔧 Fonctionnalités
- [ ] GPS fonctionne et affiche la précision
- [ ] Capture photo fonctionne (compression OK)
- [ ] Formulaire d'audit complet validé
- [ ] Sauvegarde locale (localStorage/IndexedDB)
- [ ] Synchronisation Supabase opérationnelle
- [ ] Mode offline fonctionnel
- [ ] Navigation entre écrans fluide
- [ ] Retour arrière fonctionne correctement

---

## 📱 Checklist par Écran

### 🏠 Dashboard (Accueil)

#### Interface
- [ ] Stats cards affichent les bonnes valeurs
- [ ] Couleurs des stats selon les scores
- [ ] Boutons "Actions Rapides" visibles
- [ ] Section statut sync actualisée
- [ ] Section GPS avec indicateurs visuels
- [ ] FAB visible (si applicable)

#### Interactions
- [ ] Click sur stats → redirection correcte
- [ ] Bouton "Démarrer Audit" → /audit
- [ ] Bouton "Historique" → /history
- [ ] Pull-to-refresh fonctionne
- [ ] Animations d'entrée fluides

#### États
- [ ] État vide (aucun audit) avec CTA
- [ ] État loading pendant chargement
- [ ] État erreur avec retry
- [ ] État offline avec indicateur

### 📝 Formulaire d'Audit

#### Localisation
- [ ] Widget localisation visible
- [ ] Bouton GPS fonctionne
- [ ] Précision affichée en mètres
- [ ] Carte mini-map cliquable
- [ ] Tips GPS s'affichent si erreur
- [ ] Coordonnées formatées correctement

#### Sections d'évaluation
- [ ] 6 sections visibles avec emojis
- [ ] Options cards sélectionnables
- [ ] Une seule option par section
- [ ] Feedback visuel sur sélection
- [ ] Bordure dorée sur sélection
- [ ] Toutes les options ont emoji + texte

#### Photos
- [ ] Bouton capture photo fonctionne
- [ ] Multi-sélection possible (max 10)
- [ ] Compression automatique
- [ ] Preview des photos
- [ ] Suppression individuelle
- [ ] Indicateur taille totale

#### Validation
- [ ] Progress bar en temps réel
- [ ] Bouton submit disabled si incomplet
- [ ] Validation GPS obligatoire
- [ ] Sauvegarde brouillon auto
- [ ] Confirmation avant quitter si non sauvé
- [ ] Message succès après soumission

### 📊 Historique des Audits

#### Interface
- [ ] Barre de recherche fonctionnelle
- [ ] Filtres chips (Tous, Sync, En attente, Aujourd'hui)
- [ ] Tri par date/score/lieu
- [ ] Cards audits avec infos essentielles
- [ ] Indicateur sync (nuage) sur chaque card
- [ ] Pagination si > 10 audits

#### Fonctionnalités
- [ ] Recherche par lieu/commentaire
- [ ] Filtres combinables
- [ ] Click card → détails audit
- [ ] Swipe ou menu → actions (edit, delete)
- [ ] Sync manuel des audits en attente
- [ ] Export données (JSON)
- [ ] Suppression avec confirmation

#### États
- [ ] État vide avec CTA
- [ ] État recherche vide
- [ ] Loading pendant chargement
- [ ] Indicateur sync en cours

---

## 🧪 Tests Spécifiques

### Tests GPS/Localisation
```javascript
// Console browser
navigator.geolocation.getCurrentPosition(
  pos => console.log('GPS OK:', pos.coords),
  err => console.error('GPS Error:', err),
  { enableHighAccuracy: true }
)
```

### Tests Performance
```javascript
// Mesurer le rendu
performance.mark('render-start')
// ... code
performance.mark('render-end')
performance.measure('render', 'render-start', 'render-end')
console.log(performance.getEntriesByName('render'))
```

### Tests Offline
1. Ouvrir l'app
2. Créer un audit
3. Activer mode avion
4. Vérifier que l'audit est sauvé localement
5. Désactiver mode avion
6. Vérifier la synchronisation automatique

### Tests Stress
- [ ] Créer 100+ audits → performance OK
- [ ] Upload 10 photos 5MB chacune → compression OK
- [ ] Navigation rapide entre écrans → pas de crash
- [ ] Rotation écran pendant actions → état conservé

---

## 🚀 Checklist de Déploiement

### Pré-déploiement
- [ ] Build de production sans erreurs
- [ ] Bundle size acceptable (< 1MB)
- [ ] Manifest.json à jour
- [ ] Service Worker version bump
- [ ] Icons PWA toutes tailles
- [ ] Meta tags SEO/Social
- [ ] Variables d'environnement configurées
- [ ] SSL/HTTPS actif

### Post-déploiement
- [ ] Installation PWA fonctionne
- [ ] Icône sur home screen correcte
- [ ] Splash screen visible
- [ ] Notifications (si applicable)
- [ ] Updates automatiques PWA
- [ ] Analytics tracking actif
- [ ] Monitoring erreurs (Sentry)
- [ ] Backup base de données

---

## 📊 Métriques de Succès

### Objectifs Techniques
- [ ] Temps de chargement < 3s (3G)
- [ ] Taux de crash < 0.1%
- [ ] Offline usage > 30%
- [ ] Battery usage optimisé

### Objectifs UX
- [ ] Temps moyen par audit < 2 min
- [ ] Taux de complétion audit > 90%
- [ ] Photos par audit moyenne: 2-3
- [ ] Utilisation quotidienne active

---

## 🐛 Issues Connues à Surveiller

1. **iOS Safari**
   - [ ] Input date/time natif
   - [ ] Bounce scroll elastique
   - [ ] 100vh includes toolbar

2. **Android**
   - [ ] Back button behavior
   - [ ] Keyboard pushing layout
   - [ ] Various WebView versions

3. **PWA**
   - [ ] Update prompts
   - [ ] Cache invalidation
   - [ ] Storage quotas

---

## 📝 Sign-off

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Dev Lead | | | ✓ |
| UX Designer | | | ✓ |
| QA Tester | | | ✓ |
| Product Owner | | | ✓ |

---

**Note** : Cette checklist doit être complétée avant chaque release majeure. Gardez une copie datée pour chaque version.
