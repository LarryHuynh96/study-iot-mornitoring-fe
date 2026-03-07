import api from './index'
import type {
  MonitoringEvent,
  MonitoringAlert,
  MonitoringStatus,
  PaginatedResponse,
  ApiListParams,
} from '@/types'

export function fetchMonitoringEvents(params?: ApiListParams) {
  return api.get<PaginatedResponse<MonitoringEvent>>('/api/monitoring/events', { params })
}

export function fetchMonitoringEvent(id: number) {
  return api.get<MonitoringEvent>(`/api/monitoring/events/${id}`)
}

export function fetchMonitoringAlerts() {
  return api.get<MonitoringAlert[]>('/api/monitoring/alerts')
}

export function fetchMonitoringStatus() {
  return api.get<MonitoringStatus>('/api/monitoring/status')
}
