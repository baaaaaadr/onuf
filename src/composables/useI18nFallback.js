// src/composables/useI18nFallback.js
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

// Traductions de secours intégrées dans le code
const fallbackMessages = {
  fr: {
    app: {
      title: "MANARA",
      description: "Application d'audit de sécurité urbaine"
    },
    navigation: {
      audit: "Audit",
      history: "Historique"
    },
    audit: {
      title: "Audit de Sécurité",
      subtitle: "Si vous n'êtes pas localisés automatiquement, alors choisissez votre quartier",
      location: {
        title: "Localisation GPS",
        description: "Votre position actuelle"
      },
      neighborhood: {
        title: "Quartier",
        description: "Alternative si le GPS ne fonctionne pas",
        select: "Sélectionner un quartier"
      }
    },
    status: {
      online: "En ligne",
      offline: "Hors ligne",
      syncing: "Synchronisation...",
      location: "Localisation",
      accuracy: "Précision"
    },
    common: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      confirm: "Confirmer",
      close: "Fermer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès"
    }
  },
  en: {
    app: {
      title: "MANARA",
      description: "Urban security audit application"
    },
    navigation: {
      audit: "Audit",
      history: "History"
    },
    audit: {
      title: "Security Audit",
      subtitle: "If you are not automatically located, then choose your neighborhood",
      location: {
        title: "GPS Location",
        description: "Your current position"
      },
      neighborhood: {
        title: "Neighborhood",
        description: "Alternative if GPS doesn't work",
        select: "Select a neighborhood"
      }
    },
    status: {
      online: "Online",
      offline: "Offline",
      syncing: "Syncing...",
      location: "Location",
      accuracy: "Accuracy"
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      confirm: "Confirm",
      close: "Close",
      loading: "Loading...",
      error: "Error",
      success: "Success"
    }
  },
  ar: {
    app: {
      title: "منارة",
      description: "تطبيق تدقيق الأمن الحضري"
    },
    navigation: {
      audit: "تدقيق",
      history: "السجل"
    },
    audit: {
      title: "تدقيق أمني",
      subtitle: "إذا لم يتم تحديد موقعك تلقائيًا، فاختر حيك",
      location: {
        title: "تحديد الموقع",
        description: "موقعك الحالي"
      },
      neighborhood: {
        title: "الحي",
        description: "بديل إذا لم يعمل نظام تحديد المواقع",
        select: "اختر حيًا"
      }
    },
    status: {
      online: "متصل",
      offline: "غير متصل",
      syncing: "جاري المزامنة...",
      location: "الموقع",
      accuracy: "الدقة"
    },
    common: {
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      confirm: "تأكيد",
      close: "إغلاق",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجاح"
    }
  }
}

export function useI18nFallback() {
  const { t: originalT, locale } = useI18n()
  
  // Fonction de traduction avec fallback
  const t = (key) => {
    try {
      const result = originalT(key)
      
      // Si la traduction retourne la clé, utiliser le fallback
      if (result === key || !result) {
        const keys = key.split('.')
        let value = fallbackMessages[locale.value] || fallbackMessages.fr
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        return value || key
      }
      
      return result
    } catch (error) {
      console.error('Erreur traduction:', key, error)
      
      // Essayer le fallback
      try {
        const keys = key.split('.')
        let value = fallbackMessages[locale.value] || fallbackMessages.fr
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        return value || key
      } catch (fallbackError) {
        return key
      }
    }
  }
  
  return { t, fallbackMessages }
}
