<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/common/Navbar.vue'
import Toast from '@/components/common/Toast.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()

onMounted(() => {
  themeStore.initTheme()
  authStore.initAuth()
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
    <Navbar />

    <main class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <RouterView />
    </main>

    <Toast />
  </div>
</template>
