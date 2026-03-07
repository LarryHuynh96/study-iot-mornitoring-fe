<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { DailyProduction } from '@/types'

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, LegendComponent])

const props = defineProps<{
  data: DailyProduction[]
}>()

const hasData = computed(() => props.data && props.data.length > 0)

const option = computed(() => ({
  title: {
    text: 'Production Records (Last 7 Days)',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params: any) => {
      const data = params[0]
      const dataPoint = props.data[data.dataIndex]
      return `
        <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
        <div style="color: #409eff;">● Records: ${data.value}</div>
        ${dataPoint?.total_stitches
          ? `<div style="color: #67c23a; margin-top: 2px;">● Stitches: ${dataPoint.total_stitches.toLocaleString()}</div>`
          : ''}
      `
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    top: '20%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: props.data.map((d) => {
      const date = new Date(d.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }),
    axisLine: {
      lineStyle: { color: '#e0e0e0' },
    },
    axisLabel: {
      color: '#606266',
    },
  },
  yAxis: {
    type: 'value',
    name: 'Records',
    nameTextStyle: {
      color: '#606266',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: '#e0e0e0',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#606266',
    },
  },
  series: [
    {
      name: 'Production Records',
      type: 'bar',
      data: props.data.map((d) => d.count),
      itemStyle: {
        color: '#409eff',
        borderRadius: [6, 6, 0, 0],
      },
      emphasis: {
        itemStyle: {
          color: '#66b1ff',
        },
      },
      barWidth: '50%',
    },
  ],
}))
</script>

<template>
  <el-card shadow="hover" class="production-chart">
    <template v-if="hasData">
      <VChart :option="option" style="height: 320px" autoresize />
    </template>
    <template v-else>
      <div class="empty-chart">
        <el-empty
          description="No production data in the last 7 days"
          :image-size="120"
        >
          <template #image>
            <el-icon :size="80" color="#c0c4cc">
              <DataLine />
            </el-icon>
          </template>
        </el-empty>
      </div>
    </template>
  </el-card>
</template>

<style scoped lang="scss">
.production-chart {
  height: 100%;

  :deep(.el-card__body) {
    padding: 16px;
  }
}

.empty-chart {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

