<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { useInView } from '../../composables/useInView'
import { resolveColor, useChartTheme } from '../../composables/useChartTheme'
import type { ChartPoint } from '../../data/dashboard'

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = withDefaults(
  defineProps<{
    data: ChartPoint[]
    title: string
    unitPrefix?: string
    unitSuffix?: string
    color?: string
  }>(),
  { unitPrefix: '', unitSuffix: '', color: 'var(--chart-orange)' },
)

const { target, isVisible } = useInView<HTMLDivElement>()
const { colors } = useChartTheme()

function fmt(v: number) {
  return `${props.unitPrefix}${v.toLocaleString()}${props.unitSuffix}`
}

const chartData = computed<ChartData<'bar'>>(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      label: props.title,
      data: props.data.map((d) => d.value),
      backgroundColor: resolveColor(props.color),
      borderRadius: 8,
      maxBarThickness: 54,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeOutQuart' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: colors.value.surface,
      borderColor: colors.value.border,
      borderWidth: 1,
      titleColor: colors.value.text,
      bodyColor: colors.value.text,
      padding: 10,
      callbacks: { label: (ctx) => fmt(ctx.parsed.y ?? 0) },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: colors.value.text, font: { family: 'Montserrat', weight: 600 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: colors.value.grid },
      border: { display: false },
      ticks: {
        color: colors.value.text,
        font: { family: 'Montserrat' },
        callback: (value) => fmt(Number(value)),
      },
    },
  },
}))
</script>

<template>
  <div ref="target" class="bar-chart">
    <figure role="group" :aria-label="title">
      <div class="canvas-wrap" aria-hidden="true">
        <Bar v-if="isVisible" :data="chartData" :options="chartOptions" />
      </div>

      <!-- Accessible non-visual alternative -->
      <figcaption class="sr-only">
        {{ title }}.
        <table>
          <thead>
            <tr><th>Period</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr v-for="point in data" :key="point.label">
              <td>{{ point.label }}</td>
              <td>{{ fmt(point.value) }}</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.bar-chart {
  width: 100%;
}

.canvas-wrap {
  position: relative;
  height: 280px;
}
</style>
