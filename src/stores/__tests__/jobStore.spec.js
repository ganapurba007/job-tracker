import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import { jobService } from '@/services/jobService'

vi.mock('@/services/jobService', () => ({
  jobService: {
    getApplications: vi.fn(),
    createApplication: vi.fn(),
    updateApplication: vi.fn(),
    deleteApplication: vi.fn(),
    addStatusHistory: vi.fn(),
  },
}))

describe('jobStore', () => {
  const mockApplications = [
    {
      id: 1,
      company_name: 'TechCorp Indonesia',
      position: 'Frontend Engineer',
      applied_date: '2026-08-01',
      status_id: 2,
      platform_id: 1,
      histories: []
    },
    {
      id: 2,
      company_name: 'Nusantara Digital',
      position: 'Backend Developer',
      applied_date: '2026-07-25',
      status_id: 3,
      platform_id: 3,
      histories: []
    },
    {
      id: 3,
      company_name: 'Studio Design Pro',
      position: 'UI/UX Specialist',
      applied_date: '2026-08-03',
      status_id: 1,
      platform_id: 2,
      histories: []
    },
    {
      id: 4,
      company_name: 'Global Cloud',
      position: 'DevOps Engineer',
      applied_date: '2026-08-05',
      status_id: 5,
      platform_id: 4,
      histories: []
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    jobService.getApplications.mockResolvedValue([...mockApplications])
    jobService.createApplication.mockImplementation((data) => Promise.resolve({ id: 5, ...data }))
    jobService.updateApplication.mockImplementation((id, data) => Promise.resolve({ id, ...data }))
    jobService.deleteApplication.mockResolvedValue(true)
    jobService.addStatusHistory.mockResolvedValue(true)

    const refStore = useReferenceStore()
    refStore.statuses = [
      { id: 1, name: 'Telah Dilamar' },
      { id: 2, name: 'Wawancara' },
      { id: 3, name: 'Dapat Penawaran' },
      { id: 4, name: 'Ditolak' },
      { id: 5, name: 'Wishlist' },
    ]
    refStore.platforms = [
      { id: 1, name: 'LinkedIn' },
      { id: 2, name: 'JobStreet' },
      { id: 3, name: 'Glints' },
      { id: 4, name: 'Kalibrr' },
    ]
  })

  it('starts with empty applications array', () => {
    const store = useJobStore()
    expect(store.applications).toEqual([])
  })

  it('filters applications by search query', () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    store.setSearchQuery('TechCorp')
    expect(store.filteredApplications.length).toBe(1)
    expect(store.filteredApplications[0].company_name).toBe('TechCorp Indonesia')
  })

  it('filters applications by status_id and platform_id', () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    store.setFilterStatus(2)
    expect(store.filteredApplications.every((app) => app.status_id === 2)).toBe(true)

    store.resetFilters()
    store.setFilterPlatform(3)
    expect(store.filteredApplications.every((app) => app.platform_id === 3)).toBe(true)
  })

  it('sorts applications by date latest and oldest', () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    store.setSortBy('latest')
    const firstDateLatest = new Date(store.filteredApplications[0].applied_date).getTime()
    const lastDateLatest = new Date(store.filteredApplications[store.filteredApplications.length - 1].applied_date).getTime()
    expect(firstDateLatest).toBeGreaterThanOrEqual(lastDateLatest)

    store.setSortBy('oldest')
    const firstDateOldest = new Date(store.filteredApplications[0].applied_date).getTime()
    const lastDateOldest = new Date(store.filteredApplications[store.filteredApplications.length - 1].applied_date).getTime()
    expect(firstDateOldest).toBeLessThanOrEqual(lastDateOldest)
  })

  it('calculates total count, response rate, and breakdown charts analytics', () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    expect(store.totalApplicationsCount).toBe(4)
    expect(store.responseRatePercent).toBe(50) // 2 responded out of 4 = 50%
    expect(store.statusBreakdownData.labels.length).toBeGreaterThan(0)
    expect(store.platformBreakdownData.labels.length).toBeGreaterThan(0)
  })

  it('adds a new application', async () => {
    const store = useJobStore()
    store.applications = [...mockApplications]

    const newAppPayload = {
      company_name: 'New Company',
      position: 'Backend Developer',
      status_id: 1,
      platform_id: 1,
      applied_date: '2026-08-06',
    }

    jobService.getApplications.mockResolvedValueOnce([newAppPayload, ...mockApplications])

    await store.addApplication(newAppPayload)

    expect(jobService.createApplication).toHaveBeenCalled()
    expect(store.applications.length).toBe(5)
  })

  it('updates an existing application', async () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    const target = store.applications[0]

    await store.updateApplication(target.id, {
      company_name: 'Updated Company Name',
      position: target.position,
      status_id: target.status_id,
      platform_id: target.platform_id,
      applied_date: target.applied_date,
    })

    expect(jobService.updateApplication).toHaveBeenCalled()
  })

  it('deletes an application', async () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    const targetId = store.applications[0].id

    jobService.getApplications.mockResolvedValueOnce(mockApplications.filter(a => a.id !== targetId))

    await store.deleteApplication(targetId)

    expect(jobService.deleteApplication).toHaveBeenCalledWith(targetId)
    expect(store.applications.length).toBe(3)
  })

  it('adds status history and updates current status', async () => {
    const store = useJobStore()
    store.applications = [...mockApplications]
    const target = store.applications[0]

    await store.addStatusHistory(target.id, {
      status_id: 3,
      created_at: '2026-08-06',
      notes: 'Received offer!',
    })

    expect(jobService.addStatusHistory).toHaveBeenCalledWith(target.id, expect.anything())
  })
})
