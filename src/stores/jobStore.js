import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { jobService } from '@/services/jobService'
import { useReferenceStore } from '@/stores/referenceStore'
import { useAuthStore } from '@/stores/authStore'

export const useJobStore = defineStore('job', () => {
  const applications = ref([])
  const currentApplication = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Filters, Sorting & Pagination state
  const searchQuery = ref('')
  const selectedStatus = ref('')
  const selectedPlatform = ref('')
  const sortBy = ref('latest')
  const currentPage = ref(1)
  const pageSize = ref(8)

  function normalizeApplication(app, existingApp = null) {
    if (!app) return app
    const histories = (app.application_histories && app.application_histories.length > 0)
      ? app.application_histories
      : ((app.histories && app.histories.length > 0)
          ? app.histories
          : (existingApp ? (existingApp.application_histories || existingApp.histories || []) : []))

    return {
      ...app,
      status_id: app.current_status_id || app.status_id,
      current_status_id: app.current_status_id || app.status_id,
      applied_at: app.applied_date || app.applied_at,
      applied_date: app.applied_date || app.applied_at,
      job_url: app.job_link || app.job_url,
      job_link: app.job_link || app.job_url,
      follow_up_date: app.follow_up_date || null,
      attachment_url: app.attachment_url || app.attachment_link || null,
      histories: histories,
      application_histories: histories,
    }
  }

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
      result = result.filter(app => String(app.status_id || app.current_status_id) === String(selectedStatus.value))
    }

    if (selectedPlatform.value) {
      result = result.filter(app => String(app.platform_id) === String(selectedPlatform.value))
    }

    result.sort((a, b) => {
      const dateA = new Date(a.applied_date || a.applied_at || 0).getTime()
      const dateB = new Date(b.applied_date || b.applied_at || 0).getTime()
      return sortBy.value === 'latest' ? dateB - dateA : dateA - dateB
    })

    return result
  })

  // Client-Side Pagination Computed Getters
  const totalPages = computed(() => {
    if (!filteredApplications.value.length) return 1
    return Math.ceil(filteredApplications.value.length / pageSize.value)
  })

  const paginatedApplications = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredApplications.value.slice(start, start + pageSize.value)
  })

  // Watch filters and reset to page 1 automatically when filter/search changes
  watch([searchQuery, selectedStatus, selectedPlatform, sortBy], () => {
    currentPage.value = 1
  })

  // Upcoming Reminders Getter
  const upcomingReminders = computed(() => {
    return userApplications.value
      .filter(a => a.follow_up_date)
      .sort((a, b) => new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime())
      .slice(0, 5)
  })

  // Analytics KPI Getters (scoped to logged in user)
  const totalApplicationsCount = computed(() => userApplications.value.length)

  const responseRatePercent = computed(() => {
    if (!userApplications.value.length) return 0
    const responded = userApplications.value.filter(a => {
      const sId = Number(a.current_status_id || a.status_id)
      return sId !== 1 && sId !== 5
    })
    return Math.round((responded.length / userApplications.value.length) * 100)
  })

  const statusBreakdownData = computed(() => {
    const refStore = useReferenceStore()
    const counts = {}
    refStore.statuses.forEach(s => { counts[s.id] = 0 })

    userApplications.value.forEach(app => {
      const sId = app.current_status_id || app.status_id
      if (sId) counts[sId] = (counts[sId] || 0) + 1
    })

    const items = refStore.statuses.map(s => {
      const count = counts[s.id] || 0
      const total = userApplications.value.length
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      return {
        id: s.id,
        name: s.name ? (s.name.charAt(0).toUpperCase() + s.name.slice(1)) : '',
        color: s.color || '#325E6A',
        count,
        percentage,
      }
    })

    const labels = items.map(i => i.name)
    const data = items.map(i => i.count)
    const backgroundColor = items.map(i => i.color)

    return { labels, data, backgroundColor, items }
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
      const apiList = Array.isArray(data) ? data : (data.data ? (Array.isArray(data.data) ? data.data : data.data.data) : [])
      if (Array.isArray(apiList)) {
        const existingMap = new Map(applications.value.map(a => [String(a.id), a]))
        const normalized = apiList.map(item => {
          const existing = existingMap.get(String(item.id))
          return normalizeApplication(item, existing)
        })

        if (currentUserId) {
          applications.value = normalized.filter(app => !app.user_id || String(app.user_id) === String(currentUserId))
        } else {
          applications.value = normalized
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

  async function fetchApplication(id) {
    loading.value = true
    error.value = null
    try {
      const data = await jobService.getApplication(id)
      const app = data.data || data
      const normalized = normalizeApplication(app)
      currentApplication.value = normalized

      const idx = applications.value.findIndex(a => String(a.id) === String(id))
      if (idx !== -1) {
        applications.value[idx] = normalized
      } else {
        applications.value.push(normalized)
      }
      return normalized
    } catch (err) {
      error.value = err?.response?.data?.message || 'Gagal mengambil detail lamaran'
      const foundInList = applications.value.find(a => String(a.id) === String(id))
      if (foundInList) {
        currentApplication.value = foundInList
        return foundInList
      }
      currentApplication.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchApplicationById(id) {
    return await fetchApplication(id)
  }

  async function addApplication(payload) {
    loading.value = true
    error.value = null

    const dateVal = payload.applied_date || payload.applied_at || new Date().toISOString().split('T')[0]
    const urlVal = (payload.job_link || payload.job_url) ? (payload.job_link || payload.job_url) : null
    const followUpVal = payload.follow_up_date ? payload.follow_up_date : null
    const attachmentVal = payload.attachment_url ? payload.attachment_url : null
    const notesVal = payload.notes ? payload.notes : null

    const finalPayload = {
      company_name: payload.company_name,
      position: payload.position,
      platform_id: Number(payload.platform_id),
      current_status_id: Number(payload.current_status_id || payload.status_id),
      applied_date: dateVal,
      job_link: urlVal,
      follow_up_date: followUpVal,
      attachment_url: attachmentVal,
      notes: notesVal,
    }

    try {
      const res = await jobService.createApplication(finalPayload)
      await fetchApplications()
      return res.data || res
    } catch (err) {
      error.value = err?.response?.data?.message || 'Gagal menyimpan data lamaran ke database'
      await fetchApplications().catch(() => {})
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateApplication(id, payload) {
    loading.value = true
    error.value = null

    const dateVal = payload.applied_date || payload.applied_at
    const urlVal = (payload.job_link || payload.job_url) ? (payload.job_link || payload.job_url) : null
    const followUpVal = payload.follow_up_date !== undefined ? payload.follow_up_date : null
    const attachmentVal = payload.attachment_url !== undefined ? payload.attachment_url : null
    const notesVal = payload.notes ? payload.notes : null

    const finalPayload = {
      company_name: payload.company_name,
      position: payload.position,
      platform_id: Number(payload.platform_id),
      current_status_id: Number(payload.current_status_id || payload.status_id),
      ...(dateVal ? { applied_date: dateVal } : {}),
      job_link: urlVal,
      follow_up_date: followUpVal,
      attachment_url: attachmentVal,
      notes: notesVal,
    }

    try {
      const res = await jobService.updateApplication(id, finalPayload)
      await fetchApplications()
      await fetchApplication(id).catch(() => {})
      return res.data || res
    } catch (err) {
      error.value = err?.response?.data?.message || 'Gagal memperbarui data lamaran'
      await fetchApplications().catch(() => {})
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id) {
    loading.value = true
    error.value = null
    try {
      await jobService.deleteApplication(id)
      await fetchApplications()
    } catch (err) {
      error.value = err?.response?.data?.message || 'Gagal menghapus lamaran'
      await fetchApplications().catch(() => {})
    } finally {
      loading.value = false
    }
  }

  async function addStatusHistory(applicationId, payload) {
    loading.value = true
    error.value = null
    const historyPayload = {
      status_id: Number(payload.status_id),
      change_at: payload.change_at || payload.created_at || new Date().toISOString().split('T')[0],
      notes: payload.notes ? payload.notes : null,
    }
    try {
      await jobService.addStatusHistory(applicationId, historyPayload)
      await fetchApplications()
      await fetchApplication(applicationId)
    } catch (err) {
      error.value = err?.response?.data?.message || 'Gagal menambahkan riwayat status'
      await fetchApplications().catch(() => {})
      throw err
    } finally {
      loading.value = false
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
    currentPage.value = 1
  }

  function setFilterStatus(statusId) {
    selectedStatus.value = statusId
    currentPage.value = 1
  }

  function setFilterPlatform(platformId) {
    selectedPlatform.value = platformId
    currentPage.value = 1
  }

  function setSortBy(sortOrder) {
    sortBy.value = sortOrder
    currentPage.value = 1
  }

  function setCurrentPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedStatus.value = ''
    selectedPlatform.value = ''
    sortBy.value = 'latest'
    currentPage.value = 1
  }

  return {
    applications,
    currentApplication,
    loading,
    error,
    searchQuery,
    selectedStatus,
    selectedPlatform,
    sortBy,
    currentPage,
    pageSize,
    userApplications,
    filteredApplications,
    paginatedApplications,
    totalPages,
    upcomingReminders,
    totalApplicationsCount,
    responseRatePercent,
    statusBreakdownData,
    platformBreakdownData,
    fetchApplications,
    fetchApplication,
    fetchApplicationById,
    addApplication,
    updateApplication,
    deleteApplication,
    addStatusHistory,
    setSearchQuery,
    setFilterStatus,
    setFilterPlatform,
    setSortBy,
    setCurrentPage,
    resetFilters,
  }
})
