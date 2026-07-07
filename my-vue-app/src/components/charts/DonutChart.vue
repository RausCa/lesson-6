<script setup lang="ts">
import { computed } from 'vue'
import { useInView } from '../../composables/useInView'
import type { ChartPoint } from '../../data/dashboard'

const props = defineProps<{
  data: ChartPoint[]
  title: string
}>()

const { target, isVisible } = useInView<HTMLDivElement>()

const palette = ['var(--chart-orange)', 'var(--chart-purple)', 'var(--chart-blue)', 'var(--chart-magenta)']

const R = 60
const C = 2 * Math.PI * R
const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const segments = computed(() => {
  let offset = 0
  return props.data.map((d, i) => {
    const fraction = d.value / total.value
    const seg = {
      ...d,
      color: palette[i % palette.length],
      dash: fraction * C,
      gap: C - fraction * C,
      rotation: (offset / total.value) * 360,
      percent: Math.round(fraction * 100),
    }
    offset += d.value
    return seg
  })
})
</script>

<template>
  <div ref="target" class="donut">
    <figure role="group" :aria-label="title">
      <div class="donut-layout">
        <svg viewBox="0 0 160 160" class="donut-svg" aria-hidden="true">
          <circle cx="80" cy="80" :r="R" fill="none" stroke="var(--surface-2)" stroke-width="20" />
          <circle
            v-for="seg in segments"
            :key="seg.label"
            cx="80"
            cy="80"
            :r="R"
            fill="none"
            :stroke="seg.color"
            stroke-width="20"
            stroke-linecap="butt"
            :stroke-dasharray="`${seg.dash} ${seg.gap}`"
            :stroke-dashoffset="isVisible ? 0 : C"
            :transform="`rotate(${seg.rotation - 90} 80 80)`"
            class="seg"
          />
          <text x="80" y="76" text-anchor="middle" class="center-num">{{ total }}%</text>
          <text x="80" y="94" text-anchor="middle" class="center-label">total</text>
        </svg>

        <ul class="legend">
          <li v-for="seg in segments" :key="seg.label">
            <span class="swatch" :style="{ background: seg.color }" aria-hidden="true" />
            <span class="legend-label">{{ seg.label }}</span>
            <span class="legend-val">{{ seg.percent }}%</span>
          </li>
        </ul>
      </div>

      <figcaption class="sr-only">
        {{ title }}.
        <table>
          <thead>
            <tr><th>Category</th><th>Share</th></tr>
          </thead>
          <tbody>
            <tr v-for="seg in segments" :key="seg.label">
              <td>{{ seg.label }}</td>
              <td>{{ seg.percent }}%</td>
            </tr>
          </tbody>
        </table>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.donut-layout {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 4vw, 2.5rem);
  flex-wrap: wrap;
}

.donut-svg {
  width: 190px;
  height: 190px;
  flex-shrink: 0;
}

.seg {
  transition: stroke-dashoffset 1.2s var(--ease);
}

.center-num {
  font-size: 26px;
  font-weight: 800;
  fill: var(--text);
  font-family: 'Montserrat', sans-serif;
}

.center-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.legend {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 180px;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.9rem;
}

.swatch {
  width: 16px;
  height: 16px;
  border-radius: 5px;
  flex-shrink: 0;
}

.legend-label {
  color: var(--text-muted);
  font-weight: 600;
}

.legend-val {
  margin-left: auto;
  font-weight: 700;
  color: var(--text);
}
</style>
