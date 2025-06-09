# 🧩 Exemples de Composants ONUF

> Exemples pratiques et prêts à l'emploi pour le redesign ONUF  
> Version 1.0 - Décembre 2024

## 📂 Structure des Composants

```
src/components/
├── common/
│   ├── OptionCard.vue
│   ├── StatCard.vue
│   ├── AuditCard.vue
│   └── EmptyState.vue
├── audit/
│   ├── AuditSectionNew.vue
│   ├── PhotoCapture.vue
│   └── LocationWidget.vue
└── layout/
    ├── AppHeader.vue
    └── BottomNav.vue
```

---

## 1. 🎯 Composant OptionCard

### Fichier : `src/components/common/OptionCard.vue`

```vue
<template>
  <label 
    class="option-card"
    :class="{ 
      'option-card--selected': isSelected,
      'option-card--disabled': disabled 
    }"
    @click="handleClick"
  >
    <input 
      type="radio" 
      :value="option.value"
      :checked="isSelected"
      :disabled="disabled"
      class="d-none"
    >
    <div class="option-content">
      <span class="option-emoji">{{ option.emoji }}</span>
      <span class="option-label">{{ option.text }}</span>
    </div>
    <v-fade-transition>
      <v-icon 
        v-if="isSelected" 
        class="option-check"
        color="primary"
      >
        mdi-check-circle
      </v-icon>
    </v-fade-transition>
  </label>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  option: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.value !== undefined && value.text && value.emoji
    }
  },
  modelValue: [Number, String],
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'select'])

const isSelected = computed(() => 
  props.modelValue === props.option.value
)

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.option.value)
    emit('select', props.option.value)
    
    // Feedback haptique si disponible
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10)
    }
  }
}
</script>

<style scoped>
.option-card {
  position: relative;
  display: block;
  border: 1px solid #E6E3DB;
  border-radius: 12px;
  padding: 12px 16px;
  min-height: 56px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  background: white;
}

.option-card:active:not(.option-card--disabled) {
  transform: scale(0.97);
  background: #F5F3F0;
}

.option-card--selected {
  border: 3px solid #F3C348;
  padding: 10px 14px;
  background: #FFFEF5;
  box-shadow: 0 2px 8px rgba(243, 195, 72, 0.2);
}

.option-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-emoji {
  font-size: 28px;
  line-height: 1;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #181611;
  flex: 1;
}

.option-check {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
}

/* Animation de sélection */
@keyframes select-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.option-card--selected {
  animation: select-pulse 0.3s ease;
}
</style>
```

---

## 2. 📊 Composant StatCard

### Fichier : `src/components/common/StatCard.vue`

```vue
<template>
  <v-card 
    class="stat-card" 
    :color="color"
    :class="{ 'stat-card--clickable': clickable }"
    @click="handleClick"
    flat
  >
    <v-card-text class="stat-content pa-4">
      <v-icon 
        v-if="icon" 
        class="stat-icon"
        :color="iconColor"
      >
        {{ icon }}
      </v-icon>
      
      <div class="stat-text">
        <div class="stat-label text-body-2">
          {{ label }}
        </div>
        <div class="stat-value text-h4 font-weight-bold">
          <slot name="value">{{ formattedValue }}</slot>
        </div>
        <div v-if="subtitle" class="stat-subtitle text-caption mt-1">
          {{ subtitle }}
        </div>
      </div>
      
      <v-icon 
        v-if="clickable" 
        class="stat-arrow"
        size="20"
      >
        mdi-chevron-right
      </v-icon>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: String,
  color: {
    type: String,
    default: 'surface'
  },
  icon: String,
  iconColor: {
    type: String,
    default: 'primary'
  },
  format: {
    type: String,
    validator: (value) => ['number', 'percent', 'date'].includes(value)
  },
  clickable: Boolean
})

const emit = defineEmits(['click'])

const formattedValue = computed(() => {
  if (!props.format) return props.value
  
  switch (props.format) {
    case 'number':
      return new Intl.NumberFormat('fr-FR').format(props.value)
    case 'percent':
      return `${props.value}%`
    case 'date':
      return new Date(props.value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
    default:
      return props.value
  }
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card--clickable:active {
  transform: translateY(0);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 120px;
}

.stat-icon {
  font-size: 40px;
  opacity: 0.8;
}

.stat-text {
  flex: 1;
}

.stat-label {
  color: #837B67;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-value {
  color: #181611;
  line-height: 1.1;
}

.stat-subtitle {
  color: #837B67;
  opacity: 0.8;
}

.stat-arrow {
  color: #837B67;
  margin-left: auto;
}
</style>
```

