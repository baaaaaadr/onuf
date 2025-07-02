// src/i18n/embedded.js
// Traductions intégrées directement dans le code pour éviter les problèmes d'import JSON en production

export const fr = {
  "app": {
    "title": "MANARA",
    "description": "Application d'audit de sécurité urbaine"
  },
  "navigation": {
    "audit": "Audit",
    "history": "Historique"
  },
  "audit": {
    "title": "Audit de Sécurité",
    "subtitle": "Si vous n'êtes pas localisés automatiquement, alors choisissez votre quartier",
    "location": {
      "title": "Localisation GPS",
      "description": "Votre position actuelle"
    },
    "neighborhood": {
      "title": "Quartier",
      "description": "Alternative si le GPS ne fonctionne pas",
      "select": "Sélectionner un quartier"
    },
    "sections": {
      "lighting": {
        "title": "Éclairage",
        "description": "Évaluation de l'éclairage public"
      },
      "walkways": {
        "title": "Cheminements",
        "description": "État des trottoirs et passages"
      },
      "signage": {
        "title": "Signalisation",
        "description": "Visibilité et clarté des panneaux"
      },
      "obstacles": {
        "title": "Obstacles",
        "description": "Identification des obstructions"
      },
      "visibility": {
        "title": "Visibilité",
        "description": "Champs de vision et angles morts"
      },
      "maintenance": {
        "title": "Maintenance",
        "description": "État général et entretien"
      }
    },
    "options": {
      "functional": "Fonctionnel",
      "damaged": "Endommagé", 
      "missing": "Manquant",
      "good": "Bon",
      "poor": "Mauvais",
      "none": "Aucun",
      "adequate": "Adéquat",
      "insufficient": "Insuffisant",
      "obstructed": "Obstrué",
      "clear": "Dégagé",
      "limited": "Limité",
      "maintained": "Entretenu",
      "degraded": "Dégradé",
      "abandoned": "Abandonné"
    },
    "photos": {
      "title": "Photos",
      "description": "Ajoutez des photos pour documenter l'audit",
      "add": "Ajouter une photo",
      "capture": "Prendre une photo",
      "delete": "Supprimer",
      "confirm_delete": "Êtes-vous sûr de vouloir supprimer cette photo ?"
    },
    "summary": {
      "title": "Résumé de l'audit",
      "location": "Localisation",
      "neighborhood": "Quartier", 
      "date": "Date",
      "photos": "Photos",
      "sections": "Sections évaluées"
    },
    "actions": {
      "save": "Enregistrer l'audit",
      "saving": "Enregistrement...",
      "saved": "Audit enregistré",
      "error": "Erreur lors de l'enregistrement",
      "cancel": "Annuler",
      "new": "Nouvel audit",
      "view_history": "Voir l'historique"
    }
  },
  "history": {
    "title": "Historique des Audits",
    "empty": "Aucun audit effectué",
    "search": "Rechercher...",
    "filter": {
      "all": "Tous",
      "synced": "Synchronisés",
      "pending": "En attente"
    },
    "status": {
      "synced": "Synchronisé",
      "pending": "En attente de synchronisation"
    },
    "delete": {
      "confirm": "Êtes-vous sûr de vouloir supprimer cet audit ?",
      "success": "Audit supprimé",
      "error": "Erreur lors de la suppression"
    }
  },
  "sync": {
    "status": {
      "online": "En ligne",
      "offline": "Hors ligne",
      "syncing": "Synchronisation...",
      "error": "Erreur de synchronisation"
    },
    "actions": {
      "sync": "Synchroniser",
      "retry": "Réessayer"
    },
    "messages": {
      "success": "Synchronisation réussie",
      "error": "Erreur de synchronisation",
      "no_connection": "Pas de connexion internet"
    }
  },
  "location": {
    "requesting": "Demande de localisation...",
    "error": "Erreur de localisation",
    "denied": "Accès à la localisation refusé",
    "unavailable": "Localisation non disponible",
    "timeout": "Délai de localisation dépassé",
    "accuracy": "Précision",
    "title": "Localisation GPS"
  },
  "common": {
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "Succès",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "save": "Enregistrer",
    "close": "Fermer",
    "back": "Retour",
    "next": "Suivant",
    "finish": "Terminer",
    "required": "Requis",
    "optional": "Optionnel"
  },
  "errors": {
    "network": "Erreur réseau",
    "unknown": "Erreur inconnue",
    "load_failed": "Échec du chargement",
    "save_failed": "Échec de l'enregistrement"
  }
}

