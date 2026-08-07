<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useJobStore } from '@/stores/jobStore'
import { BarChart3, Globe } from '@lucide/vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const jobStore = useJobStore()

const hasData = computed(() => jobStore.platformBreakdownData.data.some(v => v > 0))

const chartData = computed(() => {
  const bd = jobStore.platformBreakdownData
  return {
    labels: bd.labels,
    datasets: [
      {
        label: 'Jumlah Lamaran',
        data: bd.data,
        backgroundColor: '#0D9488',
        hoverBackgroundColor: '#EA580C',
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
      displayColors: false,
      callbacks: {
        label: (context) => ` ${context.raw || 0} Lamaran`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
        color: '#94A3B8',
        font: { family: 'Inter, sans-serif', size: 11 },
      },
      grid: {
        color: 'rgba(226, 232, 240, 0.5)',
        drawBorder: false,
      },
    },
    x: {
      ticks: {
        color: '#64748B',
        font: { family: 'Inter, sans-serif', size: 11, weight: '600' },
      },
      grid: {
        display: false,
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
        <div class="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <BarChart3 class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Platform Breakdown
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Perbandingan saluran/media melamar pekerjaan
          </p>
        </div>
      </div>

      <span class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
        <Globe class="w-3.5 h-3.5 mr-1 text-orange-500" />
        Saluran Lowongan
      </span>
    </div>

    <!-- Chart Canvas Container -->
    <div class="h-64 relative">
      <Bar
        v-if="hasData"
        :data="chartData"
        :options="chartOptions"
      />
      <!-- Clean Empty Fallback -->
      <div v-else class="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
        <BarChart3 class="w-8 h-8 text-slate-400 dark:text-slate-500" />
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Belum ada data platform lamaran. Tambahkan lamaran baru untuk melihat grafik platform.
        </p>
      </div>
    </div>
  </div>
</template>
