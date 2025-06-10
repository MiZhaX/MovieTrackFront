import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/peliculas',
      name: 'peliculas',
      component: () => import('../views/Producciones/MostrarProducciones.vue'),
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/Producciones/MostrarProducciones.vue'),
    },
    {
      path: '/producciones/:produccionId',
      name: 'produccionesDetalle',
      component: () => import('../views/Producciones/ProduccionesDetalle.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/perfil/:usuarioId',
      name: 'perfil',
      component: () => import('../views/Perfil.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/personas/:personaId',
      name: 'personaDetalle',
      component: () => import('../views/Personas/Persona.vue'),
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../views/Ranking/Ranking.vue'),
    },
    {
      path: '/listas/:listaId',
      name: 'lista',
      component: () => import('../views/Producciones/Listas.vue'),
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

function estaLogueado() {
  return !!localStorage.getItem('user') 
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !estaLogueado()) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
