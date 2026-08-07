import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '@/components/common/Pagination.vue'

describe('Pagination.vue', () => {
  it('renders page information and page buttons correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 24,
        pageSize: 8,
      },
    })

    expect(wrapper.text()).toContain('Menampilkan 1-8 dari 24 lamaran')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })

  it('emits page-change when a page button is clicked', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 24,
        pageSize: 8,
      },
    })

    const buttons = wrapper.findAll('button')
    // Click page 2 button
    const page2Button = buttons.find(b => b.text() === '2')
    if (page2Button) {
      await page2Button.trigger('click')
      expect(wrapper.emitted('page-change')).toBeTruthy()
      expect(wrapper.emitted('page-change')[0]).toEqual([2])
    }
  })
})
