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
import { PieChart } from '@lucide/vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const jobStore = useJobStore()

const chartData = computed(() => {
  const bd = jobStore.statusBreakdownData
  return {
    labels: bd.labels,
    datasets: [
      {
        data: bd.data,
        backgroundColor: bd.backgroundColor,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 16,
        font: {
          family: 'system-ui, sans-serif',
          size: 12,
        },
      },
    },
    tooltip: {
      cornerRadius: 10,
      padding: 10,
    },
  },
}
</script>

<template>
  <div class="p-5 rounded-2xl bg-white dark:bg-primary-dark/90 border border-gray-100 dark:border-primary/80 shadow-xs space-y-4">
    <div class="flex items-center space-x-2">
      <PieChart class="w-5 h-5 text-accent-teal" />
      <h3 class="text-base font-bold text-primary-dark dark:text-gray-100">
        Status Breakdown
      </h3>
    </div>

    <div class="h-64 relative flex items-center justify-center">
      <Doughnut
        v-if="jobStore.statusBreakdownData.data.some(v => v > 0)"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="text-xs text-gray-400 font-medium text-center">
        Belum ada data status untuk ditampilkan
      </div>
    </div>
  </div>
</template>
