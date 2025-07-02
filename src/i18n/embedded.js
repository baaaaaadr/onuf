// src/i18n/embedded.js
// Traductions intégrées directement dans le code pour éviter les problèmes d'import JSON en production

export const fr = {
  "app": {
    "title": "MANARA",
    "description": "Application d'audit de sécurité urbaine"
  },
  "navigation": {
    "audit": "Audit",
    "history": "Historique",
    "myAudits": "Mes Audits"
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
        "description": "Disponibilité de suffisamment de lumière pour voir tout autour de vous.",
        "options": {
          "none": "Aucun",
          "weak": "Faible",
          "sufficient": "Suffisant",
          "excellent": "Excellent"
        }
      },
      "walkways": {
        "title": "Cheminement",
        "description": "Soit un trottoir, soit une route avec de l'espace pour marcher.",
        "options": {
          "none": "Aucun",
          "bad": "Mauvais",
          "correct": "Correct",
          "excellent": "Excellent"
        }
      },
      "openness": {
        "title": "Ouverture",
        "description": "Capacité de voir et de se déplacer dans toutes les directions.",
        "options": {
          "blocked": "Bloqué",
          "limited": "Limité",
          "open": "Ouvert",
          "veryOpen": "Très ouvert"
        }
      },
      "feeling": {
        "title": "Ressenti",
        "description": "Comment vous sentez-vous dans cet endroit en ce moment ?",
        "options": {
          "scary": "Effrayant",
          "uncomfortable": "Inconfortable",
          "acceptable": "Acceptable",
          "comfortable": "Confortable"
        }
      },
      "humanPresence": {
        "title": "Présence humaine",
        "description": "Y a-t-il d'autres personnes autour de vous ?",
        "options": {
          "nobody": "Personne",
          "few": "Peu",
          "some": "Quelques-uns",
          "many": "Beaucoup"
        }
      },
      "cleanliness": {
        "title": "Propreté",
        "description": "État général de propreté et d'entretien du lieu.",
        "options": {
          "veryDirty": "Très sale",
          "dirty": "Sale",
          "clean": "Propre",
          "veryClean": "Très propre"
        }
      },
      "naturalSurveillance": {
        "title": "Surveillance Naturelle",
        "description": "Le sentiment d'être visible depuis les bâtiments (Yeux sur la rue).",
        "options": {
          "none": "Aucune",
          "weak": "Faible",
          "medium": "Moyenne",
          "high": "Élevée"
        }
      },
      "spaceDiversity": {
        "title": "Mixité de l'Espace",
        "description": "La présence et la diversité des genres et des âges (femmes, enfants).",
        "options": {
          "notMixed": "Non mixte",
          "littleMixed": "Peu mixte",
          "fairlyMixed": "Assez mixte",
          "veryMixed": "Très mixte"
        }
      },
      "spaceQuality": {
        "title": "Qualité de l'espace",
        "description": "Aménagement et confort"
      },
      "transportAccess": {
        "title": "Accès aux Transports",
        "description": "La proximité et la facilité d'accès aux transports en commun.",
        "options": {
          "inaccessible": "Inaccessible",
          "far": "Éloigné",
          "close": "Proche",
          "veryClose": "Très proche"
        }
      },
      "formalSecurity": {
        "title": "Sécurité Formelle",
        "description": "La présence visible de la police ou de gardiens de sécurité.",
        "options": {
          "none": "Aucune",
          "weak": "Faible",
          "medium": "Moyenne",
          "high": "Élevée"
        }
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
      "title": "Photos (optionnel)",
      "description": "Ajoutez des photos pour documenter vos observations",
      "action": "Prendre des photos",
      "add": "Ajouter une photo",
      "capture": "Prendre une photo",
      "delete": "Supprimer",
      "confirm_delete": "Êtes-vous sûr de vouloir supprimer cette photo ?",
      "widget": {
        "empty": {
          "title": "Prendre des photos",
          "description": "Documentez votre audit avec des photos",
          "takePhoto": "Prendre une photo",
          "chooseFromGallery": "Choisir depuis la galerie"
        }
      }
    },
    "comments": {
      "title": "Commentaires (optionnel)",
      "description": "Partagez vos observations additionnelles",
      "placeholder": "Commentaires additionnels (optionnel)"
    },
    "submit": {
      "button": "Soumettre l'audit",
      "sending": "Envoi en cours...",
      "success": "Audit envoyé avec succès !",
      "error": "Erreur lors de l'envoi"
    },
    "success": {
      "title": "Audit Terminé !",
      "message": "Merci pour votre contribution à la sécurité urbaine.",
      "statusOnline": "Données synchronisées",
      "statusOffline": "Sauvegardé localement",
      "auditId": "ID d'audit :",
      "actions": {
        "newAudit": "Nouvel audit",
        "myAudits": "Mes audits",
        "home": "Accueil"
      }
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
    "title": "Mes Audits",
    "loading": "Chargement des audits...",
    "empty": {
      "title": "Aucun audit enregistré",
      "description": "Vos audits de sécurité apparaîtront ici une fois terminés.",
      "action": "Commencer un audit"
    },
    "stats": {
      "total": "Audits",
      "synced": "Synchronisés"
    },
    "filters": {
      "all": "Tous",
      "synced": "Cloud",
      "local": "Local",
      "failed": "Échecs"
    },
    "filter": {
      "all": "Tous",
      "synced": "Synchronisés",
      "pending": "En attente"
    },
    "sync": {
      "offline": "seront synchronisés à la reconnexion",
      "status": "État de synchronisation",
      "synced": "Synchronisé",
      "pending": "En attente",
      "failed": "Échec",
      "syncing": "En cours...",
      "retry": "Réessayer sync"
    },
    "detail": {
      "title": "Détail de l'audit",
      "location": "Localisation",
      "date": "Date",
      "coordinates": "Coordonnées",
      "precision": "Précision",
      "evaluations": "Évaluations",
      "globalScore": "Score global",
      "photos": "Photos",
      "unavailable": "Photo indisponible",
      "technicalInfo": "Informations techniques",
      "source": "Source",
      "attempts": "Tentatives",
      "export": "Exporter",
      "close": "Fermer",
      "retrySync": "Réessayer sync",
      "delete": "Supprimer"
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
    "optional": "Optionnel",
    "share": "Partager",
    "openInMaps": "Ouvrir dans Maps",
    "shareButton": "PARTAGER",
    "openInMapsButton": "OUVRIR DANS MAPS",
    "unknownPosition": "Position inconnue",
    "yes": "Oui",
    "no": "Non",
    "unknown": "Inconnu",
    "unavailable": "Non disponible"
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
    "history": "History",
    "myAudits": "My Audits"
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
        "description": "Availability of enough light to see all around you.",
        "options": {
          "none": "None",
          "weak": "Weak",
          "sufficient": "Sufficient",
          "excellent": "Excellent"
        }
      },
      "walkways": {
        "title": "Walkways",
        "description": "Either a sidewalk or a road with space to walk.",
        "options": {
          "none": "None",
          "bad": "Bad",
          "correct": "Correct",
          "excellent": "Excellent"
        }
      },
      "openness": {
        "title": "Openness",
        "description": "Ability to see and move in all directions.",
        "options": {
          "blocked": "Blocked",
          "limited": "Limited",
          "open": "Open",
          "veryOpen": "Very open"
        }
      },
      "feeling": {
        "title": "Feeling",
        "description": "How do you feel in this place right now?",
        "options": {
          "scary": "Scary",
          "uncomfortable": "Uncomfortable",
          "acceptable": "Acceptable",
          "comfortable": "Comfortable"
        }
      },
      "humanPresence": {
        "title": "Human Presence",
        "description": "Are there other people around you?",
        "options": {
          "nobody": "Nobody",
          "few": "Few",
          "some": "Some",
          "many": "Many"
        }
      },
      "cleanliness": {
        "title": "Cleanliness",
        "description": "General state of cleanliness and maintenance of the place.",
        "options": {
          "veryDirty": "Very dirty",
          "dirty": "Dirty",
          "clean": "Clean",
          "veryClean": "Very clean"
        }
      },
      "naturalSurveillance": {
        "title": "Natural Surveillance",
        "description": "The feeling of being visible from buildings (Eyes on the street).",
        "options": {
          "none": "None",
          "weak": "Weak",
          "medium": "Medium",
          "high": "High"
        }
      },
      "spaceDiversity": {
        "title": "Space Diversity",
        "description": "The presence and diversity of genders and ages (women, children).",
        "options": {
          "notMixed": "Not mixed",
          "littleMixed": "Little mixed",
          "fairlyMixed": "Fairly mixed",
          "veryMixed": "Very mixed"
        }
      },
      "spaceQuality": {
        "title": "Space Quality",
        "description": "Layout and comfort"
      },
      "transportAccess": {
        "title": "Transport Access",
        "description": "Proximity and ease of access to public transport.",
        "options": {
          "inaccessible": "Inaccessible",
          "far": "Far",
          "close": "Close",
          "veryClose": "Very close"
        }
      },
      "formalSecurity": {
        "title": "Formal Security",
        "description": "Visible presence of police or security guards.",
        "options": {
          "none": "None",
          "weak": "Weak",
          "medium": "Medium",
          "high": "High"
        }
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
      "title": "Photos (optional)",
      "description": "Add photos to document your observations",
      "action": "Take photos",
      "add": "Add photo",
      "capture": "Take photo",
      "delete": "Delete",
      "confirm_delete": "Are you sure you want to delete this photo?",
      "widget": {
        "empty": {
          "title": "Take photos",
          "description": "Document your audit with photos",
          "takePhoto": "Take a photo",
          "chooseFromGallery": "Choose from gallery"
        }
      }
    },
    "comments": {
      "title": "Comments (optional)",
      "description": "Share your additional observations",
      "placeholder": "Additional comments (optional)"
    },
    "submit": {
      "button": "Submit audit",
      "sending": "Sending...",
      "success": "Audit sent successfully!",
      "error": "Error sending"
    },
    "success": {
      "title": "Audit Complete!",
      "message": "Thank you for your contribution to urban safety.",
      "statusOnline": "Data synchronized",
      "statusOffline": "Saved locally",
      "auditId": "Audit ID:",
      "actions": {
        "newAudit": "New audit",
        "myAudits": "My audits",
        "home": "Home"
      }
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
    "title": "My Audits",
    "loading": "Loading audits...",
    "empty": {
      "title": "No audits recorded",
      "description": "Your security audits will appear here once completed.",
      "action": "Start an audit"
    },
    "stats": {
      "total": "Audits",
      "synced": "Synced"
    },
    "filters": {
      "all": "All",
      "synced": "Cloud",
      "local": "Local",
      "failed": "Failed"
    },
    "filter": {
      "all": "All",
      "synced": "Synced",
      "pending": "Pending"
    },
    "sync": {
      "offline": "will be synchronized when reconnected",
      "status": "Sync status",
      "synced": "Synced",
      "pending": "Pending",
      "failed": "Failed",
      "syncing": "In progress...",
      "retry": "Retry sync"
    },
    "detail": {
      "title": "Audit details",
      "location": "Location",
      "date": "Date",
      "coordinates": "Coordinates",
      "precision": "Precision",
      "evaluations": "Evaluations",
      "globalScore": "Global score",
      "photos": "Photos",
      "unavailable": "Photo unavailable",
      "technicalInfo": "Technical information",
      "source": "Source",
      "attempts": "Attempts",
      "export": "Export",
      "close": "Close",
      "retrySync": "Retry sync",
      "delete": "Delete"
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
    "optional": "Optional",
    "share": "Share",
    "openInMaps": "Open in Maps",
    "shareButton": "SHARE",
    "openInMapsButton": "OPEN IN MAPS",
    "unknownPosition": "Unknown position",
    "yes": "Yes",
    "no": "No",
    "unknown": "Unknown",
    "unavailable": "Unavailable"
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
    "history": "السجل",
    "myAudits": "تدقيقاتي"
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
        "description": "توفر ضوء كافٍ للرؤية في جميع الاتجاهات.",
        "options": {
          "none": "معدوم",
          "weak": "ضعيف",
          "sufficient": "كافٍ",
          "excellent": "ممتاز"
        }
      },
      "walkways": {
        "title": "الممرات",
        "description": "إما رصيف أو طريق مع مساحة للمشي.",
        "options": {
          "none": "معدوم",
          "bad": "سيء",
          "correct": "مقبول",
          "excellent": "ممتاز"
        }
      },
      "openness": {
        "title": "الانفتاح",
        "description": "القدرة على الرؤية والحركة في جميع الاتجاهات.",
        "options": {
          "blocked": "مسدود",
          "limited": "محدود",
          "open": "مفتوح",
          "veryOpen": "مفتوح جداً"
        }
      },
      "feeling": {
        "title": "الشعور",
        "description": "كيف تشعر في هذا المكان الآن؟",
        "options": {
          "scary": "مخيف",
          "uncomfortable": "غير مريح",
          "acceptable": "مقبول",
          "comfortable": "مريح"
        }
      },
      "humanPresence": {
        "title": "الوجود البشري",
        "description": "هل هناك أشخاص آخرون حولك؟",
        "options": {
          "nobody": "لا أحد",
          "few": "قليل",
          "some": "بعض",
          "many": "كثير"
        }
      },
      "cleanliness": {
        "title": "النظافة",
        "description": "الحالة العامة لنظافة وصيانة المكان.",
        "options": {
          "veryDirty": "قذر جداً",
          "dirty": "قذر",
          "clean": "نظيف",
          "veryClean": "نظيف جداً"
        }
      },
      "naturalSurveillance": {
        "title": "المراقبة الطبيعية",
        "description": "الشعور بالرؤية من المباني (عيون على الشارع).",
        "options": {
          "none": "معدومة",
          "weak": "ضعيفة",
          "medium": "متوسطة",
          "high": "عالية"
        }
      },
      "spaceDiversity": {
        "title": "تنوع المكان",
        "description": "وجود وتنوع الأجناس والأعمار (نساء، أطفال).",
        "options": {
          "notMixed": "غير مختلط",
          "littleMixed": "قليل الاختلاط",
          "fairlyMixed": "مختلط نسبياً",
          "veryMixed": "مختلط جداً"
        }
      },
      "spaceQuality": {
        "title": "جودة المكان",
        "description": "التصميم والراحة"
      },
      "transportAccess": {
        "title": "الوصول للنقل",
        "description": "القرب وسهولة الوصول إلى وسائل النقل العام.",
        "options": {
          "inaccessible": "غير متاح",
          "far": "بعيد",
          "close": "قريب",
          "veryClose": "قريب جداً"
        }
      },
      "formalSecurity": {
        "title": "الأمن الرسمي",
        "description": "الوجود المرئي للشرطة أو حراس الأمن.",
        "options": {
          "none": "معدوم",
          "weak": "ضعيف",
          "medium": "متوسط",
          "high": "عالي"
        }
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
      "title": "الصور (اختياري)",
      "description": "أضف صورًا لتوثيق ملاحظاتك",
      "action": "التقاط صور",
      "add": "إضافة صورة",
      "capture": "التقاط صورة",
      "delete": "حذف",
      "confirm_delete": "هل أنت متأكد من حذف هذه الصورة؟",
      "widget": {
        "empty": {
          "title": "التقاط صور",
          "description": "وثق تدقيقك بالصور",
          "takePhoto": "التقاط صورة",
          "chooseFromGallery": "اختر من المعرض"
        }
      }
    },
    "comments": {
      "title": "التعليقات (اختياري)",
      "description": "شارك ملاحظاتك الإضافية",
      "placeholder": "تعليقات إضافية (اختياري)"
    },
    "submit": {
      "button": "إرسال التدقيق",
      "sending": "جاري الإرسال...",
      "success": "تم إرسال التدقيق بنجاح!",
      "error": "خطأ في الإرسال"
    },
    "success": {
      "title": "اكتمل التدقيق!",
      "message": "شكراً لمساهمتك في السلامة الحضرية.",
      "statusOnline": "تمت مزامنة البيانات",
      "statusOffline": "محفوظ محلياً",
      "auditId": "معرف التدقيق:",
      "actions": {
        "newAudit": "تدقيق جديد",
        "myAudits": "تدقيقاتي",
        "home": "الرئيسية"
      }
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
    "title": "تدقيقاتي",
    "loading": "جاري تحميل التدقيقات...",
    "empty": {
      "title": "لا توجد تدقيقات مسجلة",
      "description": "ستظهر تدقيقات الأمان الخاصة بك هنا بمجرد اكتمالها.",
      "action": "ابدأ تدقيقاً"
    },
    "stats": {
      "total": "التدقيقات",
      "synced": "متزامن"
    },
    "filters": {
      "all": "الكل",
      "synced": "السحابة",
      "local": "محلي",
      "failed": "فشل"
    },
    "filter": {
      "all": "الكل",
      "synced": "متزامن",
      "pending": "قيد الانتظار"
    },
    "sync": {
      "offline": "سيتم المزامنة عند إعادة الاتصال",
      "status": "حالة المزامنة",
      "synced": "متزامن",
      "pending": "قيد الانتظار",
      "failed": "فشل",
      "syncing": "جاري...",
      "retry": "إعادة المزامنة"
    },
    "detail": {
      "title": "تفاصيل التدقيق",
      "location": "الموقع",
      "date": "التاريخ",
      "coordinates": "الإحداثيات",
      "precision": "الدقة",
      "evaluations": "التقييمات",
      "globalScore": "النتيجة الإجمالية",
      "photos": "الصور",
      "unavailable": "الصورة غير متاحة",
      "technicalInfo": "معلومات تقنية",
      "source": "المصدر",
      "attempts": "المحاولات",
      "export": "تصدير",
      "close": "إغلاق",
      "retrySync": "إعادة المزامنة",
      "delete": "حذف"
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
    "optional": "اختياري",
    "share": "مشاركة",
    "openInMaps": "فتح في الخرائط",
    "shareButton": "مشاركة",
    "openInMapsButton": "فتح في الخرائط",
    "unknownPosition": "موقع غير معروف",
    "yes": "نعم",
    "no": "لا",
    "unknown": "غير معروف",
    "unavailable": "غير متاح"
  },
  "errors": {
    "network": "خطأ في الشبكة",
    "unknown": "خطأ غير معروف",
    "load_failed": "فشل التحميل",
    "save_failed": "فشل الحفظ"
  }
}

export default { fr, en, ar }
