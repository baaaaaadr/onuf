<template>
  <v-app-bar color="primary" density="compact" elevation="2">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="$router.push('/')"></v-btn>
    </template>
    <v-app-bar-title class="font-weight-bold">📊 Agadir - Mes Audits</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-delete-sweep" @click="clearAllAudits" color="red">
      </v-btn>
    </template>
  </v-app-bar>

  <v-container class="pa-4">
    <div v-if="audits.length === 0" class="text-center mt-8">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-clipboard-list-outline</v-icon>
      <h3 class="text-h5 mb-2">Aucun audit enregistré</h3>
      <p class="text-body-2 text-grey mb-4">
        Vos audits de sécurité apparaîtront ici une fois terminés.
      </p>
      <v-btn color="primary" to="/audit">
        Commencer un audit
      </v-btn>
    </div>

    <div v-else>
      <!-- Statistiques rapides -->
      <v-row class="mb-4">
        <v-col cols="4">
          <v-card class="text-center" color="blue-lighten-5">
            <v-card-text>
              <v-icon size="30" color="primary" class="mb-2">mdi-counter</v-icon>
              <div class="text-h6">{{ audits.length }}</div>
              <div class="text-caption">Audits</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="text-center" color="green-lighten-5">
            <v-card-text>
              <v-icon size="30" color="success" class="mb-2">mdi-chart-line</v-icon>
              <div class="text-h6">{{ averageScore.toFixed(1) }}</div>
              <div class="text-caption">Score moyen</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="text-center" color="orange-lighten-5">
            <v-card-text>
              <v-icon size="30" color="warning" class="mb-2">mdi-image</v-icon>
              <div class="text-h6">{{ totalPhotos }}</div>
              <div class="text-caption">Photos</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Liste des audits -->
      <div class="audit-list">
        <v-card
          v-for="(audit, index) in audits"
          :key="index"
          class="mb-3"
          elevation="2"
          @click="selectedAudit = audit; showAuditDialog = true"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div class="flex-grow-1">
                <div class="d-flex align-center mb-2">
                  <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                  <span class="text-body-2 font-weight-bold">
                    {{ audit.location || 'Position non disponible' }}
                  </span>
                </div>
                
                <div class="d-flex align-center mb-2">
                  <v-icon color="grey" class="mr-2" size="small">mdi-clock</v-icon>
                  <span class="text-caption text-grey">
                    {{ formatDate(audit.timestamp) }}
                  </span>
                </div>

                <!-- Score global -->
                <div class="d-flex align-center">
                  <span class="text-caption mr-2">Score:</span>
                  <v-rating
                    :model-value="calculateScore(audit)"
                    color="warning"
                    size="small"
                    density="compact"
                    readonly
                    :length="4"
                    half-increments
                  ></v-rating>
                  <span class="text-caption ml-2">({{ calculateScore(audit).toFixed(1) }}/4)</span>
                </div>
              </div>

              <!-- Indicateurs rapides -->
              <div class="d-flex flex-column align-center ml-4">
                <div class="d-flex gap-1 mb-1">
                  <v-chip size="x-small" :color="getScoreColor(audit.lighting)">💡</v-chip>
                  <v-chip size="x-small" :color="getScoreColor(audit.walkpath)">🚶</v-chip>
                  <v-chip size="x-small" :color="getScoreColor(audit.openness)">👁️</v-chip>
                </div>
                <div class="d-flex gap-1">
                  <v-chip size="x-small" :color="getScoreColor(audit.feeling)">😊</v-chip>
                  <v-chip size="x-small" :color="getScoreColor(audit.peoplePresence)">👥</v-chip>
                  <v-chip size="x-small" :color="getScoreColor(audit.cleanliness)">🧹</v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>

  <!-- Dialog détail d'audit -->
  <v-dialog v-model="showAuditDialog" max-width="500">
    <v-card v-if="selectedAudit">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-clipboard-text</v-icon>
        Détail de l'audit
      </v-card-title>
      
      <v-card-text>
        <!-- Localisation -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">📍 Localisation</h4>
          <p class="text-body-2">{{ selectedAudit.location || 'Non disponible' }}</p>
          <p v-if="selectedAudit.coordinates" class="text-caption text-grey">
            Coordonnées: {{ selectedAudit.coordinates.lat.toFixed(4) }}, {{ selectedAudit.coordinates.lng.toFixed(4) }}
          </p>
        </div>

        <!-- Scores détaillés -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">📊 Évaluations</h4>
          <div class="audit-scores">
            <div class="score-item">
              <span>💡 Éclairage:</span>
              <v-rating :model-value="selectedAudit.lighting" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
            <div class="score-item">
              <span>🚶 Cheminement:</span>
              <v-rating :model-value="selectedAudit.walkpath" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
            <div class="score-item">
              <span>👁️ Ouverture:</span>
              <v-rating :model-value="selectedAudit.openness" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
            <div class="score-item">
              <span>😊 Ressenti:</span>
              <v-rating :model-value="selectedAudit.feeling" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
            <div class="score-item">
              <span>👥 Présence:</span>
              <v-rating :model-value="selectedAudit.peoplePresence" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
            <div class="score-item">
              <span>🧹 Propreté:</span>
              <v-rating :model-value="selectedAudit.cleanliness" color="warning" size="small" readonly density="compact" :length="4"></v-rating>
            </div>
          </div>
        </div>

        <!-- Commentaire -->
        <div v-if="selectedAudit.comment" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">💬 Commentaire</h4>
          <p class="text-body-2">{{ selectedAudit.comment }}</p>
        </div>

        <!-- Photos -->
        <div v-if="selectedAudit.photos && selectedAudit.photos.length > 0" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">📸 Photos ({{ selectedAudit.photos.length }})</h4>
          
          <!-- Galerie de photos -->
          <div class="d-flex flex-wrap gap-2 mb-3">
            <v-card
              v-for="(photo, index) in selectedAudit.photos" 
              :key="photo.id || index"
              class="photo-preview-small"
              width="60"
              height="60"
              @click="openPhotoDialog(photo, index)"
            >
              <v-img
                v-if="photo.data"
                :src="photo.data"
                cover
                class="cursor-pointer"
              >
                <div class="photo-overlay">
                  <v-icon color="white" size="small">mdi-magnify</v-icon>
                </div>
              </v-img>
              <v-card-text v-else class="text-center pa-1">
                <v-icon size="small">mdi-image</v-icon>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- Timestamp -->
        <div class="text-caption text-grey">
          <v-icon size="small" class="mr-1">mdi-clock</v-icon>
          {{ formatDate(selectedAudit.timestamp) }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showAuditDialog = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog photo en plein écran -->
  <v-dialog v-model="showPhotoDialog" max-width="90vw">
    <v-card v-if="selectedPhoto">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>📸 {{ selectedPhoto.name || `Photo ${selectedPhotoIndex + 1}` }}</span>
        <v-btn icon="mdi-close" @click="showPhotoDialog = false" variant="text"></v-btn>
      </v-card-title>
      
      <v-card-text class="pa-0">
        <v-img
          :src="selectedPhoto.data"
          max-height="70vh"
          contain
        ></v-img>
      </v-card-text>
      
      <v-card-text v-if="selectedPhoto.size">
        <div class="d-flex justify-space-between text-caption text-grey">
          <span>Taille: {{ formatFileSize(selectedPhoto.size) }}</span>
          <span v-if="selectedPhoto.timestamp">{{ formatDate(selectedPhoto.timestamp) }}</span>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog de confirmation de suppression -->
  <v-dialog v-model="showDeleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        <v-icon class="mr-2" color="warning">mdi-alert</v-icon>
        Supprimer tous les audits ?
      </v-card-title>
      <v-card-text>
        Cette action supprimera définitivement tous vos audits sauvegardés. Cette action est irréversible.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showDeleteDialog = false">Annuler</v-btn>
        <v-btn color="red" @click="confirmClearAudits">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const audits = ref([]);
const selectedAudit = ref(null);
const showAuditDialog = ref(false);
const showDeleteDialog = ref(false);
const showPhotoDialog = ref(false);
const selectedPhoto = ref(null);
const selectedPhotoIndex = ref(0);

// Charger les audits depuis localStorage
const loadAudits = () => {
  try {
    const saved = localStorage.getItem('safety_audits');
    if (saved) {
      audits.value = JSON.parse(saved).sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    }
  } catch (error) {
    console.error('Erreur chargement audits:', error);
  }
};

// Statistiques calculées
const averageScore = computed(() => {
  if (audits.value.length === 0) return 0;
  
  const totalScore = audits.value.reduce((sum, audit) => {
    return sum + calculateScore(audit);
  }, 0);
  
  return totalScore / audits.value.length;
});

const totalPhotos = computed(() => {
  return audits.value.reduce((sum, audit) => {
    return sum + (audit.photos ? audit.photos.length : 0);
  }, 0);
});

// Fonctions utilitaires
const calculateScore = (audit) => {
  const scores = [
    audit.lighting,
    audit.walkpath,
    audit.openness,
    audit.feeling,
    audit.peoplePresence,
    audit.cleanliness
  ].filter(score => score !== null);
  
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const getScoreColor = (score) => {
  if (!score) return 'grey-lighten-1';
  if (score === 1) return 'grey-lighten-1';
  if (score === 2) return 'red-darken-1';
  if (score === 3) return 'orange-darken-1';
  if (score === 4) return 'green-darken-1';
  return 'grey';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const openPhotoDialog = (photo, index) => {
  if (photo.data) {
    selectedPhoto.value = photo;
    selectedPhotoIndex.value = index;
    showPhotoDialog.value = true;
  }
};

const clearAllAudits = () => {
  showDeleteDialog.value = true;
};

const confirmClearAudits = () => {
  localStorage.removeItem('safety_audits');
  audits.value = [];
  showDeleteDialog.value = false;
};

onMounted(() => {
  loadAudits();
});
</script>

<style scoped>
.v-container {
  max-width: 600px;
}

.audit-list .v-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.audit-list .v-card:hover {
  transform: translateY(-2px);
}

.audit-scores .score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.audit-scores .score-item span {
  min-width: 120px;
  font-size: 0.875rem;
}

.photo-preview-small {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.photo-preview-small:hover {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.photo-preview-small:hover .photo-overlay {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
