import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jobService } from '@/services/jobService'
import { useReferenceStore } from '@/stores/referenceStore'
import { useAuthStore } from '@/stores/authStore'

export const useJobStore = defineStore('job', () => {
  const applications = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Filters & Sorting state
  const searchQuery = ref('')
  const selectedStatus = ref('')
  const selectedPlatform = ref('')
  const sortBy = ref('latest')

  const userApplications = computed(() => {
    const authStore = useAuthStore()
    const currentUserId = authStore.user?.id
    if (!currentUserId) return applications.value
    return applications.value.filter(app => !app.user_id || String(app.user_id) === String(currentUserId))
  })

  const filteredApplications = computed(() => {
    let result = [...userApplications.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(app =>
        (app.company_name && app.company_name.toLowerCase().includes(q)) ||
        (app.position && app.position.toLowerCase().includes(q))
      )
    }

    if (selectedStatus.value) {
      result = result.filter(app => String(app.status_id) === String(selectedStatus.value))
    }

    if (selectedPlatform.value) {
      result = result.filter(app => String(app.platform_id) === String(selectedPlatform.value))
    }

    result.sort((a, b) => {
      const dateA = new Date(a.applied_date || a.applied_date || 0).getTime()
      const dateB = new Date(b.applied_date || b.applied_date || 0).getTime()
      return sortBy.value === 'latest' ? dateB - dateA : dateA - dateB
    })

    return result
  })

  // Analytics KPI Getters (scoped to logged in user)
  const totalApplicationsCount = computed(() => userApplications.value.length)

  const responseRatePercent = computed(() => {
    if (!userApplications.value.length) return 0
    // Responded means status is not initial 'Applied' (1) and not 'Wishlist' (5)
    const responded = userApplications.value.filter(a => Number(a.status_id) !== 1 && Number(a.status_id) !== 5)
    return Math.round((responded.length / userApplications.value.length) * 100)
  })

  const statusBreakdownData = computed(() => {
    const refStore = useReferenceStore()
    const counts = {}
    refStore.statuses.forEach(s => { counts[s.id] = 0 })

    userApplications.value.forEach(app => {
      const sId = app.status_id
      if (sId) counts[sId] = (counts[sId] || 0) + 1
    })

    const labels = refStore.statuses.map(s => s.name ? (s.name.charAt(0).toUpperCase() + s.name.slice(1)) : '')
    const data = refStore.statuses.map(s => counts[s.id] || 0)
    const backgroundColor = refStore.statuses.map(s => s.color || '#325E6A')

    return { labels, data, backgroundColor }
  })

  const platformBreakdownData = computed(() => {
    const refStore = useReferenceStore()
    const counts = {}
    refStore.platforms.forEach(p => { counts[p.id] = 0 })

    userApplications.value.forEach(app => {
      const pId = app.platform_id
      if (pId) counts[pId] = (counts[pId] || 0) + 1
    })

    const labels = refStore.platforms.map(p => p.label || p.name)
    const data = refStore.platforms.map(p => counts[p.id] || 0)

    return { labels, data }
  })

  async function fetchApplications() {
    loading.value = true
    error.value = null
    const authStore = useAuthStore()
    const currentUserId = authStore.user?.id

    try {
      const data = await jobService.getApplications(currentUserId ? { user_id: currentUserId } : {})
      const apiList = Array.isArray(data) ? data : (data.data || data)
      if (apiList) {
        if (currentUserId) {
          applications.value = apiList.filter(app => !app.user_id || String(app.user_id) === String(currentUserId))
        } else {
          applications.value = apiList
        }
      } else {
        applications.value = []
      }
    } catch (err) {
      applications.value = []
      error.value = err?.response?.data?.message || 'Gagal mengambil data dari API'
    } finally {
      loading.value = false
    }
  }

  async function addApplication(payload) {
    loading.value = true
    error.value = null
    const refStore = useReferenceStore()
    const authStore = useAuthStore()
    const currentUserId = authStore.user?.id

    const finalPayload = {
      ...payload,
      ...(currentUserId ? { user_id: currentUserId } : {}),
    }

    const foundStatus = refStore.statuses.find(s => String(s.id) === String(payload.status_id)) || { id: payload.status_id, name: 'Status', color: '#325E6A' }
    const foundPlatform = refStore.platforms.find(p => String(p.id) === String(payload.platform_id)) || { id: payload.platform_id, name: 'Platform' }

    try {
      const res = await jobService.createApplication(finalPayload)
      const newApp = res.data || res
      applications.value.unshift(newApp)
      return newApp
    } catch (err) {
      const newApp = {
        id: Date.now(),
        ...finalPayload,
        status: foundStatus,
        platform: foundPlatform,
        histories: [
          {
            id: Date.now(),
            status: foundStatus,
            created_at: payload.applied_date || payload.applied_date || new Date().toISOString().split('T')[0],
            notes: payload.notes || 'Catatan awal lamaran'
          }
        ]
      }
      applications.value.unshift(newApp)
      return newApp
    } finally {
      loading.value = false
    }
  }

  async function updateApplication(id, payload) {
    loading.value = true
    error.value = null
    const refStore = useReferenceStore()
    const foundStatus = refStore.statuses.find(s => String(s.id) === String(payload.status_id))
    const foundPlatform = refStore.platforms.find(p => String(p.id) === String(payload.platform_id))

    try {
      const res = await jobService.updateApplication(id, payload)
      const updated = res.data || res
      const idx = applications.value.findIndex(a => String(a.id) === String(id))
      if (idx !== -1) {
        applications.value[idx] = { ...applications.value[idx], ...updated }
      }
      return updated
    } catch (err) {
      const idx = applications.value.findIndex(a => String(a.id) === String(id))
      if (idx !== -1) {
        const existing = applications.value[idx]
        const updated = {
          ...existing,
          ...payload,
          status: foundStatus || existing.status,
          platform: foundPlatform || existing.platform,
        }
        applications.value[idx] = updated
        return updated
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id) {
    loading.value = true
    error.value = null
    try {
      await jobService.deleteApplication(id)
    } catch (err) {
      // Local fallback
    } finally {
      applications.value = applications.value.filter(a => String(a.id) !== String(id))
      loading.value = false
    }
  }

  async function addStatusHistory(applicationId, payload) {
    loading.value = true
    error.value = null
    const refStore = useReferenceStore()
    const foundStatus = refStore.statuses.find(s => String(s.id) === String(payload.status_id)) || { id: payload.status_id, name: 'Status Baru', color: '#44A1A4' }

    try {
      await jobService.addStatusHistory(applicationId, payload)
    } catch (err) {
      // Local fallback
    } finally {
      const idx = applications.value.findIndex(a => String(a.id) === String(applicationId))
      if (idx !== -1) {
        const app = applications.value[idx]
        const newHistoryItem = {
          id: Date.now(),
          status_id: payload.status_id,
          status: foundStatus,
          created_at: payload.created_at || new Date().toISOString().split('T')[0],
          notes: payload.notes || '',
        }
        const updatedHistories = [newHistoryItem, ...(app.histories || [])]
        applications.value[idx] = {
          ...app,
          status_id: payload.status_id,
          status: foundStatus,
          histories: updatedHistories,
        }
      }
      loading.value = false
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setFilterStatus(statusId) {
    selectedStatus.value = statusId
  }

  function setFilterPlatform(platformId) {
    selectedPlatform.value = platformId
  }

  function setSortBy(sortOrder) {
    sortBy.value = sortOrder
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedStatus.value = ''
    selectedPlatform.value = ''
    sortBy.value = 'latest'
  }

  return {
    applications,
    loading,
    error,
    searchQuery,
    selectedStatus,
    selectedPlatform,
    sortBy,
    userApplications,
    filteredApplications,
    totalApplicationsCount,
    responseRatePercent,
    statusBreakdownData,
    platformBreakdownData,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    addStatusHistory,
    setSearchQuery,
    setFilterStatus,
    setFilterPlatform,
    setSortBy,
    resetFilters,
  }
})
