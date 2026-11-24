import { RoutineItem, RoutineCompletionMap } from '@/types/routine'
import { TaskItem } from '@/types/task'
import { DailyProgress, DayHistoryRecord, StreakInfo } from '@/types/progress'
import {
  formatToLocalDateString,
  getDayOfWeekNumber,
  parseLocalDateString,
} from './dateService'
import { storageService, STORAGE_KEYS } from './storageService'
import { routineService } from './routineService'

export const progressService = {
  /**
   * Calculates progress summary given total and completed counts
   */
  calculateProgress(
    completed: number,
    total: number,
    dateStr: string,
    routineTotal: number = 0,
    routineCompleted: number = 0,
    taskTotal: number = 0,
    taskCompleted: number = 0
  ): DailyProgress {
    const totalActivities = Math.max(0, total)
    const completedActivities = Math.min(totalActivities, Math.max(0, completed))
    const remainingActivities = Math.max(0, totalActivities - completedActivities)

    let completionPercentage = 0
    if (totalActivities > 0) {
      completionPercentage = Math.round((completedActivities / totalActivities) * 100)
    }

    const isGoalAchieved = totalActivities > 0 && completionPercentage >= 50

    let neededToGoal = 0
    if (!isGoalAchieved && totalActivities > 0) {
      const targetCount = Math.ceil(totalActivities * 0.5)
      neededToGoal = Math.max(0, targetCount - completedActivities)
    }

    return {
      date: dateStr,
      totalActivities,
      completedActivities,
      remainingActivities,
      completionPercentage,
      isGoalAchieved,
      neededToGoal,
      routineTotal,
      routineCompleted,
      taskTotal,
      taskCompleted,
    }
  },

  /**
   * Computes the daily workload for a specific calendar date (YYYY-MM-DD)
   */
  getDailyWorkload(
    dateStr: string,
    routines: RoutineItem[],
    completions: RoutineCompletionMap,
    tasks: TaskItem[]
  ): DailyProgress {
    const localDate = parseLocalDateString(dateStr)
    const dayOfWeek = getDayOfWeekNumber(localDate)

    // 1. Routine occurrences for this day of week
    const dayRoutines = routines.filter(
      (r) => Array.isArray(r.daysOfWeek) && r.daysOfWeek.includes(dayOfWeek)
    )
    const routineTotal = dayRoutines.length
    let routineCompleted = 0
    dayRoutines.forEach((r) => {
      const key = routineService.getCompletionKey(r.id, dateStr)
      if (completions[key]) {
        routineCompleted++
      }
    })

    // 2. Tasks scheduled for this date
    const dayTasks = tasks.filter((t) => t.date === dateStr)
    const taskTotal = dayTasks.length
    const taskCompleted = dayTasks.filter((t) => t.completed).length

    // Combined totals
    const totalActivities = routineTotal + taskTotal
    const completedActivities = routineCompleted + taskCompleted

    return this.calculateProgress(
      completedActivities,
      totalActivities,
      dateStr,
      routineTotal,
      routineCompleted,
      taskTotal,
      taskCompleted
    )
  },

  /**
   * Loads historical snapshots from storage
   */
  getHistory(): Record<string, DayHistoryRecord> {
    return storageService.get<Record<string, DayHistoryRecord>>(
      STORAGE_KEYS.DAILY_HISTORY,
      {}
    )
  },

  /**
   * Saves historical snapshots to storage
   */
  saveHistory(history: Record<string, DayHistoryRecord>): void {
    storageService.set(STORAGE_KEYS.DAILY_HISTORY, history)
  },

  /**
   * Gets or initializes the best streak record
   */
  getBestStreak(): number {
    return storageService.get<number>(STORAGE_KEYS.BEST_STREAK, 0)
  },

  /**
   * Saves updated best streak
   */
  saveBestStreak(bestStreak: number): void {
    storageService.set(STORAGE_KEYS.BEST_STREAK, bestStreak)
  },

  /**
   * Computes current streak, best streak, and 7-day history visualization
   */
  calculateStreakInfo(
    todayDateStr: string,
    todayProgress: DailyProgress,
    routines: RoutineItem[],
    completions: RoutineCompletionMap,
    tasks: TaskItem[]
  ): StreakInfo {
    const history = { ...this.getHistory() }
    const todayDate = parseLocalDateString(todayDateStr)

    // 1. Save / Update today's record in history
    const todayDayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][todayDate.getDay()]
    history[todayDateStr] = {
      date: todayDateStr,
      dayName: todayDayName,
      totalActivities: todayProgress.totalActivities,
      completedActivities: todayProgress.completedActivities,
      completionPercentage: todayProgress.completionPercentage,
      status: todayProgress.isGoalAchieved
        ? 'success'
        : todayProgress.totalActivities > 0
        ? 'in_progress'
        : 'empty',
    }
    this.saveHistory(history)

    // 2. Count consecutive past successful days starting from yesterday (today - 1 day)
    let streakBeforeToday = 0
    let checkDate = new Date(todayDate)

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1)
      const checkStr = formatToLocalDateString(checkDate)

      let record = history[checkStr]
      // If no historical snapshot exists for past date, compute it dynamically
      if (!record) {
        const pastProgress = this.getDailyWorkload(checkStr, routines, completions, tasks)
        const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][checkDate.getDay()]
        record = {
          date: checkStr,
          dayName,
          totalActivities: pastProgress.totalActivities,
          completedActivities: pastProgress.completedActivities,
          completionPercentage: pastProgress.completionPercentage,
          status: pastProgress.isGoalAchieved
            ? 'success'
            : pastProgress.totalActivities > 0
            ? 'failed'
            : 'empty',
        }
        // Save snapshot so it's finalized
        history[checkStr] = record
        this.saveHistory(history)
      }

      if (record.status === 'success') {
        streakBeforeToday++
      } else {
        // Any missed day, failed day, or empty day breaks the continuous streak
        break
      }
    }

    // 3. Determine currentStreak based on today's goal status
    // If today is completed (>= 50%), today counts!
    // If today is NOT yet completed, streak from yesterday is preserved (not reset mid-day!)
    let currentStreak = 0
    if (todayProgress.isGoalAchieved) {
      currentStreak = streakBeforeToday + 1
    } else {
      currentStreak = streakBeforeToday
    }

    // 4. Update and persist Best Streak
    const savedBest = this.getBestStreak()
    const bestStreak = Math.max(savedBest, currentStreak)
    if (bestStreak > savedBest) {
      this.saveBestStreak(bestStreak)
    }

    // 5. Generate Last 7 Days visualization (6 days ago -> today)
    const history7Days: DayHistoryRecord[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayDate)
      d.setDate(todayDate.getDate() - i)
      const dStr = formatToLocalDateString(d)
      const dName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]

      if (dStr === todayDateStr) {
        history7Days.push({
          date: dStr,
          dayName: 'Hôm nay',
          totalActivities: todayProgress.totalActivities,
          completedActivities: todayProgress.completedActivities,
          completionPercentage: todayProgress.completionPercentage,
          status: todayProgress.isGoalAchieved
            ? 'success'
            : todayProgress.totalActivities > 0
            ? 'in_progress'
            : 'empty',
        })
      } else {
        let pastRecord = history[dStr]
        if (!pastRecord) {
          const pastProgress = this.getDailyWorkload(dStr, routines, completions, tasks)
          pastRecord = {
            date: dStr,
            dayName: dName,
            totalActivities: pastProgress.totalActivities,
            completedActivities: pastProgress.completedActivities,
            completionPercentage: pastProgress.completionPercentage,
            status: pastProgress.isGoalAchieved
              ? 'success'
              : pastProgress.totalActivities > 0
              ? 'failed'
              : 'empty',
          }
          history[dStr] = pastRecord
          this.saveHistory(history)
        }
        history7Days.push(pastRecord)
      }
    }

    return {
      currentStreak,
      bestStreak,
      lastActiveDate: currentStreak > 0 ? todayDateStr : null,
      todayGoalAchieved: todayProgress.isGoalAchieved,
      history7Days,
    }
  },
}
