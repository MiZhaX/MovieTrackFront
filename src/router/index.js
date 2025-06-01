import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ],
})

export default router
