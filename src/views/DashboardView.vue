<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import StatCard from '@/components/dashboard/StatCard.vue'
import StatusChart from '@/components/dashboard/StatusChart.vue'
import PlatformChart from '@/components/dashboard/PlatformChart.vue'
import JobCard from '@/components/applications/JobCard.vue'
import JobFormModal from '@/components/applications/JobFormModal.vue'
import ConfirmDeleteModal from '@/components/applications/ConfirmDeleteModal.vue'
import Button from '@/components/common/Button.vue'
import { Sparkles, Plus, ArrowRight, Briefcase } from '@lucide/vue'

const authStore = useAuthStore()
const jobStore = useJobStore()
const refStore = useReferenceStore()

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const targetApplication = ref(null)

function openCreateModal() {
  targetApplication.value = null
  showFormModal.value = true
}

function openEditModal(app) {
  targetApplication.value = app
  showFormModal.value = true
}

function openDeleteModal(app) {
  targetApplication.value = app
  showDeleteModal.value = true
}

onMounted(async () => {
  await Promise.all([
    refStore.fetchReferences(),
    jobStore.fetchApplications(),
  ])
})
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header Banner -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-500/30">
      <div class="space-y-2">
        <div class="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles class="w-4 h-4 text-orange-400" />
          <span>Dashboard Analytics</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">
          Selamat Datang, {{ authStore.user?.name || 'Pengguna' }}!
        </h1>
        <p class="text-slate-300 text-xs sm:text-sm max-w-xl">
          Pantau ringkasan statistik lamaran kerja Anda secara real-time dan analisis efektivitas pencarian kerja Anda.
        </p>
      </div>

      <Button variant="orange" @click="openCreateModal" class="shrink-0">
        <Plus class="w-4 h-4 mr-2" />
        Tambah Lamaran
      </Button>
    </div>

    <!-- KPI Summary Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <StatCard
        title="Total Lamaran"
        :value="jobStore.totalApplicationsCount"
        subtitle="Jumlah total lamaran yang telah dikirim"
        badge-text="Aktif"
      />

      <StatCard
        title="Response Rate"
        :value="`${jobStore.responseRatePercent}%`"
        subtitle="Persentase lamaran yang mendapat tanggapan"
        badge-text="KPI Utama"
      />

      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3">
        <div>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Tindakan Cepat
          </span>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catat lowongan baru yang Anda lamar hari ini.
          </p>
        </div>
        <Button variant="accent" full-width @click="openCreateModal">
          <Plus class="w-4 h-4 mr-2" />
          Tambah Lamaran Baru
        </Button>
      </div>
    </div>

    <!-- Analytics Visual Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StatusChart />
      <PlatformChart />
    </div>

    <!-- Recent Applications Preview Section -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase class="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Lamaran Terbaru</span>
        </h2>

        <router-link
          to="/job-applications"
          class="inline-flex items-center text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-orange-500 transition-colors"
        >
          <span>Lihat Semua ({{ jobStore.applications.length }})</span>
          <ArrowRight class="w-4 h-4 ml-1" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <JobCard
          v-for="app in jobStore.applications.slice(0, 3)"
          :key="app.id"
          :application="app"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>
    </div>

    <!-- Job Form Modal (Create & Edit) -->
    <JobFormModal
      :show="showFormModal"
      :application="targetApplication"
      @close="showFormModal = false"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :application="targetApplication"
      @close="showDeleteModal = false"
    />
  </div>
</template>
