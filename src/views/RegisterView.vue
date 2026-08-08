<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button.vue'
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const inlineErrors = ref({})

function validateForm() {
  const errors = {}

  if (!name.value) {
    errors.name = 'Nama lengkap tidak boleh kosong'
  }

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

  if (!passwordConfirmation.value) {
    errors.passwordConfirmation = 'Konfirmasi password wajib diisi'
  } else if (passwordConfirmation.value !== password.value) {
    errors.passwordConfirmation = 'Konfirmasi password tidak cocok'
  }

  inlineErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleRegister() {
  if (!validateForm()) return

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    router.push('/dashboard')
  } catch (err) {
    // Error is saved in store
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-1">
          <UserPlus class="w-6 h-6" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Buat Akun Baru
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Kelola seluruh lamaran kerja Anda di satu tempat
        </p>
      </div>

      <!-- General Error Alert -->
      <div
        v-if="authStore.error"
        class="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm"
      >
        {{ authStore.error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4" novalidate>
        <!-- Name Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Nama Lengkap
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User class="w-4 h-4" />
            </div>
            <input
              v-model="name"
              type="text"
              placeholder="John Doe"
              :class="[
                'w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.name
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
          </div>
          <p v-if="inlineErrors.name" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.name }}
          </p>
        </div>

        <!-- Email Input -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Alamat Email
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail class="w-4 h-4" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              :class="[
                'w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
          </div>
          <p v-if="inlineErrors.email" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.email }}
          </p>
        </div>

        <!-- Password Input with Eye Toggle -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="[
                'w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.password
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
              :title="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="inlineErrors.password" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.password }}
          </p>
        </div>

        <!-- Password Confirmation Input with Eye Toggle -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Konfirmasi Password
          </label>
          <div class="relative rounded-xl shadow-xs">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="passwordConfirmation"
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="••••••••"
              :class="[
                'w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-colors min-h-[44px]',
                inlineErrors.passwordConfirmation
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500',
              ]"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              :aria-label="showPasswordConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'"
              :title="showPasswordConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'"
            >
              <EyeOff v-if="showPasswordConfirm" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
          <p v-if="inlineErrors.passwordConfirmation" class="mt-1 text-xs text-red-500">
            {{ inlineErrors.passwordConfirmation }}
          </p>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="accent"
          full-width
          :loading="authStore.loading"
        >
          Daftar Akun
        </Button>
      </form>

      <!-- Footer Link -->
      <div class="text-center text-xs text-slate-500 dark:text-slate-400">
        Sudah memiliki akun?
        <router-link
          to="/login"
          class="font-semibold text-teal-600 dark:text-teal-400 hover:underline ml-1"
        >
          Masuk sekarang
        </router-link>
      </div>
    </div>
  </div>
</template>
