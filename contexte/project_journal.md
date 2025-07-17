# Journal de Projet - ONUF PWA
# Historique Chronologique des Développements

## Juillet 2025 - Migration vers le Système 4.0
- **17/07/2025** : ✅ **MISE À JOUR AUDITCARD POUR 11 QUESTIONS + CHIENS ERRANTS**
  - **Changement** : Passage de 10 à 11 questions avec remplacement "présence policière" par "chiens errants"
  - **Questions finales** : Éclairage, Cheminement, Ouverture, Ressenti, Présence humaine, Propreté, Surveillance naturelle, Mixité espace, Accès transports, Chiens errants, Ombrage
  - **Mise à jour AuditCard.vue** : Affichage des 11 questions avec emojis adaptés (🐕 chiens, 🌳 ombrage)
  - **Recalcul moyennes** : Score global recalculé sur les 11 questions dans AuditCard et useAudits
  - **Styles adaptatifs** : CSS optimisé pour affichage compact des 11 scores visuels sur mobile
  - **Traductions** : Utilisation des traductions existantes pour strayDogs et shade
  - **Résultat** : AuditCard affiche correctement les 11 questions avec moyenne précise
- **17/07/2025** : ✅ **CORRECTION DUPLICATION AUDITS APRÈS SYNCHRONISATION + ICÔNE SYNC**
  - **Problème 1** : Après synchronisation offline→online, l'audit apparaissait en double au lieu de passer au statut "Sync"
  - **Problème 2** : L'icône orange "Local" restait même après synchronisation réussie avec Supabase
  - **Solution 1** : Amélioration markLocalAuditAsSynced() pour utiliser cloudId comme ID principal
  - **Solution 2** : Renforcement mergeAudits() avec détection des cloudId utilisés comme ID principal
  - **Solution 3** : Amélioration AuditCard.vue avec détection multi-conditions du statut sync (synced, source, cloudId)
  - **Solution 4** : Ajout réactivité forcée avec syncUpdateKey + listeners d'événements temps réel
  - **Solution 5** : Timing optimisé avec délai 100ms pour assurer mise à jour localStorage avant événement UI
  - **Résultat** : L'audit local devient "Sync" avec icône verte INSTANTANÉMENT après synchronisation, sans duplication
- **16/07/2025** : ✅ **CORRECTION DÉCONNEXION AUTOMATIQUE AU REFRESH + FIX ERREUR MENU**
  - **Problème 1** : La fonction initAuth() n'était jamais appelée au démarrage
  - **Solution 1** : Ajout de initAuth() dans main.js pour restaurer la session depuis localStorage
  - **Problème 2** : Erreur "Cannot convert object to primitive value" lors du clic sur menu sandwich
  - **Solution 2** : Correction de MobileDebugViewer (conversion sûre des objets en string) + ajout méthode openDebugPanel manquante dans StatusBar
  - **Résultat** : L'utilisateur reste connecté après refresh et le menu fonctionne correctement
- **14/07/2025** : ✅ **MODIFICATION QUESTIONS D'AUDIT + FIN DÉCONNEXION AUTO + CORRECTION SYNC**
  - **Question "présence policière" transformée en "chiens errants"** : Réutilisation ID existant
  - **Nouvelle question "ombrage" ajoutée** : Protection solaire importante à Agadir  
  - **Déconnexion automatique désactivée** : registerType passé de 'autoUpdate' à 'prompt'
  - **Traductions complètes** : FR/EN/AR pour les 2 nouvelles questions
  - **Icônes SVG créées** : dog1-4.svg et shade1-4.svg dans /assets/icons/
  - **Correction erreur sync 400** : Tous les fichiers JS mis à jour avec nouveaux noms
- **07/07/2025** : ✅ **CLÉ PHOTOCAPTURE "PROCESSING" + DIAGNOSTIC SUPABASE** - Résolution bêtes noires
  - **Clé processing ajoutée** : audit.photos.widget.gallery.processing (FR/EN/AR)
  - **Filtre anti-boucle optimisé** : Couvre toute la section gallery photos
  - **Problème Supabase identifié** : Erreur 406 spécifique à agent01 (fonctionne avec admin)
  - **Guide investigation créé** : debug_supabase_agent01.md avec requêtes SQL diagnostic
  - **Hypothèse** : Problème de rôle/permissions entre admin et field_user
