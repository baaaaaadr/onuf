// Configuration des questions d'audit avec leurs options
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

export const questions = [
  {
    id: 'lighting',
    title: 'Éclairage',
    description: 'Disponibilité de suffisamment de lumière pour voir tout autour de vous.',
    options: [
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
    ]
  },
  {
    id: 'walkpath',
    title: 'Cheminement',
    description: 'Soit un trottoir, soit une route avec de l\'espace pour marcher.',
    options: [
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
    ]
  },
  {
    id: 'openness',
    title: 'Ouverture',
    description: 'Capacité de voir et de se déplacer dans toutes les directions.',
    options: [
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
    ]
  },
  {
    id: 'feeling',
    title: 'Ressenti',
    description: 'Comment vous sentez-vous dans cet endroit en ce moment ?',
    options: [
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
    ]
  },
  {
    id: 'peoplePresence',
    title: 'Présence humaine',
    description: 'Y a-t-il d\'autres personnes autour de vous ?',
    options: [
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
    ]
  },
  {
    id: 'cleanliness',
    title: 'Propreté',
    description: 'État général de propreté et d\'entretien du lieu.',
    options: [
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
    ]
  },
  {
    id: 'naturalSurveillance',
    title: 'Surveillance Naturelle',
    description: 'Le sentiment d\'être visible depuis les bâtiments (Yeux sur la rue).',
    options: [
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
    ]
  },
  {
    id: 'spaceDiversity',
    title: 'Mixité de l\'Espace',
    description: 'La présence et la diversité des genres et des âges (femmes, enfants).',
    options: [
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
    ]
  },
  {
    id: 'transportAccess',
    title: 'Accès aux Transports',
    description: 'La proximité et la facilité d\'accès aux transports en commun.',
    options: [
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
    ]
  },
  {
    id: 'formalSecurity',
    title: 'Sécurité Formelle',
    description: 'La présence visible de la police ou de gardiens de sécurité.',
    options: [
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
    ]
  }
]

// Fonction helper pour obtenir une question par son ID
export const getQuestionById = (id) => {
  return questions.find(q => q.id === id)
}

// Fonction helper pour obtenir toutes les options d'une question
export const getQuestionOptions = (questionId) => {
  const question = getQuestionById(questionId)
  return question ? question.options : []
}

