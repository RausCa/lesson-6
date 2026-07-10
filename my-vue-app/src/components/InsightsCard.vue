<script setup lang="ts">
import { useMonthFilter } from '../composables/useMonthFilter'

const { insights, selectedLabel } = useMonthFilter()
</script>

<template>
  <section class="insights ff-card" aria-label="Insights">
    <header class="insights-head">
      <span class="badge" aria-hidden="true">
        <v-icon icon="mdi-lightbulb-on-outline" size="22" />
      </span>
      <div>
        <h2>Insights</h2>
        <p class="sub">Auto-generated for {{ selectedLabel }}</p>
      </div>
    </header>

    <div class="insights-grid">
      <div class="group summary">
        <h3><v-icon icon="mdi-text-box-outline" size="18" /> Summary</h3>
        <ul>
          <li v-for="(item, i) in insights.summary" :key="i">{{ item }}</li>
        </ul>
      </div>

      <div class="group concern">
        <h3><v-icon icon="mdi-alert-outline" size="18" /> Watch out for</h3>
        <ul>
          <li v-for="(item, i) in insights.concerns" :key="i">{{ item }}</li>
        </ul>
      </div>

      <div class="group action">
        <h3><v-icon icon="mdi-rocket-launch-outline" size="18" /> Next actions</h3>
        <ul>
          <li v-for="(item, i) in insights.actions" :key="i">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.insights {
  padding: clamp(1.2rem, 3vw, 1.8rem);
}

.insights-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.3rem;
}

.badge {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: var(--brand-contrast);
  background: linear-gradient(135deg, var(--brand-orange), var(--brand-magenta));
  box-shadow: 0 8px 20px -8px var(--brand-orange);
  flex-shrink: 0;
}

.insights-head h2 {
  font-size: 1.25rem;
  font-weight: 800;
}

.sub {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

.group {
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface-2);
  padding: 1rem 1.1rem;
}

.group h3 {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
}

.group.summary h3 {
  color: var(--chart-blue);
}
.group.concern h3 {
  color: var(--chart-magenta);
}
.group.action h3 {
  color: var(--chart-orange);
}

.group ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.group li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--text-muted);
}

.group li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
}

@media (max-width: 860px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
