<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useInView } from '../../composables/useInView'
import type { ChartPoint } from '../../data/dashboard'

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

const W = 620
const H = 240
const PAD = 34

const min = computed(() => Math.min(...props.data.map((d) => d.value)))
const max = computed(() => Math.max(...props.data.map((d) => d.value)))

const points = computed(() =>
  props.data.map((d, i) => {
    const x = PAD + (i * (W - PAD * 2)) / (props.data.length - 1)
    const range = max.value - min.value || 1
    const y = H - PAD - ((d.value - min.value) / range) * (H - PAD * 2)
    return { x, y, ...d }
  }),
)

const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '))
const areaPath = computed(() => {
  const pts = points.value
  if (pts.length === 0) return ''
  const first = pts[0]!
  const last = pts[pts.length - 1]!
  return `${linePath.value} L ${last.x} ${H - PAD} L ${first.x} ${H - PAD} Z`
})

// Animate the stroke drawing when it enters the viewport.
const pathEl = ref<SVGPathElement | null>(null)
const dash = ref(1)
watch(
  [isVisible, pathEl],
  () => {
    if (pathEl.value) dash.value = pathEl.value.getTotalLength()
  },
  { immediate: true },
)
</script>

<template>
  <div ref="target" class="line-chart">
    <figure role="group" :aria-label="title">
      <svg :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- gridlines -->
        <g>
          <line
            v-for="n in 4"
            :key="n"
            :x1="PAD"
            :x2="W - PAD"
            :y1="PAD + ((n - 1) * (H - PAD * 2)) / 3"
            :y2="PAD + ((n - 1) * (H - PAD * 2)) / 3"
            stroke="var(--grid-line)"
            stroke-width="1"
          />
        </g>

        <path :d="areaPath" :fill="color" class="area" :class="{ 'is-visible': isVisible }" opacity="0.14" />

        <path
          ref="pathEl"
          :d="linePath"
          fill="none"
          :stroke="color"
          stroke-width="3.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line"
          :style="{
            strokeDasharray: dash,
            strokeDashoffset: isVisible ? 0 : dash,
          }"
        />

        <g v-for="p in points" :key="p.label">
          <circle
            :cx="p.x"
            :cy="p.y"
            r="5"
            :fill="color"
            stroke="var(--surface)"
            stroke-width="2.5"
            class="dot"
            :class="{ 'is-visible': isVisible }"
          />
          <text :x="p.x" :y="p.y - 14" text-anchor="middle" class="dot-label">{{ p.value }}{{ unitSuffix }}</text>
          <text :x="p.x" :y="H - 10" text-anchor="middle" class="axis-label">{{ p.label }}</text>
        </g>
      </svg>

      <figcaption class="sr-only">
        {{ title }}.
        <table>
          <thead>
            <tr><th>Period</th><th>Value</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in data" :key="p.label">
              <td>{{ p.label }}</td>
              <td>{{ p.value }}{{ unitSuffix }}</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.line-chart svg {
  width: 100%;
  height: auto;
  display: block;
}

.line {
  transition: stroke-dashoffset 1.4s var(--ease);
}

.area {
  opacity: 0;
  transition: opacity 0.9s var(--ease) 0.5s;
}
.area.is-visible {
  opacity: 0.14;
}

.dot {
  opacity: 0;
  transition: opacity 0.4s var(--ease) 1s;
}
.dot.is-visible {
  opacity: 1;
}

.dot-label {
  font-size: 11px;
  font-weight: 700;
  fill: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
}

.axis-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
}
</style>
