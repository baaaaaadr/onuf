// src/router/index.js - Configuration du router pour ONUF PWA
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useSupabase'

// Import des vues (lazy loading)
const AuditFormView = () => import('@/views/AuditFormView.vue')
const AuditsHistoryView = () => import('@/views/AuditsHistoryView.vue')
const MaVilleView = () => import('@/views/MaVilleView.vue')
const CityHeatmapView = () => import('@/components/dashboard/CityHeatmap.vue')

const routes = [
  {
    path: '/',
    redirect: '/audit'
  },
  {
    path: '/audit',
    name: 'audit',
    component: AuditFormView,
    meta: { 
      requiresAuth: true,
      title: 'Nouvel Audit' 
    }
  },
  {
    path: '/history',
    name: 'history',
    component: AuditsHistoryView,
    meta: { 
      requiresAuth: true,
      title: 'Mes Audits' 
    }
  },
  {
    path: '/ma-ville',
    name: 'ma-ville',
    component: MaVilleView,
    meta: { 
      requiresAuth: true,
      title: 'Ma Ville' 
    }
  },
  {
    path: '/heatmap',
    name: 'heatmap',
    component: CityHeatmapView,
    meta: { 
      requiresAuth: true,
      title: 'Ma Ville' 
    }
  },
  // Redirections pour compatibilité
  {
    path: '/intro',
    redirect: '/'
  },
  {
    path: '/login',
    redirect: '/'
  },
  // Catch all - redirection vers accueil
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Guard de navigation pour l'authentification
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Si la route nécessite une authentification
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    console.log('🔒 Route protégée - utilisateur non authentifié')
    // Rester sur la page actuelle et laisser App.vue gérer l'affichage du login
    next(false)
    return
  }
  
  // Mettre à jour le titre de la page
  if (to.meta.title) {
    document.title = `${to.meta.title} | ONUF`
  }
  
  next()
})

export default router
