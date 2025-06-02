<template>
  <v-app-bar color="primary" density="compact" elevation="2">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="$router.push('/')"></v-btn>
    </template>
    <v-app-bar-title class="font-weight-bold">🛡️ Agadir Safety Audit</v-app-bar-title>
    <template v-slot:append>
      <v-chip color="success" size="small" v-if="auditCompleted">
        <v-icon start size="small">mdi-check</v-icon>
        Terminé
      </v-chip>
    </template>
  </v-app-bar>

  <v-container class="pa-4">
    <v-form ref="auditForm">
      <!-- Widget de géolocalisation avec carte -->
      <v-card class="mb-4" color="blue-lighten-5" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3" size="large">mdi-map-marker</v-icon>
              <div>
                <div class="font-weight-bold">📍 Localisation</div>
                <span class="text-body-2 text-grey-darken-1">{{ locationText }}</span>
              </div>
            </div>
            <v-btn 
              icon 
              size="small" 
              color="primary" 
              @click="getCurrentLocation"
              :loading="locationLoading"
              variant="tonal"
            >
              <v-icon>{{ locationIcon }}</v-icon>
            </v-btn>
          </div>
          
          <!-- Mini carte -->
          <div v-if="coordinates.lat && coordinates.lng" class="mb-3">
            <div 
              ref="mapContainer" 
              class="mini-map"
              style="height: 120px; border-radius: 8px; overflow: hidden;"
            ></div>
          </div>
          
          <!-- Indicateur de précision -->
          <div v-if="locationAccuracy" class="d-flex justify-space-between align-center">
            <v-chip size="x-small" :color="getAccuracyColor()" variant="tonal">
              <v-icon start size="x-small">mdi-crosshairs-gps</v-icon>
              Précision: {{ locationAccuracy }}m
            </v-chip>
            <v-chip size="x-small" color="info" variant="tonal" v-if="coordinates.lat">
              <v-icon start size="x-small">mdi-map</v-icon>
              {{ coordinates.lat.toFixed(4) }}, {{ coordinates.lng.toFixed(4) }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>

      <!-- Barre de progression -->
      <v-card class="mb-4">
        <v-card-text>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-bold">Progression</span>
            <span class="text-body-2">{{ progressPercentage }}%</span>
          </div>
          <v-progress-linear
            :model-value="progressPercentage"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
        </v-card-text>
      </v-card>

      <!-- Section Éclairage -->
      <AuditSection
        title="💡 Éclairage"
        description="Disponibilité de suffisamment de lumière pour voir tout autour de vous."
        v-model="formData.lighting"
        :options="lightingOptions"
      />

      <!-- Section Cheminement -->
      <AuditSection
        title="🚶 Cheminement"
        description="Soit un trottoir, soit une route avec de l'espace pour marcher."
        v-model="formData.walkpath"
        :options="walkpathOptions"
      />

      <!-- Section Ouverture -->
      <AuditSection
        title="👁️ Ouverture"
        description="Capacité de voir et de se déplacer dans toutes les directions."
        v-model="formData.openness"
        :options="opennessOptions"
      />

      <!-- Section Sentiment de sécurité -->
      <AuditSection
        title="😊 Ressenti"
        description="Comment vous sentez-vous dans cet endroit en ce moment ?"
        v-model="formData.feeling"
        :options="feelingOptions"
      />

      <!-- Section Présence d'autres personnes -->
      <AuditSection
        title="👥 Présence humaine"
        description="Y a-t-il d'autres personnes autour de vous ?"
        v-model="formData.peoplePresence"
        :options="peoplePresenceOptions"
      />

      <!-- Section Propreté -->
      <AuditSection
        title="🧹 Propreté"
        description="État général de propreté et d'entretien du lieu."
        v-model="formData.cleanliness"
        :options="cleanlinessOptions"
      />

      <!-- Section Photos -->
      <v-divider class="my-6"></v-divider>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-camera</v-icon>
          📸 Prendre des Photos
        </v-card-title>
        <v-card-text>
          <div class="d-flex align-center mb-3">
            <v-btn 
              icon 
              color="primary" 
              size="x-large" 
              class="mr-3"
              @click="takePhoto"
              variant="tonal"
            >
              <v-icon size="30">mdi-plus</v-icon>
            </v-btn>
            <span class="text-body-2">Appuyez pour ajouter des photos</span>
          </div>
          
          <!-- Affichage des photos prises -->
          <div v-if="formData.photos.length > 0" class="mt-4">
            <h4 class="text-subtitle-2 mb-2">📸 Photos prises ({{ formData.photos.length }})</h4>
            <div class="d-flex flex-wrap gap-2">
              <v-card
                v-for="(photo, index) in formData.photos"
                :key="photo.id || index"
                class="photo-preview"
                width="80"
                height="80"
              >
                <v-img
                  v-if="photo.data"
                  :src="photo.data"
                  cover
                  class="photo-thumbnail"
                >
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    color="red"
                    class="photo-delete-btn"
                    @click="removePhoto(index)"
                  ></v-btn>
                </v-img>
                <v-card-text v-else class="text-center pa-2">
                  <v-icon>mdi-image</v-icon>
                  <div class="text-caption">{{ typeof photo === 'string' ? 'Simulée' : photo.name }}</div>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    color="red"
                    @click="removePhoto(index)"
                  ></v-btn>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Section Commentaire -->
      <v-divider class="my-6"></v-divider>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-comment-text</v-icon>
          💬 Commentaire
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="formData.comment"
            label="Commentaires additionnels ?"
            variant="outlined"
            rows="3"
            auto-grow
            clearable
            placeholder="Décrivez tout élément particulier que vous avez observé..."
          ></v-textarea>
        </v-card-text>
      </v-card>

      <!-- Bouton de soumission -->
      <v-btn 
        color="primary" 
        block 
        size="x-large" 
        @click="submitAudit" 
        class="mt-8 mb-4"
        :disabled="!isFormValid"
        rounded="lg"
        elevation="2"
      >
        <v-icon start>mdi-check-circle</v-icon>
        ✅ Terminer l'Audit
      </v-btn>

      <!-- Indicateur de sauvegarde -->
      <v-alert
        v-if="lastSaved"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        <v-icon start>mdi-content-save</v-icon>
        Dernière sauvegarde : {{ lastSaved }}
      </v-alert>
    </v-form>
  </v-container>

  <!-- Dialog de confirmation -->
  <v-dialog v-model="showSuccessDialog" max-width="400">
    <v-card class="text-center pa-4">
      <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
      <v-card-title class="text-h5 mb-2">🎉 Audit Terminé !</v-card-title>
      <v-card-text class="text-body-1">
        Merci pour votre contribution à la sécurité urbaine.
        <br>
        Vos données ont été sauvegardées localement.
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="goToIntro">
          Nouveau audit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import AuditSection from '@/components/AuditSection.vue';

const showSuccessDialog = ref(false);
const auditCompleted = ref(false);
const lastSaved = ref(null);

// État de géolocalisation
const locationText = ref('Cliquez pour obtenir votre position');
const locationLoading = ref(false);
const locationAccuracy = ref(null);
const locationIcon = ref('mdi-crosshairs-gps');
const coordinates = ref({ lat: null, lng: null });
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);

