<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { useJobStore } from '@/stores/jobStore'
import { PieChart, Layers } from '@lucide/vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const jobStore = useJobStore()

const breakdown = computed(() => jobStore.statusBreakdownData)
const hasData = computed(() => breakdown.value.data.some(v => v > 0))

const chartData = computed(() => {
  return {
    labels: breakdown.value.labels,
    datasets: [
      {
        data: breakdown.value.data,
        backgroundColor: breakdown.value.backgroundColor,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderColor: '#ffffff',
        hoverOffset: 8,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1C2938',
      titleFont: { family: 'Inter, sans-serif', size: 13, weight: 'bold' },
      bodyFont: { family: 'Inter, sans-serif', size: 12 },
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      boxPadding: 6,
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const val = context.raw || 0
          const pct = total > 0 ? Math.round((val / total) * 100) : 0
          return ` ${val} Lamaran (${pct}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white dark:bg-primary-dark/90 border border-gray-100 dark:border-primary/80 shadow-sm space-y-6">
    <!-- Component Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 rounded-xl bg-accent-teal/10 text-accent-teal">
          <PieChart class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-primary-dark dark:text-gray-100">
            Status Breakdown
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Distribusi posisi lamaran berdasarkan tahapan
          </p>
        </div>
      </div>

      <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-primary/60 text-gray-700 dark:text-gray-300">
        <Layers class="w-3.5 h-3.5 mr-1 text-accent-teal" />
        {{ jobStore.totalApplicationsCount }} Total
      </span>
    </div>

    <!-- Main Donut Chart Container -->
    <div v-if="hasData" class="space-y-6">
      <div class="relative h-64 flex items-center justify-center">
        <Doughnut :data="chartData" :options="chartOptions" />
        <!-- Center Donut Label -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-3xl font-black text-primary-dark dark:text-gray-100">
            {{ jobStore.totalApplicationsCount }}
          </span>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Lamaran
          </span>
        </div>
      </div>

      <!-- Legend Cards Underneath Chart -->
      <div class="pt-4 border-t border-gray-100 dark:border-primary/60 space-y-3">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
          Legend Status & Keterangan Warna
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2.5">
          <div
            v-for="item in breakdown.items"
            :key="`legend-${item.id}`"
            class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-primary/40 border border-gray-200/80 dark:border-primary/60 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all hover:border-accent-teal hover:scale-105 shadow-2xs"
          >
            <span
              class="w-3 h-3 rounded-full shrink-0 shadow-xs"
              :style="{ backgroundColor: item.color }"
            ></span>
            <span>{{ item.name }}</span>
            <span class="text-gray-500 dark:text-gray-400 font-bold">({{ item.count }})</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-primary/80 border border-gray-200 dark:border-primary text-gray-600 dark:text-gray-300 font-extrabold">
              {{ item.percentage }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Empty Fallback -->
    <div v-else class="p-8 text-center bg-slate-50 dark:bg-primary/30 rounded-xl border border-dashed border-gray-200 dark:border-primary/50 space-y-2">
      <PieChart class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-500" />
      <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">
        Belum ada data status lamaran. Tambahkan lamaran baru untuk melihat breakdown visual.
      </p>
    </div>
  </div>
</template>
