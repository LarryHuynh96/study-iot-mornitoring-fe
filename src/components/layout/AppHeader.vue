<script setup lang="ts">
defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <div class="app-header">
    <div class="app-header__left">
      <el-button
        text
        @click="$emit('toggle-sidebar')"
      >
        <el-icon :size="20">
          <el-icon-fold v-if="!collapsed" />
          <el-icon-expand v-else />
        </el-icon>
      </el-button>
    </div>
    <div class="app-header__right">
      <span class="app-header__title">Sewing Machine IoT Monitoring</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;

  &__left {
    display: flex;
    align-items: center;
  }

  &__right {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 14px;
    color: #606266;
  }
}
</style>
