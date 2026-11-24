import React from 'react'
import { Sparkles, CalendarDays, CheckSquare, Database } from 'lucide-react'
import { StreakDisplay } from '@/components/streak/StreakDisplay'
import { StreakInfo } from '@/types/progress'
import { cn } from '@/lib/utils'

export type NavTab = 'routine' | 'tasks'

interface SidebarProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  streakInfo: StreakInfo
  neededToGoal?: number
  onOpenBackup?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  streakInfo,
  neededToGoal = 0,
  onOpenBackup,
  className,
}) => {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 border-r border-df-border bg-[#FFFDF9]/95 backdrop-blur-xs select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-df-border/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-df-pink flex items-center justify-center text-df-text shadow-2xs">
          <Sparkles className="w-5 h-5 text-df-text" />
        </div>
        <div>
          <h1 className="font-extrabold text-base text-df-text tracking-tight leading-none">
            DailyFlow
          </h1>
          <span className="text-[11px] text-df-muted font-medium block mt-0.5">
            Calm Habit & Routine
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-df-muted/80 uppercase">
          Menu chính
        </div>

        <button
          type="button"
          onClick={() => onTabChange('routine')}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left",
            activeTab === 'routine'
              ? "bg-df-light-pink text-df-text shadow-2xs font-bold"
              : "text-df-muted hover:text-df-text hover:bg-df-light-pink/40"
          )}
        >
          <CalendarDays
            className={cn(
              "w-4.5 h-4.5 transition-colors",
              activeTab === 'routine' ? "text-df-text" : "text-df-muted"
            )}
          />
          <span className="flex-1">Weekly Routine</span>
          {activeTab === 'routine' && (
            <span className="w-1.5 h-1.5 rounded-full bg-df-pink" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange('tasks')}
          className={cn(
            "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left",
            activeTab === 'tasks'
              ? "bg-df-light-pink text-df-text shadow-2xs font-bold"
              : "text-df-muted hover:text-df-text hover:bg-df-light-pink/40"
          )}
        >
          <CheckSquare
            className={cn(
              "w-4.5 h-4.5 transition-colors",
              activeTab === 'tasks' ? "text-df-text" : "text-df-muted"
            )}
          />
          <span className="flex-1">My Tasks</span>
          {activeTab === 'tasks' && (
            <span className="w-1.5 h-1.5 rounded-full bg-df-pink" />
          )}
        </button>
      </nav>

      {/* Bottom Area: Streak Widget with 7-day visualization */}
      <div className="p-3 border-t border-df-border/80 space-y-2">
        <StreakDisplay
          streakInfo={streakInfo}
          neededToGoal={neededToGoal}
          variant="sidebar"
        />

        {/* Data & Backup Link */}
        {onOpenBackup && (
          <button
            type="button"
            onClick={onOpenBackup}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-df-border bg-white text-xs font-semibold text-df-muted hover:text-df-text hover:bg-df-light-pink/30 transition-colors shadow-2xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-df-muted" />
            <span>Sao lưu & Khôi phục</span>
          </button>
        )}
      </div>
    </aside>
  )
}
