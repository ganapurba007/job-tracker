<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { Briefcase, Sparkles, LogOut, Loader2, UserPlus, LogIn } from '@lucide/vue'

const authStore = useAuthStore()

const isVisible = computed(() => authStore.isAuthenticating)
const mode = computed(() => authStore.authMode || 'login')

const titleText = computed(() => {
  switch (mode.value) {
    case 'demo':
      return 'Menyiapkan Akun Demo'
    case 'register':
      return 'Membuat Akun Baru'
    case 'logout':
      return 'Keluar dari Sesi'
    case 'login':
    default:
      return 'Proses Masuk Akun'
  }
})

const subtitleText = computed(() => {
  if (authStore.authMessage) return authStore.authMessage
  switch (mode.value) {
    case 'demo':
      return 'Mempersiapkan data sampel & hak akses portofolio...'
    case 'register':
      return 'Mendaftarkan kredensial dan menyiapkan workspace...'
    case 'logout':
      return 'Membersihkan kredensial lokal dan menutup sesi aman...'
    case 'login':
    default:
      return 'Verifikasi kata sandi dan memuat data lamaran...'
  }
})

const iconComponent = computed(() => {
  switch (mode.value) {
    case 'demo':
      return Sparkles
    case 'register':
      return UserPlus
    case 'logout':
      return LogOut
    case 'login':
    default:
      return LogIn
  }
})
</script>

<template>
  <Transition name="auth-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300"
    >
      <div class="relative w-full max-w-sm p-6 sm:p-8 bg-white/95 dark:bg-slate-900/95 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 text-center space-y-6 overflow-hidden">
        <!-- Ambient Glowing Background Circles -->
        <div class="absolute -top-12 -left-12 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
        <div class="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>

        <!-- Center Icon with Rotating Spinner Ring -->
        <div class="relative inline-flex items-center justify-center">
          <!-- Animated Spinner Ring -->
          <div class="w-20 h-20 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-teal-600 dark:border-t-teal-400 border-r-orange-500 animate-spin"></div>

          <!-- Center Icon Badge -->
          <div class="absolute w-12 h-12 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 scale-105">
            <component :is="iconComponent" class="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <!-- Text Messaging -->
        <div class="space-y-1.5 relative z-10">
          <h3 class="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {{ titleText }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            {{ subtitleText }}
          </p>
        </div>

        <!-- Animated Progress Bar -->
        <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
          <div class="bg-gradient-to-r from-teal-500 to-orange-500 h-full rounded-full w-full animate-indeterminate"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.auth-fade-enter-from,
.auth-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-indeterminate {
  animation: indeterminate 1.5s infinite ease-in-out;
}
</style>
