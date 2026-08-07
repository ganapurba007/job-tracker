<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import Button from '@/components/common/Button.vue'
import { LayoutDashboard, Briefcase, LogOut, Menu, X } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

async function handleLogout() {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand / Logo -->
        <div class="flex items-center space-x-3">
          <router-link to="/" class="flex items-center space-x-2 font-bold text-xl text-slate-900 dark:text-slate-100">
            <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase class="w-5 h-5" />
            </div>
            <span>Job<span class="text-teal-600 dark:text-teal-400">Tracker</span></span>
          </router-link>
        </div>

        <!-- Desktop Navigation Links -->
        <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-1">
          <router-link
            to="/dashboard"
            class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            active-class="!bg-teal-500/10 !text-teal-600 dark:!text-teal-400 font-semibold"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/job-applications"
            class="px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            active-class="!bg-teal-500/10 !text-teal-600 dark:!text-teal-400 font-semibold"
          >
            <Briefcase class="w-4 h-4" />
            <span>Lamaran Kerja</span>
          </router-link>
        </div>

        <!-- Right Side Utilities -->
        <div class="flex items-center space-x-3">
          <ThemeToggle />

          <!-- Authenticated User Profile & Logout -->
          <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div class="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-200">
              <div class="w-8 h-8 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center font-semibold text-xs border border-teal-500/30">
                {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U' }}
              </div>
              <span class="font-medium max-w-[120px] truncate">
                {{ authStore.user?.name || 'User' }}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              @click="handleLogout"
              title="Keluar dari akun"
            >
              <LogOut class="w-4 h-4" />
            </Button>
          </div>

          <!-- Unauthenticated Buttons -->
          <div v-else class="hidden md:flex items-center space-x-2">
            <router-link to="/login">
              <Button variant="ghost">Masuk</Button>
            </router-link>
            <router-link to="/register">
              <Button variant="accent">Daftar</Button>
            </router-link>
          </div>

          <!-- Mobile Menu Toggle Button -->
          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
      <template v-if="authStore.isAuthenticated">
        <div class="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center space-x-3 mb-2">
          <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
            {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U' }}
          </div>
          <div>
            <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ authStore.user?.name || 'User' }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              {{ authStore.user?.email || '' }}
            </div>
          </div>
        </div>

        <router-link
          to="/dashboard"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Dashboard
        </router-link>

        <router-link
          to="/job-applications"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Lamaran Kerja
        </router-link>

        <button
          type="button"
          @click="handleLogout"
          class="w-full text-left px-3 py-2.5 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center space-x-2"
        >
          <LogOut class="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </template>

      <template v-else>
        <router-link
          to="/login"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Masuk
        </router-link>
        <router-link
          to="/register"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2.5 rounded-xl text-base font-medium text-teal-600 dark:text-teal-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Daftar Akun Baru
        </router-link>
      </template>
    </div>
  </nav>
</template>