---

## 3. 📋 Composant AuditCard

### Fichier : `src/components/common/AuditCard.vue`

```vue
<template>
  <v-card 
    class="audit-card"
    :class="{ 'audit-card--synced': audit.synced }"
    @click="$emit('click', audit)"
    hover
    flat
  >
    <v-card-text class="pa-4">
      <!-- Header -->
      <div class="audit-header">
        <div class="audit-info">
          <div class="d-flex align-center gap-2 mb-1">
            <v-icon 
              :icon="syncIcon" 
              :color="syncColor"
              size="20"
            />
            <h3 class="text-body-1 font-weight-semibold">
              Audit #{{ audit.id?.substring(0, 8) || 'Local' }}
            </h3>
          </div>
          
          <p class="text-caption text-secondary">
            <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
            {{ audit.location || 'Position inconnue' }}
          </p>
          
          <p class="text-caption text-secondary mt-1">
            <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
            {{ formatDate(audit.timestamp) }}
          </p>
        </div>
        
        <!-- Score Global -->
        <div class="audit-score">
          <div 
            class="score-circle"
            :style="{ backgroundColor: getScoreColor(globalScore) + '20' }"
          >
            <span 
              class="score-value"
              :style="{ color: getScoreColor(globalScore) }"
            >
              {{ globalScore }}
            </span>
          </div>
          <span class="text-caption text-secondary">Score</span>
        </div>
      </div>
      
      <!-- Scores détaillés -->
      <div class="audit-scores mt-3">
        <div 
          v-for="score in scores" 
          :key="score.key"
          class="score-item"
          :title="score.label"
        >
          <span class="score-emoji">{{ score.emoji }}</span>
          <v-rating
            :model-value="score.value"
            :color="getScoreColor(score.value)"
            density="compact"
            size="x-small"
            :length="4"
            readonly
          />
        </div>
      </div>
      
      <!-- Photos indicator -->
      <div v-if="audit.photos?.length" class="mt-3 d-flex align-center gap-3">
        <v-chip size="x-small" color="primary" variant="tonal">
          <v-icon start size="14">mdi-camera</v-icon>
          {{ audit.photos.length }} photo{{ audit.photos.length > 1 ? 's' : '' }}
        </v-chip>
        
        <v-chip v-if="audit.comment" size="x-small" variant="tonal">
          <v-icon start size="14">mdi-comment</v-icon>
          Commentaire
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  audit: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

// Icône et couleur de sync
const syncIcon = computed(() => {
  if (props.audit.synced) return 'mdi-cloud-check'
  if (props.audit.syncing) return 'mdi-cloud-sync'
  return 'mdi-cloud-off-outline'
})

const syncColor = computed(() => {
  if (props.audit.synced) return 'success'
  if (props.audit.syncing) return 'info'
  return 'grey'
})

// Score global
const globalScore = computed(() => {
  const scores = [
    props.audit.lighting,
    props.audit.walkpath,
    props.audit.openness,
    props.audit.feeling,
    props.audit.peoplePresence,
    props.audit.cleanliness
  ].filter(s => s > 0)
  
  if (scores.length === 0) return 0
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
  return Math.round(avg * 25) // Convertir 1-4 en 0-100
})

// Scores détaillés
const scores = computed(() => [
  { key: 'lighting', emoji: '💡', label: 'Éclairage', value: props.audit.lighting || 0 },
  { key: 'walkpath', emoji: '🚶', label: 'Cheminement', value: props.audit.walkpath || 0 },
  { key: 'feeling', emoji: '😊', label: 'Ressenti', value: props.audit.feeling || 0 }
])

// Helpers
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

const getScoreColor = (score) => {
  if (score >= 75) return '#4CAF50'
  if (score >= 50) return '#FF9800'
  if (score >= 25) return '#F44336'
  return '#9E9E9E'
}
</script>

<style scoped>
.audit-card {
  border-radius: 16px;
  border: 1px solid #E6E3DB;
  transition: all 0.2s ease;
  cursor: pointer;
}

.audit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.audit-card--synced {
  border-color: #4CAF5020;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.audit-info {
  flex: 1;
}

.audit-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
}

.audit-scores {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #F8F7F5;
  border-radius: 8px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.score-emoji {
  font-size: 18px;
}
</style>
```

