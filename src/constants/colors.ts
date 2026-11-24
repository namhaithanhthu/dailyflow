export const DAILYFLOW_COLORS = {
  bg: '#FFFDF9',
  pink: '#F4C9D4',
  lightPink: '#F9E8ED',
  sageGreen: '#DCEBDD',
  softYellow: '#F5E7B0',
  text: '#353535',
  muted: '#7A7A7A',
  border: '#EFE9E2',
  card: '#FFFFFF',
} as const

export type ColorThemeKey = keyof typeof DAILYFLOW_COLORS
