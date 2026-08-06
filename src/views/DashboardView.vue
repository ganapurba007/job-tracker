<script setup>
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/common/Button.vue'
import { Sparkles, Briefcase, Plus, CheckCircle } from '@lucide/vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg space-y-3">
      <div class="flex items-center space-x-2 text-accent-teal text-sm font-semibold">
        <Sparkles class="w-5 h-5 text-accent-orange" />
        <span>Dashboard Analytics</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold">
        Selamat Datang, {{ authStore.user?.name || 'Pengguna' }}!
      </h1>
      <p class="text-gray-300 text-sm max-w-2xl">
        Kelola dan pantau seluruh status lamaran pekerjaan Anda secara real-time.
      </p>
    </div>

    <!-- Quick Indicator Cards Demo -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark border border-gray-100 dark:border-primary shadow-xs space-y-2">
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Total Lamaran
        </div>
        <div class="text-3xl font-extrabold text-primary-dark dark:text-gray-100">
          0
        </div>
        <div class="text-xs text-accent-teal font-medium flex items-center">
          <CheckCircle class="w-3.5 h-3.5 mr-1" /> Siap digunakan
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark border border-gray-100 dark:border-primary shadow-xs space-y-2">
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Response Rate
        </div>
        <div class="text-3xl font-extrabold text-accent-orange">
          0%
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Persentase lamaran direspon
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark border border-gray-100 dark:border-primary shadow-xs space-y-2 flex flex-col justify-between">
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Tindakan Cepat
        </div>
        <router-link to="/job-applications">
          <Button variant="accent" full-width>
            <Plus class="w-4 h-4 mr-2" />
            Tambah Lamaran
          </Button>
        </router-link>
      </div>
    </div>
  </div>
</template>
