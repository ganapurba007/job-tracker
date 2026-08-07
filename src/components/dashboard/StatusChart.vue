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
      backgroundColor: '#0F172A',
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
  <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
    <!-- Component Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <PieChart class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Status Breakdown
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Distribusi posisi lamaran berdasarkan tahapan
          </p>
        </div>
      </div>

      <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        <Layers class="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
        {{ jobStore.totalApplicationsCount }} Total
      </span>
    </div>

    <!-- Main Donut Chart Container -->
    <div v-if="hasData" class="space-y-6">
      <div class="relative h-64 flex items-center justify-center">
        <Doughnut :data="chartData" :options="chartOptions" />
        <!-- Center Donut Label -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-3xl font-black text-slate-900 dark:text-slate-100">
            {{ jobStore.totalApplicationsCount }}
          </span>
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Lamaran
          </span>
        </div>
      </div>

      <!-- Legend Cards Underneath Chart -->
      <div class="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
          Legend Status & Keterangan Warna
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2.5">
          <div
            v-for="item in breakdown.items"
            :key="`legend-${item.id}`"
            class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-teal-500 hover:scale-105 shadow-2xs"
          >
            <span
              class="w-3 h-3 rounded-full shrink-0 shadow-xs"
              :style="{ backgroundColor: item.color }"
            ></span>
            <span>{{ item.name }}</span>
            <span class="text-slate-500 dark:text-slate-400 font-bold">({{ item.count }})</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold">
              {{ item.percentage }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Empty Fallback -->
    <div v-else class="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
      <PieChart class="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500" />
      <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Belum ada data status lamaran. Tambahkan lamaran baru untuk melihat breakdown visual.
      </p>
    </div>
  </div>
</template>
