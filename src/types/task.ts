export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskCategory = 'study' | 'project' | 'personal' | 'other'

export interface TaskItem {
  id: string
  title: string
  description?: string
  date: string // "YYYY-MM-DD"
  deadline?: string // "HH:mm" e.g. "17:00"
  priority: TaskPriority
  category: TaskCategory
  completed: boolean
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

export type TaskFilter = 'today' | 'upcoming' | 'all' | 'completed'

export type TaskSortBy = 'date' | 'priority' | 'createdAt'
