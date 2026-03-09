<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import PageHeader from '@/components/common/PageHeader.vue'
import { formatDateTime, calcDuration } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useProductionStore()

const recordId = computed(() => Number(route.params.id))

onMounted(() => {
  store.loadRecord(recordId.value)
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    store.loadRecord(Number(newId))
  }
})

const record = computed(() => store.currentRecord)

const duration = computed(() => {
  if (!record.value?.start_time || !record.value?.end_time) return '-'
  return calcDuration(record.value.start_time, record.value.end_time)
})

const durationSeconds = computed(() => {
  if (!record.value?.start_time || !record.value?.end_time) return 0
  const start = new Date(record.value.start_time).getTime()
  const end = new Date(record.value.end_time).getTime()
  return (end - start) / 1000
})

const avgStitchesPerSec = computed(() => {
  const dur = durationSeconds.value
  if (!dur || !record.value?.sewing_stitches) return '-'
  return (record.value.sewing_stitches / dur).toFixed(2)
})

function goBack() {
  router.push({ name: 'ProductionHistory' })
}
</script>

<template>
  <div v-loading="store.loading">
    <PageHeader
      title="Production Record Detail"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/' },
        { label: 'Production', to: '/production' },
        { label: `Record #${recordId}` },
      ]"
    />

    <template v-if="record">
      <el-card shadow="hover">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Record ID">{{ record.id }}</el-descriptions-item>
          <el-descriptions-item label="Machine ID">{{ record.machine_id }}</el-descriptions-item>
          <el-descriptions-item label="Product ID">{{ record.product_id }}</el-descriptions-item>
          <el-descriptions-item label="Session ID">{{ record.session_id }}</el-descriptions-item>
          <el-descriptions-item label="Sequence Number">{{ record.sequence_number }}</el-descriptions-item>
          <el-descriptions-item label="Record Date">{{ record.record_date }}</el-descriptions-item>
          <el-descriptions-item label="Start Time">
            {{ formatDateTime(record.start_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="End Time">
            {{ formatDateTime(record.end_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="Duration">
            {{ duration }}
          </el-descriptions-item>
          <el-descriptions-item label="Sewing Stitches">
            {{ record.sewing_stitches }}
          </el-descriptions-item>
          <el-descriptions-item label="Motor Stop Time">
            {{ record.motor_stop_time }}
          </el-descriptions-item>
          <el-descriptions-item label="Motor Stop Count">
            {{ record.motor_stop_count }}
          </el-descriptions-item>
          <el-descriptions-item label="BT Stitches">
            {{ record.bt_stitches }}
          </el-descriptions-item>
          <el-descriptions-item label="FL On Count">
            {{ record.fl_on_count }}
          </el-descriptions-item>
          <el-descriptions-item label="Avg Stitches/sec">
            {{ avgStitchesPerSec }}
          </el-descriptions-item>
          <el-descriptions-item label="Received At">
            {{ formatDateTime(record.received_at) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <div style="margin-top: 20px">
        <el-button @click="goBack">Back to History</el-button>
      </div>
    </template>
  </div>
</template>
