import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'machines',
        name: 'MachineList',
        component: () => import('@/views/MachineListPage.vue'),
        meta: { title: 'Machines' },
      },
      {
        path: 'machines/:id',
        name: 'MachineDetail',
        component: () => import('@/views/MachineDetailPage.vue'),
        meta: { title: 'Machine Detail' },
      },
      {
        path: 'mappings',
        name: 'Mappings',
        component: () => import('@/views/MappingPage.vue'),
        meta: { title: 'Mapping Management' },
      },
      {
        path: 'production',
        name: 'ProductionHistory',
        component: () => import('@/views/ProductionHistoryPage.vue'),
        meta: { title: 'Production History' },
      },
      {
        path: 'production/:id',
        name: 'ProductionDetail',
        component: () => import('@/views/ProductionDetailPage.vue'),
        meta: { title: 'Production Detail' },
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
  next()
})

export default router
