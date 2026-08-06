import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import JobFormModal from '@/components/applications/JobFormModal.vue'

describe('JobFormModal.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('validates empty inputs on submit', async () => {
    const wrapper = mount(JobFormModal, {
      props: {
        show: true,
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Nama perusahaan wajib diisi')
    expect(wrapper.text()).toContain('Posisi pekerjaan wajib diisi')
  })
})
