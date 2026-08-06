<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button.vue'
import { Mail, Lock, Sparkles, LogIn } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const inlineErrors = ref({})

function validateForm() {
  const errors = {}
  if (!email.value) {
    errors.email = 'Email tidak boleh kosong'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.email = 'Format email tidak valid'
  }

  if (!password.value) {
    errors.password = 'Password tidak boleh kosong'
  } else if (password.value.length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }

  inlineErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleLogin() {
  if (!validateForm()) return

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    // Error is set in store
  }
}

async function handleDemoLogin() {
  try {
    await authStore.demoLogin()
    router.push('/dashboard')
  } catch (err) {
    // Handled
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-white dark:bg-primary-dark/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-primary p-6 sm:p-8 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal mb-1">
          <LogIn class="w-6 h-6" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-primary-dark dark:text-gray-100">
          Selamat Datang Kembali
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Masuk ke akun Job Application Tracker Anda
        </p>
      </div>

      <!-- 1 Click Demo Login Banner for Recruiters / Portfolio Visitors -->
      <div class="p-4 rounded-xl bg-accent-orange/10 dark:bg-accent-orange/15 border border-accent-orange/30 space-y-3">
        <div class="flex items-center space-x-2 text-accent-orange font-semibold text-sm">
          <Sparkles class="w-4 h-4 shrink-0" />
          <span>Pengunjung Portfolio / Recruiter?</span>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300">
          Coba aplikasi secara langsung tanpa perlu mendaftar dari awal dengan 1-Click Demo Login.
        </p>
        <Button
          type="button"
          variant="orange"
          full-width
          :loading="authStore.loading"
          @click="handleDemoLogin"
        >
          <Sparkles class="w-4 h-4 mr-2" />
          1 Click Demo Login
        </Button>
      </div>

      <div class="relative flex items-center justify-center">
        <div class="border-t border-gray-200 dark:border-primary w-full"></div>
        <span class="bg-white dark:bg-primary-dark px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
          atau masuk dengan email
        </span>
      </div>

      <!-- General Error Alert -->
      <div
        v-if="authStore.error"
        class="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm flex items-start space-x-2"
      >
        <span>{{ authStore.error }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
        <!-- Email Input -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Alamat Email
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail class="w-4 h-4" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              :class="[
                'w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            />
          </div>
          <p v-if="inlineErrors.email" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.email }}
          </p>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              :class="[
                'w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-primary text-primary-dark dark:text-gray-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.password
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-200 dark:border-primary/60 focus:ring-accent-teal',
              ]"
            />
          </div>
          <p v-if="inlineErrors.password" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.password }}
          </p>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="accent"
          full-width
          :loading="authStore.loading"
        >
          Masuk ke Akun
        </Button>
      </form>

      <!-- Footer Link -->
      <div class="text-center text-xs text-gray-500 dark:text-gray-400">
        Belum memiliki akun?
        <router-link
          to="/register"
          class="font-semibold text-accent-teal hover:underline ml-1"
        >
          Daftar sekarang
        </router-link>
      </div>
    </div>
  </div>
</template>
