<script setup>
import { computed } from 'vue'
import Badge from '@/components/common/Badge.vue'
import { FileText } from '@lucide/vue'

const props = defineProps({
  histories: {
    type: Array,
    default: () => [],
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
})

// Sort histories newest at top
const sortedHistories = computed(() => {
  if (!props.histories) return []
  return [...props.histories].sort((a, b) => {
    const timeA = new Date(a.change_at || a.created_at || a.date || 0).getTime()
    const timeB = new Date(b.change_at || b.created_at || b.date || 0).getTime()
    return timeB - timeA // Newest first
  })
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return dateStr
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 v-if="showTitle" class="text-base font-bold text-slate-900 dark:text-slate-100">
      Riwayat Perubahan Status
    </h3>
    <span class="sr-only">Riwayat Perubahan Status</span>

    <div v-if="sortedHistories.length > 0" class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      <div
        v-for="(item, index) in sortedHistories"
        :key="item.id || index"
        class="relative group"
      >
        <!-- Timeline Dot Marker -->
        <div
          class="absolute -left-6 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 shadow-2xs flex items-center justify-center transition-transform group-hover:scale-125"
          :style="{ backgroundColor: item.status?.color || '#325E6A' }"
        ></div>

        <!-- History Item Card -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <Badge
              :text="item.status?.name || 'Status'"
              :color="item.status?.color || '#325E6A'"
              size="md"
            />
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {{ formatDate(item.change_at || item.created_at || item.date) }}
            </span>
          </div>

          <p v-if="item.notes" class="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start space-x-2">
            <FileText class="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
            <span>{{ item.notes }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Empty Timeline Fallback -->
    <div
      v-else
      class="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400"
    >
      Belum ada riwayat perubahan status. Klik "Update Status" untuk mencatat perkembangan terbaru.
    </div>
  </div>
</template>
