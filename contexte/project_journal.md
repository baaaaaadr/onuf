# Journal de Projet - ONUF PWA
# Historique Chronologique des Développements

## Juillet 2025 - Migration vers le Système 4.0
- **04/07/2025** : ✅ **RECONFIGURATION PWA COMPLÈTE + BOUTON INSTALLATION** - Résolution complète du problème d'installation PWA
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