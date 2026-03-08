<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const errorMsg = ref('')

const loginForm = reactive({
  username: '',
  password: '',
})

const rules: FormRules = {
  username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  errorMsg.value = ''
  loading.value = true
  try {
    await authStore.login(loginForm)
    router.push('/')
  } catch (error: any) {
    errorMsg.value =
      error.response?.data?.detail || error.response?.data?.message || 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__header">
        <div class="login-card__icon">
          <el-icon :size="32" color="#fff">
            <el-icon-cpu />
          </el-icon>
        </div>
        <h1 class="login-card__title">IoT Monitoring</h1>
        <p class="login-card__subtitle">Sign in to your account</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-card__form"
        @submit.prevent="handleLogin"
      >
        <Transition name="fade">
          <div v-if="errorMsg" class="login-card__error">
            <el-icon :size="16"><el-icon-connection /></el-icon>
            {{ errorMsg }}
          </div>
        </Transition>

        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="Username"
            size="large"
            :disabled="loading"
            clearable
          >
            <template #prefix>
              <el-icon><el-icon-user /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            size="large"
            :disabled="loading"
            show-password
          >
            <template #prefix>
              <el-icon><el-icon-connection /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            :disabled="loading"
            class="login-card__submit"
            native-type="submit"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-card__footer">
        <p>Default: <code>admin</code> / <code>password</code></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  margin: 24px;
  padding: 40px 32px 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);

  &__header {
    text-align: center;
    margin-bottom: 32px;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    margin-bottom: 16px;
  }

  &__title {
    margin: 0 0 4px;
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    letter-spacing: -0.02em;
  }

  &__subtitle {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
  }

  &__form {
    :deep(.el-form-item) {
      margin-bottom: 20px;
    }

    :deep(.el-input__wrapper) {
      border-radius: 8px;
      box-shadow: 0 0 0 1px #d1d5db inset;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 0 0 1px #9ca3af inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 2px #6366f1 inset;
      }
    }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
  }

  &__submit {
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  &__footer {
    text-align: center;
    margin-top: 8px;
    padding-top: 20px;
    border-top: 1px solid #f3f4f6;

    p {
      margin: 0;
      font-size: 12px;
      color: #9ca3af;
    }

    code {
      padding: 1px 5px;
      font-size: 12px;
      background: #f3f4f6;
      border-radius: 4px;
      color: #6b7280;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