const formData = ref({
  lighting: null,
  walkpath: null,
  openness: null,
  feeling: null,
  peoplePresence: null,
  cleanliness: null,
  comment: '',
  photos: [],
  timestamp: null,
  location: null,
  coordinates: null
});

// Options avec emojis et progression de couleurs
const lightingOptions = [
  { value: 1, text: 'Aucun', emoji: '🌑', icon: 'mdi-lightbulb-off-outline', color: 'grey-lighten-1' },
  { value: 2, text: 'Faible', emoji: '🌒', icon: 'mdi-lightbulb-outline', color: 'red-darken-1' },
  { value: 3, text: 'Suffisant', emoji: '🌕', icon: 'mdi-lightbulb-on-outline', color: 'orange-darken-1' },
  { value: 4, text: 'Excellent', emoji: '☀️', icon: 'mdi-lightbulb-on', color: 'green-darken-1' },
];

const walkpathOptions = [
  { value: 1, text: 'Aucun', emoji: '🚫', icon: 'mdi-cancel', color: 'grey-lighten-1' },
  { value: 2, text: 'Mauvais', emoji: '🕳️', icon: 'mdi-alert-circle-outline', color: 'red-darken-1' },
  { value: 3, text: 'Correct', emoji: '🛤️', icon: 'mdi-check-circle-outline', color: 'orange-darken-1' },
  { value: 4, text: 'Excellent', emoji: '🛣️', icon: 'mdi-thumb-up-outline', color: 'green-darken-1' },
];

