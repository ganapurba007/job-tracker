<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-primary-dark text-primary-dark dark:text-gray-100 transition-colors duration-300">
    <header class="p-4 border-b border-gray-200 dark:border-primary flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center space-x-3">
        <h1 class="text-xl font-bold text-primary dark:text-accent-teal">Job Tracker</h1>
      </div>
      <ThemeToggle />
    </header>

    <main class="max-w-7xl mx-auto p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</template>
