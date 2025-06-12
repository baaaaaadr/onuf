// Service de géocodage inverse pour ONUF
// Utilise l'API Nominatim d'OpenStreetMap

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'
const USER_AGENT = 'ONUF-PWA/1.0 (https://onuf.netlify.app)'

// Cache en mémoire pour éviter les requêtes répétées
const geocodeCache = new Map()

/**
 * Effectue un géocodage inverse pour obtenir l'adresse à partir des coordonnées
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} lang - Langue des résultats (fr par défaut)
 * @returns {Promise<Object>} Objet contenant l'adresse formatée et les détails
 */
export const reverseGeocode = async (lat, lng, lang = 'fr') => {
  // Vérifier le cache
  const cacheKey = `${lat.toFixed(6)}_${lng.toFixed(6)}_${lang}`
  if (geocodeCache.has(cacheKey)) {
    console.log('📍 Géocodage depuis le cache:', cacheKey)
    return geocodeCache.get(cacheKey)
  }

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      addressdetails: '1',
      extratags: '1',
      namedetails: '1',
      'accept-language': lang,
      zoom: '18' // Plus de détails
    })

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': USER_AGENT
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Extraire les informations pertinentes
    const result = formatGeocodeResult(data)
    
    // Mettre en cache
    geocodeCache.set(cacheKey, result)
    
    return result
  } catch (error) {
    console.error('❌ Erreur géocodage inverse:', error)
    
    // Retourner un résultat par défaut en cas d'erreur
    return {
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      streetAddress: null,
      nearbyPlace: null,
      neighborhood: null,
      city: 'Agadir',
      country: 'Maroc',
      displayName: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      raw: null
    }
  }
}

/**
 * Formate le résultat du géocodage pour une utilisation facile
 * @param {Object} data - Données brutes de Nominatim
 * @returns {Object} Données formatées
 */
const formatGeocodeResult = (data) => {
  const address = data.address || {}
  const extratags = data.extratags || {}
  const namedetails = data.namedetails || {}
  
  // Priorité pour l'adresse la plus spécifique
  let streetAddress = null
  let nearbyPlace = null
  
  // Chercher un commerce ou lieu proche
  if (data.name && data.name !== address.road) {
    nearbyPlace = data.name
  } else if (address.amenity) {
    nearbyPlace = address.amenity
  } else if (address.shop) {
    nearbyPlace = address.shop
  } else if (address.building) {
    nearbyPlace = address.building
  } else if (namedetails.name) {
    nearbyPlace = namedetails.name
  }
  
  // Construire l'adresse de rue
  if (address.road) {
    streetAddress = address.road
    if (address.house_number) {
      streetAddress = `${address.house_number} ${streetAddress}`
    }
  }
  
  // Quartier
  const neighborhood = address.suburb || address.neighbourhood || address.quarter || null
  
  // Ville
  const city = address.city || address.town || address.village || 'Agadir'
  
  // Construire l'adresse d'affichage prioritaire
  let displayName = nearbyPlace || streetAddress || neighborhood
  
  // Si on a un lieu ET une rue, combiner
  if (nearbyPlace && streetAddress && nearbyPlace !== streetAddress) {
    displayName = `${nearbyPlace}, ${streetAddress}`
  }
  
  // Ajouter le quartier si différent
  if (neighborhood && displayName && !displayName.includes(neighborhood)) {
    displayName = `${displayName}, ${neighborhood}`
  }
  
  // Si toujours pas d'adresse claire, utiliser le display_name de Nominatim mais le simplifier
  if (!displayName && data.display_name) {
    // Prendre seulement les 2-3 premiers éléments
    const parts = data.display_name.split(',').map(p => p.trim())
    displayName = parts.slice(0, 3).join(', ')
  }
  
  return {
    address: data.display_name || `${lat}, ${lng}`,
    streetAddress,
    nearbyPlace,
    neighborhood,
    city,
    country: address.country || 'Maroc',
    displayName: displayName || `${city}, Maroc`,
    raw: data
  }
}

/**
 * Formate une adresse pour l'affichage dans une carte compacte
 * @param {Object} geocodeResult - Résultat du géocodage
 * @param {number} accuracy - Précision GPS en mètres
 * @returns {string} Adresse formatée pour affichage
 */
export const formatAddressForCard = (geocodeResult, accuracy = null) => {
  if (!geocodeResult || !geocodeResult.displayName) {
    return 'Position inconnue'
  }
  
  let formatted = geocodeResult.displayName
  
  // Ajouter la précision si disponible
  if (accuracy !== null && accuracy !== undefined && accuracy < 999999) {
    formatted += ` • ±${Math.round(accuracy)}m`
  }
  
  return formatted
}

/**
 * Vide le cache de géocodage
 */
export const clearGeocodeCache = () => {
  geocodeCache.clear()
  console.log('🗑️ Cache de géocodage vidé')
}

// Export par défaut
export default {
  reverseGeocode,
  formatAddressForCard,
  clearGeocodeCache
}