const opennessOptions = [
  { value: 1, text: 'Bloqué', emoji: '🧱', icon: 'mdi-arrow-collapse-all', color: 'grey-lighten-1' },
  { value: 2, text: 'Limité', emoji: '🚧', icon: 'mdi-arrow-expand-horizontal', color: 'red-darken-1' },
  { value: 3, text: 'Ouvert', emoji: '🌅', icon: 'mdi-arrow-expand-all', color: 'orange-darken-1' },
  { value: 4, text: 'Très ouvert', emoji: '🌄', icon: 'mdi-arrow-top-left-bottom-right', color: 'green-darken-1' },
];

const feelingOptions = [
  { value: 1, text: 'Effrayant', emoji: '😰', icon: 'mdi-emoticon-dead-outline', color: 'grey-lighten-1' },
  { value: 2, text: 'Inconfortable', emoji: '😟', icon: 'mdi-emoticon-sad-outline', color: 'red-darken-1' },
  { value: 3, text: 'Acceptable', emoji: '😐', icon: 'mdi-emoticon-neutral-outline', color: 'orange-darken-1' },
  { value: 4, text: 'Confortable', emoji: '😊', icon: 'mdi-emoticon-happy-outline', color: 'green-darken-1' },
];

const peoplePresenceOptions = [
  { value: 1, text: 'Personne', emoji: '👻', icon: 'mdi-account-off', color: 'grey-lighten-1' },
  { value: 2, text: 'Peu', emoji: '👤', icon: 'mdi-account', color: 'red-darken-1' },
  { value: 3, text: 'Quelques-uns', emoji: '👥', icon: 'mdi-account-group-outline', color: 'orange-darken-1' },
  { value: 4, text: 'Beaucoup', emoji: '👫', icon: 'mdi-account-group', color: 'green-darken-1' },
];

const cleanlinessOptions = [
  { value: 1, text: 'Très sale', emoji: '🗑️', icon: 'mdi-delete-variant', color: 'grey-lighten-1' },
  { value: 2, text: 'Sale', emoji: '🧽', icon: 'mdi-broom', color: 'red-darken-1' },
  { value: 3, text: 'Propre', emoji: '🧼', icon: 'mdi-spray', color: 'orange-darken-1' },
  { value: 4, text: 'Très propre', emoji: '✨', icon: 'mdi-star-circle', color: 'green-darken-1' },
];

// Calcul de la progression
const progressPercentage = computed(() => {
  const totalFields = 6; // lighting, walkpath, openness, feeling, peoplePresence, cleanliness
  const completedFields = [
    formData.value.lighting,
    formData.value.walkpath,
    formData.value.openness,
    formData.value.feeling,
    formData.value.peoplePresence,
    formData.value.cleanliness
  ].filter(field => field !== null).length;
  
  return Math.round((completedFields / totalFields) * 100);
});

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.lighting !== null && 
         formData.value.walkpath !== null && 
         formData.value.openness !== null && 
         formData.value.feeling !== null &&
         formData.value.peoplePresence !== null &&
         formData.value.cleanliness !== null;
});

const takePhoto = () => {
  // Créer un input file dynamique pour la prise de photo
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment'; // Caméra arrière en priorité
  input.multiple = true; // Permettre plusieurs photos
  
  input.onchange = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      if (file && file.type.startsWith('image/')) {
        try {
          // Convertir en base64 pour le stockage
          const base64 = await fileToBase64(file);
          
          // Ajouter à la liste des photos
          formData.value.photos.push({
            id: Date.now() + Math.random(),
            name: file.name,
            data: base64,
            size: file.size,
            type: file.type,
            timestamp: new Date().toISOString()
          });
          
          console.log('Photo ajoutée:', file.name);
        } catch (error) {
          console.error('Erreur traitement photo:', error);
          alert('⚠️ Erreur lors du traitement de la photo');
        }
      }
    }
  };
  
  // Déclencher la sélection de fichier
  input.click();
};

// Fonction utilitaire pour convertir un fichier en base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1);
};

