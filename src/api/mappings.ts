import api from './index'
import type { Mapping, MappingForm, PaginatedResponse } from '@/types'

export function fetchMappings(params?: { page?: number; page_size?: number; search?: string }) {
  return api.get<PaginatedResponse<Mapping>>('/api/machines/', { params })
}

export function createMapping(data: MappingForm) {
  return api.post<Mapping>('/api/machines/', data)
}

export function updateMapping(id: number, data: MappingForm) {
  return api.put<Mapping>(`/api/machines/${id}`, data)
}

export function deleteMapping(id: number) {
  return api.delete(`/api/machines/${id}`)
}
