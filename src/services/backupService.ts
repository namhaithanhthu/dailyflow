import { RoutineItem, RoutineCompletionMap } from '@/types/routine'
import { TaskItem } from '@/types/task'
import { DayHistoryRecord } from '@/types/progress'
import { storageService, STORAGE_KEYS } from './storageService'
import { getTodayDateString } from './dateService'

export const SCHEMA_VERSION = '1.0.0'

export interface DailyFlowBackup {
  app: 'DailyFlow'
  schemaVersion: string
  exportedAt: string
  data: {
    routines: RoutineItem[]
    completions: RoutineCompletionMap
    tasks: TaskItem[]
    history: Record<string, DayHistoryRecord>
    bestStreak: number
  }
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  backup?: DailyFlowBackup
  summary?: {
    routinesCount: number
    tasksCount: number
    completionsCount: number
    bestStreak: number
  }
}

export const backupService = {
  /**
   * Generates a backup object containing all application data
   */
  createBackupPayload(): DailyFlowBackup {
    const routines = storageService.get<RoutineItem[]>(STORAGE_KEYS.ROUTINES, [])
    const completions = storageService.get<RoutineCompletionMap>(
      STORAGE_KEYS.ROUTINE_COMPLETIONS,
      {}
    )
    const tasks = storageService.get<TaskItem[]>(STORAGE_KEYS.TASKS, [])
    const history = storageService.get<Record<string, DayHistoryRecord>>(
      STORAGE_KEYS.DAILY_HISTORY,
      {}
    )
    const bestStreak = storageService.get<number>(STORAGE_KEYS.BEST_STREAK, 0)

    return {
      app: 'DailyFlow',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        routines,
        completions,
        tasks,
        history,
        bestStreak,
      },
    }
  },

  /**
   * Triggers download of the backup JSON file
   */
  exportToFile(): void {
    const payload = this.createBackupPayload()
    const jsonStr = JSON.stringify(payload, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const dateStr = getTodayDateString()
    const fileName = `dailyflow-backup-${dateStr}.json`

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  /**
   * Validates raw JSON string uploaded from user
   */
  validateBackup(jsonString: string): ValidationResult {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { isValid: false, error: 'File dữ liệu rỗng hoặc không đúng định dạng.' }
      }

      const parsed = JSON.parse(jsonString) as Partial<DailyFlowBackup>

      // Check app identity
      if (parsed.app !== 'DailyFlow') {
        return {
          isValid: false,
          error: 'File này không phải là bản sao lưu của DailyFlow (thiếu định danh app).',
        }
      }

      // Check data container
      if (!parsed.data || typeof parsed.data !== 'object') {
        return {
          isValid: false,
          error: 'Cấu trúc dữ liệu trong file sao lưu không hợp lệ.',
        }
      }

      const { routines, completions, tasks } = parsed.data

      // Validate routines
      if (!Array.isArray(routines)) {
        return {
          isValid: false,
          error: 'Dữ liệu thời khóa biểu (routines) không phải dạng danh sách.',
        }
      }

      // Validate each routine has basic structure
      for (const r of routines) {
        if (!r.id || !r.title || !Array.isArray(r.daysOfWeek) || !r.startTime || !r.endTime) {
          return {
            isValid: false,
            error: `Phát hiện mục Routine không hợp lệ: "${r?.title || 'Không tên'}".`,
          }
        }
      }

      // Validate tasks
      if (!Array.isArray(tasks)) {
        return {
          isValid: false,
          error: 'Dữ liệu công việc (tasks) không phải dạng danh sách.',
        }
      }

      for (const t of tasks) {
        if (!t.id || !t.title || !t.date) {
          return {
            isValid: false,
            error: `Phát hiện mục Task không hợp lệ: "${t?.title || 'Không tên'}".`,
          }
        }
      }

      // Validate completions
      if (completions && typeof completions !== 'object') {
        return {
          isValid: false,
          error: 'Dữ liệu hoàn thành (completions) không đúng cấu trúc.',
        }
      }

      const fullBackup = parsed as DailyFlowBackup

      return {
        isValid: true,
        backup: fullBackup,
        summary: {
          routinesCount: routines.length,
          tasksCount: tasks.length,
          completionsCount: Object.keys(completions || {}).length,
          bestStreak: fullBackup.data.bestStreak || 0,
        },
      }
    } catch {
      return {
        isValid: false,
        error: 'File không phải là định dạng JSON hợp lệ. Vui lòng kiểm tra lại file.',
      }
    }
  },

  /**
   * Restores all data into LocalStorage
   */
  importBackup(backup: DailyFlowBackup): void {
    storageService.set(STORAGE_KEYS.ROUTINES, backup.data.routines)
    storageService.set(STORAGE_KEYS.ROUTINE_COMPLETIONS, backup.data.completions)
    storageService.set(STORAGE_KEYS.TASKS, backup.data.tasks)
    storageService.set(STORAGE_KEYS.DAILY_HISTORY, backup.data.history || {})
    storageService.set(STORAGE_KEYS.BEST_STREAK, backup.data.bestStreak || 0)
  },
}
