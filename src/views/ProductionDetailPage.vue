<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductionStore } from '@/stores/production'
import PageHeader from '@/components/common/PageHeader.vue'
import { formatDateTime, formatDuration } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const store = useProductionStore()

const recordId = Number(route.params.id)

onMounted(() => {
  store.loadRecord(recordId)
})

const record = computed(() => store.currentRecord)

const avgStitchesPerSec = computed(() => {
  if (!record.value?.duration_seconds || !record.value.stitch_count) return '-'
  return (record.value.stitch_count / record.value.duration_seconds).toFixed(2)
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
          <el-descriptions-item label="Status">{{ record.status }}</el-descriptions-item>
          <el-descriptions-item label="Start Time">
            {{ formatDateTime(record.start_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="End Time">
            {{ formatDateTime(record.end_time) }}
          </el-descriptions-item>
          <el-descriptions-item label="Duration">
            {{ formatDuration(record.duration_seconds) }}
          </el-descriptions-item>
          <el-descriptions-item label="Stitch Count">
            {{ record.stitch_count }}
          </el-descriptions-item>
          <el-descriptions-item label="Avg Stitches/sec">
            {{ avgStitchesPerSec }}
          </el-descriptions-item>
          <el-descriptions-item label="Created At">
            {{ formatDateTime(record.created_at) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <div style="margin-top: 20px">
        <el-button @click="goBack">Back to History</el-button>
      </div>
    </template>
  </div>
</template>
