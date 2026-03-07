import api from './index'
import type { DashboardData } from '@/types'

export function fetchDashboardData() {
  return api.get<DashboardData>('/api/machines/dashboard/summary')
}
