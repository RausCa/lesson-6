<script setup lang="ts">
import { computed } from 'vue'
import { useInView } from '../../composables/useInView'
import type { ChartPoint } from '../../data/dashboard'

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

const max = computed(() => Math.max(...props.data.map((d) => d.value)) * 1.1)

function fmt(v: number) {
  return `${props.unitPrefix}${v.toLocaleString()}${props.unitSuffix}`
}
</script>

<template>
  <div ref="target" class="bar-chart">
    <figure role="group" :aria-label="title">
      <div class="bars" :class="{ 'is-visible': isVisible }" aria-hidden="true">
        <div v-for="(point, i) in data" :key="point.label" class="bar-col">
          <div class="bar-value">{{ fmt(point.value) }}</div>
          <div
            class="bar"
            :style="{
              height: isVisible ? (point.value / max) * 100 + '%' : '0%',
              background: color,
              transitionDelay: i * 90 + 'ms',
            }"
          />
          <div class="bar-label">{{ point.label }}</div>
        </div>
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

.bars {
  display: flex;
  align-items: flex-end;
  gap: clamp(0.5rem, 2vw, 1.4rem);
  height: 240px;
  padding-top: 1.5rem;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
}

.bar {
  width: 100%;
  max-width: 54px;
  border-radius: 8px 8px 4px 4px;
  transition: height 0.9s var(--ease);
  box-shadow: 0 6px 18px -8px currentColor;
}

.bar-value {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 0.4rem;
  opacity: 0;
  transition: opacity 0.5s var(--ease) 0.4s;
}

.bars.is-visible .bar-value {
  opacity: 1;
}

.bar-label {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
}
</style>
