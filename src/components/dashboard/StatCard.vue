<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  badgeText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark/90 border border-gray-100 dark:border-primary/80 shadow-xs space-y-3 hover:shadow-md transition-all duration-300">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {{ title }}
      </span>
      <span
        v-if="badgeText"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-teal/10 text-accent-teal border border-accent-teal/30"
      >
        {{ badgeText }}
      </span>
    </div>

    <div class="text-3xl font-extrabold text-primary-dark dark:text-gray-100">
      {{ value }}
    </div>

    <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 font-medium">
      {{ subtitle }}
    </p>
  </div>
</template>
