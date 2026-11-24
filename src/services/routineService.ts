import { RoutineItem, RoutineCompletionMap } from '@/types/routine'
import { storageService, STORAGE_KEYS } from './storageService'
import { ROUTINE_CATEGORIES } from '@/constants/categories'

export const DEFAULT_ROUTINES: RoutineItem[] = [
  {
    id: 'rt_university',
    title: 'University (Đại học)',
    startTime: '08:00',
    endTime: '11:30',
    daysOfWeek: [1, 3, 5], // Thứ Hai, Thứ Tư, Thứ Sáu
    category: 'university',
    color: ROUTINE_CATEGORIES.university.accentColor,
    location: 'Giảng đường A1',
    note: 'Môn Cơ sở dữ liệu phân tán',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rt_data_analytics',
    title: 'Data Analyst Course',
    startTime: '14:00',
    endTime: '16:00',
    daysOfWeek: [2, 4], // Thứ Ba, Thứ Năm
    category: 'data_analytics',
    color: ROUTINE_CATEGORIES.data_analytics.accentColor,
    location: 'Phòng Lab Tự học',
    note: 'Thực hành SQL Queries & PowerBI Dashboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rt_english',
    title: 'English Speaking Club',
    startTime: '19:00',
    endTime: '20:00',
    daysOfWeek: [1, 4, 6], // Thứ Hai, Thứ Năm, Thứ Bảy
    category: 'english',
    color: ROUTINE_CATEGORIES.english.accentColor,
    location: 'Online Zoom',
    note: 'Luyện phản xạ giao tiếp chủ đề Work & Career',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rt_running',
    title: 'Chạy bộ rèn luyện',
    startTime: '05:30',
    endTime: '06:30',
    daysOfWeek: [2, 6], // Thứ Ba, Thứ Bảy
    category: 'exercise',
    color: ROUTINE_CATEGORIES.exercise.accentColor,
    location: 'Công viên',
    note: 'Khởi động kỹ, chạy 5km nhẹ nhàng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const routineService = {
  /**
   * Generates unique key combining routineId and date (YYYY-MM-DD)
   */
  getCompletionKey(routineId: string, dateString: string): string {
    return `${routineId}::${dateString}`
  },

  /**
   * Loads all routine templates from storage with validation and deduplication.
   * If user intentionally deletes all routines, returns empty array without force-reloading defaults.
   */
  getRoutines(): RoutineItem[] {
    const rawData = storageService.get<unknown>(STORAGE_KEYS.ROUTINES, null)

    // Key has never been set in localStorage -> First time visit
    if (rawData === null) {
      storageService.set(STORAGE_KEYS.ROUTINES, DEFAULT_ROUTINES)
      return DEFAULT_ROUTINES
    }

    if (!Array.isArray(rawData)) {
      return []
    }

    // Validate and deduplicate by ID
    const validRoutines: RoutineItem[] = []
    const seenIds = new Set<string>()

    for (const item of rawData) {
      if (
        item &&
        typeof item === 'object' &&
        'id' in item &&
        typeof item.id === 'string' &&
        'title' in item &&
        typeof item.title === 'string' &&
        Array.isArray(item.daysOfWeek) &&
        'startTime' in item &&
        'endTime' in item
      ) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id)
          validRoutines.push(item as RoutineItem)
        }
      }
    }

    return validRoutines
  },

  /**
   * Clears all routine templates
   */
  clearRoutines(): void {
    storageService.set(STORAGE_KEYS.ROUTINES, [])
  },

  /**
   * Saves routine templates to storage
   */
  saveRoutines(routines: RoutineItem[]): void {
    storageService.set(STORAGE_KEYS.ROUTINES, routines)
  },

  /**
   * Creates a new routine template
   */
  createRoutine(data: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt'>): RoutineItem {
    const routines = this.getRoutines()
    const now = new Date().toISOString()
    const newRoutine: RoutineItem = {
      ...data,
      id: `rt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    }

    const updated = [...routines, newRoutine]
    this.saveRoutines(updated)
    return newRoutine
  },

  /**
   * Updates an existing routine template
   */
  updateRoutine(
    id: string,
    updates: Partial<Omit<RoutineItem, 'id' | 'createdAt'>>
  ): RoutineItem | null {
    const routines = this.getRoutines()
    const index = routines.findIndex((r) => r.id === id)
    if (index === -1) return null

    const updatedRoutine: RoutineItem = {
      ...routines[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    routines[index] = updatedRoutine
    this.saveRoutines(routines)
    return updatedRoutine
  },

  /**
   * Deletes a routine template AND cleans up related completions
   */
  deleteRoutine(id: string): void {
    const routines = this.getRoutines()
    const filtered = routines.filter((r) => r.id !== id)
    this.saveRoutines(filtered)

    // Clean up orphaned completion entries associated with this routine ID
    const completions = this.getCompletions()
    const prefix = `${id}::`
    let changed = false
    for (const key of Object.keys(completions)) {
      if (key.startsWith(prefix)) {
        delete completions[key]
        changed = true
      }
    }
    if (changed) {
      this.saveCompletions(completions)
    }
  },

  /**
   * Loads completion map from LocalStorage with basic validation
   */
  getCompletions(): RoutineCompletionMap {
    const raw = storageService.get<unknown>(STORAGE_KEYS.ROUTINE_COMPLETIONS, {})
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {}
    }
    return raw as RoutineCompletionMap
  },

  /**
   * Saves completion map to LocalStorage
   */
  saveCompletions(map: RoutineCompletionMap): void {
    storageService.set(STORAGE_KEYS.ROUTINE_COMPLETIONS, map)
  },

  /**
   * Checks if a routine is completed on a specific date (YYYY-MM-DD)
   */
  isCompleted(routineId: string, dateString: string, map?: RoutineCompletionMap): boolean {
    const completions = map || this.getCompletions()
    const key = this.getCompletionKey(routineId, dateString)
    return Boolean(completions[key])
  },

  /**
   * Toggles completion for a routine on a specific date
   */
  toggleCompletion(
    routineId: string,
    dateString: string
  ): { updatedMap: RoutineCompletionMap; isCompleted: boolean } {
    const completions = { ...this.getCompletions() }
    const key = this.getCompletionKey(routineId, dateString)
    const newStatus = !completions[key]

    if (newStatus) {
      completions[key] = true
    } else {
      delete completions[key]
    }

    this.saveCompletions(completions)
    return { updatedMap: completions, isCompleted: newStatus }
  },
}
