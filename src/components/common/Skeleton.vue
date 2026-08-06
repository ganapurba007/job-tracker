<script setup>
defineProps({
  count: {
    type: Number,
    default: 6,
  },
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    <div
      v-for="i in count"
      :key="i"
      class="p-5 rounded-2xl bg-white dark:bg-primary-dark/80 border border-gray-100 dark:border-primary/60 shadow-xs space-y-4 animate-pulse"
    >
      <div class="flex items-start justify-between">
        <div class="space-y-2 flex-1 pr-4">
          <div class="h-4 bg-gray-200 dark:bg-primary rounded-md w-3/4"></div>
          <div class="h-3 bg-gray-100 dark:bg-primary/50 rounded-md w-1/2"></div>
        </div>
        <div class="h-6 w-20 bg-gray-200 dark:bg-primary rounded-full"></div>
      </div>

      <div class="space-y-2">
        <div class="h-3 bg-gray-100 dark:bg-primary/40 rounded-md w-full"></div>
        <div class="h-3 bg-gray-100 dark:bg-primary/40 rounded-md w-2/3"></div>
      </div>

      <div class="pt-3 border-t border-gray-100 dark:border-primary/40 flex items-center justify-between">
        <div class="h-4 w-24 bg-gray-200 dark:bg-primary rounded-md"></div>
        <div class="h-4 w-16 bg-gray-200 dark:bg-primary rounded-md"></div>
      </div>
    </div>
  </div>
</template>
