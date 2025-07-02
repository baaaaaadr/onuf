// C:\Users\Monster\Documents\My Apps\ONUF\onuf\src\plugins\i18n.js
// VERSION FINALE - INJECTION MANUELLE POUR CONTOURNER LE BUG DE VITE

import { createI18n } from 'vue-i18n'
import { fr, en, ar } from '../i18n/embedded.js'

// INDICE FINAL
console.log('☢️ NUCLEAR-OPTION-V5 APPLIED: Manual Injection ☢️');

// 1. On prépare nos traductions comme d'habitude
const messages = { fr, en, ar };

// 2. On crée l'instance i18n SANS lui donner les messages.
// C'est l'étape cruciale pour éviter le bug.
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  // La propriété "messages" est volontairement absente ici !
});

// 3. On injecte manuellement chaque langue dans l'instance DÉJÀ CRÉÉE.
// Cette méthode utilise une autre partie de l'API de vue-i18n que le minificateur ne devrait pas casser.
for (const lang in messages) {
  i18n.global.setLocaleMessage(lang, messages[lang]);
}

console.log('✅ Injected locales manually:', Object.keys(i18n.global.messages));

export default i18n;