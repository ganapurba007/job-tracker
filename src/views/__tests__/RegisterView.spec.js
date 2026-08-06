import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterView from '@/views/RegisterView.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('RegisterView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    mockPush.mockClear()
  })

  it('renders register form correctly', () => {
    const wrapper = mount(RegisterView, {
      global: {
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('Buat Akun Baru')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
  })

  it('validates password mismatch on register submit', async () => {
    const wrapper = mount(RegisterView, {
      global: {
        stubs: ['router-link'],
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Jane Doe')
    await inputs[1].setValue('jane@example.com')
    await inputs[2].setValue('password123')
    await inputs[3].setValue('differentpass')

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Konfirmasi password tidak cocok')
  })
})
