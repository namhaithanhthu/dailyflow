/**
 * Timezone-safe date utilities for DailyFlow
 * Always works with local calendar dates to avoid timezone shift bugs.
 */

/**
 * Returns "YYYY-MM-DD" in local timezone
 */
export function formatToLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Gets today's date string in "YYYY-MM-DD"
 */
export function getTodayDateString(): string {
  return formatToLocalDateString(new Date())
}

/**
 * Converts a "YYYY-MM-DD" string into a local Date object at midnight (00:00:00)
 */
export function parseLocalDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 0, 0, 0, 0)
}

/**
 * Converts day of week from JS (0: Sun, 1: Mon, ..., 6: Sat) to 1: Mon ... 7: Sun
 */
export function getDayOfWeekNumber(date: Date = new Date()): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

/**
 * Compares a "YYYY-MM-DD" string with today's local date
 */
export function compareDateWithToday(dateStr: string): 'past' | 'today' | 'future' {
  const todayStr = getTodayDateString()
  if (dateStr === todayStr) return 'today'
  if (dateStr < todayStr) return 'past'
  return 'future'
}

/**
 * Formats a Date into standard Vietnamese format: e.g. "Thứ Hai, 23/11/2026"
 */
export function formatVietnameseDate(date: Date = new Date()): string {
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  return `${dayNames[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
