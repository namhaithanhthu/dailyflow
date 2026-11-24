import React from 'react'
import {
  Check,
  Calendar,
  Clock,
  Trash2,
  Pencil,
  AlertCircle,
} from 'lucide-react'
import { TaskItem } from '@/types/task'
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@/constants/taskConstants'
import { getTodayDateString } from '@/services/dateService'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: TaskItem
  onToggle: (id: string) => void
  onEdit: (task: TaskItem) => void
  onDeleteRequest: (task: TaskItem) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDeleteRequest,
}) => {
  const todayStr = getTodayDateString()
  const isToday = task.date === todayStr
  const isPast = task.date < todayStr && !task.completed

  const categoryConfig = TASK_CATEGORIES[task.category] || TASK_CATEGORIES.other
  const priorityConfig = TASK_PRIORITIES[task.priority] || TASK_PRIORITIES.medium

  // Format date display (e.g. "Hôm nay", "Ngày mai", or "24/11")
  const formatTaskDate = (dateStr: string) => {
    if (dateStr === todayStr) return 'Hôm nay'

    const [y, m, d] = dateStr.split('-').map(Number)
    const taskDate = new Date(y, m - 1, d)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffDays = Math.round(
      (taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 1) return 'Ngày mai'
    if (diffDays === -1) return 'Hôm qua'
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
  }

  return (
    <div
      onClick={() => onEdit(task)}
      className={cn(
        "group rounded-2xl border p-4 transition-all duration-200 cursor-pointer select-none",
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs",
        task.completed
          ? "bg-[#FAF7F2]/60 border-df-border/80 opacity-70"
          : "bg-white border-df-border hover:border-df-pink/70"
      )}
    >
      {/* Left section: Checkbox & Content */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        {/* Custom Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(task.id)
          }}
          className={cn(
            "w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer shadow-2xs active:scale-90",
            task.completed
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "bg-white border-df-border hover:border-df-pink text-transparent"
          )}
          title={task.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        {/* Text Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "text-sm font-bold tracking-tight transition-all",
                task.completed
                  ? "line-through text-df-muted opacity-80"
                  : "text-df-text"
              )}
            >
              {task.title}
            </h4>

            {isPast && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-1.5 py-0.2 rounded-md">
                <AlertCircle className="w-2.5 h-2.5" /> Quá hạn
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-xs text-df-muted line-clamp-1 font-medium">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right section: Badges & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-df-border/50">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Date & Deadline Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-colors",
              isToday
                ? "bg-df-sage/60 border-emerald-200 text-[#1E5224]"
                : "bg-[#FAF6F0] border-df-border text-df-text/80"
            )}
          >
            <Calendar className="w-3 h-3 opacity-70" />
            <span>{formatTaskDate(task.date)}</span>
            {task.deadline && (
              <>
                <span className="opacity-40">•</span>
                <Clock className="w-2.5 h-2.5 opacity-70" />
                <span className="font-mono text-[10px]">{task.deadline}</span>
              </>
            )}
          </div>

          {/* Priority Badge */}
          <Badge
            className={cn(
              "text-[10px] font-bold py-0.5 px-2 rounded-xl border shadow-none",
              priorityConfig.bgClass,
              priorityConfig.borderClass,
              priorityConfig.textClass
            )}
          >
            {priorityConfig.labelVi}
          </Badge>

          {/* Category Badge */}
          <Badge
            className={cn(
              "text-[10px] font-bold py-0.5 px-2 rounded-xl border shadow-none hidden sm:inline-flex items-center gap-1",
              categoryConfig.bgClass,
              categoryConfig.borderClass,
              categoryConfig.textClass
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", categoryConfig.dotClass)} />
            <span>{categoryConfig.labelVi}</span>
          </Badge>
        </div>

        {/* Action icons (Edit & Delete) */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors cursor-pointer"
            title="Chỉnh sửa công việc"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteRequest(task)
            }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-df-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Xóa công việc"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
