import React from 'react'
import { Calendar as CalendarIcon, Sparkles, Database } from 'lucide-react'
import { StreakDisplay } from '@/components/streak/StreakDisplay'
import { StreakInfo } from '@/types/progress'
import { type NavTab } from './Sidebar'

interface HeaderProps {
  activeTab: NavTab
  streakInfo: StreakInfo
  onOpenBackup?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  streakInfo,
  onOpenBackup,
}) => {
  const today = new Date()
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

  const pageTitle = activeTab === 'routine' ? 'Weekly Routine' : 'My Tasks'
  const pageSubtitle =
    activeTab === 'routine'
      ? 'Thời khóa biểu học tập & sinh hoạt cố định trong tuần'
      : 'Quản lý các công việc linh hoạt phát sinh hàng ngày'

  return (
    <header className="sticky top-0 z-20 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-df-border px-4 sm:px-8 h-16 flex items-center justify-between transition-all">
      {/* Page Title & Mobile Brand */}
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8 rounded-xl bg-df-pink flex items-center justify-center text-df-text shadow-2xs">
          <Sparkles className="w-4 h-4 text-df-text" />
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-df-text leading-tight tracking-tight">
            {pageTitle}
          </h2>
          <p className="text-[11px] text-df-muted hidden sm:block font-medium">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Right Header items: Date, Backup & Streak Badge */}
      <div className="flex items-center gap-2">
        {/* Date pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-df-text/80 bg-white px-3 py-1.5 rounded-xl border border-df-border shadow-2xs">
          <CalendarIcon className="w-3.5 h-3.5 text-df-muted" />
          <span className="font-semibold text-[11px] sm:text-xs">{formattedDate}</span>
        </div>

        {/* Backup button */}
        {onOpenBackup && (
          <button
            type="button"
            onClick={onOpenBackup}
            className="w-9 h-9 rounded-xl border border-df-border bg-white flex items-center justify-center text-df-muted hover:text-df-text hover:bg-df-light-pink/40 transition-colors shadow-2xs cursor-pointer"
            title="Sao lưu & Khôi phục dữ liệu"
          >
            <Database className="w-4 h-4" />
          </button>
        )}

        {/* Streak badge */}
        <StreakDisplay streakInfo={streakInfo} variant="header" />
      </div>
    </header>
  )
}
