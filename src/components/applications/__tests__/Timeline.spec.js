import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline from '@/components/applications/Timeline.vue'

describe('Timeline.vue', () => {
  it('renders history items with status badge and notes', () => {
    const mockHistories = [
      {
        id: 1,
        status: { name: 'Telah Dilamar', color: '#325E6A' },
        created_at: '2026-08-01',
        notes: 'CV submitted',
      },
      {
        id: 2,
        status: { name: 'Wawancara', color: '#44A1A4' },
        created_at: '2026-08-04',
        notes: 'Interview scheduled',
      },
    ]

    const wrapper = mount(Timeline, {
      props: { histories: mockHistories },
    })

    expect(wrapper.text()).toContain('Riwayat Perubahan Status')
    expect(wrapper.text()).toContain('Telah Dilamar')
    expect(wrapper.text()).toContain('Wawancara')
    expect(wrapper.text()).toContain('CV submitted')
    expect(wrapper.text()).toContain('Interview scheduled')
  })
})
