import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchDashboardData } from '@/api/dashboard'
import { fetchMonitoringAlerts } from '@/api/monitoring'
import type { DashboardStats, DailyProduction, MonitoringAlert } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats>({
    total_machines: 0,
    machines_online: 0,
    machines_offline: 0,
    pads_online: 0,
    pads_offline: 0,
    no_product_set: 0,
    today_record_count: 0,
    today_total_stitches: 0,
  })
  const dailyProduction = ref<DailyProduction[]>([])
  const alerts = ref<MonitoringAlert[]>([])
  const loading = ref(false)

  async function loadDashboard() {
    loading.value = true
    try {
      const [summaryRes, alertsRes] = await Promise.all([
        fetchDashboardData(),
        fetchMonitoringAlerts(),
      ])

      // The summary endpoint may return a flat stats object or nested DashboardData.
      // Handle both shapes defensively.
      const summary = summaryRes.data
      if ('stats' in summary && summary.stats) {
        stats.value = summary.stats
        dailyProduction.value = summary.daily_production ?? []
      } else {
        // Flat response — the summary IS the stats object
        stats.value = summary as unknown as DashboardStats
      }

      alerts.value = alertsRes.data ?? []
    } finally {
      loading.value = false
    }
  }

  return { stats, dailyProduction, alerts, loading, loadDashboard }
})
