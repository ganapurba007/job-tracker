<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import Select2 from '@/components/common/Select2.vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import { useToastStore } from '@/stores/toastStore'
import {
  Building2,
  Briefcase,
  Globe,
  Tag,
  Calendar,
  Link as LinkIcon,
  FileText,
  Bell,
  Paperclip,
} from '@lucide/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const jobStore = useJobStore()
const refStore = useReferenceStore()
const toastStore = useToastStore()

const companyName = ref('')
const position = ref('')
const platformId = ref('')
const statusId = ref('')
const appliedAt = ref(new Date().toISOString().split('T')[0])
const followUpDate = ref('')
const jobUrl = ref('')
const attachmentUrl = ref('')
const notes = ref('')
const inlineErrors = ref({})

const platformOptions = computed(() => {
  return refStore.platforms.map(p => ({
    id: p.id,
    name: p.label || p.name,
  }))
})

const statusOptions = computed(() => {
  return refStore.statuses.map(s => ({
    id: s.id,
    name: ucfirst(s.name),
    color: s.color,
  }))
})

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      refStore.fetchReferences()
      if (props.application) {
        // Populate form for editing
        companyName.value = props.application.company_name || ''
        position.value = props.application.position || ''
        platformId.value = props.application.platform_id || ''
        statusId.value = props.application.status_id || props.application.current_status_id || ''
        appliedAt.value = props.application.applied_date || props.application.applied_at || new Date().toISOString().split('T')[0]
        followUpDate.value = props.application.follow_up_date || ''
        jobUrl.value = props.application.job_link || props.application.job_url || ''
        attachmentUrl.value = props.application.attachment_url || props.application.attachment_link || ''
        notes.value = props.application.notes || ''
      } else {
        // Reset form for new application
        companyName.value = ''
        position.value = ''
        platformId.value = refStore.platforms[0]?.id || ''
        statusId.value = refStore.statuses[0]?.id || ''
        appliedAt.value = new Date().toISOString().split('T')[0]
        followUpDate.value = ''
        jobUrl.value = ''
        attachmentUrl.value = ''
        notes.value = ''
      }
      inlineErrors.value = {}
    }
  }
)

