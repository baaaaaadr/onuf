# 🧪 Guide de Test - Corrections i18n ONUF

## ✅ **Tests à Effectuer** (Après corrections)

### 1. **Test Démarrage Application**
- [ ] ✅ Aucune erreur Vue.js dans la console
- [ ] ✅ Application démarre sans erreur de syntaxe
- [ ] ✅ Direction HTML correcte au chargement selon la langue

### 2. **Test Questions d'Audit Traduites**
- [ ] 🇫🇷 Français : "Éclairage", "Cheminement", "Ouverture", etc.
- [ ] 🇺🇸 Anglais : "Lighting", "Walkways", "Openness", etc.
- [ ] 🇲🇦 Arabe : "الإنارة", "الممرات", "الانفتاح", etc.

### 3. **Test Widget Photo Traduit**
- [ ] 🇫🇷 Français : "Prendre des photos", "Ajouter", "Compression..."
- [ ] 🇺🇸 Anglais : "Take photos", "Add", "Compressing..."
- [ ] 🇲🇦 Arabe : "التقط صوراً", "إضافة", "جاري الضغط..."

### 4. **Test Positionnement RTL**
- [ ] Mode arabe : Interface en RTL
- [ ] Éléments alignés à droite
- [ ] Menu hamburger positionné correctement
- [ ] Widget photo avec éléments inversés

### 5. **Test Changement de Langue**
- [ ] Menu hamburger → "Langue / Language / اللغة"
- [ ] Changement instantané interface
- [ ] Persistance après rafraîchissement
- [ ] Thème RTL/LTR appliqué automatiquement

## 🚀 **Test Rapide (Console Navigateur)**

```javascript
// Test 1: Vérifier la langue actuelle
console.log('Langue actuelle:', localStorage.getItem('user-lang'))

// Test 2: Changer vers l'arabe et recharger
localStorage.setItem('user-lang', 'ar')
window.location.reload()
// → Interface doit passer en RTL avec texte arabe

// Test 3: Changer vers l'anglais
localStorage.setItem('user-lang', 'en')  
window.location.reload()
// → Interface doit passer en LTR avec texte anglais

// Test 4: Retour au français
localStorage.setItem('user-lang', 'fr')
window.location.reload()
// → Interface en français (défaut)
```

## 🎯 **Résultats Attendus**

### ✅ **Succès Si :**
- Aucune erreur dans la console
- Questions d'audit traduites dans les 3 langues
- Widget photo entièrement traduit
- Mode RTL fonctionnel pour l'arabe
- Changement de langue instantané via menu
- Persistance des préférences utilisateur

### ❌ **Échec Si :**
- Erreurs Vue.js dans la console
- Texte en français dans d'autres langues
- Positionnement incorrect en mode RTL
- Crash lors du changement de langue

## 📱 **Test Mobile Réel**

### iPhone/Android
1. Ouvrir l'app ONUF
2. Tester le changement de langue via menu
3. Vérifier le mode RTL en arabe
4. Tester le widget photo en différentes langues
5. Vérifier la persistance après fermeture app

---

**Date :** 1er juillet 2025  
**Statut :** 🔄 Prêt pour tests  
**Corrections :** ✅ Appliquées
