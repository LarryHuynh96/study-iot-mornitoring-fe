import api from './index'
import type { Machine, MachineListParams, PaginatedResponse } from '@/types'

export function fetchMachines(params?: MachineListParams) {
  return api.get<PaginatedResponse<Machine>>('/api/machines/', { params })
}

export function fetchMachine(id: number) {
  return api.get<Machine>(`/api/machines/${id}`)
}
