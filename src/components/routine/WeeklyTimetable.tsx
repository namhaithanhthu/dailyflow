import React, { useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { RoutineItem } from '@/types/routine'
import { ROUTINE_CATEGORIES, RoutineCategory } from '@/constants/categories'
import { DAYS_OF_WEEK } from '@/constants/days'
import {
  generateTimeSlots,
  getWeekDetails,
  SLOT_HEIGHT,
  START_HOUR,
} from '@/utils/timeGrid'
import { RoutineBlock } from './RoutineBlock'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface WeeklyTimetableProps {
  routines: RoutineItem[]
  currentDate: Date
  onDateChange: (date: Date) => void
  onAddRoutine: (day?: number, time?: string) => void
  onEditRoutine: (routine: RoutineItem) => void
  isRoutineCompleted: (routineId: string, dateString: string) => boolean
  onToggleCompletion: (routineId: string, dateString: string) => void
}

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({
  routines,
  currentDate,
  onDateChange,
  onAddRoutine,
  onEditRoutine,
  isRoutineCompleted,
  onToggleCompletion,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const timeSlots = generateTimeSlots()
  const weekDetails = getWeekDetails(currentDate)

  // Auto-scroll to 07:30 on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const targetScroll = Math.max(0, (7.5 - START_HOUR) * 2 * SLOT_HEIGHT - 40)
      scrollContainerRef.current.scrollTop = targetScroll
    }
  }, [])

  const handlePrevWeek = () => {
    const prev = new Date(currentDate)
    prev.setDate(prev.getDate() - 7)
    onDateChange(prev)
  }

  const handleNextWeek = () => {
    const next = new Date(currentDate)
    next.setDate(next.getDate() + 7)
    onDateChange(next)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const totalGridHeight = timeSlots.length * SLOT_HEIGHT

  return (
    <div className="space-y-4">
      {/* Week Navigation Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-df-border shadow-2xs">
        {/* Navigation buttons: Prev, Next, Today */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-df-border bg-[#FFFDF9] p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-df-text hover:bg-df-light-pink/50 transition-colors cursor-pointer"
              title="Tuần trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="px-3 h-8 text-xs font-bold text-df-text hover:bg-df-light-pink/50 rounded-lg transition-colors cursor-pointer"
              title="Về tuần hiện tại"
            >
              Hôm nay
            </button>

            <button
              type="button"
              onClick={handleNextWeek}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-df-text hover:bg-df-light-pink/50 transition-colors cursor-pointer"
              title="Tuần tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Formatted Week Range Display */}
          <div className="flex items-center gap-2 pl-1">
            <Calendar className="w-4 h-4 text-df-pink shrink-0" />
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-df-text block leading-tight">
                Tuần {weekDetails.weekNumber}: {weekDetails.formattedRange}
              </span>
              <span className="text-[10px] text-df-muted font-medium hidden sm:block">
                Lịch mẫu lặp lại theo tuần (Routine Template)
              </span>
            </div>
          </div>
        </div>

        {/* Add Routine Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddRoutine()}
            className="w-full sm:w-auto font-bold gap-1.5 shadow-2xs text-xs"
          >
            <Plus className="w-4 h-4" /> Thêm hoạt động
          </Button>
        </div>
      </div>

      {/* Main Timetable Card Container */}
      <Card className="border-df-border bg-white shadow-2xs overflow-hidden flex flex-col">
        {/* Scrollable Viewport */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-auto max-h-[640px] relative scroll-smooth"
        >
          <div className="min-w-[850px] relative">
            {/* Table Header: Days of the week (Sticky Top) */}
            <div className="sticky top-0 z-30 flex bg-[#FFFDF9]/95 backdrop-blur-md border-b border-df-border select-none">
              {/* Top-left corner: Time header cell (Sticky Left & Top) */}
              <div className="w-16 shrink-0 sticky left-0 z-40 bg-[#FFFDF9] border-r border-df-border flex items-center justify-center text-[10px] font-bold text-df-muted uppercase tracking-wider py-3">
                Giờ
              </div>

              {/* 7 Days Columns Headers */}
              <div className="flex-1 grid grid-cols-7">
                {DAYS_OF_WEEK.map((dayConfig) => {
                  const dayDetail = weekDetails.days.find((d) => d.dayOfWeek === dayConfig.id)
                  const isToday = dayDetail?.isToday ?? false

                  return (
                    <div
                      key={dayConfig.id}
                      className={cn(
                        "py-2.5 px-1.5 text-center border-r last:border-r-0 border-df-border transition-colors",
                        isToday
                          ? "bg-df-light-pink/40 font-bold"
                          : "bg-transparent font-semibold"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={cn(
                            "text-xs leading-none",
                            isToday ? "text-df-text font-black" : "text-df-text"
                          )}
                        >
                          {dayConfig.fullName}
                        </span>
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full bg-df-pink shrink-0" title="Hôm nay" />
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-center">
                        <span
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-full transition-colors",
                            isToday
                              ? "bg-df-pink text-df-text font-extrabold shadow-2xs"
                              : "text-df-muted"
                          )}
                        >
                          {dayDetail?.displayDate || dayConfig.shortName}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Table Body: Left Time Column + 7 Days Grid */}
            <div className="flex relative" style={{ height: `${totalGridHeight}px` }}>
              {/* Left Time Column (Sticky Left) */}
              <div className="w-16 shrink-0 sticky left-0 z-20 bg-[#FFFDF9] border-r border-df-border select-none">
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.timeString}
                    style={{
                      top: `${index * SLOT_HEIGHT}px`,
                      height: `${SLOT_HEIGHT}px`,
                    }}
                    className="absolute left-0 right-0 px-1 text-right flex items-start justify-end pt-1"
                  >
                    {slot.isHour ? (
                      <span className="text-[11px] font-bold text-df-text/80 font-mono tracking-tighter">
                        {slot.timeString}
                      </span>
                    ) : (
                      <span className="text-[9px] text-df-muted/60 font-mono tracking-tighter pr-0.5">
                        · 30
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 7 Days Columns Content Container */}
              <div className="flex-1 grid grid-cols-7 relative">
                {DAYS_OF_WEEK.map((dayConfig) => {
                  const dayDetail = weekDetails.days.find((d) => d.dayOfWeek === dayConfig.id)
                  const isToday = dayDetail?.isToday ?? false
                  const fullDateString = dayDetail?.fullDateString || ''
                  const dateRelation = dayDetail?.dateRelation || 'future'

                  // Filter routines that occur on this day of week
                  const dayRoutines = routines.filter(
                    (r) => Array.isArray(r.daysOfWeek) && r.daysOfWeek.includes(dayConfig.id)
                  )

                  return (
                    <div
                      key={dayConfig.id}
                      className={cn(
                        "relative border-r last:border-r-0 border-df-border h-full transition-colors group",
                        isToday ? "bg-df-light-pink/[0.12]" : "bg-transparent"
                      )}
                    >
                      {/* Background horizontal grid lines for each 30-min slot */}
                      {timeSlots.map((slot, slotIdx) => (
                        <div
                          key={slot.timeString}
                          style={{
                            top: `${slotIdx * SLOT_HEIGHT}px`,
                            height: `${SLOT_HEIGHT}px`,
                          }}
                          onClick={() => onAddRoutine(dayConfig.id, slot.timeString)}
                          title={`Click để thêm lịch vào ${dayConfig.fullName} lúc ${slot.timeString}`}
                          className={cn(
                            "absolute left-0 right-0 border-b cursor-pointer transition-colors",
                            slot.isHour
                              ? "border-df-border/80"
                              : "border-df-border/40 border-dashed",
                            "hover:bg-df-pink/15"
                          )}
                        />
                      ))}

                      {/* Render Routine Occurrences for this specific day */}
                      {dayRoutines.map((routine) => {
                        const isDone = isRoutineCompleted(routine.id, fullDateString)
                        return (
                          <RoutineBlock
                            key={`${routine.id}_${dayConfig.id}`}
                            routine={routine}
                            dateString={fullDateString}
                            dateRelation={dateRelation}
                            isCompleted={isDone}
                            onToggleCompletion={onToggleCompletion}
                            onClick={onEditRoutine}
                            slotHeight={SLOT_HEIGHT}
                          />
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Legend & Color Badges */}
      <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-df-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-df-text text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-df-pink" />
          <span>Danh mục hoạt động:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(ROUTINE_CATEGORIES) as RoutineCategory[]).map((catKey) => {
            const cat = ROUTINE_CATEGORIES[catKey]
            return (
              <div
                key={catKey}
                className={cn(
                  "px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors",
                  cat.bgClass,
                  cat.borderClass,
                  cat.textClass
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", cat.dotClass)} />
                <span>{cat.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
