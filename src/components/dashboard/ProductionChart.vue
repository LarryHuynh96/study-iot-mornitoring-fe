<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { DailyProduction } from '@/types'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent])

const props = defineProps<{
  data: DailyProduction[]
}>()

const option = computed(() => ({
  title: {
    text: 'Production (Last 7 Days)',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => d.date),
  },
  yAxis: {
    type: 'value',
    name: 'Records',
  },
  series: [
    {
      name: 'Production Records',
      type: 'bar',
      data: props.data.map((d) => d.count),
      itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
    },
  ],
}))
</script>

<template>
  <el-card shadow="hover">
    <VChart :option="option" style="height: 300px" autoresize />
  </el-card>
</template>