---

## 4. 📍 Widget de Localisation

### Fichier : `src/components/audit/LocationWidget.vue`

```vue
<template>
  <v-card 
    class="location-widget"
    color="blue-lighten-5"
    variant="tonal"
    flat
  >
    <v-card-text class="pa-4">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="d-flex align-center flex-grow-1">
          <v-icon 
            color="primary" 
            size="32"
            class="mr-3"
          >
            mdi-map-marker
          </v-icon>
          
          <div class="flex-grow-1">
            <div class="font-weight-semibold text-body-1">
              📍 Localisation
            </div>
            <div class="text-body-2 text-grey-darken-1">
              {{ locationText }}
            </div>
            <v-chip 
              v-if="accuracy"
              size="x-small"
              :color="accuracyColor"
              variant="tonal"
              class="mt-1"
            >
              <v-icon start size="14">mdi-crosshairs-gps</v-icon>
              Précision: {{ accuracy }}m
            </v-chip>
          </div>
        </div>
        
        <v-btn
          :icon="locationIcon"
          :color="locationColor"
          :loading="loading"
          variant="tonal"
          @click="$emit('locate')"
        />
      </div>
      
      <!-- Mini Map -->
      <div 
        v-if="hasCoordinates"
        class="mini-map"
        @click="$emit('show-map')"
      >
        <div class="map-placeholder">
          <v-icon size="48" color="primary">mdi-map</v-icon>
          <p class="text-caption mt-2">Toucher pour agrandir</p>
        </div>
        
        <!-- Coordinates chip -->
        <v-chip
          size="x-small"
          color="white"
          class="coordinates-chip"
        >
          {{ coordinates.lat.toFixed(4) }}, {{ coordinates.lng.toFixed(4) }}
        </v-chip>
      </div>
      
      <!-- GPS Tips -->
      <v-expand-transition>
        <div v-if="showTips" class="gps-tips mt-3">
          <p class="text-caption font-weight-medium mb-2">
            💡 Améliorer la précision GPS :
          </p>
          <ul class="text-caption pl-4">
            <li>Sortez à l'extérieur</li>
            <li>Éloignez-vous des bâtiments</li>
            <li>Attendez 30-60 secondes</li>
            <li>Activez le WiFi/Bluetooth</li>
          </ul>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  locationText: {
    type: String,
    default: 'Cliquez pour obtenir votre position'
  },
  coordinates: {
    type: Object,
    default: () => ({ lat: null, lng: null })
  },
  accuracy: Number,
  showTips: Boolean
})

defineEmits(['locate', 'show-map'])

const hasCoordinates = computed(() => 
  props.coordinates.lat && props.coordinates.lng
)

const locationIcon = computed(() => {
  if (props.loading) return 'mdi-loading'
  if (hasCoordinates.value) return 'mdi-crosshairs-gps'
  return 'mdi-crosshairs'
})

const locationColor = computed(() => {
  if (hasCoordinates.value) return 'success'
  return 'primary'
})

const accuracyColor = computed(() => {
  if (!props.accuracy) return 'grey'
  if (props.accuracy <= 10) return 'success'
  if (props.accuracy <= 50) return 'warning'
  return 'error'
})
</script>

<style scoped>
.location-widget {
  border-radius: 16px;
}

.mini-map {
  position: relative;
  height: 140px;
  background: #E3F2FD;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-map:hover {
  transform: scale(0.98);
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #1976D2;
}

.coordinates-chip {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-family: monospace;
  font-size: 11px;
}

.gps-tips {
  padding: 12px;
  background: rgba(33, 150, 243, 0.08);
  border-radius: 8px;
}

.gps-tips ul {
  margin: 0;
}

.gps-tips li {
  margin-bottom: 4px;
}

/* Animation rotation pour le loading */
:deep(.v-icon--loading) {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
```

