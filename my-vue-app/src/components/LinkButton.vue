<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The button text. */
    label: string
    /** Supporting text shown beneath the label. */
    subtitle?: string
    /** Destination URL the button links to. */
    url?: string
    /** Material Design Icon name, e.g. "mdi-rocket-launch". */
    icon?: string
    /** Vuetify theme colour used for the icon accent. */
    color?: string
  }>(),
  {
    subtitle: '',
    url: '#',
    icon: 'mdi-link-variant',
    color: 'primary',
  },
)
</script>

<template>
  <v-card :href="url" hover border rounded="lg" class="link-card">
    <v-card-item>
      <template #prepend>
        <v-avatar :color="color" rounded="lg" size="44" class="me-2">
          <v-icon :icon="icon" size="24" />
        </v-avatar>
      </template>

      <v-card-title class="text-body-1 font-weight-bold">{{ label }}</v-card-title>
      <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>

      <template #append>
        <v-icon icon="mdi-arrow-right" :color="color" class="link-arrow" />
      </template>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.link-card {
  height: 100%;
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
