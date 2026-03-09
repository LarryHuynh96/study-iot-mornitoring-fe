<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { useProductionStore } from '@/stores/production'
import { useTable } from '@/composables/useTable'
import { useDateFilter } from '@/composables/useDateFilter'
import PageHeader from '@/components/common/PageHeader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatDateTime, calcDuration } from '@/utils/format'
import type { ProductionRecord } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useProductionStore()
const { dateRange, shortcuts, getDateParams } = useDateFilter()

const machineIdFilter = ref((route.query.machine_id as string) || '')
const productIdFilter = ref('')

const { page, pageSize, search, refresh, handlePageChange, handleSizeChange } = useTable(
  async (params) => {
    await store.loadRecords({
      ...params,
      ...getDateParams(),
      machine_id: machineIdFilter.value || undefined,
      product_id: productIdFilter.value || undefined,
    })
  },
)

watch([dateRange, machineIdFilter, productIdFilter], () => {
  page.value = 1
  refresh()
})

onMounted(() => {
  refresh()
})

function goToDetail(row: ProductionRecord) {
  router.push({ name: 'ProductionDetail', params: { id: row.id } })
}

async function handleExport() {
  await store.exportRecords({
    ...getDateParams(),
    search: search.value || undefined,
    machine_id: machineIdFilter.value || undefined,
    product_id: productIdFilter.value || undefined,
  })
}
</script>

<template>
  <div v-loading="store.loading">
    <PageHeader
      title="Production History"
      :breadcrumbs="[{ label: 'Dashboard', to: '/' }, { label: 'Production' }]"
    />

    <el-card shadow="hover">
      <div class="table-page__filters">
        <el-input
          v-model="search"
          placeholder="Search..."
          clearable
          style="width: 200px"
          :prefix-icon="Search"
        />
        <el-input
          v-model="machineIdFilter"
          placeholder="Machine ID"
          clearable
          style="width: 160px"
        />
        <el-input
          v-model="productIdFilter"
          placeholder="Product ID"
          clearable
          style="width: 160px"
        />
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD"
          style="width: 280px"
        />
        <el-button type="success" @click="handleExport">
          Export Excel
        </el-button>
      </div>

      <el-table
        v-if="store.records.length"
        :data="store.records"
        stripe
        row-class-name="clickable-row"
        @row-click="goToDetail"
      >
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column prop="mapping_id" label="Mapping" width="90" align="center" />
        <el-table-column prop="machine_id" label="Machine ID" min-width="110" />
        <el-table-column label="Product ID" min-width="200">
          <template #default="{ row }">
            <span :title="row.product_id">{{ row.product_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="session_id" label="Session" width="80" align="center" />
        <el-table-column prop="sequence_number" label="Seq #" width="70" align="center" />
        <el-table-column prop="record_date" label="Date" width="110" />
        <el-table-column prop="start_time" label="Start Time" width="110" />
        <el-table-column prop="end_time" label="End Time" width="110" />
        <el-table-column label="Duration" width="100">
          <template #default="{ row }">
            {{ calcDuration(row.start_time, row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="sewing_stitches" label="Stitches" width="90" align="right" />
        <el-table-column prop="motor_stop_time" label="Stop Time" width="95" align="right" />
        <el-table-column prop="motor_stop_count" label="Stop Count" width="100" align="right" />
        <el-table-column prop="bt_stitches" label="BT Stitches" width="105" align="right" />
        <el-table-column prop="fl_on_count" label="FL On" width="75" align="right" />
        <el-table-column label="Received At" min-width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.received_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="goToDetail(row)">
              Detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <EmptyState v-else description="No production records found" />

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
