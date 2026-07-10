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

export const currentUser: UserProfile = {
  name: 'Ross Cattelan',
  role: 'Operations Lead',
  company: 'Fastforward Logistics',
  email: 'ross@fastforward.io',
  initials: 'RC',
}

/* ------------------------------------------------------------------ *
 * Month-indexed dataset
 * ------------------------------------------------------------------ */

export const monthLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const
export type MonthLabel = (typeof monthLabels)[number]

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

export const monthlyData: MonthlyMetrics[] = [
  { month: 'Jan', revenue: 820, activeShipments: 3120, onTimeDelivery: 88.0, delayedLoads: 210 },
  { month: 'Feb', revenue: 910, activeShipments: 3260, onTimeDelivery: 90.1, delayedLoads: 188 },
  { month: 'Mar', revenue: 880, activeShipments: 3180, onTimeDelivery: 89.3, delayedLoads: 195 },
  { month: 'Apr', revenue: 1015, activeShipments: 3440, onTimeDelivery: 91.6, delayedLoads: 164 },
  { month: 'May', revenue: 1120, activeShipments: 3610, onTimeDelivery: 92.8, delayedLoads: 150 },
  { month: 'Jun', revenue: 1240, activeShipments: 3842, onTimeDelivery: 94.7, delayedLoads: 128 },
  { month: 'Jul', revenue: 1180, activeShipments: 3760, onTimeDelivery: 93.9, delayedLoads: 139 },
  { month: 'Aug', revenue: 1290, activeShipments: 3910, onTimeDelivery: 94.2, delayedLoads: 133 },
  { month: 'Sep', revenue: 1350, activeShipments: 4020, onTimeDelivery: 95.1, delayedLoads: 121 },
  { month: 'Oct', revenue: 1410, activeShipments: 4130, onTimeDelivery: 95.6, delayedLoads: 118 },
  { month: 'Nov', revenue: 1520, activeShipments: 4280, onTimeDelivery: 96.0, delayedLoads: 109 },
  { month: 'Dec', revenue: 1600, activeShipments: 4390, onTimeDelivery: 96.4, delayedLoads: 102 },
]

/* ------------------------------------------------------------------ *
 * Daily breakdown (generated so it aggregates back to the month)
 * ------------------------------------------------------------------ */

export interface DailyMetrics {
  day: number
  revenue: number
  activeShipments: number
  onTimeDelivery: number
  delayedLoads: number
}

/** Days per month (non-leap year). */
export const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

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
  const shipments = distributeAvg(m.activeShipments, days, monthIndex * 1000 + 3, m.activeShipments * 0.06)
  const onTime = distributeAvg(m.onTimeDelivery, days, monthIndex * 1000 + 4, 2.5, 1)
  return Array.from({ length: days }, (_, d) => ({
    day: d + 1,
    revenue: revenue[d]!,
    activeShipments: shipments[d]!,
    onTimeDelivery: onTime[d]!,
    delayedLoads: delayed[d]!,
  }))
}

/* ------------------------------------------------------------------ *
 * Summary card configuration (drives the hero snapshot cards)
 * ------------------------------------------------------------------ */

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

export const summaryConfigs: SummaryConfig[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    field: 'revenue',
    accent: 'orange',
    target: 'revenue-section',
    positiveIsGood: true,
    aggregate: 'sum',
    format: 'money',
    allHint: 'full-year total',
    monthHint: 'vs. previous month',
  },
  {
    id: 'shipments',
    label: 'Active shipments',
    field: 'activeShipments',
    accent: 'blue',
    target: 'shipments-section',
    positiveIsGood: true,
    aggregate: 'avg',
    format: 'number',
    allHint: 'monthly average',
    monthHint: 'vs. previous month',
  },
  {
    id: 'ontime',
    label: 'On-time delivery',
    field: 'onTimeDelivery',
    accent: 'purple',
    target: 'performance-section',
    positiveIsGood: true,
    aggregate: 'avg',
    format: 'percent',
    allHint: '12-month average',
    monthHint: 'vs. previous month',
  },
  {
    id: 'delays',
    label: 'Delayed loads',
    field: 'delayedLoads',
    accent: 'magenta',
    target: 'shipments-section',
    positiveIsGood: false,
    aggregate: 'sum',
    format: 'number',
    allHint: 'full-year total',
    monthHint: 'vs. previous month',
  },
]

/* ------------------------------------------------------------------ *
 * Fleet mix + shipments
 * ------------------------------------------------------------------ */

export const fleetMix: ChartPoint[] = [
  { label: 'Road freight', value: 46 },
  { label: 'Air cargo', value: 24 },
  { label: 'Rail', value: 18 },
  { label: 'Sea', value: 12 },
]

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

const routePool: [string, Region][] = [
  ['Chicago → Dallas', 'South'],
  ['Seattle → Denver', 'West'],
  ['Atlanta → Miami', 'South'],
  ['Boston → New York', 'East'],
  ['Phoenix → Las Vegas', 'West'],
  ['Detroit → Cleveland', 'North'],
  ['Portland → Boise', 'West'],
  ['Newark → Philadelphia', 'East'],
  ['Houston → Austin', 'South'],
  ['Denver → Salt Lake City', 'West'],
  ['Chicago → Minneapolis', 'North'],
  ['Miami → Orlando', 'South'],
]

const statusPool = ['In transit', 'Delivered', 'Delayed', 'Scheduled'] as const

// Two representative shipments per month so every month has data to filter.
export const shipments: Shipment[] = monthLabels.flatMap((label, m) =>
  Array.from({ length: 2 }, (_, k) => {
    const idx = m * 2 + k
    const [route, region] = routePool[idx % routePool.length]!
    const status = statusPool[idx % statusPool.length]!
    const day = ((idx * 7) % 27) + 1
    return {
      id: `FF-${10400 + idx}`,
      route,
      region,
      status,
      eta: status === 'Delivered' ? `Delivered ${label} ${day}` : `${label} ${day}`,
      value: 7000 + ((idx * 3137) % 40000),
      month: m,
    }
  }),
)

export const regions: Region[] = ['North', 'South', 'East', 'West']
export const statuses = ['In transit', 'Delivered', 'Delayed', 'Scheduled'] as const
