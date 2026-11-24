export interface DailyProgress {
  date: string // "YYYY-MM-DD"
  totalActivities: number
  completedActivities: number
  remainingActivities: number
  completionPercentage: number // 0 - 100
  isGoalAchieved: boolean // completionPercentage >= 50 && totalActivities > 0
  neededToGoal: number // số hoạt động cần làm thêm để đạt mốc 50%
  routineTotal: number
  routineCompleted: number
  taskTotal: number
  taskCompleted: number
}

export type DayStatus = 'success' | 'failed' | 'empty' | 'in_progress'

export interface DayHistoryRecord {
  date: string // "YYYY-MM-DD"
  dayName: string // "T2", "T3", ...
  totalActivities: number
  completedActivities: number
  completionPercentage: number
  status: DayStatus
}

export interface StreakInfo {
  currentStreak: number
  bestStreak: number
  lastActiveDate: string | null
  todayGoalAchieved: boolean
  history7Days: DayHistoryRecord[]
}
