<script setup lang="ts">
import { computed, ref } from 'vue'
import { regions, shipments, statuses } from '../data/dashboard'

const query = ref('')
const region = ref<'all' | string>('all')
const status = ref<'all' | string>('all')

const filtered = computed(() =>
  shipments.filter((s) => {
    const matchesQuery =
      query.value.trim() === '' ||
      `${s.id} ${s.route}`.toLowerCase().includes(query.value.trim().toLowerCase())
    const matchesRegion = region.value === 'all' || s.region === region.value
    const matchesStatus = status.value === 'all' || s.status === status.value
    return matchesQuery && matchesRegion && matchesStatus
  }),
)

const statusClass: Record<string, string> = {
  'In transit': 'blue',
  Delivered: 'green',
  Delayed: 'magenta',
  Scheduled: 'purple',
}

function clearAll() {
  query.value = ''
  region.value = 'all'
  status.value = 'all'
}
</script>

<template>
  <div class="explorer">
    <div class="controls">
      <div class="search">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <label for="ship-search" class="sr-only">Search shipments by ID or route</label>
        <input
          id="ship-search"
          v-model="query"
          type="search"
          placeholder="Search by ID or route…"
        />
      </div>

      <div class="filter">
        <label for="region-filter" class="sr-only">Filter by region</label>
        <select id="region-filter" v-model="region">
          <option value="all">All regions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="filter">
        <label for="status-filter" class="sr-only">Filter by status</label>
        <select id="status-filter" v-model="status">
          <option value="all">All statuses</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <button type="button" class="clear" @click="clearAll">Clear</button>
    </div>

    <p class="result-count" aria-live="polite">
      Showing <strong>{{ filtered.length }}</strong> of {{ shipments.length }} shipments
    </p>

    <div class="table-wrap" role="region" aria-label="Shipments" tabindex="0">
      <table>
        <thead>
          <tr>
            <th scope="col">Shipment</th>
            <th scope="col">Route</th>
            <th scope="col">Region</th>
            <th scope="col">Status</th>
            <th scope="col">ETA</th>
            <th scope="col" class="num">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in filtered" :key="s.id">
            <td class="mono">{{ s.id }}</td>
            <td>{{ s.route }}</td>
            <td>{{ s.region }}</td>
            <td>
              <span class="status" :class="statusClass[s.status]">{{ s.status }}</span>
            </td>
            <td class="muted">{{ s.eta }}</td>
            <td class="num">${{ s.value.toLocaleString() }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="empty">No shipments match your filters.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search {
  position: relative;
  flex: 1 1 240px;
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-faint);
  font-size: 1.1rem;
}

.search input {
  width: 100%;
  padding: 0.7rem 0.9rem 0.7rem 2.4rem;
}

input,
select {
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.9rem;
  transition: border-color 0.2s var(--ease);
}

input:focus,
select:focus {
  border-color: var(--brand);
}

.clear {
  padding: 0.7rem 1.1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
}

.result-count {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.8rem;
}

.table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

th,
td {
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--border);
}

th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-faint);
  background: var(--surface-2);
}

tbody tr {
  transition: background 0.2s var(--ease);
}

tbody tr:hover {
  background: var(--surface-hover);
}

tbody tr:last-child td {
  border-bottom: 0;
}

.mono {
  font-weight: 700;
}

.num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.muted {
  color: var(--text-muted);
}

.status {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status.blue {
  color: #05263a;
  background: #8fd6f5;
}
.status.green {
  color: #0b3d1e;
  background: #7ee2a8;
}
.status.magenta {
  color: #4a0d17;
  background: #ff9db4;
}
.status.purple {
  color: #2a0d4a;
  background: #cbb0ff;
}

.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
}
</style>
