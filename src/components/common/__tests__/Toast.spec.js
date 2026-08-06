import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Toast from '@/components/common/Toast.vue'
import { useToastStore } from '@/stores/toastStore'

describe('Toast.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders message when toast is visible', () => {
    const store = useToastStore()
    store.showToast('Data saved successfully', 'success', 0)

    const wrapper = mount(Toast, {
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Data saved successfully')
  })
})
