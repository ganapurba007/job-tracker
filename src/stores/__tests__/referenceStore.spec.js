import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useReferenceStore } from '@/stores/referenceStore'
import { referenceService } from '@/services/referenceService'

vi.mock('@/services/referenceService', () => ({
  referenceService: {
    getStatuses: vi.fn(),
    getPlatforms: vi.fn(),
  },
}))

describe('referenceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with empty initial statuses and platforms', () => {
    const store = useReferenceStore()
    expect(store.statuses).toEqual([])
    expect(store.platforms).toEqual([])
  })

  it('fetches reference data from API and caches it', async () => {
    referenceService.getStatuses.mockResolvedValueOnce([
      { id: 1, name: 'Applied', color: '#123456' },
    ])
    referenceService.getPlatforms.mockResolvedValueOnce([
      { id: 1, name: 'LinkedIn' },
    ])

    const store = useReferenceStore()
    await store.fetchReferences()

    expect(store.statuses[0].name).toBe('Applied')
    expect(store.platforms[0].name).toBe('LinkedIn')
    expect(store.isFetched).toBe(true)

    // Second call should hit cache without calling API again
    await store.fetchReferences()
    expect(referenceService.getStatuses).toHaveBeenCalledTimes(1)
  })
})
