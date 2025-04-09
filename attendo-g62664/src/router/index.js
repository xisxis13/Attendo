import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: HomeView,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: {
        requiresAuth: true,
      },
      children: [
        { path: '/:sessionId', name: 'sessions-details', component: SessionsView, props: true },
        { path: '/:sessionId/:ueId', name: 'ue-details', component: SessionsView, props: true },
        { path: '/:sessionId/:ueId/:epreuveId', name: 'epreuve-details', component: SessionsView, props: true },
        { path: '/:sessionId/:ueId/:epreuveId/:roomId', name: 'room-details', component: SessionsView, props: true },
      ]
    },
    {
      path: '/about',
      name: 'à propos',
      component: AboutView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'home', query: { authRequired: 'true' } });
  } else {
    next();
  }
})

export default router
