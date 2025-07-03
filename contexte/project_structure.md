# Structure du Projet - ONUF PWA
# Architecture et Organisation des Fichiers

## Vue d'Ensemble
Application PWA Vue.js 3 avec Vuetify pour l'audit de sécurité urbaine, utilisant Supabase comme backend et supportant le mode offline-first.

## Structure des Dossiers Principaux

### `/src/views/` - Vues Principales
- **AuditFormView.vue** : Vue principale du formulaire d'audit (6 sections)
- **AuditsHistoryView.vue** : Historique des audits avec auto-refresh
- **DashboardView.vue** : Tableau de bord avec statistiques et aperçu
- **HomeView.vue** : Page d'accueil de l'application
- **IntroView.vue** : Page d'introduction/onboarding
- **MaVilleView.vue** : Vue "Ma Ville" avec informations locales
- **AboutView.vue** : Page À propos

### `/src/components/` - Composants Réutilisables

#### Composants Principaux
- **StatusBar.vue** : Header avec bouton "+" pour nouvel audit et indicateurs
- **AuditSection.vue** : Section d'audit standard
- **AuditSectionModern.vue** : Version moderne de la section d'audit
- **AuditListItem.vue** : Item de liste pour l'historique des audits
- **LanguageSwitcher.vue** : Sélecteur de langue (FR/EN/AR)

#### `/widgets/` - Widgets Modernes
- **LocationWidget.vue** : Widget GPS avec géocodage inverse et affichage enrichi
- **PhotoCapture.vue** : Interface moderne de capture photo avec compression

#### `/navigation/` - Navigation
- **BottomNav.vue** : Navigation inférieure entre les vues principales
- **SwipeNavigation.vue** : Navigation par gestes swipe entre écrans

#### `/debug/` - Outils de Debug
- **MobileDebugViewer.vue** : Panel debug complet accessible en production
- **FullFlowTestCard.vue** : Test du flux complet de l'application
- **GPSTestCard.vue** : Test de géolocalisation
- **LocalStorageTestCard.vue** : Test du stockage local
- **SupabaseTestCard.vue** : Test de connexion Supabase
- **LogsViewer.vue** : Visualiseur de logs

#### `/dashboard/` - Composants Dashboard
- Composants spécifiques au tableau de bord

#### `/common/` - Composants Communs
- Composants partagés à travers l'application

#### `/transitions/` - Animations
- Composants de transition et animations

### `/src/composables/` - Logique Métier (Composition API)
- **useAudits.js** : ⭐ Gestion CRUD des audits + stratégie Local-First
- **useSyncQueue.js** : ⭐ Synchronisation automatique offline/online
- **useLang.js** : ⭐ Gestion des langues et support RTL
- **useGeolocation.js** : Gestion de la géolocalisation
- **useSupabase.js** : Interface avec Supabase
- **useCityDashboard.js** : Logique du tableau de bord ville
- **useI18nFallback.js** : Gestion des fallbacks i18n

### `/src/plugins/` - Plugins Vue
- **i18n.js** : ⚠️ **CRITIQUE** - Configuration i18n avec injection manuelle (bug workaround)
- **vuetify.js** : Configuration Vuetify avec thème personnalisé

### `/src/i18n/` - Internationalisation
- **embedded.js** : Traductions intégrées (FR/EN/AR)

### `/src/router/` - Routing
- **index.js** : Configuration des routes Vue Router

### `/src/stores/` - État Global
- Actuellement utilise Composition API (pas de Pinia)

### `/src/assets/` - Ressources
- Images, icônes et autres ressources statiques

## Fichiers Racine Importants
- **main.js** : Point d'entrée simplifié de l'application
- **App.vue** : Composant racine avec SwipeNavigation
- **vite.config.js** : Configuration Vite + PWA
- **supabase.sql** : Schéma de base de données Supabase

## Base de Données Supabase
### Tables Principales
- **users** : Utilisateurs avec auth personnalisée (username/password)
- **audits** : Audits avec toutes les données + géolocalisation
- **audit_photos** : Photos associées aux audits

### Storage Buckets
- **audit-photos** : Stockage des photos compressées

## Configuration PWA
- Service Worker pour mode offline
- Manifest pour installation
- IndexedDB pour stockage local
- Stratégie Local-First avec sync automatique

## Points d'Architecture Importants
1. **Pas de Vuex/Pinia** : Utilisation exclusive de Composition API
2. **Local-First** : Toutes les données sauvegardées localement d'abord
3. **Sync Intelligente** : Queue de synchronisation avec retry automatique
4. **i18n Spéciale** : Injection manuelle des traductions (bug workaround)
5. **Debug Production** : Système de debug accessible via query param