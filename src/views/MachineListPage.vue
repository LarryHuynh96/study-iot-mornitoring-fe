<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useMachineStore } from '@/stores/machines'
import { useTable } from '@/composables/useTable'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatDateTime, formatIP } from '@/utils/format'
import type { DeviceStatus, Machine } from '@/types'

const router = useRouter()
const store = useMachineStore()

const statusFilter = ref<DeviceStatus | ''>('')

const { page, pageSize, search, refresh, handlePageChange, handleSizeChange } = useTable(
  async (params) => {
    await store.loadMachines({
      ...params,
      status: statusFilter.value || undefined,
    })
  },
)

watch(statusFilter, () => {
  page.value = 1
  refresh()
})

onMounted(() => {
  refresh()
})

function goToDetail(row: Machine) {
  router.push({ name: 'MachineDetail', params: { id: row.machine_id } })
}
</script>

<template>
  <div v-loading="store.loading">
    <PageHeader
      title="Machines"
      :breadcrumbs="[{ label: 'Dashboard', to: '/' }, { label: 'Machines' }]"
    />

    <el-card shadow="hover">
      <div class="table-page__filters">
        <el-input
          v-model="search"
          placeholder="Search by Machine ID or IP..."
          clearable
          style="width: 280px"
          :prefix-icon="Search"
        />
        <el-select
          v-model="statusFilter"
          placeholder="All Status"
          clearable
          style="width: 160px"
        >
          <el-option label="Online" value="ON" />
          <el-option label="Offline" value="OFF" />
          <el-option label="Unknown" value="UNKNOWN" />
        </el-select>
      </div>

      <el-table
        v-if="store.machines.length"
        :data="store.machines"
        stripe
        row-class-name="clickable-row"
        @row-click="goToDetail"
      >
        <el-table-column prop="machine_id" label="Machine ID" min-width="120" />
        <el-table-column label="Pad IP" min-width="130">
          <template #default="{ row }">
            {{ formatIP(row.pad_ip) }}
          </template>
        </el-table-column>
        <el-table-column label="Machine IP" min-width="130">
          <template #default="{ row }">
            {{ formatIP(row.machine_ip) }}
          </template>
        </el-table-column>
        <el-table-column label="Pad Status" width="110" align="center">
          <template #default="{ row }">
            <StatusBadge :status="row.status.pad_online ? 'ON' : 'OFF'" />
          </template>
        </el-table-column>
        <el-table-column label="Machine Status" width="130" align="center">
          <template #default="{ row }">
            <StatusBadge :status="row.status.machine_online ? 'ON' : 'OFF'" />
          </template>
        </el-table-column>
        <el-table-column prop="current_product_id" label="Product ID" min-width="120">
          <template #default="{ row }">
            {{ row.status.current_product_id || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Last Seen" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.status.machine_last_seen) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="goToDetail(row)">
              Detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <EmptyState v-else description="No machines found" />

      <div class="table-page__pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="store.total"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>
