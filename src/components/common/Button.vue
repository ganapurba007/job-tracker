<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'accent', 'orange', 'danger', 'ghost'].includes(v),
  },
  type: {
    type: String,
    default: 'button',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary hover:bg-primary-dark text-white shadow-xs focus:ring-accent-teal'
    case 'accent':
      return 'bg-accent-teal hover:opacity-90 text-white shadow-xs focus:ring-primary'
    case 'orange':
      return 'bg-accent-orange hover:opacity-90 text-white shadow-xs focus:ring-accent-teal font-semibold'
    case 'secondary':
      return 'bg-gray-200 dark:bg-primary text-primary-dark dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-primary-dark focus:ring-accent-teal'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-400'
    case 'ghost':
      return 'bg-transparent text-primary-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-primary/40 focus:ring-accent-teal'
    default:
      return 'bg-primary text-white'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="(e) => emit('click', e)"
    :class="[
      'inline-flex items-center justify-center font-medium px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]',
      fullWidth ? 'w-full' : '',
      variantClasses,
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot />
  </button>
</template>
