import { useState } from 'react'
import { DailyFlowProvider, useDailyFlow } from '@/contexts/DailyFlowContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { type NavTab } from '@/components/layout/Sidebar'
import { WeeklyRoutinePage } from '@/pages/WeeklyRoutinePage'
import { MyTasksPage } from '@/pages/MyTasksPage'
import { storageService, STORAGE_KEYS } from '@/services/storageService'

function MainContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    return storageService.get<NavTab>(STORAGE_KEYS.ACTIVE_TAB, 'routine')
  })
  const { streakInfo, todayProgress } = useDailyFlow()

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab)
    storageService.set(STORAGE_KEYS.ACTIVE_TAB, tab)
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      streakInfo={streakInfo}
      neededToGoal={todayProgress.neededToGoal}
    >
      {activeTab === 'routine' ? <WeeklyRoutinePage /> : <MyTasksPage />}
    </AppLayout>
  )
}

export function App() {
  return (
    <DailyFlowProvider>
      <MainContent />
    </DailyFlowProvider>
  )
}

export default App