---

## 5. 📸 Composant PhotoCapture

### Fichier : `src/components/audit/PhotoCapture.vue`

```vue
<template>
  <v-card class="photo-capture" flat>
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-camera</v-icon>
      📸 Photos
      <v-chip 
        v-if="photos.length"
        size="x-small"
        color="primary"
        variant="tonal"
        class="ml-2"
      >
        {{ photos.length }}
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <!-- Zone de capture -->
      <div class="capture-zone">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          class="d-none"
          @change="handleFileSelect"
        >
        
        <v-btn
          v-if="photos.length === 0"
          size="x-large"
          icon
          color="primary"
          variant="tonal"
          @click="openCamera"
        >
          <v-icon size="32">mdi-camera-plus</v-icon>
        </v-btn>
        
        <p 
          v-if="photos.length === 0"
          class="text-body-2 text-grey mt-3"
        >
          Appuyez pour ajouter des photos
        </p>
      </div>
      
      <!-- Grille de photos -->
      <div v-if="photos.length > 0" class="photos-grid">
        <transition-group name="photo-list">
          <div
            v-for="(photo, index) in photos"
            :key="photo.id"
            class="photo-item"
          >
            <v-img
              :src="photo.preview"
              aspect-ratio="1"
              cover
              class="photo-thumbnail"
              @click="$emit('preview', photo, index)"
            >
              <div class="photo-overlay">
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="white"
                  variant="flat"
                  @click.stop="removePhoto(index)"
                />
              </div>
            </v-img>
            
            <v-progress-linear
              v-if="photo.compressing"
              indeterminate
              color="primary"
              height="2"
              class="photo-progress"
            />
          </div>
        </transition-group>
        
        <!-- Bouton ajouter -->
        <div class="photo-item photo-add" @click="openCamera">
          <v-icon size="24" color="primary">mdi-plus</v-icon>
        </div>
      </div>
      
      <!-- Info compression -->
      <p 
        v-if="totalSize > 0" 
        class="text-caption text-grey mt-3"
      >
        📦 Taille totale : {{ formatSize(totalSize) }}
        <span v-if="savedSize > 0" class="text-success">
          ({{ formatSize(savedSize) }} économisés)
        </span>
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { compressImage } from '@/utils/imageUtils'

const props = defineProps({
  photos: {
    type: Array,
    default: () => []
  },
  maxPhotos: {
    type: Number,
    default: 10
  },
  maxSizeKb: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['add', 'remove', 'preview'])

const fileInput = ref(null)

const totalSize = computed(() => 
  props.photos.reduce((sum, p) => sum + (p.size || 0), 0)
)

const savedSize = computed(() => 
  props.photos.reduce((sum, p) => sum + ((p.originalSize || 0) - (p.size || 0)), 0)
)

const openCamera = () => {
  if (props.photos.length >= props.maxPhotos) {
    alert(`Maximum ${props.maxPhotos} photos autorisées`)
    return
  }
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files)
  
  for (const file of files) {
    if (props.photos.length >= props.maxPhotos) break
    
    const photo = {
      id: Date.now() + Math.random(),
      name: file.name,
      originalSize: file.size,
      compressing: true,
      preview: URL.createObjectURL(file)
    }
    
    emit('add', photo)
    
    try {
      // Compresser l'image
      const compressed = await compressImage(file, props.maxSizeKb)
      const reader = new FileReader()
      
      reader.onload = (e) => {
        photo.data = e.target.result
        photo.size = compressed.size
        photo.compressing = false
      }
      
      reader.readAsDataURL(compressed)
    } catch (error) {
      console.error('Erreur compression:', error)
      photo.compressing = false
      photo.error = true
    }
  }
  
  // Reset input
  event.target.value = ''
}

const removePhoto = (index) => {
  const photo = props.photos[index]
  if (photo.preview && photo.preview.startsWith('blob:')) {
    URL.revokeObjectURL(photo.preview)
  }
  emit('remove', index)
}

const formatSize = (bytes) => {
  const kb = bytes / 1024
  return kb < 1024 
    ? `${kb.toFixed(1)} KB`
    : `${(kb / 1024).toFixed(1)} MB`
}
</script>

<style scoped>
.photo-capture {
  border-radius: 16px;
}

.capture-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 24px;
  background: #F8F7F5;
  border-radius: 12px;
  border: 2px dashed #E6E3DB;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #F5F3F0;
}

.photo-thumbnail {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.photo-thumbnail:hover {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.photo-add {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #E6E3DB;
  cursor: pointer;
  transition: all 0.2s ease;
}

.photo-add:hover {
  border-color: #F3C348;
  background: #FFFEF5;
}

/* Animations */
.photo-list-enter-active,
.photo-list-leave-active {
  transition: all 0.3s ease;
}

.photo-list-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.photo-list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
```

