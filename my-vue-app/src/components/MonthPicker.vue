<script setup lang="ts">
import { useMonthFilter } from '../composables/useMonthFilter'

const { selected, monthOptions } = useMonthFilter()
</script>

<template>
  <v-select
    v-model="selected"
    :items="monthOptions"
    item-title="title"
    item-value="value"
    variant="outlined"
    density="comfortable"
    hide-details
    prepend-inner-icon="mdi-calendar-month"
    label="Month"
    class="month-picker"
  />
</template>

<style scoped>
.month-picker {
  min-width: 200px;
  max-width: 240px;
}
</style>
