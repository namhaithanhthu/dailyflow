import React, { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Sidebar, type NavTab } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { BackupModal } from '@/components/common/BackupModal'
import { StreakInfo } from '@/types/progress'
import { useDailyFlow } from '@/contexts/DailyFlowContext'
import { storageService, STORAGE_KEYS } from '@/services/storageService'

interface AppLayoutProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  streakInfo: StreakInfo
  neededToGoal?: number
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onTabChange,
  streakInfo,
  neededToGoal = 0,
  children,
}) => {
  const [isBackupOpen, setIsBackupOpen] = useState(false)
  const { hasSampleData, clearAllData } = useDailyFlow()

  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    return storageService.get<boolean>(STORAGE_KEYS.DISMISSED_SAMPLE_BANNER, false)
  })

  const handleDismissBanner = () => {
    setIsBannerDismissed(true)
    storageService.set(STORAGE_KEYS.DISMISSED_SAMPLE_BANNER, true)
  }

  const handleClearSample = () => {
    if (window.confirm('Bạn có muốn xóa toàn bộ dữ liệu mẫu (University & Tasks) để bắt đầu nhập thời khóa biểu và công việc thật của bạn?')) {
      clearAllData()
      setIsBannerDismissed(true)
      storageService.set(STORAGE_KEYS.DISMISSED_SAMPLE_BANNER, true)
    }
  }

  return (
    <div className="min-h-screen bg-df-bg flex flex-row text-df-text font-sans antialiased selection:bg-df-pink selection:text-df-text">
      {/* Desktop Sidebar (Fixed/Sticky 240px) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        streakInfo={streakInfo}
        neededToGoal={neededToGoal}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        {/* Header */}
        <Header
          activeTab={activeTab}
          streakInfo={streakInfo}
          onOpenBackup={() => setIsBackupOpen(true)}
        />

        {/* Helpful Sample Data Notification Banner */}
        {hasSampleData && !isBannerDismissed && (
          <div className="bg-amber-50/95 border-b border-amber-200/90 px-4 py-2.5 text-xs flex items-center justify-between text-amber-900 transition-all shadow-2xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">
                Bạn đang xem <strong>dữ liệu mẫu demo</strong> (University, bài tập...).
              </span>
              <button
                type="button"
                onClick={handleClearSample}
                className="font-bold underline text-amber-950 hover:text-black cursor-pointer ml-1"
              >
                Xóa sạch dữ liệu mẫu để bắt đầu dùng
              </button>
            </div>
            <button
              type="button"
              onClick={handleDismissBanner}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer shrink-0 ml-2"
              title="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dynamic Page Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        streakInfo={streakInfo}
      />

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />
    </div>
  )
}
