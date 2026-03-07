<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const route = useRoute()

const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <el-container class="app-layout">
    <el-aside :width="isCollapsed ? '64px' : '220px'">
      <AppSidebar :collapsed="isCollapsed" />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader :collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
      </el-header>
      <el-main>
        <router-view :key="route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  padding: 0;
  height: 56px;
  line-height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}
</style>
