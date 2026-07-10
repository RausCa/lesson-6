<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import { useInView } from '../../composables/useInView'
import { resolveColor, useChartTheme } from '../../composables/useChartTheme'
import type { ChartPoint } from '../../data/dashboard'

ChartJS.register(DoughnutController, ArcElement, Legend, Tooltip)

const props = defineProps<{
  data: ChartPoint[]
  title: string
}>()

const { target, isVisible } = useInView<HTMLDivElement>()
const { colors } = useChartTheme()

const palette = ['var(--chart-orange)', 'var(--chart-purple)', 'var(--chart-blue)', 'var(--chart-magenta)']

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      data: props.data.map((d) => d.value),
      backgroundColor: props.data.map((_, i) => resolveColor(palette[i % palette.length] ?? palette[0]!)),
      borderColor: colors.value.surface,
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
}))

// Draws the running total in the middle of the doughnut.
const centerText: Plugin<'doughnut'> = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx, chartArea } = chart
    if (!chartArea) return
    const x = (chartArea.left + chartArea.right) / 2
    const y = (chartArea.top + chartArea.bottom) / 2
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = colors.value.text
    ctx.font = '800 26px Montserrat, sans-serif'
    ctx.fillText(`${total.value}%`, x, y - 6)
    ctx.font = '600 11px Montserrat, sans-serif'
    ctx.fillText('TOTAL', x, y + 14)
    ctx.restore()
  },
}

const chartOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  animation: { duration: 1100, easing: 'easeOutQuart' },
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: colors.value.text,
        font: { family: 'Montserrat', weight: 600, size: 13 },
        usePointStyle: true,
        pointStyle: 'rectRounded',
        padding: 14,
      },
    },
    tooltip: {
      backgroundColor: colors.value.surface,
      borderColor: colors.value.border,
      borderWidth: 1,
      titleColor: colors.value.text,
      bodyColor: colors.value.text,
      padding: 10,
      callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
    },
  },
}))
</script>

<template>
  <div ref="target" class="donut">
    <figure role="group" :aria-label="title">
      <div class="canvas-wrap" aria-hidden="true">
        <Doughnut v-if="isVisible" :data="chartData" :options="chartOptions" :plugins="[centerText]" />
      </div>

      <figcaption class="sr-only">
        {{ title }}.
        <table>
          <thead>
            <tr><th>Category</th><th>Share</th></tr>
          </thead>
          <tbody>
            <tr v-for="point in data" :key="point.label">
              <td>{{ point.label }}</td>
              <td>{{ point.value }}%</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.donut {
  width: 100%;
}

.canvas-wrap {
  position: relative;
  height: 260px;
}
</style>
