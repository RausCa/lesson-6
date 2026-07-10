<script setup lang="ts">
import LinkButton from './LinkButton.vue'

interface QuickLink {
  title: string
  subtitle: string
  url: string
  icon: string
  color: string
}

const links: QuickLink[] = [
  {
    title: 'Track a shipment',
    subtitle: 'Real-time parcel & freight tracking',
    url: '#',
    icon: 'mdi-package-variant-closed',
    color: 'primary',
  },
  {
    title: 'Request a quote',
    subtitle: 'Instant freight pricing',
    url: '#',
    icon: 'mdi-invoice-text-outline',
    color: 'secondary',
  },
  {
    title: 'Customer portal',
    subtitle: 'Manage orders & invoices',
    url: '#',
    icon: 'mdi-lock',
    color: 'info',
  },
  {
    title: 'Request support',
    subtitle: 'Open a support ticket',
    url: '#',
    icon: 'mdi-ticket-confirmation-outline',
    color: 'magenta',
  },
]
</script>

<template>
  <v-row role="navigation" aria-label="Quick links">
    <v-col v-for="link in links" :key="link.title" cols="12" sm="6" md="3">
      <LinkButton
        :label="link.title"
        :subtitle="link.subtitle"
        :url="link.url"
        :icon="link.icon"
        :color="link.color"
      />
    </v-col>
  </v-row>
</template>

