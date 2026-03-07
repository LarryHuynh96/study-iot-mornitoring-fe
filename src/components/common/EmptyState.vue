<script setup lang="ts">
defineProps<{
  description?: string
}>()
</script>

<template>
  <el-empty :description="description || 'No data available'" />
</template>
