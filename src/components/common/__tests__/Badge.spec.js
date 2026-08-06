import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '@/components/common/Badge.vue'

describe('Badge.vue', () => {
  it('renders badge text in ucfirst and custom color props', () => {
    const wrapper = mount(Badge, {
      props: {
        text: 'wawancara',
        color: '#44A1A4',
      },
    })

    expect(wrapper.text()).toContain('Wawancara')
    expect(wrapper.props().color).toBe('#44A1A4')
    const style = wrapper.attributes('style')
    expect(style).toContain('68, 161, 164')
  })
})
