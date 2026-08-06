<script setup>
import { useToastStore } from '@/stores/toastStore'
import { CheckCircle2, AlertCircle, Info, X } from '@lucide/vue'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="toastStore.visible"
        class="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-primary-dark rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-primary flex items-center justify-between space-x-3 pointer-events-auto"
      >
        <div class="flex items-center space-x-3 min-w-0">
          <CheckCircle2
            v-if="toastStore.type === 'success'"
            class="w-5 h-5 text-emerald-500 shrink-0"
          />
          <AlertCircle
            v-else-if="toastStore.type === 'error'"
            class="w-5 h-5 text-red-500 shrink-0"
          />
          <Info
            v-else
            class="w-5 h-5 text-accent-teal shrink-0"
          />

          <p class="text-xs font-semibold text-primary-dark dark:text-gray-100 truncate">
            {{ toastStore.message }}
          </p>
        </div>

        <button
          type="button"
          @click="toastStore.hideToast()"
          class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer shrink-0"
          aria-label="Tutup notifikasi"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
