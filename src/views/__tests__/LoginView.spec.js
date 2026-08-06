import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginView from '@/views/LoginView.vue'
import Button from '@/components/common/Button.vue'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn(),
  },
}))

describe('LoginView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    mockPush.mockClear()
    vi.clearAllMocks()
  })

  it('renders login form and 1-click demo button', () => {
    const wrapper = mount(LoginView, {
      global: {
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('Selamat Datang Kembali')
    expect(wrapper.text()).toContain('1 Click Demo Login')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('shows inline validation error on empty submit', async () => {
    const wrapper = mount(LoginView, {
      global: {
        stubs: ['router-link'],
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Email tidak boleh kosong')
    expect(wrapper.text()).toContain('Password tidak boleh kosong')
  })

  it('triggers demo login and redirects to dashboard', async () => {
    authService.login.mockResolvedValueOnce({
      token: 'demo-token-123',
      user: { name: 'Demo Visitor', email: 'demo@example.com' },
    })

    const wrapper = mount(LoginView, {
      global: {
        stubs: ['router-link'],
      },
    })

    const authStore = useAuthStore()
    const demoBtnComp = wrapper.findAllComponents(Button).find((c) => c.text().includes('1 Click Demo Login'))
    expect(demoBtnComp).toBeDefined()

    await demoBtnComp.trigger('click')
    await flushPromises()
    expect(authStore.isAuthenticated).toBe(true)
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
