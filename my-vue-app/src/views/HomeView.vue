<script setup lang="ts">
import SummaryCards from '../components/SummaryCards.vue'
import QuickLinks from '../components/QuickLinks.vue'
import RevealSection from '../components/RevealSection.vue'
import ShipmentExplorer from '../components/ShipmentExplorer.vue'
import BarChart from '../components/charts/BarChart.vue'
import LineChart from '../components/charts/LineChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { deliveryTrend, fleetMix, revenueByMonth } from '../data/dashboard'

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
        <span class="ff-chip">
          <span class="dot" aria-hidden="true" /> Live operations dashboard
        </span>
        <h1>Fastforward Logistics</h1>
        <p class="lede">
          Moving freight, faster. Here's a real-time snapshot of your network —
          revenue, shipments and on-time performance, all in one place.
        </p>
      </div>
      <QuickLinks />
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
        subtitle="Monthly gross revenue in thousands of dollars (USD)."
      >
        <BarChart
          :data="revenueByMonth"
          title="Monthly revenue in thousands of US dollars"
          unit-prefix="$"
          unit-suffix="k"
          color="var(--chart-orange)"
        />
      </RevealSection>

      <RevealSection
        section-id="performance-section"
        title="On-time delivery performance"
        subtitle="Percentage of loads delivered on schedule, last six months."
      >
        <LineChart
          :data="deliveryTrend"
          title="On-time delivery percentage over six months"
          unit-suffix="%"
          color="var(--chart-blue)"
        />
      </RevealSection>

      <RevealSection
        section-id="fleet-section"
        title="Fleet & modal mix"
        subtitle="Share of volume moved by transport mode."
      >
        <DonutChart :data="fleetMix" title="Share of volume by transport mode" />
      </RevealSection>

      <RevealSection
        section-id="shipments-section"
        title="Shipment explorer"
        subtitle="Search and filter active loads across every region."
      >
        <ShipmentExplorer />
      </RevealSection>
    </div>

    <footer class="foot">
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

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-orange);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-orange) 25%, transparent);
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

.sections {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.foot {
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 0.85rem;
  text-align: center;
}
</style>
