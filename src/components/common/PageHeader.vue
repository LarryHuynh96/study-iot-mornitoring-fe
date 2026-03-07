<script setup lang="ts">
defineProps<{
  title: string
  breadcrumbs?: { label: string; to?: string }[]
}>()
</script>

<template>
  <div class="page-header">
    <h2 class="page-header__title">{{ title }}</h2>
    <el-breadcrumb v-if="breadcrumbs?.length" separator="/" class="page-header__breadcrumb">
      <el-breadcrumb-item
        v-for="(crumb, i) in breadcrumbs"
        :key="i"
        :to="crumb.to ? { path: crumb.to } : undefined"
      >
        {{ crumb.label }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
