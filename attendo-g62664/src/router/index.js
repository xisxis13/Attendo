import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import SessionDetailsView from '@/views/SessionDetailsView.vue'
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
    },
    {
      path: '/sessions/:sessionId',
      name: 'session-details',
      component: SessionDetailsView,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sessions/:sessionId/:ueId',
      name: 'ue-details',
      component: SessionDetailsView,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sessions/:sessionId/:ueId/:epreuveId',
      name: 'epreuve-details',
      component: SessionDetailsView,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/sessions/:sessionId/:ueId/:epreuveId/:roomId',
      name: 'room-details',
      component: SessionDetailsView,
      props: true,
      meta: {
        requiresAuth: true,
      },
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
