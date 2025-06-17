# Modifications pour useAudits.js

## Dans la fonction saveAuditToCloud

Chercher la section où `dbAudit` est créé et remplacer :

```javascript
// Préparer données pour la base
const dbAudit = {
  user_id: currentUser.value.user_id,
  latitude: latitude,
  longitude: longitude,
  location_text: auditData.location || 'Position non disponible',
  location_accuracy: auditData.locationAccuracy || auditData.accuracy || 999999,
  nearby_info: geocodeResult?.displayName || auditData.address || auditData.location || null,
  lighting: auditData.lighting,
  walkpath: auditData.walkpath,
  openness: auditData.openness,
  feeling: auditData.feeling,
  people_presence: auditData.peoplePresence,
  cleanliness: auditData.cleanliness,
  natural_surveillance: auditData.naturalSurveillance,
  space_diversity: auditData.spaceDiversity,
  transport_access: auditData.transportAccess,
  formal_security: auditData.formalSecurity,
  comment: auditData.comment,
  total_photos: auditData.photos?.length || 0,
  ui_language: 'fr',
  device_info: {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    timestamp: new Date().toISOString(),
    gps_accuracy: auditData.locationAccuracy || auditData.accuracy || 999999,
    gps_timestamp: auditData.gpsTimestamp || new Date().toISOString()
  },
  is_completed: true
}
```

## Dans la fonction getAuditsStats

Chercher la section où les scores sont calculés et remplacer :

```javascript
userAudits.forEach(audit => {
  // Calculer un score simple basé sur les réponses (0-100)
  let score = 0
  let factors = 0
  
  // Score sur 10 questions maintenant
  const scores = [
    audit.lighting,
    audit.walkpath,
    audit.openness,
    audit.feeling,
    audit.people_presence || audit.peoplePresence,
    audit.cleanliness,
    audit.natural_surveillance || audit.naturalSurveillance,
    audit.space_diversity || audit.spaceDiversity,
    audit.transport_access || audit.transportAccess,
    audit.formal_security || audit.formalSecurity
  ].filter(s => s !== null && s !== undefined)
  
  if (scores.length > 0) {
    // Moyenne des scores (1-4) convertie en pourcentage (0-100)
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length
    score = ((avgScore - 1) / 3) * 100 // Convertir de 1-4 à 0-100
    totalScore += score
    scoredAudits++
  }
})
```
