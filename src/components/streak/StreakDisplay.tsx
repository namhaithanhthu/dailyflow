import React, { useState } from 'react'
import { Flame, Sparkles, Trophy, Calendar, Check, X as XIcon, HelpCircle } from 'lucide-react'
import { StreakInfo, DayHistoryRecord } from '@/types/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StreakDisplayProps {
  streakInfo: StreakInfo
  neededToGoal?: number
  variant?: 'sidebar' | 'header' | 'card'
  className?: string
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streakInfo,
  neededToGoal = 0,
  variant = 'sidebar',
  className,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const isStreakActive = streakInfo.currentStreak > 0

  if (variant === 'header') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowDetailModal(true)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none",
            isStreakActive
              ? "bg-df-yellow border-amber-200 text-df-text shadow-2xs hover:bg-[#F2E2A4]"
              : "bg-white border-df-border text-df-muted hover:text-df-text hover:bg-df-light-pink/30",
            className
          )}
          title="Bấm để xem lịch sử 7 ngày qua"
        >
          <Flame
            className={cn(
              "w-4 h-4 transition-transform",
              isStreakActive ? "text-amber-600 fill-amber-500 animate-pulse" : "text-df-muted"
            )}
          />
          <span>{streakInfo.currentStreak} ngày streak</span>
        </button>

        {showDetailModal && (
          <StreakDetailModal
            streakInfo={streakInfo}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </>
    )
  }

  // Sidebar variant with 7-day mini strip
  return (
    <>
      <div
        onClick={() => setShowDetailModal(true)}
        className={cn(
          "rounded-2xl border border-df-border/90 bg-white p-3.5 shadow-2xs space-y-3 transition-all cursor-pointer hover:border-df-pink select-none",
          className
        )}
      >
        {/* Streak numbers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                isStreakActive ? "bg-df-yellow/90 text-amber-700 shadow-2xs" : "bg-[#F7F3EE] text-df-muted"
              )}
            >
              <Flame
                className={cn(
                  "w-4.5 h-4.5",
                  isStreakActive ? "fill-amber-500 text-amber-600" : "text-df-muted"
                )}
              />
            </div>
            <div>
              <div className="text-xs font-bold text-df-text leading-tight flex items-center gap-1">
                <span>{streakInfo.currentStreak} ngày liên tục</span>
              </div>
              <div className="text-[10px] text-df-muted font-medium flex items-center gap-1 mt-0.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Kỷ lục: {streakInfo.bestStreak} ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Days Mini Visualization Strip */}
        <div className="pt-1 border-t border-df-border/60">
          <div className="flex items-center justify-between text-[10px] font-bold text-df-muted mb-1.5">
            <span>7 ngày gần đây</span>
            <span className="text-[9px] font-normal text-df-muted/80">Chi tiết →</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {streakInfo.history7Days.map((day) => (
              <div key={day.date} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all",
                    day.status === 'success' && "bg-df-sage text-[#1E5224] border border-emerald-300",
                    day.status === 'in_progress' && "bg-df-pink text-df-text border border-df-pink animate-pulse",
                    day.status === 'failed' && "bg-rose-50 text-rose-500 border border-rose-200",
                    day.status === 'empty' && "bg-[#F5F1EB] text-df-muted/40 border border-transparent"
                  )}
                  title={`${day.date} (${day.dayName}): ${day.completedActivities}/${day.totalActivities} (${day.completionPercentage}%)`}
                >
                  {day.status === 'success' && <Check className="w-3 h-3 stroke-[3]" />}
                  {day.status === 'in_progress' && <span className="w-1.5 h-1.5 rounded-full bg-df-text" />}
                  {day.status === 'failed' && <XIcon className="w-2.5 h-2.5" />}
                  {day.status === 'empty' && <span className="w-1 h-1 rounded-full bg-df-muted/40" />}
                </div>
                <span className="text-[9px] text-df-muted font-semibold truncate w-full">
                  {day.dayName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Goal status note */}
        <div className="rounded-xl bg-[#FAF6F0] p-2 text-[11px] text-df-muted flex items-start gap-1.5 leading-snug">
          {streakInfo.todayGoalAchieved ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-emerald-700 font-semibold">
                Đã đạt mục tiêu hôm nay! Streak an toàn ✨
              </span>
            </>
          ) : neededToGoal > 0 ? (
            <>
              <HelpCircle className="w-3.5 h-3.5 text-df-muted shrink-0 mt-0.5" />
              <span>
                Cần thêm <strong>{neededToGoal} việc</strong> để đạt 50% hôm nay 🌱
              </span>
            </>
          ) : (
            <span>Lên lịch hoạt động để bắt đầu chuỗi streak.</span>
          )}
        </div>
      </div>

      {showDetailModal && (
        <StreakDetailModal
          streakInfo={streakInfo}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}

/**
 * Detailed Streak & History Modal
 */
const StreakDetailModal: React.FC<{
  streakInfo: StreakInfo
  onClose: () => void
}> = ({ streakInfo, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-df-border bg-[#FFFDF9] p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-df-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-df-yellow flex items-center justify-center text-amber-700">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-df-text leading-tight">
                Chi tiết Chuỗi Streak
              </h3>
              <p className="text-[11px] text-df-muted">
                Duy trì kỷ luật tối thiểu 50% mỗi ngày
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors cursor-pointer"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-df-border bg-white shadow-2xs space-y-1">
            <div className="text-[11px] text-df-muted font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Chuỗi hiện tại</span>
            </div>
            <div className="text-2xl font-black text-df-text">
              {streakInfo.currentStreak} <span className="text-xs font-semibold text-df-muted">ngày</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-df-border bg-white shadow-2xs space-y-1">
            <div className="text-[11px] text-df-muted font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Kỷ lục cao nhất</span>
            </div>
            <div className="text-2xl font-black text-df-text">
              {streakInfo.bestStreak} <span className="text-xs font-semibold text-df-muted">ngày</span>
            </div>
          </div>
        </div>

        {/* 7-Days History Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-df-text">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-df-muted" />
              <span>Lịch sử 7 ngày qua</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {streakInfo.history7Days.map((record: DayHistoryRecord) => (
              <div
                key={record.date}
                className={cn(
                  "p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors",
                  record.status === 'success' && "bg-[#F3F9F4] border-emerald-200/80",
                  record.status === 'in_progress' && "bg-df-light-pink/30 border-df-pink/60",
                  record.status === 'failed' && "bg-[#FFF5F4] border-rose-200/60",
                  record.status === 'empty' && "bg-[#FAF7F2] border-df-border"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0",
                      record.status === 'success' && "bg-df-sage text-[#1E5224]",
                      record.status === 'in_progress' && "bg-df-pink text-df-text",
                      record.status === 'failed' && "bg-rose-100 text-rose-600",
                      record.status === 'empty' && "bg-white text-df-muted"
                    )}
                  >
                    {record.status === 'success' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {record.status === 'in_progress' && "●"}
                    {record.status === 'failed' && <XIcon className="w-3 h-3" />}
                    {record.status === 'empty' && "—"}
                  </div>

                  <div>
                    <span className="font-bold text-df-text block leading-none">
                      {record.date} ({record.dayName})
                    </span>
                    <span className="text-[10px] text-df-muted">
                      {record.totalActivities > 0
                        ? `${record.completedActivities}/${record.totalActivities} việc hoàn thành`
                        : "Không có hoạt động"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={cn(
                      "font-black text-xs block",
                      record.status === 'success' ? "text-emerald-700" : "text-df-text"
                    )}
                  >
                    {record.completionPercentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-df-muted">
                    {record.status === 'success'
                      ? 'Đạt mục tiêu'
                      : record.status === 'in_progress'
                      ? 'Đang diễn ra'
                      : record.status === 'failed'
                      ? 'Chưa đạt'
                      : 'Nghỉ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-df-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
