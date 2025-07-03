# 🩹 Avertissements Vue.js Restants

Si vous avez encore des avertissements `[Vue warn]` après avoir appliqué les corrections principales, voici les causes probables et solutions :

## 1. Avertissements liés à Vuetify

### Problème : `onScopeDispose() is called when there is no active effect scope`

**Cause** : Vuetify 3 utilise des composables internes qui peuvent être appelés de manière asynchrone.

**Solutions** :

1. **Mettre à jour Vuetify** :
```bash
npm update vuetify@latest
```

2. **Vérifier l'usage des composants Vuetify** :
- Ne pas créer de composants Vuetify dynamiquement dans des callbacks
- Éviter d'utiliser `v-if` sur des composants complexes comme `VMenu`, `VDialog`

## 2. Avertissements liés à Vue Router

### Problème : `withDirectives can only be used inside render functions`

**Cause** : Le composable `useLink` de Vue Router peut causer ce problème.

**Solution** : Utiliser `RouterLink` au lieu de créer des liens programmatiques :

```vue
<!-- ❌ Éviter -->
<v-btn :to="{ name: 'route' }">

<!-- ✅ Préférer -->
<router-link :to="{ name: 'route' }" custom v-slot="{ navigate }">
  <v-btn @click="navigate">
</router-link>
```

## 3. Vérifications à faire dans votre code

### Dans tous vos composants, assurez-vous que :

1. **Les composables sont appelés au niveau racine** :
```javascript
// ❌ MAUVAIS
onMounted(() => {
  const { someFunction } = useComposable() // Trop tard !
})

// ✅ BON
const { someFunction } = useComposable() // Au niveau racine
onMounted(() => {
  someFunction()
})
```

2. **Pas d'appels asynchrones de composables** :
```javascript
// ❌ MAUVAIS
setTimeout(() => {
  const result = useMyComposable()
}, 1000)

// ✅ BON
const result = useMyComposable()
setTimeout(() => {
  result.doSomething()
}, 1000)
```

## 4. Composants à vérifier

Vérifiez particulièrement ces fichiers :
- `src/components/navigation/BottomNav.vue`
- `src/components/common/AuditCard.vue`
- Tout composant utilisant `VMenu`, `VDialog`, `VSnackbar`

## 5. Solution temporaire

Si les avertissements persistent et n'affectent pas le fonctionnement :

```javascript
// Dans main.js, temporairement
app.config.warnHandler = (msg, instance, trace) => {
  // Ignorer certains avertissements Vuetify connus
  if (msg.includes('onScopeDispose') && trace.includes('vuetify')) {
    return
  }
  console.warn(msg, trace)
}
```

## 6. Ressources

- [Issue Vuetify GitHub](https://github.com/vuetifyjs/vuetify/issues) - Vérifier les issues connues
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) - Best practices

## ⚠️ Important

Ces avertissements, bien que gênants, n'empêchent généralement pas l'application de fonctionner. Concentrez-vous d'abord sur :
1. Les erreurs critiques (boucles récursives)
2. Les fonctionnalités métier
3. L'expérience utilisateur

Les avertissements peuvent être traités dans un second temps.
