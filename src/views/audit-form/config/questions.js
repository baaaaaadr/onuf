// Configuration des questions d'audit avec support i18n
// Import des icônes SVG
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
import dog1 from '@/assets/icons/dog1.svg'
import dog2 from '@/assets/icons/dog2.svg'
import dog3 from '@/assets/icons/dog3.svg'
import dog4 from '@/assets/icons/dog4.svg'
import shade1 from '@/assets/icons/shade1.svg'
import shade2 from '@/assets/icons/shade2.svg'
import shade3 from '@/assets/icons/shade3.svg'
import shade4 from '@/assets/icons/shade4.svg'

// ✅ NOUVEAU: Configuration basée sur des clés i18n
export const questionsConfig = [
  {
    id: 'lighting',
    titleKey: 'audit.sections.lighting.title',
    descriptionKey: 'audit.sections.lighting.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.lighting.options.none',
        svgPath: lumi1,
        emoji: '🌑', 
        icon: 'mdi-lightbulb-off-outline', 
        color: 'grey-lighten-1'
      },
      { 
        value: 2, 
        textKey: 'audit.sections.lighting.options.weak',
        svgPath: lumi2,
        emoji: '🌒', 
        icon: 'mdi-lightbulb-outline', 
        color: 'red-darken-1'
      },
      { 
        value: 3, 
        textKey: 'audit.sections.lighting.options.sufficient',
        svgPath: lumi3,
        emoji: '🌕', 
        icon: 'mdi-lightbulb-on-outline', 
        color: 'orange-darken-1'
      },
      { 
        value: 4, 
        textKey: 'audit.sections.lighting.options.excellent',
        svgPath: lumi4,
        emoji: '☀️', 
        icon: 'mdi-lightbulb-on', 
        color: 'green-darken-1'
      },
    ]
  },
  {
    id: 'walkpath',
    titleKey: 'audit.sections.walkways.title',
    descriptionKey: 'audit.sections.walkways.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.walkways.options.none',
        svgPath: walk1,
        emoji: '🚫', 
        icon: 'mdi-cancel', 
        color: 'grey-lighten-1'
      },
      { 
        value: 2, 
        textKey: 'audit.sections.walkways.options.bad',
        svgPath: walk2,
        emoji: '🕳️', 
        icon: 'mdi-alert-circle-outline', 
        color: 'red-darken-1'
      },
      { 
        value: 3, 
        textKey: 'audit.sections.walkways.options.correct',
        svgPath: walk3,
        emoji: '🛤️', 
        icon: 'mdi-check-circle-outline', 
        color: 'orange-darken-1'
      },
      { 
        value: 4, 
        textKey: 'audit.sections.walkways.options.excellent',
        svgPath: walk4,
        emoji: '🛣️', 
        icon: 'mdi-thumb-up-outline', 
        color: 'green-darken-1'
      },
    ]
  },
  {
    id: 'openness',
    titleKey: 'audit.sections.openness.title',
    descriptionKey: 'audit.sections.openness.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.openness.options.blocked',
        svgPath: visibility1,
        emoji: '🧱', 
        icon: 'mdi-arrow-collapse-all', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.openness.options.limited',
        svgPath: visibility2,
        emoji: '🚧', 
        icon: 'mdi-arrow-expand-horizontal', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.openness.options.open',
        svgPath: visibility3,
        emoji: '🌅', 
        icon: 'mdi-arrow-expand-all', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.openness.options.veryOpen',
        svgPath: visibility4,
        emoji: '🌄', 
        icon: 'mdi-arrow-top-left-bottom-right', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'feeling',
    titleKey: 'audit.sections.feeling.title',
    descriptionKey: 'audit.sections.feeling.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.feeling.options.scary',
        svgPath: feeling1,
        emoji: '😰', 
        icon: 'mdi-emoticon-dead-outline', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.feeling.options.uncomfortable',
        svgPath: feeling2,
        emoji: '😟', 
        icon: 'mdi-emoticon-sad-outline', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.feeling.options.acceptable',
        svgPath: feeling3,
        emoji: '😐', 
        icon: 'mdi-emoticon-neutral-outline', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.feeling.options.comfortable',
        svgPath: feeling4,
        emoji: '😊', 
        icon: 'mdi-emoticon-happy-outline', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'peoplePresence',
    titleKey: 'audit.sections.humanPresence.title',
    descriptionKey: 'audit.sections.humanPresence.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.humanPresence.options.nobody',
        svgPath: frequentation1,
        emoji: '👻', 
        icon: 'mdi-account-off', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.humanPresence.options.few',
        svgPath: frequentation2,
        emoji: '👤', 
        icon: 'mdi-account', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.humanPresence.options.some',
        svgPath: frequentation3,
        emoji: '👥', 
        icon: 'mdi-account-group-outline', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.humanPresence.options.many',
        svgPath: frequentation4,
        emoji: '👫', 
        icon: 'mdi-account-group', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'cleanliness',
    titleKey: 'audit.sections.cleanliness.title',
    descriptionKey: 'audit.sections.cleanliness.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.cleanliness.options.veryDirty',
        svgPath: clean1,
        emoji: '🗑️', 
        icon: 'mdi-delete-variant', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.cleanliness.options.dirty',
        svgPath: clean2,
        emoji: '🧽', 
        icon: 'mdi-broom', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.cleanliness.options.clean',
        svgPath: clean3,
        emoji: '🧼', 
        icon: 'mdi-spray', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.cleanliness.options.veryClean',
        svgPath: clean4,
        emoji: '✨', 
        icon: 'mdi-star-circle', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'naturalSurveillance',
    titleKey: 'audit.sections.naturalSurveillance.title',
    descriptionKey: 'audit.sections.naturalSurveillance.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.naturalSurveillance.options.none',
        svgPath: surveillance1,
        emoji: '🏚️', 
        icon: 'mdi-eye-off', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.naturalSurveillance.options.weak',
        svgPath: surveillance2,
        emoji: '🏢', 
        icon: 'mdi-eye-outline', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.naturalSurveillance.options.medium',
        svgPath: surveillance3,
        emoji: '🏘️', 
        icon: 'mdi-eye', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.naturalSurveillance.options.high',
        svgPath: surveillance4,
        emoji: '🏪', 
        icon: 'mdi-eye-circle', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'spaceDiversity',
    titleKey: 'audit.sections.spaceDiversity.title',
    descriptionKey: 'audit.sections.spaceDiversity.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.spaceDiversity.options.notMixed',
        svgPath: mix1,
        emoji: '👔', 
        icon: 'mdi-account-tie', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.spaceDiversity.options.littleMixed',
        svgPath: mix2,
        emoji: '👨‍👨', 
        icon: 'mdi-account-multiple', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.spaceDiversity.options.fairlyMixed',
        svgPath: mix3,
        emoji: '👨‍👩', 
        icon: 'mdi-account-group', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.spaceDiversity.options.veryMixed',
        svgPath: mix4,
        emoji: '👨‍👩‍👧‍👦', 
        icon: 'mdi-account-supervisor-circle', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'transportAccess',
    titleKey: 'audit.sections.transportAccess.title',
    descriptionKey: 'audit.sections.transportAccess.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.transportAccess.options.inaccessible',
        svgPath: bus1,
        emoji: '🚫', 
        icon: 'mdi-bus-alert', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.transportAccess.options.far',
        svgPath: bus2,
        emoji: '🚶‍♂️', 
        icon: 'mdi-bus-clock', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.transportAccess.options.close',
        svgPath: bus3,
        emoji: '🚏', 
        icon: 'mdi-bus-stop', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.transportAccess.options.veryClose',
        svgPath: bus4,
        emoji: '🚌', 
        icon: 'mdi-bus-multiple', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'strayDogs',
    titleKey: 'audit.sections.strayDogs.title',
    descriptionKey: 'audit.sections.strayDogs.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.strayDogs.options.many',
        svgPath: dog1,
        emoji: '🐕‍🦺', 
        icon: 'mdi-dog-side', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.strayDogs.options.some',
        svgPath: dog2,
        emoji: '🐕', 
        icon: 'mdi-dog', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.strayDogs.options.few',
        svgPath: dog3,
        emoji: '🐶', 
        icon: 'mdi-paw-outline', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.strayDogs.options.none',
        svgPath: dog4,
        emoji: '✅', 
        icon: 'mdi-check-circle', 
        color: 'green-darken-1' 
      },
    ]
  },
  {
    id: 'shade',
    titleKey: 'audit.sections.shade.title',
    descriptionKey: 'audit.sections.shade.description',
    options: [
      { 
        value: 1, 
        textKey: 'audit.sections.shade.options.none',
        svgPath: shade1,
        emoji: '☀️', 
        icon: 'mdi-weather-sunny', 
        color: 'grey-lighten-1' 
      },
      { 
        value: 2, 
        textKey: 'audit.sections.shade.options.little',
        svgPath: shade2,
        emoji: '🌤️', 
        icon: 'mdi-weather-partly-cloudy', 
        color: 'red-darken-1' 
      },
      { 
        value: 3, 
        textKey: 'audit.sections.shade.options.moderate',
        svgPath: shade3,
        emoji: '🌳', 
        icon: 'mdi-tree', 
        color: 'orange-darken-1' 
      },
      { 
        value: 4, 
        textKey: 'audit.sections.shade.options.abundant',
        svgPath: shade4,
        emoji: '🌲', 
        icon: 'mdi-pine-tree', 
        color: 'green-darken-1' 
      },
    ]
  }
]

// ✅ NOUVEAU: Fonction pour créer les questions avec traductions
export const createTranslatedQuestions = (t) => {
  return questionsConfig.map(config => ({
    id: config.id,
    title: t(config.titleKey),
    description: t(config.descriptionKey),
    options: config.options.map(option => ({
      ...option,
      text: t(option.textKey)
    }))
  }))
}

// ✅ GARDE: Export de compatibilité (pour éviter les erreurs)
export const questions = questionsConfig.map(config => ({
  id: config.id,
  title: config.titleKey, // Clé au lieu du texte
  description: config.descriptionKey,
  options: config.options
}))

// Fonction helper pour obtenir une question par son ID
export const getQuestionById = (id) => {
  return questionsConfig.find(q => q.id === id)
}

// Fonction helper pour obtenir toutes les options d'une question
export const getQuestionOptions = (questionId) => {
  const question = getQuestionById(questionId)
  return question ? question.options : []
}
