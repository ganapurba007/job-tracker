<script setup>
import Button from '@/components/common/Button.vue'
import { FileQuestion, ArrowLeft } from '@lucide/vue'
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
    <div class="max-w-md w-full bg-white dark:bg-primary-dark/80 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-primary p-8 shadow-xl space-y-6">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal">
        <FileQuestion class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <h1 class="text-4xl font-extrabold text-primary-dark dark:text-gray-100">
          404
        </h1>
        <h2 class="text-lg font-bold text-primary-dark dark:text-gray-200">
          Halaman Tidak Ditemukan
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan salah.
        </p>
      </div>

      <div>
        <router-link to="/dashboard">
          <Button variant="accent" full-width>
            <ArrowLeft class="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </router-link>
      </div>
    </div>
  </div>
</template>
