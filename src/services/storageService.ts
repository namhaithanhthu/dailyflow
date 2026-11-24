/**
 * Safe LocalStorage Service for DailyFlow
 */

export const STORAGE_KEYS = {
  ROUTINES: 'dailyflow_routines_v1',
  ROUTINE_COMPLETIONS: 'dailyflow_routine_completions_v1',
  TASKS: 'dailyflow_tasks_v1',
  DAILY_HISTORY: 'dailyflow_daily_history_v1',
  BEST_STREAK: 'dailyflow_best_streak_v1',
} as const

export const storageService = {
  get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback
      }
      const raw = window.localStorage.getItem(key)
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch (err) {
      console.warn(`[storageService] Error reading key "${key}":`, err)
      return fallback
    }
  },

  set<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`[storageService] Error saving key "${key}":`, err)
    }
  },

  remove(key: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.removeItem(key)
    } catch (err) {
      console.error(`[storageService] Error removing key "${key}":`, err)
    }
  },
}
