import React, { useState } from 'react'
import { Sidebar, type NavTab } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { BackupModal } from '@/components/common/BackupModal'
import { StreakInfo } from '@/types/progress'

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
