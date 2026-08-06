import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn(),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts unauthenticated when localStorage is empty', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
  })

  it('logs in successfully and persists token', async () => {
    authService.login.mockResolvedValueOnce({
      token: 'mock-token-abc',
      user: { name: 'John Doe', email: 'john@example.com' },
    })

    const store = useAuthStore()
    await store.login('john@example.com', 'password123')

    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBe('mock-token-abc')
    expect(store.user.name).toBe('John Doe')
    expect(localStorage.getItem('token')).toBe('mock-token-abc')
  })

  it('handles demo login fallback cleanly', async () => {
    authService.login.mockRejectedValueOnce(new Error('Network Error'))

    const store = useAuthStore()
    await store.demoLogin()

    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toContain('demo-sanctum-token')
    expect(store.user.email).toBe('demo@example.com')
  })

  it('logs out and clears localStorage', async () => {
    const store = useAuthStore()
    store.token = 'demo-token'
    store.user = { name: 'Demo' }
    localStorage.setItem('token', 'demo-token')

    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBe('')
    expect(localStorage.getItem('token')).toBeNull()
  })
})
