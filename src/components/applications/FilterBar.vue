<script setup>
import { computed } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import Select2 from '@/components/common/Select2.vue'
import { Search, X, Tag, Globe, ArrowUpDown } from '@lucide/vue'

const jobStore = useJobStore()
const refStore = useReferenceStore()

function ucfirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const statusOptions = computed(() => {
  const list = refStore.statuses.map(s => ({
    id: s.id,
    name: ucfirst(s.name),
    color: s.color,
  }))
  return [{ id: '', name: 'Semua Status' }, ...list]
})

const platformOptions = computed(() => {
  const list = refStore.platforms.map(p => ({
    id: p.id,
    name: p.label || p.name,
  }))
  return [{ id: '', name: 'Semua Platform' }, ...list]
})

const sortOptions = [
  { id: 'latest', name: 'Terbaru' },
  { id: 'oldest', name: 'Terlama' },
]
</script>

<template>
  <div class="relative z-30 bg-white dark:bg-slate-900 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 flex-wrap">
    <!-- Search Input -->
    <div class="relative flex-1 min-w-[200px]">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search class="w-4 h-4" />
      </div>
      <input
        v-model="jobStore.searchQuery"
        type="text"
        placeholder="Cari perusahaan atau posisi..."
        class="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors min-h-[40px]"
      />
      <button
        v-if="jobStore.searchQuery"
        type="button"
        @click="jobStore.searchQuery = ''"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Status Dropdown Select2 -->
    <div class="min-w-[160px]">
      <Select2
        v-model="jobStore.selectedStatus"
        :options="statusOptions"
        placeholder="Semua Status"
        :icon="Tag"
      />
    </div>

    <!-- Platform Dropdown Select2 -->
    <div class="min-w-[160px]">
      <Select2
        v-model="jobStore.selectedPlatform"
        :options="platformOptions"
        placeholder="Semua Platform"
        :icon="Globe"
      />
    </div>

    <!-- Sort Toggle Select2 -->
    <div class="min-w-[140px]">
      <Select2
        v-model="jobStore.sortBy"
        :options="sortOptions"
        placeholder="Urutkan"
        :searchable="false"
        :icon="ArrowUpDown"
      />
    </div>

    <!-- Reset Filters Button -->
    <button
      v-if="jobStore.searchQuery || jobStore.selectedStatus || jobStore.selectedPlatform || jobStore.sortBy !== 'latest'"
      type="button"
      @click="jobStore.resetFilters()"
      class="px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center space-x-1 cursor-pointer min-h-[40px]"
    >
      <X class="w-3.5 h-3.5" />
      <span>Reset Filter</span>
    </button>
  </div>
</template>
