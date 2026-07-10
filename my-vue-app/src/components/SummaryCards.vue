<script setup lang="ts">
import { useMonthFilter } from '../composables/useMonthFilter'

const emit = defineEmits<{ (e: 'drill', target: string): void }>()

const { summaryCards } = useMonthFilter()

const accentVar: Record<string, string> = {
  orange: 'var(--chart-orange)',
  purple: 'var(--chart-purple)',
  blue: 'var(--chart-blue)',
  magenta: 'var(--chart-magenta)',
}
</script>

<template>
  <ul class="summary-grid">
    <li v-for="metric in summaryCards" :key="metric.id">
      <button
        type="button"
        class="summary-card ff-card"
        :style="{ '--accent': accentVar[metric.accent] }"
        @click="emit('drill', metric.target)"
      >
        <span class="accent-bar" aria-hidden="true" />
        <span class="top">
          <span class="label">{{ metric.label }}</span>
          <span
            v-if="metric.showDelta"
            class="delta"
            :class="metric.isGood ? 'good' : 'bad'"
          >
            <span aria-hidden="true">{{ metric.trend === 'up' ? '▲' : '▼' }}</span>
            {{ metric.deltaLabel }}
          </span>
        </span>
        <span class="value">{{ metric.value }}</span>
        <span class="hint">{{ metric.hint }}</span>
        <span class="drill-hint">Drill down <span aria-hidden="true">→</span></span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.summary-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.1rem;
}

.summary-card {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: left;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  color: var(--text);
  transition:
    transform 0.3s var(--ease),
    border-color 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
}

.summary-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 18px 40px -20px var(--accent);
}

.accent-bar {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: var(--accent);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

.delta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.delta.good {
  color: #0b3d1e;
  background: #7ee2a8;
}
.delta.bad {
  color: #4a0d17;
  background: #ff9db4;
}

.value {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hint {
  font-size: 0.8rem;
  color: var(--text-faint);
}

.drill-hint {
  margin-top: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent);
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.3s var(--ease),
    transform 0.3s var(--ease);
}

.summary-card:hover .drill-hint,
.summary-card:focus-visible .drill-hint {
  opacity: 1;
  transform: none;
}
</style>
