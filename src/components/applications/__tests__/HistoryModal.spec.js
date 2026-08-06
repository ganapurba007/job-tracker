import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HistoryModal from '@/components/applications/HistoryModal.vue'

describe('HistoryModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders status update modal when show is true', () => {
    const wrapper = mount(HistoryModal, {
      props: {
        show: true,
        applicationId: 1,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Update Status Lamaran')
    expect(wrapper.find('input[type="date"]').exists()).toBe(true)
  })
})
