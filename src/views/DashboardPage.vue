<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import MachineStatusChart from '@/components/dashboard/MachineStatusChart.vue'
import ProductionChart from '@/components/dashboard/ProductionChart.vue'
import { formatDateTime } from '@/utils/format'

const store = useDashboardStore()

onMounted(() => {
  store.loadDashboard()
})
</script>

<template>
  <div v-loading="store.loading">
    <PageHeader title="Dashboard" />

    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Total Machines"
          :value="store.stats.total_machines"
          icon="el-icon-cpu"
          color="#409eff"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Online Machines"
          :value="store.stats.online_machines"
          icon="el-icon-circle-check"
          color="#67c23a"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Offline Machines"
          :value="store.stats.offline_machines"
          icon="el-icon-circle-close"
          color="#f56c6c"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Online Pads"
          :value="store.stats.online_pads"
          icon="el-icon-monitor"
          color="#67c23a"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Offline Pads"
          :value="store.stats.offline_pads"
          icon="el-icon-warning"
          color="#e6a23c"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="4">
        <StatCard
          title="Unknown Devices"
          :value="store.stats.unknown_devices"
          icon="el-icon-question-filled"
          color="#909399"
        />
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :xs="24" :md="12">
        <MachineStatusChart :stats="store.stats" />
      </el-col>
      <el-col :xs="24" :md="12">
        <ProductionChart :data="store.dailyProduction" />
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <template #header>
        <span>Alerts</span>
      </template>
      <el-table
        v-if="store.alerts.length"
        :data="store.alerts"
        stripe
        size="small"
      >
        <el-table-column prop="machine_id" label="Machine ID" />
        <el-table-column prop="ip_address" label="IP Address" />
        <el-table-column prop="alert_type" label="Type">
          <template #default="{ row }">
            <el-tag :type="row.severity === 'critical' ? 'danger' : 'warning'" size="small">
              {{ row.alert_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="Message" />
        <el-table-column label="Last Seen">
          <template #default="{ row }">
            {{ formatDateTime(row.last_seen) }}
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-else description="No alerts" />
    </el-card>
  </div>
</template>
