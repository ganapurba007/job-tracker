<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps({
  currentPage: {
    type: [Number, String],
    default: 1,
  },
  totalPages: {
    type: [Number, String],
    default: 1,
  },
  totalItems: {
    type: [Number, String],
    default: 0,
  },
  pageSize: {
    type: [Number, String],
    default: 8,
  },
})

const emit = defineEmits(['page-change'])

const pageNum = computed(() => {
  const p = Number(props.currentPage)
  return Number.isNaN(p) || p < 1 ? 1 : p
})

const pagesNum = computed(() => {
  const p = Number(props.totalPages)
  return Number.isNaN(p) || p < 1 ? 1 : p
})

const sizeNum = computed(() => {
  const s = Number(props.pageSize)
  return Number.isNaN(s) || s < 1 ? 8 : s
})

const totalNum = computed(() => {
  const t = Number(props.totalItems)
  return Number.isNaN(t) || t < 0 ? 0 : t
})

const startItem = computed(() => {
  if (totalNum.value === 0) return 0
  return (pageNum.value - 1) * sizeNum.value + 1
})

const endItem = computed(() => {
  if (totalNum.value === 0) return 0
  return Math.min(pageNum.value * sizeNum.value, totalNum.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, pageNum.value - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1

  if (end > pagesNum.value) {
    end = pagesNum.value
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function changePage(page) {
  const target = Number(page)
  if (Number.isNaN(target) || target < 1 || target > pagesNum.value || target === pageNum.value) return
  emit('page-change', target)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs">
    <!-- Info Text -->
    <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
      Menampilkan
      <span class="font-bold text-slate-900 dark:text-slate-100">{{ startItem }}-{{ endItem }}</span>
      dari
      <span class="font-bold text-slate-900 dark:text-slate-100">{{ totalNum }}</span>
      lamaran
    </div>

    <!-- Navigation Controls -->
    <div class="flex items-center space-x-1.5">
      <!-- Previous Button -->
      <button
        type="button"
        :disabled="pageNum <= 1"
        @click="changePage(pageNum - 1)"
        class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Halaman Sebelumnya"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Page Number Buttons -->
      <button
        v-for="page in visiblePages"
        :key="`page-${page}`"
        type="button"
        @click="changePage(page)"
        :class="[
          'min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
          page === pageNum
            ? 'bg-teal-600 text-white shadow-xs'
            : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
      >
        {{ page }}
      </button>

      <!-- Next Button -->
      <button
        type="button"
        :disabled="pageNum >= pagesNum"
        @click="changePage(pageNum + 1)"
        class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label="Halaman Selanjutnya"
        title="Halaman Selanjutnya"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
