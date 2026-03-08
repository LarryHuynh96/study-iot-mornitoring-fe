import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: 'Login', requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardPage.vue'),
        meta: { title: 'Dashboard', requiresAuth: true },
      },
      {
        path: 'machines',
        name: 'MachineList',
        component: () => import('@/views/MachineListPage.vue'),
        meta: { title: 'Machines', requiresAuth: true },
      },
      {
        path: 'machines/:id',
        name: 'MachineDetail',
        component: () => import('@/views/MachineDetailPage.vue'),
        meta: { title: 'Machine Detail', requiresAuth: true },
      },
      {
        path: 'mappings',
        name: 'Mappings',
        component: () => import('@/views/MappingPage.vue'),
        meta: { title: 'Mapping Management', requiresAuth: true },
      },
      {
        path: 'production',
        name: 'ProductionHistory',
        component: () => import('@/views/ProductionHistoryPage.vue'),
        meta: { title: 'Production History', requiresAuth: true },
      },
      {
        path: 'production/:id',
        name: 'ProductionDetail',
        component: () => import('@/views/ProductionDetailPage.vue'),
        meta: { title: 'Production Detail', requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'IoT Monitor'} - IoT Monitoring`

  const token = localStorage.getItem('access_token')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'Login' })
  } else if (to.name === 'Login' && token) {
    // Redirect to dashboard if user is already logged in and tries to access login page
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
