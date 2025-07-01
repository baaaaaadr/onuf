<template>
  <div class="photo-capture" :class="{ 'photo-capture--rtl': isRTL }">
    <!-- État : Aucune photo -->
    <div v-if="photos.length === 0" class="photo-empty">
      <div class="empty-icon">
        <v-icon size="64" color="grey">mdi-camera-outline</v-icon>
      </div>
      
      <h3 class="text-h6 mt-3 mb-2">{{ t('audit.photos.widget.empty.title') }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ t('audit.photos.widget.empty.description') }}
      </p>
        
      <!-- Boutons d'action -->
      <div class="action-buttons">
        <v-btn
          color="primary"
          rounded="lg"
          @click="openCamera"
          class="mb-2"
        >
          <v-icon start>mdi-camera</v-icon>
          {{ t('audit.photos.widget.empty.takePhoto') }}
        </v-btn>
        
        <v-btn
          variant="outlined"
          rounded="lg"
          @click="openGallery"
        >
          <v-icon start>mdi-image-multiple</v-icon>
          {{ t('audit.photos.widget.empty.chooseFromGallery') }}
        </v-btn>
      </div>
    </div>

    <!-- État : Photos présentes -->
    <div v-else class="photo-gallery">
      <!-- Header -->
      <div class="gallery-header">
        <h3 class="text-h6">
          <v-icon class="mr-2">mdi-image-multiple</v-icon>
          {{ photos.length }} {{ photos.length > 1 ? t('audit.photos.widget.gallery.photos') : t('audit.photos.widget.gallery.photo') }}
        </h3>
        
        <div class="header-actions">
          <v-chip size="small" color="info" variant="tonal">
            {{ getTotalSize() }}
          </v-chip>
          
          <v-btn
            icon
            size="small"
            variant="text"
            @click="clearAll"
            v-if="photos.length > 0"
          >
            <v-icon>mdi-delete-sweep</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Grille de photos -->
      <div class="photo-grid">
        <div
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="photo-item"
          :class="{ 'photo-item--processing': photo.processing }"
        >
          <!-- Preview -->
          <div class="photo-preview" @click="openPhotoViewer(photo, index)">
            <v-img
              :src="photo.thumbnail || photo.data"
              cover
              aspect-ratio="1"
              class="photo-image"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            
            <!-- Overlay d'état -->
            <div v-if="photo.processing" class="photo-overlay processing">
              <v-progress-circular
                indeterminate
                color="white"
                size="24"
              ></v-progress-circular>
              <span class="text-caption mt-1">{{ t('audit.photos.widget.gallery.processing') }}</span>
            </div>
            
            <div v-else class="photo-overlay">
              <v-icon color="white">mdi-magnify-plus</v-icon>
            </div>
          </div>

          <!-- Actions -->
          <div class="photo-actions">
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click="rotatePhoto(index)"
              :disabled="photo.processing"
            >
              <v-icon>mdi-rotate-right</v-icon>
            </v-btn>
            
            <v-btn
              icon
              size="x-small"
              variant="text"
              color="error"
              @click="removePhoto(index)"
              :disabled="photo.processing"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>

          <!-- Info badge -->
          <v-chip
            size="x-small"
            class="photo-info"
            variant="tonal"
          >
            {{ formatSize(photo.compressedSize || photo.size) }}
          </v-chip>
        </div>

        <!-- Bouton ajouter -->
        <div class="photo-item add-photo" @click="showAddMenu = true">
          <div class="add-photo-content">
            <v-icon size="32" color="primary">mdi-plus</v-icon>
            <span class="text-caption">{{ t('audit.photos.widget.gallery.add') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- INPUTS FILE SÉPARÉS POUR ÉVITER LES CONFLITS -->
    <!-- Input pour appareil photo -->
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      multiple
      style="display: none"
      @change="handleCameraSelect"
    />

    <!-- Input pour galerie -->
    <input
      ref="galleryInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleGallerySelect"
    />

    <!-- Menu d'ajout -->
    <v-menu
      v-model="showAddMenu"
      :close-on-content-click="false"
      location="bottom"
    >
      <template v-slot:activator>
        <!-- Activateur géré par le bouton add-photo -->
      </template>
      
      <v-list>
        <v-list-item @click="openCamera">
          <template v-slot:prepend>
            <v-icon>mdi-camera</v-icon>
          </template>
          <v-list-item-title>{{ t('audit.photos.widget.empty.takePhoto') }}</v-list-item-title>
        </v-list-item>
        
        <v-list-item @click="openGallery">
          <template v-slot:prepend>
            <v-icon>mdi-image-multiple</v-icon>
          </template>
          <v-list-item-title>{{ t('audit.photos.widget.empty.chooseFromGallery') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Viewer plein écran -->
    <v-dialog
      v-model="showViewer"
      fullscreen
      transition="fade-transition"
    >
      <div class="photo-viewer" v-if="selectedPhoto">
        <!-- Header -->
        <div class="viewer-header">
          <v-btn
            icon
            variant="text"
            @click="showViewer = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          
          <span class="viewer-title">
            {{ t('audit.photos.widget.viewer.title', { current: selectedIndex + 1, total: photos.length }) }}
          </span>
          
          <v-btn
            icon
            variant="text"
            @click="downloadPhoto"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </div>

        <!-- Image -->
        <div class="viewer-content">
          <v-img
            :src="selectedPhoto.data"
            contain
            max-height="80vh"
            class="viewer-image"
          />
        </div>

        <!-- Navigation -->
        <div class="viewer-nav">
          <v-btn
            icon
            size="large"
            variant="tonal"
            @click="previousPhoto"
            :disabled="selectedIndex === 0"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          
          <v-chip variant="tonal">
            {{ selectedIndex + 1 }} / {{ photos.length }}
          </v-chip>
          
          <v-btn
            icon
            size="large"
            variant="tonal"
            @click="nextPhoto"
            :disabled="selectedIndex === photos.length - 1"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </div>
    </v-dialog>

    <!-- Snackbar pour messages -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n' // ✅ NOUVEAU: Import i18n

// ✅ NOUVEAU: Utiliser i18n pour les traductions
const { t, locale } = useI18n()

// ✅ NOUVEAU: Détecter si la langue actuelle est RTL
const isRTL = computed(() => {
  return locale.value === 'ar'
})

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxPhotos: {
    type: Number,
    default: 10
  },
  maxSizeKB: {
    type: Number,
    default: 100
  },
  compressionQuality: {
    type: Number,
    default: 0.8
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'photo-added', 'photo-removed'])

// État
const photos = ref([...props.modelValue])

const showAddMenu = ref(false)
const showViewer = ref(false)
const selectedPhoto = ref(null)
const selectedIndex = ref(0)

// REFS SÉPARÉS POUR LES DEUX TYPES D'INPUT
const cameraInput = ref(null)
const galleryInput = ref(null)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('info')

// Méthodes SÉPARÉES pour éviter les conflits
const openCamera = () => {
  showAddMenu.value = false
  
  // Réinitialiser l'input pour éviter tout cache
  if (cameraInput.value) {
    cameraInput.value.value = ''
  }
  
  // Déclencher l'input appareil photo
  setTimeout(() => {
    cameraInput.value?.click()
  }, 100) // Petit délai pour s'assurer que le menu est fermé
}

const openGallery = () => {
  showAddMenu.value = false
  
  // Réinitialiser l'input pour éviter tout cache
  if (galleryInput.value) {
    galleryInput.value.value = ''
  }
  
  // Déclencher l'input galerie
  setTimeout(() => {
    galleryInput.value?.click()
  }, 100) // Petit délai pour s'assurer que le menu est fermé
}

// Handlers SÉPARÉS pour chaque type d'input
const handleCameraSelect = async (event) => {
  console.log('📸 Appareil photo déclenché')
  await handleFileSelect(event, 'camera')
}

const handleGallerySelect = async (event) => {
  console.log('🖼️ Galerie déclenchée')
  await handleFileSelect(event, 'gallery')
}

const handleFileSelect = async (event, source) => {
  const files = Array.from(event.target.files)
  
  if (files.length === 0) {
    console.log(`Aucun fichier sélectionné depuis ${source}`)
    return
  }
  
  console.log(`${files.length} fichier(s) sélectionné(s) depuis ${source}`)
  
  if (photos.value.length + files.length > props.maxPhotos) {
    showError(t('audit.photos.widget.messages.maxPhotosReached', { max: props.maxPhotos }))
    return
  }

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      await processPhoto(file)
    }
  }
  
  // Reset input pour permettre la sélection du même fichier
  event.target.value = ''
}

const processPhoto = async (file) => {
  const photoId = Date.now() + Math.random()
  
  // Créer l'objet photo avec état de traitement
  const photo = {
    id: photoId,
    name: file.name,
    size: file.size,
    type: file.type,
    processing: true,
    timestamp: new Date().toISOString()
  }
  
  // Ajouter immédiatement pour feedback
  photos.value.push(photo)
  
  try {
    // Créer thumbnail et compresser
    const compressed = await compressImage(file, props.maxSizeKB)
    const thumbnail = await createThumbnail(compressed)
    const base64 = await fileToBase64(compressed)
    
    // Mettre à jour la photo
    const index = photos.value.findIndex(p => p.id === photoId)
    if (index !== -1) {
      photos.value[index] = {
        ...photos.value[index],
        data: base64,
        thumbnail: thumbnail,
        compressedSize: compressed.size,
        processing: false
      }
    }
    
    emit('photo-added', photos.value[index])
    updateModelValue()
    showSuccess(t('audit.photos.widget.messages.photoAdded'))
  } catch (error) {
    console.error('Erreur traitement photo:', error)
    
    // Retirer la photo en cas d'erreur
    const index = photos.value.findIndex(p => p.id === photoId)
    if (index !== -1) {
      photos.value.splice(index, 1)
    }
    
    showError(t('audit.photos.widget.messages.processingError'))
  }
}

const compressImage = (file, maxSizeKB) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img
      const maxDimension = 1200
      
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
      
      // Fonction récursive pour ajuster la qualité
      const adjustQuality = (quality) => {
        canvas.toBlob((blob) => {
          if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
            adjustQuality(quality - 0.1)
          } else {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }
        }, 'image/jpeg', quality)
      }
      
      adjustQuality(props.compressionQuality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

const createThumbnail = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const size = 200
      canvas.width = size
      canvas.height = size
      
      // Calculer le crop centré
      const scale = Math.max(size / img.width, size / img.height)
      const x = (size - img.width * scale) / 2
      const y = (size - img.height * scale) / 2
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const rotatePhoto = async (index) => {
  const photo = photos.value[index]
  if (!photo || photo.processing) return
  
  photo.processing = true
  
  try {
    const rotated = await rotateImage(photo.data, 90)
    photo.data = rotated
    photo.processing = false
    updateModelValue()
  } catch (error) {
    console.error('Erreur rotation:', error)
    photo.processing = false
  }
}

const rotateImage = (dataUrl, degrees) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const rad = degrees * Math.PI / 180
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))
      
      canvas.width = img.height * sin + img.width * cos
      canvas.height = img.height * cos + img.width * sin
      
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rad)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      
      resolve(canvas.toDataURL('image/jpeg', props.compressionQuality))
    }
    
    img.src = dataUrl
  })
}

