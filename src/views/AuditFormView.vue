<template>
  <div class="audit-form-view">
    <v-container class="pa-4">
      <!-- Widget de géolocalisation moderne -->
      <v-card class="mb-4" variant="outlined">
        <LocationWidget
          v-model="coordinates"
          :auto-start="true"
          @location-obtained="handleLocationObtained"
          @error="handleLocationError"
        />
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
      <AuditSectionModern
        title="💡 Éclairage"
        description="Disponibilité de suffisamment de lumière pour voir tout autour de vous."
        v-model="formData.lighting"
        :options="lightingOptions"
      />

      <!-- Section Cheminement -->
      <AuditSectionModern
        title="🚶 Cheminement"
        description="Soit un trottoir, soit une route avec de l'espace pour marcher."
        v-model="formData.walkpath"
        :options="walkpathOptions"
      />

      <!-- Section Ouverture -->
      <AuditSectionModern
        title="👁️ Ouverture"
        description="Capacité de voir et de se déplacer dans toutes les directions."
        v-model="formData.openness"
        :options="opennessOptions"
      />

      <!-- Section Sentiment de sécurité -->
      <AuditSectionModern
        title="😊 Ressenti"
        description="Comment vous sentez-vous dans cet endroit en ce moment ?"
        v-model="formData.feeling"
        :options="feelingOptions"
      />

      <!-- Section Présence d'autres personnes -->
      <AuditSectionModern
        title="👥 Présence humaine"
        description="Y a-t-il d'autres personnes autour de vous ?"
        v-model="formData.peoplePresence"
        :options="peoplePresenceOptions"
      />

      <!-- Section Propreté -->
      <AuditSectionModern
        title="🧹 Propreté"
        description="État général de propreté et d'entretien du lieu."
        v-model="formData.cleanliness"
        :options="cleanlinessOptions"
      />

      <!-- Section Surveillance Naturelle -->
      <AuditSectionModern
        title="👁️‍🗨️ Surveillance Naturelle"
        description="Le sentiment d'être visible depuis les bâtiments (Yeux sur la rue)."
        v-model="formData.naturalSurveillance"
        :options="naturalSurveillanceOptions"
      />

      <!-- Section Mixité de l'Espace -->
      <AuditSectionModern
        title="👨‍👩‍👧‍👦 Mixité de l'Espace"
        description="La présence et la diversité des genres et des âges (femmes, enfants)."
        v-model="formData.spaceDiversity"
        :options="spaceDiversityOptions"
      />

      <!-- Section Accès aux Transports -->
      <AuditSectionModern
        title="🚌 Accès aux Transports"
        description="La proximité et la facilité d'accès aux transports en commun."
        v-model="formData.transportAccess"
        :options="transportAccessOptions"
      />

      <!-- Section Sécurité Formelle -->
      <AuditSectionModern
        title="👮 Sécurité Formelle"
        description="La présence visible de la police ou de gardiens de sécurité."
        v-model="formData.formalSecurity"
        :options="formalSecurityOptions"
      />

      <!-- Section Photos moderne -->
      <v-divider class="my-6"></v-divider>
      <v-card variant="outlined">
        <v-card-title class="d-flex align-center">
          📷 Photos de l'audit
        </v-card-title>
        <v-card-text>
          <PhotoCapture
            v-model="formData.photos"
            :max-photos="10"
            :max-size-kb="100"
            @photo-added="handlePhotoAdded"
            @photo-removed="handlePhotoRemoved"
          />
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
        :disabled="!isFormValid || isSubmitting"
        :loading="isSubmitting"
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
    </v-container>

    <!-- ✅ FIX: Tous les dialogs maintenant dans le div principal -->
    <!-- Dialog de debug mobile -->
    <v-dialog v-model="showDebugDialog" max-width="90vw" max-height="80vh">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>🐛 Console Debug</span>
          <div class="d-flex gap-2">
            <v-btn icon="mdi-refresh" @click="refreshGeoInfo" size="small" color="primary"></v-btn>
            <v-btn icon="mdi-content-copy" @click="copyDebugInfo" size="small" color="secondary"></v-btn>
            <v-btn icon="mdi-close" @click="showDebugDialog = false" size="small"></v-btn>
          </div>
        </v-card-title>
        
        <v-card-text style="max-height: 60vh; overflow-y: auto;">
          <!-- Console Debug Réorganisée -->
          <v-expansion-panels multiple variant="accordion">
            
            <!-- Infos de localisation -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                🗺️ Infos de localisation
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info">
                  <!-- Position actuelle -->
                  <div class="mb-3">
                    <strong>📍 Position GPS ({{ locationAccuracy ? locationAccuracy + 'm' : 'N/A' }})</strong>
                    <div v-if="geoDetails.latitude">Latitude: {{ geoDetails.latitude }}</div>
                    <div v-if="geoDetails.longitude">Longitude: {{ geoDetails.longitude }}</div>
                    <div v-if="geoDetails.accuracy">Précision: {{ geoDetails.accuracy }}m</div>
                    <div v-if="geoDetails.altitude">Altitude: {{ geoDetails.altitude }}m</div>
                    <div v-if="geoDetails.altitudeAccuracy">Précision altitude: {{ geoDetails.altitudeAccuracy }}m</div>
                    <div v-if="geoDetails.heading">Cap: {{ geoDetails.heading }}°</div>
                    <div v-if="geoDetails.speed">Vitesse: {{ geoDetails.speed }}m/s</div>
                    <div v-if="geoDetails.timestamp">Timestamp: {{ new Date(geoDetails.timestamp).toLocaleString() }}</div>
                    <div v-if="geoDetails.nearbyInfo">Proximité: {{ geoDetails.nearbyInfo }}</div>
                    
                    <!-- Boutons Maps -->
                    <div v-if="coordinates.lat && coordinates.lng" class="mt-3 d-flex gap-2">
                      <v-btn 
                        size="small" 
                        color="primary" 
                        :href="getGoogleMapsUrl()" 
                        target="_blank"
                        prepend-icon="mdi-map"
                      >
                        Google Maps
                      </v-btn>
                      <v-btn 
                        size="small" 
                        color="secondary" 
                        :href="getOpenStreetMapUrl()" 
                        target="_blank"
                        prepend-icon="mdi-map-outline"
                      >
                        OpenStreetMap
                      </v-btn>
                    </div>
                  </div>
                  
                  <!-- Historique positions -->
                  <div class="mb-3">
                    <strong>🗺️ Historique GPS ({{ geoHistory.length }})</strong>
                    <div style="max-height: 150px; overflow-y: auto;">
                      <div v-for="(pos, index) in geoHistory.slice().reverse()" :key="index" class="geo-history">
                        <div class="text-caption text-grey">{{ formatTime(pos.timestamp) }}</div>
                        <div>{{ pos.lat.toFixed(6) }}, {{ pos.lng.toFixed(6) }} (±{{ pos.accuracy }}m)</div>
                      </div>
                      <div v-if="geoHistory.length === 0" class="text-grey text-caption">Aucune position enregistrée</div>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Réponses utilisateur -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                👤 Réponses Utilisateur ({{ userActions.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info" style="max-height: 200px; overflow-y: auto;">
                  <div v-for="(action, index) in userActions.slice().reverse()" :key="index" class="action-log">
                    <span class="text-caption text-grey">{{ formatTime(action.timestamp) }}</span>
                    <span class="ml-2">{{ action.message }}</span>
                  </div>
                  <div v-if="userActions.length === 0" class="text-grey text-caption">Aucune action enregistrée</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Infos de sauvegarde -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                💾 Infos Sauvegarde
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info">
                  <div><strong>Dernière sauvegarde:</strong> {{ lastSaved || 'Jamais' }}</div>
                  <div><strong>Progrès complet:</strong> {{ progressPercentage }}%</div>
                  <div><strong>Questions répondues:</strong> {{ getAnsweredQuestions() }}/10</div>
                  <div><strong>Photos ajoutées:</strong> {{ formData.photos.length }}</div>
                  <div v-if="formData.photos.length > 0"><strong>Taille totale photos:</strong> {{ getTotalPhotoSize() }}</div>
                  <div v-if="formData.photos.length > 0"><strong>Détail photos:</strong></div>
                  <div v-for="(photo, index) in formData.photos" :key="index" class="ml-3 text-caption" v-if="formData.photos.length > 0">
                    • {{ photo.name }}: {{ photo.originalSize ? (photo.originalSize / 1024).toFixed(1) : '?' }}KB → {{ photo.compressedSize ? (photo.compressedSize / 1024).toFixed(1) : '?' }}KB
                  </div>
                  <div><strong>Formulaire valide:</strong> {{ isFormValid ? '✅ Oui' : '❌ Non' }}</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Capacités navigateur -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                📱 Capacités Navigateur
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info">
                  <div><strong>Géolocalisation:</strong> {{ navigator.geolocation ? '✅ Supporté' : '❌ Non supporté' }}</div>
                  <div><strong>HTTPS:</strong> {{ location.protocol === 'https:' ? '✅ Sécurisé' : '⚠️ Non sécurisé' }}</div>
                  <div><strong>User Agent:</strong> {{ navigator.userAgent.slice(0, 80) }}...</div>
                  <div><strong>Permissions API:</strong> {{ navigator.permissions ? '✅ Disponible' : '❌ Non disponible' }}</div>
                  <div v-if="permissionState"><strong>État permission:</strong> {{ permissionState }}</div>
                  <div><strong>Plateforme:</strong> {{ navigator.platform || 'Inconnue' }}</div>
                  <div><strong>Langue:</strong> {{ navigator.language || 'Inconnue' }}</div>
                  <div><strong>Cookies activés:</strong> {{ navigator.cookieEnabled ? '✅ Oui' : '❌ Non' }}</div>
                  <div><strong>En ligne:</strong> {{ navigator.onLine ? '✅ Connecté' : '❌ Hors ligne' }}</div>
                  <div><strong>Mémoire disponible:</strong> {{ navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'Inconnue' }}</div>
                  <div><strong>Connexion:</strong> {{ getConnectionInfo() }}</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Console logs -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                📜 Logs Console ({{ debugLogs.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info" style="max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                  <div v-for="(log, index) in debugLogs.slice().reverse()" :key="index" class="log-entry" :class="log.type">
                    <span class="text-caption">{{ formatTime(log.timestamp) }}</span>
                    <span class="ml-2">{{ log.message }}</span>
                  </div>
                  <div v-if="debugLogs.length === 0" class="text-grey text-caption">Aucun log disponible</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Tous les logs mélangés -->  
            <v-expansion-panel>
              <v-expansion-panel-title>
                📋 Tous les logs ({{ allLogsCount }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="debug-info" style="max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 12px;">
                  <div v-for="(log, index) in allLogsCombined.slice().reverse()" :key="index" class="log-entry" :class="log.category || log.type">
                    <span class="text-caption">{{ formatTime(log.timestamp) }}</span>
                    <span class="ml-1" :class="`log-category-${log.category || log.type}`">[{{ log.category?.toUpperCase() || log.type?.toUpperCase() }}]</span>
                    <span class="ml-2">{{ log.message }}</span>
                  </div>
                  <div v-if="allLogsCount === 0" class="text-grey text-caption">Aucun log disponible</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
          </v-expansion-panels>
        </v-card-text>
        
        <v-card-actions>
          <v-btn @click="clearDebugLogs" color="orange" variant="text">Effacer logs</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="showDebugDialog = false" color="primary">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog photo en plein écran -->
    <v-dialog v-model="showPhotoDialog" max-width="95vw" max-height="95vh">
      <v-card v-if="selectedPhoto" class="photo-dialog">
        <v-card-title class="d-flex justify-space-between align-center pa-2">
          <span class="text-subtitle-1">📸 {{ selectedPhoto.name || `Photo ${selectedPhotoIndex + 1}` }}</span>
          <v-btn icon="mdi-close" @click="showPhotoDialog = false" variant="text" size="small"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-2">
          <div class="photo-container">
            <v-img
              :src="selectedPhoto.data"
              class="photo-full"
              contain
              max-height="75vh"
              @click="showPhotoDialog = false"
              style="cursor: pointer;"
            >
              <!-- Overlay avec bouton fermer accessible -->
              <div class="photo-overlay-close">
                <v-btn 
                  icon="mdi-close" 
                  @click.stop="showPhotoDialog = false" 
                  variant="elevated" 
                  color="white"
                  size="small"
                  class="close-btn-overlay"
                ></v-btn>
              </div>
            </v-img>
          </div>
        </v-card-text>
        
        <v-card-text v-if="selectedPhoto.originalSize || selectedPhoto.compressedSize" class="pa-2">
          <div class="d-flex justify-space-between text-caption text-grey">
            <span v-if="selectedPhoto.originalSize">Original: {{ (selectedPhoto.originalSize / 1024).toFixed(1)}}KB</span>
            <span v-if="selectedPhoto.compressedSize">Compressé: {{ (selectedPhoto.compressedSize / 1024).toFixed(1)}}KB</span>
            <span v-if="selectedPhoto.timestamp">{{ formatTime(new Date(selectedPhoto.timestamp).getTime()) }}</span>
          </div>
        </v-card-text>
        
        <!-- Bouton fermer en bas pour accessibilité -->
        <v-card-actions class="pa-2">
          <v-spacer></v-spacer>
          <v-btn @click="showPhotoDialog = false" color="primary">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation -->
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card class="text-center pa-4">
        <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
        <v-card-title class="text-h5 mb-2">🎉 Audit Terminé !</v-card-title>
        <v-card-text class="text-body-1">
          Merci pour votre contribution à la sécurité urbaine.
          <br>
          Vos données ont été sauvegardées{{ isOnline ? ' et synchronisées' : ' localement' }}.
        </v-card-text>
        <v-card-actions class="justify-center flex-column gap-2">
          <!-- ✅ NOUVEAU: Boutons améliorés -->
          <v-btn 
            color="primary" 
            @click="startNewAudit"
            size="large"
            variant="elevated"
          >
            <v-icon start>mdi-plus</v-icon>
            Nouvel audit
          </v-btn>
          
          <div class="d-flex gap-2">
            <v-btn 
              color="secondary" 
              @click="goToHistory"
              variant="outlined"
            >
              <v-icon start>mdi-history</v-icon>
              Mes audits
            </v-btn>
            
            <v-btn 
              color="grey" 
              @click="goToHome"
              variant="outlined"
            >
              <v-icon start>mdi-home</v-icon>
              Accueil
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import AuditSectionModern from '@/components/AuditSectionModern.vue';
import LocationWidget from '@/components/widgets/LocationWidget.vue'
import PhotoCapture from '@/components/widgets/PhotoCapture.vue'
import { useAuth } from '@/composables/useSupabase';
import { useAudits } from '@/composables/useAudits';
import { useRouter } from 'vue-router';
import { getGlobalSyncQueue } from '@/composables/useSyncQueue'; // ✅ NOUVEAU: Pour isOnline

// Import SVG assets
import lumi1 from '@/assets/icons/lumi1.svg'
import lumi2 from '@/assets/icons/lumi2.svg'
import lumi3 from '@/assets/icons/lumi3.svg'
import lumi4 from '@/assets/icons/lumi4.svg'
import walk1 from '@/assets/icons/walk1.svg'
import walk2 from '@/assets/icons/walk2.svg'
import walk3 from '@/assets/icons/walk3.svg'
import walk4 from '@/assets/icons/walk4.svg'
import visibility1 from '@/assets/icons/visibility1.svg'
import visibility2 from '@/assets/icons/visibility2.svg'
import visibility3 from '@/assets/icons/visibility3.svg'
import visibility4 from '@/assets/icons/visibility4.svg'
import clean1 from '@/assets/icons/clean1.svg'
import clean2 from '@/assets/icons/clean2.svg'
import clean3 from '@/assets/icons/clean3.svg'
import clean4 from '@/assets/icons/clean4.svg'
import feeling1 from '@/assets/icons/feeling1.svg'
import feeling2 from '@/assets/icons/feeling2.svg'
import feeling3 from '@/assets/icons/feeling3.svg'
import feeling4 from '@/assets/icons/feeling4.svg'
import frequentation1 from '@/assets/icons/frequentation1.svg'
import frequentation2 from '@/assets/icons/frequentation2.svg'
import frequentation3 from '@/assets/icons/frequentation3.svg'
import frequentation4 from '@/assets/icons/frequentation4.svg'
import surveillance1 from '@/assets/icons/surveillance1.svg'
import surveillance2 from '@/assets/icons/surveillance2.svg'
import surveillance3 from '@/assets/icons/surveillance3.svg'
import surveillance4 from '@/assets/icons/surveillance4.svg'
import mix1 from '@/assets/icons/mix1.svg'
import mix2 from '@/assets/icons/mix2.svg'
import mix3 from '@/assets/icons/mix3.svg'
import mix4 from '@/assets/icons/mix4.svg'
import bus1 from '@/assets/icons/bus1.svg'
import bus2 from '@/assets/icons/bus2.svg'
import bus3 from '@/assets/icons/bus3.svg'
import bus4 from '@/assets/icons/bus4.svg'
import police1 from '@/assets/icons/police1.svg'
import police2 from '@/assets/icons/police2.svg'
import police3 from '@/assets/icons/police3.svg'
import police4 from '@/assets/icons/police4.svg'

const showSuccessDialog = ref(false);
const auditCompleted = ref(false);
const lastSaved = ref(null);
const showDebugDialog = ref(false);

// État de géolocalisation
const locationText = ref('Cliquez pour obtenir votre position');
const locationLoading = ref(false);
const locationAccuracy = ref(null);
const locationIcon = ref('mdi-crosshairs-gps');
const coordinates = ref({ lat: null, lng: null });
const mapContainer = ref(null);
const map = ref(null);
const marker = ref(null);

// Debug et logging
const debugLogs = ref([]);
const userActions = ref([]);
const geoHistory = ref([]);
const geoDetails = ref({});
const permissionState = ref('');
const geoLogs = ref([]);
const showPhotoDialog = ref(false);
const selectedPhoto = ref(null);
const selectedPhotoIndex = ref(0);

const formData = ref({
  lighting: null,
  walkpath: null,
  openness: null,
  feeling: null,
  peoplePresence: null,
  cleanliness: null,
  naturalSurveillance: null,
  spaceDiversity: null,
  transportAccess: null,
  formalSecurity: null,
  comment: '',
  photos: [],
  timestamp: null,
  location: null,
  coordinates: null
});

// Fonctions de debug et logging
const addDebugLog = (message, type = 'info') => {
  debugLogs.value.push({
    timestamp: Date.now(),
    message,
    type,
    category: 'debug'
  });
  // Garder seulement les 100 derniers logs
  if (debugLogs.value.length > 100) {
    debugLogs.value = debugLogs.value.slice(-100);
  }
  console.log(`[${type.toUpperCase()}]`, message);
};

const addGeoLog = (message, type = 'info') => {
  geoLogs.value.push({
    timestamp: Date.now(),
    message,
    type,
    category: 'geo'
  });
  // Garder seulement les 50 derniers logs geo
  if (geoLogs.value.length > 50) {
    geoLogs.value = geoLogs.value.slice(-50);
  }
  console.log(`[GEO-${type.toUpperCase()}]`, message);
};

const addUserAction = (action) => {
  const timestamp = new Date().getTime();
  userActions.value.unshift({
    action,
    timestamp,
    formattedTime: formatTime(timestamp),
    message: action // ✅ FIX: Ajout du champ message manquant
  });

  // Limiter le nombre d'actions stockées
  if (userActions.value.length > 30) {
    userActions.value = userActions.value.slice(0, 30);
  }

  addDebugLog(`👤 ${action}`, 'action');
};

// Handlers pour LocationWidget
const handleLocationObtained = (data) => {
  formData.value.location = locationText.value || data.coordinates.lat + ', ' + data.coordinates.lng
  formData.value.coordinates = data.coordinates
  locationAccuracy.value = data.accuracy
  addUserAction('📍 Position GPS obtenue via LocationWidget')
}

const handleLocationError = (error) => {
  addDebugLog(`❌ Erreur GPS: ${error.message}`, 'error')
  locationText.value = '⚠️ Erreur de géolocalisation'
}

// Handlers pour PhotoCapture  
const handlePhotoAdded = (photo) => {
  addUserAction(`📷 Photo ajoutée: ${photo.name}`)
  saveProgress()
}

const handlePhotoRemoved = (photo) => {
  addUserAction(`🗑️ Photo supprimée: ${photo.name}`)
  saveProgress()
}

const addGeoHistory = (lat, lng, accuracy) => {
  geoHistory.value.push({
    timestamp: Date.now(),
    lat,
    lng,
    accuracy
  });
  // Garder seulement les 20 dernières positions
  if (geoHistory.value.length > 20) {
    geoHistory.value = geoHistory.value.slice(-20);
  }
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

const clearDebugLogs = () => {
  debugLogs.value = [];
  userActions.value = [];
  geoHistory.value = [];
  geoLogs.value = [];
  addDebugLog('🗑️ Logs effacés', 'info');
};

// Computed pour combiner tous les logs
const allLogsCombined = computed(() => {
  const allLogs = [
    ...debugLogs.value,
    ...userActions.value,
    ...geoLogs.value
  ];
  return allLogs.sort((a, b) => a.timestamp - b.timestamp);
});

const allLogsCount = computed(() => {
  return debugLogs.value.length + userActions.value.length + geoLogs.value.length;
});

const refreshGeoInfo = async () => {
  addUserAction('🔄 Actualisation infos GPS');
  
  // Vérifier les permissions
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      permissionState.value = result.state;
      addGeoLog(`🔐 Permission géolocalisation: ${result.state}`, 'info');
    } catch (error) {
      addGeoLog(`⚠️ Erreur vérification permissions: ${error.message}`, 'warn');
    }
  } else {
    addGeoLog('❌ API Permissions non supportée par ce navigateur', 'warn');
  }
  
  // Relancer la géolocalisation
  getCurrentLocation();
};

const copyDebugInfo = async () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    location: {
      lat: coordinates.value.lat,
      lng: coordinates.value.lng,
      accuracy: locationAccuracy.value,
      details: geoDetails.value
    },
    browser: {
      userAgent: navigator.userAgent,
      geolocation: !!navigator.geolocation,
      permissions: !!navigator.permissions,
      protocol: location.protocol
    },
    logs: debugLogs.value.slice(-20),
    actions: userActions.value.slice(-10),
    geoHistory: geoHistory.value.slice(-5)
  };
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
    addUserAction('📋 Infos debug copiées');
  } catch (error) {
    addDebugLog(`⚠️ Erreur copie: ${error.message}`, 'warn');
  }
};

// Fonctions pour les infos de sauvegarde
const getAnsweredQuestions = () => {
  return [
    formData.value.lighting,
    formData.value.walkpath,
    formData.value.openness,
    formData.value.feeling,
    formData.value.peoplePresence,
    formData.value.cleanliness,
    formData.value.naturalSurveillance,
    formData.value.spaceDiversity,
    formData.value.transportAccess,
    formData.value.formalSecurity
  ].filter(answer => answer !== null).length;
};

const getTotalPhotoSize = () => {
  const totalBytes = formData.value.photos.reduce((sum, photo) => {
    return sum + (photo.compressedSize || photo.size || 0);
  }, 0);
  return `${(totalBytes / 1024).toFixed(1)}KB`;
};

const getGoogleMapsUrl = () => {
  if (!coordinates.value.lat || !coordinates.value.lng) return '#';
  return `https://maps.google.com/maps?q=${coordinates.value.lat},${coordinates.value.lng}&z=16`;
};

const getOpenStreetMapUrl = () => {
  if (!coordinates.value.lat || !coordinates.value.lng) return '#';
  return `https://www.openstreetmap.org/?mlat=${coordinates.value.lat}&mlon=${coordinates.value.lng}&zoom=16`;
};

const getConnectionInfo = () => {
  if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return `${connection.effectiveType || 'Inconnue'} (${connection.downlink || '?'}Mbps)`;
  }
  return 'Information non disponible';
};

const lightingOptions = [
  { 
    value: 1, 
    text: 'Aucun', 
    svgPath: lumi1,
    emoji: '🌑', 
    icon: 'mdi-lightbulb-off-outline', 
    color: 'grey-lighten-1',
    description: 'Pas d\'éclairage visible'
  },
  { 
    value: 2, 
    text: 'Faible', 
    svgPath: lumi2,
    emoji: '🌒', 
    icon: 'mdi-lightbulb-outline', 
    color: 'red-darken-1',
    description: 'Éclairage insuffisant'
  },
  { 
    value: 3, 
    text: 'Suffisant', 
    svgPath: lumi3,
    emoji: '🌕', 
    icon: 'mdi-lightbulb-on-outline', 
    color: 'orange-darken-1',
    description: 'Bon niveau d\'éclairage'
  },
  { 
    value: 4, 
    text: 'Excellent', 
    svgPath: lumi4,
    emoji: '☀️', 
    icon: 'mdi-lightbulb-on', 
    color: 'green-darken-1',
    description: 'Très bien éclairé'
  },
];

const walkpathOptions = [
  { 
    value: 1, 
    text: 'Aucun', 
    svgPath: walk1,
    emoji: '🚫', 
    icon: 'mdi-cancel', 
    color: 'grey-lighten-1',
    description: 'Pas de cheminement'
  },
  { 
    value: 2, 
    text: 'Mauvais', 
    svgPath: walk2,
    emoji: '🕳️', 
    icon: 'mdi-alert-circle-outline', 
    color: 'red-darken-1',
    description: 'Cheminement difficile'
  },
  { 
    value: 3, 
    text: 'Correct', 
    svgPath: walk3,
    emoji: '🛤️', 
    icon: 'mdi-check-circle-outline', 
    color: 'orange-darken-1',
    description: 'Cheminement praticable'
  },
  { 
    value: 4, 
    text: 'Excellent', 
    svgPath: walk4,
    emoji: '🛣️', 
    icon: 'mdi-thumb-up-outline', 
    color: 'green-darken-1',
    description: 'Cheminement optimal'
  },
];

const opennessOptions = [
  { 
    value: 1, 
    text: 'Bloqué', 
    svgPath: visibility1,
    emoji: '🧱', 
    icon: 'mdi-arrow-collapse-all', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Limité', 
    svgPath: visibility2,
    emoji: '🚧', 
    icon: 'mdi-arrow-expand-horizontal', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Ouvert', 
    svgPath: visibility3,
    emoji: '🌅', 
    icon: 'mdi-arrow-expand-all', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Très ouvert', 
    svgPath: visibility4,
    emoji: '🌄', 
    icon: 'mdi-arrow-top-left-bottom-right', 
    color: 'green-darken-1' 
  },
];

const feelingOptions = [
  { 
    value: 1, 
    text: 'Effrayant', 
    svgPath: feeling1,
    emoji: '😰', 
    icon: 'mdi-emoticon-dead-outline', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Inconfortable', 
    svgPath: feeling2,
    emoji: '😟', 
    icon: 'mdi-emoticon-sad-outline', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Acceptable', 
    svgPath: feeling3,
    emoji: '😐', 
    icon: 'mdi-emoticon-neutral-outline', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Confortable', 
    svgPath: feeling4,
    emoji: '😊', 
    icon: 'mdi-emoticon-happy-outline', 
    color: 'green-darken-1' 
  },
];

const peoplePresenceOptions = [
  { 
    value: 1, 
    text: 'Personne', 
    svgPath: frequentation1,
    emoji: '👻', 
    icon: 'mdi-account-off', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Peu', 
    svgPath: frequentation2,
    emoji: '👤', 
    icon: 'mdi-account', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Quelques-uns', 
    svgPath: frequentation3,
    emoji: '👥', 
    icon: 'mdi-account-group-outline', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Beaucoup', 
    svgPath: frequentation4,
    emoji: '👫', 
    icon: 'mdi-account-group', 
    color: 'green-darken-1' 
  },
];

const cleanlinessOptions = [
  { 
    value: 1, 
    text: 'Très sale', 
    svgPath: clean1,
    emoji: '🗑️', 
    icon: 'mdi-delete-variant', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Sale', 
    svgPath: clean2,
    emoji: '🧽', 
    icon: 'mdi-broom', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Propre', 
    svgPath: clean3,
    emoji: '🧼', 
    icon: 'mdi-spray', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Très propre', 
    svgPath: clean4,
    emoji: '✨', 
    icon: 'mdi-star-circle', 
    color: 'green-darken-1' 
  },
];

// Nouvelles options pour les 4 questions additionnelles
const naturalSurveillanceOptions = [
  { 
    value: 1, 
    text: 'Aucune', 
    svgPath: surveillance1,
    emoji: '🏚️', 
    icon: 'mdi-eye-off', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Faible', 
    svgPath: surveillance2,
    emoji: '🏢', 
    icon: 'mdi-eye-outline', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Moyenne', 
    svgPath: surveillance3,
    emoji: '🏘️', 
    icon: 'mdi-eye', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Élevée', 
    svgPath: surveillance4,
    emoji: '🏪', 
    icon: 'mdi-eye-circle', 
    color: 'green-darken-1' 
  },
];

const spaceDiversityOptions = [
  { 
    value: 1, 
    text: 'Non mixte', 
    svgPath: mix1,
    emoji: '👔', 
    icon: 'mdi-account-tie', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Peu mixte', 
    svgPath: mix2,
    emoji: '👨‍👨', 
    icon: 'mdi-account-multiple', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Assez mixte', 
    svgPath: mix3,
    emoji: '👨‍👩', 
    icon: 'mdi-account-group', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Très mixte', 
    svgPath: mix4,
    emoji: '👨‍👩‍👧‍👦', 
    icon: 'mdi-account-supervisor-circle', 
    color: 'green-darken-1' 
  },
];

const transportAccessOptions = [
  { 
    value: 1, 
    text: 'Inaccessible', 
    svgPath: bus1,
    emoji: '🚫', 
    icon: 'mdi-bus-alert', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Éloigné', 
    svgPath: bus2,
    emoji: '🚶‍♂️', 
    icon: 'mdi-bus-clock', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Proche', 
    svgPath: bus3,
    emoji: '🚏', 
    icon: 'mdi-bus-stop', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Très proche', 
    svgPath: bus4,
    emoji: '🚌', 
    icon: 'mdi-bus-multiple', 
    color: 'green-darken-1' 
  },
];

const formalSecurityOptions = [
  { 
    value: 1, 
    text: 'Aucune', 
    svgPath: police1,
    emoji: '❌', 
    icon: 'mdi-shield-off', 
    color: 'grey-lighten-1' 
  },
  { 
    value: 2, 
    text: 'Faible', 
    svgPath: police2,
    emoji: '👮', 
    icon: 'mdi-shield-outline', 
    color: 'red-darken-1' 
  },
  { 
    value: 3, 
    text: 'Moyenne', 
    svgPath: police3,
    emoji: '🚓', 
    icon: 'mdi-shield-check', 
    color: 'orange-darken-1' 
  },
  { 
    value: 4, 
    text: 'Élevée', 
    svgPath: police4,
    emoji: '🚔', 
    icon: 'mdi-shield-star', 
    color: 'green-darken-1' 
  },
];

// Calcul de la progression
const progressPercentage = computed(() => {
  const totalFields = 10; // 10 questions maintenant
  const completedFields = [
    formData.value.lighting,
    formData.value.walkpath,
    formData.value.openness,
    formData.value.feeling,
    formData.value.peoplePresence,
    formData.value.cleanliness,
    formData.value.naturalSurveillance,
    formData.value.spaceDiversity,
    formData.value.transportAccess,
    formData.value.formalSecurity
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
         formData.value.cleanliness !== null &&
         formData.value.naturalSurveillance !== null &&
         formData.value.spaceDiversity !== null &&
         formData.value.transportAccess !== null &&
         formData.value.formalSecurity !== null;
});

const takePhoto = () => {
  addUserAction('📷 Ouverture interface photos');
  
  // Créer un input file dynamique pour la prise de photo
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment'; // Caméra arrière en priorité
  input.multiple = true; // Permettre plusieurs photos
  
  input.onchange = async (event) => {
    const files = Array.from(event.target.files);
    addUserAction(`🖼️ ${files.length} photo(s) sélectionnée(s)`);
    
    for (const file of files) {
      if (file && file.type.startsWith('image/')) {
        try {
          addDebugLog(`📷 Traitement photo: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`, 'info');
          
          // Compresser l'image avant stockage
          const compressedFile = await compressImage(file, 100); // 100KB max
          
          // Convertir en base64 pour le stockage
          const base64 = await fileToBase64(compressedFile);
          
          // Ajouter à la liste des photos
          const photoData = {
            id: Date.now() + Math.random(),
            name: file.name,
            data: base64,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            type: file.type,
            timestamp: new Date().toISOString()
          };
          
          formData.value.photos.push(photoData);
          
          addUserAction(`✅ Photo ajoutée: ${file.name} (${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB)`);
          addDebugLog(`🗂️ Compression: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`, 'success');
          
          // Sauvegarde automatique du progrès
          saveProgress();
        } catch (error) {
          addDebugLog(`❌ Erreur traitement photo: ${error.message}`, 'error');
          addUserAction(`❌ Échec ajout photo: ${file.name}`);
        }
      }
    }
  };
  
  // Déclencher la sélection de fichier
  input.click();
};

// Fonction de compression d'image
const compressImage = (file, maxSizeKB = 100) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculer les nouvelles dimensions
      let { width, height } = img;
      const maxDimension = 800; // Limite à 800px max
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir en blob avec compression
      canvas.toBlob((blob) => {
        // Si toujours trop gros, réduire la qualité
        if (blob.size > maxSizeKB * 1024) {
          canvas.toBlob((compressedBlob) => {
            const compressedFile = new File([compressedBlob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.6); // Qualité réduite
        } else {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', 0.8); // Qualité normale
    };
    
    img.src = URL.createObjectURL(file);
  });
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
  const photo = formData.value.photos[index];
  formData.value.photos.splice(index, 1);
  addUserAction(`🗜️ Photo supprimée: ${photo.name || 'Photo ' + (index + 1)}`);
  saveProgress(); // Sauvegarde du progrès
};

// Fonction pour ouvrir le dialog photo
const openPhotoDialog = (photo, index) => {
  if (photo.data) {
    selectedPhoto.value = photo;
    selectedPhotoIndex.value = index;
    showPhotoDialog.value = true;
    addUserAction(`🔍 Ouverture photo en grand: ${photo.name || 'Photo ' + (index + 1)}`);
  }
};

// Fonctions de géolocalisation
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationText.value = '⚠️ Géolocalisation non supportée';
    locationIcon.value = 'mdi-map-marker-off';
    addGeoLog('❌ Géolocalisation non supportée par le navigateur', 'error');
    return;
  }

  addGeoLog('🔄 Démarrage de la géolocalisation...', 'info');
  locationLoading.value = true;
  locationIcon.value = 'mdi-loading';
  locationText.value = 'Obtention de la position...';

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000 // Cache pendant 1 minute
  };
  
  addGeoLog(`⚙️ Options GPS: précision=${options.enableHighAccuracy}, timeout=${options.timeout}ms, cache=${options.maximumAge}ms`, 'info');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
      
      addGeoLog(`📍 Position obtenue: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`, 'success');
      
      coordinates.value = { lat: latitude, lng: longitude };
      locationAccuracy.value = Math.round(accuracy);
      
      // Stocker les détails GPS complets
      geoDetails.value = {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        accuracy: Math.round(accuracy),
        altitude: altitude ? Math.round(altitude) : null,
        altitudeAccuracy: altitudeAccuracy ? Math.round(altitudeAccuracy) : null,
        heading: heading ? Math.round(heading) : null,
        speed: speed ? speed.toFixed(2) : null,
        timestamp: position.timestamp
      };
      
      addGeoLog(`📊 Détails GPS complets stockés`, 'info');
      
      // Ajouter à l'historique
      addGeoHistory(latitude, longitude, Math.round(accuracy));
      
      // Géocodage inverse pour obtenir l'adresse
      addGeoLog('🌍 Démarrage géocodage inverse...', 'info');
      await reverseGeocode(latitude, longitude);
      
      locationLoading.value = false;
      locationIcon.value = 'mdi-check-circle';
      
      // Sauvegarder dans formData
      formData.value.coordinates = { lat: latitude, lng: longitude };
      formData.value.location = locationText.value;
      
      addGeoLog('💾 Coordonnées sauvegardées dans le formulaire', 'info');
      
      // Créer/mettre à jour la carte
      addGeoLog('🗺️ Mise à jour de la carte...', 'info');
      updateMap(latitude, longitude);
    },
    (error) => {
      locationLoading.value = false;
      locationIcon.value = 'mdi-map-marker-off';
      
      let errorMsg = '';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = '⚠️ Accès refusé - Activez la géolocalisation';
          addGeoLog('🚫 Permission de géolocalisation refusée par l\'utilisateur', 'error');
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = '⚠️ Position indisponible';
          addGeoLog('📍 Position GPS indisponible (pas de signal)', 'error');
          break;
        case error.TIMEOUT:
          errorMsg = '⚠️ Timeout - Réessayez';
          addGeoLog(`⏱️ Timeout GPS après ${options.timeout}ms`, 'error');
          break;
        default:
          errorMsg = '⚠️ Erreur de géolocalisation';
          addGeoLog(`❌ Erreur GPS inconnue: ${error.message}`, 'error');
          break;
      }
      
      locationText.value = errorMsg;
      addGeoLog(`🔴 Échec géolocalisation: ${errorMsg}`, 'error');
    },
    options
  );
};

