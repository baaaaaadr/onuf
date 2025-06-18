// Configuration des lieux disponibles pour l'audit
export const locations = [
  'Ahlaka',
  'Aït El Mouden',
  'Aït Taoukt',
  'Ighil Ouderdour',
  'Imounsiss'
]

// Configuration des types d'incidents
export const incidentTypes = [
  'Vol',
  'Agression',
  'Cambriolage',
  'Vandalisme',
  'Trafic de drogue',
  'Tapage nocturne',
  'Harcèlement',
  'Autre'
]

// Configuration des jours de la semaine
export const daysOfWeek = [
  { text: 'Lundi', value: 'lundi' },
  { text: 'Mardi', value: 'mardi' },
  { text: 'Mercredi', value: 'mercredi' },
  { text: 'Jeudi', value: 'jeudi' },
  { text: 'Vendredi', value: 'vendredi' },
  { text: 'Samedi', value: 'samedi' },
  { text: 'Dimanche', value: 'dimanche' }
]

// Configuration des catégories d'âge
export const ageCategories = [
  '0-17 ans',
  '18-25 ans',
  '26-35 ans',
  '36-45 ans',
  '46-55 ans',
  '56-65 ans',
  'Plus de 65 ans'
]

// Messages de validation
export const validationMessages = {
  required: 'Ce champ est requis',
  email: 'Veuillez entrer une adresse email valide',
  phone: 'Veuillez entrer un numéro de téléphone valide',
  minLength: (min) => `Ce champ doit contenir au moins ${min} caractères`,
  maxLength: (max) => `Ce champ ne doit pas dépasser ${max} caractères`,
  photo: 'Veuillez prendre ou sélectionner une photo'
}
