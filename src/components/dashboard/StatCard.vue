<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  icon: string
  color?: string
  status?: 'success' | 'warning' | 'danger' | 'info' | 'default'
  subtitle?: string
}>()

const cardClass = computed(() => {
  const classes = ['stat-card']
  if (props.status) {
    classes.push(`stat-card--${props.status}`)
  }
  return classes.join(' ')
})

const iconColor = computed(() => {
  if (props.color) return props.color

  switch (props.status) {
    case 'success': return '#67c23a'
    case 'warning': return '#e6a23c'
    case 'danger': return '#f56c6c'
    case 'info': return '#409eff'
    default: return '#909399'
  }
})
</script>

<template>
  <el-card shadow="hover" :class="cardClass">
    <div class="stat-card__content">
      <div class="stat-card__icon" :style="{ color: iconColor }">
        <el-icon :size="36">
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="stat-card__info">
        <div class="stat-card__value">{{ value }}</div>
        <div class="stat-card__label">{{ title }}</div>
        <div v-if="subtitle" class="stat-card__subtitle">{{ subtitle }}</div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.stat-card {
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__icon {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.05);
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__value {
    font-size: 32px;
    font-weight: 700;
    color: #303133;
    line-height: 1.2;
  }

  &__label {
    font-size: 14px;
    color: #606266;
    margin-top: 4px;
    font-weight: 500;
  }

  &__subtitle {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  // Status variants
  &--success {
    border-left: 4px solid #67c23a;

    .stat-card__icon {
      background: rgba(103, 194, 58, 0.1);
    }
  }

  &--warning {
    border-left: 4px solid #e6a23c;

    .stat-card__icon {
      background: rgba(230, 162, 60, 0.1);
    }
  }

  &--danger {
    border-left: 4px solid #f56c6c;

    .stat-card__icon {
      background: rgba(245, 108, 108, 0.1);
    }
  }

  &--info {
    border-left: 4px solid #409eff;

    .stat-card__icon {
      background: rgba(64, 158, 255, 0.1);
    }
  }
}
</style>

