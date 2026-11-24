import React from 'react'
import { CalendarDays, CheckSquare, Flame } from 'lucide-react'
import { type NavTab } from './Sidebar'
import { StreakInfo } from '@/types/progress'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  streakInfo: StreakInfo
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  streakInfo,
}) => {
  const isStreakActive = streakInfo.currentStreak > 0

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-df-border px-3 flex items-center justify-around shadow-[0_-2px_10px_rgba(53,53,53,0.03)] select-none">
      <button
        type="button"
        onClick={() => onTabChange('routine')}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer",
          activeTab === 'routine'
            ? "text-df-text font-bold"
            : "text-df-muted hover:text-df-text"
        )}
      >
        <div
          className={cn(
            "w-10 h-7 rounded-xl flex items-center justify-center transition-colors mb-0.5",
            activeTab === 'routine' ? "bg-df-pink text-df-text shadow-2xs" : ""
          )}
        >
          <CalendarDays className="w-4.5 h-4.5" />
        </div>
        <span className="text-[11px] tracking-tight">Routine</span>
      </button>

      {/* Streak Mini Indicator on Mobile */}
      <div className="flex flex-col items-center justify-center px-2 py-1">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center border border-df-border text-xs font-extrabold shadow-2xs",
            isStreakActive ? "bg-df-yellow text-df-text border-amber-200" : "bg-white text-df-muted"
          )}
          title={`Streak: ${streakInfo.currentStreak} ngày (Kỷ lục: ${streakInfo.bestStreak})`}
        >
          <Flame
            className={cn(
              "w-3.5 h-3.5",
              isStreakActive ? "fill-amber-500 text-amber-600 animate-pulse" : "text-df-muted"
            )}
          />
        </div>
        <span className="text-[10px] text-df-muted font-bold mt-0.5">
          {streakInfo.currentStreak}d
        </span>
      </div>

      <button
        type="button"
        onClick={() => onTabChange('tasks')}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer",
          activeTab === 'tasks'
            ? "text-df-text font-bold"
            : "text-df-muted hover:text-df-text"
        )}
      >
        <div
          className={cn(
            "w-10 h-7 rounded-xl flex items-center justify-center transition-colors mb-0.5",
            activeTab === 'tasks' ? "bg-df-pink text-df-text shadow-2xs" : ""
          )}
        >
          <CheckSquare className="w-4.5 h-4.5" />
        </div>
        <span className="text-[11px] tracking-tight">My Tasks</span>
      </button>
    </nav>
  )
}
