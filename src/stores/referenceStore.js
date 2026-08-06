import { defineStore } from 'pinia'
import { ref } from 'vue'
import { referenceService } from '@/services/referenceService'

export const useReferenceStore = defineStore('reference', () => {
  const statuses = ref([
    { id: 1, name: 'Telah Dilamar', color: '#325E6A' },
    { id: 2, name: 'Wawancara', color: '#44A1A4' },
    { id: 3, name: 'Dapat Penawaran', color: '#FF9A00' },
    { id: 4, name: 'Ditolak', color: '#DC2626' },
    { id: 5, name: 'Wishlist', color: '#6B7280' },
  ])

  const platforms = ref([
    { id: 1, name: 'LinkedIn', label: 'LinkedIn' },
    { id: 2, name: 'JobStreet', label: 'JobStreet' },
    { id: 3, name: 'Glints', label: 'Glints' },
    { id: 4, name: 'Kalibrr', label: 'Kalibrr' },
    { id: 5, name: 'Company Website', label: 'Company Website' },
  ])

  const loading = ref(false)
  const isFetched = ref(false)

  async function fetchReferences() {
    if (isFetched.value) return
    loading.value = true
    try {
      const [resStatuses, resPlatforms] = await Promise.all([
        referenceService.getStatuses().catch(() => null),
        referenceService.getPlatforms().catch(() => null),
      ])

      if (resStatuses) {
        const statusList = Array.isArray(resStatuses) ? resStatuses : (resStatuses.data || resStatuses)
        if (statusList && statusList.length) statuses.value = statusList
      }

      if (resPlatforms) {
        const platformList = Array.isArray(resPlatforms) ? resPlatforms : (resPlatforms.data || resPlatforms)
        if (platformList && platformList.length) {
          platforms.value = platformList.map(p => ({
            ...p,
            label: p.label || p.name,
          }))
        }
      }

      isFetched.value = true
    } catch (e) {
      // Use fallback defaults
    } finally {
      loading.value = false
    }
  }

  return {
    statuses,
    platforms,
    loading,
    isFetched,
    fetchReferences,
  }
})