// Géocodage inverse avec OpenStreetMap API
const reverseGeocode = async (lat, lng) => {
  try {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`;
    addGeoLog(`🌐 Appel API géocodage: Nominatim`, 'info');
    
    // Utiliser l'API Nominatim d'OpenStreetMap (gratuite)
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      addGeoLog(`✅ Réponse API géocodage reçue: ${JSON.stringify(data.address).slice(0, 100)}...`, 'success');
      
      // Extraire les informations pertinentes
      const address = data.address || {};
      const city = address.city || address.town || address.village || '';
      const state = address.state || address.region || '';
      const country = address.country || '';
      const road = address.road || '';
      const amenity = address.amenity || '';
      const shop = address.shop || '';
      const leisure = address.leisure || '';
      
      addGeoLog(`🏙️ Adresse extraite: ville=${city}, région=${state}, pays=${country}`, 'info');
      addGeoLog(`🗺️ Proximité: route=${road}, amenity=${amenity}, shop=${shop}, leisure=${leisure}`, 'info');
      
      // Formater l'adresse principale
      let locationString = '';
      if (city) locationString += `${city}`;
      if (state && city) locationString += `, ${state}`;
      if (country) {
        // Ajouter le drapeau du pays
        const flag = country.toLowerCase() === 'maroc' || country.toLowerCase() === 'morocco' ? '🇲🇦' : '🌍';
        locationString += ` ${flag} ${country}`;
      }
      
      // Stocker les détails pour affichage
      const nearbyInfo = [];
      if (road) nearbyInfo.push(`🚣 ${road}`);
      if (amenity) nearbyInfo.push(`🏢 ${amenity}`);
      if (shop) nearbyInfo.push(`🏬 ${shop}`);
      if (leisure) nearbyInfo.push(`🏞️ ${leisure}`);
      
      // Stocker les infos de proximité dans les détails géo
      geoDetails.value = {
        ...geoDetails.value,
        nearbyInfo: nearbyInfo.join(' • ') || 'Aucune info de proximité',
        fullAddress: data
      };
      
      locationText.value = locationString || `📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      addGeoLog(`🏷️ Adresse finale: ${locationText.value}`, 'success');
    } else {
      addGeoLog(`⚠️ Échec API géocodage (${response.status}), passage au fallback`, 'warn');
      // Fallback en cas d'échec de l'API
      fallbackGeocode(lat, lng);
    }
  } catch (error) {
    addGeoLog(`❌ Erreur géocodage: ${error.message}`, 'error');
    // Fallback en cas d'erreur
    fallbackGeocode(lat, lng);
  }
};

