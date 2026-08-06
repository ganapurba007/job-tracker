import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJobStore } from '@/stores/jobStore'
import { jobService } from '@/services/jobService'

vi.mock('@/services/jobService', () => ({
  jobService: {
    getApplications: vi.fn(),
    createApplication: vi.fn(),
    updateApplication: vi.fn(),
    deleteApplication: vi.fn(),
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

  it('adds a new application', async () => {
    const store = useJobStore()
    const initialCount = store.applications.length

    await store.addApplication({
      company_name: 'New Company',
      position: 'Backend Developer',
      status_id: 1,
      platform_id: 1,
      applied_at: '2026-08-06',
    })

    expect(store.applications.length).toBe(initialCount + 1)
    expect(store.applications[0].company_name).toBe('New Company')
  })

  it('updates an existing application', async () => {
    const store = useJobStore()
    const target = store.applications[0]

    await store.updateApplication(target.id, {
      company_name: 'Updated Company Name',
      position: target.position,
      status_id: target.status_id,
      platform_id: target.platform_id,
      applied_at: target.applied_at,
    })

    expect(store.applications[0].company_name).toBe('Updated Company Name')
  })

  it('deletes an application', async () => {
    const store = useJobStore()
    const targetId = store.applications[0].id
    const initialCount = store.applications.length

    await store.deleteApplication(targetId)

    expect(store.applications.length).toBe(initialCount - 1)
    expect(store.applications.find((a) => a.id === targetId)).toBeUndefined()
  })
})
