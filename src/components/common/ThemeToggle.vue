<script setup>
import { useThemeStore } from '@/stores/themeStore'
import { Sun, Moon } from '@lucide/vue'

const themeStore = useThemeStore()
</script>

<template>
  <button
    type="button"
    @click="themeStore.toggleTheme"
    class="p-2.5 rounded-xl border border-gray-200 dark:border-primary bg-white dark:bg-primary-dark text-primary-dark dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-primary transition-all duration-300 shadow-xs flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-teal"
    :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun
      v-if="themeStore.isDark"
      class="w-5 h-5 text-accent-orange transition-transform duration-300 rotate-0 hover:rotate-45"
    />
    <Moon
      v-else
      class="w-5 h-5 text-primary transition-transform duration-300 rotate-0 hover:-rotate-12"
    />
  </button>
</template>
