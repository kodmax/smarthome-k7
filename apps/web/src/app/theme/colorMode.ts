export const COLOR_MODE_STORAGE_KEY = 'smarthome-color-mode'

export type AppColorMode = 'light' | 'dark' | 'system'

export const isAppColorMode = (value: string | null): value is AppColorMode =>
  value === 'light' || value === 'dark' || value === 'system'

export const getStoredColorMode = (): AppColorMode | null => {
  const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
  return isAppColorMode(stored) ? stored : null
}

export const setStoredColorMode = (mode: AppColorMode) => {
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
}
