import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundView from '@/views/NotFoundView.vue'

describe('NotFoundView.vue', () => {
  it('renders 404 header and return to dashboard button', () => {
    const wrapper = mount(NotFoundView, {
      global: {
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Halaman Tidak Ditemukan')
  })
})
