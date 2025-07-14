# 🗄️ Structure de Base de Données - ONUF PWA

## 📊 Tables Principales

### 🔐 **auth.users** (Supabase Auth)
- Gestion des utilisateurs authentifiés
- **CRITIQUE :** Doit correspondre aux profils pour l'accès REST API

### 👥 **profiles**
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| username | text | Nom d'utilisateur |
| password_hash | text | Hash du mot de passe |
| display_name | text | Nom d'affichage |
| role | text | Rôle (admin, field_user) |
| is_active | bool | Statut actif |
| created_at | timestamptz | Date de création |
| updated_at | timestamptz | Dernière modification |
| last_login | timestamptz | Dernière connexion |

### 📋 **audit_sessions**
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| user_id | uuid (FK→profiles.id) | Utilisateur |
| latitude | numeric | Latitude |
| longitude | numeric | Longitude |
| location_text | text | Adresse textuelle |
| form_data | jsonb | Données du formulaire |
| photos_data | jsonb | Données des photos |
| last_updated | timestamptz | Dernière modification |
| created_at | timestamptz | Date de création |

### 🖼️ **audit_photos**
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| audit_id | uuid (FK→audit_sessions.id) | Session d'audit |
| user_id | uuid (FK→profiles.id) | Utilisateur |
| filename | text | Nom du fichier |
| storage_path | text | Chemin de stockage |
| original_size | int4 | Taille originale |
| compressed_size | int4 | Taille compressée |
| mime_type | text | Type MIME |
| upload_order | int4 | Ordre d'upload |
| created_at | timestamptz | Date de création |

### 🎯 **audits** (Table principale des audits)
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| user_id | uuid (FK→profiles.id) | Utilisateur |
| latitude | numeric | Latitude |
| longitude | numeric | Longitude |
| location_text | text | Adresse |
| nearby_info | text | Informations à proximité |
| lighting | int4 | Score éclairage |
| walkpath | int4 | Score passage |
| openness | int4 | Score ouverture |
| feeling | int4 | Score ressenti |
| people_presence | int4 | Présence de personnes |
| cleanliness | int4 | Score propreté |
| comment | text | Commentaires |
| device_info | jsonb | Infos appareil |
| total_photos | int4 | Nombre de photos |
| ui_language | text | Langue interface |
| is_completed | bool | Audit terminé |
| location_accuracy | numeric | Précision GPS |
| natural_surveillance | int4 | Surveillance naturelle |
| space_diversity | int4 | Diversité de l'espace |
| transport_access | int4 | Accès transport |
| formal_security | int4 | Sécurité formelle |
| created_at | timestamptz | Date de création |
| updated_at | timestamptz | Dernière modification |

### 🗺️ **spatial_ref_sys** (PostGIS)
- Table système pour les références spatiales

## 🔒 **Politiques RLS**
- **audit_sessions** : `allow_all_sessions` (permissive, public, ALL)
- **profiles** : `allow_all_profiles` (permissive, public, ALL)

## 🔗 **Contraintes Clés**
- **audit_sessions** :
  - PK : `audit_sessions_pkey` (id)
  - FK : `audit_sessions_user_id_fkey` (user_id → profiles.id)
  - UK : `audit_sessions_user_id_key` (user_id unique)

## ⚠️ **Problème Identifié**
- Les utilisateurs dans `profiles` doivent exister dans `auth.users` pour l'accès REST API
- **agent01** existe dans `profiles` mais PAS dans `auth.users` → Erreur 406

## 🚀 **Solution**
Synchroniser les utilisateurs entre `profiles` et `auth.users` via Supabase Dashboard ou API.
