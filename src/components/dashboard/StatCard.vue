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
  <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 hover:shadow-md transition-all duration-300">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {{ title }}
      </span>
      <span
        v-if="badgeText"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30"
      >
        {{ badgeText }}
      </span>
    </div>

    <div class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
      {{ value }}
    </div>

    <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 font-medium">
      {{ subtitle }}
    </p>
  </div>
</template>