const removePhoto = (index) => {
  const removed = photos.value.splice(index, 1)[0]
  emit('photo-removed', removed)
  updateModelValue()
  showSuccess(t('audit.photos.widget.messages.photoRemoved'))
}

const clearAll = () => {
  if (confirm(t('audit.photos.widget.messages.confirmClearAll', { count: photos.value.length }))) {
    photos.value = []
    updateModelValue()
    showSuccess(t('audit.photos.widget.messages.allPhotosRemoved'))
  }
}

const openPhotoViewer = (photo, index) => {
  selectedPhoto.value = photo
  selectedIndex.value = index
  showViewer.value = true
}

const previousPhoto = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    selectedPhoto.value = photos.value[selectedIndex.value]
  }
}

const nextPhoto = () => {
  if (selectedIndex.value < photos.value.length - 1) {
    selectedIndex.value++
    selectedPhoto.value = photos.value[selectedIndex.value]
  }
}

const downloadPhoto = () => {
  const link = document.createElement('a')
  link.href = selectedPhoto.value.data
  link.download = selectedPhoto.value.name || `photo_${selectedIndex.value + 1}.jpg`
  link.click()
}

const getTotalSize = () => {
  const totalBytes = photos.value.reduce((sum, photo) => {
    return sum + (photo.compressedSize || photo.size || 0)
  }, 0)
  return formatSize(totalBytes)
}

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const updateModelValue = () => {
  emit('update:modelValue', photos.value)
}

