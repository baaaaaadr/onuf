// Utilitaires pour la gestion des photos

// Fonction de compression d'image
export const compressImage = (file, maxSizeKB = 100) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img
      const maxDimension = 800 // Limite à 800px max
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width
        width = maxDimension
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height
        height = maxDimension
      }
      
      canvas.width = width
      canvas.height = height
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convertir en blob avec compression
      canvas.toBlob((blob) => {
        // Si toujours trop gros, réduire la qualité
        if (blob.size > maxSizeKB * 1024) {
          canvas.toBlob((compressedBlob) => {
            const compressedFile = new File([compressedBlob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }, 'image/jpeg', 0.6) // Qualité réduite
        } else {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          })
          resolve(compressedFile)
        }
      }, 'image/jpeg', 0.8) // Qualité normale
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Fonction utilitaire pour convertir un fichier en base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// Créer un input file dynamique pour la prise de photo
export const createPhotoInput = (onPhotoSelected) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.capture = 'environment' // Caméra arrière en priorité
  input.multiple = true // Permettre plusieurs photos
  
  input.onchange = (event) => {
    const files = Array.from(event.target.files)
    if (onPhotoSelected) {
      onPhotoSelected(files)
    }
  }
  
  return input
}

// Traiter et compresser une photo
export const processPhoto = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Fichier invalide')
  }
  
  try {
    // Compresser l'image
    const compressedFile = await compressImage(file, 100) // 100KB max
    
    // Convertir en base64 pour le stockage
    const base64 = await fileToBase64(compressedFile)
    
    // Retourner les données de la photo
    return {
      id: Date.now() + Math.random(),
      name: file.name,
      data: base64,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      type: file.type,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw new Error(`Erreur traitement photo: ${error.message}`)
  }
}
