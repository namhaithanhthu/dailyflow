import { TaskItem } from '@/types/task'
import { storageService, STORAGE_KEYS } from './storageService'
import { getTodayDateString } from './dateService'

function getDateWithOffset(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task_demo_1',
    title: 'Hoàn thiện slide thuyết trình Sprint Review',
    description: 'Tổng hợp số liệu và biểu đồ tiến độ dự án tuần vừa qua.',
    date: getTodayDateString(),
    deadline: '17:30',
    priority: 'high',
    category: 'project',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_demo_2',
    title: 'Ôn tập 20 từ vựng IELTS chủ đề Technology',
    description: 'Sử dụng flashcard Anki và làm bài tập collocations.',
    date: getTodayDateString(),
    deadline: '20:00',
    priority: 'medium',
    category: 'study',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_demo_3',
    title: 'Tập giãn cơ 15 phút & uống đủ nước',
    description: 'Thói quen phục hồi cơ thể sau buổi làm việc.',
    date: getTodayDateString(),
    deadline: '21:30',
    priority: 'low',
    category: 'personal',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_demo_4',
    title: 'Mua quà sinh nhật & viết thiệp cho bạn thân',
    description: 'Ghé nhà sách chọn sổ tay pastel và thiệp chúc mừng.',
    date: getDateWithOffset(1),
    deadline: '19:00',
    priority: 'medium',
    category: 'personal',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_demo_5',
    title: 'Nộp báo cáo đồ án giai đoạn 1',
    description: 'Gửi file PDF qua email cho giảng viên hướng dẫn.',
    date: getDateWithOffset(2),
    deadline: '23:59',
    priority: 'high',
    category: 'study',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const taskService = {
  /**
   * Loads all tasks from LocalStorage with basic validation and deduplication
   */
  getTasks(): TaskItem[] {
    const rawData = storageService.get<unknown>(STORAGE_KEYS.TASKS, null)
    if (!rawData || !Array.isArray(rawData)) {
      storageService.set(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
      return DEFAULT_TASKS
    }

    const validTasks: TaskItem[] = []
    const seenIds = new Set<string>()

    for (const item of rawData) {
      if (
        item &&
        typeof item === 'object' &&
        'id' in item &&
        typeof item.id === 'string' &&
        'title' in item &&
        typeof item.title === 'string' &&
        'date' in item &&
        typeof item.date === 'string'
      ) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id)
          validTasks.push(item as TaskItem)
        }
      }
    }

    if (validTasks.length === 0) {
      storageService.set(STORAGE_KEYS.TASKS, DEFAULT_TASKS)
      return DEFAULT_TASKS
    }

    return validTasks
  },

  /**
   * Saves tasks array to LocalStorage
   */
  saveTasks(tasks: TaskItem[]): void {
    storageService.set(STORAGE_KEYS.TASKS, tasks)
  },

  /**
   * Creates a new task
   */
  createTask(data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'>): TaskItem {
    const tasks = this.getTasks()
    const now = new Date().toISOString()
    const newTask: TaskItem = {
      ...data,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    }

    const updated = [newTask, ...tasks]
    this.saveTasks(updated)
    return newTask
  },

  /**
   * Updates an existing task
   */
  updateTask(
    id: string,
    updates: Partial<Omit<TaskItem, 'id' | 'createdAt'>>
  ): TaskItem | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) return null

    const updatedTask: TaskItem = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    tasks[index] = updatedTask
    this.saveTasks(tasks)
    return updatedTask
  },

  /**
   * Deletes a task by ID
   */
  deleteTask(id: string): void {
    const tasks = this.getTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    this.saveTasks(filtered)
  },

  /**
   * Toggles task completion status
   */
  toggleTask(id: string): TaskItem | null {
    const tasks = this.getTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) return null

    const updatedTask: TaskItem = {
      ...tasks[index],
      completed: !tasks[index].completed,
      updatedAt: new Date().toISOString(),
    }

    tasks[index] = updatedTask
    this.saveTasks(tasks)
    return updatedTask
  },

  /**
   * Gets tasks scheduled for today
   */
  getTodayTasks(): TaskItem[] {
    const today = getTodayDateString()
    return this.getTasks().filter((t) => t.date === today)
  },
}