export const en = {
  "app": {
    "title": "MANARA",
    "description": "Urban security audit application"
  },
  "navigation": {
    "audit": "Audit",
    "history": "History"
  },
  "audit": {
    "title": "Security Audit",
    "subtitle": "If you are not automatically located, then choose your neighborhood",
    "location": {
      "title": "GPS Location",
      "description": "Your current position"
    },
    "neighborhood": {
      "title": "Neighborhood",
      "description": "Alternative if GPS doesn't work",
      "select": "Select a neighborhood"
    },
    "sections": {
      "lighting": {
        "title": "Lighting",
        "description": "Public lighting assessment"
      },
      "walkways": {
        "title": "Walkways",
        "description": "Sidewalks and passages condition"
      },
      "signage": {
        "title": "Signage",
        "description": "Signs visibility and clarity"
      },
      "obstacles": {
        "title": "Obstacles",
        "description": "Obstructions identification"
      },
      "visibility": {
        "title": "Visibility",
        "description": "Sightlines and blind spots"
      },
      "maintenance": {
        "title": "Maintenance",
        "description": "General condition and upkeep"
      }
    },
    "options": {
      "functional": "Functional",
      "damaged": "Damaged",
      "missing": "Missing",
      "good": "Good",
      "poor": "Poor",
      "none": "None",
      "adequate": "Adequate",
      "insufficient": "Insufficient",
      "obstructed": "Obstructed",
      "clear": "Clear",
      "limited": "Limited",
      "maintained": "Maintained",
      "degraded": "Degraded",
      "abandoned": "Abandoned"
    },
    "photos": {
      "title": "Photos",
      "description": "Add photos to document the audit",
      "add": "Add photo",
      "capture": "Take photo",
      "delete": "Delete",
      "confirm_delete": "Are you sure you want to delete this photo?"
    },
    "summary": {
      "title": "Audit Summary",
      "location": "Location",
      "neighborhood": "Neighborhood",
      "date": "Date",
      "photos": "Photos",
      "sections": "Assessed sections"
    },
    "actions": {
      "save": "Save audit",
      "saving": "Saving...",
      "saved": "Audit saved",
      "error": "Error saving",
      "cancel": "Cancel",
      "new": "New audit",
      "view_history": "View history"
    }
  },
  "history": {
    "title": "Audit History",
    "empty": "No audits performed",
    "search": "Search...",
    "filter": {
      "all": "All",
      "synced": "Synced",
      "pending": "Pending"
    },
    "status": {
      "synced": "Synced",
      "pending": "Pending sync"
    },
    "delete": {
      "confirm": "Are you sure you want to delete this audit?",
      "success": "Audit deleted",
      "error": "Error deleting"
    }
  },
  "sync": {
    "status": {
      "online": "Online",
      "offline": "Offline",
      "syncing": "Syncing...",
      "error": "Sync error"
    },
    "actions": {
      "sync": "Sync",
      "retry": "Retry"
    },
    "messages": {
      "success": "Sync successful",
      "error": "Sync error",
      "no_connection": "No internet connection"
    }
  },
  "location": {
    "requesting": "Requesting location...",
    "error": "Location error",
    "denied": "Location access denied",
    "unavailable": "Location unavailable",
    "timeout": "Location timeout",
    "accuracy": "Accuracy",
    "title": "GPS Location"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete",
    "edit": "Edit",
    "save": "Save",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "finish": "Finish",
    "required": "Required",
    "optional": "Optional"
  },
  "errors": {
    "network": "Network error",
    "unknown": "Unknown error",
    "load_failed": "Load failed",
    "save_failed": "Save failed"
  }
}

