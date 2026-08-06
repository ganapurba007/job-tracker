<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Search, Check, X } from '@lucide/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Pilih...',
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') return null
  return props.options.find(opt => {
    const val = typeof opt === 'object' ? (opt[props.valueKey] !== undefined ? opt[props.valueKey] : opt.value) : opt
    return String(val) === String(props.modelValue)
  })
})

const selectedLabel = computed(() => {
  if (!selectedOption.value) return ''
  if (typeof selectedOption.value === 'object') {
    return selectedOption.value[props.labelKey] || selectedOption.value.label || selectedOption.value.name || ''
  }
  return selectedOption.value
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) return props.options
  const q = searchQuery.value.toLowerCase().trim()
  return props.options.filter(opt => {
    const label = typeof opt === 'object'
      ? (opt[props.labelKey] || opt.label || opt.name || '')
      : String(opt)
    return String(label).toLowerCase().includes(q)
  })
})

function getOptionValue(opt) {
  if (typeof opt === 'object') {
    return opt[props.valueKey] !== undefined ? opt[props.valueKey] : opt.value
  }
  return opt
}

function getOptionLabel(opt) {
  if (typeof opt === 'object') {
    return opt[props.labelKey] || opt.label || opt.name || ''
  }
  return String(opt)
}

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

function selectOption(opt) {
  const val = getOptionValue(opt)
  emit('update:modelValue', val)
  emit('change', val)
  isOpen.value = false
  searchQuery.value = ''
}

function clearSelection(e) {
  e.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  searchQuery.value = ''
}

function handleClickOutside(event) {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="selectRef" class="relative w-full">
    <!-- Main Select Input Control -->
    <button
      type="button"
      :disabled="disabled"
      @click="toggleDropdown"
      :class="[
        'w-full flex items-center justify-between pl-3 pr-3 py-2 rounded-xl border bg-white dark:bg-primary text-left text-sm transition-all duration-200 min-h-[40px]',
        disabled ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-primary/40' : 'cursor-pointer',
        error
          ? 'border-red-500 focus:ring-2 focus:ring-red-400'
          : isOpen
            ? 'border-accent-teal ring-2 ring-accent-teal/20 shadow-sm'
            : 'border-gray-200 dark:border-primary/60 hover:border-gray-300 dark:hover:border-primary/80',
      ]"
    >
      <div class="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
        <!-- Optional Left Icon -->
        <component :is="icon" v-if="icon" class="w-4 h-4 text-gray-400 shrink-0" />

        <!-- Status Dot if option has color -->
        <span
          v-if="selectedOption && typeof selectedOption === 'object' && selectedOption.color"
          class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
          :style="{ backgroundColor: selectedOption.color }"
        ></span>

        <!-- Selected Label or Placeholder -->
        <span
          v-if="selectedOption"
          class="font-semibold text-primary-dark dark:text-gray-100 truncate"
        >
          {{ selectedLabel }}
        </span>
        <span v-else class="text-gray-400 dark:text-gray-500 truncate">
          {{ placeholder }}
        </span>
      </div>

      <!-- Action Control Icons -->
      <div class="flex items-center space-x-1 shrink-0 text-gray-400">
        <button
          v-if="modelValue !== '' && modelValue !== null && modelValue !== undefined && !disabled"
          type="button"
          @click="clearSelection"
          class="p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-primary/80 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          title="Hapus Pilihan"
        >
          <X class="w-3.5 h-3.5" />
        </button>
        <ChevronDown
          :class="[
            'w-4 h-4 transition-transform duration-200',
            isOpen ? 'rotate-180 text-accent-teal' : '',
          ]"
        />
      </div>
    </button>

    <!-- Select2 Popover Dropdown Menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-1"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl bg-white dark:bg-primary-dark border border-gray-200 dark:border-primary shadow-xl overflow-hidden py-1.5 space-y-1"
      >
        <!-- Select2 Real-Time Search Box -->
        <div v-if="searchable && options.length > 4" class="px-2 pt-1 pb-1.5 border-b border-gray-100 dark:border-primary/60">
          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari..."
              class="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-primary/60 bg-gray-50 dark:bg-primary text-xs text-primary-dark dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-accent-teal"
              @click.stop
            />
          </div>
        </div>

        <!-- Options List -->
        <div class="max-h-56 overflow-y-auto custom-scrollbar px-1">
          <template v-if="filteredOptions.length > 0">
            <button
              v-for="opt in filteredOptions"
              :key="getOptionValue(opt)"
              type="button"
              @click="selectOption(opt)"
              :class="[
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer my-0.5',
                String(getOptionValue(opt)) === String(modelValue)
                  ? 'bg-accent-teal/10 text-accent-teal dark:bg-accent-teal/20 font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary/80',
              ]"
            >
              <div class="flex items-center space-x-2.5 min-w-0 pr-2">
                <!-- Option Color Dot if available -->
                <span
                  v-if="typeof opt === 'object' && opt.color"
                  class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  :style="{ backgroundColor: opt.color }"
                ></span>
                <span class="truncate">{{ getOptionLabel(opt) }}</span>
              </div>

              <!-- Selected Checkmark Icon -->
              <Check
                v-if="String(getOptionValue(opt)) === String(modelValue)"
                class="w-4 h-4 text-accent-teal shrink-0"
              />
            </button>
          </template>

          <div v-else class="px-3 py-3 text-center text-xs text-gray-400 font-medium">
            Tidak ada pilihan yang cocok
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
