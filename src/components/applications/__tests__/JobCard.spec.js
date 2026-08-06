import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JobCard from '@/components/applications/JobCard.vue'

describe('JobCard.vue', () => {
  it('renders application details correctly', () => {
    const mockApp = {
      id: 1,
      company_name: 'TechCorp Indonesia',
      position: 'Frontend Engineer',
      applied_at: '2026-08-01',
      status: { name: 'Wawancara', color: '#44A1A4' },
      platform: { name: 'LinkedIn', label: 'LinkedIn' },
      notes: 'Test note',
    }

    const wrapper = mount(JobCard, {
      props: {
        application: mockApp,
      },
      global: {
        stubs: ['router-link'],
      },
    })

    expect(wrapper.text()).toContain('Frontend Engineer')
    expect(wrapper.text()).toContain('TechCorp Indonesia')
    expect(wrapper.text()).toContain('Wawancara')
    expect(wrapper.text()).toContain('LinkedIn')
  })
})
