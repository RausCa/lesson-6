import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ff-theme'

function initial(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  // Dark mode by default per brand requirement
  return 'dark'
}

// Shared singleton state so every component stays in sync
const theme = ref<Theme>(initial())

function apply(next: Theme) {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(next)
}

apply(theme.value)

watch(theme, (next) => {
  apply(next)
  localStorage.setItem(STORAGE_KEY, next)
})

export function useTheme() {
  function setTheme(next: Theme) {
    theme.value = next
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, setTheme, toggle }
}
