import { computed, ref } from 'vue'
import {
  fleetMix,
  fleetMixByMonth,
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

export interface Insights {
  summary: string[]
  concerns: string[]
  actions: string[]
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

  /** On-time delivery: 12 months when "all", otherwise weekly averages for the month. */
  function weeklyOnTime(monthIndex: number): ChartPoint[] {
    const daily = getDailyData(monthIndex)
    const weeks: ChartPoint[] = []
    for (let i = 0; i < daily.length; i += 7) {
      const chunk = daily.slice(i, i + 7)
      const avg = chunk.reduce((a, d) => a + d.onTimeDelivery, 0) / chunk.length
      weeks.push({ label: `Wk ${weeks.length + 1}`, value: Math.round(avg * 10) / 10 })
    }
    return weeks
  }

  const revenueSeries = computed(() => series('revenue'))
  const deliverySeries = computed<ChartPoint[]>(() =>
    isAll.value
      ? monthlyData.map((m) => ({ label: m.month, value: m.onTimeDelivery }))
      : weeklyOnTime(selected.value as number),
  )

  /** Fleet mix: overall split when "all", otherwise the selected month's split. */
  const fleetMixSeries = computed<ChartPoint[]>(() =>
    isAll.value ? fleetMix : (fleetMixByMonth[selected.value as number] ?? fleetMix),
  )

  const filteredShipments = computed(() =>
    isAll.value ? shipments : shipments.filter((s) => s.month === selected.value),
  )

  /** Auto-generated narrative: summary, concerns and recommended actions. */
  const insights = computed<Insights>(() => {
    const TARGET = 95

    if (isAll.value) {
      const totalRevenue = monthlyData.reduce((a, m) => a + m.revenue, 0)
      const avgOnTime = monthlyData.reduce((a, m) => a + m.onTimeDelivery, 0) / monthlyData.length
      const totalDelayed = monthlyData.reduce((a, m) => a + m.delayedLoads, 0)
      const best = monthlyData.reduce((a, b) => (b.onTimeDelivery > a.onTimeDelivery ? b : a))
      const worst = monthlyData.reduce((a, b) => (b.onTimeDelivery < a.onTimeDelivery ? b : a))
      const first = monthlyData[0]!
      const last = monthlyData[monthlyData.length - 1]!
      const trendUp = last.onTimeDelivery >= first.onTimeDelivery

      const summary = [
        `Full-year revenue totaled $${(totalRevenue / 1000).toFixed(2)}M across all 12 months.`,
        `On-time delivery averaged ${avgOnTime.toFixed(1)}% with ${totalDelayed.toLocaleString()} delayed loads in total.`,
        `Service levels trended ${trendUp ? 'upward' : 'downward'} from ${first.month} to ${last.month}.`,
      ]
      const concerns = [`${worst.month} was the weakest month at ${worst.onTimeDelivery}% on-time.`]
      if (avgOnTime < TARGET) {
        concerns.push(`The annual on-time average (${avgOnTime.toFixed(1)}%) sits below the ${TARGET}% target.`)
      }
      const actions = [
        `Replicate ${best.month}'s playbook — it reached ${best.onTimeDelivery}% on-time.`,
        `Build a recovery plan for softer months like ${worst.month}.`,
      ]
      return { summary, concerns, actions }
    }

    const i = selected.value as number
    const m = monthlyData[i]!
    const prev = i > 0 ? monthlyData[i - 1]! : null
    const revDelta = prev ? ((m.revenue - prev.revenue) / prev.revenue) * 100 : null

    const summary = [
      `Revenue reached $${(m.revenue / 1000).toFixed(2)}M${revDelta !== null ? ` (${formatPct(revDelta)} vs ${prev!.month})` : ''}.`,
      `On-time delivery ran at ${m.onTimeDelivery}% with ${m.delayedLoads} delayed loads.`,
      `Around ${m.activeShipments.toLocaleString()} active shipments moved through the network.`,
    ]

    const concerns: string[] = []
    if (m.onTimeDelivery < TARGET) {
      concerns.push(`On-time delivery (${m.onTimeDelivery}%) is below the ${TARGET}% service target.`)
    }
    if (prev && m.delayedLoads > prev.delayedLoads) {
      concerns.push(`Delayed loads climbed to ${m.delayedLoads} (from ${prev.delayedLoads} in ${prev.month}).`)
    }
    if (prev && m.revenue < prev.revenue) {
      concerns.push(`Revenue slipped ${formatPct(revDelta!)} versus ${prev.month}.`)
    }
    if (concerns.length === 0) {
      concerns.push('No red flags — every metric is trending in the right direction.')
    }

    const actions: string[] = []
    if (m.onTimeDelivery < TARGET) {
      actions.push('Investigate the lanes driving late deliveries and rebalance carrier capacity.')
    }
    if (prev && m.delayedLoads > prev.delayedLoads) {
      actions.push(`Clear the backlog of ${m.delayedLoads} delayed loads before month-end.`)
    }
    if (actions.length === 0) {
      actions.push('Maintain momentum — reinvest in the top-performing routes.')
    }
    actions.push("Share this month's numbers with the ops team in the weekly review.")
    return { summary, concerns, actions }
  })

  return {
    selected,
    isAll,
    selectedLabel,
    monthOptions,
    summaryCards,
    revenueSeries,
    deliverySeries,
    fleetMixSeries,
    filteredShipments,
    insights,
  }
}
