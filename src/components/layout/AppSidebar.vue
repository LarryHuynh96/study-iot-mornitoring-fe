<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

const route = useRoute()
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <span v-if="!collapsed" class="sidebar__logo-text">IoT Monitor</span>
      <span v-else class="sidebar__logo-text">IoT</span>
    </div>
    <el-menu
      :default-active="route.path"
      :collapse="collapsed"
      router
      background-color="#001529"
      text-color="#ffffffa6"
      active-text-color="#ffffff"
    >
      <el-menu-item index="/">
        <el-icon><el-icon-odometer /></el-icon>
        <template #title>Dashboard</template>
      </el-menu-item>
      <el-menu-item index="/machines">
        <el-icon><el-icon-cpu /></el-icon>
        <template #title>Machines</template>
      </el-menu-item>
      <el-menu-item index="/mappings">
        <el-icon><el-icon-connection /></el-icon>
        <template #title>Mappings</template>
      </el-menu-item>
      <el-menu-item index="/production">
        <el-icon><el-icon-document /></el-icon>
        <template #title>Production</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__logo {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #ffffff1a;
  }

  &__logo-text {
    white-space: nowrap;
    overflow: hidden;
  }

  .el-menu {
    border-right: none;
    flex: 1;
  }
}
</style>
