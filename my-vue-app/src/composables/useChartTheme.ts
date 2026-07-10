import { computed } from 'vue'
import { useTheme } from './useTheme'

/** Resolve a CSS colour that may be a `var(--x)` expression to a concrete value. */
export function resolveColor(color: string): string {
  const match = color.match(/var\((--[\w-]+)\)/)
  if (match && match[1]) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim()
    return value || color
  }
  return color
}

/**
 * Theme-aware colours for Chart.js axes, gridlines and tooltips.
 * Recomputes whenever the app theme changes so canvas charts stay legible.
 */
export function useChartTheme() {
  const { theme } = useTheme()

  const colors = computed(() => {
    // Depend on `theme` so the values refresh on light/dark toggle.
    void theme.value
    const root = getComputedStyle(document.documentElement)
    const read = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
    return {
      text: read('--text-muted', '#a4adc2'),
      grid: read('--grid-line', 'rgba(255,255,255,0.08)'),
      surface: read('--surface', '#171b25'),
      border: read('--border', '#2a3143'),
    }
  })

  return { theme, colors }
}
