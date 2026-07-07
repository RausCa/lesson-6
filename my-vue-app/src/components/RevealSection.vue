<script setup lang="ts">
import { useInView } from '../composables/useInView'

defineProps<{ sectionId: string; title: string; subtitle?: string }>()
const { target, isVisible } = useInView<HTMLElement>({ threshold: 0.15 })
</script>

<template>
  <section :id="sectionId" ref="target" class="reveal" :class="{ 'is-visible': isVisible }">
    <header class="section-head">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </header>
    <div class="ff-card section-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
section {
  scroll-margin-top: 1.5rem;
}

.section-head {
  margin-bottom: 1.1rem;
}

.section-head h2 {
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  font-weight: 800;
}

.section-head p {
  color: var(--text-muted);
  margin-top: 0.3rem;
  font-size: 0.95rem;
}

.section-body {
  padding: clamp(1.2rem, 3vw, 1.8rem);
}
</style>
