<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import Select2 from '@/components/common/Select2.vue'
import { useJobStore } from '@/stores/jobStore'
import { useReferenceStore } from '@/stores/referenceStore'
import { useToastStore } from '@/stores/toastStore'
import { Tag, Calendar, FileText } from '@lucide/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  applicationId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const jobStore = useJobStore()
const refStore = useReferenceStore()
const toastStore = useToastStore()

const statusId = ref('')
const createdAt = ref(new Date().toISOString().split('T')[0])
const notes = ref('')
const inlineErrors = ref({})

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
      statusId.value = refStore.statuses[0]?.id || ''
      createdAt.value = new Date().toISOString().split('T')[0]
      notes.value = ''
      inlineErrors.value = {}
    }
  }
)

function validateForm() {
  const errors = {}
  if (!statusId.value) {
    errors.statusId = 'Status baru wajib dipilih'
  }
  if (!createdAt.value) {
    errors.createdAt = 'Tanggal wajib diisi'
  }
  inlineErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validateForm() || !props.applicationId) return

  const notesVal = notes.value.trim() ? notes.value.trim() : null
  try {
    await jobStore.addStatusHistory(props.applicationId, {
      status_id: Number(statusId.value),
      change_at: createdAt.value,
      created_at: createdAt.value,
      notes: notesVal,
    })

    toastStore.showToast('Riwayat status berhasil diperbarui!', 'success')
    emit('saved')
    emit('close')
  } catch (err) {
    const errorMsg = err?.response?.data?.message || 'Gagal menambahkan riwayat status'
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
    title="Update Status Lamaran"
    max-width="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>
      <!-- Status Selection Select2 -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Status Terbaru <span class="text-red-500">*</span>
        </label>
        <Select2
          v-model="statusId"
          :options="statusOptions"
          placeholder="Pilih Status Baru"
          :icon="Tag"
          :error="!!inlineErrors.statusId"
        />
        <p v-if="inlineErrors.statusId" class="mt-1 text-xs text-red-500">
          {{ inlineErrors.statusId }}
        </p>
      </div>

      <!-- Date Input -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Tanggal Perubahan <span class="text-red-500">*</span>
        </label>
        <div class="relative rounded-xl shadow-xs">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Calendar class="w-4 h-4" />
          </div>
          <input
            v-model="createdAt"
            type="date"
            :class="[
              'w-full pl-9 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[40px]',
              inlineErrors.createdAt
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
            ]"
          />
        </div>
        <p v-if="inlineErrors.createdAt" class="mt-1 text-xs text-red-500">
          {{ inlineErrors.createdAt }}
        </p>
      </div>

      <!-- Notes Textarea -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Catatan / Perkembangan (Opsional)
        </label>
        <div class="relative rounded-xl shadow-xs">
          <div class="absolute top-3 left-3 pointer-events-none text-gray-400">
            <FileText class="w-4 h-4" />
          </div>
          <textarea
            v-model="notes"
            rows="3"
            placeholder="Tuliskan catatan perkembangan (contoh: Diundang interview teknis via Google Meet)"
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
          Simpan Riwayat
        </Button>
      </div>
    </form>
  </Modal>
</template>
