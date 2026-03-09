<script setup lang="ts">
import { onMounted, computed } from 'vue'
import {
  Monitor,
  Goods,
  TrendCharts,
  BellFilled,
  Cpu,
  Clock,
  CircleCheckFilled
} from '@element-plus/icons-vue'
import { useDashboardStore } from '@/stores/dashboard'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import MachineStatusChart from '@/components/dashboard/MachineStatusChart.vue'
import ProductionChart from '@/components/dashboard/ProductionChart.vue'
import { formatDateTime } from '@/utils/format'
import type { MonitoringAlert } from '@/types'

const store = useDashboardStore()

onMounted(() => {
  store.loadDashboard()
})

const hasAlerts = computed(() => store.alerts && store.alerts.length > 0)

const alertSeverityType = (severity: string): 'danger' | 'warning' | 'info' => {
  switch (severity?.toLowerCase()) {
    case 'critical':
    case 'error':
      return 'danger'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}
</script>

<template>
  <div v-loading="store.loading" class="dashboard-page">
    <PageHeader title="Dashboard" />

    <!-- System Status Section -->
    <div class="dashboard-section">
      <div class="section-header">
        <el-icon><Monitor /></el-icon>
        <span>System Status</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :lg="6">
          <StatCard
            title="Total Machines"
            :value="store.stats.total_machines"
            icon="Cpu"
            status="info"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :lg="4">
          <StatCard
            title="Machines Online"
            :value="store.stats.machines_online"
            icon="CircleCheck"
            :status="store.stats.machines_online > 0 ? 'success' : 'default'"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :lg="4">
          <StatCard
            title="Machines Offline"
            :value="store.stats.machines_offline"
            icon="CircleClose"
            :status="store.stats.machines_offline > 0 ? 'danger' : 'default'"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :lg="5">
          <StatCard
            title="Pads Online"
            :value="store.stats.pads_online"
            icon="Monitor"
            :status="store.stats.pads_online > 0 ? 'success' : 'default'"
          />
        </el-col>
        <el-col :xs="12" :sm="6" :lg="5">
          <StatCard
            title="Pads Offline"
            :value="store.stats.pads_offline"
            icon="Warning"
            :status="store.stats.pads_offline > 0 ? 'warning' : 'default'"
          />
        </el-col>
      </el-row>
    </div>

    <!-- Production Status Section -->
    <div class="dashboard-section">
      <div class="section-header">
        <el-icon><Goods /></el-icon>
        <span>Production Status</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="8">
          <StatCard
            title="Machines Without Product"
            :value="store.stats.no_product_set"
            icon="WarningFilled"
            :status="store.stats.no_product_set > 0 ? 'warning' : 'success'"
            subtitle="Idle machines needing setup"
          />
        </el-col>
        <el-col :xs="12" :sm="8">
          <StatCard
            title="Today's Production Records"
            :value="store.stats.today_record_count"
            icon="Document"
            status="info"
            subtitle="Completed records"
          />
        </el-col>
        <el-col :xs="12" :sm="8">
          <StatCard
            title="Today's Total Stitches"
            :value="store.stats.today_total_stitches.toLocaleString()"
            icon="DataLine"
            status="success"
            subtitle="Total sewing stitches"
          />
        </el-col>
      </el-row>
    </div>

    <!-- Charts Section -->
    <div class="dashboard-section">
      <div class="section-header">
        <el-icon><TrendCharts /></el-icon>
        <span>Analytics</span>
      </div>
      <el-row :gutter="16">
        <el-col :xs="24" :lg="12">
          <MachineStatusChart :stats="store.stats" />
        </el-col>
        <el-col :xs="24" :lg="12">
          <ProductionChart :data="store.dailyProduction" />
        </el-col>
      </el-row>
    </div>

    <!-- Alerts Section -->
    <div class="dashboard-section">
      <div class="section-header">
        <el-icon><BellFilled /></el-icon>
        <span>Active Alerts</span>
        <el-badge
          v-if="hasAlerts"
          :value="store.alerts.length"
          :max="99"
          class="alert-badge"
        />
      </div>
      <el-card shadow="hover">
        <el-table
          v-if="hasAlerts"
          :data="store.alerts"
          stripe
          :default-sort="{ prop: 'created_at', order: 'descending' }"
        >
          <el-table-column prop="machine_id" label="Machine ID" width="140">
            <template #default="{ row }: { row: MonitoringAlert }">
              <div class="machine-cell">
                <el-icon><Cpu /></el-icon>
                <span>{{ row.machine_id || 'N/A' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="ip_address" label="IP Address" width="150">
            <template #default="{ row }: { row: MonitoringAlert }">
              <el-text type="info" size="small">
                {{ row.ip_address || 'Unknown' }}
              </el-text>
            </template>
          </el-table-column>

          <el-table-column prop="alert_type" label="Alert Type" width="180">
            <template #default="{ row }: { row: MonitoringAlert }">
              <el-tag
                :type="alertSeverityType(row.severity)"
                size="small"
                effect="plain"
              >
                {{ row.alert_type || 'SYSTEM' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="severity" label="Severity" width="120">
            <template #default="{ row }: { row: MonitoringAlert }">
              <el-tag
                :type="alertSeverityType(row.severity)"
                size="small"
              >
                {{ row.severity?.toUpperCase() || 'INFO' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="message" label="Message" min-width="200">
            <template #default="{ row }: { row: MonitoringAlert }">
              <el-text class="alert-message">
                {{ row.message || 'No message available' }}
              </el-text>
            </template>
          </el-table-column>

          <el-table-column prop="last_seen" label="Last Seen" width="180">
            <template #default="{ row }: { row: MonitoringAlert }">
              <div class="time-cell">
                <el-icon><Clock /></el-icon>
                <span>{{ row.last_seen ? formatDateTime(row.last_seen) : 'Never' }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-empty
          v-else
          description="No active alerts. System is running smoothly."
          :image-size="100"
        >
          <template #image>
            <el-icon :size="60" color="#67c23a">
              <CircleCheckFilled />
            </el-icon>
          </template>
        </el-empty>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;

  .el-icon {
    font-size: 20px;
    color: #409eff;
  }
}

.alert-badge {
  margin-left: 8px;
}

.machine-cell,
.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;

  .el-icon {
    color: #909399;
    font-size: 14px;
  }

  span {
    font-size: 13px;
  }
}

.alert-message {
  font-size: 13px;
  line-height: 1.5;
}

// Responsive adjustments
@media (max-width: 768px) {
  .dashboard-section {
    margin-bottom: 16px;
  }

  .section-header {
    font-size: 14px;
  }
}

// Table enhancements
:deep(.el-table) {
  font-size: 13px;

  .el-table__header th {
    background-color: #f5f7fa;
    font-weight: 600;
    color: #606266;
  }

  .el-table__row {
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

// Empty state styling
:deep(.el-empty) {
  padding: 40px 20px;
}
</style>

