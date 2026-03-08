import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export interface AuthUser {
  id: number
  username: string
  is_staff: boolean
}

export interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

interface RefreshResponse {
  access_token: string
  token_type: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setTokens(access: string, refresh?: string) {
    accessToken.value = access
    localStorage.setItem('access_token', access)
    if (refresh) {
      refreshToken.value = refresh
      localStorage.setItem('refresh_token', refresh)
    }
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  async function login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
    setTokens(data.access_token, data.refresh_token)
    await fetchUser()
  }

  async function fetchUser() {
    const { data } = await api.get<AuthUser>('/api/auth/me')
    user.value = data
  }

  async function refresh(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const { data } = await api.post<RefreshResponse>('/api/auth/refresh', {
        refresh_token: refreshToken.value,
      })
      setTokens(data.access_token)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    clearAuth()
  }

  async function initialize() {
    if (!accessToken.value) return false
    try {
      await fetchUser()
      return true
    } catch {
      const refreshed = await refresh()
      if (refreshed) {
        try {
          await fetchUser()
          return true
        } catch {
          clearAuth()
          return false
        }
      }
      clearAuth()
      return false
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    fetchUser,
    refresh,
    logout,
    clearAuth,
    initialize,
  }
})