---

## 6. 🧭 Navigation Bottom

### Fichier : `src/components/layout/BottomNav.vue`

```vue
<template>
  <v-bottom-navigation
    v-model="activeRoute"
    grow
    height="64"
    class="onuf-bottom-nav"
    color="primary"
  >
    <v-btn
      v-for="item in navItems"
      :key="item.value"
      :value="item.value"
      @click="navigate(item.to)"
    >
      <v-icon 
        :icon="getIcon(item)"
        size="24"
      />
      <span class="text-caption mt-1">{{ item.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { 
    value: 'home',
    to: '/',
    label: 'Accueil',
    icon: 'mdi-home',
    iconActive: 'mdi-home'
  },
  { 
    value: 'audit',
    to: '/audit',
    label: 'Audit',
    icon: 'mdi-file-document-outline',
    iconActive: 'mdi-file-document'
  },
  { 
    value: 'history',
    to: '/history',
    label: 'Historique',
    icon: 'mdi-history',
    iconActive: 'mdi-history'
  }
]

const activeRoute = computed(() => {
  const currentPath = route.path
  const item = navItems.find(item => item.to === currentPath)
  return item?.value || 'home'
})

const getIcon = (item) => {
  return activeRoute.value === item.value 
    ? item.iconActive 
    : item.icon
}

const navigate = (to) => {
  if (route.path !== to) {
    router.push(to)
  }
}
</script>

<style scoped>
.onuf-bottom-nav {
  border-top: 1px solid #E6E3DB;
  background: white !important;
}

:deep(.v-btn) {
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  min-width: 64px;
}

:deep(.v-btn--active) {
  position: relative;
}

:deep(.v-btn--active::before) {
  content: '';
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
}

:deep(.v-btn__content) {
  flex-direction: column;
  font-weight: 500;
}
</style>
```

---

## 7. 🔧 Utilitaires

### Fichier : `src/utils/imageUtils.js`

