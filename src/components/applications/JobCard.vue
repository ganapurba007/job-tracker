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
  const dateVal = props.application.applied_date || props.application.applied_at
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
  <div class="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
    <div class="space-y-3">
      <!-- Top Row: Position & Status Badge -->
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-1 min-w-0 flex-1">
          <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate" :title="application.position">
            {{ application.position }}
          </h3>
          <div class="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
            <Building2 class="w-3.5 h-3.5 mr-1.5 shrink-0 text-teal-600 dark:text-teal-400" />
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
      <p v-if="application.notes" class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
        {{ application.notes }}
      </p>

      <!-- Platform tag -->
      <div class="flex items-center space-x-2 pt-1">
        <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          <Globe class="w-3 h-3 mr-1 text-teal-600 dark:text-teal-400" />
          {{ application.platform?.label || application.platform?.name || 'Platform' }}
        </span>
      </div>
    </div>

    <!-- Bottom Footer Row: Date & Action Links -->
    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <div class="flex items-center space-x-1">
        <Calendar class="w-3.5 h-3.5 text-slate-400" />
        <span>{{ formatDate }}</span>
      </div>

      <div class="flex items-center space-x-2">
        <button
          type="button"
          @click="emit('edit', application)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Edit Lamaran"
        >
          <Pencil class="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          @click="emit('delete', application)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          title="Hapus Lamaran"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>

        <router-link
          :to="`/job-applications/${application.id}`"
          class="inline-flex items-center font-bold text-teal-600 dark:text-teal-400 hover:text-orange-500 transition-colors ml-1"
        >
          <span>Detail</span>
          <ChevronRight class="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>
    </div>
  </div>
</template>
