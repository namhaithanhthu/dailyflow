export interface DayInfo {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7
  shortName: string
  fullName: string
}

export const DAYS_OF_WEEK: DayInfo[] = [
  { id: 1, shortName: 'T2', fullName: 'Thứ Hai' },
  { id: 2, shortName: 'T3', fullName: 'Thứ Ba' },
  { id: 3, shortName: 'T4', fullName: 'Thứ Tư' },
  { id: 4, shortName: 'T5', fullName: 'Thứ Năm' },
  { id: 5, shortName: 'T6', fullName: 'Thứ Sáu' },
  { id: 6, shortName: 'T7', fullName: 'Thứ Bảy' },
  { id: 7, shortName: 'CN', fullName: 'Chủ Nhật' },
]
