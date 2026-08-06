import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/common/Modal.vue'

describe('Modal.vue', () => {
  it('renders modal title and slot content when show is true', () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal Header',
      },
      slots: {
        default: '<div id="modal-content">Body Content</div>',
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    expect(wrapper.text()).toContain('Test Modal Header')
    expect(wrapper.html()).toContain('Body Content')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        show: true,
        title: 'Test Modal',
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    const closeBtn = wrapper.find('button[aria-label="Tutup modal"]')
    expect(closeBtn.exists()).toBe(true)

    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
