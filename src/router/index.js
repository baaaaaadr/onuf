// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '../views/IntroView.vue'
import AuditFormView from '../views/AuditFormView.vue'
import AuditsHistoryView from '../views/AuditsHistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: IntroView
    },
    {
      path: '/audit',
      name: 'audit',
      component: AuditFormView
    },
    {
      path: '/history',
      name: 'history',
      component: AuditsHistoryView
    }
  ]
})

export default router