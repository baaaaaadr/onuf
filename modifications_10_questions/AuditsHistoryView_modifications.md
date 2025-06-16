# Modifications pour AuditsHistoryView.vue

## 1. Remplacer la fonction calculateGlobalScore

```javascript
const calculateGlobalScore = (audit) => {
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
  ].filter(score => score > 0)
  
  if (scores.length === 0) return 0
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}
```

## 2. Remplacer la fonction getScoreItems

```javascript
const getScoreItems = (audit) => {
  return [
    { key: 'lighting', icon: '💡', label: 'Éclairage', value: audit.lighting || 0, color: getScoreColor(audit.lighting) },
    { key: 'walkpath', icon: '🚶', label: 'Cheminement', value: audit.walkpath || 0, color: getScoreColor(audit.walkpath) },
    { key: 'openness', icon: '👁️', label: 'Ouverture', value: audit.openness || 0, color: getScoreColor(audit.openness) },
    { key: 'feeling', icon: '😊', label: 'Ressenti', value: audit.feeling || 0, color: getScoreColor(audit.feeling) },
    { key: 'people_presence', icon: '👥', label: 'Présence', value: audit.people_presence || audit.peoplePresence || 0, color: getScoreColor(audit.people_presence || audit.peoplePresence) },
    { key: 'cleanliness', icon: '🧹', label: 'Propreté', value: audit.cleanliness || 0, color: getScoreColor(audit.cleanliness) },
    { key: 'natural_surveillance', icon: '👁️‍🗨️', label: 'Surveillance', value: audit.natural_surveillance || audit.naturalSurveillance || 0, color: getScoreColor(audit.natural_surveillance || audit.naturalSurveillance) },
    { key: 'space_diversity', icon: '👨‍👩‍👧‍👦', label: 'Mixité', value: audit.space_diversity || audit.spaceDiversity || 0, color: getScoreColor(audit.space_diversity || audit.spaceDiversity) },
    { key: 'transport_access', icon: '🚌', label: 'Transports', value: audit.transport_access || audit.transportAccess || 0, color: getScoreColor(audit.transport_access || audit.transportAccess) },
    { key: 'formal_security', icon: '👮', label: 'Sécurité', value: audit.formal_security || audit.formalSecurity || 0, color: getScoreColor(audit.formal_security || audit.formalSecurity) }
  ]
}
```
