export type Trend = 'up' | 'down'
export type Region = 'North' | 'South' | 'East' | 'West'

export interface SummaryMetric {
  id: string
  label: string
  value: string
  rawValue: number
  delta: string
  trend: Trend
  /** Whether an increase is good (affects colour semantics). */
  positiveIsGood: boolean
  hint: string
  accent: 'orange' | 'purple' | 'blue' | 'magenta'
  /** Section id this card drills into. */
  target: string
}

export interface ChartPoint {
  label: string
  value: number
}

export interface Shipment {
  id: string
  route: string
  region: Region
  status: 'In transit' | 'Delivered' | 'Delayed' | 'Scheduled'
  eta: string
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

export const summaryMetrics: SummaryMetric[] = [
  {
    id: 'revenue',
    label: 'Monthly revenue',
    value: '$1.24M',
    rawValue: 1_240_000,
    delta: '+12.4%',
    trend: 'up',
    positiveIsGood: true,
    hint: 'vs. last month',
    accent: 'orange',
    target: 'revenue-section',
  },
  {
    id: 'shipments',
    label: 'Active shipments',
    value: '3,842',
    rawValue: 3842,
    delta: '+6.1%',
    trend: 'up',
    positiveIsGood: true,
    hint: 'currently on the move',
    accent: 'blue',
    target: 'shipments-section',
  },
  {
    id: 'ontime',
    label: 'On-time delivery',
    value: '94.7%',
    rawValue: 94.7,
    delta: '+1.8%',
    trend: 'up',
    positiveIsGood: true,
    hint: 'rolling 30 days',
    accent: 'purple',
    target: 'performance-section',
  },
  {
    id: 'delays',
    label: 'Delayed loads',
    value: '128',
    rawValue: 128,
    delta: '-9.3%',
    trend: 'down',
    positiveIsGood: true,
    hint: 'fewer than last week',
    accent: 'magenta',
    target: 'shipments-section',
  },
]

export const revenueByMonth: ChartPoint[] = [
  { label: 'Jan', value: 820 },
  { label: 'Feb', value: 910 },
  { label: 'Mar', value: 880 },
  { label: 'Apr', value: 1015 },
  { label: 'May', value: 1120 },
  { label: 'Jun', value: 1240 },
]

export const deliveryTrend: ChartPoint[] = [
  { label: 'Jan', value: 88 },
  { label: 'Feb', value: 90 },
  { label: 'Mar', value: 89 },
  { label: 'Apr', value: 92 },
  { label: 'May', value: 93 },
  { label: 'Jun', value: 95 },
]

export const fleetMix: ChartPoint[] = [
  { label: 'Road freight', value: 46 },
  { label: 'Air cargo', value: 24 },
  { label: 'Rail', value: 18 },
  { label: 'Sea', value: 12 },
]

export const shipments: Shipment[] = [
  { id: 'FF-10482', route: 'Chicago → Dallas', region: 'South', status: 'In transit', eta: 'Today, 6:40 PM', value: 42_500 },
  { id: 'FF-10485', route: 'Seattle → Denver', region: 'West', status: 'Delayed', eta: 'Tomorrow, 9:15 AM', value: 28_900 },
  { id: 'FF-10490', route: 'Atlanta → Miami', region: 'South', status: 'Delivered', eta: 'Delivered 2:03 PM', value: 15_200 },
  { id: 'FF-10493', route: 'Boston → New York', region: 'East', status: 'In transit', eta: 'Today, 8:20 PM', value: 9_800 },
  { id: 'FF-10498', route: 'Phoenix → Las Vegas', region: 'West', status: 'Scheduled', eta: 'Fri, 7:00 AM', value: 33_400 },
  { id: 'FF-10501', route: 'Detroit → Cleveland', region: 'North', status: 'Delivered', eta: 'Delivered 11:47 AM', value: 12_650 },
  { id: 'FF-10507', route: 'Portland → Boise', region: 'West', status: 'Delayed', eta: 'Tomorrow, 1:30 PM', value: 21_100 },
  { id: 'FF-10512', route: 'Newark → Philadelphia', region: 'East', status: 'In transit', eta: 'Today, 5:05 PM', value: 7_400 },
]

export const regions: Region[] = ['North', 'South', 'East', 'West']
export const statuses = ['In transit', 'Delivered', 'Delayed', 'Scheduled'] as const
