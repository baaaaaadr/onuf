// Debug RTL - Script de test rapide pour ONUF PWA
// À copier-coller dans la console F12 du navigateur

console.log('🧪 === ONUF RTL Debug Script ===')

// Fonction pour tester une langue
function testLanguage(lang) {
  console.log(`\n🌍 Test langue: ${lang}`)
  localStorage.setItem('user-lang', lang)
  
  // Informations actuelles
  console.log('📍 État avant refresh:')
  console.log('  - HTML dir:', document.documentElement.dir)
  console.log('  - Body dir:', document.body.dir)
  console.log('  - Langue stockée:', localStorage.getItem('user-lang'))
  
  console.log('🔄 Rechargement de la page...')
  setTimeout(() => window.location.reload(), 1000)
}

// Fonction pour diagnostiquer l'état RTL
function debugRTL() {
  console.log('\n🔍 === Diagnostic RTL ===')
  console.log('📍 État actuel:')
  console.log('  - HTML dir:', document.documentElement.dir)
  console.log('  - Body dir:', document.body.dir)
  console.log('  - Langue:', localStorage.getItem('user-lang'))
  
  // Vérifier les styles RTL
  const rtlElements = document.querySelectorAll('[dir="rtl"]')
  console.log('  - Éléments RTL trouvés:', rtlElements.length)
  
  // Vérifier Vuetify
  if (window.Vue && window.Vue.version) {
    console.log('  - Vue version:', window.Vue.version)
  }
  
  // Vérifier les classes CSS RTL
  const hasRTLStyles = [...document.styleSheets].some(sheet => {
    try {
      return [...sheet.cssRules].some(rule => 
        rule.selectorText && rule.selectorText.includes('[dir="rtl"]')
      )
    } catch (e) {
      return false
    }
  })
  console.log('  - Styles RTL chargés:', hasRTLStyles)
}

// Fonction pour forcer RTL
function forceRTL() {
  console.log('\n🔧 Force RTL activé')
  document.documentElement.dir = 'rtl'
  document.body.dir = 'rtl'
  
  // Ajouter styles debug
  const style = document.createElement('style')
  style.textContent = `
    [dir="rtl"] {
      background: rgba(255, 0, 0, 0.1) !important;
      border: 2px solid red !important;
    }
  `
  document.head.appendChild(style)
  
  console.log('✅ RTL forcé avec styles debug (rouge)')
}

// Fonction pour nettoyer
function cleanDebug() {
  console.log('\n🧹 Nettoyage debug')
  document.documentElement.dir = 'ltr'
  document.body.dir = 'ltr'
  
  // Supprimer styles debug
  const debugStyles = document.querySelectorAll('style')
  debugStyles.forEach(style => {
    if (style.textContent.includes('rgba(255, 0, 0, 0.1)')) {
      style.remove()
    }
  })
  
  console.log('✅ Debug nettoyé')
}

// Interface simple
console.log(`
🎯 === Commandes Disponibles ===

1. Tester les langues:
   testLanguage('fr')  // Français
   testLanguage('en')  // Anglais  
   testLanguage('ar')  // Arabe RTL

2. Diagnostiquer:
   debugRTL()         // État actuel
   
3. Forcer RTL:
   forceRTL()         // Forcer mode RTL
   cleanDebug()       // Nettoyer

4. Test complet:
   testLanguage('ar') // Puis attendre le reload
`)

// Auto-diagnostic au chargement
debugRTL()

// Export global pour utilisation
window.onufRTLDebug = {
  testLanguage,
  debugRTL,
  forceRTL,
  cleanDebug
}

console.log('🚀 Script prêt ! Utilisez les commandes ci-dessus.')
