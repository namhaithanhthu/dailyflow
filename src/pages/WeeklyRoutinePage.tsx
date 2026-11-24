import React, { useState } from 'react'
import { RoutineItem } from '@/types/routine'
import { useDailyFlow } from '@/contexts/DailyFlowContext'
import { WeeklyTimetable } from '@/components/routine/WeeklyTimetable'
import { RoutineModal } from '@/components/routine/RoutineModal'
import { DailyProgressBar } from '@/components/progress/DailyProgressBar'
import { getDayOfWeekNumber } from '@/services/dateService'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarDays, Plus, RotateCcw } from 'lucide-react'

export const WeeklyRoutinePage: React.FC = () => {
  const {
    routines,
    isLoaded,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    isRoutineCompleted,
    toggleRoutineCompletion,
    resetRoutines,
    todayProgress,
  } = useDailyFlow()

  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineItem | null>(null)
  const [modalInitialDay, setModalInitialDay] = useState<number>(1)
  const [modalInitialTime, setModalInitialTime] = useState<string>('08:00')

  // Open modal to add
  const handleOpenAdd = (day?: number, time?: string) => {
    setSelectedRoutine(null)
    if (day) {
      setModalInitialDay(day)
    } else {
      const today = getDayOfWeekNumber(new Date())
      setModalInitialDay(today)
    }
    if (time) setModalInitialTime(time)
    else setModalInitialTime('08:00')

    setIsModalOpen(true)
  }

  // Open modal to view/edit
  const handleOpenEdit = (routine: RoutineItem) => {
    setSelectedRoutine(routine)
    setIsModalOpen(true)
  }

  // Save routine handler
  const handleSaveRoutine = (
    data: Omit<RoutineItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    if (data.id) {
      updateRoutine(data.id, data)
    } else {
      createRoutine(data)
    }
  }

  // Delete routine handler
  const handleDeleteRoutine = (id: string) => {
    deleteRoutine(id)
  }

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-xs text-df-muted font-medium">
        Đang tải dữ liệu thời khóa biểu...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unified Real-time Progress Banner for Today */}
      <DailyProgressBar progress={todayProgress} />

      {/* Main Timetable Component or Empty State */}
      {routines.length > 0 ? (
        <WeeklyTimetable
          routines={routines}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onAddRoutine={handleOpenAdd}
          onEditRoutine={handleOpenEdit}
          isRoutineCompleted={isRoutineCompleted}
          onToggleCompletion={toggleRoutineCompletion}
        />
      ) : (
        /* Empty State */
        <Card className="p-12 text-center border-dashed border-2 border-df-border bg-white space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-df-light-pink flex items-center justify-center text-df-text shadow-xs">
            <CalendarDays className="w-8 h-8 text-df-text" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-df-text">
              Thời khóa biểu đang trống
            </h3>
            <p className="text-xs text-df-muted leading-relaxed">
              Bạn chưa có hoạt động cố định nào trong tuần. Hãy thêm môn học, ca làm việc hoặc thói quen để bắt đầu!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetRoutines}
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Nạp lại lịch mẫu
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleOpenAdd()}
              className="font-bold gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm hoạt động đầu tiên
            </Button>
          </div>
        </Card>
      )}

      {/* Routine Detail & Create/Edit Modal */}
      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        routine={selectedRoutine}
        initialDay={modalInitialDay}
        initialStartTime={modalInitialTime}
        onSave={handleSaveRoutine}
        onDelete={handleDeleteRoutine}
      />
    </div>
  )
}