// Fonctions de géolocalisation
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationText.value = '⚠️ Géolocalisation non supportée';
    locationIcon.value = 'mdi-map-marker-off';
    return;
  }

  locationLoading.value = true;
  locationIcon.value = 'mdi-loading';
  locationText.value = 'Obtention de la position...';

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000 // Cache pendant 1 minute
  };

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      coordinates.value = { lat: latitude, lng: longitude };
      locationAccuracy.value = Math.round(accuracy);
      
      // Géocodage inverse pour obtenir l'adresse
      await reverseGeocode(latitude, longitude);
      
      locationLoading.value = false;
      locationIcon.value = 'mdi-check-circle';
      
      // Sauvegarder dans formData
      formData.value.coordinates = { lat: latitude, lng: longitude };
      formData.value.location = locationText.value;
      
      // Créer/mettre à jour la carte
      updateMap(latitude, longitude);
    },
    (error) => {
      locationLoading.value = false;
      locationIcon.value = 'mdi-map-marker-off';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          locationText.value = '⚠️ Accès refusé - Activez la géolocalisation';
          break;
        case error.POSITION_UNAVAILABLE:
          locationText.value = '⚠️ Position indisponible';
          break;
        case error.TIMEOUT:
          locationText.value = '⚠️ Timeout - Réessayez';
          break;
        default:
          locationText.value = '⚠️ Erreur de géolocalisation';
          break;
      }
    },
    options
  );
};

