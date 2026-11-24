import { RoutineCategory } from '@/constants/categories'

export interface RoutineItem {
  id: string
  title: string
  startTime: string // "HH:mm" e.g. "08:00"
  endTime: string   // "HH:mm" e.g. "11:30"
  daysOfWeek: number[] // e.g. [1, 3, 5] for T2, T4, T6 (1 = T2 ... 7 = CN)
  category: RoutineCategory
  color: string // hex or color token
  location?: string
  note?: string
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

/**
 * Key format: `${routineId}::${dateString}` (where dateString is "YYYY-MM-DD")
 * Example: "routine_123::2026-11-23" -> true
 */
export type RoutineCompletionMap = Record<string, boolean>
