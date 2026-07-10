<script setup lang="ts">
import SummaryCards from '../components/SummaryCards.vue'
import QuickLinks from '../components/QuickLinks.vue'
import LinkButton from '../components/LinkButton.vue'
import MonthPicker from '../components/MonthPicker.vue'
import InsightsCard from '../components/InsightsCard.vue'
import RevealSection from '../components/RevealSection.vue'
import ShipmentExplorer from '../components/ShipmentExplorer.vue'
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { useMonthFilter } from '../composables/useMonthFilter'

const { revenueSeries, deliverySeries, fleetMixSeries, selectedLabel } = useMonthFilter()

function drill(target: string) {
  const el = document.getElementById(target)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-copy">
        <h1>Operations Dashboard</h1>
        <p class="lede">
          Moving freight, faster. Here's a real-time snapshot of your network —
          revenue, shipments and on-time performance, all in one place.
        </p>
      </div>
      <InsightsCard class="hero-insights" />
      <QuickLinks />
    </section>

    <!-- Month filter toolbar -->
    <section class="dashboard-toolbar">
      <div class="toolbar-label">
        <span class="eyebrow">Viewing</span>
        <strong>{{ selectedLabel }}</strong>
      </div>
      <MonthPicker />
    </section>

    <!-- Summary snapshot -->
    <section class="snapshot">
      <SummaryCards @drill="drill" />
    </section>

    <!-- Drill-down sections -->
    <div class="sections">
      <RevealSection
        section-id="revenue-section"
        title="Revenue momentum"
        subtitle="Gross revenue in thousands of dollars (USD), by month."
      >
        <BarChart
          :data="revenueSeries"
          title="Revenue in thousands of US dollars, by month"
          unit-prefix="$"
          unit-suffix="k"
          color="var(--chart-orange)"
        />
      </RevealSection>

      <div class="chart-row">
        <RevealSection
          section-id="performance-section"
          title="On-time delivery performance"
          subtitle="Percentage of loads delivered on schedule."
        >
          <LineChart
            :data="deliverySeries"
            title="On-time delivery percentage"
            unit-suffix="%"
            color="var(--chart-blue)"
          />
        </RevealSection>

        <RevealSection
          section-id="fleet-section"
          title="Fleet & modal mix"
          subtitle="Share of volume moved by transport mode."
        >
          <DonutChart :data="fleetMixSeries" title="Share of volume by transport mode" />
        </RevealSection>
      </div>

      <RevealSection
        section-id="shipments-section"
        title="Shipment explorer"
        subtitle="Search and filter active loads across every region."
      >
        <ShipmentExplorer />
      </RevealSection>
    </div>

    <footer class="foot">
      <div class="foot-cta">
        <LinkButton
          label="Contact us"
          subtitle="My mom will answer you back"
          url="mailto:hello@fastforward.io"
          icon="mdi-email-outline"
          color="primary"
        />
      </div>
      <p>© {{ new Date().getFullYear() }} Fastforward Logistics — all data shown is illustrative.</p>
    </footer>
  </main>
</template>

<style scoped>
.hero {
  padding: clamp(1.5rem, 5vw, 3rem) 0 clamp(2rem, 4vw, 3rem);
}

.hero-copy {
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 2rem;
}

.hero-insights {
  margin-bottom: 2rem;
}

h1 {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  background: linear-gradient(120deg, var(--brand-orange), var(--brand-magenta) 55%, var(--brand-purple));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lede {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-muted);
  max-width: 640px;
}

.snapshot {
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.dashboard-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.toolbar-label {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.toolbar-label .eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-faint);
}

.toolbar-label strong {
  font-size: 1.25rem;
  font-weight: 800;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  align-items: stretch;
}

.chart-row > * {
  min-width: 0;
}

@media (max-width: 900px) {
  .chart-row {
    grid-template-columns: 1fr;
  }
}

.foot {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 0.85rem;
  text-align: center;
}

.foot-cta {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.foot-cta :deep(.link-card) {
  min-width: 260px;
  text-align: left;
}
</style>
