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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/customer_service',
      name: 'customer-service',
      component: () => import('../views/CustomerService.vue'),
    },
    {
      path: '/finances',
      name: 'finances',
      component: () => import('../views/Finances.vue'),
    },
    {
      path: '/housekeeping',
      name: 'housekeeping',
      component: () => import('../views/Housekeeping.vue'),
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('../views/Reservations.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/reservation/:id',
      name: 'single-reservation',
      component: () => import('../components/reservation.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('authToken');

  if ((to.name == "login" || to.name == "register") && token) {
    next({ name: 'profile' });
  }

  if ((
    to.name == 'profile' ||
    to.name == 'reservations' ||
    to.name == 'single-reservation' ||
    to.name == 'customer-service' ||
    to.name == 'finances'
  ) && !token) {
    next({ name: 'login' });
  } else {
    next();
  }

  
});

export default router
