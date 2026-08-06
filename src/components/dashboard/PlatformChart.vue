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
import { BarChart3 } from '@lucide/vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const jobStore = useJobStore()

const chartData = computed(() => {
  const bd = jobStore.platformBreakdownData
  return {
    labels: bd.labels,
    datasets: [
      {
        label: 'Jumlah Lamaran',
        data: bd.data,
        backgroundColor: '#325E6A',
        hoverBackgroundColor: '#44A1A4',
        borderRadius: 8,
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
      cornerRadius: 10,
      padding: 10,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      grid: {
        display: true,
        drawBorder: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}
</script>

<template>
  <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark/90 border border-gray-100 dark:border-primary/80 shadow-xs space-y-4">
    <div class="flex items-center space-x-2">
      <BarChart3 class="w-5 h-5 text-accent-teal" />
      <h3 class="text-base font-bold text-primary-dark dark:text-gray-100">
        Platform Breakdown
      </h3>
    </div>

    <div class="h-64 relative flex items-center justify-center">
      <Bar
        v-if="jobStore.platformBreakdownData.data.some(v => v > 0)"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="text-xs text-gray-400 font-medium text-center">
        Belum ada data platform untuk ditampilkan
      </div>
    </div>
  </div>
</template>
