<template>
  <div class="language-switcher">
    <!-- Version simple: liste d'items cliquables -->
    <template v-if="variant === 'list'">
      <v-list-item
        v-for="language in supportedLanguages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        :active="currentLanguage === language.code"
        prepend-icon="mdi-translate"
      >
        <v-list-item-title>
          <span class="language-flag">{{ language.flag }}</span>
          <span class="language-name">{{ language.name }}</span>
        </v-list-item-title>
        <template v-slot:append v-if="currentLanguage === language.code">
          <v-icon color="primary">mdi-check</v-icon>
        </template>
      </v-list-item>
    </template>

    <!-- Version boutons: pour l'intégration dans les menus -->
    <template v-else-if="variant === 'buttons'">
      <v-btn
        v-for="language in supportedLanguages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        :variant="currentLanguage === language.code ? 'elevated' : 'outlined'"
        :color="currentLanguage === language.code ? 'primary' : 'default'"
        size="small"
        class="ma-1 language-btn"
      >
        <span class="language-flag mr-2">{{ language.flag }}</span>
        <span class="language-name">{{ language.name }}</span>
      </v-btn>
    </template>

    <!-- Version compacte: menu déroulant -->
    <template v-else-if="variant === 'compact'">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            size="small"
            prepend-icon="mdi-translate"
            class="language-selector"
          >
            <span class="language-flag">{{ getCurrentLanguageInfo.flag }}</span>
            <span class="language-name ml-1">{{ getCurrentLanguageInfo.name }}</span>
          </v-btn>
        </template>
        
        <v-list density="compact">
          <v-list-item
            v-for="language in supportedLanguages"
            :key="language.code"
            @click="changeLanguage(language.code)"
            :active="currentLanguage === language.code"
          >
            <v-list-item-title>
              <span class="language-flag">{{ language.flag }}</span>
              <span class="language-name">{{ language.name }}</span>
            </v-list-item-title>
            <template v-slot:append v-if="currentLanguage === language.code">
              <v-icon color="primary" size="small">mdi-check</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <!-- Version cycle: bouton unique qui change de langue -->
    <template v-else-if="variant === 'cycle'">
      <v-btn
        @click="cycleToNextLanguage"
        variant="outlined"
        size="small"
        class="language-cycle-btn"
        :title="$t('common.changeLanguage')"
      >
        <span class="language-flag">{{ getCurrentLanguageInfo.flag }}</span>
        <span class="language-name ml-1">{{ getCurrentLanguageInfo.name }}</span>
        <v-icon size="small" class="ml-1">mdi-chevron-right</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLang } from '@/composables/useLang'

const props = defineProps({
  variant: {
    type: String,
    default: 'list',
    validator: (value) => ['list', 'buttons', 'compact', 'cycle'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  showFlag: {
    type: Boolean,
    default: true
  },
  showName: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['language-changed'])

// Utiliser le composable de langue
const {
  currentLanguage,
  supportedLanguages,
  getCurrentLanguageInfo,
  setLanguage,
  cycleLanguage
} = useLang()

// Méthodes
const changeLanguage = (langCode) => {
  setLanguage(langCode)
  emit('language-changed', langCode)
  
  // Afficher une notification de confirmation
  showLanguageChangeNotification(langCode)
}

const cycleToNextLanguage = () => {
  cycleLanguage()
  emit('language-changed', currentLanguage.value)
  
  // Afficher une notification de confirmation
  showLanguageChangeNotification(currentLanguage.value)
}

const showLanguageChangeNotification = (langCode) => {
  const language = supportedLanguages.find(lang => lang.code === langCode)
  if (language) {
    // Simple notification console pour l'instant
    console.log(`🌍 Langue changée vers: ${language.flag} ${language.name}`)
    
    // TODO: Ajouter une notification visuelle avec snackbar
    // Peut être ajouté plus tard si nécessaire
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.language-flag {
  font-size: 1.2em;
  margin-right: 8px;
}

.language-name {
  font-weight: 500;
}

.language-btn {
  text-transform: none;
  justify-content: flex-start;
  min-width: 120px;
}

.language-selector {
  text-transform: none;
  min-width: 100px;
}

.language-cycle-btn {
  text-transform: none;
  min-width: 80px;
}

/* Styles pour la version liste */
.language-switcher .v-list-item {
  border-radius: 8px;
  margin: 2px 0;
}

.language-switcher .v-list-item--active {
  background-color: rgba(25, 118, 210, 0.12) !important;
  color: #1976d2 !important;
}

.language-switcher .v-list-item--active .v-list-item-title {
  color: #1976d2 !important;
  font-weight: 600 !important;
}

.language-switcher .v-list-item--active .language-name {
  color: #1976d2 !important;
  font-weight: 600 !important;
}

/* Animation de changement */
.language-switcher {
  transition: all 0.2s ease;
}

.language-btn {
  transition: all 0.2s ease;
}

.language-btn:hover {
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 600px) {
  .language-name {
    font-size: 0.875rem;
  }
  
  .language-btn {
    min-width: 100px;
  }
  
  .language-selector {
    min-width: 80px;
  }
}

/* Support RTL */
[dir="rtl"] .language-flag {
  margin-right: 0;
  margin-left: 8px;
}

[dir="rtl"] .language-cycle-btn .v-icon {
  transform: scaleX(-1);
}
</style>
