<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import Badge from '@/components/common/Badge.vue'
import Button from '@/components/common/Button.vue'
import Timeline from '@/components/applications/Timeline.vue'
import JobFormModal from '@/components/applications/JobFormModal.vue'
import HistoryModal from '@/components/applications/HistoryModal.vue'
import ConfirmDeleteModal from '@/components/applications/ConfirmDeleteModal.vue'
import { ArrowLeft, Building2, Calendar, Globe, ExternalLink, Pencil, Trash2, Plus, FileText } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const refStore = useReferenceStore()

const showEditModal = ref(false)
const showHistoryModal = ref(false)
const showDeleteModal = ref(false)

const applicationId = computed(() => route.params.id)

const application = computed(() => {
  return jobStore.applications.find(a => String(a.id) === String(applicationId.value))
})

const formatDate = computed(() => {
  if (!application.value?.applied_at) return '-'
  try {
    const d = new Date(application.value.applied_at)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return application.value.applied_at
  }
})

function handleDeleted() {
  router.push('/job-applications')
}

onMounted(async () => {
  await Promise.all([
    refStore.fetchReferences(),
    jobStore.fetchApplications(),
  ])
})
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Navigation Back Link -->
    <div>
      <router-link
        to="/job-applications"
        class="inline-flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-accent-teal transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        <span>Kembali ke Daftar Lamaran</span>
      </router-link>
    </div>

    <!-- Application Found View -->
    <template v-if="application">
      <!-- Main Application Banner Header -->
      <div class="bg-white dark:bg-primary-dark/90 rounded-2xl border border-gray-100 dark:border-primary p-6 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-2 flex-1 min-w-0">
            <div class="flex items-center space-x-2 flex-wrap gap-y-2">
              <Badge
                :text="application.status?.name || 'Status'"
                :color="application.status?.color || '#325E6A'"
                size="lg"
              />
              <span class="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-primary/60 text-gray-700 dark:text-gray-200">
                <Globe class="w-3.5 h-3.5 mr-1 text-accent-teal" />
                {{ application.platform?.label || application.platform?.name || 'Platform' }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-gray-100">
              {{ application.position }}
            </h1>

            <div class="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300">
              <Building2 class="w-4 h-4 mr-1.5 text-accent-teal" />
              <span>{{ application.company_name }}</span>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex items-center space-x-2 shrink-0">
            <Button variant="orange" @click="showHistoryModal = true">
              <Plus class="w-4 h-4 mr-1.5" />
              Update Status
            </Button>
            <Button variant="secondary" @click="showEditModal = true">
              <Pencil class="w-4 h-4" />
            </Button>
            <Button variant="danger" @click="showDeleteModal = true">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Meta info grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-primary/60 text-xs">
          <div class="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar class="w-4 h-4 mr-2 text-gray-400" />
            <span class="font-medium mr-1">Melamar pada:</span>
            <span class="font-semibold">{{ formatDate }}</span>
          </div>

          <div v-if="application.job_url" class="flex items-center min-w-0">
            <ExternalLink class="w-4 h-4 mr-2 text-accent-teal shrink-0" />
            <span class="font-medium text-gray-600 dark:text-gray-300 mr-1 shrink-0">Link Lowongan:</span>
            <a
              :href="application.job_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-accent-teal hover:underline font-semibold truncate"
            >
              {{ application.job_url }}
            </a>
          </div>
        </div>

        <!-- Initial Notes section -->
        <div v-if="application.notes" class="p-4 rounded-xl bg-slate-50 dark:bg-primary/40 border border-gray-100 dark:border-primary/60 space-y-1">
          <div class="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <FileText class="w-3.5 h-3.5 mr-1" />
            <span>Catatan Awal</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {{ application.notes }}
          </p>
        </div>
      </div>

      <!-- Chronological Visual Timeline -->
      <Timeline :histories="application.histories || []" />
    </template>

    <!-- Not Found State if invalid ID -->
    <div v-else class="p-12 text-center bg-white dark:bg-primary-dark/80 rounded-2xl border border-gray-100 dark:border-primary shadow-xs space-y-4">
      <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">
        Data Lamaran Tidak Ditemukan
      </h3>
      <p class="text-xs text-gray-500">
        Lamaran kerja yang Anda cari mungkin telah dihapus atau URL tidak valid.
      </p>
      <router-link to="/job-applications">
        <Button variant="accent">
          Kembali ke Daftar Lamaran
        </Button>
      </router-link>
    </div>

    <!-- Modals -->
    <JobFormModal
      :show="showEditModal"
      :application="application"
      @close="showEditModal = false"
    />

    <HistoryModal
      :show="showHistoryModal"
      :application-id="application?.id"
      @close="showHistoryModal = false"
    />

    <ConfirmDeleteModal
      :show="showDeleteModal"
      :application="application"
      @close="showDeleteModal = false"
      @deleted="handleDeleted"
    />
  </div>
</template>
