<script setup>
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import { Search, Filter, ArrowUpDown, X } from '@lucide/vue'

const jobStore = useJobStore()
const refStore = useReferenceStore()
</script>

<template>
  <div class="bg-white dark:bg-primary-dark/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-primary/80 p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3 flex-wrap">
    <!-- Search Input -->
    <div class="relative flex-1 min-w-[200px]">
      <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search class="w-4 h-4" />
      </div>
      <input
        v-model="jobStore.searchQuery"
        type="text"
        placeholder="Cari perusahaan atau posisi..."
        class="w-full pl-10 pr-9 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal transition-colors min-h-[40px]"
      />
      <button
        v-if="jobStore.searchQuery"
        type="button"
        @click="jobStore.searchQuery = ''"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Status Dropdown -->
    <div class="relative min-w-[140px]">
      <select
        v-model="jobStore.selectedStatus"
        class="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal cursor-pointer min-h-[40px] appearance-none"
      >
        <option value="">Semua Status</option>
        <option
          v-for="status in refStore.statuses"
          :key="status.id"
          :value="status.id"
        >
          {{ status.name }}
        </option>
      </select>
    </div>

    <!-- Platform Dropdown -->
    <div class="relative min-w-[140px]">
      <select
        v-model="jobStore.selectedPlatform"
        class="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal cursor-pointer min-h-[40px] appearance-none"
      >
        <option value="">Semua Platform</option>
        <option
          v-for="platform in refStore.platforms"
          :key="platform.id"
          :value="platform.id"
        >
          {{ platform.name }}
        </option>
      </select>
    </div>

    <!-- Sort Toggle -->
    <div class="relative min-w-[130px]">
      <select
        v-model="jobStore.sortBy"
        class="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal cursor-pointer min-h-[40px] appearance-none"
      >
        <option value="latest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>

    <!-- Reset Filters Button -->
    <button
      v-if="jobStore.searchQuery || jobStore.selectedStatus || jobStore.selectedPlatform || jobStore.sortBy !== 'latest'"
      type="button"
      @click="jobStore.resetFilters()"
      class="px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center space-x-1 cursor-pointer min-h-[40px]"
    >
      <X class="w-3.5 h-3.5" />
      <span>Reset Filter</span>
    </button>
  </div>
</template>
