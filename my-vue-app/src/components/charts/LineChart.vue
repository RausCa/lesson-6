<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { useInView } from '../../composables/useInView'
import { resolveColor, useChartTheme } from '../../composables/useChartTheme'
import type { ChartPoint } from '../../data/dashboard'

ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip)

const props = withDefaults(
  defineProps<{
    data: ChartPoint[]
    title: string
    unitSuffix?: string
    color?: string
  }>(),
  { unitSuffix: '', color: 'var(--chart-blue)' },
)

const { target, isVisible } = useInView<HTMLDivElement>()
const { colors } = useChartTheme()

function fmt(v: number) {
  return `${v}${props.unitSuffix}`
}

const chartData = computed<ChartData<'line'>>(() => {
  const stroke = resolveColor(props.color)
  return {
    labels: props.data.map((d) => d.label),
    datasets: [
      {
        label: props.title,
        data: props.data.map((d) => d.value),
        borderColor: stroke,
        backgroundColor: (ctx) => {
          const { chart } = ctx
          const { ctx: c, chartArea } = chart
          if (!chartArea) return 'transparent'
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, stroke + '55')
          gradient.addColorStop(1, stroke + '00')
          return gradient
        },
        borderWidth: 3.5,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: stroke,
        pointBorderColor: colors.value.surface,
        pointBorderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: 'easeOutQuart' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: colors.value.surface,
      borderColor: colors.value.border,
      borderWidth: 1,
      titleColor: colors.value.text,
      bodyColor: colors.value.text,
      padding: 10,
      callbacks: { label: (ctx) => fmt(Number(ctx.parsed.y)) },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: colors.value.text, font: { family: 'Montserrat', weight: 600 } },
    },
    y: {
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
  <div ref="target" class="line-chart">
    <figure role="group" :aria-label="title">
      <div class="canvas-wrap" aria-hidden="true">
        <Line v-if="isVisible" :data="chartData" :options="chartOptions" />
      </div>

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
.line-chart {
  width: 100%;
}

.canvas-wrap {
  position: relative;
  height: 280px;
}
</style>
