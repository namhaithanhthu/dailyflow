import React from 'react'
import { Sparkles, CheckCircle2, Target } from 'lucide-react'
import { DailyProgress } from '@/types/progress'
import { cn } from '@/lib/utils'

interface DailyProgressBarProps {
  progress?: DailyProgress
  completed?: number
  total?: number
  className?: string
  showDetails?: boolean
}

export const DailyProgressBar: React.FC<DailyProgressBarProps> = ({
  progress,
  completed: fallbackCompleted = 0,
  total: fallbackTotal = 0,
  className,
  showDetails = true,
}) => {
  const total = progress ? progress.totalActivities : fallbackTotal
  const completed = progress ? progress.completedActivities : fallbackCompleted
  const percentage = progress
    ? progress.completionPercentage
    : total > 0
    ? Math.round((completed / total) * 100)
    : 0

  const isGoalAchieved = progress ? progress.isGoalAchieved : percentage >= 50 && total > 0
  const neededToGoal = progress
    ? progress.neededToGoal
    : !isGoalAchieved && total > 0
    ? Math.max(0, Math.ceil(total * 0.5) - completed)
    : 0

  return (
    <div
      className={cn(
        "rounded-2xl border border-df-border bg-white p-4 sm:p-5 shadow-2xs space-y-3.5 transition-all",
        isGoalAchieved && "border-emerald-200/80 bg-gradient-to-r from-white via-white to-[#F4F9F4]/40",
        className
      )}
    >
      {/* Top Details row */}
      {showDetails && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                isGoalAchieved
                  ? "bg-df-sage text-[#1E5224] shadow-2xs"
                  : "bg-df-light-pink/80 text-df-text"
              )}
            >
              {isGoalAchieved ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              ) : (
                <Target className="w-4.5 h-4.5 text-df-muted" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-df-text leading-tight">
                  Tiến độ hôm nay
                </span>
                {isGoalAchieved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-df-sage/70 px-2.5 py-0.5 rounded-full border border-emerald-300/50">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Daily Goal Achieved
                  </span>
                )}
              </div>

              <span className="text-[11px] text-df-muted font-medium block mt-0.5">
                {total > 0
                  ? `${completed}/${total} hoạt động hoàn thành`
                  : "Chưa có hoạt động nào được lên lịch cho hôm nay"}
                {progress && total > 0 && (
                  <span className="text-df-muted/70 ml-1">
                    ({progress.routineCompleted}/{progress.routineTotal} routine, {progress.taskCompleted}/{progress.taskTotal} task)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 self-end sm:self-auto">
            <span className="text-2xl font-black text-df-text tracking-tight">
              {percentage}%
            </span>
          </div>
        </div>
      )}

      {/* Progress Track with 50% Threshold Marker */}
      <div className="relative pt-0.5">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#F4EFEA]">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              isGoalAchieved ? "bg-df-sage" : "bg-df-pink"
            )}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>

        {/* 50% target threshold tick */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-0.5 bg-df-text/30 z-10 pointer-events-none rounded-full"
          style={{ left: '50%' }}
          title="Mốc 50% để đạt Daily Goal"
        />
      </div>

      {/* Helper message below progress bar */}
      {showDetails && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-medium text-df-muted gap-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            {isGoalAchieved ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                🌿 Tuyệt vời! Bạn đã hoàn thành mục tiêu ngày và duy trì ngọn lửa streak.
              </span>
            ) : total > 0 ? (
              <span className="text-df-text/90 font-medium">
                Cần hoàn thành thêm <strong>{neededToGoal}</strong> hoạt động nữa để đạt mốc 50%.
              </span>
            ) : (
              <span>Thêm việc hoặc môn học để bắt đầu theo dõi nhịp kỷ luật.</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-df-muted/80 self-end sm:self-auto">
            <span>0%</span>
            <span>▲ Mốc 50%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  )
}
