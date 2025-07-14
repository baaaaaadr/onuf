<template>
  <div class="neighborhood-selector">
    <h3>{{ t('audit.neighborhood.title') }}</h3>
    <p>{{ t('audit.neighborhood.description') }}</p>
    
    <!-- Utilisation des nouvelles traductions -->
    <v-select
      v-model="selectedNeighborhood"
      :items="translatedLocations"
      item-title="label"
      item-value="key"
      :label="t('audit.neighborhood.select')"
      variant="outlined"
    />

    <!-- Affichage du quartier sélectionné dans toutes les langues -->
    <div v-if="selectedNeighborhood" class="selected-info">
      <h4>Quartier sélectionné :</h4>
      <ul>
        <li><strong>Français :</strong> {{ getNeighborhoodName('fr') }}</li>
        <li><strong>English :</strong> {{ getNeighborhoodName('en') }}</li>
        <li><strong>العربية :</strong> {{ getNeighborhoodName('ar') }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getTranslatedLocations } from '@/views/audit-form/config/locations'

const { t, locale } = useI18n()
const selectedNeighborhood = ref(null)

// Obtenir les quartiers traduits dans la langue actuelle
const translatedLocations = computed(() => {
  return getTranslatedLocations(t)
})

// Fonction pour obtenir le nom du quartier dans une langue spécifique
const getNeighborhoodName = (lang) => {
  if (!selectedNeighborhood.value) return ''
  
  // Mappings des traductions par langue
  const translations = {
    'fr': {
      'ahlaka': 'Ahlaka',
      'aitElMouden': 'Aït El Mouden',
      'aitTaoukt': 'Aït Taoukt',
      'ighilOuderdour': 'Ighil Ouderdour',
      'imounsiss': 'Imounsiss'
    },
    'en': {
      'ahlaka': 'Ahlaka',
      'aitElMouden': 'Aït El Mouden',
      'aitTaoukt': 'Aït Taoukt',
      'ighilOuderdour': 'Ighil Ouderdour',
      'imounsiss': 'Imounsiss'
    },
    'ar': {
      'ahlaka': 'أحلاكا',
      'aitElMouden': 'آيت الموذن',
      'aitTaoukt': 'آيت تاوكت',
      'ighilOuderdour': 'إغيل أودردور',
      'imounsiss': 'إموانسيس'
    }
  }
  
  return translations[lang]?.[selectedNeighborhood.value] || selectedNeighborhood.value
}
</script>

<style scoped>
.neighborhood-selector {
  padding: 16px;
  max-width: 400px;
}

.selected-info {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.selected-info ul {
  margin: 8px 0 0 16px;
}

.selected-info li {
  margin: 4px 0;
}
</style>
