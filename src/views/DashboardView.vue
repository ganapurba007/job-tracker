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
import Button from '@/components/common/Button.vue'
import { Sparkles, Plus, ArrowRight, Briefcase } from '@lucide/vue'

const authStore = useAuthStore()
const jobStore = useJobStore()
const refStore = useReferenceStore()

const showFormModal = ref(false)

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
    <div class="p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-2">
        <div class="flex items-center space-x-2 text-accent-teal text-xs font-semibold uppercase tracking-wider">
          <Sparkles class="w-4 h-4 text-accent-orange" />
          <span>Dashboard Analytics</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold">
          Selamat Datang, {{ authStore.user?.name || 'Pengguna' }}!
        </h1>
        <p class="text-gray-300 text-xs sm:text-sm max-w-xl">
          Pantau ringkasan statistik lamaran kerja Anda secara real-time dan analisis efektivitas pencarian kerja Anda.
        </p>
      </div>

      <Button variant="orange" @click="showFormModal = true" class="shrink-0">
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

      <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark/90 border border-gray-100 dark:border-primary/80 shadow-xs flex flex-col justify-between space-y-3">
        <div>
          <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tindakan Cepat
          </span>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Catat lowongan baru yang Anda lamar hari ini.
          </p>
        </div>
        <Button variant="accent" full-width @click="showFormModal = true">
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
        <h2 class="text-lg font-bold text-primary-dark dark:text-gray-100 flex items-center gap-2">
          <Briefcase class="w-5 h-5 text-accent-teal" />
          <span>Lamaran Terbaru</span>
        </h2>

        <router-link
          to="/job-applications"
          class="inline-flex items-center text-xs font-semibold text-accent-teal hover:text-accent-orange transition-colors"
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
        />
      </div>
    </div>

    <!-- Job Form Modal -->
    <JobFormModal
      :show="showFormModal"
      @close="showFormModal = false"
    />
  </div>
</template>
