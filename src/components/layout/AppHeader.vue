<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    await ElMessageBox.confirm('Are you sure you want to logout?', 'Confirm Logout', {
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })

    authStore.logout()
    ElMessage.success('Logged out successfully')
    router.push('/login')
  } catch {
    // User cancelled
  }
}
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
    <div class="app-header__center">
      <span class="app-header__title">Sewing Machine IoT Monitoring</span>
    </div>
    <div class="app-header__right">
      <div class="user-info">
        <el-icon :size="16" style="margin-right: 4px;">
          <el-icon-user />
        </el-icon>
        <span class="username">{{ authStore.user?.username || 'User' }}</span>
      </div>
      <el-button
        text
        type="danger"
        @click="handleLogout"
      >
        <el-icon :size="16" style="margin-right: 4px;">
          <el-icon-switch-button />
        </el-icon>
        Logout
      </el-button>
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
    flex: 0 0 auto;
  }

  &__center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 0 0 auto;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 4px;

  .username {
    font-size: 14px;
    color: #606266;
  }
}
</style>