const showError = (message) => {
  snackbarText.value = message
  snackbarColor.value = 'error'
  snackbar.value = true
}

const showSuccess = (message) => {
  snackbarText.value = message
  snackbarColor.value = 'success'
  snackbar.value = true
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  photos.value = [...newValue]
}, { deep: true })
</script>

<style scoped>
.photo-capture {
  width: 100%;
}

/* État vide */
.photo-empty {
  text-align: center;
  padding: var(--spacing-xl) var(--spacing-md);
}

.empty-icon {
  margin-bottom: var(--spacing-md);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
}

/* Galerie */
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding: 0 var(--spacing-xs);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Grille de photos */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--spacing-sm);
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-light);
  transition: transform 0.2s ease;
}

.photo-item:hover {
  transform: scale(1.05);
}

.photo-item--processing {
  opacity: 0.7;
}

.photo-preview {
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
}

.photo-image {
  width: 100%;
  height: 100%;
}

/* Overlay */
.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-preview:hover .photo-overlay:not(.processing) {
  opacity: 1;
}

.photo-overlay.processing {
  opacity: 1;
  background: rgba(0, 0, 0, 0.7);
}

/* Actions photo */
.photo-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-xs);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  display: flex;
  justify-content: space-between;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-item:hover .photo-actions {
  opacity: 1;
}

/* Info badge */
.photo-info {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
}

/* Bouton ajouter */
.add-photo {
  border: 2px dashed var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-photo:hover {
  border-color: var(--onuf-primary);
  background: var(--onuf-primary-light);
  transform: scale(1.05);
}

.add-photo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-xs);
}

/* Viewer plein écran */
.photo-viewer {
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.5);
}

.viewer-title {
  color: white;
  font-weight: 500;
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.viewer-image {
  width: 100%;
  height: 100%;
}

.viewer-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(0, 0, 0, 0.5);
}

/* Responsive */
@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons .v-btn {
    width: 100%;
  }
}

/* RTL Support pour l'arabe */
.photo-capture--rtl {
  direction: rtl;
}

.photo-capture--rtl .gallery-header {
  flex-direction: row-reverse;
}

.photo-capture--rtl .header-actions {
  flex-direction: row-reverse;
}

.photo-capture--rtl .photo-actions {
  flex-direction: row-reverse;
}

.photo-capture--rtl .photo-info {
  right: auto;
  left: var(--spacing-xs);
}

.photo-capture--rtl .viewer-header {
  flex-direction: row-reverse;
}

.photo-capture--rtl .viewer-nav {
  flex-direction: row-reverse;
}
</style>
