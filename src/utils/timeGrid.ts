import { formatToLocalDateString, compareDateWithToday } from '@/services/dateService'

export const START_HOUR = 5 // 05:00
export const END_HOUR = 24  // 24:00
export const SLOT_MINUTES = 30
export const SLOT_HEIGHT = 42 // px per 30-min block

export interface TimeSlot {
  minutesFromMidnight: number
  timeString: string
  isHour: boolean
}

/**
 * Converts "HH:mm" to total minutes from 00:00
 */
export function timeToMinutes(time: string): number {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/**
 * Converts total minutes to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const safeH = Math.min(24, Math.max(0, h))
  return `${String(safeH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Generates all 30-minute intervals from START_HOUR to END_HOUR
 */
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const startMinutes = START_HOUR * 60
  const endMinutes = END_HOUR * 60

  for (let mins = startMinutes; mins <= endMinutes; mins += SLOT_MINUTES) {
    slots.push({
      minutesFromMidnight: mins,
      timeString: minutesToTime(mins),
      isHour: mins % 60 === 0,
    })
  }

  return slots
}

/**
 * Calculates top offset and height for a routine item inside a day column
 */
export function getRoutineStyle(
  startTime: string,
  endTime: string,
  slotHeight: number = SLOT_HEIGHT
): { top: number; height: number } {
  const baseMinutes = START_HOUR * 60
  const start = Math.max(baseMinutes, timeToMinutes(startTime))
  const end = Math.min(END_HOUR * 60, Math.max(start + 15, timeToMinutes(endTime)))

  const top = ((start - baseMinutes) / SLOT_MINUTES) * slotHeight
  const durationMinutes = Math.max(25, end - start)
  const height = (durationMinutes / SLOT_MINUTES) * slotHeight

  return { top, height }
}

export interface DayColumnDate {
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 7
  date: Date
  displayDate: string // "DD/MM"
  fullDateString: string // "YYYY-MM-DD"
  isToday: boolean
  dateRelation: 'past' | 'today' | 'future'
}

export interface WeekRange {
  startDate: Date
  endDate: Date
  formattedRange: string
  weekNumber: number
  days: DayColumnDate[]
}

/**
 * Gets the week details (Monday to Sunday) for any given date
 */
export function getWeekDetails(targetDate: Date = new Date()): WeekRange {
  const current = new Date(targetDate)
  current.setHours(0, 0, 0, 0)

  // In JS: 0 = Sun, 1 = Mon, ..., 6 = Sat
  const day = current.getDay()
  // Distance to Monday: if Sunday (0), distance is -6; else 1 - day
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(current)
  monday.setDate(current.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const days: DayColumnDate[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const fullDateString = formatToLocalDateString(d)
    const dateRelation = compareDateWithToday(fullDateString)

    days.push({
      dayOfWeek: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      date: d,
      displayDate: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      fullDateString,
      isToday: dateRelation === 'today',
      dateRelation,
    })
  }

  // Calculate approximate ISO week number
  const firstJan = new Date(monday.getFullYear(), 0, 1)
  const pastDaysOfYear = (monday.getTime() - firstJan.getTime()) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + firstJan.getDay() + 1) / 7)

  const formatShort = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`

  return {
    startDate: monday,
    endDate: sunday,
    formattedRange: `${formatShort(monday)} – ${formatShort(sunday)}, ${sunday.getFullYear()}`,
    weekNumber,
    days,
  }
}
