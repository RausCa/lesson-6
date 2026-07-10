import metrics from './metrics.json'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type Region = 'North' | 'South' | 'East' | 'West'

export interface ChartPoint {
  label: string
  value: number
}

export interface UserProfile {
  name: string
  role: string
  company: string
  email: string
  initials: string
}

export type MonthLabel =
  | 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'
  | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'

/** Numeric fields tracked for every month. */
export type MetricField = 'revenue' | 'activeShipments' | 'onTimeDelivery' | 'delayedLoads'

export interface MonthlyMetrics {
  month: MonthLabel
  /** Gross revenue in thousands of USD. */
  revenue: number
  activeShipments: number
  /** On-time delivery percentage. */
  onTimeDelivery: number
  delayedLoads: number
}

export type ValueFormat = 'money' | 'number' | 'percent'

export interface SummaryConfig {
  id: string
  label: string
  field: MetricField
  accent: 'orange' | 'purple' | 'blue' | 'magenta'
  /** Section the card scrolls to when clicked. */
  target: string
  /** Whether an increase in the value is a good thing. */
  positiveIsGood: boolean
  /** How the "All months" value is aggregated. */
  aggregate: 'sum' | 'avg'
  format: ValueFormat
  allHint: string
  monthHint: string
}

export interface Shipment {
  id: string
  route: string
  region: Region
  status: 'In transit' | 'Delivered' | 'Delayed' | 'Scheduled'
  eta: string
  value: number
  /** Month index (0 = Jan … 11 = Dec). */
  month: number
}

export interface DailyMetrics {
  day: number
  revenue: number
  activeShipments: number
  onTimeDelivery: number
  delayedLoads: number
}

/* ------------------------------------------------------------------ *
 * Data (sourced from metrics.json)
 * ------------------------------------------------------------------ */

export const currentUser = metrics.currentUser as UserProfile
export const monthLabels = metrics.monthLabels as readonly MonthLabel[]
export const daysInMonth = metrics.daysInMonth as readonly number[]
export const monthlyData = metrics.monthlyData as MonthlyMetrics[]
export const summaryConfigs = metrics.summaryConfigs as SummaryConfig[]
export const fleetMix = metrics.fleetMix as ChartPoint[]
export const fleetMixByMonth = metrics.fleetMixByMonth as ChartPoint[][]
export const shipments = metrics.shipments as Shipment[]
export const regions = metrics.regions as Region[]
export const statuses = metrics.statuses as readonly Shipment['status'][]

/* ------------------------------------------------------------------ *
 * Daily breakdown (generated so it aggregates back to the month)
 * ------------------------------------------------------------------ */

/** Deterministic pseudo-random value in [0, 1) for a given seed. */
function pseudo(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/** Split a monthly total across `days` so the daily values sum exactly to it. */
function distributeSum(total: number, days: number, seedBase: number): number[] {
  const weights = Array.from({ length: days }, (_, d) => 0.7 + pseudo(seedBase + d))
  const weightSum = weights.reduce((a, b) => a + b, 0)
  const values = weights.map((w) => Math.round((total * w) / weightSum))
  // Correct any rounding drift so the sum is exact.
  let diff = total - values.reduce((a, b) => a + b, 0)
  let i = 0
  while (diff !== 0) {
    const idx = i % days
    const step = diff > 0 ? 1 : -1
    values[idx]! += step
    diff -= step
    i++
  }
  return values
}

/** Vary daily values around a monthly average, keeping the mean on target. */
function distributeAvg(avg: number, days: number, seedBase: number, amplitude: number, decimals = 0): number[] {
  const raw = Array.from({ length: days }, (_, d) => avg + (pseudo(seedBase + d) - 0.5) * 2 * amplitude)
  const mean = raw.reduce((a, b) => a + b, 0) / days
  const factor = 10 ** decimals
  return raw.map((v) => Math.round((v - (mean - avg)) * factor) / factor)
}

/** Generate a full daily series for a month that rolls up to its monthly figures. */
export function getDailyData(monthIndex: number): DailyMetrics[] {
  const m = monthlyData[monthIndex]!
  const days = daysInMonth[monthIndex]!
  const revenue = distributeSum(m.revenue, days, monthIndex * 1000 + 1)
  const delayed = distributeSum(m.delayedLoads, days, monthIndex * 1000 + 2)
  const shipmentsPerDay = distributeAvg(m.activeShipments, days, monthIndex * 1000 + 3, m.activeShipments * 0.06)
  const onTime = distributeAvg(m.onTimeDelivery, days, monthIndex * 1000 + 4, 2.5, 1)
  return Array.from({ length: days }, (_, d) => ({
    day: d + 1,
    revenue: revenue[d]!,
    activeShipments: shipmentsPerDay[d]!,
    onTimeDelivery: onTime[d]!,
    delayedLoads: delayed[d]!,
  }))
}
