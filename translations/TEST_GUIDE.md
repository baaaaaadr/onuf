# 🧪 Guide de Test - Internationalisation ONUF PWA

## 📋 **Tests à Effectuer**

### ✅ **Test 1: Changement de Langue**

1. **Ouvrir l'application**
   - L'app doit démarrer en français (langue par défaut)
   
2. **Accéder au sélecteur de langue**
   - Cliquer sur le menu hamburger (☰) en haut à droite
   - Faire défiler jusqu'à la section "Langue / Language / اللغة"
   
3. **Tester le français**
   - Cliquer sur "🇫🇷 Français"
   - Vérifier que tous les textes sont en français
   
4. **Tester l'anglais**
   - Cliquer sur "🇺🇸 English"
   - Vérifier que l'interface passe à l'anglais
   
5. **Tester l'arabe + RTL**
   - Cliquer sur "🇲🇦 العربية"
   - Vérifier que l'interface passe à l'arabe
   - **IMPORTANT**: Vérifier que la direction change (RTL)

### ✅ **Test 2: Persistance**

1. **Changer la langue vers l'anglais**
2. **Rafraîchir la page (F5)**
3. **Vérifier** que l'app reste en anglais

### ✅ **Test 3: Mode RTL (Arabe)**

1. **Passer en arabe**
2. **Vérifier les éléments RTL :**
   - Menu hamburger à gauche
   - Texte aligné à droite
   - Navigation et boutons inversés
   - Layout général en miroir

### ✅ **Test 4: Composants Traduits**

#### **Page Audit (AuditFormView)**
- Titre : "تدقيق أمني" (ar) / "Security Audit" (en) / "Audit de Sécurité" (fr)
- Sections : Localisation, Quartier, Photos, Commentaires
- Bouton : "إرسال التدقيق" (ar) / "Submit Audit" (en) / "Soumettre l'audit" (fr)

#### **Page Historique (AuditsHistoryView)**
- Titre : "تدقيقاتي" (ar) / "My Audits" (en) / "Mes Audits" (fr)
- Filtres : "الكل" (ar) / "All" (en) / "Tous" (fr)
- Bouton sync : "مزامنة" (ar) / "Sync" (en) / "Synchroniser" (fr)

#### **Navigation (BottomNav)**
- "تدقيق" (ar) / "Audit" (en) / "Audit" (fr)
- "السجل" (ar) / "History" (en) / "Historique" (fr)

#### **Menu (StatusBar)**
- "حالة النظام" (ar) / "System Status" (en) / "Statut Système" (fr)
- "المزامنة السحابية" (ar) / "Cloud Sync" (en) / "Synchronisation Cloud" (fr)

## 🐛 **Problèmes Possibles et Solutions**

### **Langue ne change pas**
```javascript
// Vérifier dans la console du navigateur
console.log(localStorage.getItem('user-lang'))
```

### **RTL ne fonctionne pas**
- Vérifier que le thème change vers `onufLightRTL`
- Rafraîchir la page si nécessaire

### **Textes non traduits**
- Vérifier que la clé existe dans les fichiers JSON
- Console pour voir les erreurs de traduction

## 🔧 **Commandes de Debug**

### **Forcer une langue**
```javascript
// Dans la console du navigateur
localStorage.setItem('user-lang', 'ar')
window.location.reload()
```

### **Vérifier l'état i18n**
```javascript
// Obtenir la langue actuelle
document.querySelector('html').getAttribute('lang')

// Vérifier le thème Vuetify
console.log(document.body.dir) // 'rtl' ou 'ltr'
```

## ✅ **Critères de Validation**

### **✅ Fonctionnel**
- [ ] Les 3 langues s'affichent correctement
- [ ] Le changement de langue est instantané
- [ ] La langue est persistée après rafraîchissement
- [ ] Le mode RTL fonctionne pour l'arabe

### **✅ Visuel**
- [ ] Tous les textes statiques sont traduits
- [ ] Aucun texte hardcodé visible
- [ ] Layout RTL correct (pas de superposition)
- [ ] Navigation cohérente dans toutes les langues

### **✅ UX**
- [ ] Sélecteur de langue facile à trouver
- [ ] Changement de langue fluide
- [ ] Aucune perte de données lors du changement
- [ ] Interface intuitive dans les 3 langues

---

## 🎯 **Résultat Attendu**

L'application ONUF doit être **entièrement fonctionnelle** dans les 3 langues avec :
- **Interface multilingue complète**
- **Support RTL automatique pour l'arabe**
- **Persistance des préférences utilisateur**
- **Expérience utilisateur cohérente**

🎉 **L'internationalisation est terminée et prête pour la production !**
