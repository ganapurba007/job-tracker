import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jobService } from '@/services/jobService'
import { useReferenceStore } from '@/stores/referenceStore'

export const useJobStore = defineStore('job', () => {
  const initialApplications = [
    {
      id: 1,
      company_name: 'TechCorp Indonesia',
      position: 'Frontend Engineer (Vue 3)',
      job_url: 'https://linkedin.com/jobs/view/123456',
      notes: 'Lolos screening HR, jadwal interview teknis tanggal 10 Agustus.',
      applied_at: '2026-08-01',
      status_id: 2,
      status: { id: 2, name: 'Wawancara', color: '#44A1A4' },
      platform_id: 1,
      platform: { id: 1, name: 'LinkedIn' },
      histories: [
        { id: 1, status: { name: 'Telah Dilamar', color: '#325E6A' }, created_at: '2026-08-01', notes: 'Apply via 1-Click LinkedIn' },
        { id: 2, status: { name: 'Wawancara', color: '#44A1A4' }, created_at: '2026-08-04', notes: 'Diundang wawancara user' }
      ]
    },
    {
      id: 2,
      company_name: 'Nusantara Digital',
      position: 'Fullstack Vue & Laravel Developer',
      job_url: 'https://glints.com/id/jobs/789012',
      notes: 'Menerima penawaran gaji dan fasilitas kesehatan.',
      applied_at: '2026-07-25',
      status_id: 3,
      status: { id: 3, name: 'Dapat Penawaran', color: '#FF9A00' },
      platform_id: 3,
      platform: { id: 3, name: 'Glints' },
      histories: [
        { id: 1, status: { name: 'Telah Dilamar', color: '#325E6A' }, created_at: '2026-07-25', notes: 'Submit resume' },
        { id: 2, status: { name: 'Wawancara', color: '#44A1A4' }, created_at: '2026-07-28', notes: 'Interview teknis' },
        { id: 3, status: { name: 'Dapat Penawaran', color: '#FF9A00' }, created_at: '2026-08-02', notes: 'Offering letter dikirim via email' }
      ]
    },
    {
      id: 3,
      company_name: 'Studio Design Pro',
      position: 'UI/UX & Frontend Specialist',
      job_url: 'https://jobstreet.co.id/jobs/345678',
      notes: 'Menunggu kabar dari Tim Recruitment.',
      applied_at: '2026-08-03',
      status_id: 1,
      status: { id: 1, name: 'Telah Dilamar', color: '#325E6A' },
      platform_id: 2,
      platform: { id: 2, name: 'JobStreet' },
      histories: [
        { id: 1, status: { name: 'Telah Dilamar', color: '#325E6A' }, created_at: '2026-08-03', notes: 'CV terkirim' }
      ]
    },
    {
      id: 4,
      company_name: 'Global Cloud Systems',
      position: 'Senior Vue Developer',
      job_url: 'https://kalibrr.com/jobs/901234',
      notes: 'Dimasukkan ke dalam target wishlist minggu depan.',
      applied_at: '2026-08-05',
      status_id: 5,
      status: { id: 5, name: 'Wishlist', color: '#6B7280' },
      platform_id: 4,
      platform: { id: 4, name: 'Kalibrr' },
      histories: []
    }
  ]

  const applications = ref([...initialApplications])
  const loading = ref(false)
  const error = ref(null)

  // Filters & Sorting state
  const searchQuery = ref('')
  const selectedStatus = ref('')
  const selectedPlatform = ref('')
  const sortBy = ref('latest')

  const filteredApplications = computed(() => {
    let result = [...applications.value]

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(app =>
        app.company_name.toLowerCase().includes(q) ||
        app.position.toLowerCase().includes(q)
      )
    }

    if (selectedStatus.value) {
      result = result.filter(app => String(app.status_id) === String(selectedStatus.value))
    }

    if (selectedPlatform.value) {
      result = result.filter(app => String(app.platform_id) === String(selectedPlatform.value))
    }

    result.sort((a, b) => {
      const dateA = new Date(a.applied_at).getTime()
      const dateB = new Date(b.applied_at).getTime()
      return sortBy.value === 'latest' ? dateB - dateA : dateA - dateB
    })

    return result
  })

  async function fetchApplications() {
    loading.value = true
    error.value = null
    try {
      const data = await jobService.getApplications()
      const apiList = Array.isArray(data) ? data : (data.data || data)
      if (apiList && apiList.length > 0) {
        applications.value = apiList
      }
    } catch (err) {
      // Keep existing applications list (or demo data)
    } finally {
      loading.value = false
    }
  }

  async function addApplication(payload) {
    loading.value = true
    error.value = null
    const refStore = useReferenceStore()
    const foundStatus = refStore.statuses.find(s => String(s.id) === String(payload.status_id)) || { id: payload.status_id, name: 'Status', color: '#325E6A' }
    const foundPlatform = refStore.platforms.find(p => String(p.id) === String(payload.platform_id)) || { id: payload.platform_id, name: 'Platform' }

    try {
      const res = await jobService.createApplication(payload)
      const newApp = res.data || res
      applications.value.unshift(newApp)
      return newApp
    } catch (err) {
      // Fallback local create for offline/demo mode
      const newApp = {
        id: Date.now(),
        ...payload,
        status: foundStatus,
        platform: foundPlatform,
        histories: [
          {
            id: Date.now(),
            status: foundStatus,
            created_at: payload.applied_at || new Date().toISOString().split('T')[0],
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
      // Fallback local update
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
      // Local fallback delete
    } finally {
      applications.value = applications.value.filter(a => String(a.id) !== String(id))
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
    filteredApplications,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    setSearchQuery,
    setFilterStatus,
    setFilterPlatform,
    setSortBy,
    resetFilters,
  }
})
