import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register, meta: { guestOnly: true } },
  { path: '/login', component: Login, meta: { guestOnly: true } },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde simple basée sur auth.currentUser à chaque navigation
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  const auth = getAuth();
  const user = auth.currentUser;

  if (requiresAuth && !user) {
    // Pas connecté -> vers login
    next('/login');
  } else if (guestOnly && user) {
    // Déjà connecté -> pas besoin de revenir sur login/register
    next('/home');
  } else {
    next();
  }
});

export default router;
