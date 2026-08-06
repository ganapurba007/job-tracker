<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import { useToastStore } from '@/stores/toastStore'
import { Building2, Briefcase, Globe, Tag, Calendar, Link as LinkIcon, FileText } from '@lucide/vue'

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
const jobUrl = ref('')
const notes = ref('')
const inlineErrors = ref({})

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
        statusId.value = props.application.status_id || ''
        appliedAt.value = props.application.applied_date || props.application.applied_at || new Date().toISOString().split('T')[0]
        jobUrl.value = props.application.job_url || ''
        notes.value = props.application.notes || ''
      } else {
        // Reset form for new application
        companyName.value = ''
        position.value = ''
        platformId.value = refStore.platforms[0]?.id || ''
        statusId.value = refStore.statuses[0]?.id || ''
        appliedAt.value = new Date().toISOString().split('T')[0]
        jobUrl.value = ''
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
  const notesVal = notes.value.trim() ? notes.value.trim() : null

  const payload = {
    company_name: companyName.value.trim(),
    position: position.value.trim(),
    platform_id: Number(platformId.value),
    status_id: Number(statusId.value),
    current_status_id: Number(statusId.value),
    applied_date: appliedAt.value,
    applied_at: appliedAt.value,
    job_link: urlVal,
    job_url: urlVal,
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
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Nama Perusahaan <span class="text-red-500">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Building2 class="w-4 h-4" />
            </div>
            <input
              v-model="companyName"
              type="text"
              placeholder="Contoh: TechCorp"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
                inlineErrors.companyName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            />
          </div>
          <p v-if="inlineErrors.companyName" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.companyName }}
          </p>
        </div>

        <!-- Position Input -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Posisi Pekerjaan <span class="text-red-500">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Briefcase class="w-4 h-4" />
            </div>
            <input
              v-model="position"
              type="text"
              placeholder="Contoh: Frontend Developer"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
                inlineErrors.position
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
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
        <!-- Platform Dropdown -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Platform Lowongan <span class="text-red-500">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Globe class="w-4 h-4" />
            </div>
            <select
              v-model="platformId"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
                inlineErrors.platformId
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            >
              <option value="" disabled>Pilih Platform</option>
              <option
                v-for="platform in refStore.platforms"
                :key="platform.id"
                :value="platform.id"
              >
                {{ platform.label || platform.name }}
              </option>
            </select>
          </div>
          <p v-if="inlineErrors.platformId" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.platformId }}
          </p>
        </div>

        <!-- Status Dropdown -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Status Lamaran <span class="text-red-500">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Tag class="w-4 h-4" />
            </div>
            <select
              v-model="statusId"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
                inlineErrors.statusId
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            >
              <option value="" disabled>Pilih Status</option>
              <option
                v-for="status in refStore.statuses"
                :key="status.id"
                :value="status.id"
              >
                {{ ucfirst(status.name) }}
              </option>
            </select>
          </div>
          <p v-if="inlineErrors.statusId" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.statusId }}
          </p>
        </div>
      </div>

      <!-- Applied At & Job URL Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Applied At Input -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Tanggal Melamar <span class="text-red-500">*</span>
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Calendar class="w-4 h-4" />
            </div>
            <input
              v-model="appliedAt"
              type="date"
              :class="[
                'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
                inlineErrors.appliedAt
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            />
          </div>
          <p v-if="inlineErrors.appliedAt" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.appliedAt }}
          </p>
        </div>

        <!-- Job URL Input -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Link Lowongan Pekerjaan (Opsional)
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <LinkIcon class="w-4 h-4" />
            </div>
            <input
              v-model="jobUrl"
              type="url"
              placeholder="https://..."
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal transition-colors min-h-[40px]"
            />
          </div>
        </div>
      </div>

      <!-- Notes Textarea -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Catatan Tambahan (Opsional)
        </label>
        <div class="relative rounded-xl shadow-xs">
          <div class="absolute top-3 left-3 pointer-events-none text-gray-400">
            <FileText class="w-4 h-4" />
          </div>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Tuliskan catatan terkait persyaratan, gajih, atau instruksi wawancara..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-primary/60 bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal transition-colors"
          ></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-3 border-t border-gray-100 dark:border-primary/60 flex items-center justify-end space-x-2">
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
