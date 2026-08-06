<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#325E6A',
  },
  size: {
    type: String,
    default: 'md',
    validator: (s) => ['sm', 'md', 'lg'].includes(s),
  },
})

const formattedText = computed(() => {
  if (!props.text) return ''
  return props.text.charAt(0).toUpperCase() + props.text.slice(1)
})

const badgeStyle = computed(() => {
  const hex = props.color || '#325E6A'
  return {
    backgroundColor: `${hex}1F`, // ~12% opacity
    color: hex,
    borderColor: `${hex}40`, // ~25% opacity
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs font-medium'
    case 'lg':
      return 'px-3.5 py-1.5 text-sm font-semibold'
    case 'md':
    default:
      return 'px-2.5 py-1 text-xs font-semibold'
  }
})
</script>

<template>
  <span
    :style="badgeStyle"
    :class="[
      'inline-flex items-center rounded-full border shadow-2xs transition-colors duration-200 tracking-wide',
      sizeClasses,
    ]"
  >
    <span
      class="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
      :style="{ backgroundColor: color || '#325E6A' }"
    ></span>
    <span>{{ formattedText }}</span>
  </span>
</template>
