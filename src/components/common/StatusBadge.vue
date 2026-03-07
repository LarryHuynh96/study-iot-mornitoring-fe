<script setup lang="ts">
import { computed } from 'vue'
import type { DeviceStatus } from '@/types'

const props = defineProps<{
  status: DeviceStatus
}>()

const statusMap: Record<DeviceStatus, { type: 'success' | 'danger' | 'info'; label: string }> = {
  ON: { type: 'success', label: 'Online' },
  OFF: { type: 'danger', label: 'Offline' },
  UNKNOWN: { type: 'info', label: 'Unknown' },
}

const config = computed(() => statusMap[props.status] || statusMap.UNKNOWN)
</script>

<template>
  <el-tag :type="config.type" size="small" effect="dark">
    {{ config.label }}
  </el-tag>
</template>
