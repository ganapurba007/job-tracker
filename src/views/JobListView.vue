<script setup>
import { ref, onMounted } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import FilterBar from '@/components/applications/FilterBar.vue'
import JobCard from '@/components/applications/JobCard.vue'
import JobFormModal from '@/components/applications/JobFormModal.vue'
import ConfirmDeleteModal from '@/components/applications/ConfirmDeleteModal.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import Button from '@/components/common/Button.vue'
import Pagination from '@/components/common/Pagination.vue'
import { Briefcase, Plus, FolderOpen } from '@lucide/vue'

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
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase class="w-7 h-7 text-teal-600 dark:text-teal-400" />
          <span>Daftar Lamaran Kerja</span>
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pantau dan kelola {{ jobStore.filteredApplications.length }} lamaran pekerjaan aktif Anda
        </p>
      </div>

      <Button variant="orange" @click="openCreateModal">
        <Plus class="w-4 h-4 mr-2" />
        Tambah Lamaran
      </Button>
    </div>

    <!-- Filter Control Bar -->
    <FilterBar />

    <!-- Loading Skeleton State -->
    <Skeleton v-if="jobStore.loading" :count="6" />

    <!-- Applications Card Grid & Pagination Section -->
    <template v-else-if="jobStore.filteredApplications.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <JobCard
          v-for="app in jobStore.paginatedApplications"
          :key="app.id"
          :application="app"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>

      <!-- Client-Side Pagination Controls -->
      <Pagination
        v-if="jobStore.filteredApplications.length > 0"
        :current-page="Number(jobStore.currentPage || 1)"
        :total-pages="Number(jobStore.totalPages || 1)"
        :total-items="Number(jobStore.filteredApplications.length || 0)"
        :page-size="Number(jobStore.pageSize || 8)"
        @page-change="jobStore.setCurrentPage"
      />
    </template>

    <!-- Empty State -->
    <div
      v-else
      class="py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 max-w-md mx-auto"
    >
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
        <FolderOpen class="w-8 h-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          Tidak Ada Data Lamaran
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
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
          class="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
        >
          Reset Semua Filter
        </button>
        <Button v-else variant="accent" @click="openCreateModal">
          <Plus class="w-4 h-4 mr-2" />
          Tambah Lamaran Pertama
        </Button>
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
