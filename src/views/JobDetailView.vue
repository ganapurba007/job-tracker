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
import { ArrowLeft, Building2, Globe, Calendar, ExternalLink, PlusCircle, Pencil, Trash2, FileText, AlertCircle } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const refStore = useReferenceStore()

const showFormModal = ref(false)
const showHistoryModal = ref(false)
const showDeleteModal = ref(false)

const appId = computed(() => route.params.id)

const application = computed(() => {
  return jobStore.applications.find((a) => String(a.id) === String(appId.value)) || null
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
                {{ application.platform?.name || 'Platform' }}
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

          <!-- Quick Action Buttons -->
          <div class="flex items-center space-x-2 shrink-0">
            <Button
              variant="orange"
              @click="showHistoryModal = true"
            >
              <PlusCircle class="w-4 h-4 mr-1.5" />
              Update Status
            </Button>
            <Button
              variant="secondary"
              @click="showFormModal = true"
              title="Edit Data"
            >
              <Pencil class="w-4 h-4" />
            </Button>
            <Button
              variant="danger"
              @click="showDeleteModal = true"
              title="Hapus Lamaran"
            >
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </div>

        <!-- Meta Info Grid -->
        <div class="pt-4 border-t border-gray-100 dark:border-primary/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Calendar class="w-4 h-4 text-accent-teal" />
            <span>Tanggal Melamar: <strong class="text-primary-dark dark:text-gray-100">{{ formatDate }}</strong></span>
          </div>

          <div v-if="application.job_url" class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 truncate">
            <ExternalLink class="w-4 h-4 text-accent-teal shrink-0" />
            <span class="truncate">Link:
              <a
                :href="application.job_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent-teal font-semibold hover:underline"
              >
                {{ application.job_url }}
              </a>
            </span>
          </div>
        </div>

        <!-- Initial Notes Card -->
        <div v-if="application.notes" class="p-4 rounded-xl bg-gray-50 dark:bg-primary/40 border border-gray-100 dark:border-primary/50 space-y-1">
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FileText class="w-3.5 h-3.5 text-accent-teal" />
            <span>Catatan Awal:</span>
          </div>
          <p class="text-xs text-primary-dark dark:text-gray-200">
            {{ application.notes }}
          </p>
        </div>
      </div>

      <!-- Vertical Visual Timeline Section -->
      <div class="bg-white dark:bg-primary-dark/90 rounded-2xl border border-gray-100 dark:border-primary p-6 shadow-sm">
        <Timeline :histories="application.histories" />
      </div>
    </template>

    <!-- Not Found Fallback -->
    <div
      v-else
      class="py-16 px-4 text-center bg-white dark:bg-primary-dark rounded-2xl border border-gray-100 dark:border-primary space-y-4"
    >
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto">
        <AlertCircle class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold text-primary-dark dark:text-gray-100">
        Lamaran Kerja Tidak Ditemukan
      </h3>
      <router-link to="/job-applications">
        <Button variant="accent">
          Kembali ke Daftar Lamaran
        </Button>
      </router-link>
    </div>

    <!-- Modals -->
    <JobFormModal
      :show="showFormModal"
      :application="application"
      @close="showFormModal = false"
    />

    <HistoryModal
      :show="showHistoryModal"
      :application-id="appId"
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
