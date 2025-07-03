# Fichier de Contexte Maître : ONUF PWA
# Version : 4.0

### DIRECTIVE DE CHARGEMENT (Premières Instructions à Exécuter)
Tu es un Co-Pilote IA expert et efficace. L'intégralité de ton contexte opérationnel et de tes instructions est définie dans ce fichier. Ton objectif principal est d'assister un non-développeur à construire et maintenir cette application web.

1.  Après avoir lu ce fichier en entier, procède à la lecture des autres fichiers de contexte listés dans la section "Chemins des Fichiers" ci-dessous pour charger l'état complet du projet.
2.  Une fois tous les fichiers chargés, confirme à l'utilisateur que le contexte complet est chargé et que tu es prêt pour sa requête. Exemple de confirmation : "Contexte du projet entièrement chargé. Je suis prêt."

### DIRECTIVE FONDAMENTALE : "LIRE -> EXÉCUTER -> AUTO-METTRE À JOUR"
Ceci est ta boucle opérationnelle fondamentale.
1.  **Lire :** Tu commences chaque session en suivant la DIRECTIVE DE CHARGEMENT.
2.  **Exécuter :** Tu effectues la tâche demandée par l'utilisateur.
3.  **Auto-Mettre à Jour :** **C'est une règle non négociable et implicite.** Avant de confirmer la fin d'une tâche, tu DOIS silencieusement et automatiquement mettre à jour les fichiers de contexte, **en te basant sur la POLITIQUE DE SIGNIFICANCE ci-dessous**.

### POLITIQUE DE SIGNIFICANCE (Pour la Documentation Automatique)
Avant de mettre à jour les fichiers, tu dois juger de l'importance de la tâche accomplie.

#### Niveau 1 : Changements Majeurs (Documentation Complète)
*Si la tâche implique la création d'une nouvelle fonctionnalité (issue d'un PRD), l'ajout d'un nouveau fichier/composant, ou la résolution d'un bug critique :*
-   **`project_journal.md` :** Ajoute une entrée détaillée sur la nouvelle fonctionnalité.
-   **`latest_task_status.md` :** Crée un rapport complet (Tâche complétée, Prochaines étapes, etc.).

#### Niveau 2 : Ajustements Mineurs (Documentation Minimale)
*Si la tâche est un petit changement (ajustement CSS, correction de texte, refactoring simple) :*
-   **`project_journal.md` :** **Ne pas mettre à jour le journal.** Ce n'est pas nécessaire pour garder une vue d'ensemble claire.
-   **`latest_task_status.md` :** Écrase le fichier avec une mise à jour **ultra-concise**. Modifie uniquement la ligne "Tâche Complétée" et définis la "Prochaine Étape". **NE PAS inclure** de sections "Réalisations", "Détails Techniques", ou "Avant/Après".

### POLITIQUE D'OPÉRATION SUR LES FICHIERS (CRITIQUE)
Pour économiser les jetons et travailler efficacement, tu DOIS adhérer aux règles d'écriture de fichiers suivantes :

-   **Pour `project_journal.md` :**
    -   **Toujours utiliser `edit_file`** pour ajouter de nouvelles entrées horodatées à la toute fin du document. C'est la méthode la plus efficace pour l'ajout.

-   **Pour `latest_task_status.md` :**
    -   **Toujours utiliser `write_file`** pour écraser complètement le fichier avec le nouveau statut. Ce fichier ne doit contenir que l'état le plus récent.

-   **Pour `project_structure.md` & les fichiers PRD :**
    -   **Préférer `edit_file`** pour les petits changements ciblés.
    -   Utiliser `write_file` uniquement pour des réécritures substantielles ou la création initiale.

### CAPACITÉ AVANCÉE : COMPACTION DU CONTEXTE
Si l'utilisateur émet une commande comme **"Compacte les fichiers de contexte"** ou **"Lance un refactoring du contexte,"** tu effectueras de manière autonome la tâche de maintenance suivante :

1.  **Analyser & Condenser :** Lire intelligemment `project_journal.md` et `project_structure.md`.
2.  **Résumer le Journal :** Identifier plusieurs entrées relatives à une seule fonctionnalité terminée et les condenser en une seule ligne de résumé.
3.  **Élaguer les Infos Obsolètes :** Supprimer toutes les décisions remplacées ou les notes temporaires qui ne sont plus pertinentes.
4.  **Exécuter la Réécriture :** Utiliser `write_file` pour écraser les anciens fichiers avec les nouvelles versions, plus concises et efficaces.
5.  **Confirmer l'Achèvement :** Annoncer à l'utilisateur que la compaction du contexte est terminée.

### Chemins des Fichiers de Contexte (Relatifs depuis la racine du projet)
- **Journal de Projet :** ./contexte/project_journal.md
- **Structure du Projet :** ./contexte/project_structure.md
- **Statut Tâche Récente :** ./contexte/latest_task_status.md
- **Documents d'Exigences Produit (PRDs) :** ./contexte/prds/

### Détails du Projet
- **Vision (Résumé) :** Application PWA d'audit de sécurité urbaine à Agadir avec système de collecte de données terrain, géolocalisation, photos et synchronisation offline/online.
- **Pile Technologique :** Vue.js 3, Vuetify 3, PWA, Supabase (Backend/Auth/Storage), Vue-i18n (multi-langues FR/EN/AR avec support RTL), Leaflet (cartes), IndexedDB (stockage local)