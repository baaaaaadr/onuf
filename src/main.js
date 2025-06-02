// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // Importez Vuetify

const app = createApp(App)

app.use(router)
app.use(vuetify) // Utilisez Vuetify

app.mount('#app')