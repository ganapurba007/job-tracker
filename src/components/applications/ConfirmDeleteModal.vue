<script setup>
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import { useJobStore } from '@/stores/jobStore'
import { useToastStore } from '@/stores/toastStore'
import { AlertTriangle } from '@lucide/vue'

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

const emit = defineEmits(['close', 'deleted'])

const jobStore = useJobStore()
const toastStore = useToastStore()

async function handleConfirmDelete() {
  if (!props.application || !props.application.id) return
  await jobStore.deleteApplication(props.application.id)
  toastStore.showToast('Lamaran berhasil dihapus.', 'info')
  emit('deleted')
  emit('close')
}
</script>

<template>
  <Modal
    :show="show"
    title="Hapus Lamaran Kerja"
    max-width="sm"
    @close="emit('close')"
  >
    <div class="space-y-4 text-center">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
        <AlertTriangle class="w-7 h-7" />
      </div>

      <div class="space-y-1">
        <h4 class="text-base font-bold text-primary-dark dark:text-gray-100">
          Apakah Anda yakin ingin menghapus?
        </h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Lamaran posisi <span class="font-semibold text-primary-dark dark:text-gray-200">"{{ application?.position }}"</span> di <span class="font-semibold text-primary-dark dark:text-gray-200">{{ application?.company_name }}</span> akan dihapus secara permanen.
        </p>
      </div>

      <div class="pt-2 flex items-center justify-center space-x-2">
        <Button
          type="button"
          variant="secondary"
          @click="emit('close')"
        >
          Batal
        </Button>
        <Button
          type="button"
          variant="danger"
          :loading="jobStore.loading"
          @click="handleConfirmDelete"
        >
          Hapus Permanen
        </Button>
      </div>
    </div>
  </Modal>
</template>
