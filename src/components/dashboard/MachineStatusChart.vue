<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { DashboardStats } from '@/types'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  stats: DashboardStats
}>()

const option = computed(() => ({
  title: {
    text: 'Machine Status',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    bottom: '0',
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
      },
      data: [
        { value: props.stats.machines_online, name: 'Online', itemStyle: { color: '#67c23a' } },
        { value: props.stats.machines_offline, name: 'Offline', itemStyle: { color: '#f56c6c' } },
        {
          value: props.stats.no_product_set,
          name: 'No Product',
          itemStyle: { color: '#909399' },
        },
      ],
    },
  ],
}))
</script>

<template>
  <el-card shadow="hover">
    <VChart :option="option" style="height: 300px" autoresize />
  </el-card>
</template>
