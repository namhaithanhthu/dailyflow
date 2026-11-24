import React, { useState, useMemo } from 'react'
import {
  Plus,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  CheckSquare,
} from 'lucide-react'
import { TaskItem, TaskFilter, TaskSortBy } from '@/types/task'
import { useDailyFlow } from '@/contexts/DailyFlowContext'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal'
import { DailyProgressBar } from '@/components/progress/DailyProgressBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { getTodayDateString } from '@/services/dateService'
import { TASK_PRIORITIES } from '@/constants/taskConstants'
import { cn } from '@/lib/utils'

export const MyTasksPage: React.FC = () => {
  const {
    tasks,
    isLoaded,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    resetTasks,
    todayProgress,
  } = useDailyFlow()

  const [filter, setFilter] = useState<TaskFilter>('today')
  const [sortBy, setSortBy] = useState<TaskSortBy>('date')

  // Quick Add State
  const [quickTitle, setQuickTitle] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)

  // Delete Confirm State
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null)

  const todayStr = getTodayDateString()

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Filter
    const filtered = tasks.filter((task) => {
      if (filter === 'today') {
        return task.date === todayStr
      }
      if (filter === 'upcoming') {
        return !task.completed && task.date > todayStr
      }
      if (filter === 'completed') {
        return task.completed
      }
      return true // 'all'
    })

    // 2. Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        const weightA = TASK_PRIORITIES[a.priority]?.weight || 1
        const weightB = TASK_PRIORITIES[b.priority]?.weight || 1
        return weightB - weightA
      }
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      const deadA = a.deadline || '99:99'
      const deadB = b.deadline || '99:99'
      return deadA.localeCompare(deadB)
    })
  }, [tasks, filter, sortBy, todayStr])

  // Tab Counts
  const counts = useMemo(() => {
    const todayTasks = tasks.filter((t) => t.date === todayStr)
    const upcomingTasks = tasks.filter((t) => !t.completed && t.date > todayStr)
    const completedTasks = tasks.filter((t) => t.completed)

    return {
      today: todayTasks.length,
      upcoming: upcomingTasks.length,
      completed: completedTasks.length,
      all: tasks.length,
    }
  }, [tasks, todayStr])

  // Handle Quick Add
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim()) return

    createTask({
      title: quickTitle.trim(),
      date: todayStr,
      priority: 'medium',
      category: 'study',
      completed: false,
    })
    setQuickTitle('')
  }

  // Open modal for add
  const handleOpenAdd = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  // Open modal for edit
  const handleOpenEdit = (task: TaskItem) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  // Save task
  const handleSaveTask = (
    data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    if (data.id) {
      updateTask(data.id, data)
    } else {
      createTask(data)
    }
  }

  // Delete confirmation
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    }
  }

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-xs text-df-muted font-medium">
        Đang tải danh sách công việc...
      </div>
    )
  }

  const filterLabels: { key: TaskFilter; label: string; count: number }[] = [
    { key: 'today', label: 'Hôm nay', count: counts.today },
    { key: 'upcoming', label: 'Sắp tới', count: counts.upcoming },
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'completed', label: 'Đã xong', count: counts.completed },
  ]

  const sortOptions: { key: TaskSortBy; label: string }[] = [
    { key: 'date', label: 'Theo ngày' },
    { key: 'priority', label: 'Theo ưu tiên' },
    { key: 'createdAt', label: 'Mới tạo' },
  ]

  return (
    <div className="space-y-6">
      {/* Unified Real-time Progress Banner for Today */}
      <DailyProgressBar progress={todayProgress} />

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-df-text flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-df-pink" />
            <span>Công việc phát sinh (My Tasks)</span>
          </h3>
          <p className="text-xs text-df-muted mt-0.5">
            Các nhiệm vụ linh hoạt trong ngày. Tiến độ được tính chung với Thời khóa biểu để nuôi Streak!
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={handleOpenAdd}
          className="font-bold gap-1.5 shadow-2xs self-start sm:self-auto text-xs"
        >
          <Plus className="w-4 h-4" /> Thêm công việc
        </Button>
      </div>

      {/* Quick Add Bar */}
      <Card className="p-2 sm:p-2.5 border-df-border bg-white shadow-2xs">
        <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Thêm nhanh việc cho hôm nay... (nhập xong nhấn Enter)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="border-none shadow-none focus-visible:ring-0 text-xs sm:text-sm placeholder:text-df-muted/60"
          />
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={!quickTitle.trim()}
            className="shrink-0 font-bold gap-1 shadow-2xs text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm nhanh
          </Button>
        </form>
      </Card>

      {/* Filters and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* 4 Filter Pills */}
        <div className="flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-2xl border border-df-border overflow-x-auto scrollbar-none">
          {filterLabels.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                filter === f.key
                  ? "bg-white text-df-text shadow-2xs"
                  : "text-df-muted hover:text-df-text"
              )}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Sorting selector */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs text-df-muted">
          <ArrowUpDown className="w-3.5 h-3.5 text-df-muted" />
          <span className="font-semibold text-[11px]">Sắp xếp:</span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-df-border shadow-2xs">
            {sortOptions.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSortBy(s.key)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer",
                  sortBy === s.key
                    ? "bg-df-light-pink text-df-text"
                    : "text-df-muted hover:text-df-text hover:bg-df-light-pink/30"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List Container */}
      <div className="space-y-2.5">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onEdit={handleOpenEdit}
              onDeleteRequest={(t) => setTaskToDelete(t)}
            />
          ))
        ) : (
          /* Empty State */
          <Card className="p-10 text-center border-dashed border-2 border-df-border bg-white space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-df-light-pink flex items-center justify-center text-df-text shadow-2xs">
              <Sparkles className="w-6 h-6 text-df-text" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-sm text-df-text">
                Không có công việc nào trong danh mục này
              </h4>
              <p className="text-xs text-df-muted max-w-sm mx-auto leading-relaxed">
                {filter === 'today'
                  ? 'Tuyệt vời! Bạn không còn việc nào cần làm hôm nay.'
                  : filter === 'upcoming'
                  ? 'Chưa có công việc nào được lên lịch cho các ngày sắp tới.'
                  : filter === 'completed'
                  ? 'Chưa có công việc nào được đánh dấu hoàn thành.'
                  : 'Danh sách công việc đang trống.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTasks}
                className="gap-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" /> Nạp việc mẫu
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenAdd}
                className="font-bold gap-1 shadow-2xs text-xs"
              >
                <Plus className="w-3 h-3" /> Thêm việc mới
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={(id) => {
          deleteTask(id)
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  )
}
