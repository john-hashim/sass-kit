import type { Theme } from '@/types/auth'

export function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.dataset.theme = theme
}
