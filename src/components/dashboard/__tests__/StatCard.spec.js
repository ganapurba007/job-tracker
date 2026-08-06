import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '@/components/dashboard/StatCard.vue'

describe('StatCard.vue', () => {
  it('renders title, value, and subtitle props', () => {
    const wrapper = mount(StatCard, {
      props: {
        title: 'Total Applications',
        value: 12,
        subtitle: 'Applications submitted',
        badgeText: 'Active',
      },
    })

    expect(wrapper.text()).toContain('Total Applications')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('Applications submitted')
    expect(wrapper.text()).toContain('Active')
  })
})