// Fallback géocodage simplifié avec logs
const fallbackGeocode = (lat, lng) => {
  addGeoLog(`🔄 Utilisation du fallback pour: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, 'warn');
  
  if (lat >= 30.3 && lat <= 30.5 && lng >= -9.7 && lng <= -9.5) {
    addGeoLog('🇲🇦 Détection zone Agadir', 'success');
    locationText.value = `🇲🇦 Agadir, Maroc (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } else if (lat >= 31 && lat <= 36 && lng >= -10 && lng <= -1) {
    addGeoLog('🇲🇦 Détection zone Maroc', 'info');
    locationText.value = `🇲🇦 Maroc (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  } else {
    addGeoLog('🌍 Zone non reconnue, coordonnées génériques', 'warn');
    locationText.value = `📍 Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
  
  addGeoLog(`🏷️ Fallback résultat: ${locationText.value}`, 'info');
};

// Fonction pour créer/mettre à jour la carte
const updateMap = async (lat, lng) => {
  addGeoLog('🗺️ [MAP] Mise à jour carte:', 'info');
  addGeoLog(`📍 [MAP] Coordonnées: ${lat}, ${lng}`, 'info');
  
  // Attendre que l'élément soit disponible
  await nextTick();
  
  if (!mapContainer.value) {
    addGeoLog('⚠️ [MAP] Container non disponible', 'warn');
    return;
  }
  
  try {
    // Charger Leaflet dynamiquement
    if (!window.L) {
      addGeoLog('📦 [MAP] Chargement Leaflet...', 'info');
      
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
      
      addGeoLog('✅ [MAP] Leaflet chargé avec succès', 'success');
    }
    
    // Créer la carte si elle n'existe pas
    if (!map.value) {
      addGeoLog('🌍 [MAP] Création nouvelle carte', 'info');
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
      addGeoLog('📍 [MAP] Marqueur ajouté', 'info');
      
      // Ajouter cercle de précision si disponible
      if (locationAccuracy.value) {
        window.L.circle([lat, lng], {
          radius: locationAccuracy.value,
          color: '#008080',
          fillColor: '#008080',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(map.value);
        addGeoLog(`🎯 [MAP] Cercle de précision ajouté (${locationAccuracy.value}m)`, 'info');
      }
    } else {
      addGeoLog('🔄 [MAP] Mise à jour position existante', 'info');
      // Mettre à jour position
      map.value.setView([lat, lng], 15);
      if (marker.value) {
        marker.value.setLatLng([lat, lng]);
      }
    }
    
    addGeoLog('✅ [MAP] Carte mise à jour avec succès', 'success');
  } catch (error) {
    addGeoLog(`❌ [MAP] Erreur: ${error.message}`, 'error');
  }
};

const getAccuracyColor = () => {
  if (!locationAccuracy.value) return 'grey';
  if (locationAccuracy.value <= 10) return 'green';
  if (locationAccuracy.value <= 50) return 'orange';
  return 'red';
};

const saveLocally = (auditDataToSave = null) => {
  // ✅ NOUVEAU: Utiliser param ou formData par défaut
  const dataToSave = auditDataToSave || formData.value;
  
  // Générer un ID unique pour éviter les doublons
  const auditId = dataToSave.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Sauvegarder dans localStorage pour l'instant
  const auditData = {
    id: auditId,
    ...dataToSave,
    timestamp: new Date().toISOString(),
    // ✅ NOUVEAU: Ajouter infos pour compatibilité avec useAudits
    userId: currentUser?.value?.user_id,
    localId: auditId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    synced: false,
    localOnly: true
  };
  
  addDebugLog(`📋 Sauvegarde audit avec ID: ${auditId}`, 'info');
  
  // ✅ NOUVEAU: Utiliser la même clé que useAudits.js
  const existingAudits = JSON.parse(localStorage.getItem('onuf_audits_local') || '[]');
  
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
    addDebugLog('⚠️ Doublon détecté, écrasement du dernier audit', 'warn');
    // Supprimer le dernier audit similaire
    const filteredAudits = existingAudits.filter(audit => {
      if (!audit.coordinates || !auditData.coordinates) return true;
      const timeDiff = Math.abs(new Date(audit.timestamp) - new Date(auditData.timestamp));
      const latDiff = Math.abs(audit.coordinates.lat - auditData.coordinates.lat);
      const lngDiff = Math.abs(audit.coordinates.lng - auditData.coordinates.lng);
      return !(latDiff < 0.001 && lngDiff < 0.001 && timeDiff < 30000);
    });
    filteredAudits.push(auditData);
    localStorage.setItem('onuf_audits_local', JSON.stringify(filteredAudits)); // ✅ NOUVEAU: Même clé
  } else {
    existingAudits.push(auditData);
    localStorage.setItem('onuf_audits_local', JSON.stringify(existingAudits)); // ✅ NOUVEAU: Même clé
  }
  
  lastSaved.value = new Date().toLocaleTimeString();
  addDebugLog('✅ Audit sauvegardé avec succès', 'success');
  
  return auditData; // ✅ NOUVEAU: Retourner les données sauvegardées
};

// Sauvegarde intermédiaire (sans créer d'audit final)
// ✅ NOUVEAU: Seulement local, pas de cloud pour éviter pollution DB
const saveProgress = () => {
  // Sauvegarde locale existante
  const progressData = {
    ...formData.value,
    isProgress: true,
    lastUpdate: new Date().toISOString()
  };
  
  localStorage.setItem('audit_progress', JSON.stringify(progressData));
  lastSaved.value = new Date().toLocaleTimeString();
  addDebugLog('🔄 Progrès sauvegardé (temporaire local uniquement)', 'info');
  addUserAction('💾 Sauvegarde automatique du progrès');
  
  // ✅ SUPPRIMÉ: Plus de sauvegarde cloud des progressions
  // pour éviter la pollution de la DB avec des audits incomplets
};

const { currentUser, isAuthenticated } = useAuth();
const { saveAudit, saveProgress: saveProgressCloud } = useAudits();
const router = useRouter(); // ✅ NOUVEAU: Pour navigation
const { isOnline, addToSyncQueue } = getGlobalSyncQueue(); // ✅ NOUVEAU: Pour statut connexion + queue

// ✅ NOUVEAU: Protection contre double soumission
const isSubmitting = ref(false);

const submitAudit = async () => {
  addUserAction('🚀 Tentative soumission audit');
  
  // ✅ NOUVEAU: Protection contre double clic
  if (isSubmitting.value) {
    addUserAction('⚠️ Double clic détecté - Ignoré');
    return;
  }
  
  if (!isFormValid.value) {
    addUserAction('⚠️ Échec: questions incomplètes');
    alert('⚠️ Veuillez répondre à toutes les questions obligatoires.');
    return;
  }

  isSubmitting.value = true; // Verrouiller la soumission
  
  try {
    // ✅ NOUVEAU: Enrichir les données avec infos GPS détaillées
    const enrichedFormData = {
      ...formData.value,
      locationAccuracy: locationAccuracy.value,
      accuracy: locationAccuracy.value, // Alias pour compatibilité
      gpsTimestamp: geoDetails.value.timestamp,
      nearbyInfo: geoDetails.value.nearbyInfo,
      timestamp: Date.now(),
      // Générer un ID unique pour éviter les doublons
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Sauvegarder localement d'abord
    const localResult = saveLocally(enrichedFormData); // ✅ NOUVEAU: Passer les données enrichies
    
    // Puis essayer de sauvegarder en cloud si connecté
    if (isAuthenticated.value && isOnline.value) { // ✅ NOUVEAU: Vérifier aussi isOnline
      addUserAction('☁️ Sauvegarde cloud en cours...');
      const result = await saveAudit(enrichedFormData);
      if (result.success) {
        addUserAction('✅ Audit sauvegardé en cloud');
      } else {
        addUserAction('⚠️ Échec sauvegarde cloud (restera local)');
      }
    } else if (!isOnline.value) {
      // ✅ NOUVEAU: Mode offline explicite - ajouter à la queue
      addUserAction('📴 Mode offline - Ajout à la queue de synchronisation');
      addToSyncQueue(enrichedFormData);
    }
    
    auditCompleted.value = true;
    showSuccessDialog.value = true;
  } catch (error) {
    addUserAction(`❌ Erreur: ${error.message}`);
    alert('❌ Erreur lors de la sauvegarde: ' + error.message);
  } finally {
    isSubmitting.value = false; // Déverrouiller
  }
};

// ✅ NOUVEAU: Fonctions de navigation améliorées - déplacées avant leur utilisation
const startNewAudit = () => {
  showSuccessDialog.value = false;
  // Réinitialiser le formulaire
  formData.value = {
    lighting: null,
    walkpath: null,
    openness: null,
    feeling: null,
    peoplePresence: null,
    cleanliness: null,
    naturalSurveillance: null,
    spaceDiversity: null,
    transportAccess: null,
    formalSecurity: null,
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
  addUserAction('🆕 Nouveau formulaire d\'audit initialisé');
  // Pas de refresh - reste sur la page
};

const goToHistory = () => {
  showSuccessDialog.value = false;
  router.push('/history');
};

const goToHome = () => {
  showSuccessDialog.value = false;
  router.push('/');
};

// Garder pour compatibilité
const goToIntro = startNewAudit;

// Auto-démarrage de la géolocalisation et sauvegarde auto
onMounted(() => {
  addDebugLog('🚀 Initialisation application AuditFormView', 'info');
  
  // Exposer les fonctions globalement pour les composants enfants
  window.addUserAction = addUserAction;
  window.saveProgress = saveProgress;
  
  addDebugLog('🌐 Exposition des fonctions globales pour les composants enfants', 'info');
  
  // Demander automatiquement la géolocalisation au chargement
  addDebugLog('📍 Démarrage automatique de la géolocalisation...', 'info');
  getCurrentLocation();
  
  // Vérifier les permissions
  addDebugLog('🔐 Vérification des permissions...', 'info');
  refreshGeoInfo();
});

// Plus de sauvegarde périodique - seulement à chaque action
</script>

<style scoped>
.audit-form-view {
  width: 100%; /* ✅ FIX: Largeur manquante */
  min-height: 100vh;
  background: var(--onuf-background);
  display: block;
  position: relative;
}

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

/* Styles pour la console debug */
.debug-info {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.debug-info div {
  margin-bottom: 4px;
  padding: 2px 0;
}

.log-entry {
  padding: 2px 4px;
  margin: 1px 0;
  border-radius: 3px;
}

.log-entry.info {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.log-entry.success {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.log-entry.warn {
  background: rgba(255, 152, 0, 0.1);
  color: #f57c00;
}

.log-entry.error {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.log-entry.action {
  background: rgba(156, 39, 176, 0.1);
  color: #7b1fa2;
}

.action-log {
  padding: 2px 0;
  border-left: 3px solid #9c27b0;
  padding-left: 8px;
  margin: 2px 0;
}

.geo-history {
  padding: 4px;
  margin: 2px 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
}

/* Styles pour dialog photo amélioré */
.photo-overlay-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.close-btn-overlay {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

/* Catégories de logs */
.log-category-debug {
  color: #1976d2 !important;
  font-weight: bold;
}

.log-category-user {
  color: #7b1fa2 !important;
  font-weight: bold;
}

.log-category-geo {
  color: #388e3c !important;
  font-weight: bold;
}

.log-category-info {
  color: #1976d2 !important;
}

.log-category-success {
  color: #388e3c !important;
}

.log-category-warn {
  color: #f57c00 !important;
}

.log-category-error {
  color: #d32f2f !important;
}

.log-category-action {
  color: #7b1fa2 !important;
}
</style>
