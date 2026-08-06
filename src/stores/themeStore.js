import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function applyTheme(dark) {
    isDark.value = dark
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  function initTheme() {
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
    if (savedTheme) {
      applyTheme(savedTheme === 'dark')
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(systemDark)
    }
  }

  function toggleTheme() {
    const nextTheme = !isDark.value
    applyTheme(nextTheme)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', nextTheme ? 'dark' : 'light')
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
    applyTheme,
  }
})
