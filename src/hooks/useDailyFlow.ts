import { useContext } from 'react'
import { DailyFlowContext } from '@/contexts/DailyFlowContext'

export function useDailyFlow() {
  const context = useContext(DailyFlowContext)
  if (!context) {
    throw new Error('useDailyFlow must be used within a DailyFlowProvider')
  }
  return context
}
