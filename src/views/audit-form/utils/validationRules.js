// Validation rules for form fields

export const required = (value) => !!value || 'Ce champ est requis'

export const email = (value) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Veuillez entrer une adresse email valide'
}

export const phone = (value) => {
  if (!value) return true // Optional field
  const pattern = /^[\d\s\-\+\(\)]+$/
  return pattern.test(value) || 'Veuillez entrer un numéro de téléphone valide'
}

export const minLength = (min) => (value) => {
  if (!value) return true
  return value.length >= min || `Ce champ doit contenir au moins ${min} caractères`
}

export const maxLength = (max) => (value) => {
  if (!value) return true
  return value.length <= max || `Ce champ ne doit pas dépasser ${max} caractères`
}

export const number = (value) => {
  if (!value) return true
  return !isNaN(value) || 'Veuillez entrer un nombre valide'
}

export const positiveNumber = (value) => {
  if (!value) return true
  return (Number(value) >= 0) || 'Veuillez entrer un nombre positif'
}

export const percentage = (value) => {
  if (!value) return true
  const num = Number(value)
  return (!isNaN(num) && num >= 0 && num <= 100) || 'Veuillez entrer un pourcentage entre 0 et 100'
}

export const requiredArray = (value) => {
  return (Array.isArray(value) && value.length > 0) || 'Veuillez sélectionner au moins une option'
}

export const requiredPhoto = (value) => {
  return !!value || 'Veuillez prendre ou sélectionner une photo'
}

// Combined validation rules
export const validationRules = {
  required,
  email,
  phone,
  minLength,
  maxLength,
  number,
  positiveNumber,
  percentage,
  requiredArray,
  requiredPhoto
}

export default validationRules
