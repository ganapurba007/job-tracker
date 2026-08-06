import { defineStore } from 'pinia'
import { ref } from 'vue'
import { referenceService } from '@/services/referenceService'

export const useReferenceStore = defineStore('reference', () => {
  const statuses = ref([])
  const platforms = ref([])

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
        if (statusList) {
          statuses.value = statusList
        }
      }

      if (resPlatforms) {
        const platformList = Array.isArray(resPlatforms) ? resPlatforms : (resPlatforms.data || resPlatforms)
        if (platformList) {
          platforms.value = platformList.map(p => ({
            ...p,
            label: p.label || p.name,
          }))
        }
      }

      isFetched.value = true
    } catch (e) {
      statuses.value = []
      platforms.value = []
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
