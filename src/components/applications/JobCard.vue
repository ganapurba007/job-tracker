<script setup>
import { computed } from 'vue'
import Badge from '@/components/common/Badge.vue'
import { Building2, Calendar, Globe, ChevronRight, Pencil, Trash2 } from '@lucide/vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const formatDate = computed(() => {
  const dateVal = props.application.applied_date || props.application.applied_date
  if (!dateVal) return '-'
  try {
    const d = new Date(dateVal)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return dateVal
  }
})
</script>

<template>
  <div class="group relative bg-white dark:bg-primary-dark/90 rounded-2xl border border-gray-100 dark:border-primary/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
    <div class="space-y-3">
      <!-- Top Row: Position & Status Badge -->
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1 min-w-0 flex-1">
          <h3 class="font-bold text-base sm:text-lg text-primary-dark dark:text-gray-100 group-hover:text-accent-teal transition-colors truncate" :title="application.position">
            {{ application.position }}
          </h3>
          <div class="flex items-center text-xs font-medium text-gray-500 dark:text-gray-300 truncate">
            <Building2 class="w-3.5 h-3.5 mr-1.5 shrink-0 text-accent-teal" />
            <span class="truncate">{{ application.company_name }}</span>
          </div>
        </div>

        <Badge
          :text="application.status?.name || 'Status'"
          :color="application.status?.color || '#325E6A'"
          size="md"
          class="shrink-0"
        />
      </div>

      <!-- Notes Preview if available -->
      <p v-if="application.notes" class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-primary/30 p-2.5 rounded-xl border border-gray-100 dark:border-primary/40">
        {{ application.notes }}
      </p>

      <!-- Platform tag -->
      <div class="flex items-center space-x-2 pt-1">
        <span class="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-primary/60 text-gray-700 dark:text-gray-200">
          <Globe class="w-3 h-3 mr-1 text-accent-teal" />
          {{ application.platform?.label || application.platform?.name || 'Platform' }}
        </span>
      </div>
    </div>

    <!-- Bottom Footer Row: Date & Action Links -->
    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-primary/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-1">
        <Calendar class="w-3.5 h-3.5 text-gray-400" />
        <span>{{ formatDate }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="emit('edit', application)"
          class="p-1.5 rounded-lg text-gray-400 hover:text-accent-teal hover:bg-gray-100 dark:hover:bg-primary/60 transition-colors cursor-pointer"
          title="Edit Lamaran"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          @click="emit('delete', application)"
          class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          title="Hapus Lamaran"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>

        <router-link
          :to="`/job-applications/${application.id}`"
          class="inline-flex items-center font-semibold text-accent-teal hover:text-accent-orange transition-colors ml-1"
        >
          <span>Detail</span>
          <ChevronRight class="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>
    </div>
  </div>
</template>
