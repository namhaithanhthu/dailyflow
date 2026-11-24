import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import { RoutineItem, RoutineCompletionMap } from '@/types/routine'
import { TaskItem } from '@/types/task'
import { DailyProgress, StreakInfo } from '@/types/progress'
import { routineService, DEFAULT_ROUTINES } from '@/services/routineService'
import { taskService, DEFAULT_TASKS } from '@/services/taskService'
import { progressService } from '@/services/progressService'
import { getTodayDateString } from '@/services/dateService'

interface DailyFlowContextType {
  // State
  routines: RoutineItem[]
  completions: RoutineCompletionMap
  tasks: TaskItem[]
  todayProgress: DailyProgress
  streakInfo: StreakInfo
  isLoaded: boolean

  // Routine Actions
  createRoutine: (data: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt'>) => RoutineItem
  updateRoutine: (id: string, updates: Partial<Omit<RoutineItem, 'id' | 'createdAt'>>) => RoutineItem | null
  deleteRoutine: (id: string) => void
  isRoutineCompleted: (routineId: string, dateString: string) => boolean
  toggleRoutineCompletion: (routineId: string, dateString: string) => boolean
  resetRoutines: () => void

  // Task Actions
  createTask: (data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'>) => TaskItem
  updateTask: (id: string, updates: Partial<Omit<TaskItem, 'id' | 'createdAt'>>) => TaskItem | null
  deleteTask: (id: string) => void
  toggleTask: (id: string) => TaskItem | null
  resetTasks: () => void

  // Reload & Helpers
  reloadAllData: () => void
  getDayProgress: (dateStr: string) => DailyProgress
}

export const DailyFlowContext = createContext<DailyFlowContextType | null>(null)

export const DailyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<RoutineItem[]>([])
  const [completions, setCompletions] = useState<RoutineCompletionMap>({})
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from LocalStorage
  const reloadAllData = useCallback(() => {
    const loadedRoutines = routineService.getRoutines()
    const loadedCompletions = routineService.getCompletions()
    const loadedTasks = taskService.getTasks()

    setRoutines(loadedRoutines)
    setCompletions(loadedCompletions)
    setTasks(loadedTasks)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    reloadAllData()
  }, [reloadAllData])

  const todayStr = getTodayDateString()

  // 1. Calculate Today's Unified Progress
  const todayProgress = useMemo(() => {
    return progressService.getDailyWorkload(todayStr, routines, completions, tasks)
  }, [todayStr, routines, completions, tasks])

  // 2. Calculate Unified Streak Info
  const streakInfo = useMemo(() => {
    return progressService.calculateStreakInfo(
      todayStr,
      todayProgress,
      routines,
      completions,
      tasks
    )
  }, [todayStr, todayProgress, routines, completions, tasks])

  // Get progress for any specific date
  const getDayProgress = useCallback(
    (dateStr: string) => {
      return progressService.getDailyWorkload(dateStr, routines, completions, tasks)
    },
    [routines, completions, tasks]
  )

  // --- Routine Handlers ---
  const createRoutine = useCallback(
    (data: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = routineService.createRoutine(data)
      setRoutines((prev) => [...prev, created])
      return created
    },
    []
  )

  const updateRoutine = useCallback(
    (id: string, updates: Partial<Omit<RoutineItem, 'id' | 'createdAt'>>) => {
      const updated = routineService.updateRoutine(id, updates)
      if (updated) {
        setRoutines((prev) => prev.map((r) => (r.id === id ? updated : r)))
      }
      return updated
    },
    []
  )

  const deleteRoutine = useCallback((id: string) => {
    routineService.deleteRoutine(id)
    setRoutines((prev) => prev.filter((r) => r.id !== id))
    // Also sync completions state in case associated keys were removed
    setCompletions(routineService.getCompletions())
  }, [])

  const isRoutineCompleted = useCallback(
    (routineId: string, dateString: string): boolean => {
      const key = routineService.getCompletionKey(routineId, dateString)
      return Boolean(completions[key])
    },
    [completions]
  )

  const toggleRoutineCompletion = useCallback(
    (routineId: string, dateString: string) => {
      const { updatedMap, isCompleted } = routineService.toggleCompletion(routineId, dateString)
      setCompletions(updatedMap)
      return isCompleted
    },
    []
  )

  const resetRoutines = useCallback(() => {
    routineService.saveRoutines(DEFAULT_ROUTINES)
    setRoutines(DEFAULT_ROUTINES)
  }, [])

  // --- Task Handlers ---
  const createTask = useCallback(
    (data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const created = taskService.createTask(data)
      setTasks((prev) => [created, ...prev])
      return created
    },
    []
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<TaskItem, 'id' | 'createdAt'>>) => {
      const updated = taskService.updateTask(id, updates)
      if (updated) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      }
      return updated
    },
    []
  )

  const deleteTask = useCallback((id: string) => {
    taskService.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleTask = useCallback((id: string) => {
    const updated = taskService.toggleTask(id)
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    }
    return updated
  }, [])

  const resetTasks = useCallback(() => {
    taskService.saveTasks(DEFAULT_TASKS)
    setTasks(DEFAULT_TASKS)
  }, [])

  const value = {
    routines,
    completions,
    tasks,
    todayProgress,
    streakInfo,
    isLoaded,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    isRoutineCompleted,
    toggleRoutineCompletion,
    resetRoutines,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    resetTasks,
    reloadAllData,
    getDayProgress,
  }

  return (
    <DailyFlowContext.Provider value={value}>
      {children}
    </DailyFlowContext.Provider>
  )
}

export { useDailyFlow } from '@/hooks/useDailyFlow'