export const ar = {
  "app": {
    "title": "منارة",
    "description": "تطبيق تدقيق الأمن الحضري"
  },
  "navigation": {
    "audit": "تدقيق",
    "history": "السجل"
  },
  "audit": {
    "title": "تدقيق أمني",
    "subtitle": "إذا لم يتم تحديد موقعك تلقائيًا، فاختر حيك",
    "location": {
      "title": "تحديد الموقع",
      "description": "موقعك الحالي"
    },
    "neighborhood": {
      "title": "الحي",
      "description": "بديل إذا لم يعمل نظام تحديد المواقع",
      "select": "اختر حيًا"
    },
    "sections": {
      "lighting": {
        "title": "الإنارة",
        "description": "تقييم الإنارة العامة"
      },
      "walkways": {
        "title": "الممرات",
        "description": "حالة الأرصفة والممرات"
      },
      "signage": {
        "title": "اللافتات",
        "description": "وضوح ورؤية اللافتات"
      },
      "obstacles": {
        "title": "العوائق",
        "description": "تحديد العوائق"
      },
      "visibility": {
        "title": "الرؤية",
        "description": "خطوط الرؤية والنقاط العمياء"
      },
      "maintenance": {
        "title": "الصيانة",
        "description": "الحالة العامة والصيانة"
      }
    },
    "options": {
      "functional": "وظيفي",
      "damaged": "متضرر",
      "missing": "مفقود",
      "good": "جيد",
      "poor": "سيء",
      "none": "لا يوجد",
      "adequate": "كافٍ",
      "insufficient": "غير كافٍ",
      "obstructed": "معاق",
      "clear": "واضح",
      "limited": "محدود",
      "maintained": "مُصان",
      "degraded": "متدهور",
      "abandoned": "مهجور"
    },
    "photos": {
      "title": "الصور",
      "description": "أضف صورًا لتوثيق التدقيق",
      "add": "إضافة صورة",
      "capture": "التقاط صورة",
      "delete": "حذف",
      "confirm_delete": "هل أنت متأكد من حذف هذه الصورة؟"
    },
    "summary": {
      "title": "ملخص التدقيق",
      "location": "الموقع",
      "neighborhood": "الحي",
      "date": "التاريخ",
      "photos": "الصور",
      "sections": "الأقسام المُقيَّمة"
    },
    "actions": {
      "save": "حفظ التدقيق",
      "saving": "جاري الحفظ...",
      "saved": "تم حفظ التدقيق",
      "error": "خطأ في الحفظ",
      "cancel": "إلغاء",
      "new": "تدقيق جديد",
      "view_history": "عرض السجل"
    }
  },
  "history": {
    "title": "سجل التدقيقات",
    "empty": "لا توجد تدقيقات",
    "search": "بحث...",
    "filter": {
      "all": "الكل",
      "synced": "متزامن",
      "pending": "قيد الانتظار"
    },
    "status": {
      "synced": "متزامن",
      "pending": "في انتظار المزامنة"
    },
    "delete": {
      "confirm": "هل أنت متأكد من حذف هذا التدقيق؟",
      "success": "تم حذف التدقيق",
      "error": "خطأ في الحذف"
    }
  },
  "sync": {
    "status": {
      "online": "متصل",
      "offline": "غير متصل",
      "syncing": "جاري المزامنة...",
      "error": "خطأ في المزامنة"
    },
    "actions": {
      "sync": "مزامنة",
      "retry": "إعادة المحاولة"
    },
    "messages": {
      "success": "تمت المزامنة بنجاح",
      "error": "خطأ في المزامنة",
      "no_connection": "لا يوجد اتصال بالإنترنت"
    }
  },
  "location": {
    "requesting": "طلب الموقع...",
    "error": "خطأ في الموقع",
    "denied": "تم رفض الوصول للموقع",
    "unavailable": "الموقع غير متاح",
    "timeout": "انتهت مهلة الموقع",
    "accuracy": "الدقة",
    "title": "تحديد الموقع"
  },
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجاح",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "delete": "حذف",
    "edit": "تعديل",
    "save": "حفظ",
    "close": "إغلاق",
    "back": "رجوع",
    "next": "التالي",
    "finish": "إنهاء",
    "required": "مطلوب",
    "optional": "اختياري"
  },
  "errors": {
    "network": "خطأ في الشبكة",
    "unknown": "خطأ غير معروف",
    "load_failed": "فشل التحميل",
    "save_failed": "فشل الحفظ"
  }
}

export default { fr, en, ar }
