<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(val),
  },
})

const emit = defineEmits(['close'])

function handleKeydown(e) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.show,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-primary-dark/60 dark:bg-black/70 backdrop-blur-xs"
        @click.self="emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            :class="[
              'w-full bg-white dark:bg-primary-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-primary p-6 space-y-4 my-8 overflow-hidden transform text-left align-middle transition-all',
              maxWidth === 'sm' ? 'max-w-sm' : '',
              maxWidth === 'md' ? 'max-w-md' : '',
              maxWidth === 'lg' ? 'max-w-lg' : '',
              maxWidth === 'xl' ? 'max-w-xl' : '',
              maxWidth === '2xl' ? 'max-w-2xl' : '',
            ]"
          >
            <!-- Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-primary/60">
              <h3 class="text-lg font-bold text-primary-dark dark:text-gray-100">
                {{ title }}
              </h3>
              <button
                type="button"
                @click="emit('close')"
                class="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary/60 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Body Content -->
            <div>
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
