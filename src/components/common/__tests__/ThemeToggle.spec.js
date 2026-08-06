import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useThemeStore } from '@/stores/themeStore'

describe('ThemeToggle.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renders button element correctly', () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
  })

  it('toggles theme store state on button click', async () => {
    const wrapper = mount(ThemeToggle)
    const store = useThemeStore()
    expect(store.isDark).toBe(false)

    await wrapper.find('button').trigger('click')
    expect(store.isDark).toBe(true)
  })
})
