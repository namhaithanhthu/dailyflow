import React, { useState, useEffect } from 'react'
import {
  X,
  Clock,
  Calendar,
  Tag,
  MapPin,
  AlignLeft,
  Trash2,
  AlertCircle,
  Palette,
} from 'lucide-react'
import { RoutineItem } from '@/types/routine'
import { ROUTINE_CATEGORIES, RoutineCategory } from '@/constants/categories'
import { DAYS_OF_WEEK } from '@/constants/days'
import { timeToMinutes } from '@/utils/timeGrid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface RoutineModalProps {
  isOpen: boolean
  onClose: () => void
  routine?: RoutineItem | null
  initialDay?: number
  initialStartTime?: string
  onSave: (
    routineData: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => void
  onDelete?: (id: string) => void
}

const COLOR_PALETTES = [
  { name: 'Tím pastel (University)', hex: '#8B5CF6' },
  { name: 'Hồng phấn (DailyFlow Pink)', hex: '#F4C9D4' },
  { name: 'Vàng kem (Soft Yellow)', hex: '#F5E7B0' },
  { name: 'Xanh xô thơm (Sage Green)', hex: '#DCEBDD' },
  { name: 'Cam san hô (Peach)', hex: '#F8CEC4' },
  { name: 'Xanh ngọc (Mint)', hex: '#C2E8E2' },
  { name: 'Be ấm (Warm Stone)', hex: '#E4DDCF' },
]

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  routine,
  initialDay = 1,
  initialStartTime = '08:00',
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(routine)

  const [title, setTitle] = useState('')
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('09:30')
  const [category, setCategory] = useState<RoutineCategory>('university')
  const [color, setColor] = useState('#8B5CF6')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')

  // Validation errors
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
    if (routine) {
      setTitle(routine.title)
      setDaysOfWeek(routine.daysOfWeek || [1])
      setStartTime(routine.startTime)
      setEndTime(routine.endTime)
      setCategory(routine.category)
      setColor(routine.color || ROUTINE_CATEGORIES[routine.category]?.accentColor || '#8B5CF6')
      setLocation(routine.location || '')
      setNote(routine.note || '')
    } else {
      setTitle('')
      setDaysOfWeek([initialDay || 1])
      setStartTime(initialStartTime || '08:00')

      // Default end time = start + 1h30m
      const [h, m] = (initialStartTime || '08:00').split(':').map(Number)
      const endH = Math.min(23, (h || 8) + 1)
      const endM = (m || 0) + 30
      const formattedEndH = endM >= 60 ? Math.min(23, endH + 1) : endH
      const formattedEndM = endM % 60
      setEndTime(
        `${String(formattedEndH).padStart(2, '0')}:${String(formattedEndM).padStart(2, '0')}`
      )

      setCategory('university')
      setColor(ROUTINE_CATEGORIES.university.accentColor)
      setLocation('')
      setNote('')
    }
    setErrorMessage(null)
  }, [routine, initialDay, initialStartTime, isOpen])

  if (!isOpen) return null

  // Toggle day in daysOfWeek
  const toggleDay = (dayId: number) => {
    setDaysOfWeek((prev) => {
      if (prev.includes(dayId)) {
        // Prevent deselecting if it's the last selected day
        if (prev.length <= 1) return prev
        return prev.filter((d) => d !== dayId)
      } else {
        return [...prev, dayId].sort((a, b) => a - b)
      }
    })
    setErrorMessage(null)
  }

  // When category changes, auto sync default color if user hasn't explicitly customized
  const handleCategoryChange = (newCat: RoutineCategory) => {
    setCategory(newCat)
    setColor(ROUTINE_CATEGORIES[newCat].accentColor)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validation Title
    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tên hoạt động hoặc môn học.')
      return
    }

    // 2. Validation Days
    if (!daysOfWeek || daysOfWeek.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một ngày trong tuần.')
      return
    }

    // 3. Validation Start & End Time
    const startMins = timeToMinutes(startTime)
    const endMins = timeToMinutes(endTime)

    if (isNaN(startMins) || isNaN(endMins)) {
      setErrorMessage('Định dạng thời gian không hợp lệ.')
      return
    }

    if (startMins >= endMins) {
      setErrorMessage('Thời gian bắt đầu phải sớm hơn thời gian kết thúc.')
      return
    }

    if (endMins - startMins < 15) {
      setErrorMessage('Thời lượng hoạt động tối thiểu là 15 phút.')
      return
    }

    setErrorMessage(null)
    onSave({
      ...(routine ? { id: routine.id } : {}),
      title: title.trim(),
      daysOfWeek,
      startTime,
      endTime,
      category,
      color,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
    })
    onClose()
  }

  const handleDelete = () => {
    if (routine && onDelete) {
      onDelete(routine.id)
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
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full shadow-2xs"
              style={{ backgroundColor: color }}
            />
            <h3 className="font-extrabold text-base text-df-text">
              {isEditing ? 'Chỉnh sửa Routine Template' : 'Thêm hoạt động cố định mới'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Validation Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-df-text">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider">
              Tên hoạt động / Môn học *
            </label>
            <Input
              type="text"
              required
              placeholder="VD: University, Data Analyst, English..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setErrorMessage(null)
              }}
              className="text-sm font-semibold"
              autoFocus
            />
          </div>

          {/* Days of Week (Multi-select) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-df-muted" />
                <span>Lặp lại vào các ngày trong tuần *</span>
              </label>
              <span className="text-[10px] text-df-muted">
                (Đã chọn {daysOfWeek.length} ngày)
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = daysOfWeek.includes(d.id)
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer select-none",
                      isSelected
                        ? "bg-df-pink border-df-pink text-df-text shadow-2xs scale-[1.02]"
                        : "bg-white border-df-border text-df-muted hover:text-df-text hover:bg-df-light-pink/20"
                    )}
                  >
                    <div>{d.shortName}</div>
                  </button>
                )
              })}
            </div>
            <p className="text-[10px] text-df-muted/80">
              * Routine là lịch lặp lại hàng tuần. Bạn có thể chọn nhiều thứ để lịch xuất hiện đều đặn.
            </p>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-df-muted" />
                <span>Bắt đầu (05:00 - 24:00)</span>
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value)
                  setErrorMessage(null)
                }}
                className="font-mono text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-df-muted" />
                <span>Kết thúc</span>
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value)
                  setErrorMessage(null)
                }}
                className="font-mono text-xs font-bold"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-df-muted" />
              <span>Phân loại danh mục</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(ROUTINE_CATEGORIES) as RoutineCategory[]).map((catKey) => {
                const cat = ROUTINE_CATEGORIES[catKey]
                const isSelected = category === catKey
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategoryChange(catKey)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-df-text text-white border-df-text shadow-2xs"
                        : `${cat.bgClass} ${cat.borderClass} ${cat.textClass}`
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isSelected ? "bg-white" : cat.dotClass
                      )}
                    />
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Selection Palette */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-df-muted" />
              <span>Màu sắc tùy chỉnh</span>
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PALETTES.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => setColor(p.hex)}
                  title={p.name}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-transform cursor-pointer",
                    color === p.hex
                      ? "border-df-text scale-125 shadow-xs"
                      : "border-transparent hover:scale-110"
                  )}
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-df-muted" />
              <span>Địa điểm / Phòng học (tùy chọn)</span>
            </label>
            <Input
              type="text"
              placeholder="VD: Phòng Lab 3, Giảng đường A1, Zoom..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-df-muted uppercase tracking-wider flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-df-muted" />
              <span>Ghi chú thêm</span>
            </label>
            <Input
              type="text"
              placeholder="Chuẩn bị tài liệu, giáo trình..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
                <span>Xóa Routine</span>
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
                {isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
