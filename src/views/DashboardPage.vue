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
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Total Machines"
          :value="store.stats.total_machines"
          icon="el-icon-cpu"
          color="#409eff"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Machines Online"
          :value="store.stats.machines_online"
          icon="el-icon-circle-check"
          color="#67c23a"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Machines Offline"
          :value="store.stats.machines_offline"
          icon="el-icon-circle-close"
          color="#f56c6c"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Pads Online"
          :value="store.stats.pads_online"
          icon="el-icon-monitor"
          color="#67c23a"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Pads Offline"
          :value="store.stats.pads_offline"
          icon="el-icon-warning"
          color="#e6a23c"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="No Product Set"
          :value="store.stats.no_product_set"
          icon="el-icon-warning-filled"
          color="#909399"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Today's Records"
          :value="store.stats.today_record_count"
          icon="el-icon-document"
          color="#409eff"
        />
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="3">
        <StatCard
          title="Today's Stitches"
          :value="store.stats.today_total_stitches"
          icon="el-icon-data-line"
          color="#67c23a"
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
