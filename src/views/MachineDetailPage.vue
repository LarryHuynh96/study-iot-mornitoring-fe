<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMachineStore } from '@/stores/machines'
import { useProductionStore } from '@/stores/production'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { formatDateTime, formatIP, formatDuration } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const machineStore = useMachineStore()
const productionStore = useProductionStore()

async function loadMachineData() {
  const machineId = String(route.params.id)
  await machineStore.loadMachineByMachineId(machineId)
  if (machineStore.currentMachine) {
    await productionStore.loadRecords({
      machine_id: machineStore.currentMachine.machine_id,
      page_size: 20,
    })
  }
}

onMounted(() => {
  loadMachineData()
})

// Watch for route param changes to reload data
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadMachineData()
  }
})

function goToProductionDetail(id: number) {
  router.push({ name: 'ProductionDetail', params: { id } })
}

function goToProductionHistory() {
  if (machineStore.currentMachine) {
    router.push({
      name: 'ProductionHistory',
      query: { machine_id: machineStore.currentMachine.machine_id },
    })
  }
}
</script>

<template>
  <div v-loading="machineStore.loading">
    <PageHeader
      title="Machine Detail"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/' },
        { label: 'Machines', to: '/machines' },
        { label: machineStore.currentMachine?.machine_id || 'Detail' },
      ]"
    />

    <template v-if="machineStore.currentMachine">
      <el-row :gutter="16" style="margin-bottom: 20px">
        <el-col :xs="24" :md="8">
          <el-card shadow="hover">
            <template #header>Machine Info</template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="Machine ID">
                {{ machineStore.currentMachine.machine_id }}
              </el-descriptions-item>
              <el-descriptions-item label="IP Address">
                {{ formatIP(machineStore.currentMachine.machine_ip) }}
              </el-descriptions-item>
              <el-descriptions-item label="Status">
                <StatusBadge :status="machineStore.currentMachine.status.machine_online ? 'ON' : 'OFF'" />
              </el-descriptions-item>
              <el-descriptions-item label="Last Seen">
                {{ formatDateTime(machineStore.currentMachine.status.machine_last_seen) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card shadow="hover">
            <template #header>Pad Info</template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="Pad IP">
                {{ formatIP(machineStore.currentMachine.pad_ip) }}
              </el-descriptions-item>
              <el-descriptions-item label="Pad Status">
                <StatusBadge :status="machineStore.currentMachine.status.pad_online ? 'ON' : 'OFF'" />
              </el-descriptions-item>
              <el-descriptions-item label="Last Seen">
                {{ formatDateTime(machineStore.currentMachine.status.pad_last_seen) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card shadow="hover">
            <template #header>Current Product</template>
            <div style="text-align: center; padding: 20px">
              <div style="font-size: 24px; font-weight: 700; color: #303133">
                {{ machineStore.currentMachine.status.current_product_id || 'N/A' }}
              </div>
              <div style="color: #909399; margin-top: 8px">Product ID</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>Recent Production Records</span>
            <el-button type="primary" link @click="goToProductionHistory">
              View All
            </el-button>
          </div>
        </template>
        <el-table
          v-if="productionStore.records.length"
          :data="productionStore.records"
          stripe
          size="small"
          row-class-name="clickable-row"
          @row-click="(row: any) => goToProductionDetail(row.id)"
        >
          <el-table-column prop="product_id" label="Product ID" />
          <el-table-column label="Start Time">
            <template #default="{ row }">
              {{ formatDateTime(row.start_time) }}
            </template>
          </el-table-column>
          <el-table-column label="End Time">
            <template #default="{ row }">
              {{ formatDateTime(row.end_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="stitch_count" label="Stitches" />
          <el-table-column label="Duration">
            <template #default="{ row }">
              {{ formatDuration(row.duration_seconds) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Status" />
        </el-table>
        <el-empty v-else description="No production records" :image-size="60" />
      </el-card>
    </template>
  </div>
</template>
