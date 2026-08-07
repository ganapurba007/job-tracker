<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/jobStore'
import { useToastStore } from '@/stores/toastStore'
import Badge from '@/components/common/Badge.vue'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import Timeline from '@/components/applications/Timeline.vue'
import JobFormModal from '@/components/applications/JobFormModal.vue'
import HistoryModal from '@/components/applications/HistoryModal.vue'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Globe,
  ExternalLink,
  Pencil,
  Trash2,
  Plus,
  FileText,
  Clock,
  Loader2,
  AlertCircle,
  Bell,
  Paperclip,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const toastStore = useToastStore()

const showEditModal = ref(false)
const showHistoryModal = ref(false)
const showDeleteModal = ref(false)

const applicationId = computed(() => route.params.id)
const application = computed(() => jobStore.currentApplication)

const formatDate = computed(() => {
  if (!application.value) return '-'
  const dateVal = application.value.applied_date || application.value.applied_at
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

const formatFollowUpDate = computed(() => {
  if (!application.value || !application.value.follow_up_date) return null
  try {
    const d = new Date(application.value.follow_up_date)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch (e) {
    return application.value.follow_up_date
  }
})

async function loadDetail() {
  if (!applicationId.value) return
  try {
    const res = await jobStore.fetchApplication(applicationId.value)
    if (!res && !jobStore.currentApplication) {
      await jobStore.fetchApplications()
      const found = jobStore.applications.find(a => String(a.id) === String(applicationId.value))
      if (found) {
        jobStore.currentApplication = found
      }
    }
  } catch (err) {
    toastStore.showToast('Gagal memuat detail lamaran', 'error')
  }
}

async function handleDelete() {
  try {
    await jobStore.deleteApplication(applicationId.value)
    toastStore.showToast('Lamaran berhasil dihapus', 'success')
    router.push('/job-applications')
  } catch (err) {
    toastStore.showToast('Gagal menghapus lamaran', 'error')
  } finally {
    showDeleteModal.value = false
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Navigation Back Link -->
    <div>
      <router-link
        to="/job-applications"
        class="inline-flex items-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        <span>Kembali ke Daftar Lamaran</span>
      </router-link>
    </div>

    <!-- Loading State -->
    <div
      v-if="jobStore.loading && !application"
      class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
    >
      <Loader2 class="w-8 h-8 mx-auto text-teal-600 dark:text-teal-400 animate-spin" />
      <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Memuat detail data lamaran...
      </p>
    </div>

    <!-- Application Found View -->
    <template v-else-if="application">
      <!-- Main Application Banner Header -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div class="space-y-2 flex-1 min-w-0">
            <div class="flex items-center space-x-2 flex-wrap gap-y-2">
              <Badge
                :text="application.status?.name || 'Status'"
                :color="application.status?.color || '#325E6A'"
                size="lg"
              />
              <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <Globe class="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                {{ application.platform?.label || application.platform?.name || 'Platform' }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {{ application.position }}
            </h1>

            <div class="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Building2 class="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
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

        <!-- Follow-up / Interview Reminder Banner if available -->
        <div
          v-if="application.follow_up_date"
          class="p-4 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 flex items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center space-x-2.5 text-orange-600 dark:text-orange-400 font-bold">
            <Bell class="w-5 h-5 shrink-0 animate-pulse" />
            <div>
              <div class="text-xs uppercase tracking-wider font-bold">Jadwal Wawancara / Follow-up:</div>
              <div class="text-sm font-extrabold text-slate-900 dark:text-slate-100">{{ formatFollowUpDate }}</div>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-orange-500 text-white font-bold text-[10px] uppercase tracking-wider shrink-0">
            Pengingat Aktif
          </span>
        </div>

        <!-- Meta info grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div class="flex items-center text-slate-600 dark:text-slate-300">
            <Calendar class="w-4 h-4 mr-2 text-slate-400" />
            <span class="font-medium mr-1">Melamar pada:</span>
            <span class="font-bold text-slate-900 dark:text-slate-100">{{ formatDate }}</span>
          </div>

          <div v-if="application.job_link || application.job_url" class="flex items-center min-w-0">
            <ExternalLink class="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400 shrink-0" />
            <span class="font-medium text-slate-600 dark:text-slate-300 mr-1 shrink-0">Link Lowongan:</span>
            <a
              :href="application.job_link || application.job_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-teal-600 dark:text-teal-400 hover:underline font-bold truncate"
            >
              {{ application.job_link || application.job_url }}
            </a>
          </div>

          <div v-if="application.attachment_url" class="flex items-center min-w-0 sm:col-span-2">
            <Paperclip class="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400 shrink-0" />
            <span class="font-medium text-slate-600 dark:text-slate-300 mr-1 shrink-0">Berkas CV / Portofolio:</span>
            <a
              :href="application.attachment_url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-teal-600 dark:text-teal-400 hover:underline font-bold truncate flex items-center"
            >
              <span>{{ application.attachment_url }}</span>
              <ExternalLink class="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        <!-- Notes Card if available -->
        <div v-if="application.notes" class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <FileText class="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Catatan Lamaran</span>
          </div>
          <p class="text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed whitespace-pre-line">
            {{ application.notes }}
          </p>
        </div>
      </div>

      <!-- History Timeline Section -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div class="flex items-center space-x-2">
            <Clock class="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Riwayat Perubahan Status
            </h2>
          </div>

          <Button variant="ghost" size="sm" @click="showHistoryModal = true">
            <Plus class="w-4 h-4 mr-1" />
            Tambah Riwayat
          </Button>
        </div>

        <Timeline :histories="application.histories || application.status_histories || []" />
      </div>
    </template>

    <!-- Error / Not Found State -->
    <div
      v-else
      class="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
    >
      <AlertCircle class="w-10 h-10 mx-auto text-red-500" />
      <div class="space-y-1">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
          Data Lamaran Tidak Ditemukan
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Lamaran pekerjaan yang Anda cari tidak ada atau mungkin telah dihapus.
        </p>
      </div>
      <router-link to="/job-applications">
        <Button variant="accent">Kembali ke Daftar Lamaran</Button>
      </router-link>
    </div>

    <!-- Modals -->
    <JobFormModal
      :show="showEditModal"
      :application="application"
      @close="showEditModal = false"
      @saved="loadDetail"
    />

    <HistoryModal
      :show="showHistoryModal"
      :application-id="applicationId"
      @close="showHistoryModal = false"
      @saved="loadDetail"
    />

    <Modal
      :show="showDeleteModal"
      title="Konfirmasi Hapus Lamaran"
      max-width="sm"
      @close="showDeleteModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Apakah Anda yakin ingin menghapus data lamaran untuk posisi
          <strong class="text-slate-900 dark:text-slate-100">{{ application?.position }}</strong> di
          <strong class="text-slate-900 dark:text-slate-100">{{ application?.company_name }}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div class="flex items-center justify-end space-x-2 pt-2">
          <Button variant="secondary" @click="showDeleteModal = false">
            Batal
          </Button>
          <Button variant="danger" :loading="jobStore.loading" @click="handleDelete">
            Hapus Permanen
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
