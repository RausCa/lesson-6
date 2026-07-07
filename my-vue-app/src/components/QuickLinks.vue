<script setup lang="ts">
interface QuickLink {
  label: string
  detail: string
  href: string
  icon: string
  accent: string
}

const links: QuickLink[] = [
  { label: 'Track a shipment', detail: 'Real-time parcel & freight tracking', href: '#', icon: '📦', accent: 'var(--chart-orange)' },
  { label: 'Request a quote', detail: 'Instant freight pricing', href: '#', icon: '💬', accent: 'var(--chart-purple)' },
  { label: 'Customer portal', detail: 'Manage orders & invoices', href: '#', icon: '🔐', accent: 'var(--chart-blue)' },
  { label: 'Careers', detail: "We're hiring drivers & dispatchers", href: '#', icon: '🚀', accent: 'var(--chart-magenta)' },
]
</script>

<template>
  <nav class="links" aria-label="Quick links">
    <a
      v-for="link in links"
      :key="link.label"
      :href="link.href"
      class="link-btn ff-card"
      :style="{ '--accent': link.accent }"
    >
      <span class="icon" aria-hidden="true">{{ link.icon }}</span>
      <span class="text">
        <span class="link-label">{{ link.label }}</span>
        <span class="link-detail">{{ link.detail }}</span>
      </span>
      <span class="arrow" aria-hidden="true">→</span>
    </a>
  </nav>
</template>

<style scoped>
.links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.link-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  color: var(--text);
  overflow: hidden;
  transition:
    transform 0.3s var(--ease),
    border-color 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
}

.link-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, var(--accent), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s var(--ease);
}

.link-btn:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 20px 40px -22px var(--accent);
}

.link-btn:hover::before {
  opacity: 0.14;
}

.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 1.3rem;
  background: var(--surface-2);
  transition: transform 0.3s var(--ease);
}

.link-btn:hover .icon {
  transform: scale(1.08) rotate(-6deg);
}

.text {
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.link-label {
  font-weight: 700;
  font-size: 0.98rem;
}

.link-detail {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.arrow {
  margin-left: auto;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
  transform: translateX(-6px);
  opacity: 0;
  transition:
    transform 0.3s var(--ease),
    opacity 0.3s var(--ease);
  z-index: 1;
}

.link-btn:hover .arrow {
  transform: none;
  opacity: 1;
}
</style>
