<script setup>
import { computed } from 'vue'
import Badge from '@/components/common/Badge.vue'
import { Building2, Calendar, ExternalLink, Globe, ChevronRight } from '@lucide/vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const formatDate = computed(() => {
  if (!props.application.applied_at) return '-'
  try {
    const d = new Date(props.application.applied_at)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return props.application.applied_at
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
          {{ application.platform?.name || 'Platform' }}
        </span>
      </div>
    </div>

    <!-- Bottom Footer Row: Date & Action Link -->
    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-primary/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-1">
        <Calendar class="w-3.5 h-3.5" />
        <span>{{ formatDate }}</span>
      </div>

      <router-link
        :to="`/job-applications/${application.id}`"
        class="inline-flex items-center font-semibold text-accent-teal hover:text-accent-orange transition-colors"
      >
        <span>Detail</span>
        <ChevronRight class="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
      </router-link>
    </div>
  </div>
</template>
