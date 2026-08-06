<script setup>
import { computed } from 'vue'
import Badge from '@/components/common/Badge.vue'
import { Clock, FileText } from '@lucide/vue'

const props = defineProps({
  histories: {
    type: Array,
    default: () => [],
  },
})

// Sort histories newest at top or oldest at top
const sortedHistories = computed(() => {
  if (!props.histories) return []
  return [...props.histories].sort((a, b) => {
    const timeA = new Date(a.created_at || a.date).getTime()
    const timeB = new Date(b.created_at || b.date).getTime()
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
    <h3 class="text-lg font-bold text-primary-dark dark:text-gray-100 flex items-center gap-2">
      <Clock class="w-5 h-5 text-accent-teal" />
      <span>Riwayat Perubahan Status</span>
    </h3>

    <div v-if="sortedHistories.length > 0" class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 dark:before:bg-primary">
      <div
        v-for="(item, index) in sortedHistories"
        :key="item.id || index"
        class="relative group"
      >
        <!-- Timeline Dot Marker -->
        <div
          class="absolute -left-6 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-primary-dark shadow-xs flex items-center justify-center transition-transform group-hover:scale-125"
          :style="{ backgroundColor: item.status?.color || '#325E6A' }"
        ></div>

        <!-- History Item Card -->
        <div class="bg-white dark:bg-primary-dark/80 rounded-2xl border border-gray-100 dark:border-primary/60 p-4 shadow-xs space-y-2">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <Badge
              :text="item.status?.name || 'Status'"
              :color="item.status?.color || '#325E6A'"
              size="md"
            />
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
              {{ formatDate(item.created_at || item.date) }}
            </span>
          </div>

          <p v-if="item.notes" class="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-primary/40 p-2.5 rounded-xl border border-gray-100 dark:border-primary/50 flex items-start space-x-2">
            <FileText class="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
            <span>{{ item.notes }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Empty Timeline Fallback -->
    <div
      v-else
      class="p-6 text-center bg-gray-50 dark:bg-primary/30 rounded-2xl border border-dashed border-gray-200 dark:border-primary/50 text-xs text-gray-500 dark:text-gray-400"
    >
      Belum ada riwayat perubahan status. Klik "Update Status" untuk mencatat perkembangan terbaru.
    </div>
  </div>
</template>
