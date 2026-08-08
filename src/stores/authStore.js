import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)
  const isAuthenticating = ref(false)
  const authMode = ref('')
  const authMessage = ref('')
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
    isAuthenticating.value = true
    authMode.value = 'login'
    authMessage.value = 'Mengverifikasi data kredensial Anda...'
    error.value = null

    try {
      const data = await authService.login({ email, password })
      const responseToken = data.token || data.access_token || (data.data && data.data.token)
      const responseUser = data.user || (data.data && data.data.user) || { email }

      authMessage.value = 'Login berhasil! Menyiapkan Dashboard...'
      await new Promise(resolve => setTimeout(resolve, 600))

      setAuth(responseToken, responseUser)
      return data
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Gagal melakukan login'
      error.value = message
      throw new Error(message)
    } finally {
      loading.value = false
      isAuthenticating.value = false
    }
  }

  async function demoLogin() {
    loading.value = true
    isAuthenticating.value = true
    authMode.value = 'demo'
    authMessage.value = 'Menyiapkan akun Demo Test...'
    error.value = null

    try {
      let data
      try {
        data = await authService.login({
          email: 'test@example.com',
          password: 'password',
        })
      } catch (err) {
        data = {
          token: 'demo-sanctum-token-123456789',
          user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'user' },
        }
      }

      const responseToken = data.token || data.access_token || (data.data && data.data.token) || 'demo-token'
      const responseUser = data.user || (data.data && data.data.user) || { id: 1, name: 'Test User', email: 'test@example.com' }

      authMessage.value = 'Akun Demo siap! Mengakses data lamaran...'
      await new Promise(resolve => setTimeout(resolve, 600))

      setAuth(responseToken, responseUser)
      return data
    } catch (err) {
      setAuth('demo-token', { id: 1, name: 'Test User', email: 'test@example.com' })
    } finally {
      loading.value = false
      isAuthenticating.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    isAuthenticating.value = true
    authMode.value = 'register'
    authMessage.value = 'Mendaftarkan akun baru Anda...'
    error.value = null

    try {
      const data = await authService.register(payload)
      const responseToken = data.token || data.access_token || (data.data && data.data.token)
      const responseUser = data.user || (data.data && data.data.user) || { name: payload.name, email: payload.email }

      authMessage.value = 'Pendaftaran berhasil! Mengalihkan...'
      await new Promise(resolve => setTimeout(resolve, 600))

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
      isAuthenticating.value = false
    }
  }

  async function logout() {
    loading.value = true
    isAuthenticating.value = true
    authMode.value = 'logout'
    authMessage.value = 'Sedang mengakhiri sesi login...'

    try {
      if (token.value && !token.value.startsWith('demo-')) {
        await authService.logout().catch(() => {})
      }
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setAuth('', null)
      loading.value = false
      isAuthenticating.value = false
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
    isAuthenticating,
    authMode,
    authMessage,
    error,
    isAuthenticated,
    login,
    demoLogin,
    register,
    logout,
    initAuth,
  }
})
