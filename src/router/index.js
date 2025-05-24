import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import axiosInstance from "../api/axios.js";

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
      path: '/customer_service',
      name: 'customer-service',
      component: () => import('../views/CustomerService.vue'),
      meta: {
        requiresAuth: true,
      }
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
      component: () => import('../views/Reservations/Reservations.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Auth/Profile.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/reservation/:id',
      name: 'single-reservation',
      component: () => import('../components/reservation.vue'),
      meta: {
        requiresAuth: true,
      }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('authToken');
  // localStorage.clear();

  if (token && to.meta.requiresAuth) {
    try {
      // const response = await axiosInstance.post('/token-check', token);
      // if (response.data.accessToken === 'success') {
      //   to.meta.uid = response.data.id;
      //   return next();
      // }
      to.meta.uid = 4;
      return next();
    } catch (error) {
      console.log(error)
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');

        return next({ name: 'login' });
      }
    }
  }


  if ((to.name === "login" || to.name === "register") && token) {
    next({ name: 'profile' });
  }

  if ((to.meta.requiresAuth) && !token) {
    next({ name: 'login' });
  } else {
    next();
  }

  
});

export default router
