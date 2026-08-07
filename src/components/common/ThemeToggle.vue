<script setup>
import { useThemeStore } from '@/stores/themeStore'
import { Sun, Moon } from '@lucide/vue'

const themeStore = useThemeStore()
</script>

<template>
  <button
    type="button"
    @click="themeStore.toggleTheme"
    class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-2xs flex items-center space-x-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
    :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun
      v-if="themeStore.isDark"
      class="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-300 rotate-0 hover:rotate-45"
    />
    <Moon
      v-else
      class="w-4 h-4 text-slate-700 shrink-0 transition-transform duration-300 rotate-0 hover:-rotate-12"
    />
    <span class="text-xs font-bold uppercase tracking-wider hidden sm:inline">
      {{ themeStore.isDark ? 'Dark' : 'Light' }}
    </span>
  </button>
</template>
