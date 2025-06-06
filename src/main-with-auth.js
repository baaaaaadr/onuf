// src/main.js - Updated to include Supabase initialization
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import { initAuth } from '@/composables/useSupabase'

// Import views
import IntroView from '@/views/IntroView.vue'
import AuditFormView from '@/views/AuditFormView.vue'
import AuditsHistoryView from '@/views/AuditsHistoryView.vue'

// Router configuration
const routes = [
  { path: '/', name: 'intro', component: IntroView },
  { path: '/audit', name: 'audit', component: AuditFormView },
  { path: '/history', name: 'history', component: AuditsHistoryView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Vuetify configuration
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  }
})

// Create app
const app = createApp(App)

// Initialize Supabase auth
initAuth()

// Use plugins
app.use(router)
app.use(vuetify)

// Mount app
app.mount('#app')
