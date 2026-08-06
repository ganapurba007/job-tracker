import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJobStore } from '@/stores/jobStore'
import { jobService } from '@/services/jobService'

vi.mock('@/services/jobService', () => ({
  jobService: {
    getApplications: vi.fn(),
  },
}))

describe('jobStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('filters applications by search query', () => {
    const store = useJobStore()
    store.setSearchQuery('TechCorp')
    expect(store.filteredApplications.length).toBe(1)
    expect(store.filteredApplications[0].company_name).toBe('TechCorp Indonesia')
  })

  it('filters applications by status_id and platform_id', () => {
    const store = useJobStore()
    store.setFilterStatus(2)
    expect(store.filteredApplications.every((app) => app.status_id === 2)).toBe(true)

    store.resetFilters()
    store.setFilterPlatform(3)
    expect(store.filteredApplications.every((app) => app.platform_id === 3)).toBe(true)
  })

  it('sorts applications by date latest and oldest', () => {
    const store = useJobStore()
    store.setSortBy('latest')
    const firstDateLatest = new Date(store.filteredApplications[0].applied_at).getTime()
    const lastDateLatest = new Date(store.filteredApplications[store.filteredApplications.length - 1].applied_at).getTime()
    expect(firstDateLatest).toBeGreaterThanOrEqual(lastDateLatest)

    store.setSortBy('oldest')
    const firstDateOldest = new Date(store.filteredApplications[0].applied_at).getTime()
    const lastDateOldest = new Date(store.filteredApplications[store.filteredApplications.length - 1].applied_at).getTime()
    expect(firstDateOldest).toBeLessThanOrEqual(lastDateOldest)
  })
})