function validateForm() {
  const errors = {}

  if (!companyName.value.trim()) {
    errors.companyName = 'Nama perusahaan wajib diisi'
  }
  if (!position.value.trim()) {
    errors.position = 'Posisi pekerjaan wajib diisi'
  }
  if (!platformId.value) {
    errors.platformId = 'Platform wajib dipilih'
  }
  if (!statusId.value) {
    errors.statusId = 'Status awal wajib dipilih'
  }
  if (!appliedAt.value) {
    errors.appliedAt = 'Tanggal lamaran wajib diisi'
  }

  inlineErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  const urlVal = jobUrl.value.trim() ? jobUrl.value.trim() : null
  const attachmentVal = attachmentUrl.value.trim() ? attachmentUrl.value.trim() : null
  const followUpVal = followUpDate.value ? followUpDate.value : null
  const notesVal = notes.value.trim() ? notes.value.trim() : null

  const payload = {
    company_name: companyName.value.trim(),
    position: position.value.trim(),
    platform_id: Number(platformId.value),
    status_id: Number(statusId.value),
    current_status_id: Number(statusId.value),
    applied_date: appliedAt.value,
    applied_at: appliedAt.value,
    follow_up_date: followUpVal,
    job_link: urlVal,
    job_url: urlVal,
    attachment_url: attachmentVal,
    notes: notesVal,
  }

  try {
    if (props.application && props.application.id) {
      await jobStore.updateApplication(props.application.id, payload)
      toastStore.showToast('Data lamaran berhasil diperbarui!', 'success')
    } else {
      await jobStore.addApplication(payload)
      toastStore.showToast('Lamaran baru berhasil ditambahkan!', 'success')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Gagal menyimpan data lamaran'
    toastStore.showToast(errorMsg, 'error')
    if (err?.response?.data?.errors) {
      inlineErrors.value = err.response.data.errors
    }
  }
}

function ucfirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <Modal
    :show="show"
    :title="application ? 'Edit Data Lamaran' : 'Tambah Lamaran Baru'"
    max-width="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <!-- Perusahaan & Posisi Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Company Name Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center">
            Nama Perusahaan <span class="text-red-500 ml-0.5">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 class="w-4 h-4" />
            </div>
            <input
              v-model="companyName"
              type="text"
              placeholder="Contoh: TechCorp"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors h-10',
                inlineErrors.companyName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
          </div>
          <p v-if="inlineErrors.companyName" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.companyName }}
          </p>
        </div>

        <!-- Position Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center">
            Posisi Pekerjaan <span class="text-red-500 ml-0.5">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase class="w-4 h-4" />
            </div>
            <input
              v-model="position"
              type="text"
              placeholder="Contoh: Frontend Developer"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors h-10',
                inlineErrors.position
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
          </div>
          <p v-if="inlineErrors.position" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.position }}
          </p>
        </div>
      </div>

      <!-- Platform & Status Select Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Platform Dropdown Select2 -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center">
            Platform Lowongan <span class="text-red-500 ml-0.5">*</span>
          </label>
          <Select2
            v-model="platformId"
            :options="platformOptions"
            placeholder="Pilih Platform"
            :icon="Globe"
            :error="!!inlineErrors.platformId"
          />
          <p v-if="inlineErrors.platformId" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.platformId }}
          </p>
        </div>

        <!-- Status Dropdown Select2 -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center">
            Status Lamaran <span class="text-red-500 ml-0.5">*</span>
          </label>
          <Select2
            v-model="statusId"
            :options="statusOptions"
            placeholder="Pilih Status"
            :icon="Tag"
            :error="!!inlineErrors.statusId"
          />
          <p v-if="inlineErrors.statusId" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.statusId }}
          </p>
        </div>
      </div>

      <!-- Applied At & Follow-up Date Grid (Aligned 100% Perfectly) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Applied At Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center justify-between">
            <span>Tanggal Melamar <span class="text-red-500">*</span></span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar class="w-4 h-4" />
            </div>
            <input
              v-model="appliedAt"
              type="date"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors h-10',
                inlineErrors.appliedAt
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
          </div>
          <p v-if="inlineErrors.appliedAt" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.appliedAt }}
          </p>
        </div>

        <!-- Follow-up Date / Interview Reminder Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center justify-between">
            <span>Jadwal Follow-up / Wawancara</span>
            <span class="text-[10px] font-normal text-slate-400">(Opsional)</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-500">
              <Bell class="w-4 h-4" />
            </div>
            <input
              v-model="followUpDate"
              type="date"
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors h-10"
            />
          </div>
        </div>
      </div>

      <!-- Job URL & Attachment URL Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Job URL Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center justify-between">
            <span>Link Lowongan</span>
            <span class="text-[10px] font-normal text-slate-400">(Opsional)</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LinkIcon class="w-4 h-4" />
            </div>
            <input
              v-model="jobUrl"
              type="url"
              placeholder="https://..."
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors h-10"
            />
          </div>
        </div>

        <!-- Attachment URL (Google Drive CV/Portfolio) Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center justify-between">
            <span>Link CV / Portofolio</span>
            <span class="text-[10px] font-normal text-slate-400">(Opsional)</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-500">
              <Paperclip class="w-4 h-4" />
            </div>
            <input
              v-model="attachmentUrl"
              type="url"
              placeholder="https://drive.google.com/..."
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors h-10"
            />
          </div>
        </div>
      </div>

      <!-- Notes Textarea -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 h-5 flex items-center justify-between">
          <span>Catatan Tambahan</span>
          <span class="text-[10px] font-normal text-slate-400">(Opsional)</span>
        </label>
        <div class="relative rounded-xl shadow-xs">
          <div class="absolute top-3 left-3 pointer-events-none text-slate-400">
            <FileText class="w-4 h-4" />
          </div>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Tuliskan catatan terkait persyaratan, gajih, atau instruksi wawancara..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          @click="emit('close')"
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="orange"
          :loading="jobStore.loading"
        >
          {{ application ? 'Simpan Perubahan' : 'Tambah Lamaran' }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
