// src/router/index.js - Version redesign v2.0
import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AuditFormView from '../views/AuditFormView.vue'
import AuditsHistoryView from '../views/AuditsHistoryView.vue'
// Garde l'ancienne IntroView pour migration en douceur
import IntroView from '../views/IntroView.vue'
import MobileTestView from '../views/MobileTestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Accueil',
        showBottomNav: true
      }
    },
    {
      path: '/audit',
      name: 'audit',
      component: AuditFormView,
      meta: {
        title: 'Nouvel Audit',
        showBottomNav: true
      }
    },
    {
      path: '/history',
      name: 'history',
      component: AuditsHistoryView,
      meta: {
        title: 'Mes Audits',
        showBottomNav: true
      }
    },
    // Route de compatibilité pour l'ancienne intro
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
      meta: {
        title: 'Introduction',
        showBottomNav: false
      }
    },
    {
      path: '/test-mobile',
      name: 'MobileTest',
      component: MobileTestView,
      meta: {
        title: 'Test Mobile',
        showBottomNav: false,
        requiresAuth: true
      }
    },
    // Redirections pour compatibilité
    {
      path: '/audits',
      redirect: '/history'
    },
    // Nouvelle route pour la page Ma Ville
    {
      path: '/ma-ville',
      name: 'ma-ville',
      component: () => import('@/views/MaVilleView.vue'),
      meta: { 
        title: 'Ma Ville',
        showBottomNav: true,
        requiresAuth: true 
      }
    }
  ]
})

// Guard de navigation pour les meta titles
router.beforeEach((to, from, next) => {
  // Mettre à jour le titre de la page
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ONUF`
  } else {
    document.title = 'ONUF - Agadir Safety Audit'
  }
  
  next()
})

export default router