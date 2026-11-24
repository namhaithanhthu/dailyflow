import React, { useState, useEffect } from 'react'
import {
  X,
  Calendar,
  Clock,
  Flag,
  Tag,
  AlignLeft,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { TaskItem, TaskPriority, TaskCategory } from '@/types/task'
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@/constants/taskConstants'
import { getTodayDateString } from '@/services/dateService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: TaskItem | null
  onSave: (
    data: Omit<TaskItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => void
  onDelete?: (id: string) => void
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(task)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(getTodayDateString())
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [category, setCategory] = useState<TaskCategory>('study')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDate(task.date || getTodayDateString())
      setDeadline(task.deadline || '')
      setPriority(task.priority || 'medium')
      setCategory(task.category || 'study')
    } else {
      setTitle('')
      setDescription('')
      setDate(getTodayDateString())
      setDeadline('')
      setPriority('medium')
      setCategory('study')
    }
    setErrorMessage(null)
  }, [task, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setErrorMessage('Tiêu đề công việc là bắt buộc.')
      return
    }

    if (!date) {
      setErrorMessage('Vui lòng chọn ngày thực hiện công việc.')
      return
    }

    onSave({
      ...(task ? { id: task.id } : {}),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      deadline: deadline || undefined,
      priority,
      category,
      completed: task ? task.completed : false,
    })
    onClose()
  }

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-df-border bg-[#FFFDF9] p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-df-border">
          <h3 className="font-extrabold text-base text-df-text">
            {isEditing ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Validation error */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-df-text">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider">
              Tiêu đề công việc *
            </label>
            <Input
              type="text"
              required
              placeholder="VD: Nộp báo cáo dự án, Ôn từ vựng, Đọc sách..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrorMessage(null)
              }}
              className="text-sm font-semibold"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-df-muted" />
              <span>Mô tả chi tiết (tùy chọn)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú chi tiết, tài liệu cần chuẩn bị..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-df-border bg-white px-3.5 py-2 text-xs text-df-text shadow-2xs transition-colors placeholder:text-df-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-df-pink focus-visible:border-transparent resize-none font-sans font-medium"
            />
          </div>

          {/* Date & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-df-muted" />
                <span>Ngày thực hiện *</span>
              </label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-df-muted" />
                <span>Hạn chót (Deadline)</span>
              </label>
              <Input
                type="time"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-df-muted" />
              <span>Mức độ ưu tiên</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(TASK_PRIORITIES) as TaskPriority[]).map((pKey) => {
                const p = TASK_PRIORITIES[pKey]
                const isSelected = priority === pKey
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setPriority(pKey)}
                    className={cn(
                      "py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer",
                      isSelected
                        ? "bg-df-text text-white border-df-text shadow-2xs"
                        : `${p.bgClass} ${p.borderClass} ${p.textClass} hover:opacity-90`
                    )}
                  >
                    {p.labelVi}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-df-muted" />
              <span>Danh mục</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(TASK_CATEGORIES) as TaskCategory[]).map((cKey) => {
                const c = TASK_CATEGORIES[cKey]
                const isSelected = category === cKey
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setCategory(cKey)}
                    className={cn(
                      "py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-df-text text-white border-df-text shadow-2xs"
                        : `${c.bgClass} ${c.borderClass} ${c.textClass} hover:opacity-90`
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isSelected ? "bg-white" : c.dotClass
                      )}
                    />
                    <span>{c.labelVi}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-df-border">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa việc</span>
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="font-bold shadow-2xs"
              >
                {isEditing ? 'Lưu thay đổi' : 'Thêm công việc'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
