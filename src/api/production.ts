import api from './index'
import type {
  ProductionRecord,
  ProductionListParams,
  PaginatedResponse,
  ProductionSession,
  SessionListParams,
  ApiListParams,
} from '@/types'

export function fetchProductionRecords(params?: ProductionListParams) {
  return api.get<PaginatedResponse<ProductionRecord>>('/api/production/records', { params })
}

export function fetchProductionRecord(id: number) {
  return api.get<ProductionRecord>(`/api/production/records/${id}`)
}

export function fetchProductionSessions(params?: SessionListParams) {
  return api.get<PaginatedResponse<ProductionSession>>('/api/production/sessions', { params })
}

export function fetchProductionSession(id: number) {
  return api.get<ProductionSession>(`/api/production/sessions/${id}`)
}

export function fetchSessionRecords(sessionId: number, params?: ApiListParams) {
  return api.get<PaginatedResponse<ProductionRecord>>(
    `/api/production/sessions/${sessionId}/records`,
    { params },
  )
}

export function exportProductionRecords(params?: ProductionListParams) {
  return api.get('/api/production/export', {
    params,
    responseType: 'blob',
  })
}
