import { useState } from 'react'
import { DailyFlowProvider, useDailyFlow } from '@/contexts/DailyFlowContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { type NavTab } from '@/components/layout/Sidebar'
import { WeeklyRoutinePage } from '@/pages/WeeklyRoutinePage'
import { MyTasksPage } from '@/pages/MyTasksPage'

function MainContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('routine')
  const { streakInfo, todayProgress } = useDailyFlow()

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
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