- **07/07/2025** : ✅ **LOCATIONWIDGET ENTIÈREMENT TRADUIT** - Finalisation de l'internationalisation
  - **Correction nom quartier** : "إموانسيس" → "إمونسيس" (suppression "وا")
  - **LocationWidget 100% i18n** : 25+ clés traduites dans section "location"
  - **Clé GPS manquante ajoutée** : errors.gpsUnavailable pour résoudre boucle d'erreurs
  - **Composant modernisé** : useI18n() intégré + tous textes hardcodés remplacés
  - **Test GPS en arabe complet** : Boutons, messages, détails techniques traduits
- **07/07/2025** : ✅ **CORRECTION MAJEURE QUARTIERS + DEBUG** - Résolution complète problèmes i18n
  - **Quartiers en arabe fonctionnels** : Ajout traductions AR pour les 5 quartiers d'Agadir
  - **Système locations.js modernisé** : Support complet i18n avec getTranslatedLocations()
  - **v-select corrigé** : Ajout item-title/item-value pour dropdown fonctionnel
  - **Boucle infinie debug résolue** : Protection anti-récursion + filtrage messages i18n
  - **Couleurs différenciées** : Header audit en jaune plus clair (#F9D876 vs #F3C348)
  - **Page de test créée** : test-neighborhoods.html pour validation traductions
- **04/07/2025** : ✅ **RÉSOLUTION DÉFINITIVE DU PROBLÈME PWA** - Installation restaurée avec diagnostic complet
  - **Cause identifiée** : Chrome 2025 exige screenshots et shortcuts dans le manifest pour le prompt automatique
  - **Manifest mis à jour** : Ajout de screenshots, shortcuts, launch_handler et protocol_handlers
  - **PWAInstaller corrigé** : Détection intelligente de la plateforme et installation même sans beforeinstallprompt
  - **PWADiagnostic ajouté** : Outil complet pour diagnostiquer les problèmes d'installation PWA
  - **Générateur de screenshots** : Outil HTML pour créer les screenshots requis (public/generate-screenshots.html)
  - **Installation manuelle fonctionnelle** : Instructions détaillées par plateforme quand le prompt n'est pas disponible
  - **Debug PWA intégré** : Nouvel onglet PWA dans MobileDebugViewer avec diagnostic en temps réel
- **04/07/2025** : ✅ **RECONFIGURATION PWA COMPLÈTE + BOUTON INSTALLATION** - Configuration initiale PWA
  - Génération automatique des 5 icônes manquantes (64x64, 144x144, 180x180, maskable-512x512, safari-svg)
  - Configuration vite.config.js optimisée avec cache Supabase et icônes maskable
  - Meta tags HTML complets pour iOS/Android/Windows
  - Service Worker registration automatique avec détection de mises à jour
  - **Composant PWAInstaller intelligent** : Bouton dans menu + banner automatique + instructions manuelles
  - **Gestion multi-plateforme** : Détection iOS/Android/Desktop avec instructions adaptées
  - **PWA maintenant parfaitement installable** sur tous navigateurs mobile et desktop
- **03/07/2025** : ✅ **AJOUT DU LOGO DANS LE HEADER** - Remplacement de l'icône mdi-map-marker-check par le logo.svg pour renforcer l'identité de marque
- **03/07/2025** : ✅ **OPTIMISATION DU LOGO** - Agrandissement (36px), espacement amélioré (mr-3, margin-left: 4px) et padding conteneur (px-2)
- **03/07/2025** : Migration complète du système de gestion vers une structure centralisée dans le dossier `/contexte`
- **02/07/2025** : ✅ **RÉSOLUTION DÉFINITIVE DU BUG I18N**
  - Problème identifié : Bug de minification Vite/vue-i18n en production
  - Solution : Plugin i18n isolé avec injection manuelle des traductions
  - Méthode : Création i18n vide puis `setLocaleMessage` pour chaque langue
  - Fichiers créés : `Guide_de_Survie_Bug_i18n.txt` et `ANALYSE_SOLUTION_FINALE_I18N.md`
- **02/07/2025** : Debug en production fonctionnel via `?debug=true`
- **02/07/2025** : Panel debug complet avec onglet i18n et système de diagnostic intégré

## ⚠️ AVERTISSEMENT CRITIQUE - BUG I18N - NE PAS MODIFIER ⚠️
### Le fichier `src/plugins/i18n.js` utilise une technique spécifique pour contourner un bug de build :
1. **NE JAMAIS** passer `messages` directement à `createI18n`
2. **TOUJOURS** utiliser l'injection manuelle via `setLocaleMessage`
3. Cette structure "non-standard" est une protection, pas une erreur
4. Voir `Guide_de_Survie_Bug_i18n.txt` pour comprendre pourquoi
5. Pour ajouter/modifier des traductions : modifier uniquement `src/i18n/embedded.js`

## Juin 2025
- **19/06/2025** : ✅ Correction erreur "null user_id" lors de la synchronisation
- **19/06/2025** : ✅ Interface audit améliorée (boutons dialogue, réinitialisation formulaire, icône check, messages snackbar)
- **19/06/2025** : ✅ Intégration I18N complète avec support multi-langues FR/EN/AR et RTL pour l'arabe

## Janvier 2025
- **20/01/2025** : ✅ Correction erreur DashboardView.vue (syncStats.value)
- **20/01/2025** : ✅ Navigation swipe entre les 4 écrans principaux
- **18/01/2025** : ✅ Corrections UI : contraste textes + disposition boutons + cartes cliquables
- **18/01/2025** : ✅ Géocodage inverse intégré avec nearby_info + affichage enrichi

## Phases de Redesign (Historique)
- **Phase 3.3** : LocationWidget + PhotoCapture + Transitions + FAB
- **Phase 3.2** : AuditSectionModern + AuditCard intégrés
- **Phase 3.1** : Navigation moderne + Dashboard + CSS corrigés

## Évolutions Majeures (Historique)
- ✅ **Révolution Local-First** : Stratégie de stockage local avec synchronisation intelligente
- ✅ **Système Auth Personnalisé** : Username/password avec Supabase
- ✅ **PWA Complète** : Service Worker + Manifest + Installation
- ✅ **Console Debug Avancée** : Système complet de debugging mobile
- ✅ **Géolocalisation Avancée** : Transmission précision GPS + carte Leaflet
- ✅ **Système Photos** : Capture + compression + stockage optimisé
- ✅ **Protection Doublons** : Double clic + gestion intelligente des doublons
- ✅ **6 Sections d'Audit** : Éclairage, cheminement, signalisation, etc.

## Notes Techniques Importantes
- **Cache navigateur** : TOUJOURS vider complètement le cache Chrome lors des tests
- **PWA** : Peut conserver des versions anciennes - désinstaller/réinstaller si nécessaire
- **Plugin i18n** : Ne JAMAIS modifier la structure du plugin (injection manuelle critique)
- **Test production** : Toujours tester avec `npm run preview` avant déploiement

## Accès Système
- **Admin** : `admin` / `admin123!`
- **Agents** : `agent01`, `agent02`, `agent03` / `field123!`

## Debug Tools Disponibles
```javascript
// Système principal
__onuf.diagnose()                // Diagnostic complet i18n et app
__onuf.setLocale('ar')          // Changer de langue
__onuf.i18n.global.t('app.title') // Tester une traduction

// Système legacy (toujours disponible)
__debugONUF.getStats()           // Statistiques complètes
__debugONUF.getLocalAudits()     // Audits locaux
__debugONUF.getSyncQueue()       // Queue synchronisation

// Activer debug en production
URL: ?debug=true
Console: localStorage.setItem('onuf-debug-enabled', 'true')
```