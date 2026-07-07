<script setup lang="ts">
interface QuickLink {
  title: string
  subtitle: string
  href: string
  icon: string
  color: string
}

const links: QuickLink[] = [
  {
    title: 'Track a shipment',
    subtitle: 'Real-time parcel & freight tracking',
    href: '#',
    icon: 'mdi-package-variant-closed',
    color: 'primary',
  },
  {
    title: 'Request a quote',
    subtitle: 'Instant freight pricing',
    href: '#',
    icon: 'mdi-message-text',
    color: 'secondary',
  },
  {
    title: 'Customer portal',
    subtitle: 'Manage orders & invoices',
    href: '#',
    icon: 'mdi-lock',
    color: 'info',
  },
  {
    title: 'Careers',
    subtitle: "We're hiring drivers & dispatchers",
    href: '#',
    icon: 'mdi-rocket-launch',
    color: 'magenta',
  },
]
</script>

<template>
  <v-row role="navigation" aria-label="Quick links">
    <v-col v-for="link in links" :key="link.title" cols="12" sm="6" md="3">
      <v-card
        :href="link.href"
        hover
        border
        rounded="lg"
        class="link-card"
      >
        <v-card-item>
          <template #prepend>
            <v-avatar :color="link.color" rounded="lg" size="44">
              <v-icon :icon="link.icon" size="24" />
            </v-avatar>
          </template>

          <v-card-title class="text-body-1 font-weight-bold">{{ link.title }}</v-card-title>
          <v-card-subtitle>{{ link.subtitle }}</v-card-subtitle>

          <template #append>
            <v-icon icon="mdi-arrow-right" :color="link.color" class="link-arrow" />
          </template>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.link-card {
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
}

.link-card:hover {
  transform: translateY(-5px);
}

.link-card :deep(.link-arrow) {
  transition: transform 0.3s var(--ease);
}

.link-card:hover :deep(.link-arrow) {
  transform: translateX(5px);
}
</style>
