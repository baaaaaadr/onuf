# Modifications pour AuditFormView.vue

## 1. Ajouter ces imports après la ligne `import walk4 from '@/assets/icons/walk4.svg'`

```javascript
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
```

## 2. Remplacer la définition de formData

```javascript
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
```

## 3. Ajouter ces sections dans le template après la section Propreté

```vue
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
```

## 4. Mettre à jour les options existantes et ajouter les nouvelles

```javascript
// Remplacer opennessOptions
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

// Remplacer feelingOptions
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

// Remplacer peoplePresenceOptions
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

// Remplacer cleanlinessOptions
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

// Ajouter les nouvelles options
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
```

## 5. Remplacer la fonction getAnsweredQuestions

```javascript
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
```

## 6. Remplacer le calcul de progressPercentage

```javascript
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
```

## 7. Remplacer la validation isFormValid

```javascript
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
```

## 8. Remplacer la fonction startNewAudit

```javascript
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
```

## 9. Dans le template, chercher et remplacer

Chercher :
```vue
<div><strong>Questions répondues:</strong> {{ getAnsweredQuestions() }}/6</div>
```

Remplacer par :
```vue
<div><strong>Questions répondues:</strong> {{ getAnsweredQuestions() }}/10</div>
```