// Géocodage inverse avec OpenStreetMap API
const reverseGeocode = async (lat, lng) => {
  try {
    // Utiliser l'API Nominatim d'OpenStreetMap (gratuite)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`
    );
    
    if (response.ok) {
      const data = await response.json();
      
      // Extraire les informations pertinentes
      const address = data.address || {};
      const city = address.city || address.town || address.village || '';
      const state = address.state || address.region || '';
      const country = address.country || '';
      
      // Formater l'adresse
      let locationString = '';
      if (city) locationString += `${city}`;
      if (state && city) locationString += `, ${state}`;
      if (country) {
        // Ajouter le drapeau du pays
        const flag = country.toLowerCase() === 'maroc' || country.toLowerCase() === 'morocco' ? '🇲🇦' : '🌍';
        locationString += ` ${flag} ${country}`;
      }
      
      locationText.value = locationString || `📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } else {
      // Fallback en cas d'échec de l'API
      fallbackGeocode(lat, lng);
    }
  } catch (error) {
    console.log('Erreur géocodage:', error);
    // Fallback en cas d'erreur
    fallbackGeocode(lat, lng);
  }
};

// Fallback géocodage simplifié avec logs
const fallbackGeocode = (lat, lng) => {
  console.log('🔄 [GEOCODE] Utilisation du fallback pour:', lat, lng);
  
  // Pour Agadir, Maroc (approximatif)
  if (lat >= 30.3 && lat <= 30.5 && lng >= -9.7 && lng <= -9.5) {
    console.log('🇲🇦 [GEOCODE] Détection zone Agadir');
    locationText.value = `🇲🇦 Agadir, Maroc (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } else if (lat >= 31 && lat <= 36 && lng >= -10 && lng <= -1) {
    console.log('🇲🇦 [GEOCODE] Détection zone Maroc');
    locationText.value = `🇲🇦 Maroc (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } else {
    console.log('🌍 [GEOCODE] Zone non reconnue, coordonnées génériques');
    locationText.value = `📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
  
  console.log('🏷️ [GEOCODE] Fallback résultat:', locationText.value);
};

// Fonction pour créer/mettre à jour la carte
const updateMap = async (lat, lng) => {
  console.log('🗺️ [MAP] Mise à jour carte:', lat, lng);
  
  // Attendre que l'élément soit disponible
  await nextTick();
  
  if (!mapContainer.value) {
    console.warn('⚠️ [MAP] Container non disponible');
    return;
  }
  
  try {
    // Charger Leaflet dynamiquement
    if (!window.L) {
      console.log('📦 [MAP] Chargement Leaflet...');
      
      // Charger CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      
      // Charger JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      await new Promise((resolve) => {
        script.onload = resolve;
        document.head.appendChild(script);
      });
      
      console.log('✅ [MAP] Leaflet chargé');
    }
    
    // Créer la carte si elle n'existe pas
    if (!map.value) {
      console.log('🌍 [MAP] Création nouvelle carte');
      map.value = window.L.map(mapContainer.value, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
      }).setView([lat, lng], 15);
      
      // Ajouter les tuiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
      
      // Ajouter le marqueur
      marker.value = window.L.marker([lat, lng]).addTo(map.value);
      
      // Ajouter cercle de précision si disponible
      if (locationAccuracy.value) {
        window.L.circle([lat, lng], {
          radius: locationAccuracy.value,
          color: '#008080',
          fillColor: '#008080',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(map.value);
      }
    } else {
      console.log('🔄 [MAP] Mise à jour position');
      // Mettre à jour position
      map.value.setView([lat, lng], 15);
      if (marker.value) {
        marker.value.setLatLng([lat, lng]);
      }
    }
    
    console.log('✅ [MAP] Carte mise à jour avec succès');
  } catch (error) {
    console.error('❌ [MAP] Erreur:', error);
  }
};

const getAccuracyColor = () => {
  if (!locationAccuracy.value) return 'grey';
  if (locationAccuracy.value <= 10) return 'green';
  if (locationAccuracy.value <= 50) return 'orange';
  return 'red';
};

const saveLocally = () => {
  // Générer un ID unique pour éviter les doublons
  const auditId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  // Sauvegarder dans localStorage pour l'instant
  const auditData = {
    id: auditId,
    ...formData.value,
    timestamp: new Date().toISOString()
  };
  
  console.log('📋 [SAVE] Sauvegarde audit avec ID:', auditId);
  
  const existingAudits = JSON.parse(localStorage.getItem('safety_audits') || '[]');
  
  // Vérifier s'il n'y a pas déjà un audit très similaire (mêmes coordonnées et timestamp proche)
  const isDuplicate = existingAudits.some(audit => {
    if (!audit.coordinates || !auditData.coordinates) return false;
    
    const timeDiff = Math.abs(new Date(audit.timestamp) - new Date(auditData.timestamp));
    const latDiff = Math.abs(audit.coordinates.lat - auditData.coordinates.lat);
    const lngDiff = Math.abs(audit.coordinates.lng - auditData.coordinates.lng);
    
    // Considérer comme doublon si même position (±0.001°) et moins de 30 secondes d'écart
    return latDiff < 0.001 && lngDiff < 0.001 && timeDiff < 30000;
  });
  
  if (isDuplicate) {
    console.warn('⚠️ [SAVE] Doublon détecté, écrasement du dernier audit');
    // Supprimer le dernier audit similaire
    const filteredAudits = existingAudits.filter(audit => {
      if (!audit.coordinates || !auditData.coordinates) return true;
      const timeDiff = Math.abs(new Date(audit.timestamp) - new Date(auditData.timestamp));
      const latDiff = Math.abs(audit.coordinates.lat - auditData.coordinates.lat);
      const lngDiff = Math.abs(audit.coordinates.lng - auditData.coordinates.lng);
      return !(latDiff < 0.001 && lngDiff < 0.001 && timeDiff < 30000);
    });
    filteredAudits.push(auditData);
    localStorage.setItem('safety_audits', JSON.stringify(filteredAudits));
  } else {
    existingAudits.push(auditData);
    localStorage.setItem('safety_audits', JSON.stringify(existingAudits));
  }
  
  lastSaved.value = new Date().toLocaleTimeString();
  console.log('✅ [SAVE] Audit sauvegardé avec succès');
};

const submitAudit = () => {
  if (!isFormValid.value) {
    alert('⚠️ Veuillez répondre à toutes les questions obligatoires.');
    return;
  }

  // Sauvegarder les données
  saveLocally();
  
  console.log('Audit Data:', formData.value);
  auditCompleted.value = true;
  showSuccessDialog.value = true;
};

const goToIntro = () => {
  showSuccessDialog.value = false;
  // Réinitialiser le formulaire
  formData.value = {
    lighting: null,
    walkpath: null,
    openness: null,
    feeling: null,
    peoplePresence: null,
    cleanliness: null,
    comment: '',
    photos: [],
    timestamp: null,
    location: null,
    coordinates: null
  };
  // Réinitialiser la géolocalisation
  locationText.value = 'Cliquez pour obtenir votre position';
  locationAccuracy.value = null;
  locationIcon.value = 'mdi-crosshairs-gps';
  coordinates.value = { lat: null, lng: null };
  
  auditCompleted.value = false;
  // Retourner à l'accueil
  setTimeout(() => {
    window.location.href = '/';
  }, 300);
};

// Auto-démarrage de la géolocalisation
onMounted(() => {
  // Demander automatiquement la géolocalisation au chargement
  getCurrentLocation();
});

// Auto-sauvegarde toutes les 30 secondes si des données sont présentes
setInterval(() => {
  if (progressPercentage.value > 0) {
    saveLocally();
  }
}, 30000);
</script>

<style scoped>
.v-container {
  max-width: 600px;
}

/* Styles pour les photos */
.photo-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.photo-preview:hover {
  transform: scale(1.05);
}

.photo-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7) !important;
}

.photo-delete-btn:hover {
  background: rgba(255, 0, 0, 0.8) !important;
}
</style>
