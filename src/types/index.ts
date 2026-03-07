// ============ Common ============

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface ApiListParams {
  page?: number
  page_size?: number
  search?: string
  ordering?: string
}

// ============ Machine / Pad ============

export type DeviceStatus = 'ON' | 'OFF' | 'UNKNOWN'

export interface MachineStatus {
  machine_online: boolean
  pad_online: boolean
  machine_last_seen: string | null
  pad_last_seen: string | null
  current_product_id: string | null
}

export interface Machine {
  id: number
  machine_id: string
  machine_ip: string
  pad_ip: string
  created_at: string
  updated_at: string
  status: MachineStatus
}

export interface MachineListParams extends ApiListParams {
  status?: DeviceStatus | ''
}

// ============ Mapping ============
// Mappings are now served by the /machines/ endpoint (CRUD).
// The Mapping type models the response from GET/POST/PUT /api/machines/.

export interface Mapping {
  id: number
  machine_id: string
  pad_ip: string
  machine_ip: string
  created_at: string
  updated_at: string
}

export interface MappingForm {
  machine_id: string
  pad_ip: string
  machine_ip: string
}

// ============ Production Record ============

export interface ProductionRecord {
  id: number
  machine_id: string
  product_id: string
  start_time: string
  end_time: string | null
  stitch_count: number
  status: string
  duration_seconds: number | null
  created_at: string
}

export interface ProductionListParams extends ApiListParams {
  machine_id?: string
  product_id?: string
  start_date?: string
  end_date?: string
}

// ============ Production Session ============

export interface ProductionSession {
  id: number
  machine_id: string
  product_id: string
  start_time: string
  end_time: string | null
  status: string
  total_stitch_count: number
  record_count: number
  created_at: string
}

export interface SessionListParams extends ApiListParams {
  machine_id?: string
  product_id?: string
  start_date?: string
  end_date?: string
}

// ============ Monitoring ============

export interface MonitoringEvent {
  id: number
  machine_id: string
  event_type: string
  message: string
  severity: string
  created_at: string
}

export interface MonitoringAlert {
  id: number
  machine_id: string
  ip_address: string
  alert_type: string
  message: string
  severity: string
  last_seen: string | null
  created_at: string
}

export interface MonitoringStatus {
  total_machines: number
  online_machines: number
  offline_machines: number
  online_pads: number
  offline_pads: number
  unknown_devices: number
}

// ============ Dashboard ============

export interface DashboardStats {
  total_machines: number
  online_machines: number
  offline_machines: number
  online_pads: number
  offline_pads: number
  unknown_devices: number
}

export interface DailyProduction {
  date: string
  count: number
  total_stitches: number
}

export interface OfflineAlert {
  machine_id: string
  ip_address: string
  last_seen: string | null
  type: 'machine' | 'pad'
}

export interface DashboardData {
  stats: DashboardStats
  daily_production: DailyProduction[]
  offline_alerts: OfflineAlert[]
}