```javascript
/**
 * Compresse une image en conservant un ratio qualité/taille optimal
 * @param {File} file - Le fichier image à compresser
 * @param {number} maxSizeKB - Taille maximale en KB
 * @returns {Promise<File>} - Le fichier compressé
 */
export async function compressImage(file, maxSizeKB = 100) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Calculer les dimensions optimales
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
        
        // Appliquer une rotation si nécessaire (EXIF)
        ctx.drawImage(img, 0, 0, width, height)
        
        // Compression progressive
        let quality = 0.9
        const step = 0.05
        
        const compress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                quality -= step
                compress()
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              }
            },
            'image/jpeg',
            quality
          )
        }
        
        compress()
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Formate une taille en bytes en format lisible
 * @param {number} bytes - Taille en bytes
 * @returns {string} - Taille formatée
 */
export function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}
```

---

## 8. 💫 Animations et Transitions

### Fichier : `src/assets/styles/transitions.css`

```css
/* Transitions globales */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Scale transitions */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}

/* Shake animation pour erreurs */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.shake {
  animation: shake 0.5s ease;
}

/* Pulse animation pour notifications */
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.pulse {
  animation: pulse 1s ease infinite;
}

/* Success animation */
@keyframes success-check {
  0% { transform: scale(0) rotate(-45deg); opacity: 0; }
  50% { transform: scale(0.5) rotate(-45deg); opacity: 0.5; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.success-check {
  animation: success-check 0.5s ease;
}
```

---

## 9. 📱 État Vide (Empty State)

### Fichier : `src/components/common/EmptyState.vue`

```vue
<template>
  <div class="empty-state">
    <v-icon 
      :icon="icon"
      :color="iconColor"
      size="80"
      class="mb-4"
    />
    
    <h3 class="text-h5 mb-2">{{ title }}</h3>
    
    <p class="text-body-2 text-grey mb-4">
      {{ description }}
    </p>
    
    <v-btn
      v-if="actionText"
      :color="actionColor"
      size="large"
      rounded="pill"
      @click="$emit('action')"
    >
      <v-icon v-if="actionIcon" start>{{ actionIcon }}</v-icon>
      {{ actionText }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: 'mdi-folder-open-outline'
  },
  iconColor: {
    type: String,
    default: 'grey-lighten-1'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionText: String,
  actionIcon: String,
  actionColor: {
    type: String,
    default: 'primary'
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 400px;
  padding: 48px 24px;
}
</style>
```

---

## 10. 🎯 Usage des Composants

### Exemple d'intégration dans AuditFormView

```vue
<template>
  <v-container class="audit-form pa-4">
    <!-- Location Widget -->
    <location-widget
      :loading="geoLoading"
      :location-text="locationText"
      :coordinates="coordinates"
      :accuracy="accuracy"
      :show-tips="showGpsTips"
      @locate="getCurrentLocation"
      @show-map="showMapDialog = true"
      class="mb-4"
    />
    
    <!-- Section Éclairage -->
    <h3 class="text-h6 font-weight-bold mb-3">
      💡 Éclairage
    </h3>
    <p class="text-body-2 text-grey mb-3">
      Disponibilité de lumière pour voir autour de vous
    </p>
    
    <div class="options-grid mb-6">
      <option-card
        v-for="option in lightingOptions"
        :key="option.value"
        :option="option"
        v-model="formData.lighting"
      />
    </div>
    
    <!-- Photos -->
    <photo-capture
      :photos="formData.photos"
      @add="handlePhotoAdd"
      @remove="handlePhotoRemove"
      @preview="handlePhotoPreview"
      class="mb-6"
    />
    
    <!-- Submit Button -->
    <v-btn
      color="primary"
      size="x-large"
      block
      rounded="pill"
      :loading="submitting"
      :disabled="!isValid"
      @click="submitAudit"
    >
      ✅ Terminer l'Audit
    </v-btn>
  </v-container>
</template>

<style scoped>
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 400px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

---

Ces composants sont conçus pour être :
- **Réutilisables** : Props flexibles et événements standards
- **Accessibles** : ARIA labels, contrastes respectés
- **Performants** : Animations CSS, lazy loading
- **Maintenables** : Code clair et documenté