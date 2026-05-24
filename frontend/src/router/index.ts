import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/properties',
      name: 'properties',
      component: () => import('../views/PropertiesView.vue'),
    },
    {
      path: '/properties/:id',
      name: 'property-detail',
      component: () => import('../views/PropertyDetailView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/add',
      name: 'dashboard-add',
      component: () => import('../views/dashboard/AddPropertyView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/edit/:id',
      name: 'dashboard-edit',
      component: () => import('../views/dashboard/EditPropertyView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
