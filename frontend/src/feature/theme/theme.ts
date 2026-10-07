export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'studio-theme'

export function readTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Use the system theme when browser storage is unavailable.
  }
  return 'system'
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme) {
  applyTheme(theme)
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The chosen theme still applies for this session.
  }
}
