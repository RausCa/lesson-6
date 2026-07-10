import { computed, ref } from 'vue'
import {
  getDailyData,
  monthLabels,
  monthlyData,
  shipments,
  summaryConfigs,
  type ChartPoint,
  type MetricField,
  type ValueFormat,
} from '../data/dashboard'

/** `'all'` = 12-month view, otherwise a month index (0 = Jan … 11 = Dec). */
export type MonthSelection = 'all' | number

export interface SummaryCard {
  id: string
  label: string
  accent: 'orange' | 'purple' | 'blue' | 'magenta'
  target: string
  value: string
  hint: string
  /** Only true for a specific month (change vs. previous month). */
  showDelta: boolean
  deltaLabel: string
  trend: 'up' | 'down' | null
  /** Whether the change is a positive outcome (drives colour). */
  isGood: boolean
}

export interface MonthOption {
  title: string
  value: MonthSelection
}

// Shared singleton selection so every component reacts to the same picker.
const selected = ref<MonthSelection>('all')

function formatValue(format: ValueFormat, v: number): string {
  if (format === 'money') return `$${(v / 1000).toFixed(2)}M`
  if (format === 'percent') return `${v.toFixed(1)}%`
  return Math.round(v).toLocaleString()
}

function formatPct(p: number): string {
  return `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`
}

export function useMonthFilter() {
  const isAll = computed(() => selected.value === 'all')

  const selectedLabel = computed(() =>
    isAll.value ? 'All months' : monthLabels[selected.value as number]!,
  )

  const monthOptions = computed<MonthOption[]>(() => [
    { title: 'All months', value: 'all' },
    ...monthLabels.map((label, i) => ({ title: label, value: i as MonthSelection })),
  ])

  const summaryCards = computed<SummaryCard[]>(() =>
    summaryConfigs.map((cfg) => {
      const values = monthlyData.map((m) => m[cfg.field])

      if (isAll.value) {
        const total = values.reduce((a, b) => a + b, 0)
        const agg = cfg.aggregate === 'sum' ? total : total / values.length
        return {
          id: cfg.id,
          label: cfg.label,
          accent: cfg.accent,
          target: cfg.target,
          value: formatValue(cfg.format, agg),
          hint: cfg.allHint,
          showDelta: false,
          deltaLabel: '',
          trend: null,
          isGood: true,
        }
      }

      const i = selected.value as number
      const current = values[i]!
      const previous = i > 0 ? values[i - 1]! : null
      const deltaPct = previous !== null && previous !== 0 ? ((current - previous) / previous) * 100 : null
      const trend = deltaPct === null ? null : deltaPct >= 0 ? 'up' : 'down'
      const isGood = deltaPct === null ? true : deltaPct >= 0 === cfg.positiveIsGood

      return {
        id: cfg.id,
        label: cfg.label,
        accent: cfg.accent,
        target: cfg.target,
        value: formatValue(cfg.format, current),
        hint: previous === null ? 'no prior month' : cfg.monthHint,
        showDelta: deltaPct !== null,
        deltaLabel: deltaPct === null ? '' : formatPct(deltaPct),
        trend,
        isGood,
      }
    }),
  )

  function series(field: MetricField): ChartPoint[] {
    if (isAll.value) return monthlyData.map((m) => ({ label: m.month, value: m[field] }))
    const monthIndex = selected.value as number
    return getDailyData(monthIndex).map((d) => ({ label: String(d.day), value: d[field] }))
  }

  const revenueSeries = computed(() => series('revenue'))
  const deliverySeries = computed(() => series('onTimeDelivery'))

  const filteredShipments = computed(() =>
    isAll.value ? shipments : shipments.filter((s) => s.month === selected.value),
  )

  return {
    selected,
    isAll,
    selectedLabel,
    monthOptions,
    summaryCards,
    revenueSeries,
    deliverySeries,
    filteredShipments,
  }
}
