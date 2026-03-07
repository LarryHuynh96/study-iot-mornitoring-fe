<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
  icon: string
  color?: string
}>()
</script>

<template>
  <el-card shadow="hover" class="stat-card">
    <div class="stat-card__icon" :style="{ color: color || '#409eff' }">
      <el-icon :size="32">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="stat-card__value">{{ value }}</div>
    <div class="stat-card__label">{{ title }}</div>
  </el-card>
</template>
