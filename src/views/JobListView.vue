<script setup>
import { onMounted } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import FilterBar from '@/components/applications/FilterBar.vue'
import JobCard from '@/components/applications/JobCard.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import Button from '@/components/common/Button.vue'
import { Briefcase, Plus, FolderOpen } from '@lucide/vue'

const jobStore = useJobStore()
const refStore = useReferenceStore()

onMounted(async () => {
  await Promise.all([
    refStore.fetchReferences(),
    jobStore.fetchApplications(),
  ])
})
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-gray-100 flex items-center gap-2">
          <Briefcase class="w-7 h-7 text-accent-teal" />
          <span>Daftar Lamaran Kerja</span>
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau dan kelola {{ jobStore.filteredApplications.length }} lamaran pekerjaan aktif Anda
        </p>
      </div>

      <router-link to="/job-applications/new">
        <Button variant="orange">
          <Plus class="w-4 h-4 mr-2" />
          Tambah Lamaran
        </Button>
      </router-link>
    </div>

    <!-- Filter Control Bar -->
    <FilterBar />

    <!-- Loading Skeleton State -->
    <Skeleton v-if="jobStore.loading" :count="6" />

    <!-- Applications Card Grid -->
    <div
      v-else-if="jobStore.filteredApplications.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      <JobCard
        v-for="app in jobStore.filteredApplications"
        :key="app.id"
        :application="app"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="py-16 px-4 text-center bg-white dark:bg-primary-dark/60 rounded-2xl border border-gray-100 dark:border-primary/60 shadow-xs space-y-4 max-w-md mx-auto"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal">
        <FolderOpen class="w-8 h-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-bold text-primary-dark dark:text-gray-100">
          Tidak Ada Data Lamaran
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          <template v-if="jobStore.searchQuery || jobStore.selectedStatus || jobStore.selectedPlatform">
            Tidak ditemukan lamaran yang cocok dengan kriteria pencarian Anda.
          </template>
          <template v-else>
            Belum ada lamaran kerja yang ditambahkan. Mulai catat lamaran pertama Anda sekarang!
          </template>
        </p>
      </div>

      <div class="pt-2">
        <button
          v-if="jobStore.searchQuery || jobStore.selectedStatus || jobStore.selectedPlatform"
          type="button"
          @click="jobStore.resetFilters()"
          class="text-xs font-semibold text-accent-teal hover:underline cursor-pointer"
        >
          Reset Semua Filter
        </button>
        <router-link v-else to="/job-applications/new">
          <Button variant="accent">
            <Plus class="w-4 h-4 mr-2" />
            Tambah Lamaran Pertama
          </Button>
        </router-link>
      </div>
    </div>
  </div>
</template>
