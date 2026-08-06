import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login({ email, password })
      // Support backend payload formats: { token, user } or { data: { token, user } }
      const responseToken = data.token || data.access_token || (data.data && data.data.token)
      const responseUser = data.user || (data.data && data.data.user) || { email }
      setAuth(responseToken, responseUser)
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Gagal melakukan login'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  async function demoLogin() {
    loading.value = true
    error.value = null
    try {
      // Try API login with credentials test@example.com and password
      const data = await authService.login({
        email: 'test@example.com',
        password: 'password',
      })
      const responseToken = data.token || data.access_token || (data.data && data.data.token)
      const responseUser = data.user || (data.data && data.data.user) || { id: 1, name: 'Test User', email: 'test@example.com' }
      setAuth(responseToken, responseUser)
      return data
    } catch (err) {
      // Fallback for demo login if API is unreachable
      const demoToken = 'demo-sanctum-token-123456789'
      const demoUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      }
      setAuth(demoToken, demoUser)
      return { token: demoToken, user: demoUser }
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.register(payload)
      const responseToken = data.token || data.access_token || (data.data && data.data.token)
      const responseUser = data.user || (data.data && data.data.user) || { name: payload.name, email: payload.email }
      if (responseToken) {
        setAuth(responseToken, responseUser)
      }
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Gagal melakukan registrasi'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      if (token.value && !token.value.startsWith('demo-')) {
        await authService.logout().catch(() => {})
      }
    } finally {
      setAuth('', null)
      loading.value = false
    }
  }

  function initAuth() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (e) {
        user.value = null
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    demoLogin,
    register,
    logout,
    initAuth,
  }
})
