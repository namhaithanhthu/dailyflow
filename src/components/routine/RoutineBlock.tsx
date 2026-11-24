import React from 'react'
import { Clock, MapPin, Check, Lock } from 'lucide-react'
import { RoutineItem } from '@/types/routine'
import { ROUTINE_CATEGORIES } from '@/constants/categories'
import { getRoutineStyle, SLOT_HEIGHT } from '@/utils/timeGrid'
import { cn } from '@/lib/utils'

interface RoutineBlockProps {
  routine: RoutineItem
  dateString: string // "YYYY-MM-DD"
  dateRelation: 'past' | 'today' | 'future'
  isCompleted: boolean
  onToggleCompletion: (routineId: string, dateString: string) => void
  onClick: (routine: RoutineItem) => void
  slotHeight?: number
}

export const RoutineBlock: React.FC<RoutineBlockProps> = ({
  routine,
  dateString,
  dateRelation,
  isCompleted,
  onToggleCompletion,
  onClick,
  slotHeight = SLOT_HEIGHT,
}) => {
  const { top, height } = getRoutineStyle(routine.startTime, routine.endTime, slotHeight)
  const categoryConfig = ROUTINE_CATEGORIES[routine.category] || ROUTINE_CATEGORIES.other

  // Compact layout if height is small (< 55px)
  const isCompact = height < 55

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (dateRelation === 'today') {
      onToggleCompletion(routine.id, dateString)
    }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick(routine)
      }}
      style={{
        top: `${top}px`,
        height: `${Math.max(34, height - 2)}px`,
      }}
      className={cn(
        "absolute left-1 right-1 rounded-xl border p-2 flex flex-col justify-between select-none z-10",
        "transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:z-20",
        isCompleted
          ? "opacity-80 bg-df-sage/50 border-emerald-300"
          : `${categoryConfig.bgClass} ${categoryConfig.borderClass}`,
        categoryConfig.textClass
      )}
      title={`${routine.title} (${routine.startTime} - ${routine.endTime})`}
    >
      {/* Top row: Category & Time */}
      <div className="flex items-center justify-between gap-1 overflow-hidden leading-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              isCompleted ? "bg-emerald-500" : categoryConfig.dotClass
            )}
            style={!isCompleted && routine.color ? { backgroundColor: routine.color } : undefined}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider truncate opacity-85">
            {categoryConfig.labelVi}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-semibold opacity-80 shrink-0">
          <Clock className="w-2.5 h-2.5" />
          <span>{routine.startTime} - {routine.endTime}</span>
        </div>
      </div>

      {/* Main Title & Checkbox Area */}
      <div className="flex items-center justify-between gap-1.5 my-auto">
        <div
          className={cn(
            "font-extrabold tracking-tight transition-all",
            isCompact ? "text-xs truncate" : "text-xs line-clamp-2",
            isCompleted ? "line-through text-df-muted opacity-80" : "text-df-text"
          )}
        >
          {routine.title}
        </div>

        {/* Checkbox / Status Indicator based on Date Relation */}
        <div className="shrink-0 flex items-center">
          {dateRelation === 'today' && (
            <button
              type="button"
              onClick={handleCheckboxClick}
              className={cn(
                "w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-90",
                isCompleted
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-df-border hover:border-df-pink text-transparent"
              )}
              title={isCompleted ? "Bấm để bỏ hoàn thành" : "Bấm để đánh dấu hoàn thành"}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}

          {dateRelation === 'past' && (
            <div
              className={cn(
                "w-4.5 h-4.5 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-not-allowed",
                isCompleted
                  ? "bg-emerald-500/80 text-white"
                  : "bg-black/5 text-df-muted/60"
              )}
              title={
                isCompleted
                  ? "Đã hoàn thành trong quá khứ (không thể sửa)"
                  : "Chưa hoàn thành trong quá khứ (không thể sửa)"
              }
            >
              {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : "—"}
            </div>
          )}

          {dateRelation === 'future' && (
            <div
              className="w-4.5 h-4.5 rounded-lg flex items-center justify-center text-df-muted/40 cursor-not-allowed"
              title="Lịch tương lai (chỉ được check vào ngày diễn ra)"
            >
              <Lock className="w-2.5 h-2.5 opacity-60" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Location / note if taller */}
      {!isCompact && height >= 75 && (routine.location || routine.note) && (
        <div className="flex items-center gap-1 text-[10px] text-df-muted/90 truncate pt-0.5 border-t border-df-text/10">
          {routine.location ? (
            <>
              <MapPin className="w-2.5 h-2.5 shrink-0 opacity-70" />
              <span className="truncate">{routine.location}</span>
            </>
          ) : (
            <span className="truncate">{routine.note}</span>
          )}
        </div>
      )}
    </div>
  )
}
